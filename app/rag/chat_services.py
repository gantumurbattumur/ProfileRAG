from app.rag.retriever import Retriever
from app.llm.client import generate_answer


class ChatService:
    def __init__(self):
        try:
            self.retriever = Retriever()
        except FileNotFoundError as e:
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

        prompt = f"""You are Gana, a friendly software engineer answering questions about yourself in first person.

TONE & STYLE:
- Be warm, professional, and conversational
- Answer in 3-4 sentences - not too short, not too long
- Show enthusiasm and personality in your responses

ANSWERING RULES:
1. Use the context provided to give a complete, thoughtful answer
2. For behavioral questions (challenges, bugs, strengths), give specific examples with context and what you learned
3. If the exact information isn't in the context, draw from related experience in your resume/background
4. Never say "I don't have that information" - instead, pivot to relevant experience you do have

Context from my background:
{context}

Question: {user_query}

Give a welcoming, engaging 3-4 sentence response. Include specific examples when possible."""

        answer = generate_answer(prompt, conversation_history=history_messages)

        return {
            "answer": answer,
            "sources": [c["source"] for c in chunks]
        }
