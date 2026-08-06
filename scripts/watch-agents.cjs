#!/usr/bin/env node

/**
 * Watch Script for AGENTS.md
 *
 * Watches reference files and SKILL.md for changes and automatically rebuilds AGENTS.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const SKILLS_DIR = path.join(__dirname, '..', 'skills', 'composio');
const SKILL_FILE = path.join(SKILLS_DIR, 'SKILL.md');
const REFERENCES_DIR = path.join(SKILLS_DIR, 'references');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function rebuild() {
  const timestamp = new Date().toLocaleTimeString();
  log(`\n[${timestamp}] 🔄 Rebuilding AGENTS.md...`, 'yellow');

  try {
    execSync('node scripts/build-agents.cjs', { stdio: 'inherit' });
  } catch (error) {
    log('❌ Build failed', 'red');
  }
}

log('\n👀 Watching for changes...', 'cyan');
log('━'.repeat(50), 'cyan');
log(`📁 SKILL.md: ${SKILL_FILE}`, 'blue');
log(`📁 References: ${REFERENCES_DIR}`, 'blue');
log('━'.repeat(50), 'cyan');
log('Press Ctrl+C to stop\n', 'magenta');

// Initial build
rebuild();

// Watch SKILL.md
fs.watch(SKILL_FILE, (eventType, filename) => {
  if (eventType === 'change') {
    log(`\n📝 SKILL.md changed`, 'yellow');
    rebuild();
  }
});

// Watch references directory
fs.watch(REFERENCES_DIR, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.md')) {
    log(`\n📝 Reference changed: ${filename}`, 'yellow');
    rebuild();
  }
});

log('✅ Watching started successfully\n', 'green');

// Keep the process running
process.stdin.resume();
