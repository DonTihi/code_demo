const assert = require("node:assert/strict");
const { test } = require("node:test");

const { applyKey, chooseOperator, MAX_LENGTH } = require("../../app/static/calculator.js");

const EMPTY = { a: "", b: "", active: "a", result: "" };

function press(state, ...keys) {
    return keys.reduce(applyKey, state);
}

test("digits are typed into the first number", () => {
    assert.deepEqual(press(EMPTY, "1", "2", "3"), { ...EMPTY, a: "123" });
});

test("choosing an operator moves input to the second number", () => {
    let state = press(EMPTY, "6");
    state = chooseOperator(state);
    state = press(state, "2");

    assert.deepEqual(state, { a: "6", b: "2", active: "b", result: "" });
});

test("leading zero is replaced by the next digit", () => {
    assert.equal(press(EMPTY, "0", "7").a, "7");
    assert.equal(press(EMPTY, "sign", "0", "7").a, "-7");
});

test("decimal point is added once and gets a leading zero", () => {
    assert.equal(press(EMPTY, ".", "5").a, "0.5");
    assert.equal(press(EMPTY, "1", ".", "5", ".", "2").a, "1.52");
    assert.equal(press(EMPTY, "sign", ".", "5").a, "-0.5");
});

test("sign toggles a leading minus", () => {
    assert.equal(press(EMPTY, "4", "sign").a, "-4");
    assert.equal(press(EMPTY, "4", "sign", "sign").a, "4");
});

test("backspace removes the last character", () => {
    assert.equal(press(EMPTY, "1", "2", "backspace").a, "1");
    assert.equal(press(EMPTY, "backspace").a, "");
});

test("clear resets everything", () => {
    const state = { a: "6", b: "2", active: "b", result: "12.0" };

    assert.deepEqual(applyKey(state, "clear"), EMPTY);
});

test("numbers are limited in length", () => {
    const keys = Array(MAX_LENGTH + 5).fill("9");

    assert.equal(press(EMPTY, ...keys).a.length, MAX_LENGTH);
    assert.equal(press(EMPTY, "sign", ...keys).a.length, MAX_LENGTH + 1);
});

test("a digit after a result starts a new calculation", () => {
    const state = { a: "6", b: "2", active: "b", result: "12.0" };

    assert.deepEqual(applyKey(state, "5"), { ...EMPTY, a: "5" });
});

test("an operator after a result continues from the result", () => {
    const state = { a: "6", b: "2", active: "b", result: "12.0" };

    assert.deepEqual(chooseOperator(state), { a: "12.0", b: "", active: "b", result: "" });
});

test("sign and backspace after a result edit the result", () => {
    const state = { a: "6", b: "2", active: "b", result: "12.0" };

    assert.deepEqual(applyKey(state, "sign"), { a: "-12.0", b: "", active: "a", result: "" });
    assert.deepEqual(applyKey(state, "backspace"), { a: "12.", b: "", active: "a", result: "" });
});

test("unknown keys leave the state unchanged", () => {
    const state = { a: "6", b: "", active: "a", result: "" };

    assert.deepEqual(applyKey(state, "x"), state);
});
