# Locked Decisions

## Architecture Decisions

### D-001: Flask Application Factory Pattern
**Source:** CLAUDE.md (DOC)
**Decision:** Use Flask application factory pattern via `app/__init__.py` with `create_app()` function.
**Rationale:** Enables flexible app configuration and testing isolation.
**Status:** LOCKED
**Evidence:** Defined in project architecture guidelines.

### D-002: Separation of Concerns - Calculator Logic
**Source:** CLAUDE.md (DOC)
**Decision:** Isolate application logic in `app/calculator.py` containing input parsing and four operations (+, -, *, /).
**Rationale:** Keeps business logic separate from routing and presentation layers.
**Status:** LOCKED
**Evidence:** Explicitly documented in Architecture section.

### D-003: Routes Separation
**Source:** CLAUDE.md (DOC)
**Decision:** Flask routes defined in `app/routes.py`.
**Rationale:** Maintainability and clear separation from logic and templating.
**Status:** LOCKED
**Evidence:** Documented as part of standard architecture.

### D-004: Frontend State Management
**Source:** CLAUDE.md (DOC)
**Decision:** Client-side keypad and single-line display driven by `app/static/calculator.js` with support for chaining operators.
**Rationale:** Server remains source of truth; client-side state management for UX responsiveness.
**Status:** LOCKED
**Evidence:** Specified in architecture documentation.

### D-005: Testing Strategy
**Source:** CLAUDE.md (DOC)
**Decision:** Use pytest for Python tests; Node.js unit tests for JavaScript keypad logic in `tests/js/`.
**Rationale:** Language-appropriate testing tools; pytest runs all tests when Node.js installed.
**Status:** LOCKED
**Evidence:** Defined in engineering rules.

### D-006: MCP Integration
**Source:** CLAUDE.md (DOC)
**Decision:** Expose project context through MCP via `mcp_server/server.py`.
**Rationale:** Enable AI agents and tools to access project information.
**Status:** LOCKED
**Evidence:** Referenced in architecture documentation.

## Engineering Decision Rules

### D-007: Minimal and Focused Changes
**Source:** CLAUDE.md (DOC)
**Decision:** Keep all code changes minimal and focused on the requested task.
**Rationale:** Reduces risk of unintended side effects and improves code review clarity.
**Status:** LOCKED
**Evidence:** Stated in engineering rules.

### D-008: Preserve Behavior on UI Changes
**Source:** CLAUDE.md (DOC)
**Decision:** Do not change application behavior when making UI changes.
**Rationale:** Maintains functionality while allowing visual updates.
**Status:** LOCKED
**Evidence:** Explicit engineering rule.

### D-009: Tests Drive by Behavior, Not Pass
**Source:** CLAUDE.md (DOC)
**Decision:** Do not modify tests merely to make failing tests pass; add or update tests when behavior changes.
**Rationale:** Tests reflect actual requirements and prevent false positives.
**Status:** LOCKED
**Evidence:** Engineering rules section.

### D-010: Verification After Changes
**Source:** CLAUDE.md (DOC)
**Decision:** Always run `pytest` after code changes.
**Rationale:** Ensures no regressions; validates changes work correctly.
**Status:** LOCKED
**Evidence:** Standard verification procedure in documentation.

### D-011: Git Workflow
**Source:** CLAUDE.md (DOC)
**Decision:** Inspect `git diff` before committing; never commit secrets, API keys, tokens, or credentials.
**Rationale:** Code quality control and security.
**Status:** LOCKED
**Evidence:** Specified in engineering rules.
