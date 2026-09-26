#!/usr/bin/env bash
set -euo pipefail

APP_PORT="${PORT:-3001}"
APP_URL="http://localhost:${APP_PORT}"

cd "$(dirname "$0")"

echo "Starting 8x Bazaar services..."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed or is not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed or is not on PATH."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
fi

echo "Preparing Prisma client..."
npm run prisma:generate

if command -v mongosh >/dev/null 2>&1; then
  if mongosh "mongodb://127.0.0.1:27017/8x-marketplace" --quiet --eval "db.runCommand({ ping: 1 }).ok" | grep -q "1"; then
    PRODUCT_COUNT="$(mongosh "mongodb://127.0.0.1:27017/8x-marketplace" --quiet --eval "db.Product.countDocuments()")"
    if [ "${PRODUCT_COUNT:-0}" = "0" ]; then
      echo "MongoDB is running and empty. Seeding product catalog..."
      npm run db:seed-dummyjson
    else
      echo "MongoDB is running with ${PRODUCT_COUNT} products. Skipping seed."
    fi
  else
    echo "MongoDB is not reachable. The app will use the bundled product catalog fallback."
  fi
elif command -v mongo >/dev/null 2>&1; then
  if mongo "mongodb://127.0.0.1:27017/8x-marketplace" --quiet --eval "db.runCommand({ ping: 1 }).ok" | grep -q "1"; then
    PRODUCT_COUNT="$(mongo "mongodb://127.0.0.1:27017/8x-marketplace" --quiet --eval "db.Product.countDocuments()")"
    if [ "${PRODUCT_COUNT:-0}" = "0" ]; then
      echo "MongoDB is running and empty. Seeding product catalog..."
      npm run db:seed-dummyjson
    else
      echo "MongoDB is running with ${PRODUCT_COUNT} products. Skipping seed."
    fi
  else
    echo "MongoDB is not reachable. The app will use the bundled product catalog fallback."
  fi
else
  echo "MongoDB shell was not found. Skipping database seed and using fallback catalog if needed."
fi

echo "Starting 8x Bazaar at ${APP_URL}"
echo "Press Ctrl+C to stop the app."
npm run dev -- -p "${APP_PORT}"
