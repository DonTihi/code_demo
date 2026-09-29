# Claude Code Agent Demo - Project Definition

**Project Version:** 1.0  
**Status:** Operational  
**Last Updated:** 2026-09-29

## Project Identity

**Name:** Claude Code Agent Demo  
**Type:** Web Application (Educational/Demonstration)  
**Domain:** Agentic Software Development Demonstration  
**Owner:** Claude Code Community

## Executive Summary

The Claude Code Agent Demo is a deliberately small, well-structured Flask calculator application that serves dual purposes: functioning as a working web-based calculator while simultaneously demonstrating best practices in agentic software development with Claude Code. The project showcases how AI-assisted development can maintain code quality, testability, and clean architecture principles.

## Scope Definition

### In Scope

**Functional Scope:**
- Flask-based web calculator with four arithmetic operations (+, -, *, /)
- Single-line display with responsive keypad interface
- Support for operator chaining (left-to-right evaluation)
- Server-based calculation with client-side state management

**Technical Scope:**
- Python backend with Flask web framework
- JavaScript frontend with vanilla implementation (no frameworks)
- Comprehensive testing via pytest and Node.js
- Model Context Protocol (MCP) integration for AI agents
- Git-based version control with clean workflow practices

**Educational Scope:**
- Demonstration of agentic software development workflows
- Showcase of clean architecture and separation of concerns
- Illustration of testing discipline (unit and integration)
- Example of minimal, focused code changes
- Model for how AI can assist software development while maintaining quality

### Out of Scope

- Advanced mathematical operations (trigonometry, calculus)
- User authentication or multi-user support
- Data persistence or calculation history
- Mobile app versions or cross-platform builds
- Performance optimization beyond typical web standards
- Complex UI frameworks or component libraries

## Goals & Success Criteria

### Primary Goals

1. **Functional Excellence**
   - ✓ Calculator performs accurate arithmetic operations
   - ✓ Operator chaining works like physical calculators
   - ✓ Single-line display updates responsively
   - ✓ Server remains source of truth for calculations

2. **Demonstration Quality**
   - ✓ Project structure clearly demonstrates separation of concerns
   - ✓ Code exhibits testability at all layers (unit, integration)
   - ✓ Clean Git history with meaningful commits
   - ✓ Engineering rules are enforceable and documented

3. **Agentic Development Readiness**
   - ✓ Project context available through MCP for AI agents
   - ✓ Standard demo task (blue→red button) executable by agents
   - ✓ Clear architecture enables confident agent modifications
   - ✓ Testing framework validates agent-made changes

4. **Onboarding Effectiveness**
   - ✓ CLAUDE.md documents architecture and rules clearly
   - ✓ README.md provides setup and testing instructions
   - ✓ File organization is intuitive and well-explained
   - ✓ New developers can contribute within 15 minutes

### Non-Goals

- Production-grade calculator (intentionally small and simple)
- Comprehensive feature set beyond four operations
- Database or backend persistence
- Complex DevOps or deployment infrastructure
- Performance benchmarking or optimization focus
- Mobile or desktop app variants

## Key Constraints

### Technical Constraints (Locked)

- **C-001:** Must use Flask framework (no alternatives)
- **C-002:** Backend code must be Python
- **C-003:** Frontend client code must be JavaScript (vanilla, no frameworks)
- **C-004:** Application must remain deliberately small and focused in scope

### Process Constraints (Locked)

- **C-005:** All code changes must be minimal and focused on single tasks
- **C-006:** UI changes must never alter application behavior
- **C-007:** Tests must reflect actual behavior; never modify tests to pass false tests
- **C-008:** Must run `pytest` after every code change
- **C-009:** Never commit secrets, API keys, tokens, or credentials
- **C-010:** Must inspect `git diff` before committing
- **C-011:** Architecture must be documented in CLAUDE.md
- **C-012:** Setup instructions must be provided in README.md

### Dependency Constraints (Locked)

- **C-013:** pytest is the required Python testing framework
- **C-014:** Node.js is optional; JavaScript tests run when available
- **C-015:** MCP integration via `mcp_server/server.py` is required

## Locked Architectural Decisions

### Core Architecture (D-001 to D-006)

| ID | Decision | Rationale | Impact |
|----|----------|-----------|--------|
| **D-001** | Flask application factory via `create_app()` in `app/__init__.py` | Enables flexible configuration and test isolation | All app initialization flows through factory |
| **D-002** | Separate business logic in `app/calculator.py` | Keeps operations isolated from routing and presentation | Easy to test logic independently; supports multiple interfaces |
| **D-003** | Routes defined in `app/routes.py` | Clear separation from logic and templating | Maintainable request handling; easy to understand HTTP layer |
| **D-004** | Client-side keypad and display via `app/static/calculator.js` | Balances UX responsiveness with server-side correctness | Server remains source of truth; client manages display state |
| **D-005** | Dual-language testing: pytest (Python) + Node.js (JavaScript) | Language-appropriate test tools; comprehensive validation | All layers tested in native tooling; pytest orchestrates both |
| **D-006** | MCP integration via `mcp_server/server.py` | Enable AI agents to access project context | Claude Code and compatible tools can introspect and modify codebase |

### Engineering Rules (D-007 to D-011)

| ID | Rule | Rationale | Enforcement |
|----|------|-----------|------------|
| **D-007** | Minimal and focused changes per task | Reduces side effects; improves code review clarity | Code review checklist; git diff inspection required |
| **D-008** | UI changes must preserve behavior | Allows styling updates without functional regressions | Test suite validates; behavior-driven test approach |
| **D-009** | Tests drive requirements, not vice-versa | Tests reflect actual requirements; prevents false positives | Never modify tests to hide failures; add tests for new behavior |
| **D-010** | Always run `pytest` after changes | Catches regressions; validates all changes work | Standard verification step; pre-commit workflow |
| **D-011** | Inspect `git diff` before commit; no secrets | Code quality control and security | Git hooks and manual review; .gitignore maintenance |

## Technology Stack (Locked)

### Backend
- **Framework:** Flask (Python web framework)
- **Language:** Python 3.x
- **Testing:** pytest (configured in `pyproject.toml`)
- **Integration:** Model Context Protocol (MCP)

### Frontend
- **Markup:** HTML5 (server-rendered via Jinja2 templates)
- **Styling:** CSS3 (vanilla, no preprocessors)
- **Scripting:** Vanilla JavaScript (ECMAScript 5+, no frameworks)
- **Testing:** Node.js test runner (optional)

### Infrastructure
- **Version Control:** Git
- **Package Management:** pip (Python), npm (JavaScript, optional)
- **Configuration:** pyproject.toml, .mcp.json

## Success Metrics

### Functional Success
- All calculator operations (+, -, *, /) produce correct results
- Operator chaining evaluates left-to-right correctly
- Single-line display updates without lag
- Server validation prevents invalid inputs

### Code Quality Success
- Test coverage remains at or above baseline
- No code review findings blocking merges
- Git history is clean and meaningful
- Zero security issues in dependencies

### Demonstration Success
- Standard demo task (blue→red button) completes in < 5 minutes
- Agent modifications pass full test suite
- Architecture clearly visible to code reviewers
- New developers understand codebase within 30 minutes of reading docs

### Agentic Success
- MCP context provides sufficient information for agent tasks
- Agent-generated code matches project style and conventions
- All agent changes pass engineering rules validation
- Demo tasks complete with minimal human oversight

## Phase Readiness

This project is currently in an **operational state**. Historical development phases (setup, core implementation, testing, theme integration) have been completed. The project is ready for:

- Demonstration tasks and educational use
- Agentic development experiments
- Code change requests from AI agents
- Integration with Claude Code workflows

Future extensibility is preserved through clean architecture, enabling additions of memory functions, history tracking, theme support, and other features without architectural disruption.
