# CareerMind

CareerMind is a memory-based AI career advisor built with Next.js, Tailwind CSS, Groq, and Hindsight.

It helps a user track career progress across sessions by remembering:

- skills
- projects
- resume versions
- internship applications
- coding weaknesses
- mentor conversations

The core idea is simple: the advisor should not answer like a stateless chatbot. It should use past user history to give more specific career guidance over time.

## What It Does

CareerMind includes five main product flows:

- `Dashboard`
  - career readiness score
  - Hindsight memory bank summary
  - career timeline
  - quick actions
  - AI suggestions

- `AI Mentor`
  - personalized career chat
  - memory-aware responses
  - visible `Memory used` section for demo clarity

- `Resume Builder`
  - paste resume text
  - get AI feedback
  - generate a memory-based resume draft

- `Internships`
  - track applications
  - log statuses like applied, interview, rejected, offer
  - generate strategy context from previous applications

- `Skill Analysis`
  - track skills
  - view current strengths
  - run role-based gap analysis

## Why Hindsight

Hindsight is the core memory engine in this project.

It is used to:

- retain user profile updates
- retain resume changes
- retain internship events
- retain mentor interactions
- recall relevant memories before generating a response

This is what makes the app feel like a persistent advisor instead of a one-shot chatbot.

Main integration file:

- [lib/hindsight.ts](C:/Users/admin/Documents/New%20project/lib/hindsight.ts)

Main advisor orchestration:

- [lib/career-advisor.ts](C:/Users/admin/Documents/New%20project/lib/career-advisor.ts)

## Tech Stack

- `Next.js 15`
- `React 19`
- `Tailwind CSS`
- `Groq API`
- `Hindsight`
- local JSON demo persistence for offline fallback

## Project Structure

```text
app/
  api/
    chat/
    dashboard/
    demo/reset/
    internships/
    profile/
    resume-feedback/
    resume-generate/
    skill-analysis/
  chat/
  internships/
  resume/
  skills/

components/
  app-shell.tsx
  chat-mentor.tsx
  dashboard-client.tsx
  internship-tracker.tsx
  resume-workbench.tsx
  skill-analysis.tsx

lib/
  career-advisor.ts
  demo-data.ts
  demo-store.ts
  groq.ts
  hindsight.ts
  scoring.ts
  types.ts
Setup
1. Install dependencies
npm install
2. Create environment file
Copy:

copy .env.example .env.local
Then fill in:

GROQ_API_KEY
GROQ_MODEL
HINDSIGHT_API_URL
HINDSIGHT_API_KEY
HINDSIGHT_BANK_ID
Example:

NEXT_PUBLIC_APP_NAME="CareerMind"
GROQ_API_KEY="your_groq_key"
GROQ_MODEL="qwen/qwen3-32b"
HINDSIGHT_API_URL="https://hindsight.vectorize.io"
HINDSIGHT_API_KEY="your_hindsight_key"
HINDSIGHT_BANK_ID="career-mentor-demo"
DEMO_USER_ID="demo-user"
3. Run the app
npm run dev
Open:

http://localhost:3000

Demo Flow
If you want to demo the app from a clean state:

Start the app
Reset the demo state with:
POST /api/demo/reset
Open the dashboard
Ask a question in AI Mentor
Add a resume update
Add an internship update
Ask a similar question again
Show how the answer changes because memory changed
Useful files for demos:

app/api/chat/route.ts
app/api/demo/reset/route.ts
app/api/resume-feedback/route.ts
app/api/internships/route.ts
How Memory Works
At a high level:

user asks a question or updates profile data
app recalls relevant Hindsight memories
app generates a response using recalled context
app stores the new interaction back into memory
This loop is handled mainly in:

lib/career-advisor.ts
API Routes
POST /api/chat

generates mentor responses using recalled memory
GET /api/dashboard

returns dashboard state
GET /api/profile

returns current profile
PATCH /api/profile

updates stored profile data
POST /api/resume-feedback

saves a resume version and generates feedback
POST /api/resume-generate

creates a resume draft from stored data
GET /api/internships

returns applications and recommendations
POST /api/internships

saves a new application
POST /api/skill-analysis

runs role-based skill gap analysis
POST /api/demo/reset

resets local demo data
Notes
If Hindsight credentials are missing, the app falls back to a local JSON shadow store.
Demo persistence lives in:
data/profile.json
data/memory-log.json
The final UI was adapted to match the orange-and-white product layout you requested.
Future Improvements
real auth and multi-user storage
file upload for PDF resumes
charts for skill distribution
better internship recommendation ranking
production deployment config
License
For personal, educational, and demo use unless you add your own license.
