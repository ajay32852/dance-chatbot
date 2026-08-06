import json
import os
from dotenv import load_dotenv

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

import ollama

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "data", "dance_kb.json")
VECTOR_STORE_PATH = os.path.join(BASE_DIR, "vector_store")


def create_documents():

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        kb_data = json.load(f)

    documents = []

    for item in kb_data:

        text = (
            f"Category: {item['category']}\n"
            f"Question: {item['question']}\n"
            f"Answer: {item['answer']}"
        )

        documents.append(
            Document(
                page_content=text,
                metadata={
                    "category": item["category"],
                    "question": item["question"],
                },
            )
        )

    print(f"Loaded {len(documents)} documents")

    return documents


def setup_vector_store():

    embeddings = OllamaEmbeddings(
        model="nomic-embed-text",
        base_url="http://localhost:11434",
    )

    docs = create_documents()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )

    splits = splitter.split_documents(docs)

    print(f"Chunks: {len(splits)}")

    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=VECTOR_STORE_PATH,
        collection_name="dance_school_kb",
    )

    print("Vector DB created")

    print("Total vectors:", vectorstore._collection.count())


if __name__ == "__main__":

    try:

        client = ollama.Client(host="http://localhost:11434")

        models = client.list()

        print("Ollama Connected")

        for m in models.models:
            print("-", m.model)

    except Exception as e:

        print("Cannot connect to Ollama")
        print(e)
        exit()

    setup_vector_store()