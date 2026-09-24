import shutil
import subprocess
from pathlib import Path

import pytest

JS_TESTS = Path(__file__).resolve().parent / "js"


@pytest.mark.skipif(shutil.which("node") is None, reason="Node.js is not installed")
def test_keypad_javascript_tests_pass():
    """Run the keypad unit tests in tests/js with Node's built-in test runner."""
    result = subprocess.run(
        ["node", "--test", *sorted(str(path) for path in JS_TESTS.glob("*.test.js"))],
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stdout + result.stderr
