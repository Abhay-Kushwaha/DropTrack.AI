import os
import shutil
from pathlib import Path

from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS


# -------------------------------------------------------------------
# Env & constants (same shape as your scripts)
# -------------------------------------------------------------------
load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# default location compatible with your scripts
VECTORSTORE_PATH = os.environ.get("VECTORSTORE_PATH", "vectorstore/db_faiss")
DATA_PATH_DEFAULT = os.environ.get("RAG_DATA_PATH", "data/")

# -------------------------------------------------------------------
# Prompt (kept identical to your originals)
# -------------------------------------------------------------------
CUSTOM_PROMPT_TEMPLATE = """
Use the pieces of information provided in the context to answer user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Don't provide anything out of the context.

Context: {context}
Question: {question}

Start the answer directly. No small talk please.
"""

def get_prompt():
    return PromptTemplate(
        template=CUSTOM_PROMPT_TEMPLATE,
        input_variables=["context", "question"]
    )

# -------------------------------------------------------------------
# Embeddings & Vectorstore
# -------------------------------------------------------------------
def get_embedding_model():
    return OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

def _ensure_dir(p: str):
    Path(p).parent.mkdir(parents=True, exist_ok=True)

def load_vectorstore():
    # load FAISS index from disk
    embedding_model = get_embedding_model()
    db = FAISS.load_local(
        VECTORSTORE_PATH,
        embedding_model,
        allow_dangerous_deserialization=True
    )
    return db

def build_vectorstore_from_dir(data_path: str = DATA_PATH_DEFAULT):
    """
    Build (or rebuild) the FAISS index from all PDFs in data_path.
    Matches your create_memory_for_llm.py behavior.
    """
    # load PDFs
    loader = DirectoryLoader(data_path, glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    # split to chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    # embed & save FAISS
    embedding_model = get_embedding_model()
    db = FAISS.from_documents(chunks, embedding_model)
    _ensure_dir(VECTORSTORE_PATH)
    db.save_local(VECTORSTORE_PATH)

    return {"documents": len(documents), "chunks": len(chunks)}

def build_vectorstore_from_uploaded_files(file_paths):
    """
    Accepts a list of temp file paths (PDFs), puts them in a temp dir and builds.
    """
    tmp_dir = Path(".rag_tmp_uploads")
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
    tmp_dir.mkdir(parents=True, exist_ok=True)

    for p in file_paths:
        shutil.copy(p, tmp_dir / Path(p).name)

    stats = build_vectorstore_from_dir(str(tmp_dir))

    # cleanup
    shutil.rmtree(tmp_dir, ignore_errors=True)
    return stats

# -------------------------------------------------------------------
# LLM / QA Chain
# -------------------------------------------------------------------
def load_llm(model_name="gpt-3.5-turbo", temperature=0.5, max_tokens=512):
    return ChatOpenAI(
        openai_api_key=OPENAI_API_KEY,
        model_name=model_name,
        temperature=temperature,
        max_tokens=max_tokens
    )

def _get_retriever(k=3):
    db = load_vectorstore()
    return db.as_retriever(search_kwargs={"k": k})

def answer_question(question: str, k: int = 3):
    """
    Runs RetrievalQA over the saved FAISS index.
    Mirrors connect_memory_with_llm/scholarship_bot.
    """
    retriever = _get_retriever(k=k)
    qa_chain = RetrievalQA.from_chain_type(
        llm=load_llm(model_name="gpt-3.5-turbo"),
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": get_prompt()}
    )
    resp = qa_chain.invoke({"query": question})

    # Prepare compact source info
    sources = []
    for doc in resp.get("source_documents", []):
        meta = doc.metadata or {}
        sources.append({
            "source": meta.get("source") or meta.get("file_path") or "",
            "page": meta.get("page"),
        })

    return {
        "answer": resp.get("result", ""),
        "sources": sources
    }
