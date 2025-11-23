# Real Estate AI Service

FastAPI microservice for AI-powered features:
- Property description generation
- Price estimation
- Natural language search chatbot

## Setup

```bash
cd ai-service
pip install -r requirements.txt
```

## Run locally

```bash
python main.py
# or
uvicorn main:app --reload
```

## API Endpoints

- `POST /generate-description` - Generate property descriptions
- `POST /estimate-price` - Estimate property prices
- `POST /search-chatbot` - Parse natural language queries

## Docker

```bash
docker build -t real-estate-ai .
docker run -p 8000:8000 real-estate-ai
```

## Deploy to Railway/Render

1. Connect your GitHub repo
2. Set the root directory to `ai-service`
3. Railway/Render will auto-detect the Dockerfile
