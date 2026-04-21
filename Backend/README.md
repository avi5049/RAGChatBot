# 🚀 Advanced RAG-Based Document Chatbot

An industry-level **Retrieval-Augmented Generation (RAG)** system that enables users to query documents with high accuracy using hybrid search, re-ranking, and optimized context processing.

---

## 🧠 Overview

This project implements a **production-style RAG pipeline** combining:

* Semantic search (vector database)
* Keyword search (BM25)
* Multi-query expansion
* Reciprocal Rank Fusion (RRF)
* Cross-encoder re-ranking
* Context compression
* Streaming LLM responses

---

## ⚙️ Tech Stack

* **Backend:** FastAPI
* **Vector DB:** ChromaDB
* **Embeddings:** Sentence Transformers
* **LLM:** OpenAI (GPT-4o-mini)
* **Search:** BM25 (rank-bm25)
* **Re-ranking:** Cross-Encoder
* **Document Processing:** LangChain, PyPDF

---

## 🏗️ Architecture

```
User Query
   ↓
Multi-Query Generation
   ↓
Hybrid Retrieval
 (BM25 + Vector Search)
   ↓
RRF (Fusion)
   ↓
Re-ranking (Cross Encoder)
   ↓
Context Compression
   ↓
LLM (Streaming Response)
```

---

## 🔥 Features

* ✅ Hybrid search (semantic + keyword)
* ✅ Multi-query RAG for improved recall
* ✅ Reciprocal Rank Fusion (RRF)
* ✅ Cross-encoder re-ranking (precision boost)
* ✅ Context compression (reduces token usage)
* ✅ Streaming responses (real-time UX)
* ✅ Metadata-aware retrieval
* ✅ Modular and scalable architecture

---

## 📁 Project Structure

```
backend/
│
├── ingestion/
│   └── ingest.py
│
├── retrieval/
│   └── query.py
│
├── main.py
├── chroma_db/
```

---

## ⚡ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/rag-chatbot.git
cd rag-chatbot
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Add Environment Variables

Create `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

### 4. Ingest Documents

```bash
python ingestion/ingest.py
```

### 5. Run Backend

```bash
uvicorn main:app --reload
```

---

## 🧪 API Usage

### Ask Question

```
GET /ask?query=Your question
```

### Streaming Response

```
GET /ask-stream?query=Your question
```

---

## 🎯 Key Innovations

* Hybrid retrieval using **BM25 + vector search**
* Improved ranking using **RRF + cross-encoder**
* Reduced LLM cost via **context compression**
* Enhanced recall using **multi-query expansion**

---

## 📊 Future Improvements

* Redis caching for faster retrieval
* RAG evaluation using RAGAS
* Multi-modal support (OCR, images)
* Frontend UI (React)

---

## 👨‍💻 Author

**Avi Virpariya**

---

## ⭐ If you like this project, give it a star!
