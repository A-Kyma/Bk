#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

# Create node_modules if it doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "node_modules already exists, skipping npm install..."
fi

echo -e "\nCompiling Vue components..."
node "$ROOT_DIR/scripts/compile-vue.js"

echo -e "\n✅ Done! Vue components compiled."
