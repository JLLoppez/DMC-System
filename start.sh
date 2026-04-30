#!/bin/bash
# DMC System Startup Script

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   DMC System — Digital Mgmt Consultant   ║"
echo "║   MVP v1.0.0                             ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✓ Starting backend..."
cd backend
pip install -r requirements.txt -q
python app.py &
BACKEND_PID=$!
echo "  Backend running on http://localhost:5000 (PID: $BACKEND_PID)"

sleep 2

echo "✓ Starting frontend..."
cd ../frontend
npm install --silent
npm start &
FRONTEND_PID=$!
echo "  Frontend running on http://localhost:3000 (PID: $FRONTEND_PID)"

echo ""
echo "✓ DMC System is starting..."
echo "  Open http://localhost:3000 in your browser"
echo ""
echo "  Press Ctrl+C to stop all services"
echo ""

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
wait
