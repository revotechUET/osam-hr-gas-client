const fs = require('fs').promises;
const runAll = require("npm-run-all");

const CONFIG_PATH = './config/index.js';
const CONFIGS = [
  './config/local.js',
  './config/default.js',
];
const CLASP_PATH = '.clasp.json';
const CLASP_CONFIGS = [
  '.clasp-local.json',
  '.clasp-default.json',
]
async function start() {
  for (const filePath of CONFIGS) {
    try {
      await fs.access(filePath);
      await fs.copyFile(filePath, CONFIG_PATH);
      break;
    } catch (e) { }
  }
  for (const filePath of CLASP_CONFIGS) {
    try {
      await fs.access(filePath);
      await fs.copyFile(filePath, CLASP_PATH);
      break;
    } catch (e) { }
  }
  runAll(["build", "push"], {
    parallel: true,
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
  });
}

start();
