const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchTrips() {
  const res = await fetch(`${API_URL}/api/trips`);
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}

export async function fetchTrip(id: string) {
  const res = await fetch(`${API_URL}/api/trips/${id}`);
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function createTrip(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

export async function chatWithAgent(tripId: string, message: string) {
  const res = await fetch(`${API_URL}/api/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trip_id: tripId, message }),
  });
  if (!res.ok) throw new Error("Failed to chat with agent");
  return res.json();
}
