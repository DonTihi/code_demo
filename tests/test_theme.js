const assert = require("node:assert/strict");
const { test } = require("node:test");

const { getTheme, DARK, LIGHT } = require("../app/static/theme.js");

// Mock localStorage
let storage = {};
global.localStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, value) => {
        storage[key] = value;
    },
};

test("getTheme returns DARK when localStorage has dark theme", () => {
    storage = { "calculator-theme": DARK };
    assert.equal(getTheme(), DARK);
});

test("getTheme returns LIGHT when localStorage has light theme", () => {
    storage = { "calculator-theme": LIGHT };
    assert.equal(getTheme(), LIGHT);
});

test("getTheme returns a string value", () => {
    storage = { "calculator-theme": "dark" };
    assert.equal(typeof getTheme(), "string");
});

test("DARK constant equals 'dark'", () => {
    assert.equal(DARK, "dark");
});

test("LIGHT constant equals 'light'", () => {
    assert.equal(LIGHT, "light");
});
