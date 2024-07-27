import os
import langchain
langchain.verbose = os.environ["IS_PROD"] == "FALSE"

from langchain_google_vertexai import ChatVertexAI
from langchain_google_vertexai import VertexAIEmbeddings
from db.models.ad import ProductDetail
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_llm.llama_edge_cloud import LLamaEdgeCloud
from langchain.chains.llm import LLMChain
from langchain_core.messages import HumanMessage, SystemMessage

llm = None
embedding = None

if os.environ["LLM"] == "EdgeCloud/llama3-8b":
    llm = LLamaEdgeCloud()
    embedding = VertexAIEmbeddings(model_name="text-embedding-004")

    
if os.environ["LLM"] == "VertexAI":
    llm = ChatVertexAI(model="gemini-1.5-flash-001")
    embedding = VertexAIEmbeddings(model_name="text-embedding-004")

    
### Statefully manage chat history ###
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def init_rag(product_details: list[ProductDetail], brand_name: str):
    docs = []
    for product_detail in product_details:
        docs.append(Document(page_content=f"{product_detail.tag}: {product_detail.info}", metadata={"tag": product_detail.tag, "poster": product_detail.poster}))
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    vectorstore = Chroma.from_documents(documents=splits, embedding=embedding)
    retriever = vectorstore.as_retriever()
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )

    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )
    
    # TODO: modify the template
    system_prompt = (
        f"You are an assistant/salesperson for a brand named {brand_name}."
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know in professional manner. Don't include any insert here or placehokder in answer. Use three sentences maximum and keep the "
        "answer concise. For given answer its mandatory to give tldr/abstracted answer (max 40 characters) in key named tldr appended at the end of answer without it your answer will not accepted."
        "\n\n"
        "{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )
    return conversational_rag_chain

def gentldr(answer: str):
    try:
        messages = [
            SystemMessage(content="Give me tldr (max 40 characters) for user input"),
            HumanMessage(content=answer),
        ]
        ans = llm.invoke(messages)
        return ans.replace('"', "").replace("TLDR:", "").strip()
    except Exception as e:
        print(e)
    return ""

def ask_rag(question: str, session_id: str, conversational_rag_chain: RunnableWithMessageHistory):
    return conversational_rag_chain.invoke(
        {"input": question},
        config={
            "configurable": {"session_id": session_id}
        },
    )
