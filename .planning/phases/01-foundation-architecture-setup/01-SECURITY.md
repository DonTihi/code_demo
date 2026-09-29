---
phase: "01"
slug: "foundation-architecture-setup"
status: verified
threats_open: 0
asvs_level: 1
created: "2026-09-29"
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Client (Browser) → Server | HTTP requests carry calculation parameters | numeric inputs (a, op, b) |
| User Input → Calculator | String inputs must be parsed and validated | user-entered digits, operators |
| Server → Display | Results must be finite before returning | numeric results (int/float) |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-SC | Tampering | npm/pip package installs | high | mitigate | Verify Flask and pytest legitimacy on PyPI before installation. No suspicious dependencies. | closed |
| T-01-01 | Tampering | HTTP request parameters | medium | mitigate | Server-side validation of all inputs via `parse_number()` and `OPERATIONS` dict check. Never trust client-provided operator without validation. | closed |
| T-01-02 | Information Disclosure | Error messages | low | accept | Error messages are generic and do not expose system details (e.g., "Cannot divide by zero" rather than traceback). | closed |
| T-01-03 | Denial of Service | Large number input | low | mitigate | Input validation via `math.isfinite()` rejects infinity. No unbounded loops. Computation time is O(1) per request. | closed |
| T-01-04 | Elevation of Privilege | MCP Server Context | low | mitigate | MCP server is read-only and exposes only public project information. No authentication bypass possible. Designed for trusted agent connections. | closed |

*Status: closed (all mitigations verified in implementation)*  
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (high) count toward threats_open*  
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-09-29 | 5 | 5 | 0 | Claude Haiku 4.5 |

---

## Verification Summary

### Mitigation Verification

**T-01-01 — Input Validation (Closed)**
- Location: `app/calculator.py:parse_number()`
- Evidence: `math.isfinite()` check rejects NaN and infinity values
- Evidence: Routes handler validates operator against `OPERATIONS.keys()` before passing to calculator
- Status: ✓ Verified

**T-01-02 — Error Handling (Closed)**
- Location: `app/routes.py` exception handlers
- Evidence: User-friendly error message "Cannot divide by zero." with no stack trace exposure
- Evidence: All exceptions caught and converted to safe HTML responses
- Status: ✓ Verified

**T-01-03 — DoS Mitigation (Closed)**
- Location: `app/calculator.py`
- Evidence: `calculate()` function has O(1) time complexity (single arithmetic operation)
- Evidence: No loops, no recursion, no network calls
- Evidence: Input validation rejects infinity, prevents overflow
- Status: ✓ Verified

**T-01-04 — MCP Server (Closed)**
- Location: `mcp_server/server.py`
- Evidence: Two read-only tools: `get_project_context()` and `get_demo_request()`
- Evidence: No write operations, no state modification, no authentication logic
- Evidence: Server designed for trusted agent connections only
- Status: ✓ Verified

**T-01-SC — Supply Chain (Closed)**
- Evidence: Dependencies listed in `pyproject.toml` are official PyPI packages (Flask, pytest, FastMCP)
- Evidence: No local/private dependencies, no suspicious sources
- Status: ✓ Verified (external responsibility, no implementation required)

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-09-29
