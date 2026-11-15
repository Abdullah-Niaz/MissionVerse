from fastapi import APIRouter

router = APIRouter(prefix="/environments", tags=["environments"])

@router.get("")
def get_environments():
    return {
        "environments": [
            {
                "id": "moon",
                "name": "The Moon (Lunar Surface)",
                "subtitle": "Artemis Research Base & Impact Craters",
                "gravity": "1.62 m/s² (1/6th Earth)",
                "atmosphere": "Vacuum (Exosphere)",
                "temperature": "-130°C to +120°C",
                "difficulty": "Cadet Level",
                "features": ["Shackleton Crater", "Lunar Lander", "Apollo Rover", "Solar Array", "Regolith Deposit"],
                "color_theme": "#3b82f6"
            },
            {
                "id": "mars",
                "name": "Mars (The Red Planet)",
                "subtitle": "Jezero Crater Exploration & Dusty Corridors",
                "gravity": "3.72 m/s² (38% Earth)",
                "atmosphere": "Thin Carbon Dioxide (0.01 bar)",
                "temperature": "-60°C average",
                "difficulty": "Officer Level",
                "features": ["Mars Rover", "Ancient Riverbed", "Iron Oxide Rocks", "Weather Station", "Dust Dunes"],
                "color_theme": "#ef4444"
            }
        ]
    }
