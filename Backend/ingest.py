from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer


import os
from dotenv import load_dotenv
import chromadb

# Load environment variables
load_dotenv()

# 1.Initialize ChromaDB
client = chromadb.Client(
    settings=chromadb.config.Settings(
        persist_directory=os.getenv("CHROMA_DB_PATH", "./chroma_db")
    )
)

collection = client.get_or_create_collection(name="docs")

# 2.Load PDF
loader = PyPDFLoader("data/sample.pdf")
documents = loader.load()


# 3.Chunking
#   1.Structure-Based Chunking

def structure_split(documents):
    structured_docs = []

    for doc in documents:
        text = doc.page_content
        
        sections = text.split("\n\n")

        for section in sections:
            if len(section.strip()) > 100:  
                structured_docs.append({
                    "text": section,
                    "metadata": doc.metadata
                })

    return structured_docs


#   2.Recursive Chunking 

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

def recursive_chunk(structured_docs):
    final_chunks = []

    for doc in structured_docs:
        chunks = splitter.split_text(doc["text"])

        for chunk in chunks:
            if len(chunk.strip()) < 100:  
                continue

            final_chunks.append({
                "text": chunk,
                "metadata": {
                    "page": doc["metadata"].get("page", 0),
                    "length": len(chunk)
                }
            })

    return final_chunks


structured_docs = structure_split(documents)
final_chunks = recursive_chunk(structured_docs)


print(f"Total chunks: {len(final_chunks)}")



model = SentenceTransformer("all-MiniLM-L6-v2")

for i, chunk in enumerate(final_chunks):
    embedding = model.encode(chunk["text"]).tolist()

    collection.add(
        documents=[chunk["text"]],
        embeddings=[embedding],
        metadatas=[{
            "page": chunk["metadata"].get("page", 0),
            "length": len(chunk["text"])
        }],
        ids=[f"doc_{i}"]
    )