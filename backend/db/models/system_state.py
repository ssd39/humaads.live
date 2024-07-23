from dataclasses import dataclass
from fastapi import WebSocket
from langchain_core.runnables.history import RunnableWithMessageHistory
from db.models.ad import AdDto

@dataclass
class Renderer:
    renderer_connection: WebSocket
    user_connection: WebSocket
    stream_url: str
    conversational_rag_chain: RunnableWithMessageHistory
    is_locked: bool
    campaign_data: AdDto