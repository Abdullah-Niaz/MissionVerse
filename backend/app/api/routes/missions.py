from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Literal
from app.services.ai_mentor import ai_mentor_service

router = APIRouter(prefix="/missions", tags=["missions"])

@router.get("")
def list_missions(environment: Optional[Literal["moon", "mars"]] = Query(None)):
    missions_data = ai_mentor_service.missions
    if environment:
        return {"missions": missions_data.get(environment, [])}
    return {
        "missions": {
            "moon": missions_data.get("moon", []),
            "mars": missions_data.get("mars", [])
        }
    }

@router.get("/{mission_id}")
def get_mission(mission_id: str):
    missions_data = ai_mentor_service.missions
    all_missions = missions_data.get("moon", []) + missions_data.get("mars", [])
    for m in all_missions:
        if m["id"] == mission_id:
            return m
    raise HTTPException(status_code=404, detail=f"Mission {mission_id} not found")
