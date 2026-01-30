#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit

pip install -r requirements.txt

# Run database migrations only if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    alembic upgrade head
else
    echo "DATABASE_URL not set, skipping migrations"
fi
