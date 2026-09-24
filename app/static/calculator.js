// Keypad for the calculator form.
//
// The server still does the arithmetic: the keypad only fills in the "a" and
// "b" fields and picks the operator, and "=" submits the form. Without
// JavaScript the fields can still be typed into directly.
(function () {
    "use strict";

    const MAX_LENGTH = 15;

    function isDigit(key) {
        return /^[0-9]$/.test(key);
    }

    // State: { a, b, active: "a" | "b", result }. `result` holds the last
    // result shown by the server; it is cleared as soon as the user continues.

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

    // After a result, a digit starts a new calculation; any other key
    // continues with the result as the first number.
    function continueFromResult(state) {
        if (state.result === "") {
            return state;
        }
        return { a: state.result, b: "", active: "a", result: "" };
    }

    function applyKey(state, key) {
        if (key === "clear") {
            return { a: "", b: "", active: "a", result: "" };
        }

        if (isDigit(key) || key === ".") {
            if (state.result !== "") {
                state = { a: "", b: "", active: "a", result: "" };
            }
            const value = state[state.active];
            const next = key === "." ? appendDecimalPoint(value) : appendDigit(value, key);
            return { ...state, [state.active]: next };
        }

        state = continueFromResult(state);

        if (key === "sign") {
            return { ...state, [state.active]: toggleSign(state[state.active]) };
        }
        if (key === "backspace") {
            return { ...state, [state.active]: state[state.active].slice(0, -1) };
        }
        return state;
    }

    function chooseOperator(state) {
        return { ...continueFromResult(state), active: "b" };
    }

    const KEYBOARD_KEYS = {
        Escape: "clear",
        Delete: "clear",
        Backspace: "backspace",
        ",": ".",
    };

    function init(form) {
        const fields = { a: form.elements.a, b: form.elements.b };
        const operatorDisplay = form.querySelector("[data-operator-display]");
        let state = {
            a: fields.a.value,
            b: fields.b.value,
            active: fields.a.value ? "b" : "a",
            result: form.dataset.result || "",
        };

        function render() {
            for (const [name, field] of Object.entries(fields)) {
                field.value = state[name];
                field.classList.toggle("is-active", name === state.active);
            }
            const checked = form.querySelector('input[name="op"]:checked');
            operatorDisplay.textContent = checked ? checked.nextElementSibling.textContent : "";
        }

        function selectOperator(radio) {
            radio.checked = true;
            state = chooseOperator(state);
            render();
        }

        for (const field of Object.values(fields)) {
            // Use the on-screen keypad instead of the phone's keyboard.
            field.inputMode = "none";
            field.addEventListener("focus", () => {
                state = { ...state, active: field.name };
                render();
            });
            field.addEventListener("input", () => {
                state = { ...state, [field.name]: field.value, result: "" };
            });
        }

        form.addEventListener("click", (event) => {
            if (event.target.name === "op") {
                selectOperator(event.target);
                return;
            }
            const button = event.target.closest("[data-key]");
            if (button) {
                state = applyKey(state, button.dataset.key);
                render();
            }
        });

        // Physical keyboard support when no text field has focus.
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey || event.target.matches("input[type=text]")) {
                return;
            }
            const radio = form.querySelector(`input[name="op"][value="${CSS.escape(event.key)}"]`);
            if (radio) {
                event.preventDefault();
                selectOperator(radio);
                return;
            }
            if (event.key === "Enter" || event.key === "=") {
                if (event.target.closest("button, label")) {
                    return; // let buttons and operator keys handle Enter themselves
                }
                event.preventDefault();
                form.requestSubmit();
                return;
            }
            const key = KEYBOARD_KEYS[event.key] || event.key;
            if (isDigit(key) || [".", "clear", "backspace"].includes(key)) {
                event.preventDefault();
                state = applyKey(state, key);
                render();
            }
        });

        form.classList.add("is-enhanced");
        render();
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { applyKey, chooseOperator, MAX_LENGTH };
    } else {
        document.querySelectorAll("[data-calculator]").forEach(init);
    }
})();
