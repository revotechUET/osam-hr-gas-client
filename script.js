const runAll = require("npm-run-all");

runAll(["build --- -w", "push -- -w -f"], {
  parallel: true,
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
});
