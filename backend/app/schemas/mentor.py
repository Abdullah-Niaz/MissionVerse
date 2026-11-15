from pydantic import BaseModel, Field
from typing import Optional, Literal

class MentorHintRequest(BaseModel):
    session_id: str = "guest_session"
    environment: Literal["moon", "mars"]
    mission_id: str
    active_objective_id: Optional[str] = None
    current_entity_id: Optional[str] = None
    player_question: Optional[str] = None
    age_group: str = "7-12"

class MentorHintResponse(BaseModel):
    mentor_response: str
    learning_concept: str
    suggested_action: str
    safety_status: Literal["approved", "filtered"] = "approved"
    fallback_used: bool = False

class MentorExplainRequest(BaseModel):
    session_id: str = "guest_session"
    environment: Literal["moon", "mars"]
    topic: str
    question: Optional[str] = None
    age_group: str = "7-12"

class MentorExplainResponse(BaseModel):
    mentor_response: str
    learning_concept: str
    fun_fact: Optional[str] = None
    safety_status: Literal["approved", "filtered"] = "approved"
    fallback_used: bool = False

class MentorFeedbackRequest(BaseModel):
    mission_id: str
    environment: Literal["moon", "mars"]
    completed_objectives: list[str]
    time_spent_seconds: int

class MentorFeedbackResponse(BaseModel):
    celebration_message: str
    key_takeaways: list[str]
    curiosity_badge: str
