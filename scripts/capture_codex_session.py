#!/usr/bin/env python3
"""Export completed Codex turns into assignment session logs.

The Codex desktop app persists thread metadata and turn history in local SQLite
databases. This script reads those stores after each turn and appends only the
first user prompt and final assistant response for matching workspace threads.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CAPTURE_CWD = Path(r"D:\amazon_clone")
CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
THREAD_HISTORY_DB = CODEX_HOME / "thread_history_1.sqlite"
STATE_DB = CODEX_HOME / "state_5.sqlite"


def utc_from_seconds(value: int | None) -> str:
    if value is None:
        return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    return datetime.fromtimestamp(value, timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def read_json(value: str) -> dict[str, Any]:
    data = json.loads(value)
    if not isinstance(data, dict):
        raise ValueError("Expected JSON object")
    return data


def item_text(item: dict[str, Any]) -> str:
    if isinstance(item.get("text"), str):
        return item["text"]

    content = item.get("content")
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, dict) and isinstance(block.get("text"), str):
                parts.append(block["text"])
        return "\n".join(parts)

    return ""


def slug_date(timestamp: str) -> str:
    return timestamp[:10]


def compact_session(session_id: str) -> str:
    return session_id.split("-")[0] if "-" in session_id else session_id[:8]


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"captured_turns": []}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"captured_turns": []}


def save_state(path: Path, state: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def thread_rows(capture_cwd: Path) -> dict[str, sqlite3.Row]:
    con = sqlite3.connect(STATE_DB)
    con.row_factory = sqlite3.Row
    try:
        rows = con.execute(
            """
            SELECT id, cwd, title, name, model, created_at, updated_at
            FROM threads
            ORDER BY updated_at DESC
            """,
        ).fetchall()
        target = normalize_windows_path(str(capture_cwd))
        return {row["id"]: row for row in rows if normalize_windows_path(row["cwd"]) == target}
    finally:
        con.close()


def normalize_windows_path(value: str) -> str:
    normalized = value
    if normalized.startswith("\\\\?\\"):
        normalized = normalized[4:]
    return normalized.rstrip("\\/").lower()


def completed_turns(thread_ids: list[str], captured: set[str]) -> list[sqlite3.Row]:
    if not thread_ids:
        return []

    placeholders = ",".join("?" for _ in thread_ids)
    params: list[Any] = list(thread_ids)
    query = f"""
        SELECT thread_id, turn_id, started_at, completed_at, first_user_item_id, final_agent_item_id
        FROM thread_turns
        WHERE status = 'completed'
          AND final_agent_item_id IS NOT NULL
          AND thread_id IN ({placeholders})
        ORDER BY completed_at ASC, started_at ASC
    """

    con = sqlite3.connect(THREAD_HISTORY_DB)
    con.row_factory = sqlite3.Row
    try:
        rows = con.execute(query, params).fetchall()
        return [row for row in rows if f"{row['thread_id']}:{row['turn_id']}" not in captured]
    finally:
        con.close()


def load_turn_items(turn: sqlite3.Row) -> tuple[dict[str, Any], dict[str, Any]]:
    con = sqlite3.connect(THREAD_HISTORY_DB)
    con.row_factory = sqlite3.Row
    try:
        rows = con.execute(
            """
            SELECT item_id, item_type, item_json
            FROM thread_items
            WHERE thread_id = ?
              AND turn_id = ?
            ORDER BY rollout_ordinal ASC, created_at_ms ASC
            """,
            (turn["thread_id"], turn["turn_id"]),
        ).fetchall()
    finally:
        con.close()

    by_id = {row["item_id"]: read_json(row["item_json"]) for row in rows}
    user_item_id = turn["first_user_item_id"]
    if user_item_id is None:
        user_item_id = next((row["item_id"] for row in rows if row["item_type"] == "userMessage"), None)

    if user_item_id is not None:
        user_item = by_id[user_item_id]
    else:
        user_item = delegation_input_item(rows)

    if user_item is None:
        raise KeyError("No prompt item found for completed turn")

    return user_item, by_id[turn["final_agent_item_id"]]


def delegation_input_item(rows: list[sqlite3.Row]) -> dict[str, Any] | None:
    for row in rows:
        if row["item_type"] != "functionCallOutput":
            continue
        data = read_json(row["item_json"])
        output = data.get("output")
        if not isinstance(output, str):
            continue
        match = re.search(r"<input>(.*?)</input>", output, flags=re.DOTALL)
        if match:
            return {"type": "userMessage", "text": match.group(1).strip()}
    return None


def log_path(log_dir: Path, first_prompt_time: str, thread_id: str) -> Path:
    stamp = first_prompt_time.replace(":", "-").replace("T", "_")[:19]
    return log_dir / f"{stamp}_{thread_id}.md"


def render_header(
    *,
    session_id: str,
    date: str,
    author: str,
    model: str,
    tool: str,
    project: str,
    total_exchanges: int,
    first_prompt_time: str,
    last_prompt_time: str,
) -> str:
    compact = compact_session(session_id)
    return (
        "---\n"
        f"session_id: {session_id}\n"
        f"date: {date}\n"
        f"author: {author}\n"
        f"model: {model}\n"
        f"tool: {tool}\n"
        f"project: {project}\n"
        f"total_exchanges: {total_exchanges}\n"
        f"first_prompt_time: {first_prompt_time}\n"
        f"last_prompt_time: {last_prompt_time}\n"
        "---\n\n"
        f"# Session Log - {date}\n\n"
        f"Session: `{compact}` | Project: `{project}` | Author: `{author}`\n\n"
        "---\n\n"
    )


def split_header_and_body(existing: str) -> tuple[str, str]:
    if not existing.startswith("---\n"):
        return "", existing
    marker = "\n---\n\n# Session Log"
    idx = existing.find(marker)
    if idx == -1:
        return "", existing
    second_marker_end = existing.find("\n---\n\n", idx + 1)
    if second_marker_end == -1:
        return "", existing
    body_start = second_marker_end + len("\n---\n\n")
    return existing[:body_start], existing[body_start:]


def exchange_count(body: str) -> int:
    return body.count("[LOG_ENTRY type=PROMPT")


def append_exchange(path: Path, header: str, prompt_entry: str, response_entry: str) -> None:
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        _, body = split_header_and_body(existing)
        body = body.rstrip() + "\n\n" + prompt_entry + "\n\n" + response_entry + "\n"
    else:
        body = prompt_entry + "\n\n" + response_entry + "\n"

    path.write_text(header + body, encoding="utf-8")


def update_log_for_turn(
    *,
    log_dir: Path,
    state: dict[str, Any],
    thread: sqlite3.Row,
    turn: sqlite3.Row,
    author: str,
    project: str,
    tool: str,
    default_model: str,
) -> bool:
    user_item, agent_item = load_turn_items(turn)
    prompt = item_text(user_item).rstrip()
    response = item_text(agent_item).rstrip()
    if not prompt or not response:
        return False

    thread_id = turn["thread_id"]
    prompt_time = utc_from_seconds(turn["started_at"])
    response_time = utc_from_seconds(turn["completed_at"])
    model = thread["model"] or default_model

    sessions = state.setdefault("sessions", {})
    session = sessions.setdefault(
        thread_id,
        {
            "path": str(log_path(log_dir, prompt_time, thread_id)),
            "first_prompt_time": prompt_time,
        },
    )
    path = Path(session["path"])

    existing_body = ""
    if path.exists():
        _, existing_body = split_header_and_body(path.read_text(encoding="utf-8"))

    num = exchange_count(existing_body) + 1
    total_exchanges = num
    date = slug_date(session["first_prompt_time"])
    header = render_header(
        session_id=thread_id,
        date=date,
        author=author,
        model=model,
        tool=tool,
        project=project,
        total_exchanges=total_exchanges,
        first_prompt_time=session["first_prompt_time"],
        last_prompt_time=prompt_time,
    )

    compact = compact_session(thread_id)
    prompt_entry = (
        f"[LOG_ENTRY type=PROMPT num={num} session={compact}]\n"
        f"timestamp: {prompt_time}\n"
        f"model: {model}\n\n"
        f"{prompt}\n"
    )
    response_entry = (
        f"[LOG_ENTRY type=RESPONSE num={num} session={compact}]\n"
        f"timestamp: {response_time}\n"
        f"model: {model}\n\n"
        f"{response}\n"
    )
    append_exchange(path, header, prompt_entry, response_entry)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Capture Codex prompt/final-response pairs.")
    parser.add_argument("--project-root", default=str(DEFAULT_PROJECT_ROOT))
    parser.add_argument("--capture-cwd", default=str(DEFAULT_CAPTURE_CWD))
    parser.add_argument("--author", default="jawad")
    parser.add_argument("--project", default="8x_amazon_clone")
    parser.add_argument("--tool", default="codex-desktop")
    parser.add_argument("--model", default="gpt-5.5")
    parser.add_argument("--init-baseline", action="store_true")
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    log_dir = project_root / ".agent-logs"
    state_path = log_dir / ".codex-capture-state.json"
    state = load_state(state_path)
    captured = set(state.get("captured_turns", []))

    threads = thread_rows(Path(args.capture_cwd))
    turns = completed_turns(list(threads.keys()), captured)
    if args.init_baseline:
        state["captured_turns"] = sorted(
            captured.union(f"{turn['thread_id']}:{turn['turn_id']}" for turn in turns)
        )
        save_state(state_path, state)
        return 0

    new_captures: list[str] = []
    for turn in turns:
        key = f"{turn['thread_id']}:{turn['turn_id']}"
        try:
            captured_turn = update_log_for_turn(
                log_dir=log_dir,
                state=state,
                thread=threads[turn["thread_id"]],
                turn=turn,
                author=args.author,
                project=args.project,
                tool=args.tool,
                default_model=args.model,
            )
        except KeyError:
            captured_turn = False
        if captured_turn:
            new_captures.append(key)

    if new_captures:
        state["captured_turns"] = sorted(captured.union(new_captures))
        save_state(state_path, state)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
