#!/bin/bash

# Script to start the backend server
echo "Starting backend server for Inscription Concours..."

# Check if we're in the right directory
if [ ! -f "server/index.js" ]; then
    echo "Error: server/index.js not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found."
    exit 1
fi

# Navigate to server directory and start the server
echo "Starting server on port 3001..."
cd server && npm run dev