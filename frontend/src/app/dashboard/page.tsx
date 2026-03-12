"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchTrips } from "@/lib/api";

interface TripSummary {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  budget: number;
  progress: number;
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center text-[var(--muted-foreground)]">Loading trips...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Alexandre!</h1>
          <p className="text-[var(--muted-foreground)]">Your upcoming adventures</p>
        </div>
        <Link
          href="/trips/new"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          + New Trip
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition-colors"
          >
            <div className="text-3xl">🥾</div>
            <h3 className="mt-3 text-lg font-semibold group-hover:text-[var(--primary)] transition-colors">
              {trip.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {trip.destination}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[var(--secondary)] px-2 py-1">
                📅 {trip.start_date} → {trip.end_date}
              </span>
              <span className="rounded-full bg-[var(--secondary)] px-2 py-1">
                👥 {trip.travelers} travelers
              </span>
              <span className="rounded-full bg-[var(--secondary)] px-2 py-1">
                💰 €{trip.budget}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>Planning progress</span>
                <span>{trip.progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-[var(--secondary)]">
                <div
                  className="h-2 rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${trip.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}

        <Link
          href="/trips/new"
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] p-6 text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
        >
          <div className="text-4xl">➕</div>
          <p className="mt-2 font-medium">Create a new adventure</p>
        </Link>
      </div>
    </div>
  );
}
