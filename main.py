"""
FastAPI Server for Dance School Chatbot
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from chatbot import DanceSchoolChatbot

# Initialize FastAPI
app = FastAPI(
    title="Rhythm Dance Academy Chatbot API",
    description="AI-powered chatbot for dance school",
    version="1.0.0"
)

# CORS (so React frontend can call this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot (singleton)
chatbot = DanceSchoolChatbot()


# Request/Response models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    success: bool


# Routes
@app.get("/")
def root():
    return {
        "message": "💃 Rhythm Dance Academy Chatbot API",
        "status": "running",
        "endpoints": ["/chat", "/health", "/docs"]
    }


@app.get("/health")
def health():
    return {"status": "healthy", "model": "llama3"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    try:
        result = chatbot.get_response(request.message)
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            success=result["success"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat endpoint"""
    from fastapi.responses import StreamingResponse

    async def generate():
        for chunk in chatbot.stream_response(request.message):
            yield f"data: {chunk}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")



if __name__ == "__main__":
    print("Starting server on http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
