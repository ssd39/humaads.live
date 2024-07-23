from pydantic import BaseModel

class WhisperPayload(BaseModel):
    audio: str
