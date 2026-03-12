"""AI Agent chat router."""

import os
import httpx
from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.trip_store import get_trip

router = APIRouter(prefix="/api/agent", tags=["agent"])


AGENT_SYSTEM_PROMPT = """You are Voyager, an AI travel planning assistant. You help users plan trips by:
- Creating and refining day-by-day itineraries
- Suggesting transport options (flights, trains, car)
- Recommending accommodation based on preferences
- Optimizing budgets
- Providing weather and safety information
- Sharing local tips and must-see spots

Be concise, practical, and enthusiastic about travel. Use emojis sparingly for clarity.
When discussing hiking trails like the GR20, emphasize safety, preparation, and realistic expectations."""


async def _call_claude(system_prompt: str, user_message: str) -> str:
    """Call Claude via Azure Databricks serving endpoint (OpenAI-compatible)."""
    endpoint = os.getenv("ANTHROPIC_API_ENDPOINT")
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not endpoint or not api_key or api_key == "xxxxx":
        raise ValueError("ANTHROPIC_API_ENDPOINT and ANTHROPIC_API_KEY must be set")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            endpoint,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                "max_tokens": 1024,
            },
        )
        response.raise_for_status()
        data = response.json()

        # Databricks returns OpenAI-compatible format
        if "choices" in data:
            return data["choices"][0]["message"]["content"]
        # Anthropic native format fallback
        if "content" in data:
            return data["content"][0]["text"]
        raise ValueError(f"Unexpected response format: {list(data.keys())}")


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    trip = get_trip(request.trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    endpoint = os.getenv("ANTHROPIC_API_ENDPOINT")

    if api_key and endpoint and not api_key.startswith("xxxxx"):
        try:
            trip_context = (
                f"Trip: {trip.name} | Destination: {trip.destination} | "
                f"Dates: {trip.start_date} to {trip.end_date} | "
                f"Travelers: {trip.travelers} | Budget: {trip.currency} {trip.budget} | "
                f"Transport: {trip.transport} | Lodging: {trip.lodging} | "
                f"Activity level: {trip.activity_level}"
            )
            content = await _call_claude(
                system_prompt=f"{AGENT_SYSTEM_PROMPT}\n\nCurrent trip context: {trip_context}",
                user_message=request.message,
            )
            return ChatResponse(content=content)
        except Exception as e:
            return ChatResponse(
                content=f"Agent error: {str(e)}. Falling back to demo mode."
            )
    else:
        return _demo_response(request.message, trip)


def _demo_response(message: str, trip) -> ChatResponse:
    """Generate contextual demo responses."""
    msg_lower = message.lower()

    if any(w in msg_lower for w in ["rest day", "rest", "break"]):
        return ChatResponse(
            content=(
                f"Great idea! Adding a rest day would extend your trip to {trip.duration_days + 1} days. "
                f"I'd recommend resting at Haut Asco (Day 3) — it has a restaurant, showers, and is the "
                f"last comfort stop before the toughest sections. This would add ~€25-40 to your budget "
                f"for accommodation and meals.\n\n"
                f"Want me to restructure the itinerary with this rest day?"
            )
        )
    elif any(w in msg_lower for w in ["budget", "cost", "money", "cheap", "save"]):
        return ChatResponse(
            content=(
                f"Your current budget is €{trip.budget} for {trip.travelers} travelers "
                f"(€{trip.budget // trip.travelers}/person). Here are some tips:\n\n"
                f"• 💰 Book flights 3+ months early → save ~30%\n"
                f"• ⛺ Bivouac near refuges instead of sleeping inside → save €15/night\n"
                f"• 🍽️ Bring dehydrated meals → save €10-15/day vs refuge meals\n"
                f"• 🎒 Rent gear in Calvi rather than bringing from Paris\n\n"
                f"Would you like me to create a detailed budget breakdown?"
            )
        )
    elif any(w in msg_lower for w in ["weather", "rain", "temperature", "hot", "cold"]):
        return ChatResponse(
            content=(
                "June is one of the best months for the GR20! ☀️\n\n"
                "• Expect 20-28°C in valleys, 8-15°C at altitude\n"
                "• Afternoon thunderstorms are common — start hiking by 6-7am\n"
                "• Snow patches possible above 2,000m in early June\n"
                "• UV is intense at altitude — SPF 50+ essential\n\n"
                "I'll check the forecast closer to your departure date and alert you to any concerns."
            )
        )
    elif any(w in msg_lower for w in ["gear", "pack", "equipment", "bring", "list"]):
        return ChatResponse(
            content=(
                "Essential GR20 gear list for June:\n\n"
                "🎒 **Backpack**: 40-50L, lightweight\n"
                "👟 **Boots**: Sturdy, broken-in, ankle support\n"
                "🧥 **Layers**: Base + fleece + waterproof shell\n"
                "🩳 **Clothes**: 2 sets hiking, 1 camp set\n"
                "😴 **Sleep**: Lightweight sleeping bag (5-10°C)\n"
                "💧 **Water**: 2L capacity + purification tablets\n"
                "🥾 **Poles**: Highly recommended for descents\n"
                "🧤 **Gloves**: For chain/scramble sections\n"
                "☀️ **Sun**: Hat, sunglasses, SPF 50+\n"
                "🗺️ **Navigation**: Offline maps, IGN 1:25000\n\n"
                "Target pack weight: 8-10kg without water."
            )
        )
    else:
        return ChatResponse(
            content=(
                f"I'd be happy to help with that! In production, I'd use the LangGraph agent to:\n\n"
                f"1. Research your specific question with real-time data\n"
                f"2. Cross-reference with your trip details ({trip.name}, {trip.start_date} to {trip.end_date})\n"
                f"3. Update your itinerary if needed\n\n"
                f"Try asking me about:\n"
                f"• Adding a rest day\n"
                f"• Budget optimization tips\n"
                f"• Weather conditions\n"
                f"• Gear and packing list\n\n"
                f"Set `ANTHROPIC_API_KEY` in `.env` for full AI-powered responses!"
            )
        )
