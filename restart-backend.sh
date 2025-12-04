#!/bin/bash

echo "Restarting backend server with fixes..."

# Kill any existing node processes on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "No existing process on port 3001"

# Wait a moment for the port to be released
sleep 2

# Start the backend server
cd server && npm start

echo "Backend server restarted!"