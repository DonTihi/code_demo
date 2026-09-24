# Claude Code Agent Demo

## Project

This is a deliberately small Flask application used to demonstrate agentic software development.

## Architecture

- `app/__init__.py` contains the `create_app` application factory.
- `app/calculator.py` contains application logic: input parsing and the four operations (`+`, `-`, `*`, `/`) behind `calculate()`.
- `app/routes.py` contains the Flask routes.
- `app/templates/index.html` contains the page markup.
- `app/static/style.css` contains the UI styling.
- `app/static/calculator.js` drives the on-screen keypad and the single-line display. It supports chaining operators (like a real calculator); only the final pending pair of numbers is sent to the server, which remains the source of truth for that calculation.
- `tests/` contains pytest tests; shared fixtures live in `tests/conftest.py`.
- `tests/js/` contains Node.js unit tests for the keypad logic; `pytest` runs them when Node.js is installed.
- `pyproject.toml` contains the pytest configuration.
- `mcp_server/server.py` exposes project context through MCP.

## Engineering rules

- Keep changes minimal and focused on the requested task.
- Do not change application behavior when making UI changes.
- Do not modify tests merely to make failing tests pass.
- Add or update tests when the requested behavior actually requires it.
- Always run `pytest` after code changes.
- Inspect `git diff` before committing.
- Never commit secrets, API keys, tokens, or credentials.

## Standard verification

```bash
pytest
```

## Demo task

The standard live demonstration request is:

> Change the Calculate button from blue to red. Keep the existing behavior unchanged. Add or update tests if necessary, run the tests, and commit the change.
