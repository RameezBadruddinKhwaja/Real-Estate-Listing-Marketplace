import { notFound } from 'next/navigation'
import { getProperty } from '@/lib/api/properties'
import Header from '@/components/layout/Header'
import ImageCarousel from '@/components/property/ImageCarousel'
import ContactForm from '@/components/property/ContactForm'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, formatArea } from '@/lib/utils'
import { Bed, Bath, Maximize2, MapPin, Calendar, Eye, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyMap from '@/components/map/PropertyMap'

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  let property

  try {
    property = await getProperty(params.id)
  } catch (error) {
    notFound()
  }

  const amenitiesList = property.amenities || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4 text-muted-foreground">
          <a href="/" className="hover:text-primary">Home</a>
          {' / '}
          <a href="/" className="hover:text-primary">Properties</a>
          {' / '}
          <span className="text-foreground">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <ImageCarousel images={property.images || []} title={property.title} />

            {/* Property Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {property.property_type}
                </Badge>
                {property.featured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {property.status}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {property.address && `${property.address}, `}
                  {property.location?.name}, {property.location?.city}
                </span>
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                {formatPrice(property.price)}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms > 0 && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Bed className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-semibold">{property.bedrooms}</p>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {property.bathrooms > 0 && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Bath className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-semibold">{property.bathrooms}</p>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Maximize2 className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-lg font-semibold">
                        {formatArea(property.area, property.area_unit)}
                      </p>
                      <p className="text-sm text-muted-foreground">Area</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Eye className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-semibold">{property.views}</p>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {amenitiesList.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Map */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <PropertyMap
                    properties={[property]}
                    selectedPropertyId={property.id}
                    height="400px"
                  />
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Property ID</p>
                      <p className="font-medium">{property.id.substring(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Property Type</p>
                      <p className="font-medium capitalize">{property.property_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Area Unit</p>
                      <p className="font-medium uppercase">{property.area_unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Listed On</p>
                      <p className="font-medium">
                        {new Date(property.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            {property.agent && (
              <ContactForm
                agent={property.agent}
                propertyId={property.id}
                propertyTitle={property.title}
              />
            )}

            {/* Share */}
            <Card>
              <CardContent className="p-6">
                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Property
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
