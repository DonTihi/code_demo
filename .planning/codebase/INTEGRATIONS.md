# External Integrations

**Analysis Date:** 2026-09-29

## APIs & External Services

**Model Context Protocol (MCP):**
- Service: MCP (Model Context Protocol) local server
  - SDK/Client: `mcp[cli]` package, `mcp.server.fastmcp.FastMCP` class
  - Purpose: Exposes project context and demo request to Claude Code
  - Implementation: `mcp_server/server.py`
  - Tools provided: `get_project_context()`, `get_demo_request()`

**No Third-Party APIs Detected:**
- This application does not integrate with external calculation or computation APIs
- Calculator operations are performed server-side in `app/calculator.py` using Python's built-in math operations

## Data Storage

**Databases:**
- Not applicable - This is a stateless calculator with no persistent storage

**File Storage:**
- Local filesystem only - Static files served from `app/static/` and templates from `app/templates/`
- No cloud storage (S3, Azure Blob, etc.)

**Caching:**
- Not detected - No caching layer (Redis, Memcached)

**Session Management:**
- None - Stateless HTTP requests only; each calculation is independent

## Authentication & Identity

**Auth Provider:**
- None - Application requires no authentication
- No login, user accounts, or access control

## Monitoring & Observability

**Error Tracking:**
- None - No Sentry, Rollbar, or similar integration

**Logs:**
- Console output via Flask's default logging
- No structured logging service
- Development mode shows debug traces; production mode would require separate logging setup

**Metrics:**
- None - No Prometheus, DataDog, or similar

## CI/CD & Deployment

**Hosting:**
- Not configured - Application designed for local development demonstration
- Can be deployed to any Python web hosting (Heroku, PythonAnywhere, AWS, etc.)
- Requires WSGI-compatible application server (Gunicorn, waitress, uWSGI)

**CI Pipeline:**
- None configured - No GitHub Actions, GitLab CI, or other automated pipelines
- Manual test execution via `pytest` command

**Deployment Configuration:**
- No `Dockerfile` or container configuration
- No deployment scripts or configuration management

## Environment Configuration

**Required env vars:**
- None required - Application runs with defaults
- `.env` file listed in `.gitignore` but not used or required

**Secrets location:**
- Not applicable - No API keys, credentials, or secrets in this application
- `.env` and `.env.*` patterns listed in `.gitignore` for potential future use

## Webhooks & Callbacks

**Incoming:**
- None - Application does not receive webhooks

**Outgoing:**
- None - Application does not trigger external webhooks

## MCP Server Configuration

**File:** `.mcp.json`
- Runs local MCP server via `.venv/Scripts/python.exe mcp_server/server.py`
- Provides project-specific tools to Claude Code for agentic development
- No external MCP servers configured

---

*Integration audit: 2026-09-29*
