// Keypad for the calculator form.
//
// This mimics a real pocket calculator: one display line and a keypad that
// can chain several operators together (6 + 2 + 3 =). Only the last pending
// pair of numbers is ever sent to the server: the server still does that
// arithmetic through the same /calculate endpoint as before. Earlier steps
// in a chain are computed here so the running total can be shown as you type.
//
// Without JavaScript, "legacy-controls" (plain fields for a single
// calculation) are shown instead; see index.html.
(function () {
    "use strict";

    const MAX_LENGTH = 15;

    function isDigit(key) {
        return /^[0-9]$/.test(key);
    }

    function appendDigit(value, digit) {
        if (value.replace("-", "").length >= MAX_LENGTH) {
            return value;
        }
        if (value === "0") {
            return digit;
        }
        if (value === "-0") {
            return "-" + digit;
        }
        return value + digit;
    }

    function appendDecimalPoint(value) {
        if (value.includes(".")) {
            return value;
        }
        if (value === "" || value === "-") {
            return value + "0.";
        }
        return value + ".";
    }

    function toggleSign(value) {
        return value.startsWith("-") ? value.slice(1) : "-" + value;
    }

    const OPERATIONS = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
    };

    // Mirrors app/calculator.py's calculate(), used only to preview the
    // running total while chaining. The final step is always recomputed
    // by the server, which stays the source of truth for the result shown.
    function calculate(a, op, b) {
        const x = parseFloat(a);
        const y = parseFloat(b);
        if (op === "/" && y === 0) {
            throw new Error("division-by-zero");
        }
        const result = OPERATIONS[op](x, y);
        if (!Number.isFinite(result)) {
            throw new Error("overflow");
        }
        return result;
    }

    // Pure state: { acc, op, entry }.
    //   - Before an operator is chosen, digits go into "acc" (the number
    //     being typed).
    //   - Once an operator is chosen, digits go into "entry" (the next
    //     number), and "acc" holds the running total.
    const EMPTY_STATE = { acc: "", op: "", entry: "" };

    function activeField(state) {
        return state.op === "" ? "acc" : "entry";
    }

    function applyKey(state, key) {
        if (key === "clear") {
            return { ...EMPTY_STATE };
        }

        const field = activeField(state);

        if (isDigit(key) || key === ".") {
            const next = key === "." ? appendDecimalPoint(state[field]) : appendDigit(state[field], key);
            return { ...state, [field]: next };
        }
        if (key === "sign") {
            return { ...state, [field]: toggleSign(state[field]) };
        }
        if (key === "backspace") {
            return { ...state, [field]: state[field].slice(0, -1) };
        }
        return state;
    }

    // Choosing an operator either starts the chain, changes the pending
    // operator, or (if a number was already typed after the last operator)
    // folds it into the running total and continues the chain.
    function pressOperator(state, op) {
        if (state.op === "") {
            return { state: { acc: state.acc || "0", op, entry: "" }, error: null };
        }
        if (state.entry === "") {
            return { state: { ...state, op }, error: null };
        }
        try {
            const total = calculate(state.acc, state.op, state.entry);
            return { state: { acc: String(total), op, entry: "" }, error: null };
        } catch (err) {
            return { state: { ...EMPTY_STATE }, error: err.message };
        }
    }

    // "=" either finishes the calculation client-side (no operator was ever
    // chosen, so there is nothing for the server to compute), hands off the
    // last pending pair to the server, or does nothing (an operator is
    // pending but its second number hasn't been typed yet).
    function pressEquals(state) {
        if (state.op === "") {
            const text = state.acc !== "" ? state.acc : "0";
            return { type: "result", state: { acc: text, op: "", entry: "" }, text };
        }
        if (state.entry === "") {
            return { type: "noop" };
        }
        return { type: "submit", a: state.acc, op: state.op, b: state.entry };
    }

    const KEYBOARD_KEYS = {
        Escape: "clear",
        Delete: "clear",
        Backspace: "backspace",
        ",": ".",
    };
    const KEYBOARD_OPERATORS = { "+": "+", "-": "-", "*": "*", "/": "/" };

    function init(form) {
        const expressionEl = form.querySelector("[data-expression]");
        const announceEl = form.querySelector("[data-announce]");
        const fields = { a: form.elements.a, op: form.elements.op, b: form.elements.b };
        const operatorSymbols = JSON.parse(form.dataset.operatorSymbols || "{}");
        const errorMessages = {
            "division-by-zero": form.dataset.divisionByZeroMessage,
            overflow: form.dataset.overflowMessage,
        };

        let state = { ...EMPTY_STATE };
        let message = null; // { kind: "result" | "error", text } or null

        if (form.dataset.result) {
            state = { acc: form.dataset.result, op: "", entry: "" };
            message = { kind: "result", text: form.dataset.result };
        } else if (form.dataset.a || form.dataset.op || form.dataset.b) {
            state = { acc: form.dataset.a, op: form.dataset.op, entry: form.dataset.b };
            const existingError = form.querySelector(".error");
            if (existingError) {
                message = { kind: "error", text: existingError.textContent.trim() };
            }
        }

        function buildExpressionText() {
            if (state.acc === "" && state.op === "") {
                return state.entry || "0";
            }
            const symbol = state.op ? operatorSymbols[state.op] || state.op : "";
            return `${state.acc || "0"}${symbol ? " " + symbol + " " : ""}${state.entry}`;
        }

        function render() {
            fields.a.value = state.acc;
            fields.b.value = state.entry;
            for (const radio of fields.op) {
                radio.checked = radio.value === state.op;
            }

            const text = message ? message.text : buildExpressionText();
            expressionEl.textContent = text;
            expressionEl.classList.toggle("is-error", message?.kind === "error");
            expressionEl.scrollLeft = expressionEl.scrollWidth;

            for (const button of form.querySelectorAll("[data-operator]")) {
                button.classList.toggle("is-pending", !message && button.dataset.operator === state.op);
            }
        }

        function announce(text) {
            announceEl.textContent = text;
        }

        // A digit, an operator, or "=" pressed right after a shown result or
        // error starts fresh, using the result as the new first number.
        function continueFromMessage() {
            if (!message) {
                return;
            }
            state = message.kind === "result" ? { acc: message.text, op: "", entry: "" } : { ...EMPTY_STATE };
            message = null;
        }

        function pressKey(key) {
            if (key !== "clear") {
                continueFromMessage();
            }
            state = applyKey(state, key);
            message = null;
            render();
        }

        function pressOp(op) {
            continueFromMessage();
            const outcome = pressOperator(state, op);
            state = outcome.state;
            message = outcome.error ? { kind: "error", text: errorMessages[outcome.error] } : null;
            if (message) {
                announce(message.text);
            }
            render();
        }

        function pressEqualsKey() {
            continueFromMessage();
            const outcome = pressEquals(state);
            if (outcome.type === "noop") {
                return false; // nothing to submit or show
            }
            if (outcome.type === "result") {
                state = outcome.state;
                message = { kind: "result", text: outcome.text };
                announce(outcome.text);
                render();
                return false;
            }
            fields.a.value = outcome.a;
            fields.b.value = outcome.b;
            for (const radio of fields.op) {
                radio.checked = radio.value === outcome.op;
            }
            return true; // let the browser submit the form to the server
        }

        form.addEventListener("click", (event) => {
            const operatorButton = event.target.closest("[data-operator]");
            if (operatorButton) {
                pressOp(operatorButton.dataset.operator);
                return;
            }
            const keyButton = event.target.closest("[data-key]");
            if (keyButton) {
                pressKey(keyButton.dataset.key);
            }
        });

        form.addEventListener("submit", (event) => {
            if (!pressEqualsKey()) {
                event.preventDefault();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }
            if (KEYBOARD_OPERATORS[event.key]) {
                event.preventDefault();
                pressOp(KEYBOARD_OPERATORS[event.key]);
                return;
            }
            if (event.key === "Enter" || event.key === "=") {
                if (event.target.closest("button")) {
                    return; // let the focused button handle its own Enter press
                }
                event.preventDefault();
                form.requestSubmit();
                return;
            }
            const key = KEYBOARD_KEYS[event.key] || event.key;
            if (isDigit(key) || [".", "clear", "backspace"].includes(key)) {
                event.preventDefault();
                pressKey(key);
            }
        });

        form.classList.add("is-enhanced");
        render();
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { applyKey, pressOperator, pressEquals, calculate, MAX_LENGTH, EMPTY_STATE };
    } else {
        document.querySelectorAll("[data-calculator]").forEach(init);
    }
})();
