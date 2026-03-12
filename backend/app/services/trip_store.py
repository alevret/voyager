"""In-memory trip storage (replace with database in production)."""

from app.models.schemas import (
    Trip, TripCreate, ItineraryDay, BudgetItem,
    TripStatus, DestinationType, TransportType, ActivityLevel, LodgingType,
)
import uuid


# In-memory store
_trips: dict[str, Trip] = {}


def _create_gr20_sample() -> Trip:
    """Pre-populate with the GR20 sample trip."""
    itinerary = [
        ItineraryDay(
            day=1, date="2026-06-15",
            title="Paris → Calvi → Calenzana → Ortu di u Piobbu",
            description="Fly to Calvi, shuttle to Calenzana trailhead. Steep ascent through forests and maquis to first refuge.",
            distance="12 km", elevation="+1,460m / -180m",
            accommodation="Refuge d'Ortu di u Piobbu", accommodation_cost=15,
            activities=["✈️ Flight Paris CDG → Calvi (1h30)", "🚌 Shuttle Calvi → Calenzana", "🥾 Trek to first refuge"],
        ),
        ItineraryDay(
            day=2, date="2026-06-16",
            title="Ortu di u Piobbu → Refuge de Carrozzu",
            description="Traverse rocky terrain and high ridges. Descent into the Spasimata valley.",
            distance="8 km", elevation="+600m / -950m",
            accommodation="Refuge de Carrozzu", accommodation_cost=15,
            activities=["🥾 Ridge traverse with panoramic views", "📸 Spasimata valley viewpoint"],
        ),
        ItineraryDay(
            day=3, date="2026-06-17",
            title="Carrozzu → Haut Asco",
            description="Cross the Spasimata suspension bridge and scramble steep granite slabs.",
            distance="10 km", elevation="+700m / -800m",
            accommodation="Haut Asco Station", accommodation_cost=25,
            activities=["🌉 Spasimata suspension bridge", "🧗 Technical granite scrambling", "🍽️ Restaurant dinner"],
            warnings=["⚠️ Technical section with chains"],
        ),
        ItineraryDay(
            day=4, date="2026-06-18",
            title="Haut Asco → Tighjettu",
            description="Most challenging day. Optional Monte Cinto summit (2,706m). Difficult crossings with chains.",
            distance="9 km", elevation="+1,200m / -1,000m",
            accommodation="Refuge de Tighjettu", accommodation_cost=15,
            activities=["🏔️ Optional Monte Cinto summit (2,706m)", "🧗 Chain-assisted scrambles"],
            warnings=["⚠️ Most technical day", "⚠️ Exposed ridges — weather dependent"],
        ),
        ItineraryDay(
            day=5, date="2026-06-19",
            title="Tighjettu → Manganu (Double Stage)",
            description="Long day combining two stages. Rolling terrain across high meadows.",
            distance="22 km", elevation="+1,100m / -1,200m",
            accommodation="Refuge de Manganu", accommodation_cost=15,
            activities=["🥾 Double stage — long day", "🌿 High alpine meadows", "🏔️ Ciottulu di i Mori pass"],
            warnings=["⚠️ Long day — start early"],
        ),
        ItineraryDay(
            day=6, date="2026-06-20",
            title="Manganu → Petra Piana",
            description="Beautiful day via Lac de Nino, a stunning glacial lake surrounded by pozzines.",
            distance="9 km", elevation="+700m / -600m",
            accommodation="Refuge de Petra Piana", accommodation_cost=15,
            activities=["🏞️ Lac de Nino — iconic glacial lake", "🐴 Wild horses", "📸 Pozzines"],
        ),
        ItineraryDay(
            day=7, date="2026-06-21",
            title="Petra Piana → Onda",
            description="Traverse a rugged ridge with splendid views. Some chain-protected scrambles.",
            distance="10 km", elevation="+800m / -900m",
            accommodation="Refuge de l'Onda", accommodation_cost=15,
            activities=["🥾 Ridge traverse", "🧗 Chain-protected scrambles", "🌅 Sunset views"],
        ),
        ItineraryDay(
            day=8, date="2026-06-22",
            title="Onda → Vizzavona",
            description="Final descent through pine forests and cascading streams. Celebrate!",
            distance="14 km", elevation="+400m / -1,200m",
            accommodation="Train to Ajaccio", accommodation_cost=0,
            activities=["🌲 Pine forest descent", "💦 Cascade des Anglais swim", "🍺 Corsican Pietra beer", "🚆 Train → Ajaccio → Flight home"],
        ),
    ]

    budget_breakdown = [
        BudgetItem(category="Transport", icon="✈️", amount=240, per_person=120, percentage=16),
        BudgetItem(category="Accommodation", icon="🏠", amount=280, per_person=140, percentage=19),
        BudgetItem(category="Food", icon="🍽️", amount=480, per_person=240, percentage=32),
        BudgetItem(category="Permits & Fees", icon="🎫", amount=40, per_person=20, percentage=3),
        BudgetItem(category="Gear Rental", icon="🎒", amount=120, per_person=60, percentage=8),
        BudgetItem(category="Insurance", icon="📱", amount=100, per_person=50, percentage=7),
        BudgetItem(category="Local Transport", icon="🚌", amount=80, per_person=40, percentage=5),
    ]

    return Trip(
        id="gr20-corsica-2026",
        name="GR20 Corsica",
        destination="GR20, Corsica, France",
        destination_type=DestinationType.TRAIL,
        departure_city="Paris, France",
        transport=TransportType.FLIGHT,
        start_date="2026-06-15",
        end_date="2026-06-22",
        duration_days=8,
        budget=1500,
        currency="EUR",
        travelers=2,
        activity_level=ActivityLevel.INTENSE,
        lodging=LodgingType.REFUGE,
        status=TripStatus.PLANNING,
        progress=80,
        itinerary=itinerary,
        budget_breakdown=budget_breakdown,
    )


# Initialize with sample data
_sample = _create_gr20_sample()
_trips[_sample.id] = _sample


def get_all_trips() -> list[Trip]:
    return list(_trips.values())


def get_trip(trip_id: str) -> Trip | None:
    return _trips.get(trip_id)


def create_trip(data: TripCreate) -> Trip:
    trip_id = str(uuid.uuid4())[:8]
    duration = (data.end_date - data.start_date).days
    trip = Trip(
        id=trip_id,
        name=data.name,
        destination=data.destination,
        destination_type=data.destination_type,
        departure_city=data.departure_city,
        transport=data.transport,
        start_date=data.start_date,
        end_date=data.end_date,
        duration_days=duration,
        budget=data.budget,
        currency=data.currency,
        travelers=data.travelers,
        activity_level=data.activity_level,
        lodging=data.lodging,
        status=TripStatus.DRAFT,
        progress=0,
    )
    _trips[trip.id] = trip
    return trip


def delete_trip(trip_id: str) -> bool:
    if trip_id in _trips:
        del _trips[trip_id]
        return True
    return False
