# MissionVerse

MissionVerse is a 2D space exploration game for junior astronauts aged 7-12. Choose an avatar, land on the Moon or Mars, and follow mission objectives: inspect a lander, investigate a crater, or explore a dry Martian riverbed. AstroGuide offers hints, and the mission journal keeps discoveries and badges together.

Move with **WASD** or the **arrow keys**. Press **E** or **Space** near a landmark to interact. Touch devices have a joystick and action button. Watch your oxygen, energy and battery as you travel; return to a recharge point to refill them.

## Run locally

Use Node.js 22 with npm and Python 3.12. From the repository root, start the API in PowerShell:

~~~powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
~~~

On macOS or Linux, create the environment with `python3.12 -m venv .venv` and use `.venv/bin/python` in place of the Windows executable. In a second terminal, start the game from the repository root:

~~~sh
cd frontend
npm ci
npm run dev
~~~

Open <http://localhost:5173> to play or <http://127.0.0.1:8000/docs> to explore the API. The Vite development server forwards game requests to port 8000. After both sets of dependencies are installed, Windows users can also start the project with `run_dev.bat`.

## Deploy to Vercel 🔗

1. Push the project files, including the root deployment configuration and frontend lockfile, to [MissionVerse on GitHub](https://github.com/Abdullah-Niaz/MissionVerse).
2. In Vercel, choose **Add New > Project**, import that repository, and leave **Root Directory** at the repository root. Use the **Other** framework preset and leave build settings at their repository defaults.
3. Deploy. The root configuration builds the React/Phaser frontend into `frontend/dist` and routes `/api/v1/*` to the FastAPI function. The built-in missions and mentor content need no API keys or database.
4. On the deployment URL, open `/api/v1/health` and check for `"status":"healthy"`. Open `/api/v1/missions?environment=moon` and confirm a nonempty mission list, then open `/` and start a mission. The game includes fallback content, so loading the welcome screen alone does not verify the API.

## Project guide

- **frontend/src/game/** - Phaser scenes, movement, landmarks and textures.
- **frontend/src/components/** - Astronaut selection, mission HUD, journal and touch controls.
- **frontend/src/services/** - Browser storage and calls to the API.
- **backend/app/** - FastAPI routes, mission definitions, mentor knowledge and space science content.
- **api/index.py** - Vercel entry point for the same API used in local development.
- **docs/** - Requirements and development backlog.
