"use client";

import { useState, useEffect, use, useRef } from "react";
import { fetchTrip, chatWithAgent } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

interface TripData {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  budget: number;
  currency: string;
  travelers: number;
  activity_level: string;
  transport: string;
  lodging: string;
  status: string;
  progress: number;
  itinerary: {
    day: number;
    date: string;
    title: string;
    description: string;
    distance?: string;
    elevation?: string;
    accommodation?: string;
    accommodation_cost?: number;
    activities: string[];
    warnings: string[];
  }[];
  budget_breakdown: {
    category: string;
    icon: string;
    amount: number;
    per_person: number;
    percentage: number;
  }[];
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "map">("itinerary");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  useEffect(() => {
    fetchTrip(id)
      .then((data) => {
        setTrip(data);
        const totalSpent = data.budget_breakdown?.reduce((sum: number, b: { amount: number }) => sum + b.amount, 0) || 0;
        setMessages([
          {
            role: "assistant",
            content: `I've planned your ${data.name} trip in ${data.duration_days} days (${data.start_date} to ${data.end_date}). Total estimated budget: €${totalSpent} for ${data.travelers} people (€${Math.round(totalSpent / data.travelers)}/person).\n\nFeel free to ask me to adjust anything!`,
            timestamp: new Date(),
          },
        ]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSend = async () => {
    if (!input.trim() || !trip) return;
    const userMsg: ChatMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChatLoading(true);

    try {
      const response = await chatWithAgent(trip.id, input);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that. Is the backend running?", timestamp: new Date() },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center text-[var(--muted-foreground)]">Loading trip...</div>;
  if (error || !trip) return <div className="flex h-96 items-center justify-center text-red-500">Error: {error || "Trip not found"}</div>;

  const budget = trip.budget_breakdown || [];
  const totalSpent = budget.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">🥾 {trip.name}</h1>
          <p className="text-[var(--muted-foreground)]">{trip.destination}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1">📅 {trip.start_date} → {trip.end_date}</span>
            <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1">👥 {trip.travelers} travelers</span>
            <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1">💰 €{trip.budget} budget</span>
            <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1">🥾 {trip.duration_days} days</span>
            <span className="rounded-full bg-[var(--primary)]/20 text-[var(--primary)] px-2.5 py-1 font-medium">
              {trip.activity_level}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--accent)] transition-colors">
            📤 Share
          </button>
          <button className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--accent)] transition-colors">
            📥 Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-[var(--border)]">
        {(["itinerary", "budget", "map"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab === "itinerary" ? "📋 " : tab === "budget" ? "💰 " : "🗺️ "}
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Main content */}
        <div>
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              {trip.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-medium text-[var(--muted-foreground)]">
                        Day {day.day} — {day.date}
                      </div>
                      <h3 className="mt-1 font-semibold">{day.title}</h3>
                    </div>
                    {day.distance && (
                      <div className="text-right text-xs text-[var(--muted-foreground)]">
                        <div>{day.distance}</div>
                        <div>{day.elevation}</div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{day.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.activities.map((act, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                  {day.warnings && day.warnings.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {day.warnings.map((w, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                  {day.accommodation && (
                    <div className="mt-3 text-xs text-[var(--muted-foreground)]">
                      🏠 {day.accommodation}
                      {day.accommodation_cost ? ` — €${day.accommodation_cost}/night` : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "budget" && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[var(--muted-foreground)]">Total estimated</div>
                  <div className="text-3xl font-bold">€{totalSpent}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[var(--muted-foreground)]">Per person</div>
                  <div className="text-3xl font-bold">€{Math.round(totalSpent / trip.travelers)}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span>Budget used</span>
                  <span>€{totalSpent} / €{trip.budget} ({Math.round((totalSpent / trip.budget) * 100)}%)</span>
                </div>
                <div className="mt-1 h-3 w-full rounded-full bg-[var(--secondary)]">
                  <div
                    className="h-3 rounded-full bg-[var(--primary)] transition-all"
                    style={{ width: `${Math.min(100, (totalSpent / trip.budget) * 100)}%` }}
                  />
                </div>
              </div>
              <table className="mt-6 w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted-foreground)]">
                    <th className="pb-2">Category</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Per Person</th>
                    <th className="pb-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((item) => (
                    <tr key={item.category} className="border-b border-[var(--border)]">
                      <td className="py-2.5">{item.icon} {item.category}</td>
                      <td className="py-2.5 text-right">€{item.amount}</td>
                      <td className="py-2.5 text-right">€{item.per_person}</td>
                      <td className="py-2.5 text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                💡 AI Tip: Book flights by April for ~30% savings
              </p>
            </div>
          )}

          {activeTab === "map" && (
            <div className="flex h-96 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="text-center text-[var(--muted-foreground)]">
                <div className="text-4xl">🗺️</div>
                <p className="mt-2 text-sm">Map view will be rendered here with Mapbox GL JS</p>
                <p className="mt-1 text-xs">
                  Calenzana → Ortu → Carrozzu → Haut Asco → Tighjettu → Manganu → Petra Piana → Onda → Vizzavona
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <h3 className="font-semibold">🤖 AI Assistant</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Ask me to adjust your trip</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm ${
                  msg.role === "assistant"
                    ? "text-[var(--foreground)]"
                    : "ml-8 rounded-lg bg-[var(--primary)] p-3 text-[var(--primary-foreground)]"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">🤖 Voyager</div>
                )}
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            ))}
            {chatLoading && (
              <div className="text-sm text-[var(--muted-foreground)]">
                <div className="mb-1 text-xs font-medium">🤖 Voyager</div>
                <div className="animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !chatLoading && input.trim() && handleSend()}
                placeholder="Ask me anything..."
                disabled={chatLoading}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={chatLoading || !input.trim()}
                className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
