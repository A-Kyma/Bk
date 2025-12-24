#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Installing dependencies..."
cd "$ROOT_DIR"
npm install

echo -e "\nCompiling Vue components..."
node "$ROOT_DIR/scripts/compile-vue.js"

echo -e "\nCleaning up node_modules..."
rm -rf "$ROOT_DIR/node_modules"

echo -e "\n✅ Done! Vue components compiled and node_modules cleaned."
