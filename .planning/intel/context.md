# Project Context & Notes

## Project Overview

This project is a deliberately small Flask calculator application designed to demonstrate agentic software development with Claude Code. The application serves as both a functional tool and a pedagogical example for developers working with AI-assisted development.

### Purpose & Goals

The Flask calculator exists primarily to showcase how Claude Code agents handle real-world development tasks within a well-structured codebase. The emphasis on being "deliberately small" means the project avoids unnecessary complexity while maintaining enough structure to be educational and representative of real applications.

**Core Goals:**
- Demonstrate agentic software development workflows
- Provide a realistic but manageable test bed for AI-assisted development
- Showcase integration with Model Context Protocol (MCP)
- Illustrate best practices in code organization, testing, and Git workflow

## Architecture Overview

The application follows a clean separation of concerns with five major layers:

1. **Application Factory** (`app/__init__.py`): Bootstrap Flask app with configuration
2. **Business Logic** (`app/calculator.py`): Pure calculation logic and input parsing
3. **Routing** (`app/routes.py`): HTTP endpoints and request handling
4. **Templating** (`app/templates/index.html`): Server-rendered HTML structure
5. **Frontend** (`app/static/calculator.js`, `style.css`): Client-side UI and state management

### Key Architectural Decisions

**Server as Source of Truth:** While the JavaScript client maintains state for responsive UX (e.g., showing numbers as typed), only the final pending calculation pair is sent to the server. This design balances responsiveness with server-side correctness guarantees.

**Operator Chaining:** The calculator supports real-world operator chaining (e.g., "5 + 3 * 2" evaluates left-to-right like physical calculators), implemented through JavaScript state management.

**Testing Strategy:** Python tests use pytest; JavaScript tests use Node.js test framework. pytest runs both when Node.js is installed, enabling comprehensive validation.

## Technology Stack

### Backend
- **Framework:** Flask
- **Language:** Python
- **Testing:** pytest (configured in `pyproject.toml`)
- **MCP Integration:** Custom MCP server in `mcp_server/server.py`

### Frontend
- **Markup:** HTML5 (templates)
- **Styling:** CSS3 (style.css)
- **Scripting:** Vanilla JavaScript (no frameworks)
- **Testing:** Node.js test framework (if installed)

### Development & Deployment
- **Version Control:** Git
- **Integration:** Model Context Protocol (MCP)
- **Task Runner:** CLI-based via Flask/pytest

## Development Workflow

The project enforces a disciplined development workflow:

1. **Plan Changes:** Understand requirements before coding
2. **Code Minimally:** Make focused, small changes per task
3. **Test Comprehensively:** Run full test suite after changes
4. **Review Carefully:** Inspect diff before committing
5. **Commit Cleanly:** Only include deliberate, reviewed changes

This workflow emphasizes code quality, reviewability, and preventing bugs through comprehensive testing.

## File Organization

```
app/
  __init__.py          # Application factory
  calculator.py        # Business logic (operations, parsing)
  routes.py            # Flask routes and request handling
  templates/
    index.html         # Main calculator UI
  static/
    calculator.js      # Keypad and display logic
    style.css          # Styling

tests/
  conftest.py          # pytest fixtures and configuration
  js/                  # JavaScript tests
    calculator.test.js

mcp_server/
  server.py            # Model Context Protocol integration

pyproject.toml         # pytest configuration
requirements.txt       # Python dependencies
.mcp.json              # MCP server configuration
```

## Standard Demonstration Task

The project includes a standard demo task for training and validation:

**Task:** Change the Calculate button from blue to red.

**Constraints:**
- Keep existing behavior unchanged
- Add or update tests if necessary
- Run full test suite and verify passing
- Commit the change with clear commit message

**Purpose:** Demonstrates how to make focused UI changes without affecting functionality, showcasing the separation of concerns and testing discipline.

## Integration Points

### Model Context Protocol (MCP)
The `mcp_server/server.py` exposes project context to AI agents and tools, enabling:
- AI-assisted code understanding
- Context-aware suggestions and modifications
- Integration with Claude Code and compatible tools
- Project introspection by agents

### Testing Integration
All changes trigger `pytest` validation:
- Python tests validate business logic and routing
- JavaScript tests (when Node.js available) validate client-side logic
- Comprehensive test coverage ensures no regressions

### Git Workflow
The project enforces clean Git practices:
- Detailed commit messages
- Diff inspection before commits
- Security checks to prevent credential leaks
- Clear attribution for AI-assisted commits

## Notable Design Patterns

### Separation of Concerns
- Logic isolated from presentation
- Server maintains calculation correctness
- Client manages UX responsiveness
- Tests separated by language/concern

### Factory Pattern
- Flexible application creation
- Testable configuration
- Environment-specific setup possible

### Event-Driven Frontend
- JavaScript drives keypad interactions
- Responsive display updates
- Chained operator support through state management

## Engineering Philosophy

The project embodies several core engineering principles:

1. **Intentionality:** Every change is deliberate, minimized, and focused
2. **Testability:** Code organized for easy testing at unit and integration levels
3. **Clarity:** Clear separation of concerns and explicit architectural decisions
4. **Quality:** Comprehensive testing and review before commits
5. **Documentation:** Architecture and procedures well-documented for onboarding

These principles make the codebase suitable for demonstrating how AI-assisted development can maintain code quality while accelerating delivery.

## Future Extensibility

While deliberately kept small, the architecture supports future extensions:
- Additional mathematical operations (trigonometry, roots, etc.)
- Memory functions (M+, M-, MR, MC)
- Keyboard input handling
- Calculation history
- Dark/light theme support

The clean separation of concerns means these features can be added with minimal impact on existing code.
