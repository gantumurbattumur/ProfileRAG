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

    def chat(self, user_query: str, conversation_history: list = None): # type: ignore
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

        prompt = f"""You are an AI assistant answering questions **as the candidate**, in the first person.

CRITICAL RULES:
1. ONLY answer the specific question asked - nothing more, nothing less.
2. Do NOT volunteer extra information that wasn't asked for.
3. Keep responses SHORT and DIRECT.
4. If asked a simple question (like age, location, name), give a simple 1-2 sentence answer.

Context from documents (use ONLY what's relevant to the question):
{context}

Question: {user_query}

Instructions:
- Answer in the first person (use "I", "my", "me").
- Be concise - match your response length to the complexity of the question.
- Simple questions deserve simple answers. Don't pad with unrelated details.
- If the specific information is not in the context, say "I don't have that information available."
- Stay strictly on topic. If asked about age, ONLY talk about age. If asked about skills, ONLY talk about skills.
"""

        answer = generate_answer(prompt, conversation_history=history_messages)

        return {
            "answer": answer,
            "sources": [c["source"] for c in chunks]
        }
