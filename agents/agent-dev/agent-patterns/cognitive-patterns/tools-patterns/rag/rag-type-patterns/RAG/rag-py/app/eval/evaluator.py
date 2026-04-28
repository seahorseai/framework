from app.services.rulerouter import RuleRouterService


class Evaluator:
    def __init__(self):
        self.agent = RuleRouterService()

    def evaluate_answer(self, answer: str, expected_keywords: list[str]):
        answer_lower = answer.lower()

        matched_keywords = [
            keyword for keyword in expected_keywords
            if keyword.lower() in answer_lower
        ]

        score = len(matched_keywords) / len(expected_keywords)

        return {
            "score": round(score, 2),
            "matched_keywords": matched_keywords
        }

    def run(self):
        test_cases = [
            {
                "question": "According to the policy document, what is the refund period?",
                "expected_keywords": ["refund", "days"]
            },
            {
                "question": "What does the onboarding guide say about VPN access?",
                "expected_keywords": ["vpn", "access"]
            }
        ]

        results = []

        for case in test_cases:
            answer = self.agent.handle_question(case["question"])
            evaluation = self.evaluate_answer(
                answer,
                case["expected_keywords"]
            )

            results.append({
                "question": case["question"],
                "answer": answer,
                "evaluation": evaluation
            })

        return results