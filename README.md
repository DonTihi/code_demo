# Claude Code Agent Demo

A tiny Flask application designed for a live demonstration of agentic software development with Claude Code.

The calculator supports addition, subtraction, multiplication and division (`+`, `-`, `*`, `/`). It rejects invalid numbers and division by zero with a clear error message.

It looks and works like a pocket calculator: a single display line, a 0–9 keypad, operator keys, `C`, `⌫`, `±` and a red `=` key. The physical keyboard works too (digits, `+ - * /`, `Enter`, `Backspace`, `Esc`).

Operators can be chained, just like on a real calculator: `6 + 2 + 3 =` computes left to right (`8`, then `11`) instead of requiring one operator per calculation. Only the final pending pair of numbers is sent to the server; earlier steps in the chain are computed in the browser so the running total can be shown as you type. **Without JavaScript**, a simpler fallback form (two number fields and an operator choice, one calculation at a time) is shown instead.

## What the demo shows

1. Claude Code receives a normal development request.
2. It explores the repository instead of being given the exact file.
3. It uses project instructions from `CLAUDE.md`.
4. It can use a local MCP server for project-specific context.
5. It edits the code.
6. It runs the existing tests.
7. It reviews the Git diff.
8. It commits the change.

## Demo request

> Change the Calculate button from blue to red. Keep the existing behavior unchanged. Add or update tests if necessary, run the tests, and commit the change.

## Run the application

Create a virtual environment and install dependencies:

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Run the app:

```powershell
python -m app
```

Open http://127.0.0.1:5000 in a browser.

## Project layout

```text
app/
  __init__.py        application factory (create_app)
  __main__.py        entry point for `python -m app`
  calculator.py      input parsing and the + - * / operations
  routes.py          Flask routes
  templates/         HTML templates
  static/            CSS and the keypad script (calculator.js)
tests/               pytest tests (fixtures in conftest.py)
  js/                Node.js tests for the keypad logic
mcp_server/          local MCP server for project context
```

## Run tests

```powershell
pytest
```

`pytest` also runs the keypad JavaScript tests when Node.js is installed (otherwise that test is skipped). To run them directly:

```powershell
node --test tests/js/calculator.test.js
```

## MCP

The project includes a local MCP server in `mcp_server/server.py`. Claude Code can launch it over stdio using the project `.mcp.json` configuration.

Check the server:

```powershell
claude mcp list
```

Inside Claude Code, use `/mcp` to inspect the connection and available tools.

## Git

The demo should end with a normal Git commit containing the UI change.
