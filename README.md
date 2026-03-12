# 🧭 Voyager — AI Travel Planning Agent

> An autonomous AI agent that plans, organizes, and optimizes multi-day travels.  
> From the GR20 in Corsica to city breaks in Tokyo — fully customizable trip planning portal.

---

## 🎯 Vision

Voyager is an AI-powered travel planning platform that combines:
- **An autonomous planning agent** that researches destinations, transport, accommodation, and activities
- **A customizable portal** where every trip component (destination, transport, budget, duration, dates) is modular and configurable
- **Collaborative planning** so you can plan trips with friends in real-time

### First Use Case
🥾 **GR20 Corsica** — 8-day trek through Europe's toughest trail, June 2026, with a friend.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VOYAGER PLATFORM                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────┐  ┌──────────────────────────┐  │
│  │     📱 PORTAL (Next.js 15)      │  │   🤖 AI AGENT (Python)   │  │
│  │                                 │  │                          │  │
│  │  ┌───────────┐ ┌────────────┐   │  │  ┌────────────────────┐  │  │
│  │  │ Trip      │ │ Itinerary  │   │  │  │   LangGraph        │  │  │
│  │  │ Builder   │ │ View       │   │  │  │   Orchestrator     │  │  │
│  │  │ Wizard    │ │ (day-by-   │   │  │  │                    │  │  │
│  │  │           │ │  day)      │   │  │  │  ┌──────────────┐  │  │  │
│  │  └───────────┘ └────────────┘   │  │  │  │ Planner Agent│  │  │  │
│  │  ┌───────────┐ ┌────────────┐   │  │  │  │ (itinerary)  │  │  │  │
│  │  │ Dashboard │ │ AI Chat    │   │  │  │  ├──────────────┤  │  │  │
│  │  │ (trips    │ │ Panel      │◄──┼──┼──┤  │ Transport    │  │  │  │
│  │  │  overview)│ │            │   │  │  │  │ Agent        │  │  │  │
│  │  └───────────┘ └────────────┘   │  │  │  ├──────────────┤  │  │  │
│  │  ┌───────────┐ ┌────────────┐   │  │  │  │ Budget Agent │  │  │  │
│  │  │ Map View  │ │ Budget     │   │  │  │  ├──────────────┤  │  │  │
│  │  │ (Mapbox)  │ │ Tracker    │   │  │  │  │ Weather/     │  │  │  │
│  │  └───────────┘ └────────────┘   │  │  │  │ Logistics    │  │  │  │
│  │                                 │  │  │  └──────────────┘  │  │  │
│  └──────────────┬──────────────────┘  │  └─────────┬──────────┘  │  │
│                 │                     │            │              │  │
│                 │         REST/WS     │            │              │  │
│                 └─────────────────────┼────────────┘              │  │
│                                       │                           │  │
├───────────────────────────────────────┼───────────────────────────┤  │
│                                       │                           │  │
│  ┌────────────────────────────────────┴────────────────────────┐  │  │
│  │              🔧 BACKEND API (FastAPI)                       │  │  │
│  │                                                             │  │  │
│  │  /api/trips     - CRUD trips                                │  │  │
│  │  /api/agent     - AI agent interactions (WebSocket)         │  │  │
│  │  /api/search    - Search flights, trains, hotels            │  │  │
│  │  /api/itinerary - Generated itineraries                     │  │  │
│  │  /api/collab    - Real-time collaboration                   │  │  │
│  └─────────────────────────┬───────────────────────────────────┘  │  │
│                             │                                     │  │
├─────────────────────────────┼─────────────────────────────────────┤  │
│                             │                                     │  │
│  ┌──────────┐ ┌──────────┐ │ ┌──────────┐ ┌──────────┐           │  │
│  │ Claude   │ │ Amadeus  │ │ │ Google   │ │ OpenWx   │           │  │
│  │ API      │ │ (flights │ │ │ Maps     │ │ Map      │           │  │
│  │ (LLM)   │ │  trains) │ │ │          │ │ (weather)│           │  │
│  └──────────┘ └──────────┘ │ └──────────┘ └──────────┘           │  │
│  ┌──────────┐ ┌──────────┐ │ ┌──────────┐                        │  │
│  │ Rome2Rio │ │ Booking  │ │ │ Supabase │                        │  │
│  │ (multi-  │ │ .com     │ │ │ (DB +    │                        │  │
│  │  modal)  │ │ (hotels) │ │ │  Auth)   │                        │  │
│  └──────────┘ └──────────┘   └──────────┘                        │  │
│                                                                   │  │
└───────────────────────────────────────────────────────────────────┘  │
```

---

## 🤖 AI Agent Architecture (LangGraph)

The agent uses a **graph-based state machine** with specialized sub-agents:

```
                    ┌─────────────────┐
                    │   User Input    │
                    │ (trip params)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Supervisor   │
                    │    Agent        │
                    │ (orchestrates)  │
                    └──┬──┬──┬──┬────┘
                       │  │  │  │
          ┌────────────┘  │  │  └────────────┐
          │               │  │               │
  ┌───────▼──────┐ ┌─────▼──▼────┐ ┌────────▼───────┐
  │  🗺️ Route    │ │ 🚆 Transport│ │  💰 Budget     │
  │  Planner     │ │  Finder     │ │  Optimizer     │
  │              │ │             │ │                │
  │ • Stages     │ │ • Flights   │ │ • Cost calc    │
  │ • POIs       │ │ • Trains    │ │ • Alternatives │
  │ • Distances  │ │ • Car rental│ │ • Splitting    │
  │ • Elevation  │ │ • Transfers │ │                │
  └──────┬───────┘ └──────┬──────┘ └───────┬────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                 ┌────────▼────────┐
                 │  🏨 Lodging &   │
                 │  Logistics      │
                 │                 │
                 │ • Refuges/Hotels│
                 │ • Gear list     │
                 │ • Food/Water    │
                 │ • Permits       │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │  ☀️ Weather &   │
                 │  Safety         │
                 │                 │
                 │ • Forecasts     │
                 │ • Trail status  │
                 │ • Alerts        │
                 └────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │  📋 Itinerary   │
                 │  Compiler       │
                 │                 │
                 │ → Day-by-day    │
                 │ → Budget summary│
                 │ → Packing list  │
                 │ → Booking links │
                 └─────────────────┘
```

### Agent Tools

| Tool | API | Purpose |
|------|-----|---------|
| `search_flights` | Amadeus | Find flights to nearest airport |
| `search_trains` | Rome2Rio / SNCF | Train connections |
| `search_accommodation` | Booking.com | Hotels, hostels, refuges |
| `get_route_info` | Google Maps + trail DBs | Trail stages, distances, elevation |
| `get_weather` | OpenWeatherMap | Historical + forecast weather |
| `calculate_budget` | Internal | Cost estimation and optimization |
| `search_activities` | Google Places | Local activities and restaurants |

---

## 📱 UI Design — Trip Builder Portal

### 1. Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  🧭 Voyager                              👤 Alexandre   ⚙️      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Welcome back, Alexandre!                    [+ New Trip]        │
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ 🥾 GR20 Corsica     │  │ ➕                   │               │
│  │                     │  │                     │               │
│  │ Jun 15-22, 2026     │  │   Create a new      │               │
│  │ 2 travelers         │  │   adventure         │               │
│  │ Budget: €1,500      │  │                     │               │
│  │                     │  │                     │               │
│  │ ████████░░ 80%      │  │                     │               │
│  │ Planning complete   │  │                     │               │
│  │                     │  │                     │               │
│  │ [View] [Edit] [AI]  │  │                     │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 2. Trip Builder Wizard (Step-by-Step)

```
┌──────────────────────────────────────────────────────────────────┐
│  🧭 Voyager  >  New Trip                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1 of 5                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━             │
│  ● Destination  ○ Transport  ○ Dates  ○ Budget  ○ Preferences   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  🌍 Where do you want to go?                             │    │
│  │                                                          │    │
│  │  Type:  ○ City   ○ Region   ● Trail/Route   ○ Country   │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────┐         │    │
│  │  │ 🔍  GR20, Corsica, France                   │         │    │
│  │  └─────────────────────────────────────────────┘         │    │
│  │                                                          │    │
│  │  Suggestions:                                            │    │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │    │
│  │  │ 🥾 GR20    │ │ 🏔️ TMB     │ │ 🌋 Camino  │           │    │
│  │  │ Corsica    │ │ Mont Blanc │ │ Santiago   │           │    │
│  │  │ 16 stages  │ │ 11 days    │ │ 30+ days   │           │    │
│  │  └────────────┘ └────────────┘ └────────────┘           │    │
│  │                                                          │    │
│  │  ✅ AI will auto-research stages, refuges & logistics    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│                                    [Back]  [Next →]              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3. Transport Selection

```
┌──────────────────────────────────────────────────────────────────┐
│  Step 2 of 5 — Transport                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  🚆 How will you get there?                              │    │
│  │                                                          │    │
│  │  From: ┌──────────────────────────┐                      │    │
│  │        │ 📍 Paris, France          │                      │    │
│  │        └──────────────────────────┘                      │    │
│  │  To:   ┌──────────────────────────┐                      │    │
│  │        │ 📍 Calvi, Corsica         │  (auto-detected)     │    │
│  │        └──────────────────────────┘                      │    │
│  │                                                          │    │
│  │  Options:                                                │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │    │
│  │  │ ✈️ Flight    │ │ 🚆 Train +  │ │ 🚗 Drive +  │        │    │
│  │  │             │ │    Ferry    │ │    Ferry    │        │    │
│  │  │ ~€120 RT    │ │ ~€95 RT     │ │ ~€200+fuel  │        │    │
│  │  │ 1h30        │ │ 8h          │ │ 12h         │        │    │
│  │  │ CDG→CLY     │ │ Gare→Bastia │ │ A6→Livorno  │        │    │
│  │  │    [●]      │ │    [ ]      │ │    [ ]      │        │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘        │    │
│  │                                                          │    │
│  │  ☑️ Compare prices across dates automatically             │    │
│  │  ☑️ Include return transport                               │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 4. AI Chat + Itinerary View

```
┌──────────────────────────────────────────────────────────────────┐
│  🧭 Voyager  >  GR20 Corsica  >  Itinerary                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐  ┌─────────────────────────────┐  │
│  │   📋 Day-by-Day          │  │  🤖 AI Assistant             │  │
│  │                          │  │                             │  │
│  │  Day 1 - Jun 15          │  │  💬 I've planned your GR20  │  │
│  │  ✈️ Paris → Calvi (1h30) │  │  north section in 8 days.  │  │
│  │  🚌 Calvi → Calenzana    │  │  Total budget: €1,340 for  │  │
│  │  🥾 → Ortu di u Piobbu   │  │  2 people.                 │  │
│  │     12km │ +1460m ↑      │  │                             │  │
│  │  🏠 Refuge (€15/night)   │  │  Key highlights:            │  │
│  │                          │  │  • Monte Cinto summit Day 4 │  │
│  │  Day 2 - Jun 16          │  │  • Lac de Nino Day 6        │  │
│  │  🥾 → Refuge de Carrozzu │  │  • All refuges pre-booked  │  │
│  │     8km │ +600m ↑        │  │                             │  │
│  │  🏠 Refuge (€15/night)   │  │  ─────────────────────────  │  │
│  │                          │  │                             │  │
│  │  Day 3 - Jun 17          │  │  You: Can we add a rest     │  │
│  │  🥾 → Haut Asco          │  │  day at Haut Asco?          │  │
│  │     10km │ +700m ↑       │  │                             │  │
│  │  🏠 Haut Asco (€25)      │  │  🤖 Sure! I'll restructure │  │
│  │                          │  │  the itinerary to add a     │  │
│  │  Day 4 - Jun 18          │  │  rest day. This extends the │  │
│  │  🥾 → Tighjettu          │  │  trip to 9 days. Updated    │  │
│  │  ⚠️ Technical - chains    │  │  budget: €1,410.            │  │
│  │     9km │ +1200m ↑       │  │                             │  │
│  │  ...                     │  │  ┌──────────────────────┐   │  │
│  │                          │  │  │ Ask me anything...    │   │  │
│  └──────────────────────────┘  │  └──────────────────────┘   │  │
│                                 └─────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  🗺️ Map View                                             │    │
│  │  ╔═══════╗                                               │    │
│  │  ║ Calvi ║──▶ Calenzana ──▶ Ortu ──▶ Carrozzu           │    │
│  │  ╚═══════╝       ──▶ Haut Asco ──▶ Tighjettu            │    │
│  │         ──▶ Manganu ──▶ Petra Piana ──▶ Onda ──▶ Vizzav  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [📥 Export PDF]  [📤 Share]  [💰 Budget: €1,340]  [👥 2 ppl]   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 5. Budget Tracker

```
┌──────────────────────────────────────────────────────────────────┐
│  💰 Budget — GR20 Corsica (2 travelers)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Total: €1,340    Per person: €670    Remaining: €160            │
│  Budget: €1,500   ██████████████████████████░░░░ 89%             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐      │
│  │ Category         │ Amount  │ Per Person │ % of Budget  │      │
│  ├──────────────────┼─────────┼────────────┼──────────────┤      │
│  │ ✈️ Transport      │   €240  │      €120  │         16%  │      │
│  │ 🏠 Accommodation  │   €280  │      €140  │         19%  │      │
│  │ 🍽️ Food           │   €480  │      €240  │         32%  │      │
│  │ 🎫 Permits/Fees   │    €40  │       €20  │          3%  │      │
│  │ 🎒 Gear rental    │   €120  │       €60  │          8%  │      │
│  │ 📱 Insurance      │   €100  │       €50  │          7%  │      │
│  │ 🚌 Local transport│    €80  │       €40  │          5%  │      │
│  │ 💡 Misc           │     €0  │        €0  │          0%  │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                  │
│  💡 AI Tip: Book flights by April for ~30% savings               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Customizable Trip Components

The portal is built around **modular, reusable components** that can be mixed and matched:

```
┌─────────────────────────────────────────────────────────────┐
│                   TRIP COMPONENT LIBRARY                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 🌍 Destination│  │ 📅 Period    │  │ 🚆 Transport │      │
│  │              │  │              │  │              │      │
│  │ • City       │  │ • Fixed dates│  │ • Flight     │      │
│  │ • Region     │  │ • Flexible   │  │ • Train      │      │
│  │ • Trail      │  │ • Duration   │  │ • Car        │      │
│  │ • Country    │  │ • Season     │  │ • Ferry      │      │
│  │ • Multi-stop │  │              │  │ • Multimodal │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 💰 Budget    │  │ 👥 Group     │  │ ⚡ Activity   │      │
│  │              │  │              │  │   Level      │      │
│  │ • Total cap  │  │ • Solo       │  │              │      │
│  │ • Per person │  │ • Couple     │  │ • Relaxed    │      │
│  │ • Categories │  │ • Friends    │  │ • Moderate   │      │
│  │ • Currency   │  │ • Family     │  │ • Intense    │      │
│  │              │  │ • Team       │  │ • Extreme    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 🏨 Lodging   │  │ 🍽️ Food      │  │ 🎒 Gear      │      │
│  │   Preference │  │   Preference │  │              │      │
│  │              │  │              │  │              │      │
│  │ • Hotel      │  │ • Restaurants│  │ • Provided   │      │
│  │ • Hostel     │  │ • Self-cook  │  │ • Rent       │      │
│  │ • Camping    │  │ • Mixed      │  │ • Own gear   │      │
│  │ • Refuge/Hut │  │ • Local food │  │ • Buy list   │      │
│  │ • Airbnb     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
voyager/
├── frontend/                    # Next.js 15 application
│   ├── app/
│   │   ├── (auth)/             # Login, signup
│   │   ├── dashboard/          # Trip overview
│   │   ├── trips/
│   │   │   ├── new/            # Trip builder wizard
│   │   │   └── [id]/           # Trip detail + itinerary
│   │   └── api/                # Next.js API routes (BFF)
│   ├── components/
│   │   ├── trip-builder/       # Modular trip components
│   │   │   ├── destination-picker.tsx
│   │   │   ├── transport-selector.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── budget-config.tsx
│   │   │   └── group-config.tsx
│   │   ├── itinerary/          # Itinerary display
│   │   ├── chat/               # AI chat panel
│   │   ├── map/                # Map visualization
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       ├── api.ts              # Backend API client
│       └── types.ts            # Shared types
│
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── main.py             # FastAPI app
│   │   ├── routers/
│   │   │   ├── trips.py        # Trip CRUD
│   │   │   ├── agent.py        # AI agent WebSocket
│   │   │   ├── search.py       # Travel search APIs
│   │   │   └── itinerary.py    # Itinerary management
│   │   ├── agent/
│   │   │   ├── graph.py        # LangGraph workflow
│   │   │   ├── nodes/
│   │   │   │   ├── supervisor.py
│   │   │   │   ├── route_planner.py
│   │   │   │   ├── transport_finder.py
│   │   │   │   ├── budget_optimizer.py
│   │   │   │   ├── lodging_logistics.py
│   │   │   │   └── weather_safety.py
│   │   │   ├── tools/
│   │   │   │   ├── flights.py      # Amadeus API
│   │   │   │   ├── trains.py       # Rome2Rio/SNCF
│   │   │   │   ├── accommodation.py# Booking.com
│   │   │   │   ├── maps.py         # Google Maps
│   │   │   │   ├── weather.py      # OpenWeatherMap
│   │   │   │   └── activities.py   # Google Places
│   │   │   └── state.py        # Agent state schema
│   │   ├── models/             # SQLAlchemy models
│   │   └── services/           # Business logic
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/                        # Documentation
│   ├── architecture.md
│   └── api.md
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15, React 19, Tailwind CSS, shadcn/ui | Modern, fast, great DX |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy | Best AI/ML ecosystem |
| **AI Agent** | LangGraph, Claude API (Anthropic) | Stateful multi-agent orchestration |
| **Database** | PostgreSQL (Supabase) | Managed, real-time subscriptions |
| **Maps** | Mapbox GL JS | Free tier, beautiful maps |
| **Auth** | Supabase Auth (OAuth + magic links) | Zero-config auth |
| **Transport APIs** | Amadeus, Rome2Rio | Flights, trains, multimodal |
| **Accommodation** | Booking.com Affiliate API | Hotels, hostels, refuges |
| **Weather** | OpenWeatherMap | 7-day forecast + historical |
| **Deployment** | Vercel (FE), Azure Container Apps (BE) | Serverless + containers |
| **CI/CD** | GitHub Actions | Automated testing + deploy |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/voyager.git
cd voyager

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

---

## 📋 Roadmap

- [ ] **Phase 1** — Project scaffold, basic trip CRUD, UI shell
- [ ] **Phase 2** — AI agent with LangGraph, Claude integration
- [ ] **Phase 3** — Transport & accommodation search APIs
- [ ] **Phase 4** — Map visualization, day-by-day itinerary
- [ ] **Phase 5** — Budget tracking, collaborative planning
- [ ] **Phase 6** — Export (PDF), sharing, mobile responsive
- [ ] **Phase 7** — First real trip: GR20 Corsica 🥾

---

## 🗒️ Design Decisions

### Why NOT fork Copilot / Claude Code?
GitHub Copilot and Claude Code are **code assistants** — their architecture is optimized for reading/editing source code, running terminal commands, and understanding programming languages. Forking them for travel planning would mean:
- Stripping out 90% of code-specific tooling
- Rebuilding the tool layer from scratch anyway
- Fighting against abstractions designed for a different domain

Instead, we **build a purpose-built agent** using the same underlying technology (Claude API + tool use) but with **travel-specific tools** (flight search, route planning, weather, etc.). This gives us all the AI power with none of the irrelevant baggage.

### Why LangGraph?
- **Stateful**: Travel planning requires maintaining complex state across many steps
- **Human-in-the-loop**: Users can review and modify AI suggestions at each step
- **Debuggable**: Graph-based flows are easy to visualize and debug
- **Production-ready**: Battle-tested at scale

---

## License

MIT
