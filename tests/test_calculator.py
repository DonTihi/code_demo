import pytest

from app.calculator import OPERATIONS, add, calculate, divide, multiply, parse_number, subtract


def test_adds_two_numbers():
    assert add(2, 3) == 5


def test_add_supports_decimals():
    assert add(1.5, 2.25) == 3.75


def test_subtracts_two_numbers():
    assert subtract(5, 3) == 2
    assert subtract(3, 5) == -2


def test_multiplies_two_numbers():
    assert multiply(4, 2.5) == 10
    assert multiply(-3, 3) == -9


def test_divides_two_numbers():
    assert divide(7, 2) == 3.5
    assert divide(-9, 3) == -3


def test_divide_by_zero_raises():
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)


def test_operations_support_exactly_four_operators():
    assert set(OPERATIONS) == {"+", "-", "*", "/"}


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


@pytest.mark.parametrize("op", ["%", "", "plus", "**"])
def test_calculate_rejects_unknown_operator(op):
    with pytest.raises(ValueError):
        calculate(1, op, 2)


def test_calculate_divide_by_zero_raises():
    with pytest.raises(ZeroDivisionError):
        calculate(1, "/", 0)


def test_calculate_rejects_overflowing_result():
    with pytest.raises(OverflowError):
        calculate(1e308, "*", 10)


@pytest.mark.parametrize(
    ("value", "expected"),
    [("2", 2.0), ("-1.5", -1.5), (" 3 ", 3.0), ("1e3", 1000.0)],
)
def test_parse_number_accepts_numbers(value, expected):
    assert parse_number(value) == expected


@pytest.mark.parametrize("value", ["", "abc", "nan", "inf", "-inf"])
def test_parse_number_rejects_invalid_values(value):
    with pytest.raises(ValueError):
        parse_number(value)
