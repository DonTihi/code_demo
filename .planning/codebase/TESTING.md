# Testing Patterns

**Analysis Date:** 2026-09-29

## Test Framework

**Python Runner:**
- pytest [version in requirements.txt]
- Config: `pyproject.toml`
- Plugins: pytest-cov for coverage reporting

**JavaScript Runner:**
- Node.js built-in test module (`node:test`)
- Assert library: `node:assert/strict` for strict equality checks
- Discovered and run by: `pytest` when Node.js is installed (see `tests/test_keypad_js.py`)

**Run Commands:**
```bash
pytest                    # Run all tests with coverage
pytest tests/test_app.py  # Run specific test file
pytest --cov-report=html # Generate HTML coverage report
pytest -k test_calculate  # Run tests matching pattern
```

## Test File Organization

**Location:**
- Python: Colocated in `tests/` directory (separate from source)
- JavaScript: `tests/js/` subdirectory for Node.js tests

**Naming:**
- Python: `test_*.py` (e.g., `test_app.py`, `test_calculator.py`)
- JavaScript: `*.test.js` (e.g., `calculator.test.js`, `theme.test.js`)

**Structure:**
```
tests/
├── conftest.py                    # Shared fixtures
├── test_app.py                    # Flask app and routes
├── test_calculator.py             # Calculator logic
├── test_entrypoint.py             # Entry point behavior
├── test_keypad_js.py              # JavaScript test runner
├── test_mcp_server.py             # MCP server tools
└── js/
    ├── calculator.test.js         # Keypad logic
    └── theme.test.js              # Theme toggle logic
```

## Test Structure

**Python Test Suite Pattern:**
```python
import pytest
from app import create_app

def test_feature_happy_path():
    """Test successful operation."""
    result = function_under_test()
    assert result == expected

@pytest.mark.parametrize(
    ("input", "expected"),
    [("value1", result1), ("value2", result2)],
)
def test_feature_multiple_inputs(input, expected):
    """Test with multiple parameter combinations."""
    assert function_under_test(input) == expected

def test_feature_error_condition():
    """Test error handling."""
    with pytest.raises(ValueError):
        function_under_test(invalid_input)
```

**JavaScript Test Pattern:**
```javascript
const assert = require("node:assert/strict");
const { test } = require("node:test");

test("feature works correctly", () => {
    assert.deepEqual(function(args), expected);
});

test("feature handles errors", () => {
    assert.throws(() => function(badInput), /error-pattern/);
});
```

## Fixture and Setup

**Fixtures (Python):**
Location: `tests/conftest.py`

Shared fixtures:
- `app`: Creates Flask app in TESTING mode
  ```python
  @pytest.fixture
  def app():
      return create_app({"TESTING": True})
  ```
- `client`: Returns Flask test client
  ```python
  @pytest.fixture
  def client(app):
      return app.test_client()
  ```

Used across test files via function parameter dependency injection.

**Teardown:**
- Flask test client cleaned up automatically
- No explicit fixtures for cleanup

## Mocking

**Framework:** pytest's `monkeypatch` fixture

**Patterns:**
```python
def test_something(monkeypatch):
    calls = []
    monkeypatch.setattr(SomeClass, "method", lambda self, **kwargs: calls.append(kwargs))
    
    # Call code that uses SomeClass.method()
    
    assert len(calls) == 1
    assert calls[0] == expected_kwargs
```

Used in:
- `tests/test_entrypoint.py`: Mocks Flask.run() to verify app startup
- `tests/test_mcp_server.py`: Mocks FastMCP.run() to verify server startup

**What to Mock:**
- External library calls that would execute side effects (Flask.run, FastMCP.run)
- I/O operations not part of the feature being tested

**What NOT to Mock:**
- Calculator functions themselves (test real logic)
- Request/response handling (use Flask test client)
- Application-level validation

## Coverage

**Requirements:** 100% coverage enforced
- Setting in `pyproject.toml`: `fail_under = 100`
- Branch coverage enabled: `branch = true`
- Source modules: `["app", "mcp_server"]`

**View Coverage:**
```bash
pytest --cov --cov-report=term-missing  # Default: shows missing lines
pytest --cov --cov-report=html          # Opens coverage.html in browser
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and modules
- Examples: `test_calculator.py` tests pure math functions
- Approach: Direct function calls with simple inputs
- Coverage: All paths, edge cases, error conditions

**Integration Tests:**
- Scope: Flask routes with client requests
- Examples: `test_app.py` POST and GET tests
- Approach: Uses Flask test client to make HTTP requests
- Coverage: End-to-end feature flows, template rendering, error responses

**JavaScript Unit Tests:**
- Scope: Pure functions in `app/static/calculator.js`
- Examples: `tests/js/calculator.test.js`
- Approach: Direct function calls with state objects
- Coverage: All state transitions, operator chaining, edge cases

**E2E Tests:**
- Not used (calculator is simple enough for unit + integration coverage)

## Common Patterns

**Parametrized Testing (Python):**
```python
@pytest.mark.parametrize(
    ("a", "op", "b", "expected"),
    [
        (2, "+", 3, 5),
        (2, "-", 3, -1),
        (2, "*", 3, 6),
        (3, "/", 2, 1.5),
    ],
)
def test_calculate_applies_operator(a, op, b, expected):
    assert calculate(a, op, b) == expected
```

**Exception Testing (Python):**
```python
def test_parse_number_rejects_invalid_values(value):
    with pytest.raises(ValueError):
        parse_number(value)
```

**Conditional Test Skip (Python):**
```python
@pytest.mark.skipif(
    shutil.which("node") is None, 
    reason="Node.js is not installed"
)
def test_keypad_javascript_tests_pass():
    result = subprocess.run(["node", "--test", ...])
    assert result.returncode == 0
```

**Async Testing:**
Not used (no async code in this project)

**Error Testing (JavaScript):**
```javascript
test("calculate throws on division by zero", () => {
    assert.throws(() => calculate("1", "/", "0"), /division-by-zero/);
});
```

**State Testing (JavaScript):**
```javascript
function press(state, ...keys) {
    return keys.reduce(applyKey, state);
}

test("digits are typed into the accumulator", () => {
    assert.deepEqual(
        press(EMPTY_STATE, "1", "2", "3"),
        { ...EMPTY_STATE, acc: "123" }
    );
});
```

## Test Data and Fixtures

**Test Data Location:** Inline in test functions or parametrize decorators

**Factory Pattern:** None used (data too simple)

**Example Data:**
- Numeric inputs: `2, 3, 1.5, -1`
- Strings: `"abc", "nan", "inf"`
- Form data: `{"a": "2", "b": "3", "op": "+"}`
- State objects: `{ acc: "", op: "", entry: "" }`

## Test Organization Principles

**One assertion focus per test:**
- Test names describe what is being verified: `test_adds_two_numbers()`, `test_divide_by_zero_raises()`
- Each test covers one behavior or error condition

**Shared context in conftest:**
- Flask app creation centralized in fixtures
- Reused across all Flask-dependent tests

**Pure function testing:**
- Calculator tests are purely functional (no side effects)
- JavaScript state machine tests use immutable state updates

**Server as source of truth:**
- Final calculation always recomputed by server (see `tests/js/calculator.test.js` comments)
- Client-side preview handled separately

---

*Testing analysis: 2026-09-29*
