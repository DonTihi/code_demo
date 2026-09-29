# Technology Stack

**Analysis Date:** 2026-09-29

## Languages

**Primary:**
- Python 3.14.7 - Backend logic, application factory, routes, and calculator operations
- JavaScript (vanilla) - Frontend interactivity, keypad logic, and display management (in `app/static/calculator.js`)
- HTML5 - Page markup (in `app/templates/index.html`)
- CSS3 - Styling and theming (in `app/static/style.css`)

**Secondary:**
- Node.js - JavaScript test execution (optional, for `tests/js/`)

## Runtime

**Environment:**
- Python 3.14.7
- CPython

**Package Manager:**
- pip
- Lockfile: Not used (using version constraints in `requirements.txt`)

## Frameworks

**Core:**
- Flask 3.0–3.x - Web framework for routing, template rendering, and HTTP request handling

**Testing:**
- pytest 8.x–9.x - Test runner and assertion framework
- pytest-cov - Coverage reporting for Python code
- Node.js built-in test runner - JavaScript unit tests (when Node.js is installed)

**Build/Dev:**
- None detected (development via direct Python execution)

## Key Dependencies

**Critical:**
- Flask >= 3.0, < 4 - Web framework for HTTP routes and template rendering
- pytest >= 8, < 10 - Test runner with 100% coverage requirement
- pytest-cov - Coverage analysis; enforces `fail_under = 100` in `pyproject.toml`
- mcp[cli] < 2 - Model Context Protocol for exposing project context via `mcp_server/server.py`

**Infrastructure:**
- None detected (stateless application with no database or persistence)

## Configuration

**Environment:**
- Configuration via Python dicts passed to `create_app()` in `app/__init__.py`
- Test mode enabled via `{"TESTING": True}` in `tests/conftest.py`
- Debug mode enabled when running `python -m app`

**Build:**
- `pyproject.toml`: Pytest configuration, coverage settings (`testpaths`, `pythonpath`, `--cov`, `fail_under = 100`)
- No build tools (application runs directly from source)

## Platform Requirements

**Development:**
- Python 3.14.7 or compatible
- pip (included with Python)
- Virtual environment (`.venv/`)
- Node.js (optional; skipped if not available)
- Git

**Production:**
- Python 3.14.7 or compatible runtime
- Flask application server (e.g., Gunicorn, waitress)
- HTTP/HTTPS reverse proxy (recommended)

## Static Files

**Location:** `app/static/`
- `calculator.js` - Keypad interaction, operator chaining, single-line display
- `style.css` - UI styling with dark/light theme support
- `theme.js` - Theme toggle functionality

**Location:** `app/templates/`
- `index.html` - HTML page structure with fallback form for no-JavaScript scenarios

---

*Stack analysis: 2026-09-29*
