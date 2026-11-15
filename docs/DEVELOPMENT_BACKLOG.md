# MissionVerse — Development Backlog & Sprint Execution Plan
**Version:** 1.0  
**Companion Document:** [SRS.md](file:///f:/New%20folder/docs/SRS.md)  
**Target Delivery:** 6 Sprints (12 Weeks) · MVP Ready for Production

---

## 1. Epic Breakdown & Architecture Matrix

| Epic ID | Epic Name | Tech Stack Components | Story Points |
| :--- | :--- | :--- | :--- |
| **EPIC-01** | Product Foundation, Build Pipeline & Guest Onboarding | React 19, Vite, Tailwind CSS, IndexedDB | 21 SP |
| **EPIC-02** | Phaser 2D Game Engine, Controls & World Systems | Phaser 3, Arcade Physics, Virtual Joystick | 34 SP |
| **EPIC-03** | Interactive Exploration & Scientific Discovery System | Phaser Sprites, React Modals, Audio Engine | 26 SP |
| **EPIC-04** | Dynamic Resources & Lunar Campaign (M-01 to M-05) | Phaser Systems, Zustand Store, EventBridge | 34 SP |
| **EPIC-05** | Martian Campaign, Rover Mechanics & Evaluation | Phaser Vehicle Class, Particle Emitters | 34 SP |
| **EPIC-06** | Guided AI Mentor Service & NASA Data Integration | FastAPI, Python 3.12, LLM API, Redis/Cache | 29 SP |
| **EPIC-07** | Audio, Accessibility, Child Safety, QA & Polish | Web Audio API, Playwright, Vitest | 21 SP |

**Total Estimated Backlog:** 199 Story Points across 6 Sprints.

---

## 2. Detailed User Stories & Acceptance Criteria

### US-01: Guest First-Time Onboarding & Local Identity
* **Epic**: EPIC-01 (Product Foundation)
* **Priority**: Must Have | **Estimate**: 3 SP
* **User Story**:  
  *As a* 9-year-old child visiting MissionVerse for the first time,  
  *I want to* start playing immediately with one click without creating an account or asking a parent for an email,  
  *So that* I can dive right into space exploration safely and quickly.

**Gherkin Scenarios:**
```gherkin
Feature: Guest Onboarding
  Scenario: Launching game for the first time
    Given the player opens MissionVerse with an empty browser cache
    When the landing page renders
    Then the user sees the title "MissionVerse: Junior Astronaut Mission Trainer"
    And a prominent "Start Exploration" button is visible
    And no login, password, or email input fields are present
    And clicking "Start Exploration" initializes an anonymous session in IndexedDB
    And transitions to the Avatar Selection screen
```

---

### US-02: Astronaut Avatar Selection
* **Epic**: EPIC-01 (Product Foundation)
* **Priority**: Must Have | **Estimate**: 3 SP
* **User Story**:  
  *As a* young explorer,  
  *I want to* choose my astronaut suit and callsign,  
  *So that* I feel personally connected to my character in the game world.

**Gherkin Scenarios:**
```gherkin
Feature: Avatar Selection
  Scenario: Selecting an astronaut suit
    Given the player is on the Avatar Selection screen
    When the player browses the 4 astronaut cards ("Nova", "Orion", "Astra", "Cosmo")
    And clicks on "Astra"
    Then the card highlights with a glowing border and play a suit-click chime
    And the callsign input defaults to "Astronaut Astra"
    And clicking "Confirm Astronaut" persists the profile and navigates to Planet Selection
```

---

### US-03: Planet Selection (Moon vs Mars)
* **Epic**: EPIC-01 (Product Foundation)
* **Priority**: Must Have | **Estimate**: 3 SP
* **User Story**:  
  *As a* player,  
  *I want to* choose between exploring the Moon or Mars,  
  *So that* I can decide which environment and scientific mysteries to tackle first.

**Gherkin Scenarios:**
```gherkin
Feature: Planet Selection
  Scenario: Selecting the Moon expedition
    Given the player is on the Planet Selection screen
    When the player hovers or focuses on "Moon - Lunar Expedition"
    Then the preview displays the 1/6th gravity badge and "5 Missions Available"
    When the player clicks "Launch to Moon"
    Then the Phaser game engine initializes the Lunar Surface scene
```

---

### US-04: Top-Down 2D Movement & Physics
* **Epic**: EPIC-02 (Phaser 2D Game Engine)
* **Priority**: Must Have | **Estimate**: 8 SP
* **User Story**:  
  *As a* player on desktop or tablet,  
  *I want to* move my astronaut smoothly in 8 directions using keyboard or on-screen touch controls,  
  *So that* I can easily navigate around craters and space structures.

**Gherkin Scenarios:**
```gherkin
Feature: Player Movement
  Scenario: Keyboard movement on Desktop
    Given the player is on the Moon map in WorldScene
    When the player presses "W" and "D"
    Then the astronaut moves northeast at normalized diagonal velocity
    And triggers the walking sprite animation loop
    And the camera follows smoothly without stuttering

  Scenario: Collision with obstacle
    Given the astronaut is moving toward a boulder formation
    When the astronaut collides with the collision tile layer
    Then the astronaut's movement stops at the boundary without clipping through
```

---

### US-05: Proximity Interaction with Scientific Objects
* **Epic**: EPIC-03 (Interactive Exploration)
* **Priority**: Must Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* curious young explorer,  
  *I want to* see a clear visual prompt when I approach interesting rocks, craters, or machines,  
  *So that* I know I can interact with them and learn scientific facts.

**Gherkin Scenarios:**
```gherkin
Feature: Proximity Interaction
  Scenario: Approaching an interactive scientific object
    Given the astronaut is roaming the Lunar surface
    When the astronaut moves within 64 pixels of "Shackleton Crater"
    Then a floating indicator "[E] Inspect" pulses above the player
    And the crater boundary glows with an interactive halo
    When the player presses "E" or taps the inspect button
    Then the game pauses and the Scientific Discovery Modal opens
```

---

### US-06: Scientific Discovery Modal & Learning Fact
* **Epic**: EPIC-03 (Interactive Exploration)
* **Priority**: Must Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* player inspecting an object,  
  *I want to* read fun, kid-friendly facts with real pictures and audio narration,  
  *So that* I understand how real space scientists study planetary features.

**Gherkin Scenarios:**
```gherkin
Feature: Discovery Card
  Scenario: Inspecting Moon Regolith
    Given the player inspects the "Lunar Regolith" landmark
    When the modal opens
    Then it displays the title "Lunar Regolith (Moon Dust)"
    And the fact text explains: "Moon dust is sharp like shattered glass because there is no air or rain to smooth it down!"
    And an audio button allows hearing the text read aloud
    And clicking "Log Discovery" adds the item to the player's Discovery Journal
```

---

### US-07: Dynamic Resource Depletion & Recovery Pods
* **Epic**: EPIC-04 (Dynamic Resources & Lunar Campaign)
* **Priority**: Must Have | **Estimate**: 8 SP
* **User Story**:  
  *As a* player managing an exploration suit,  
  *I want to* watch my Oxygen and Battery levels change realistically without fear of dying,  
  *So that* I learn about resource planning in extreme environments.

**Gherkin Scenarios:**
```gherkin
Feature: Dynamic Resources
  Scenario: Low oxygen warning
    Given the astronaut has consumed oxygen down to 15%
    When the threshold is crossed
    Then the HUD oxygen bar turns amber and pulses
    And a gentle voice chime alerts: "Suit oxygen low - return to base or visit an O2 tank"

  Scenario: Zero oxygen emergency teleport
    Given oxygen reaches 0%
    When the depletion event triggers
    Then an emergency recovery drone animation teleports the astronaut to the Lunar Base airlock
    And restores oxygen to 100%
    And displays an encouraging tip: "Space suits carry limited air! Keep an eye on your tank next time."
```

---

### US-08: AI Mentor Contextual Socratic Hint
* **Epic**: EPIC-06 (Guided AI Mentor Service)
* **Priority**: Must Have | **Estimate**: 8 SP
* **User Story**:  
  *As a* 10-year-old child stuck on a mission objective,  
  *I want to* ask my AI Mentor for help,  
  *So that* I receive a gentle nudge in the right direction without having the solution spoiled.

**Gherkin Scenarios:**
```gherkin
Feature: AI Mentor Socratic Hint
  Scenario: Requesting a hint during Mission M-04 "Activate Research Station"
    Given the player is on mission M-04 with objective "Align Solar Array"
    When the player opens the AI Mentor chat and asks "I don't know where to find the power cable"
    Then the AI Mentor responds with a hint pointing to the sunlit ridge
    And never provides vulgar, off-topic, or non-educational content
    And if the server is offline, returns the pre-cached safe hint immediately
```

---

### US-09: Learning-Focused Mission Evaluation
* **Epic**: EPIC-04 & EPIC-05 (Campaign Missions)
* **Priority**: Must Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* player who finished all objectives of a mission,  
  *I want to* receive an encouraging learning certificate and badge,  
  *So that* I feel proud of what I learned rather than judged by a harsh score.

**Gherkin Scenarios:**
```gherkin
Feature: Mission Evaluation
  Scenario: Completing Mission M-01
    Given all objectives for Mission M-01 are marked complete
    When the evaluation screen triggers
    Then celebratory space fanfare plays
    And the screen awards the "First Steps Badge"
    And lists 2 key takeaways: "1. The Moon has 1/6th of Earth's gravity. 2. Spacesuits protect from vacuum."
    And unlocks Mission M-02 in the mission log
```

---

### US-10: Mars Rover Driving & Traversal
* **Epic**: EPIC-05 (Martian Campaign & Rover)
* **Priority**: Must Have | **Estimate**: 8 SP
* **User Story**:  
  *As a* player exploring Mars,  
  *I want to* drive the Mars Rover vehicle,  
  *So that* I can travel faster across rocky dunes and drill deep core samples.

**Gherkin Scenarios:**
```gherkin
Feature: Mars Rover
  Scenario: Boarding and driving the Rover
    Given the astronaut is adjacent to the Mars Rover
    When the player presses "E" to board
    Then the player sprite transitions inside the Rover
    And speed increases by 60%
    And rover leaves dynamic wheel tracks on the red Martian sand
    When pressing "E" again, the astronaut dismounts safely
```

---

### US-11: NASA Space Weather Educational Telemetry
* **Epic**: EPIC-06 (NASA Data Integration)
* **Priority**: Should Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* curious player in the research station,  
  *I want to* look at live NASA space weather reports,  
  *So that* I feel like a real scientist connecting with current space research.

**Gherkin Scenarios:**
```gherkin
Feature: NASA Space Weather Display
  Scenario: Inspecting Space Weather Terminal
    Given the astronaut interacts with the Base Communications Terminal
    When the screen loads
    Then it fetches cached data from the `/api/v1/nasa/education` endpoint
    And renders a kid-friendly visual showing current solar wind speed
    And explains what solar flares mean for astronauts on the Moon
```

---

### US-12: IndexedDB Local Progress Auto-Save & Restoration
* **Epic**: EPIC-01 (Product Foundation)
* **Priority**: Must Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* player returning after closing the browser tab,  
  *I want my* completed missions, unlocked badges, and discoveries to still be there,  
  *So that* I can pick up where I left off without needing an account.

**Gherkin Scenarios:**
```gherkin
Feature: Save Persistence
  Scenario: Resuming after closing browser
    Given the player has unlocked 3 badges and completed 2 missions
    When the player closes the tab and re-opens the website
    Then the app restores state from `MissionVerseDB_v1`
    And displays the "Welcome back, Astronaut!" resume button
    And all previously unlocked badges remain in the Journal
```

---

### US-13: Mobile Touch Virtual Joystick & HUD
* **Epic**: EPIC-02 (Phaser 2D Game Engine)
* **Priority**: Must Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* tablet or smartphone player,  
  *I want* an intuitive on-screen joystick and touch buttons,  
  *So that* I can explore smoothly without a physical keyboard.

**Gherkin Scenarios:**
```gherkin
Feature: Touch Controls
  Scenario: Playing on iPad / Tablet
    Given the game detects touch device capabilities
    When WorldScene starts
    Then the virtual joystick appears in the bottom-left corner
    And an action button (Inspect / Collect) appears in the bottom-right corner
    And dragging the joystick moves the astronaut with direction and magnitude
```

---

### US-14: Environmental Hazard Warning & Dust Storms
* **Epic**: EPIC-05 (Martian Campaign)
* **Priority**: Should Have | **Estimate**: 5 SP
* **User Story**:  
  *As a* Mars explorer,  
  *I want to* experience dynamic environmental challenges like gentle Martian dust storms,  
  *So that* I learn how Martian weather differs from Earth's.

**Gherkin Scenarios:**
```gherkin
Feature: Mars Dust Storm Event
  Scenario: Entering a dust storm area
    Given the player is on Mission R-05 "Study Environmental Conditions"
    When an environmental event triggers
    Then the screen applies a warm orange tint with drifting dust particles
    And the AI Mentor notes: "Mars dust storms can last for weeks! But the air is so thin, wind doesn't push you hard like on Earth."
```

---

## 3. Sprint-by-Sprint Implementation Roadmap

### Sprint 1: Project Foundation, Shell & Guest Identity (Weeks 1–2)
* **Sprint Goal**: Deliver a playable React + Vite + Phaser 3 skeleton with guest session generation, avatar selection, and planet picker.
* **Stories**: US-01, US-02, US-03, US-12 (Total: 14 SP)
* **Detailed Tasks**:
  1. Initialize monorepo or standard frontend/backend folders (`frontend/`, `backend/`).
  2. Setup React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, and Vitest.
  3. Create `IndexedDBService` with schema `MissionVerseDB_v1` and auto-migration handlers.
  4. Build Welcome Screen, Avatar Selection (4 avatars), and Planet Selection (Moon / Mars).
  5. Setup `PhaserGame.tsx` component and configure Phaser 3 instance with resize listener.
  6. Establish `EventBridge` EventEmitter bridge connecting React state with Phaser scenes.
* **Definition of Done**: User opens app, selects avatar, chooses Moon or Mars, and sees a running Phaser canvas.

---

### Sprint 2: 2D Movement, Physics & World Viewport (Weeks 3–4)
* **Sprint Goal**: Implement player movement, Arcade Physics, terrain collision, camera tracking, and mobile touch controls.
* **Stories**: US-04, US-13 (Total: 13 SP)
* **Detailed Tasks**:
  1. Build orthogonal tilemaps for Moon ($2000 \times 2000\text{ px}$) with collision metadata.
  2. Implement `Player` entity with 8-way movement, walking animations, and idle states.
  3. Tune Moon low-gravity movement inertia and Mars dust friction.
  4. Build on-screen virtual joystick (`VirtualJoystick.tsx`) for mobile and tablet touch input.
  5. Implement camera bounds, smooth lerp following, and mini-map radar overlay.
* **Definition of Done**: Smooth, responsive astronaut exploration across Moon and Mars surfaces with zero clipping through boundaries.

---

### Sprint 3: Interactive Exploration & Scientific Discovery (Weeks 5–6)
* **Sprint Goal**: Deliver the proximity interaction engine, scientific discovery cards, and discovery journal.
* **Stories**: US-05, US-06 (Total: 10 SP)
* **Detailed Tasks**:
  1. Create `InteractiveObject` sprite class with proximity detection zone ($R=64\text{ px}$).
  2. Populate Moon map with 10 interactive landmarks (Lunar Module, Shackleton Crater, Solar Array, Drill Site, Seismometer).
  3. Populate Mars map with 10 interactive landmarks (Perseverance Rover, Jezero Crater bed, Iron Oxide Rocks, Weather Station).
  4. Build React `DiscoveryModal.tsx` displaying scientific facts, curated imagery, and interactive inspection audio.
  5. Implement `DiscoveryJournal.tsx` drawer where players review unlocked knowledge cards.
* **Definition of Done**: Astronaut can walk up to objects, see interactive cues, open rich science popups, and track discoveries in their journal.

---

### Sprint 4: Dynamic Resources & Lunar Campaign M-01 to M-05 (Weeks 7–8)
* **Sprint Goal**: Complete the Dynamic Resource System and all 5 playable Moon missions with learning evaluation.
* **Stories**: US-07, US-09 (Total: 13 SP)
* **Detailed Tasks**:
  1. Implement `ResourceEngine`: Oxygen depletion ($0.15\%/\text{s}$), Energy, and Battery usage.
  2. Implement non-punitive emergency recovery pod drone reset when oxygen reaches 0%.
  3. Build Recharge Stations on Moon map (O2 refill tanks, solar charging pad).
  4. Script and wire Moon missions `M-01` through `M-05` into `MissionManager`.
  5. Build `MissionCompleteModal.tsx` celebrating earned badges and summarizing learning concepts.
* **Definition of Done**: Full Moon campaign playable from start to finish with dynamic resources, objective checks, and completion certificates.

---

### Sprint 5: Martian Campaign R-01 to R-05 & Rover Driving (Weeks 9–10)
* **Sprint Goal**: Complete the Mars campaign and implement the drivable Mars Rover vehicle mechanics.
* **Stories**: US-10, US-14 (Total: 13 SP)
* **Detailed Tasks**:
  1. Implement `RoverEntity` vehicle class: mounting/dismounting, enhanced speed ($+60\%$), headlight cones, tire track particle trails.
  2. Script and wire Mars missions `R-01` through `R-05` (rock investigation, clay mineral scanning, rover driving, weather monitoring).
  3. Add environmental dust storm warning system with reduced visibility lighting overlay.
  4. Implement badge unlocking system with local save persistence and audio fanfares.
* **Definition of Done**: Complete Mars campaign with drivable rover, sand mechanics, and 5 interactive science missions.

---

### Sprint 6: Guided AI Mentor Service, NASA Proxy & Launch Prep (Weeks 11–12)
* **Sprint Goal**: Deploy FastAPI backend with AI Mentor guardrails, NASA educational data caching, offline fallback, and polish.
* **Stories**: US-08, US-11 (Total: 13 SP)
* **Detailed Tasks**:
  1. Build FastAPI backend (`app/api/routes/mentor.py`, `app/api/routes/nasa.py`).
  2. Construct AstroGuide prompt template with pedagogical Socratic instructions, child-safety sanitizers, and zero-PII validation.
  3. Implement static JSON offline fallback repository containing verified Q&As for all 20+ landmarks.
  4. Integrate NASA DONKI / RadLab API connectors with 6-hour caching.
  5. Sound design: integrate Web Audio sound effects (footsteps, thrusters, UI clicks, discovery chimes).
  6. Comprehensive E2E testing with Playwright across Desktop (Chrome, Firefox, Safari) and Mobile touch viewports.
* **Definition of Done**: Production-ready MissionVerse MVP web application ready for deployment.
