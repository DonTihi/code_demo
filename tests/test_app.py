import pytest
from flask import Flask

from app import create_app


def test_create_app_with_defaults():
    app = create_app()

    assert isinstance(app, Flask)
    assert app.testing is False
    assert "main.calculate" in app.view_functions


def test_create_app_applies_config():
    app = create_app({"TESTING": True, "CUSTOM": "value"})

    assert app.testing is True
    assert app.config["CUSTOM"] == "value"


def test_home_page_contains_calculate_button(client):
    response = client.get("/")

    assert response.status_code == 200
    assert b"Calculate" in response.data


def test_calculate_button_is_red(client):
    response = client.get("/static/style.css")

    assert response.status_code == 200
    assert b"background: #dc2626;" in response.data
    assert b"#2563eb" not in response.data


def test_calculate_endpoint_returns_result(client):
    response = client.post("/calculate", data={"a": "2", "b": "3"})

    assert response.status_code == 200
    assert b"5.0" in response.data


def test_calculate_keeps_entered_values(client):
    response = client.post("/calculate", data={"a": "2", "b": "3"})

    assert b'value="2"' in response.data
    assert b'value="3"' in response.data


@pytest.mark.parametrize(
    ("symbol", "name"),
    [("+", "Add"), ("-", "Subtract"), ("*", "Multiply"), ("/", "Divide")],
)
def test_home_page_offers_operator_buttons(client, symbol, name):
    response = client.get("/")

    expected = f'<input type="radio" name="op" value="{symbol}" aria-label="{name}"'
    assert expected.encode() in response.data


def test_home_page_selects_addition_by_default(client):
    response = client.get("/")

    assert b'value="+" aria-label="Add" checked>' in response.data
    assert response.data.count(b" checked>") == 1


@pytest.mark.parametrize(
    ("op", "expected"),
    [("+", b"8.0"), ("-", b"4.0"), ("*", b"12.0"), ("/", b"3.0")],
)
def test_calculate_endpoint_applies_operator(client, op, expected):
    response = client.post("/calculate", data={"a": "6", "op": op, "b": "2"})

    assert response.status_code == 200
    assert b"Result: <strong>" + expected + b"</strong>" in response.data


def test_calculate_keeps_selected_operator(client):
    response = client.post("/calculate", data={"a": "6", "op": "*", "b": "2"})

    assert b'value="*" aria-label="Multiply" checked>' in response.data
    assert response.data.count(b" checked>") == 1


def test_calculate_rejects_unknown_operator(client):
    response = client.post("/calculate", data={"a": "6", "op": "%", "b": "2"})

    assert response.status_code == 400
    assert b"Please choose a valid operator." in response.data


def test_calculate_rejects_division_by_zero(client):
    response = client.post("/calculate", data={"a": "6", "op": "/", "b": "0"})

    assert response.status_code == 400
    assert b"Cannot divide by zero." in response.data


def test_calculate_rejects_overflowing_result(client):
    response = client.post("/calculate", data={"a": "1e308", "op": "*", "b": "10"})

    assert response.status_code == 400
    assert b"The result is too large." in response.data


@pytest.mark.parametrize(
    "data",
    [
        {"a": "abc", "b": "3"},
        {"a": "2", "b": ""},
        {"a": "nan", "b": "1"},
        {"a": "inf", "b": "1"},
        {"a": "2"},
        {},
    ],
)
def test_calculate_rejects_invalid_input(client, data):
    response = client.post("/calculate", data=data)

    assert response.status_code == 400
    assert b"Please enter two valid numbers." in response.data
