#!/bin/bash

# Define the compose file
COMPOSE_FILE="docker-compose.yml.deploy"

echo "🚀 Starting server deployment..."

# 1. Pull the latest image
echo "⬇️  Pulling latest image..."
docker-compose -f $COMPOSE_FILE pull

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull image!"
    exit 1
fi

# 2. Restart the container
echo "🔄 Restarting container..."
docker-compose -f $COMPOSE_FILE up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container!"
    exit 1
fi

# 3. Clean up unused images (optional)
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment successful!"
