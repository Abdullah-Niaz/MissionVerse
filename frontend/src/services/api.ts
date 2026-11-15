import { Mission, PlanetEnvironment } from '../types';

const API_BASE = '/api/v1';

// Fallback embedded static mission data
const FALLBACK_MISSIONS: Record<PlanetEnvironment, Mission[]> = {
  moon: [
    {
      id: "moon_001",
      title: "First Steps on the Moon",
      environment: "moon",
      difficulty: "easy",
      summary: "Step onto the lunar surface, test how low gravity affects your movement, and inspect the Lunar Module.",
      learning_objectives: [
        "Experience 1/6th Earth gravity",
        "Inspect the Apollo-style Lunar Lander descent stage"
      ],
      objectives: [
        {
          id: "m1_obj1",
          title: "Acclimate to Lunar Movement",
          type: "movement",
          target: "lunar_surface",
          description: "Walk around the landing site to feel the low-gravity inertia."
        },
        {
          "id": "m1_obj2",
          "title": "Inspect the Lunar Lander",
          "type": "interact",
          "target": "lunar_lander",
          "description": "Approach the Lunar Lander footpad and press Inspect."
        }
      ],
      completion_badge: "First Steps Badge",
      learning_recap: [
        "The Moon's gravity is about 1/6th of Earth's gravity, making you feel much lighter!",
        "The landing pads have large circular dish feet to prevent sinking into the lunar dust (regolith)."
      ]
    },
    {
      id: "moon_002",
      title: "Explore Lunar Craters",
      environment: "moon",
      difficulty: "easy",
      summary: "Travel north toward Shackleton Crater to observe how meteorite impacts shape the Moon.",
      learning_objectives: [
        "Understand impact crater formation",
        "Explain why craters remain intact for billions of years"
      ],
      objectives: [
        {
          id: "m2_obj1",
          title: "Reach Shackleton Crater Rim",
          type: "explore",
          target: "crater_rim",
          description: "Navigate to the north crater rim."
        },
        {
          id: "m2_obj2",
          title: "Inspect Impact Features",
          type: "interact",
          target: "crater_rim",
          "description": "Examine the raised rim and impact ejecta blanket."
        }
      ],
      completion_badge: "Crater Detective",
      learning_recap: [
        "Without an atmosphere, wind, or rain, craters on the Moon stay preserved for billions of years.",
        "Meteoroids hit the Moon at high speeds, creating explosion craters many times larger than the rock itself."
      ]
    },
    {
      id: "moon_003",
      title: "Collect Moon Samples",
      environment: "moon",
      difficulty: "medium",
      summary: "Gather samples of lunar regolith and breccia rock using your geological collection tools.",
      learning_objectives: [
        "Identify lunar regolith properties",
        "Learn why lunar dust is sharp and abrasive"
      ],
      objectives: [
        {
          id: "m3_obj1",
          title: "Find Regolith Deposit",
          type: "explore",
          target: "regolith_deposit",
          description: "Locate the dark regolith patch east of the landing zone."
        },
        {
          id: "m3_obj2",
          title: "Collect Rock Samples",
          type: "interact",
          target: "regolith_deposit",
          description: "Extract a scientific core sample for the base laboratory."
        }
      ],
      completion_badge: "Lunar Geologist",
      learning_recap: [
        "Lunar soil (regolith) is made of tiny fragments of volcanic basalt and glass beads created by micrometeorite bombardment.",
        "Because there is no erosion to dull the edges, moon dust grains are razor-sharp!"
      ]
    },
    {
      id: "moon_004",
      title: "Activate Research Station",
      environment: "moon",
      difficulty: "medium",
      summary: "Power up the Artemis Lunar Habitat by deploying the solar battery array.",
      learning_objectives: [
        "Learn how solar power works on the Moon",
        "Understand day/night temperature extremes in space"
      ],
      objectives: [
        {
          id: "m4_obj1",
          title: "Reach Solar Array",
          type: "explore",
          target: "solar_array",
          description: "Walk to the solar panel field near the habitat."
        },
        {
          id: "m4_obj2",
          title: "Calibrate Power Grid",
          type: "interact",
          target: "solar_array",
          description: "Align the solar tracking panels toward the Sun."
        }
      ],
      completion_badge: "Station Commander",
      learning_recap: [
        "A lunar day lasts about 29 Earth days—meaning roughly two weeks of continuous sunlight followed by two weeks of darkness!",
        "Solar arrays must store enough energy in batteries to keep habitats warm through the freezing lunar night."
      ]
    },
    {
      id: "moon_005",
      title: "Restore Rover Power",
      environment: "moon",
      difficulty: "hard",
      summary: "Connect the auxiliary battery to the Lunar Roving Vehicle (LRV) and take it on a test drive.",
      learning_objectives: [
        "Explore rover mechanics and wire mesh tires",
        "Understand long-distance traversal on extraterrestrial surfaces"
      ],
      objectives: [
        {
          id: "m5_obj1",
          title: "Locate the Lunar Rover",
          type: "explore",
          target: "lunar_rover",
          description: "Find the rover parked near the equipment bay."
        },
        {
          id: "m5_obj2",
          title: "Install Power Cell",
          type: "interact",
          target: "lunar_rover",
          description: "Mount the battery cell into the rover."
        }
      ],
      completion_badge: "Master Lunar Navigator",
      learning_recap: [
        "Lunar rover wheels aren't filled with air because rubber would pop in the vacuum of space. Instead, they use woven zinc-coated steel wire mesh!",
        "Rovers allowed astronauts on Apollo 15, 16, and 17 to travel tens of kilometers across the Moon."
      ]
    }
  ],
  mars: [
    {
      id: "mars_001",
      title: "First Exploration on Mars",
      environment: "mars",
      difficulty: "easy",
      summary: "Step onto the Red Planet's rust-tinted surface and deploy your micro-weather sensor.",
      learning_objectives: [
        "Discover why Mars appears reddish-orange",
        "Measure Martian thin carbon dioxide atmosphere"
      ],
      objectives: [
        {
          id: "r1_obj1",
          title: "Explore Landing Plateau",
          type: "movement",
          target: "mars_surface",
          description: "Walk onto the red basaltic terrain."
        },
        {
          id: "r1_obj2",
          title: "Deploy Weather Station",
          type: "interact",
          target: "mars_weather_station",
          description: "Activate the automated atmospheric station."
        }
      ],
      completion_badge: "Red Planet Pioneer",
      learning_recap: [
        "Mars is red because its soil contains iron oxide (rust)!",
        "The Martian atmosphere is 95% carbon dioxide and less than 1% as thick as Earth's atmosphere."
      ]
    },
    {
      id: "mars_002",
      title: "Investigate Red Planet Rocks",
      environment: "mars",
      difficulty: "easy",
      summary: "Study Martian volcanic rocks and sedimentary formations near the ridgeline.",
      learning_objectives: [
        "Identify volcanic basalt vs sedimentary rocks",
        "Learn about ancient Martian volcanoes"
      ],
      objectives: [
        {
          id: "r2_obj1",
          title: "Find Volcanic Rock Outcrop",
          type: "explore",
          target: "mars_rock_formation",
          description: "Travel west toward the rocky outcrop."
        },
        {
          id: "r2_obj2",
          title: "Scan Rock Composition",
          type: "interact",
          target: "mars_rock_formation",
          description: "Use your laser spectrometer tool to analyze mineral elements."
        }
      ],
      completion_badge: "Martian Geologist",
      learning_recap: [
        "Mars is home to Olympus Mons, the largest volcano in the entire Solar System—nearly 3 times taller than Mount Everest!",
        "Volcanic rocks tell scientists about the molten interior of Mars billions of years ago."
      ]
    },
    {
      id: "mars_003",
      title: "Discover Water Evidence",
      environment: "mars",
      difficulty: "medium",
      summary: "Search the dry river delta for hydrated minerals and ice pockets.",
      learning_objectives: [
        "Understand evidence of ancient liquid water on Mars",
        "Learn where water ice is trapped today"
      ],
      objectives: [
        {
          id: "r3_obj1",
          title: "Investigate Ancient Riverbed",
          type: "explore",
          target: "ancient_riverbed",
          description: "Cross the dusty canyon valley."
        },
        {
          id: "r3_obj2",
          title: "Drill for Subsurface Ice",
          type: "interact",
          target: "ancient_riverbed",
          description: "Run the ground penetrating radar and collect ice core."
        }
      ],
      completion_badge: "Hydro Detective",
      learning_recap: [
        "Curved river channels and smooth pebbles prove liquid water flowed across Mars billions of years ago.",
        "Today, water exists on Mars mostly as ice at the polar caps and trapped deep beneath the surface."
      ]
    },
    {
      id: "mars_004",
      title: "Operate Mars Rover",
      environment: "mars",
      difficulty: "medium",
      summary: "Take command of the scientific exploration rover to cross sand dunes safely.",
      learning_objectives: [
        "Learn how robotic rovers like Curiosity and Perseverance navigate",
        "Practice vehicle traversal over rough planetary terrain"
      ],
      objectives: [
        {
          id: "r4_obj1",
          title: "Board the Mars Rover",
          type: "interact",
          target: "mars_rover",
          description: "Climb into the rover driver cabin."
        },
        {
          id: "r4_obj2",
          title: "Traverse the Sand Dunes",
          type: "movement",
          target: "sand_dunes",
          description: "Drive across the dune corridor toward waypoint Alpha."
        }
      ],
      completion_badge: "Rover Ace",
      learning_recap: [
        "NASA's Mars rovers use autonomous hazard-avoidance cameras to spot dangerous rocks and soft sand pockets.",
        "Rovers can travel for miles sending back 3D panoramic photos and drilling rocks for signs of past microbial life."
      ]
    },
    {
      id: "mars_005",
      title: "Study Environmental Conditions",
      environment: "mars",
      difficulty: "hard",
      summary: "Analyze dust storm telemetry and calibrate habitat radiation shielding.",
      learning_objectives: [
        "Understand global Martian dust storms",
        "Learn how astronauts protect themselves from cosmic radiation"
      ],
      objectives: [
        {
          id: "r5_obj1",
          title: "Inspect Atmospheric Sensor",
          type: "interact",
          target: "mars_habitat_computer",
          description: "Read the storm barometer and dust opacity sensor."
        },
        {
          id: "r5_obj2",
          title: "Activate Hab Shielding",
          type: "interact",
          target: "radiation_shield",
          description: "Engage electromagnetic habitat shields."
        }
      ],
      completion_badge: "Chief Science Officer",
      learning_recap: [
        "Dust storms on Mars can grow to envelop the entire planet, blocking the sun for months at a time!",
        "Without Earth's thick atmosphere and strong magnetic field, future astronauts will live in habitats shielded by thick regolith or underground lava tubes."
      ]
    }
  ]
};

export const ApiService = {
  async fetchMissions(planet: PlanetEnvironment): Promise<Mission[]> {
    try {
      const res = await fetch(`${API_BASE}/missions?environment=${planet}`);
      if (res.ok) {
        const data = await res.json();
        if (data.missions && data.missions.length > 0) {
          return data.missions;
        }
      }
    } catch {
      // Use fallback quietly
    }
    return FALLBACK_MISSIONS[planet] || [];
  },

  async askMentorHint(params: {
    environment: PlanetEnvironment;
    missionId: string;
    activeObjectiveId?: string;
    currentEntityId?: string;
    question?: string;
  }): Promise<{ mentor_response: string; learning_concept: string; suggested_action: string }> {
    try {
      const res = await fetch(`${API_BASE}/mentor/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'guest',
          environment: params.environment,
          mission_id: params.missionId,
          active_objective_id: params.activeObjectiveId,
          current_entity_id: params.currentEntityId,
          player_question: params.question,
          age_group: '7-12'
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback response
    }
    return {
      mentor_response: "Use your directional controls to explore the highlighted markers on the map! Each landmark has clues for your mission.",
      learning_concept: "Planetary Observation",
      suggested_action: "Explore nearby landmarks"
    };
  },

  async askMentorExplain(params: {
    environment: PlanetEnvironment;
    topic: string;
  }): Promise<{ mentor_response: string; learning_concept: string; fun_fact?: string }> {
    try {
      const res = await fetch(`${API_BASE}/mentor/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'guest',
          environment: params.environment,
          topic: params.topic,
          age_group: '7-12'
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      mentor_response: "Planetary scientists study rocks, craters, and atmosphere to understand how our solar system was formed 4.5 billion years ago!",
      learning_concept: "Solar System Geology",
      fun_fact: "You are exploring terrain that fewer than 15 humans have ever visited!"
    };
  },

  async fetchNASAData(topic: string = "space_weather") {
    try {
      const res = await fetch(`${API_BASE}/nasa/education?topic=${topic}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      topic,
      title: "Space Weather & Radiation Monitoring",
      source: "NASA Heliophysics Division",
      recorded_at: new Date().toISOString(),
      kid_friendly_summary: "Space weather is made of energetic particles blowing from our Sun. Spacesuits and habitat shielding keep astronauts protected during missions on the Moon and Mars!",
      current_solar_activity: "Solar Wind: Normal Speed (390 km/s) — Conditions Optimal",
      educational_takeaway: "Always monitor space weather before long exploration drives outside the habitat!"
    };
  }
};
