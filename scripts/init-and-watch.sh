#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found, installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
else
  echo "✅ node_modules already exists"
fi

echo ""
echo "🔍 Starting Vue file watcher..."
node "$ROOT_DIR/scripts/watch-vue.js"
