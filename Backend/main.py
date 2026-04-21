from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from query import generate_answer, generate_answer_stream

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "RAG Chatbot Running"}

@app.get("/ask")
def ask(query: str):
    answer = generate_answer(query)
    return {
        "query": query,
        "answer": answer
    }


@app.get("/ask-stream")
def ask_stream(query: str):
    return StreamingResponse(
        generate_answer_stream(query),
        media_type="text/plain"
    )