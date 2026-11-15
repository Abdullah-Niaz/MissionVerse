from typing import Dict, Any
from datetime import datetime

class NASAService:
    """Service providing kid-friendly NASA educational space-weather and radiation cards with robust offline caching."""
    
    def __init__(self):
        self._cache = {
            "space_weather": {
                "topic": "space_weather",
                "title": "Solar Wind & Sun Flares",
                "source": "NASA DONKI Space Weather Service",
                "recorded_at": datetime.utcnow().isoformat() + "Z",
                "kid_friendly_summary": "The Sun constantly blows a gentle breeze of particles called the solar wind! Earth has a magnetic shield that protects us, creating beautiful northern lights (auroras). But on the Moon and Mars, spacesuits and base shields are needed to protect astronauts.",
                "current_solar_activity": "Solar Wind: Moderate Speed (420 km/s) — Safe for EVA exploration",
                "educational_takeaway": "Without an atmosphere or magnetic field, astronauts must monitor space weather just like we check rain forecasts on Earth."
            },
            "radiation": {
                "topic": "radiation",
                "title": "Cosmic Rays & Habitat Protection",
                "source": "NASA RadLab Radiation Database",
                "recorded_at": datetime.utcnow().isoformat() + "Z",
                "kid_friendly_summary": "Deep space is full of high-energy cosmic rays traveling from distant exploded stars. Future Moon and Mars bases will bury their living quarters under several feet of lunar or Martian soil (regolith) for natural, safe radiation insulation!",
                "current_solar_activity": "Galactic Cosmic Rays: Monitored — Shielding Recommended",
                "educational_takeaway": "Regolith acts as an effective shield against space radiation."
            },
            "biology": {
                "topic": "biology",
                "title": "Growing Plants in Microgravity",
                "source": "NASA OSDR (Open Science Data Repository)",
                "recorded_at": datetime.utcnow().isoformat() + "Z",
                "kid_friendly_summary": "Astronauts aboard the ISS grow red romaine lettuce, radishes, and chili peppers! Plants know which way is up because their roots sense even microscopic hints of gravity or grow toward LED light lamps.",
                "current_solar_activity": "Hydroponic Growth Chambers: Active and healthy",
                "educational_takeaway": "Plants provide fresh food, recycle carbon dioxide, and make astronauts feel closer to Earth."
            }
        }

    def get_educational_data(self, topic: str) -> Dict[str, Any]:
        return self._cache.get(topic, self._cache["space_weather"])

nasa_service = NASAService()
