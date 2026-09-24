import math
from collections.abc import Callable


def parse_number(value: str) -> float:
    """Convert user input to a finite float.

    Raises ValueError for text that is not a number, and for NaN or infinity.
    """
    number = float(value)
    if not math.isfinite(number):
        raise ValueError(f"Not a finite number: {value!r}")
    return number


def add(a: float, b: float) -> float:
    """Return the sum of two numbers."""
    return a + b


def subtract(a: float, b: float) -> float:
    """Return the difference of two numbers."""
    return a - b


def multiply(a: float, b: float) -> float:
    """Return the product of two numbers."""
    return a * b


def divide(a: float, b: float) -> float:
    """Return the quotient of two numbers.

    Raises ZeroDivisionError when b is zero.
    """
    return a / b


OPERATIONS: dict[str, Callable[[float, float], float]] = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}


def calculate(a: float, op: str, b: float) -> float:
    """Apply the operator symbol op (+, -, *, /) to a and b.

    Raises ValueError for an unknown operator, ZeroDivisionError when
    dividing by zero, and OverflowError when the result is too large.
    """
    try:
        operation = OPERATIONS[op]
    except KeyError:
        raise ValueError(f"Unknown operator: {op!r}") from None

    result = operation(a, b)
    if not math.isfinite(result):
        raise OverflowError("Result is too large.")
    return result
