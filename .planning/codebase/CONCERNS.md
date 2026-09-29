# Codebase Concerns

**Analysis Date:** 2026-09-29

## Tech Debt

**Hardcoded Configuration Constants:**
- Issue: Display width limit (15 chars), theme colors, and operator symbols are scattered throughout the code as hardcoded values
- Files: `app/static/calculator.js` (MAX_LENGTH = 15), `app/static/style.css` (theme colors), `app/routes.py` (OPERATOR_LABELS with Unicode symbols)
- Impact: Changing calculator limits, colors, or symbol representations requires modifications in multiple files, increasing risk of inconsistency
- Fix approach: Create a centralized configuration module (e.g., `app/config.py`) that exports these constants and is used by both Python and JavaScript (served as JSON)

**Duplicate Division by Zero Logic:**
- Issue: Division by zero check implemented separately in JavaScript (`app/static/calculator.js` lines 60-62) and Python (`app/calculator.py` line 36)
- Files: `app/static/calculator.js`, `app/calculator.py`
- Impact: If one implementation is updated without the other, the client-side preview could disagree with server-side result
- Fix approach: Extract the operation logic to a shared specification or ensure a synchronization mechanism between client and server validation

**Hardcoded Theme Colors in CSS:**
- Issue: Light and dark theme colors are completely hardcoded in `app/static/style.css` (lines 8-71). No way to customize theme without modifying CSS
- Files: `app/static/style.css`
- Impact: Theme customization or brand updates require CSS changes; no support for user-selected color themes
- Fix approach: Consider generating CSS from a theme configuration file or using CSS custom properties with JavaScript-driven updates

## Known Bugs

**None detected** - The application is well-tested with 100% coverage and current test suite passes.

## Security Considerations

**Missing CSRF Protection:**
- Risk: The POST endpoint at `/calculate` has no visible CSRF token validation. A malicious site could submit forms to this endpoint
- Files: `app/routes.py` (lines 40-59), `app/templates/index.html` (form at line 27)
- Current mitigation: Flask's default SameSite cookie policy provides some protection, but CSRF token would be more robust
- Recommendations: Add Flask-WTF or implement explicit CSRF token validation in the form and route handler

**localStorage Access Without Error Handling:**
- Risk: Theme persistence uses `localStorage.setItem()` without checking for quota exceeded errors. If quota is hit, theme setting silently fails
- Files: `app/static/theme.js` (line 46)
- Current mitigation: None
- Recommendations: Wrap localStorage calls in try-catch, fall back to session storage or in-memory state if quota exceeded

**No Input Type Validation:**
- Risk: Form handler relies on exception handling rather than schema validation. Missing or malformed field names could cause unhandled errors
- Files: `app/routes.py` (lines 43-50)
- Current mitigation: Broad try-catch for KeyError and ValueError catches most issues, returns 400
- Recommendations: Consider using a form validation library (e.g., WTForms, Pydantic) for explicit schema definition

## Performance Bottlenecks

**Display Overflow Handling on Mobile:**
- Problem: The display line uses `overflow-x: auto` with hidden scrollbar (lines 159-169 in style.css). Very long numbers on small screens will scroll invisibly
- Files: `app/static/style.css`, `app/static/calculator.js` (line 184: `expressionEl.scrollLeft = expressionEl.scrollWidth`)
- Cause: Relies on JavaScript to auto-scroll, but hidden scrollbar means users can't manually navigate hidden digits
- Improvement path: Implement visual indicators (arrows or fade effect) when content is scrolled, or use text truncation/scientific notation for very long numbers

**No Request Rate Limiting:**
- Problem: The `/calculate` endpoint accepts unlimited requests. Could be abused for denial-of-service
- Files: `app/routes.py`
- Current behavior: No throttling or rate limits
- Improvement path: Add Flask-Limiter or implement per-IP request rate limiting

## Fragile Areas

**JavaScript State Management:**
- Files: `app/static/calculator.js` (lines 70-99: state model with acc, op, entry fields)
- Why fragile: The state machine for calculator state (EMPTY_STATE, acc/op/entry model) is complex. Changes to state transitions in pressOperator or pressEquals must carefully maintain invariants
- Safe modification: 
  - Add type checking/JSDoc comments to clarify expected state shape
  - Run full test suite when modifying state transitions
  - Ensure all state transitions have corresponding tests
- Test coverage: Well-covered (see `tests/js/calculator.test.js`), but state machine logic is tightly coupled

**Operator Symbol Synchronization:**
- Files: `app/routes.py` (OPERATOR_LABELS with symbols ×, ÷, −), `app/static/calculator.js` (OPERATIONS object), `app/static/style.css` (operator button styling)
- Why fragile: Three places define operators. If a new operator is added to one place but not others, the UI could break silently
- Safe modification: 
  - Add validation that all operators in JavaScript's OPERATIONS match server's OPERATIONS
  - Test that operator buttons render correctly and work end-to-end
- Test coverage: UI rendering tested in `test_app.py`, but no test verifies JS OPERATIONS object matches server OPERATIONS

**Theme Toggle Without Initialization Guarantee:**
- Files: `app/static/theme.js` (DOMContentLoaded initialization at line 66)
- Why fragile: Theme is applied in head before DOMContentLoaded (line 65), but toggle event listener is only added on DOMContentLoaded (line 66). If DOMContentLoaded never fires, toggle won't work
- Safe modification: Ensure toggle listener is added in the head-execution path or re-attach if needed
- Test coverage: No JavaScript test for toggle event listener attachment

## Scaling Limits

**Display Width Limited to 15 Characters:**
- Current capacity: 15 character maximum for any number
- Limit: Cannot calculate or display numbers longer than 15 digits
- Scaling path: Increase MAX_LENGTH constant, but would need responsive adjustment for mobile displays or switch to scientific notation

**No Caching or Optimization:**
- Current behavior: Every page load renders full HTML template with operator symbols as JSON data attribute
- Scaling path: Add HTTP caching headers, consider serving operator symbols from a static JSON file instead of template

## Dependencies at Risk

**No Known Vulnerabilities Detected:**
- Flask 3.x is actively maintained
- pytest and pytest-cov are standard testing tools
- mcp[cli] is a new dependency (for MCP server integration)

**Potential Deprecation Risk:**
- Flask version constraint `>=3.0,<4` is reasonable but will eventually need updating
- MCP library is young; version `<2` constraint is very restrictive. Check for breaking changes in mcp>=2 before upgrading

## Test Coverage Gaps

**No End-to-End JavaScript Tests:**
- What's not tested: DOM interactions beyond unit tests. Full keypad click sequences, form submission from keypad, theme toggle actual DOM mutations
- Files: `tests/js/calculator.test.js` tests state machine but not DOM interactions
- Risk: Refactoring DOM structure or event handlers could break functionality undetected
- Priority: Medium — unit tests cover logic, but integration could be better

**No Integration Tests for Client-Server Chaining:**
- What's not tested: Multi-step calculations where JavaScript chains operations and then submits to server
- Files: No tests verify that pressing operators in sequence on client, then equals, produces correct server response
- Risk: Client-side calculation and server-side validation could diverge
- Priority: Medium — complex chaining scenarios could have edge cases

**Theme Initialization Race Conditions:**
- What's not tested: Theme script execution timing relative to DOM ready. No test for rapid theme toggles
- Files: `app/static/theme.js`
- Risk: Multiple rapid toggle clicks could cause localStorage writes to race or become inconsistent
- Priority: Low — unlikely in normal usage but possible under network lag

**No Tests for Error Message Display:**
- What's not tested: Full error state rendering in legacy fallback mode. Error messages are tested server-side but not for proper display to users
- Files: Legacy controls in `app/templates/index.html` (lines 41-75)
- Risk: Error formatting or styling could be broken without test detection
- Priority: Low — error paths are covered in pytest tests, but UI rendering not verified

## Missing Critical Features

**No Persistence:**
- Problem: Calculation history is not saved. Each page load resets the calculator
- Blocks: Cannot review previous calculations or resume interrupted sessions

**No Keyboard Numpad Support:**
- Problem: Only top-row numbers and keyboard operators work; numeric keypad (separate on many keyboards) is not fully supported
- Blocks: Full keyboard compatibility for all users

---

*Concerns audit: 2026-09-29*
