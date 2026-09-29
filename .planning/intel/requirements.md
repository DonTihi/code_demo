# Requirements

## Functional Requirements

### REQ-001: Calculator Application
**Source:** CLAUDE.md, README.md (DOC)
**Requirement:** System shall be a deliberately small Flask calculator application.
**Scope:** Web-based calculator with single-line display and keypad interface.
**Type:** Core Functionality

### REQ-002: Four Basic Operations
**Source:** CLAUDE.md (DOC)
**Requirement:** Calculator shall support four basic arithmetic operations: addition (+), subtraction (-), multiplication (*), and division (/).
**Scope:** Input parsing and computation in `app/calculator.py`.
**Type:** Core Functionality

### REQ-003: Operator Chaining
**Source:** CLAUDE.md (DOC)
**Requirement:** Calculator shall support chaining operators like a real calculator.
**Scope:** Client-side keypad state management with pending number pairs sent to server.
**Type:** Core Functionality

### REQ-004: Single-Line Display
**Source:** CLAUDE.md (DOC)
**Requirement:** Application shall have a single-line display for showing calculator state.
**Scope:** Frontend rendering in `app/templates/index.html` and `app/static/style.css`.
**Type:** User Interface

### REQ-005: Web Interface
**Source:** CLAUDE.md, README.md (DOC)
**Requirement:** Application shall be accessible via web browser.
**Scope:** Flask routes and HTML templates.
**Type:** Deployment

## Non-Functional Requirements

### REQ-006: Server as Source of Truth
**Source:** CLAUDE.md (DOC)
**Requirement:** Server shall remain the source of truth for calculations.
**Scope:** Only final pending pair of numbers sent to server; client state for UX responsiveness.
**Type:** Architecture

### REQ-007: Responsive UX
**Source:** CLAUDE.md (DOC)
**Requirement:** Application shall be responsive with on-screen keypad.
**Scope:** Client-side JavaScript state management.
**Type:** User Experience

### REQ-008: Testability
**Source:** CLAUDE.md, README.md (DOC)
**Requirement:** Application code shall be testable via pytest and Node.js test runners.
**Scope:** Test structure in `tests/` and `tests/js/` directories.
**Type:** Quality Assurance

### REQ-009: MCP Integration
**Source:** CLAUDE.md (DOC)
**Requirement:** Project context shall be exposed through MCP for AI agents and tools.
**Scope:** `mcp_server/server.py` implementation.
**Type:** Integration

### REQ-010: Demonstration Purpose
**Source:** CLAUDE.md, README.md (DOC)
**Requirement:** Application shall demonstrate agentic software development capabilities with Claude Code.
**Scope:** Project structure, documentation, and example tasks.
**Type:** Purpose & Scope

## Usage Requirements

### REQ-011: Demo Task Execution
**Source:** CLAUDE.md (DOC)
**Requirement:** System shall support the standard demo task: Change the Calculate button from blue to red while keeping existing behavior unchanged.
**Scope:** UI styling changes without functional changes.
**Type:** Example Task
