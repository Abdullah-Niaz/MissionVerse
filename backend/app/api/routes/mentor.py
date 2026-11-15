from fastapi import APIRouter
from app.schemas.mentor import (
    MentorHintRequest, MentorHintResponse,
    MentorExplainRequest, MentorExplainResponse,
    MentorFeedbackRequest, MentorFeedbackResponse
)
from app.services.ai_mentor import ai_mentor_service

router = APIRouter(prefix="/mentor", tags=["mentor"])

@router.post("/hint", response_model=MentorHintResponse)
def get_hint(req: MentorHintRequest):
    return ai_mentor_service.get_hint(req)

@router.post("/explain", response_model=MentorExplainResponse)
def explain_concept(req: MentorExplainRequest):
    return ai_mentor_service.explain_concept(req)

@router.post("/feedback", response_model=MentorFeedbackResponse)
def give_feedback(req: MentorFeedbackRequest):
    return MentorFeedbackResponse(
        celebration_message="Outstanding scientific exploration, Junior Astronaut! You made insightful observations.",
        key_takeaways=[
            "Exploration requires careful observation and resource management.",
            "Planetary geology unlocks the history of our solar system."
        ],
        curiosity_badge="Curious Explorer"
    )
