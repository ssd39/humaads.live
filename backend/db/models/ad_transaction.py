from dataclasses import dataclass
from datetime import datetime

@dataclass
class AdTrasnsactionDto:
    tx_hash: str
    on_Chain_id: int
    created_at: str
    amount: float