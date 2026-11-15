from fastapi import APIRouter, Query
from app.services.nasa_service import nasa_service

router = APIRouter(prefix="/nasa", tags=["nasa"])

@router.get("/education")
def get_nasa_education(topic: str = Query("space_weather", description="space_weather, radiation, or biology")):
    return nasa_service.get_educational_data(topic)
