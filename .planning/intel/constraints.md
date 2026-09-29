# Project Constraints

## Technical Constraints

### C-001: Flask Framework
**Source:** CLAUDE.md, README.md (DOC)
**Constraint:** Application must be built using Flask.
**Scope:** Web framework choice.
**Impact:** All server-side logic must use Flask patterns and conventions.

### C-002: Python Language
**Source:** CLAUDE.md (DOC)
**Constraint:** Server-side code must be written in Python.
**Scope:** Application logic, routes, factory pattern.
**Impact:** All backend development uses Python; requires Python environment.

### C-003: JavaScript Frontend
**Source:** CLAUDE.md (DOC)
**Constraint:** Client-side keypad and display logic must be implemented in JavaScript.
**Scope:** `app/static/calculator.js` and keypad interactions.
**Impact:** Frontend developers must use JavaScript; requires Node.js for testing.

### C-004: Deliberately Small Application
**Source:** CLAUDE.md (DOC)
**Constraint:** Application must remain deliberately small and focused.
**Scope:** Codebase scope and complexity.
**Impact:** Features should be limited in scope; avoid feature creep or over-engineering.

## Process Constraints

### C-005: Code Changes Must Be Minimal and Focused
**Source:** CLAUDE.md (DOC)
**Constraint:** All changes must be minimal and focused on the requested task.
**Scope:** Code modification approach.
**Impact:** Increases code review efficiency; reduces unintended side effects.

### C-006: UI Changes Must Preserve Behavior
**Source:** CLAUDE.md (DOC)
**Constraint:** UI changes must not alter application behavior.
**Scope:** Visual modifications.
**Impact:** Styling and presentation changes allowed; functional changes require separate work.

### C-007: Tests Drive Requirements
**Source:** CLAUDE.md (DOC)
**Constraint:** Tests must not be modified merely to pass; add/update tests only when behavior changes.
**Scope:** Testing approach.
**Impact:** Tests reflect actual requirements; prevents false positives and test rot.

### C-008: Verification Before Commit
**Source:** CLAUDE.md (DOC)
**Constraint:** Must run `pytest` after code changes.
**Scope:** Pre-commit validation.
**Impact:** Ensures no regressions; validates all tests pass before committing.

### C-009: Security in Git
**Source:** CLAUDE.md (DOC)
**Constraint:** Never commit secrets, API keys, tokens, or credentials.
**Scope:** Git repository content.
**Impact:** Prevents credential exposure; requires .gitignore management.

### C-010: Git Diff Inspection
**Source:** CLAUDE.md (DOC)
**Constraint:** Must inspect `git diff` before committing.
**Scope:** Commit preparation.
**Impact:** Ensures deliberate, reviewable changes; catches accidental modifications.

## Documentation Constraints

### C-011: Architecture Documentation Required
**Source:** CLAUDE.md (DOC)
**Constraint:** Architecture must be documented in CLAUDE.md.
**Scope:** Project structure and design decisions.
**Impact:** Developers can understand codebase layout and design patterns.

### C-012: Setup Instructions Required
**Source:** README.md (DOC)
**Constraint:** Project must include setup instructions.
**Scope:** README.md documentation.
**Impact:** New developers can get started quickly.

## Dependency Constraints

### C-013: pytest Required
**Source:** CLAUDE.md, README.md (DOC)
**Constraint:** Python testing framework is pytest, configured in `pyproject.toml`.
**Scope:** Test execution environment.
**Impact:** All Python tests must be pytest-compatible.

### C-014: Optional Node.js for JavaScript Tests
**Source:** CLAUDE.md (DOC)
**Constraint:** Node.js is optional; pytest runs JavaScript tests only when Node.js is installed.
**Scope:** JavaScript test execution.
**Impact:** CI/CD pipelines can run with or without Node.js.

### C-015: MCP Integration
**Source:** CLAUDE.md (DOC)
**Constraint:** Project must integrate with Model Context Protocol via `mcp_server/server.py`.
**Scope:** AI agent integration.
**Impact:** Project context available to Claude Code and other MCP-compatible tools.
