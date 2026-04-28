from app.services.llm import LLMService
from app.services.reader import ReaderService

class RuleRouterService:
    def __init__(self):
        self.reader_service = ReaderService()
        self.llm_service = LLMService()

    
    def handle_question(self, question: str):
        use_rag = self.should_use_rag(question)

        if not use_rag:
            return self.llm_service.generate_answer(question)

        context = self.reader_service.retrieve_context(question)

        if not self.validate_context(context):
            context = self.retry_retrieval(question)

        if not self.validate_context(context):
            return "I could not find relevant information in the knowledge base."

        return self.llm_service.generate_answer(question, context)


    def should_use_rag(self, question: str):
        rag_keywords = [
            "document",
            "file",
            "according to",
            "based on",
            "policy",
            "report",
            "manual",
            "knowledge base"
        ]

        question_lower = question.lower()

        return any(keyword in question_lower for keyword in rag_keywords)
    
    def retry_retrieval(self, question: str):
        rewritten_query = self.llm_service.rewrite_query(question)
        return self.reader_service.retrieve_context(rewritten_query)

    
    def validate_context(self, context: list[str]):
        if not context:
            return False

        combined = " ".join(context).strip()

        if len(combined) < 20:
            return False

        return True

