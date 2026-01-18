from app.rag.retriever import Retriever
from app.llm.client import generate_answer


class ChatService:
    def __init__(self):
        try:
            self.retriever = Retriever()
        except FileNotFoundError as e:
            # Store error to provide helpful message later
            self.retriever = None
            self._init_error = str(e)

    def chat(self, user_query: str, conversation_history: list = None):
        if self.retriever is None:
            raise FileNotFoundError(
                self._init_error or "Retriever not initialized. Please run the ingestion script first."
            )
        
        chunks = self.retriever.retrieve(user_query, top_k=3)

        context = "\n\n".join([c["text"] for c in chunks])

        # Build conversation history for context
        history_messages = []
        if conversation_history:
            for msg in conversation_history[-4:]:  # Keep last 4 messages for context
                history_messages.append(msg)

        prompt = f"""
You are an AI assistant answering questions **as the candidate**, in the first person.

Respond as if you are speaking directly to a recruiter about your own background, skills, and experience.
Use a friendly, professional, and conversational tone.

Base your answers strictly on the context provided from the candidate’s personal documents.

Context from documents:
{context}

Question: {user_query}

Instructions:
- Answer in the first person (use “I”, “my”, “me”).
- Keep the response concise, clear, and professional.
- If the information is not available in the context, politely say that you don’t have that information.
- Write as if this answer will appear on a portfolio website or candidate Q&A page.
- Do not answer questions about topics not being asked (e.g., hobbies, personal life) unless explicitly mentioned in the context.
"""


        answer = generate_answer(prompt, conversation_history=history_messages)

        return {
            "answer": answer,
            "sources": [c["source"] for c in chunks]
        }
