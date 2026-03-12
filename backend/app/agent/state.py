"""LangGraph Agent State Schema"""

from typing import Annotated, Sequence
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class TripParameters(TypedDict):
    """User-provided trip parameters."""
    destination: str
    destination_type: str  # city, region, trail, country
    transport_preference: str  # flight, train, car, multimodal
    departure_city: str
    start_date: str
    end_date: str
    duration_days: int
    budget_total: float
    budget_currency: str
    num_travelers: int
    activity_level: str  # relaxed, moderate, intense, extreme
    lodging_preference: str  # hotel, hostel, camping, refuge
    food_preference: str  # restaurants, self-cook, mixed


class AgentState(TypedDict):
    """State passed between agent nodes."""
    messages: Annotated[Sequence[BaseMessage], add_messages]
    trip_params: TripParameters
    route_plan: dict | None
    transport_options: list[dict]
    accommodation_options: list[dict]
    weather_forecast: dict | None
    budget_breakdown: dict | None
    itinerary: list[dict]
    current_agent: str
    needs_human_input: bool
