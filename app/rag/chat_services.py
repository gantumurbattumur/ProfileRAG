from app.rag.retriever import Retriever
from app.llm.client import generate_answer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        try:
            logger.info("Initializing ChatService and Retriever...")
            self.retriever = Retriever()
            logger.info("ChatService initialized successfully!")
        except FileNotFoundError as e:
            logger.error(f"Failed to initialize Retriever: {e}")
            self.retriever = None
            self._init_error = str(e)
        except Exception as e:
            logger.error(f"Unexpected error initializing ChatService: {e}")
            self.retriever = None
            self._init_error = str(e)

    def chat(self, user_query: str, conversation_history: list = None): # type: ignore
        if self.retriever is None:
            raise FileNotFoundError(
                self._init_error or "Retriever not initialized. Please run the ingestion script first."
            )
        
        chunks = self.retriever.retrieve(user_query, top_k=3)
        context = "\n\n".join([c["text"] for c in chunks])

        history_messages = []
        if conversation_history:
            for msg in conversation_history[-4:]:
                history_messages.append(msg)

        prompt = f"""You are Gana's AI assistant helping visitors learn about his professional background and experience.

IMPORTANT - ONLY answer questions about:
- Gana's work experience, projects, and skills
- His education and background
- Technical abilities and expertise
- Career interests and goals
- Professional strengths and experiences

DO NOT answer questions about:
- General programming/technical advice
- Unrelated topics (weather, news, recipes, etc.)
- Requests to write code or solve problems
- Anything not directly related to Gana's professional background

Context from Gana's background:
{context}

Question: {user_query}

INSTRUCTIONS:
1. First, determine if the question is about Gana's professional background
2. If OFF-TOPIC: Respond with "I'm here to answer questions about Gana's experience and background. For other inquiries, please use the contact form to reach out directly."
3. If RELEVANT: Answer warmly in 3-4 sentences using the context provided
4. For behavioral questions, include specific examples and what was learned
5. Speak in first person as if you are Gana

Response:"""

        answer = generate_answer(prompt, conversation_history=history_messages)

        return {
            "answer": answer,
            "sources": [c["source"] for c in chunks]
        }
