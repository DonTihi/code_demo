# Phase 1 Context: Foundation & Architecture Setup

**Phase:** 1  
**Name:** Foundation & Architecture Setup  
**Status:** Completed (Retrospective)  
**Date:** 2026-09-29

## Domain

Establish a Flask-based web calculator application with clean architecture, comprehensive testing, and demonstrated readiness for agentic software development. This phase establishes the foundation that enables all subsequent calculator features and demonstrates how Claude Code can assist with software engineering while maintaining code quality and architectural clarity.

**Scope Lock:**
- Flask web framework (no alternatives)
- Python backend + vanilla JavaScript frontend
- Dual-language testing (pytest + Node.js)
- Server-rendered templates with progressive enhancement
- MCP integration for AI agent context
- Clean separation of concerns (factory, routes, logic, presentation)

## Locked Decisions

### D-001: Flask Application Factory Pattern
- **Decision:** Use `create_app(config=None)` factory in `app/__init__.py`
- **Why:** Enables flexible configuration, test isolation, and multiple app instances
- **Impact:** All initialization flows through factory; `app/__main__.py` calls `create_app()`; test fixtures use same factory
- **Evidence:** `app/__init__.py:11-20`, `app/__main__.py:4-6`, `tests/conftest.py:5-8`

### D-002: Business Logic Separation
- **Decision:** Pure functions in `app/calculator.py` isolated from routing and presentation
- **Why:** Operations testable independently; supports multiple interfaces (web, CLI, API); single responsibility
- **Impact:** No business logic in `app/routes.py`; `calculator.py` depends only on standard library
- **Evidence:** `app/calculator.py:1-61`, functions: `parse_number()`, `add()`, `subtract()`, `multiply()`, `divide()`, `calculate()`

### D-003: Routes in Dedicated Module
- **Decision:** Flask blueprint in `app/routes.py` with handlers `GET /` and `POST /calculate`
- **Why:** Separates HTTP concerns from business logic; maintainable request handling; clean app initialization
- **Impact:** All route handlers in single module; blueprint registered in factory; request validation before calling calculator
- **Evidence:** `app/routes.py:21-59`

### D-004: Client-Side State Management with Server Authority
- **Decision:** JavaScript keypad manages local state (`acc`, `op`, `entry`); server performs final calculations; client cannot bypass validation
- **Why:** Balances UX responsiveness (no server latency for display updates) with correctness (server is source of truth)
- **Impact:** Keypad logic in `calculator.js`; form submission sends only final pair (`a`, `op`, `b`); server validates and computes result
- **Evidence:** `app/static/calculator.js:75-164`, `app/routes.py:40-59`

### D-005: Dual-Language Testing Strategy
- **Decision:** pytest orchestrates both Python (unit/integration) and JavaScript (Node.js) tests
- **Why:** Language-appropriate test tooling; comprehensive validation at all layers; coverage enforcement
- **Impact:** `pytest` runs all Python tests AND invokes Node.js for `tests/js/*.test.js`; pyproject.toml configures both
- **Evidence:** `pyproject.toml:[tool.pytest.ini_options]`, `tests/test_keypad_js.py`, `tests/conftest.py`

### D-006: MCP Integration
- **Decision:** Expose project context via `mcp_server/server.py` using FastMCP
- **Why:** Enable AI agents to request project metadata without file reading; support Claude Code workflows
- **Impact:** MCP server with `get_project_context()` and `get_demo_request()` tools; configured in `.mcp.json`
- **Evidence:** `mcp_server/server.py:30-31`, `.mcp.json`

### D-007: Minimal and Focused Changes
- **Decision:** Each commit addresses one task; no scope creep; git diff must show only intentional changes
- **Why:** Reduces side effects; improves code review clarity; enables confident agent modifications
- **Impact:** Code review checklist includes "Is this minimal?"; `git diff` inspection required before commit
- **Evidence:** CLAUDE.md engineering rules, clean git history with focused commits

### D-008: UI Changes Preserve Behavior
- **Decision:** Styling, layout, theming updates never alter calculation logic or interaction patterns
- **Why:** Allows visual improvements without regression risk; behavior verified by test suite
- **Impact:** CSS-only changes tested via visual inspection; JavaScript changes for UI must not affect calculator state machine
- **Evidence:** Phase 4 (Theming) changed styles without altering operations; all tests passed

### D-009: Tests Drive Requirements
- **Decision:** Test suite reflects actual requirements; tests never modified to hide failures
- **Why:** Prevents false positives; forces clarity on what "correct" means; validates changes work
- **Impact:** Failing tests mean behavior change required; new behavior requires new tests; test suite is executable specification
- **Evidence:** CLAUDE.md engineering rules, Phase 2-4 all added tests for new features

### D-010: Always Run pytest After Changes
- **Decision:** `pytest` is mandatory after every code modification
- **Why:** Catches regressions immediately; validates all layers (unit, integration, JavaScript)
- **Impact:** Standard verification step; pre-commit workflow
- **Evidence:** CLAUDE.md engineering rules, project structure supports full test suite running in < 10 seconds

### D-011: Inspect git diff Before Commit
- **Decision:** Never commit without reviewing `git diff`; no secrets in commits
- **Why:** Code quality control; security (prevent accidental credential leaks); maintain clean history
- **Impact:** Manual review required; `.gitignore` maintenance; pre-commit hooks can enforce
- **Evidence:** CLAUDE.md engineering rules

## Code Context: Reusable Assets & Patterns

### Flask Factory Pattern
```python
# app/__init__.py
def create_app(config=None):
    app = Flask(__name__)
    if config:
        app.config.from_object(config)
    bp = create_routes_blueprint()
    app.register_blueprint(bp)
    return app
```
**Reuse:** Create multiple instances for testing, CLI, or different configs without code duplication.

### OPERATIONS Dictionary (Server & Client)
```python
# app/calculator.py
OPERATIONS = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}
```
**Reuse:** Function dispatch pattern; add new operations by extending `OPERATIONS` dict and implementing function.

### Keypad State Machine (JavaScript)
```javascript
const EMPTY_STATE = { acc: "", op: "", entry: "" };
// State transitions: each key press returns new state
// Enables chaining: "5 + 3 * 2 =" evaluates as (5 + 3) * 2 = 16
```
**Reuse:** Pattern for client-side calculation state; easily extended for memory functions, history, or keyboard input.

### Theme Token System (CSS Custom Properties)
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  /* ... other tokens ... */
}
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}
```
**Reuse:** Theme switching requires only CSS variable override; no template duplication.

### Test Fixtures (Shared)
```python
# tests/conftest.py
@pytest.fixture
def app():
    app = create_app({"TESTING": True})
    return app

@pytest.fixture
def client(app):
    return app.test_client()
```
**Reuse:** All tests use same fixtures; consistent setup; easy to add new test files.

## Canonical References

These documents are the source of truth for Phase 1 and must be read by downstream phases:

1. **CLAUDE.md** (project root) — Engineering rules, demo request, architecture overview
2. **PROJECT.md** (.planning/) — Project goals, constraints, locked decisions, tech stack
3. **REQUIREMENTS.md** (.planning/) — Functional & non-functional requirements, traceability
4. **ROADMAP.md** (.planning/) — Phase history, status, future proposals
5. **ARCHITECTURE.md** (.planning/codebase/) — System design, data flow, anti-patterns, error handling
6. **STRUCTURE.md** (.planning/codebase/) — Directory layout, file purposes, naming conventions

## Decisions Carried Forward

All Phase 1 decisions are foundational and locked. Downstream phases (Phase 2+) must:
- Use Flask (no framework changes)
- Maintain business logic separation (add operations to `app/calculator.py`)
- Keep server as source of truth (no client-only calculations)
- Respect testing discipline (add tests for new features)
- Maintain engineering rules (minimal, focused changes)
- Update OPERATIONS dict + add corresponding tests when adding new operations

## Deferred Ideas

None — Phase 1 scope was well-contained. Future extensions (memory, history, keyboard input) are documented in ROADMAP.md as Phases 5-9.

## No Open Gray Areas

Phase 1 is retrospectively documented. All architectural decisions are locked and explained above. The phase is feature-complete for its goal: establishing a clean, well-tested foundation for a Flask calculator with demonstrated agentic development capability.

**Phase 1 is ready to serve as foundation for Phase 2+ work.**

---

**Recorded:** 2026-09-29  
**Next Step:** Proceed to Phase 2 (Core Calculator Implementation) or Phase 5 (Memory Functions) planning.
