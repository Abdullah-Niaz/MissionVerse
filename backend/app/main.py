from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import missions, mentor, nasa, environments

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="MissionVerse Backend — AI Mentor, NASA Telemetry & Mission System"
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(missions.router, prefix="/api/v1")
app.include_router(mentor.router, prefix="/api/v1")
app.include_router(nasa.router, prefix="/api/v1")
app.include_router(environments.router, prefix="/api/v1")

@app.get("/api/v1/health", tags=["system"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "copa_compliant": True,
        "mode": "guest-first"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
