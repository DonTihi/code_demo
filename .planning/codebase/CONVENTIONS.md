# Coding Conventions

**Analysis Date:** 2026-09-29

## Naming Patterns

**Files:**
- Python modules: `lowercase_with_underscores.py` (e.g., `calculator.py`, `routes.py`)
- JavaScript files: `lowercase_with_underscores.js` (e.g., `calculator.js`)
- Test files: `test_*.py` for Python; `*.test.js` for JavaScript

**Functions:**
- Python: snake_case (e.g., `parse_number()`, `create_app()`, `calculate()`)
- JavaScript: camelCase (e.g., `applyKey()`, `pressOperator()`, `buildExpressionText()`)
- Private functions in Python: prefixed with underscore (e.g., `_render()` in `app/routes.py`)

**Variables:**
- Python: snake_case for all variables and parameters
- JavaScript: camelCase for variables and function parameters
- State objects: explicit field names (e.g., `{ acc: "", op: "", entry: "" }` in `app/static/calculator.js`)

**Types:**
- Python: Type hints using PEP 604 union syntax (e.g., `dict | None` in `app/__init__.py`)
- Type hints in function signatures for parameters and return types
- Constants: UPPER_SNAKE_CASE in Python (e.g., `MAX_LENGTH`, `OPERATIONS`, `EMPTY_STATE`)
- Constants: UPPER_CASE in JavaScript (e.g., `MAX_LENGTH` in `app/static/calculator.js`)

## Code Style

**Formatting:**
- No explicit formatter (Prettier/Black) configured
- Python follows PEP 8 conventions
- 4-space indentation in Python
- 2-space indentation in JavaScript

**Linting:**
- No ESLint or Pylint config file present
- Code style is enforced through review and convention

**Type Annotations:**
- Python: Comprehensive type hints on all functions (see `app/calculator.py`)
- Return types explicitly annotated: `def parse_number(value: str) -> float:`
- Generic types: `dict[str, str]`, `list[str]`

## Import Organization

**Order (Python):**
1. Standard library imports (e.g., `import math`, `from pathlib import Path`)
2. Third-party imports (e.g., `from flask import Flask`)
3. Local imports (e.g., `from app import calculator`, `from .routes import bp`)

**Path Aliases:**
- Relative imports used within package (e.g., `from . import create_app`, `from .routes import bp`)
- Absolute imports for cross-module access in tests

**JavaScript:**
- CommonJS require at top for testing (e.g., `const assert = require("node:assert/strict");`)
- Inline module exports for browser: `module.exports = { ... }` check at bottom

## Error Handling

**Patterns:**
- Specific exception catching in routes (e.g., `except (KeyError, ValueError):` in `app/routes.py`)
- Error messages use `repr()` for values: `f"Not a finite number: {value!r}"` in `app/calculator.py`
- Exception chaining with `from None`: `raise ValueError(...) from None` suppresses context
- ZeroDivisionError and OverflowError propagate from calculator for handler to catch
- Error messages are user-friendly strings returned to template

**JavaScript Error Handling:**
- Try/catch blocks wrap calculation operations in `app/static/calculator.js`
- Custom error messages: `throw new Error("division-by-zero")`
- Error handling returns error objects with `.message` field

## Logging

**Framework:** No logging framework configured

**Patterns:**
- No log statements in application code
- Debugging uses console in JavaScript for development only

## Comments

**When to Comment:**
- Module-level comments explain overall purpose and design (see `app/static/calculator.js` header)
- Inline comments clarify non-obvious state transitions or business logic
- Comments explain WHY, not WHAT (e.g., "Mirrors app/calculator.py's calculate()" in `app/static/calculator.js`)

**JSDoc/TSDoc:**
- Python: Docstrings use triple quotes with description and exception notes
  ```python
  def parse_number(value: str) -> float:
      """Convert user input to a finite float.
      
      Raises ValueError for text that is not a number, and for NaN or infinity.
      """
  ```
- JavaScript: Block comments for functions and state objects explaining parameters and behavior

## Function Design

**Size:** 
- Functions are small and focused (1-10 lines typical)
- Single responsibility: `parse_number()` does one thing, `add()` does one thing
- Helper functions broken out (e.g., `appendDigit()`, `toggleSign()` in calculator.js)

**Parameters:**
- Python: Limited parameters; complex data passed as config dicts
- JavaScript: State objects passed whole for immutability (e.g., `applyKey(state, key)`)
- No side effects preferred; pure functions where possible

**Return Values:**
- Functions return computed values, not None/null for errors
- Errors raised as exceptions in Python
- Errors returned in error fields in JavaScript for the client-side calculation layer

## Module Design

**Exports (Python):**
- Application factory pattern: `create_app()` in `app/__init__.py` returns configured Flask app
- Blueprint-based route organization: routes registered via `bp = Blueprint()`
- Specific functions exported from `app/calculator.py`: `add`, `subtract`, `multiply`, `divide`, `calculate`

**Exports (JavaScript):**
- Conditional export for testing vs. browser: CommonJS module.exports when in Node
- Pure functions exposed for testing: `applyKey`, `pressOperator`, `pressEquals`, `calculate`

**Barrel Files:**
- Not used; imports are direct to modules

**Immutability (JavaScript):**
- State objects created with spread operator: `{ ...state, field: newValue }`
- Never mutate form element values directly—update through render function

---

*Convention analysis: 2026-09-29*
