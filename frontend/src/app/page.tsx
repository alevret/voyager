import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 className="text-5xl font-bold tracking-tight">
        <span className="mr-3">🧭</span>Voyager
      </h1>
      <p className="mt-4 text-xl text-[var(--muted-foreground)]">
        AI-powered travel planning agent. Plan your next adventure autonomously.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-left">
          <div className="text-3xl">🤖</div>
          <h3 className="mt-3 font-semibold">Autonomous Agent</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            AI researches destinations, transport, accommodation, and builds your itinerary.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-left">
          <div className="text-3xl">🧩</div>
          <h3 className="mt-3 font-semibold">Fully Customizable</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Mix and match trip components — destination, transport, budget, dates, group size.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-left">
          <div className="text-3xl">👥</div>
          <h3 className="mt-3 font-semibold">Collaborative</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Plan trips with friends. Share itineraries, split budgets, vote on options.
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <Link
          href="/trips/new"
          className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          Plan a Trip →
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-[var(--border)] px-6 py-3 font-semibold hover:bg-[var(--accent)] transition-colors"
        >
          View Dashboard
        </Link>
      </div>

      <div className="mt-16 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-left">
        <h2 className="text-lg font-semibold">🥾 Featured: GR20 Corsica</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Europe&apos;s toughest trek — 8 days through Corsica&apos;s spine. Calenzana to Vizzavona.
          June 2026 with 2 travelers. Budget: €1,500.
        </p>
        <Link
          href="/trips/gr20-corsica-2026"
          className="mt-4 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
        >
          View itinerary →
        </Link>
      </div>
    </div>
  );
}
