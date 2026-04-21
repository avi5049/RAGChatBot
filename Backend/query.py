import os
from dotenv import load_dotenv
import chromadb
from sentence_transformers import SentenceTransformer, CrossEncoder
from openai import OpenAI
from rank_bm25 import BM25Okapi

# Load environment variables
load_dotenv()


# 1.Init
model = SentenceTransformer("all-MiniLM-L6-v2")
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


# 2.Load DB
client = chromadb.Client(
    settings=chromadb.config.Settings(
        persist_directory="./chroma_db"
    )
)

collection = client.get_collection(name="docs")
client_llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# 3.MULTI QUERY GENERATION
def generate_multi_queries(query):
    prompt = f"""
Generate 3 short rephrasings of the query.
Return each on a new line. No numbering.

Query: {query}
"""

    response = client_llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.choices[0].message.content
    queries = [q.strip() for q in raw.split("\n") if len(q.strip()) > 5]

    return queries[:3]



# 4.Best Matching 25 Retrieval 
data = collection.get()
ALL_DOCS = data["documents"]

TOKENIZED_DOCS = [doc.split() for doc in ALL_DOCS]
BM25 = BM25Okapi(TOKENIZED_DOCS)

def bm25_retrieval(query):
    return BM25.get_top_n(query.split(), ALL_DOCS, n=5)


# def get_all_documents():
#     data = collection.get()
#     docs = data["documents"]
#     return docs

# def bm25_retrieval(query, documents):
#     tokenized_docs = [doc.split() for doc in documents]
#     bm25 = BM25Okapi(tokenized_docs)

#     return bm25.get_top_n(query.split(), documents, n=5)

# 5.VECTOR Retrieval
def vector_retrieval(query):
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    return results["documents"][0]

# 6.Reciprocal Rank Fusion
def rrf(rank_lists, k=60):
    scores = {}

    for lst in rank_lists:
        for rank, doc in enumerate(lst):
            if doc not in scores:
                scores[doc] = 0
            scores[doc] += 1 / (k + rank + 1)

    return sorted(scores, key=scores.get, reverse=True)

# 7.Deduplication
def deduplicate_lists(lists):
    seen = set()
    new_lists = []

    for lst in lists:
        filtered = []
        for doc in lst:
            if doc not in seen:
                seen.add(doc)
                filtered.append(doc)
        new_lists.append(filtered)

    return new_lists

# 8.RE-RANKING
def rerank(query, docs, top_k=5):
    pairs = [(query, doc) for doc in docs]
    scores = reranker.predict(pairs)

    scored_docs = list(zip(docs, scores))
    scored_docs.sort(key=lambda x: x[1], reverse=True)

    return [doc for doc, _ in scored_docs[:top_k]]

# 9.CONTEXT COMPRESSION
def compress_context(query, docs):
    compressed = "\n\n".join(docs)

    prompt = f"""
Extract only the most relevant part of this text for the query.

Query: {query}

Text:
{compressed}
"""

    response = client_llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return [response.choices[0].message.content]


# 9.Build Context
def build_context(docs):
    context = ""
    for i, doc in enumerate(docs):
        context += f"[Chunk {i+1}]\n{doc}\n\n"
    return context

# 10.MAIN PIPELINE
def generate_answer(query):

    #  Step 1: Multi-query
    queries = generate_multi_queries(query)
    queries.append(query)

    print("\n Generated Queries:", queries)

    #  Step 2: Hybrid retrieval
    all_results = []

    for q in queries:
        bm25_docs = bm25_retrieval(q)
        vector_docs = vector_retrieval(q)

        all_results.append(bm25_docs)
        all_results.append(vector_docs)
    
    # Step 3: Deduplicate
    all_results = deduplicate_lists(all_results)

    #  Step 4: RRF Fusion
    fused_docs = rrf(all_results)

    if not fused_docs:
        return "No relevant information found."

    print("\n After RRF:", fused_docs[:5])

    #  Step 5: Re-ranking
    top_docs = rerank(query, fused_docs[:20], top_k=5)

    #  Step 6:  Compression
    compressed_docs = compress_context(query, top_docs)

    #  Step 7: Build Context
    context = build_context(compressed_docs)

    #  Step 8: LLM
    prompt = f"""
You are a helpful AI assistant.

Answer ONLY from the context below.
If the answer is not present, say "I don't know".

Context:
{context}

Question:
{query}
"""

    response = client_llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content


# STREAMING VERSION
def generate_answer_stream(query):

    queries = generate_multi_queries(query)
    queries.append(query)

    all_results = []
    for q in queries:
        bm25_docs = bm25_retrieval(q)
        vector_docs = vector_retrieval(q)

        all_results.append(bm25_docs)
        all_results.append(vector_docs)

    all_results = deduplicate_lists(all_results)

    fused_docs = rrf(all_results)

    if not fused_docs:
        yield "No relevant information found."
        return

    # Re-ranking
    top_docs = rerank(query, fused_docs[:20], top_k=5)

    # Compression
    compressed_docs = compress_context(query, top_docs)

    context = build_context(compressed_docs)

    prompt = f"""
Answer ONLY from context:

{context}

Question: {query}
"""

    stream = client_llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content









