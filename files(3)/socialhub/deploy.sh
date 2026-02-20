#!/bin/bash

echo "================================"
echo "  Novinar App - Quick Deploy"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker nije instaliran. Instaliraj Docker Desktop prvo."
    echo "   Download: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env ne postoji. Kopiram template..."
    cp .env.example backend/.env
    echo "✅ Kopirano! Edituj backend/.env sa svojim MongoDB URI!"
    echo ""
    read -p "Press Enter kada editiraš .env fajl..."
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env
    echo "✅ Frontend .env kreiran"
fi

echo ""
echo "🐳 Pokrećem Docker containers..."
echo ""

docker-compose up -d

echo ""
echo "✅ Aplikacija pokrenuta!"
echo ""
echo "📱 Frontend: http://localhost"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "📊 Logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Zaustavljanje:"
echo "   docker-compose down"
echo ""
