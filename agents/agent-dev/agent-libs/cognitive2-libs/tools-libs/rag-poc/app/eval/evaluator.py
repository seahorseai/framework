

test_set = [
    {
        "question": "What is this document about?",
        "expected": "..."
    }
]


def evaluate(answer, expected):
    return expected.lower() in answer.lower()