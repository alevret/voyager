"""Trip CRUD router."""

from fastapi import APIRouter, HTTPException
from app.models.schemas import Trip, TripCreate
from app.services.trip_store import get_all_trips, get_trip, create_trip, delete_trip

router = APIRouter(prefix="/api/trips", tags=["trips"])


@router.get("", response_model=list[Trip])
async def list_trips():
    return get_all_trips()


@router.get("/{trip_id}", response_model=Trip)
async def read_trip(trip_id: str):
    trip = get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.post("", response_model=Trip, status_code=201)
async def new_trip(data: TripCreate):
    return create_trip(data)


@router.delete("/{trip_id}", status_code=204)
async def remove_trip(trip_id: str):
    if not delete_trip(trip_id):
        raise HTTPException(status_code=404, detail="Trip not found")
