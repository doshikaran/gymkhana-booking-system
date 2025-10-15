#!/bin/bash
set -e

# Activate the virtual environment
if [ -d "venv" ]; then
    echo "🐍 Activating virtual environment..."
    source venv/bin/activate
else
    echo "⚠️  Virtual environment not found. Please run 'python3 -m venv venv' first."
    exit 1
fi

# Run migrations (optional)
# echo "🔧 Running migrations..."
# alembic upgrade head || python3 -m app.init_db

# Start the FastAPI server
echo "🚀 Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
