"""Pydantic models for the API."""

from datetime import date
from enum import Enum
from pydantic import BaseModel, Field


class DestinationType(str, Enum):
    CITY = "city"
    REGION = "region"
    TRAIL = "trail"
    COUNTRY = "country"


class TransportType(str, Enum):
    FLIGHT = "flight"
    TRAIN = "train"
    CAR = "car"
    MULTIMODAL = "multimodal"


class ActivityLevel(str, Enum):
    RELAXED = "relaxed"
    MODERATE = "moderate"
    INTENSE = "intense"
    EXTREME = "extreme"


class LodgingType(str, Enum):
    HOTEL = "hotel"
    HOSTEL = "hostel"
    CAMPING = "camping"
    REFUGE = "refuge"
    MIXED = "mixed"


class TripStatus(str, Enum):
    DRAFT = "draft"
    PLANNING = "planning"
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class ItineraryDay(BaseModel):
    day: int
    date: str
    title: str
    description: str
    distance: str | None = None
    elevation: str | None = None
    accommodation: str | None = None
    accommodation_cost: float | None = None
    activities: list[str] = []
    warnings: list[str] = []


class BudgetItem(BaseModel):
    category: str
    icon: str
    amount: float
    per_person: float
    percentage: float


class TripCreate(BaseModel):
    name: str
    destination: str
    destination_type: DestinationType = DestinationType.TRAIL
    departure_city: str = "Paris, France"
    transport: TransportType = TransportType.FLIGHT
    start_date: date
    end_date: date
    budget: float = 1500.0
    currency: str = "EUR"
    travelers: int = 2
    activity_level: ActivityLevel = ActivityLevel.INTENSE
    lodging: LodgingType = LodgingType.REFUGE


class Trip(BaseModel):
    id: str
    name: str
    destination: str
    destination_type: DestinationType
    departure_city: str
    transport: TransportType
    start_date: date
    end_date: date
    duration_days: int
    budget: float
    currency: str
    travelers: int
    activity_level: ActivityLevel
    lodging: LodgingType
    status: TripStatus = TripStatus.DRAFT
    progress: int = 0
    itinerary: list[ItineraryDay] = []
    budget_breakdown: list[BudgetItem] = []


class ChatRequest(BaseModel):
    trip_id: str
    message: str


class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str
    updated_itinerary: list[ItineraryDay] | None = None
