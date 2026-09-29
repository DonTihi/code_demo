<!-- refreshed: 2026-09-29 -->
# Architecture

**Analysis Date:** 2026-09-29

## System Overview

```text
┌──────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  HTML Template + CSS + JavaScript (Keypad + Theme Toggle)    │
│              `app/templates/index.html`                      │
│              `app/static/calculator.js`                      │
│              `app/static/theme.js`                           │
│              `app/static/style.css`                          │
└────────────────┬─────────────────────────────────────────────┘
                 │ HTTP GET/POST
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                   Route Handler Layer                        │
│                  `app/routes.py`                             │
│      - Receives HTTP requests (/, /calculate)               │
│      - Validates input via calculator module                 │
│      - Delegates business logic                             │
│      - Renders responses with Jinja2                        │
└────────────────┬──────────────────────────────────────────────┘
                 │ Function calls
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                        │
│                `app/calculator.py`                           │
│      - Input parsing (parse_number)                         │
│      - Four operations: +, -, *, /                          │
│      - Error handling (division by zero, overflow)          │
└──────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│                 Application Factory                          │
│                `app/__init__.py`                             │
│        - create_app(config) - Flask app setup                │
│        - Blueprint registration                             │
└──────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Flask App Factory | Create and configure Flask app, register blueprints | `app/__init__.py` |
| Routes/Blueprint | Handle HTTP requests, validate input, call calculator, render responses | `app/routes.py` |
| Calculator Logic | Pure math functions, input validation, error detection | `app/calculator.py` |
| HTML Template | Static markup for form, keypad, display, legacy fallback | `app/templates/index.html` |
| Keypad Script | Client-side state machine, number entry, operator chaining, submission | `app/static/calculator.js` |
| Theme Script | Dark/light mode toggle, localStorage persistence, no-flash initialization | `app/static/theme.js` |
| Stylesheet | Color variables (light/dark themes), keypad layout, typography | `app/static/style.css` |
| Entry Point | Application startup (debug mode) | `app/__main__.py` |
| MCP Server | Expose project context and demo request to Claude | `mcp_server/server.py` |

## Pattern Overview

**Overall:** Server-rendered template + progressive enhancement pattern

**Key Characteristics:**
- **Client-side state**: JavaScript maintains keypad state (accumulator, operator, entry) independent of server
- **Graceful degradation**: Without JavaScript, a simple legacy form (two fields, one operator, one calculation) is shown
- **Server as source of truth**: Final calculations always sent to server for verification
- **Theme awareness**: Color variables allow dark/light mode without duplicating selectors
- **IIFE pattern**: Both `calculator.js` and `theme.js` use immediately-invoked function expressions to avoid polluting global scope

## Layers

**Presentation Layer:**
- Purpose: Render the user interface (calculator keypad, display, theme toggle)
- Location: `app/templates/`, `app/static/`
- Contains: HTML markup, CSS styling, JavaScript functionality
- Depends on: Flask (for URL generation via `url_for()`, template variables)
- Used by: Web browser, accessed via Flask routes

**Route Handler Layer:**
- Purpose: Map HTTP requests to responses; validate input; delegate business logic
- Location: `app/routes.py`
- Contains: Flask blueprint with GET `/` and POST `/calculate` endpoints
- Depends on: Flask, calculator module, Jinja2 templating engine
- Used by: Presentation layer (form submissions), application factory

**Business Logic Layer:**
- Purpose: Perform arithmetic, validate numbers, detect errors
- Location: `app/calculator.py`
- Contains: `parse_number()`, four operation functions (`add`, `subtract`, `multiply`, `divide`), main `calculate()` dispatcher
- Depends on: Python standard library (`math` module) only
- Used by: Routes layer, JavaScript (mirrors logic client-side for preview)

**Infrastructure Layer:**
- Purpose: Application lifecycle, configuration, blueprint registration
- Location: `app/__init__.py`, `app/__main__.py`
- Contains: `create_app()` factory, entry point
- Depends on: Flask
- Used by: Entry point, test fixtures

## Data Flow

### Primary Request Path (POST /calculate)

1. User presses `=` on the keypad; JavaScript collects state (`a`, `op`, `b`) and submits form (`app/static/calculator.js:259`)
2. Flask route handler receives POST to `/calculate` (`app/routes.py:40`)
3. Route extracts form parameters and calls `calculator.parse_number()` twice (`app/routes.py:43-44`)
4. Route checks operator is in valid set (`app/routes.py:49`)
5. Route calls `calculator.calculate(a, op, b)` (`app/routes.py:53`)
6. Calculator dispatches to the correct operation via `OPERATIONS` dict (`app/calculator.py:54`)
7. Operation function computes result (or raises exception for division by zero)
8. Result is checked for finiteness (overflow detection) (`app/calculator.py:59`)
9. Route renders response with `_render()`, passing result to template (`app/routes.py:59`)
10. Jinja2 renders HTML with result and form state restored (`app/templates/index.html:27-32`)
11. JavaScript receives HTML, re-hydrates state from data attributes, displays result (`app/static/calculator.js:155-164`)

### Secondary Flow: GET / (Page Load)

1. Browser requests `/` 
2. Flask route handler processes GET to `/` (`app/routes.py:35`)
3. Route calls `_render()` with no result yet (`app/routes.py:37`)
4. Jinja2 renders HTML with empty form state (`app/templates/index.html`)
5. Browser loads CSS and JavaScript asynchronously
6. `theme.js` runs **before first paint** (in `<head>`, not deferred) to apply saved theme preference (`app/templates/index.html:16`)
7. `calculator.js` runs after DOM ready, initializes keypad state machine (`app/static/calculator.js:288-295`)

### Client-Side Chaining (No Server)

When a user presses multiple operators in succession (e.g., `6 + 2 + 3 =`):

1. User enters `6`, presses `+` → JavaScript state becomes `{ acc: "6", op: "+", entry: "" }` 
2. User enters `2`, presses `+` → JavaScript calls `pressOperator()` (`app/static/calculator.js:104-117`)
3. `pressOperator()` sees both `state.op` and `state.entry` are non-empty, so it computes `6 + 2 = 8` locally (mirrors server logic)
4. State becomes `{ acc: "8", op: "+", entry: "" }`
5. Display updates to show `8` (`app/static/calculator.js:174-189`)
6. User enters `3`, presses `=` → Form submitted with `a=8, op=+, b=3` to server
7. Server returns `11` and page re-hydrates

**State Management:**
- **Server state**: Form data (`a`, `op`, `b`), final result
- **Client state**: JavaScript `{ acc, op, entry }` state machine
- **Persistence**: Theme preference stored in localStorage; form values persisted server-side during session
- **Recovery**: After error, pressing any key resets client state; after result, next key uses result as new `acc`

## Key Abstractions

**OPERATIONS Dictionary:**
- Purpose: Map operator symbols (`"+", "-", "*", "/"`) to their functions
- Examples: `app/calculator.py:39-44`, mirrored in `app/static/calculator.js:47-52`
- Pattern: Function dispatch table; avoids long if-else chains

**Flask Blueprint:**
- Purpose: Organize routes and their context without a full Flask app
- Examples: `app/routes.py:21` defines `bp = Blueprint("main", __name__)`
- Pattern: Decouples route definitions from app factory

**Keypad State Machine:**
- Purpose: Track accumulator, operator, and current entry without server round-trips
- Examples: `app/static/calculator.js:75` defines `EMPTY_STATE = { acc: "", op: "", entry: "" }`
- Pattern: Immutable state transitions (each key press returns a new state object)

**Theme Token System:**
- Purpose: Centralize color values for light/dark mode
- Examples: CSS variables in `app/static/style.css:8-41` (light) and `44-50` (dark)
- Pattern: CSS custom properties (--bg-primary, --text-primary, etc.); switched via `[data-theme]` attribute

## Entry Points

**`app/__main__.py`:**
- Location: `app/__main__.py:4-6`
- Triggers: `python -m app`
- Responsibilities: Create app with default config, run Flask development server (debug=True)

**GET `/`:**
- Location: `app/routes.py:35-37`
- Triggers: Browser navigation to `/`
- Responsibilities: Render initial form with empty state

**POST `/calculate`:**
- Location: `app/routes.py:40-59`
- Triggers: Form submission from JavaScript (or legacy form without JavaScript)
- Responsibilities: Validate input, compute result, return rendered page with result or error message

**MCP Server Entry:**
- Location: `mcp_server/server.py:30-31`
- Triggers: `python -m mcp_server` or Claude Code's MCP client
- Responsibilities: Expose `get_project_context()` and `get_demo_request()` tools

## Architectural Constraints

- **Single-threaded event loop (browser):** JavaScript runs on the main thread; long computations block interaction. Not a concern for small numbers, but overflow detection is checked server-side.
- **Global scope isolation:** Both `calculator.js` and `theme.js` use IIFE to avoid polluting `window` (see `app/static/calculator.js:11-12`, `app/static/theme.js:2-3`).
- **No global state in calculator module:** `app/calculator.py` is purely functional; `OPERATIONS` dict is read-only.
- **Form state persisted server-side only:** After submission, form values are included in the rendered HTML. Refreshing the page clears everything (no database).
- **Local preview computation must mirror server exactly:** JavaScript `calculate()` in `calculator.js:57-68` must match Python `calculate()` in `app/calculator.py:47-61` to avoid user confusion when the final result comes back from the server.

## Anti-Patterns

### Unnecessary Duplication of Business Logic

**What happens:** The `calculate()` function exists in both `app/calculator.py` (server) and `app/static/calculator.js` (client). Any change to one must be manually ported to the other.

**Why it's wrong:** Inconsistency between client preview and server result could confuse the user. Maintenance burden if operations change.

**Do this instead:** Document the mirroring requirement explicitly (see comments in `app/static/calculator.js:54-56`). For complex operations, consider an API-driven approach where the server computes previews, but this demo prioritizes responsiveness.

### Missing Error Recovery in JavaScript

**What happens:** If the server returns an error (invalid operator, overflow), the JavaScript state machine resets to `EMPTY_STATE` (`app/static/calculator.js:115`).

**Why it's wrong:** User loses the numbers they entered. On recovery, pressing any key starts fresh.

**Do this instead:** Instead of full reset, preserve `acc` and `entry` so the user can fix the operator. The current behavior is acceptable for a simple demo.

## Error Handling

**Strategy:** Exceptions bubble up from calculator module to route handler; route handler catches specific exceptions and returns user-friendly messages.

**Patterns:**
- `ValueError` from `parse_number()`: Caught as `KeyError` or `ValueError` in `app/routes.py:45`, returns "Please enter two valid numbers."
- `ZeroDivisionError` from `divide()`: Caught in `app/routes.py:54`, returns "Cannot divide by zero."
- `OverflowError` from `calculate()`: Caught in `app/routes.py:56`, returns "The result is too large."
- Invalid operator: Checked in `app/routes.py:49`, returns "Please choose a valid operator."
- Client-side errors: JavaScript `pressOperator()` wraps local `calculate()` in try-catch (`app/static/calculator.js:111-116`); errors rendered as alert message in display.

## Cross-Cutting Concerns

**Logging:** Not implemented. Development uses Flask debug mode; no persistent logs.

**Validation:** 
- Input: `calculator.parse_number()` rejects non-numeric, NaN, infinity via `math.isfinite()` check
- Operator: Checked against `OPERATIONS.keys()` in route handler
- Output: Result checked for finiteness in `calculator.calculate()` to catch overflow

**Internationalization:** Not implemented. Error messages and UI labels are hardcoded in English. Theme is not localized.

**Accessibility:**
- ARIA labels on buttons (e.g., `aria-label="Toggle dark/light theme"` in `app/templates/index.html:20`)
- Visually hidden announcement area for screen readers (`data-announce` in `app/templates/index.html:38`)
- Fallback form shown without JavaScript uses proper `<label>` and `<fieldset>` semantics
- Focus management in JavaScript with CSS `:focus` styles

---

*Architecture analysis: 2026-09-29*
