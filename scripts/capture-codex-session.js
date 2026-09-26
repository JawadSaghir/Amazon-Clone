#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const LOG_DIR = path.join(PROJECT_ROOT, ".agent-logs");
const STATE_FILE = path.join(LOG_DIR, ".capture-state.json");
const PROJECT_NAME = path.basename(PROJECT_ROOT);
const AUTHOR = process.env.GITHUB_HANDLE || process.env.USERNAME || process.env.USER || "jawad";
const TOOL = "Codex Desktop / Codex CLI";
const MODEL = process.env.CODEX_MODEL || "gpt-5.5";

const sessionsRoot = path.join(os.homedir(), ".codex", "sessions");

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function walkJsonlFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkJsonlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".jsonl") ? [fullPath] : [];
  });
}

function findSessionFiles() {
  const fromArgs = process.argv
    .slice(2)
    .filter((arg) => arg.endsWith(".jsonl") && fs.existsSync(arg));

  const fromEnv = [
    process.env.CODEX_SESSION_FILE,
    process.env.CODEX_TRANSCRIPT_PATH,
    process.env.TRANSCRIPT_PATH,
  ].filter((arg) => arg && arg.endsWith(".jsonl") && fs.existsSync(arg));

  const discovered = walkJsonlFiles(sessionsRoot)
    .map((filePath) => ({
      filePath,
      mtimeMs: fs.statSync(filePath).mtimeMs,
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 25)
    .map(({ filePath }) => filePath);

  return [...new Set([...fromArgs, ...fromEnv, ...discovered])];
}

function getTextFromContent(content) {
  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => part?.text || part?.input_text || part?.output_text || "")
    .filter(Boolean)
    .join("\n");
}

function getUserText(item) {
  if (item.type === "event_msg" && item.payload?.type === "item_completed") {
    const completed = item.payload.item;
    if (completed?.type === "UserMessage") {
      return getTextFromContent(completed.content);
    }
  }

  if (item.type === "response_item" && item.payload?.type === "message" && item.payload.role === "user") {
    return getTextFromContent(item.payload.content);
  }

  return "";
}

function getAssistantText(item) {
  if (item.type !== "response_item" || item.payload?.type !== "message") {
    return "";
  }
  if (item.payload.role !== "assistant" || item.payload.phase === "commentary") {
    return "";
  }

  return getTextFromContent(item.payload.content);
}

function readSession(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean);
  const parsed = [];

  for (const line of lines) {
    try {
      parsed.push(JSON.parse(line));
    } catch {
      // Ignore partially written lines while Codex is still flushing.
    }
  }

  const meta = parsed.find((item) => item.type === "session_meta")?.payload;
  if (!meta?.session_id) {
    return null;
  }

  const cwd = meta.cwd ? path.resolve(meta.cwd) : "";
  const roots = Array.isArray(meta.runtime_workspace_roots) ? meta.runtime_workspace_roots.map((root) => path.resolve(root)) : [];
  const belongsToProject =
    cwd.toLowerCase().startsWith(PROJECT_ROOT.toLowerCase()) ||
    roots.some((root) => root.toLowerCase() === PROJECT_ROOT.toLowerCase());

  if (!belongsToProject) {
    return null;
  }

  const turns = new Map();
  for (const item of parsed) {
    const turnId =
      item.payload?.turn_id ||
      item.payload?.internal_chat_message_metadata_passthrough?.turn_id ||
      item.payload?.item?.turn_id;

    if (!turnId) {
      continue;
    }

    const existing = turns.get(turnId) || { turnId, prompt: "", promptTime: "", response: "", responseTime: "" };
    const userText = getUserText(item);
    if (userText) {
      existing.prompt = userText;
      existing.promptTime = item.timestamp || existing.promptTime;
    }

    const assistantText = getAssistantText(item);
    if (assistantText) {
      existing.response = assistantText;
      existing.responseTime = item.timestamp || existing.responseTime;
    }

    turns.set(turnId, existing);
  }

  const exchanges = Array.from(turns.values()).filter((turn) => turn.prompt && turn.response);
  if (exchanges.length === 0) {
    return null;
  }

  return {
    filePath,
    sessionId: meta.session_id,
    startedAt: meta.timestamp || exchanges[0].promptTime,
    model: meta.model || MODEL,
    exchanges,
  };
}

function dateParts(isoTimestamp) {
  const date = new Date(isoTimestamp);
  const pad = (number) => String(number).padStart(2, "0");
  return {
    date: date.toISOString().slice(0, 10),
    stamp: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}_${pad(date.getUTCHours())}-${pad(date.getUTCMinutes())}-${pad(date.getUTCSeconds())}`,
  };
}

function renderLog(session, exchanges) {
  const firstPrompt = exchanges[0].promptTime;
  const lastPrompt = exchanges[exchanges.length - 1].promptTime;
  const { date } = dateParts(firstPrompt);
  const shortId = session.sessionId.slice(0, 8);
  const body = exchanges
    .flatMap((exchange, index) => {
      const number = index + 1;
      return [
        `[LOG_ENTRY type=PROMPT num=${number} session=${shortId}]`,
        `timestamp: ${exchange.promptTime}`,
        `model: ${session.model || MODEL}`,
        "",
        exchange.prompt,
        "",
        "",
        `[LOG_ENTRY type=RESPONSE num=${number} session=${shortId}]`,
        `timestamp: ${exchange.responseTime}`,
        `model: ${session.model || MODEL}`,
        "",
        exchange.response,
        "",
      ].join("\n");
    })
    .join("\n");

  return [
    "---",
    `session_id: ${session.sessionId}`,
    `date: ${date}`,
    `author: ${AUTHOR}`,
    `model: ${session.model || MODEL}`,
    `tool: ${TOOL}`,
    `project: ${PROJECT_NAME}`,
    `total_exchanges: ${exchanges.length}`,
    `first_prompt_time: ${firstPrompt}`,
    `last_prompt_time: ${lastPrompt}`,
    "---",
    "",
    `# Session Log - ${date}`,
    "",
    `Session: \`${shortId}\` | Project: \`${PROJECT_NAME}\` | Author: \`${AUTHOR}\``,
    "",
    "---",
    "",
    body,
  ].join("\n");
}

function main() {
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const state = readJson(STATE_FILE, { sessions: {} });
  let wrote = false;

  for (const filePath of findSessionFiles()) {
    const session = readSession(filePath);
    if (!session) {
      continue;
    }

    const previousCount = state.sessions[session.sessionId]?.totalExchanges || 0;
    if (session.exchanges.length <= previousCount) {
      continue;
    }

    const { stamp } = dateParts(session.exchanges[0].promptTime);
    const shortId = session.sessionId.slice(0, 8);
    const outputFile = path.join(LOG_DIR, `${stamp}_${shortId}.md`);
    fs.writeFileSync(outputFile, renderLog(session, session.exchanges));

    state.sessions[session.sessionId] = {
      totalExchanges: session.exchanges.length,
      logFile: path.relative(PROJECT_ROOT, outputFile).replace(/\\/g, "/"),
      updatedAt: new Date().toISOString(),
    };
    wrote = true;
  }

  if (wrote) {
    writeJson(STATE_FILE, state);
  }
}

main();
