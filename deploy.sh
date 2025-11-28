#!/bin/bash

# Image name
IMAGE_NAME="dirmich/highmaru-chat"
TAG="latest"

echo "🚀 Starting deployment process for $IMAGE_NAME:$TAG..."

# 1. Build the Docker image
echo "📦 Building Docker image..."
# Use --platform linux/amd64 if deploying to a standard Linux server from a Mac M1/M2
# docker build --platform linux/amd64 -t $IMAGE_NAME:$TAG .
docker build -t $IMAGE_NAME:$TAG .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 2. Push to Docker Hub
echo "⬆️  Pushing image to Docker Hub..."
docker push $IMAGE_NAME:$TAG

if [ $? -ne 0 ]; then
    echo "❌ Push failed! Make sure you are logged in (run 'docker login')."
    exit 1
fi

echo "✅ Successfully built and pushed $IMAGE_NAME:$TAG"
