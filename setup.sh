#!/bin/bash

# BoardWall Quick Setup Script
# This script sets up the entire BoardWall project

set -e

echo "🚀 BoardWall Quick Setup"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 20+ and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker is not installed. You'll need to run PostgreSQL manually.${NC}"
    DOCKER_AVAILABLE=false
else
    echo -e "${GREEN}✓ Docker found: $(docker --version)${NC}"
    DOCKER_AVAILABLE=true
fi

echo ""
echo "📦 Installing Dependencies..."
echo ""

# Backend setup
echo "Setting up backend..."
cd backend
cp .env.example .env
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

cd ..

# Frontend setup
echo ""
echo "Setting up frontend..."
cd frontend
cp .env.example .env
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "1. Start services with Docker:"
    echo "   ${GREEN}docker-compose up -d${NC}"
    echo ""
    echo "2. Run database migrations:"
    echo "   ${GREEN}cd backend && npm run prisma:migrate${NC}"
    echo ""
    echo "3. Seed the database:"
    echo "   ${GREEN}npm run prisma:seed${NC}"
    echo ""
    echo "4. Access the application:"
    echo "   Frontend: ${GREEN}http://localhost:3000${NC}"
    echo "   Backend:  ${GREEN}http://localhost:3001${NC}"
    echo "   API Docs: ${GREEN}http://localhost:3001/api${NC}"
else
    echo "1. Start PostgreSQL database"
    echo ""
    echo "2. Update backend/.env with your database URL"
    echo ""
    echo "3. Run database migrations:"
    echo "   ${GREEN}cd backend && npm run prisma:migrate${NC}"
    echo ""
    echo "4. Seed the database:"
    echo "   ${GREEN}npm run prisma:seed${NC}"
    echo ""
    echo "5. Start backend (in one terminal):"
    echo "   ${GREEN}cd backend && npm run start:dev${NC}"
    echo ""
    echo "6. Start frontend (in another terminal):"
    echo "   ${GREEN}cd frontend && npm run dev${NC}"
    echo ""
    echo "7. Access the application:"
    echo "   Frontend: ${GREEN}http://localhost:3000${NC}"
    echo "   Backend:  ${GREEN}http://localhost:3001${NC}"
fi

echo ""
echo "📚 Demo Credentials:"
echo "   Email: ${GREEN}admin@boardwall.com${NC}"
echo "   Password: ${GREEN}password123${NC}"
echo ""
echo "📖 For more information, check README.md"
echo ""