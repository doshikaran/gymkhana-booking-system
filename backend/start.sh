#!/bin/bash
set -e

# echo "🔧 Running migrations..."
# alembic upgrade head || python3 -m app.init_db

echo "🚀 Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
