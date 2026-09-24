const assert = require("node:assert/strict");
const { test } = require("node:test");

const { applyKey, pressOperator, pressEquals, calculate, MAX_LENGTH, EMPTY_STATE } = require("../../app/static/calculator.js");

function press(state, ...keys) {
    return keys.reduce(applyKey, state);
}

test("digits are typed into the accumulator before an operator is chosen", () => {
    assert.deepEqual(press(EMPTY_STATE, "1", "2", "3"), { ...EMPTY_STATE, acc: "123" });
});

test("leading zero is replaced by the next digit", () => {
    assert.equal(press(EMPTY_STATE, "0", "7").acc, "7");
    assert.equal(press(EMPTY_STATE, "sign", "0", "7").acc, "-7");
});

test("decimal point is added once and gets a leading zero", () => {
    assert.equal(press(EMPTY_STATE, ".", "5").acc, "0.5");
    assert.equal(press(EMPTY_STATE, "1", ".", "5", ".", "2").acc, "1.52");
});

test("sign toggles a leading minus", () => {
    assert.equal(press(EMPTY_STATE, "4", "sign").acc, "-4");
    assert.equal(press(EMPTY_STATE, "4", "sign", "sign").acc, "4");
});

test("backspace removes the last character", () => {
    assert.equal(press(EMPTY_STATE, "1", "2", "backspace").acc, "1");
    assert.equal(press(EMPTY_STATE, "backspace").acc, "");
});

test("clear resets everything", () => {
    const state = { acc: "6", op: "+", entry: "2" };

    assert.deepEqual(applyKey(state, "clear"), EMPTY_STATE);
});

test("numbers are limited in length", () => {
    const keys = Array(MAX_LENGTH + 5).fill("9");

    assert.equal(press(EMPTY_STATE, ...keys).acc.length, MAX_LENGTH);
});

test("digits after an operator go into the second number", () => {
    let state = press(EMPTY_STATE, "6");
    state = pressOperator(state, "+").state;
    state = press(state, "2");

    assert.deepEqual(state, { acc: "6", op: "+", entry: "2" });
});

test("pressing an operator with nothing typed uses 0 as the first number", () => {
    assert.deepEqual(pressOperator(EMPTY_STATE, "+"), { state: { acc: "0", op: "+", entry: "" }, error: null });
});

test("pressing another operator before typing the next number just changes it", () => {
    const state = { acc: "6", op: "+", entry: "" };

    assert.deepEqual(pressOperator(state, "-"), { state: { acc: "6", op: "-", entry: "" }, error: null });
});

test("pressing an operator after typing both numbers folds them into a running total", () => {
    const state = { acc: "6", op: "+", entry: "2" };

    assert.deepEqual(pressOperator(state, "*"), { state: { acc: "8", op: "*", entry: "" }, error: null });
});

test("chaining several operators computes left to right, like a real calculator", () => {
    let state = EMPTY_STATE;
    state = pressOperator(press(state, "6"), "+").state; // 6 +
    state = pressOperator(press(state, "2"), "+").state; // (6+2) +
    state = press(state, "3"); // (6+2) + 3

    assert.equal(state.acc, "8");
    assert.equal(state.entry, "3");
});

test("dividing by zero mid-chain resets and reports the error", () => {
    const state = { acc: "6", op: "/", entry: "0" };

    assert.deepEqual(pressOperator(state, "+"), { state: EMPTY_STATE, error: "division-by-zero" });
});

test("an overflowing result mid-chain resets and reports the error", () => {
    const state = { acc: "1e308", op: "*", entry: "10" };

    assert.deepEqual(pressOperator(state, "+"), { state: EMPTY_STATE, error: "overflow" });
});

test("equals with no operator chosen finishes the calculation client-side", () => {
    assert.deepEqual(pressEquals({ acc: "5", op: "", entry: "" }), {
        type: "result",
        state: { acc: "5", op: "", entry: "" },
        text: "5",
    });
});

test("equals with nothing typed at all shows 0", () => {
    assert.deepEqual(pressEquals(EMPTY_STATE), { type: "result", state: { acc: "0", op: "", entry: "" }, text: "0" });
});

test("equals with an operator pending but no second number does nothing", () => {
    assert.deepEqual(pressEquals({ acc: "6", op: "+", entry: "" }), { type: "noop" });
});

test("equals with a complete pair hands off to the server", () => {
    assert.deepEqual(pressEquals({ acc: "6", op: "+", entry: "2" }), { type: "submit", a: "6", op: "+", b: "2" });
});

test("calculate mirrors the four operators", () => {
    assert.equal(calculate("2", "+", "3"), 5);
    assert.equal(calculate("2", "-", "3"), -1);
    assert.equal(calculate("2", "*", "3"), 6);
    assert.equal(calculate("3", "/", "2"), 1.5);
});

test("calculate throws on division by zero", () => {
    assert.throws(() => calculate("1", "/", "0"), /division-by-zero/);
});

test("calculate throws on an overflowing result", () => {
    assert.throws(() => calculate("1e308", "*", "10"), /overflow/);
});
