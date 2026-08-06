"""
Core Chatbot Logic with RAG using Ollama + LangChain
 Fixed: Correct imports for langchain v0.2+
"""
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.prompts import ChatPromptTemplate          #  FIXED
from langchain_core.runnables import RunnablePassthrough        #  FIXED
from langchain_core.output_parsers import StrOutputParser       #  FIXED
from dotenv import load_dotenv
import os

load_dotenv()


class DanceSchoolChatbot:
    def __init__(self):
        self.llm_model = os.getenv("LLM_MODEL", "llama3")
        self.embedding_model = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")
        self.vector_store_path = "vector_store"
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

        # Load vector store
        print("Loading embeddings model...")
        self.embeddings = OllamaEmbeddings(
            model=self.embedding_model,
            base_url=self.ollama_base_url
        )

        print("Loading vector store...")
        self.vectorstore = Chroma(
            persist_directory=self.vector_store_path,
            embedding_function=self.embeddings,
            collection_name="dance_school_kb"
        )
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
        print(f"Vector store loaded: {self.vectorstore._collection.count()} vectors")

        # Initialize LLM
        print(f"Loading LLM: {self.llm_model}...")
        self.llm = ChatOllama(
            model=self.llm_model,
            base_url=self.ollama_base_url,
            temperature=0.7,
            num_predict=512
        )
        print("LLM loaded successfully")

        # Create prompt template
        self.template = """You are a friendly and helpful AI assistant for "Rhythm Dance Academy", a dance school.

Your role is to:
- Answer questions about classes, schedules, pricing, instructors
- Help potential students find the right class
- Be warm, enthusiastic, and professional
- Use emojis occasionally to be friendly 💃🕺
- If you don't know something, suggest contacting the school directly

IMPORTANT RULES:
- Use ONLY the context provided below to answer
- If the answer isn't in the context, say "I don't have that information, but our team can help! Call (555) 123-DANCE"
- Don't make up information
- Keep answers concise (2-4 sentences) unless more detail is needed

Context from our knowledge base:
{context}

Student's question: {question}

Your friendly response:"""

        self.prompt = ChatPromptTemplate.from_template(self.template)  #  NOW WORKS

        # Build RAG chain
        self.rag_chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
        print("🎉 Chatbot ready!\n")

    def get_response(self, question: str) -> dict:
        """Get chatbot response with sources"""
        try:
            print(f"Question: {question}")

            # Get relevant documents
            relevant_docs = self.retriever.invoke(question)
            print(f"Found {len(relevant_docs)} relevant documents")

            # Get answer
            answer = self.rag_chain.invoke(question)
            print(f"Answer generated")

            # Extract sources
            sources = []
            for doc in relevant_docs:
                sources.append({
                    "category": doc.metadata.get("category", "general"),
                    "question": doc.metadata.get("question", "")
                })

            return {
                "answer": answer,
                "sources": sources,
                "success": True
            }
        except Exception as e:
            print(f"Error: {str(e)}")
            return {
                "answer": "Sorry, I'm having trouble right now. Please try again or call (555) 123-DANCE.",
                "sources": [],
                "success": False,
                "error": str(e)
            }

    def stream_response(self, question: str):
        """Stream response token by token"""
        try:
            relevant_docs = self.retriever.invoke(question)
            context_text = "\n\n".join([doc.page_content for doc in relevant_docs])

            formatted_prompt = self.template.format(
                context=context_text,
                question=question
            )

            for chunk in self.llm.stream(formatted_prompt):
                yield chunk.content
        except Exception as e:
            yield f"Error: {str(e)}"


# Test it directly
if __name__ == "__main__":
    print("=" * 60)
    print("TESTING CHATBOT")
    print("=" * 60)

    bot = DanceSchoolChatbot()

    test_questions = [
        "What classes do you offer?",
        "How much does it cost?",
        "I'm a beginner, what should I start with?",
        "What are your hours?",
    ]

    for q in test_questions:
        print(f"\n{'='*60}")
        result = bot.get_response(q)
        print(f"Q: {q}")
        print(f"A: {result['answer']}")
        print(f"Sources: {[s['category'] for s in result['sources']]}")
        print(f"Success: {result['success']}")
