from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Real Estate AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class PropertyDescriptionRequest(BaseModel):
    property_type: str
    listing_type: str
    bedrooms: int
    bathrooms: int
    area: float
    area_unit: str
    location: str
    amenities: List[str] = []


class PriceEstimateRequest(BaseModel):
    property_type: str
    listing_type: str
    bedrooms: int
    bathrooms: int
    area: float
    area_unit: str
    location: str
    city: str


class ChatSearchRequest(BaseModel):
    query: str


# Health check
@app.get("/")
async def root():
    return {"status": "ok", "service": "Real Estate AI Service"}


# Generate property description
@app.post("/generate-description")
async def generate_description(request: PropertyDescriptionRequest):
    """
    Generate an attractive property description using AI
    """
    try:
        # Convert area to readable format
        area_display = f"{request.area} {request.area_unit}"
        if request.area_unit == "sqft" and request.area >= 4356:
            kanals = round(request.area / 4356, 2)
            area_display = f"{kanals} Kanal ({request.area} sqft)"
        elif request.area_unit == "sqft" and request.area >= 272.25:
            marlas = round(request.area / 272.25, 2)
            area_display = f"{marlas} Marla ({request.area} sqft)"

        # Create description based on property details
        property_label = request.property_type.capitalize()
        listing_action = "for sale" if request.listing_type == "sale" else "for rent"

        description_parts = []

        # Opening
        if request.bedrooms > 0:
            description_parts.append(
                f"Discover this stunning {request.bedrooms} bedroom {property_label} {listing_action} "
                f"in the prestigious {request.location} area."
            )
        else:
            description_parts.append(
                f"Presenting this exceptional {property_label} {listing_action} "
                f"located in the sought-after {request.location} neighborhood."
            )

        # Space details
        if request.bedrooms > 0 and request.bathrooms > 0:
            description_parts.append(
                f"This spacious property features {request.bedrooms} well-appointed bedrooms "
                f"and {request.bathrooms} modern bathrooms, spread across {area_display}."
            )
        else:
            description_parts.append(
                f"The property offers {area_display} of premium space, "
                "designed to meet the highest standards of comfort and style."
            )

        # Amenities
        if request.amenities:
            amenities_str = ", ".join(request.amenities[:5])
            description_parts.append(
                f"Premium amenities include {amenities_str}, "
                "ensuring a lifestyle of comfort and convenience."
            )

        # Location benefits
        description_parts.append(
            f"{request.location} is known for its prime location, excellent connectivity, "
            "and proximity to key facilities including schools, shopping centers, and healthcare."
        )

        # Call to action
        if request.listing_type == "sale":
            description_parts.append(
                "This is a rare opportunity to own a premium property in one of the city's "
                "most desirable locations. Schedule your viewing today!"
            )
        else:
            description_parts.append(
                "Don't miss this opportunity to experience luxury living at its finest. "
                "Contact us today to arrange a viewing!"
            )

        description = " ".join(description_parts)

        return {
            "description": description,
            "short_description": description_parts[0],
            "highlights": [
                f"{request.bedrooms} Bedrooms" if request.bedrooms > 0 else None,
                f"{request.bathrooms} Bathrooms" if request.bathrooms > 0 else None,
                f"{area_display}",
                f"Prime {request.location} Location",
                *request.amenities[:3]
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Estimate property price
@app.post("/estimate-price")
async def estimate_price(request: PriceEstimateRequest):
    """
    Estimate property price based on features
    This is a simple rule-based system. In production, use ML models.
    """
    try:
        # Base prices per sqft by city and property type (in PKR)
        base_prices = {
            "Karachi": {
                "apartment": 8000,
                "house": 12000,
                "villa": 18000,
                "plot": 15000,
                "commercial": 25000,
            },
            "Lahore": {
                "apartment": 9000,
                "house": 13000,
                "villa": 20000,
                "plot": 17000,
                "commercial": 28000,
            },
            "Islamabad": {
                "apartment": 11000,
                "house": 16000,
                "villa": 25000,
                "plot": 22000,
                "commercial": 35000,
            },
            "Rawalpindi": {
                "apartment": 7000,
                "house": 10000,
                "villa": 15000,
                "plot": 12000,
                "commercial": 20000,
            },
        }

        # Get base price
        city_prices = base_prices.get(request.city, base_prices["Karachi"])
        base_price_per_sqft = city_prices.get(request.property_type, 10000)

        # Convert area to sqft if needed
        area_sqft = request.area
        if request.area_unit == "marla":
            area_sqft = request.area * 272.25
        elif request.area_unit == "kanal":
            area_sqft = request.area * 4356
        elif request.area_unit == "sqm":
            area_sqft = request.area * 10.764

        # Calculate base price
        estimated_price = base_price_per_sqft * area_sqft

        # Adjustments
        if request.bedrooms >= 4:
            estimated_price *= 1.15
        elif request.bedrooms >= 3:
            estimated_price *= 1.1

        if request.bathrooms >= 3:
            estimated_price *= 1.08

        # For rent (monthly)
        if request.listing_type == "rent":
            estimated_price = estimated_price * 0.004  # ~0.4% of sale price

        # Price range (±15%)
        min_price = estimated_price * 0.85
        max_price = estimated_price * 1.15

        return {
            "estimated_price": round(estimated_price),
            "price_range": {
                "min": round(min_price),
                "max": round(max_price)
            },
            "price_per_sqft": round(base_price_per_sqft),
            "confidence": "medium",
            "factors": [
                f"Location: {request.location}, {request.city}",
                f"Property Type: {request.property_type}",
                f"Size: {request.area} {request.area_unit}",
                f"Bedrooms: {request.bedrooms}",
                f"Bathrooms: {request.bathrooms}"
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Search chatbot
@app.post("/search-chatbot")
async def search_chatbot(request: ChatSearchRequest):
    """
    Parse natural language search queries
    Example: "Find me a 3 bed house under 2 crore in DHA Lahore"
    """
    try:
        query = request.query.lower()

        # Extract filters from query
        filters = {}

        # Bedrooms
        for num in range(1, 11):
            if f"{num} bed" in query or f"{num}bed" in query:
                filters["bedrooms"] = num
                break

        # Property type
        property_types = ["house", "apartment", "villa", "plot", "townhouse", "commercial"]
        for ptype in property_types:
            if ptype in query:
                filters["property_type"] = ptype
                break

        # Listing type
        if "rent" in query or "rental" in query:
            filters["listing_type"] = "rent"
        elif "sale" in query or "buy" in query:
            filters["listing_type"] = "sale"

        # Price range
        if "under" in query or "below" in query:
            # Extract price
            if "crore" in query or "cr" in query:
                import re
                price_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:crore|cr)', query)
                if price_match:
                    filters["price_max"] = float(price_match.group(1)) * 10000000
            elif "lac" in query or "lakh" in query:
                import re
                price_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lac|lakh)', query)
                if price_match:
                    filters["price_max"] = float(price_match.group(1)) * 100000

        # Location
        cities = ["karachi", "lahore", "islamabad", "rawalpindi", "faisalabad", "multan"]
        for city in cities:
            if city in query:
                filters["city"] = city.capitalize()
                break

        # Famous areas
        areas = ["dha", "bahria", "clifton", "gulberg", "model town", "johar town"]
        for area in areas:
            if area in query:
                filters["location"] = area.upper() if area == "dha" else area.title()
                break

        return {
            "filters": filters,
            "query": request.query,
            "suggestions": [
                "Try: 'Show me 3 bedroom houses in DHA Lahore'",
                "Try: 'Find apartments for rent under 50 lac'",
                "Try: 'Commercial plots in Bahria Town'"
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
