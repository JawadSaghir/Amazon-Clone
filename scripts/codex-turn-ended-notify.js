#!/usr/bin/env node

const { spawnSync } = require("child_process");
const path = require("path");

const captureScript = path.join(__dirname, "capture-codex-session.js");
const originalNotify = "C:\\Users\\jawad\\AppData\\Local\\OpenAI\\Codex\\runtimes\\cua_node\\13827bafdc0b5422\\bin\\node_modules\\@oai\\sky\\bin\\windows\\codex-computer-use.exe";
const forwardedArgs = process.argv.slice(2);

let stdin = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  stdin += chunk;
});

process.stdin.on("end", () => {
  const capture = spawnSync(process.execPath, [captureScript], {
    input: stdin,
    encoding: "utf8",
    env: process.env,
    cwd: path.resolve(__dirname, ".."),
  });

  if (capture.stderr) {
    process.stderr.write(capture.stderr);
  }

  const notify = spawnSync(originalNotify, forwardedArgs, {
    input: stdin,
    encoding: "utf8",
    env: process.env,
    cwd: process.cwd(),
    stdio: ["pipe", "inherit", "inherit"],
  });

  if (capture.error || notify.error) {
    process.exitCode = 1;
    return;
  }

  process.exitCode = notify.status || capture.status || 0;
});
