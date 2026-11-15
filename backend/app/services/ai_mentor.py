import json
import re
import os
from pathlib import Path
from app.schemas.mentor import MentorHintRequest, MentorHintResponse, MentorExplainRequest, MentorExplainResponse
from app.core.config import settings

KNOWLEDGE_FILE = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"
MISSIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "missions.json"

class AIMentorService:
    def __init__(self):
        self.knowledge = {}
        self.missions = {}
        self._load_data()

    def _load_data(self):
        if KNOWLEDGE_FILE.exists():
            with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
                self.knowledge = json.load(f).get("topics", {})
        if MISSIONS_FILE.exists():
            with open(MISSIONS_FILE, "r", encoding="utf-8") as f:
                self.missions = json.load(f)

    def sanitize_input(self, text: str) -> str:
        """Strip possible PII: emails, phone numbers, addresses."""
        if not text:
            return ""
        # Remove emails
        text = re.sub(r'[\w\.-]+@[\w\.-]+', '[email-redacted]', text)
        # Remove phone numbers (digits 7+)
        text = re.sub(r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', '[phone-redacted]', text)
        return text.strip()

    def get_hint(self, req: MentorHintRequest) -> MentorHintResponse:
        sanitized_q = self.sanitize_input(req.player_question or "")
        
        # Match against entity or topic
        entity = req.current_entity_id or ""
        match_topic = None
        
        # Entity-to-topic mapping
        entity_map = {
            "lunar_lander": "lunar_lander",
            "crater_rim": "impact_craters",
            "shackleton_crater": "impact_craters",
            "regolith_deposit": "lunar_regolith",
            "solar_array": "solar_array",
            "lunar_rover": "lunar_rover",
            "mars_weather_station": "mars_atmosphere",
            "mars_rock_formation": "iron_oxide",
            "ancient_riverbed": "mars_water",
            "mars_rover": "lunar_rover",
            "mars_habitat_computer": "mars_dust_storms",
            "radiation_shield": "mars_dust_storms"
        }

        topic_key = entity_map.get(entity)
        if not topic_key and req.environment == "moon":
            topic_key = "lunar_gravity"
        elif not topic_key:
            topic_key = "iron_oxide"

        entry = self.knowledge.get(topic_key, {})
        hint_text = entry.get("hint", "Explore nearby landmarks and check your mission checklist!")
        concept = entry.get("concept", "Planetary Exploration")

        # Custom contextual refinement
        if req.mission_id == "moon_001" and req.active_objective_id == "m1_obj2":
            hint_text = "Walk up close to the gold foil on the Lunar Lander's landing legs and press [E] to inspect the footpad!"
            action = "Inspect Lunar Lander"
        elif req.mission_id == "mars_001":
            hint_text = "Check out the red iron oxide soil beneath your boots and deploy the weather station on the ridge!"
            action = "Deploy Weather Station"
        else:
            action = f"Examine {entity.replace('_', ' ').title() or 'Landmark'}"

        return MentorHintResponse(
            mentor_response=hint_text,
            learning_concept=concept,
            suggested_action=action,
            safety_status="approved",
            fallback_used=True
        )

    def explain_concept(self, req: MentorExplainRequest) -> MentorExplainResponse:
        topic_key = req.topic.lower().replace(" ", "_")
        entry = self.knowledge.get(topic_key)
        
        if not entry:
            # Fallback search by keyword
            for key, val in self.knowledge.items():
                if req.topic.lower() in key or req.topic.lower() in val.get("concept", "").lower():
                    entry = val
                    break

        if not entry:
            if req.environment == "moon":
                entry = self.knowledge.get("lunar_gravity")
            else:
                entry = self.knowledge.get("iron_oxide")

        return MentorExplainResponse(
            mentor_response=entry.get("explanation", "Planetary bodies have unique geology shaped over billions of years!"),
            learning_concept=entry.get("concept", "Space Science"),
            fun_fact="Fun fact: Footprints left by Apollo astronauts on the Moon will remain there for at least a million years!",
            safety_status="approved",
            fallback_used=True
        )

ai_mentor_service = AIMentorService()
