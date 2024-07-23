from dataclasses import dataclass
from datetime import datetime

@dataclass
class AdFeedBackDto:
    message: str
    created_at: str