#!/bin/bash

# MoneyMgr Dashboard Startup Script
# Starts both frontend and backend development servers

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         MoneyMgr Dashboard Startup                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if frontend exists
if [ ! -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  Frontend directory not found!${NC}"
    echo "Run this script from the project root directory."
    exit 1
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# Start Frontend
echo -e "${GREEN}▶ Starting Frontend (Vite)...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  Installing frontend dependencies...${NC}"
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "  ${BLUE}→ Frontend running at http://localhost:5173${NC}"
echo ""

# Check if backend exists and start it
if [ -d "backend" ] && [ -f "backend/main.py" ]; then
    echo -e "${GREEN}▶ Starting Backend (FastAPI)...${NC}"
    cd backend

    # Check for virtual environment
    if [ -d ".venv" ]; then
        source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate
    fi

    # Check for uvicorn
    if command -v uvicorn &> /dev/null; then
        uvicorn main:app --reload --port 8000 &
        BACKEND_PID=$!
        echo -e "  ${BLUE}→ Backend running at http://localhost:8000${NC}"
        echo -e "  ${BLUE}→ API docs at http://localhost:8000/docs${NC}"
    elif command -v python &> /dev/null; then
        python -m uvicorn main:app --reload --port 8000 &
        BACKEND_PID=$!
        echo -e "  ${BLUE}→ Backend running at http://localhost:8000${NC}"
        echo -e "  ${BLUE}→ API docs at http://localhost:8000/docs${NC}"
    else
        echo -e "${YELLOW}⚠️  Python/uvicorn not found. Skipping backend startup.${NC}"
        echo "   The frontend will use mock data."
        BACKEND_PID=$FRONTEND_PID  # Dummy assignment
    fi
    cd ..
else
    echo -e "${YELLOW}⚠️  Backend not found. Frontend will use mock data.${NC}"
    BACKEND_PID=$FRONTEND_PID  # Dummy assignment
fi

echo ""
echo -e "${GREEN}═════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Dashboard is ready!${NC}"
echo -e "${GREEN}  Open http://localhost:5173 in your browser${NC}"
echo -e "${GREEN}═════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for both processes

wait