import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "MissionVerse API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    NASA_API_KEY: str = os.getenv("NASA_API_KEY", "DEMO_KEY")
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

settings = Settings()
