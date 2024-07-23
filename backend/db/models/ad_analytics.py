from dataclasses import dataclass

@dataclass
class AdAnalyticsDto:
    on_chain_id: int
    timespent: int
    qna_count: int
    is_redirected: bool
    feedback_given: bool
    skipped: bool
    created_at: str