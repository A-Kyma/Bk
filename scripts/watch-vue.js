#!/usr/bin/env node
/**
 * Watch mode for Vue compilation
 * Watches all .vue files and recompiles only the changed file
 */
import { watch } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const clientDir = join(rootDir, 'client');

// Debounce mechanism to avoid multiple compilations
const debounceTimeouts = new Map();
// Track ongoing compilations
const compilingFiles = new Map();
// Queue for pending compilations
const pendingCompilations = new Map();
const DEBOUNCE_DELAY = 1000; // 1 second

// Function to get formatted timestamp
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Function to compile a file
const compileFile = (filename, relativePath) => {
  if (compilingFiles.get(filename)) {
    console.log(`⚠️  Compilation already in progress for ${filename}, queuing...`);
    pendingCompilations.set(filename, relativePath);
    return;
  }

  compilingFiles.set(filename, true);
  console.log('🔄 Recompiling...');
  
  exec(`node "${join(__dirname, 'compile-vue.js')}" "client/${relativePath}"`, (error, stdout, stderr) => {
    compilingFiles.delete(filename);
    
    if (error) {
      console.error(`❌ Compilation error [${getTimestamp()}]:`, error);
    } else {
      if (stderr) {
        console.error(stderr);
      }
      console.log(stdout);
      console.log(`✅ Done! [${getTimestamp()}] Watching for changes...\n`);
    }
    
    // Check if there's a pending compilation for this file
    if (pendingCompilations.has(filename)) {
      const pendingPath = pendingCompilations.get(filename);
      pendingCompilations.delete(filename);
      console.log(`📋 Processing queued compilation for ${filename}...`);
      setTimeout(() => compileFile(filename, pendingPath), 100);
    }
  });
};

console.log(`🔍 Watching .vue files for changes... [${getTimestamp()}]\n`);

// Watch the client directory recursively
const watcher = watch(clientDir, { recursive: true }, (eventType, filename) => {
  if (!filename || !filename.endsWith('.vue')) return;
  
  const relativePath = relative(clientDir, join(clientDir, filename));
  const timestamp = getTimestamp();
  
  // Clear existing timeout for this file if any
  if (debounceTimeouts.has(filename)) {
    clearTimeout(debounceTimeouts.get(filename));
  }
  
  console.log(`\n📝 ${eventType} detected: ${filename} [${timestamp}]`);
  console.log(`⏳ Waiting ${DEBOUNCE_DELAY/1000}s before compilation...`);
  
  // Set new timeout
  const timeoutId = setTimeout(() => {
    debounceTimeouts.delete(filename);
    compileFile(filename, relativePath);
  }, DEBOUNCE_DELAY);
  
  debounceTimeouts.set(filename, timeoutId);
});

process.on('SIGINT', () => {
  console.log(`\n👋 Stopping watcher... [${getTimestamp()}]`);
  // Clear all pending timeouts
  debounceTimeouts.forEach(timeout => clearTimeout(timeout));
  watcher.close();
  process.exit(0);
});
