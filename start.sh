#!/bin/bash

# Trace Development Server Starter

echo "Starting Trace - Journaling Companion"
echo "=============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found!"
    echo "Please create a .env file with your GEMINI_API_KEY"
    echo "You can copy from .env.example: cp .env.example .env"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

# Start backend
echo "Starting backend server..."
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Failed to start backend"
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"

# Start frontend
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo "✅ Frontend starting..."
echo ""
echo "=============================================="
echo "🌐 Open http://localhost:3000 in your browser"
echo "=============================================="
echo ""

# Wait for both processes
wait
