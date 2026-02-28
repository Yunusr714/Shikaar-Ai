"""
Document ingestion pipeline.

Loads text documents from the knowledge base directory, splits them into
chunks, generates embeddings via sentence-transformers, and persists the
vectors into a ChromaDB collection.

Run standalone:
    python -m app.rag.ingestion
"""

import logging
from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def ingest_documents() -> None:
    """Load, chunk, embed, and persist knowledge-base documents.

    Reads all ``.txt`` files from the configured data directory, splits
    them into overlapping chunks, and stores the resulting embeddings in
    a ChromaDB vector store.
    """
    settings = get_settings()
    data_dir = settings.DATA_DIR
    vector_db_dir = settings.VECTOR_DB_DIR

    # ── Validate source directory ────────────────────────────────────
    data_path = Path(data_dir)
    if not data_path.exists():
        raise FileNotFoundError(f"Data directory not found: {data_dir}")

    txt_files = list(data_path.glob("**/*.txt"))
    if not txt_files:
        raise FileNotFoundError(f"No .txt files found in: {data_dir}")

    logger.info("Found %d .txt file(s) in '%s'.", len(txt_files), data_dir)

    # ── Load documents ───────────────────────────────────────────────
    loader = DirectoryLoader(
        data_dir,
        glob="**/*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
    )
    documents = loader.load()
    logger.info("Loaded %d document(s).", len(documents))

    # ── Split into chunks ────────────────────────────────────────────
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    logger.info(
        "Split into %d chunk(s) (size=%d, overlap=%d).",
        len(chunks),
        settings.CHUNK_SIZE,
        settings.CHUNK_OVERLAP,
    )

    # ── Embed and persist ────────────────────────────────────────────
    embedding = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)

    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embedding,
        persist_directory=vector_db_dir,
    )

    logger.info(
        "Vector DB persisted to '%s' with %d vectors.",
        vector_db_dir,
        vectordb._collection.count(),
    )
    print(
        f"\n✅ Ingestion complete — {len(chunks)} chunks stored in '{vector_db_dir}'.\n"
    )


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    )
    ingest_documents()
