#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const path = require("path");

const PROJECT_DIR = __dirname;
const PORT = 6001;
const APP_URL = `http://localhost:${PORT}`;

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
teacher — Teacher AI dev launcher

Usage:
  teacher              Start Next.js (port ${PORT})
  teacher --status     Check if the dev server is running
  teacher --help       Show this help
`);
  process.exit(0);
}

if (args.includes("--status")) {
  try {
    execSync(`lsof -ti:${PORT}`, { stdio: "pipe" });
    console.log(`✅ Running at ${APP_URL}`);
  } catch {
    console.log(`❌ Not running on port ${PORT}`);
  }
  process.exit(0);
}

try {
  execSync(`lsof -ti:${PORT}`, { stdio: "pipe" });
  console.log(`✅ Already running — opening ${APP_URL}`);
  execSync(`open ${APP_URL}`);
  process.exit(0);
} catch {
  // not running, start it
}

console.log(`🚀 Starting Teacher at ${APP_URL}...`);

const dev = spawn("npm", ["run", "dev"], {
  cwd: PROJECT_DIR,
  stdio: "inherit",
});

dev.on("exit", (code) => process.exit(code ?? 0));

// Open browser once server is ready
let opened = false;
const check = setInterval(() => {
  try {
    execSync(`lsof -ti:${PORT}`, { stdio: "pipe" });
    if (!opened) {
      opened = true;
      clearInterval(check);
      execSync(`open ${APP_URL}`);
    }
  } catch {
    // not ready yet
  }
}, 500);
