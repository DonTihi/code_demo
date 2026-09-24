from flask import Blueprint, render_template, request

from . import calculator

INVALID_INPUT_MESSAGE = "Please enter two valid numbers."
INVALID_OPERATOR_MESSAGE = "Please choose a valid operator."
DIVISION_BY_ZERO_MESSAGE = "Cannot divide by zero."
OVERFLOW_MESSAGE = "The result is too large."

OPERATOR_LABELS = {"+": "+", "-": "−", "*": "×", "/": "÷"}

bp = Blueprint("main", __name__)


def _render(status: int = 200, **context):
    return render_template("index.html", operators=OPERATOR_LABELS, **context), status


@bp.get("/")
def index():
    return _render()


@bp.post("/calculate")
def calculate():
    try:
        a = calculator.parse_number(request.form["a"])
        b = calculator.parse_number(request.form["b"])
    except (KeyError, ValueError):
        return _render(400, error=INVALID_INPUT_MESSAGE)

    op = request.form.get("op", "+")
    if op not in calculator.OPERATIONS:
        return _render(400, error=INVALID_OPERATOR_MESSAGE)

    try:
        result = calculator.calculate(a, op, b)
    except ZeroDivisionError:
        return _render(400, error=DIVISION_BY_ZERO_MESSAGE)
    except OverflowError:
        return _render(400, error=OVERFLOW_MESSAGE)

    return _render(result=result)
