"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "destination" | "transport" | "dates" | "budget" | "preferences";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "destination", label: "Destination", icon: "🌍" },
  { key: "transport", label: "Transport", icon: "🚆" },
  { key: "dates", label: "Dates", icon: "📅" },
  { key: "budget", label: "Budget", icon: "💰" },
  { key: "preferences", label: "Preferences", icon: "⚙️" },
];

const DESTINATION_TYPES = [
  { value: "city", label: "City", icon: "🏙️" },
  { value: "region", label: "Region", icon: "🗺️" },
  { value: "trail", label: "Trail / Route", icon: "🥾" },
  { value: "country", label: "Country", icon: "🌎" },
];

const TRANSPORT_OPTIONS = [
  { value: "flight", label: "Flight", icon: "✈️", example: "~€120 RT, 1h30" },
  { value: "train", label: "Train", icon: "🚆", example: "~€95 RT, 8h" },
  { value: "car", label: "Drive", icon: "🚗", example: "~€200 + fuel" },
  { value: "multimodal", label: "Mixed", icon: "🔀", example: "AI picks best" },
];

const ACTIVITY_LEVELS = [
  { value: "relaxed", label: "Relaxed", desc: "Easy pace, lots of rest" },
  { value: "moderate", label: "Moderate", desc: "Some effort, balanced" },
  { value: "intense", label: "Intense", desc: "Challenging, full days" },
  { value: "extreme", label: "Extreme", desc: "Maximum difficulty" },
];

const LODGING_OPTIONS = [
  { value: "hotel", label: "Hotel", icon: "🏨" },
  { value: "hostel", label: "Hostel", icon: "🛏️" },
  { value: "camping", label: "Camping", icon: "⛺" },
  { value: "refuge", label: "Refuge / Hut", icon: "🏠" },
  { value: "mixed", label: "Mixed", icon: "🔀" },
];

export default function NewTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("destination");
  const [form, setForm] = useState({
    destination: "",
    destinationType: "trail",
    departureCity: "Paris, France",
    transport: "flight",
    startDate: "2026-06-15",
    endDate: "2026-06-22",
    durationDays: 8,
    budget: 1500,
    currency: "EUR",
    travelers: 2,
    activityLevel: "intense",
    lodging: "refuge",
  });

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].key);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].key);
    }
  };

  const handleSubmit = async () => {
    try {
      const { createTrip } = await import("@/lib/api");
      const trip = await createTrip({
        name: form.destination || "New Trip",
        destination: form.destination,
        destination_type: form.destinationType,
        departure_city: form.departureCity,
        transport: form.transport,
        start_date: form.startDate,
        end_date: form.endDate,
        budget: form.budget,
        currency: form.currency,
        travelers: form.travelers,
        activity_level: form.activityLevel,
        lodging: form.lodging,
      });
      router.push(`/trips/${trip.id}`);
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Plan a New Trip</h1>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-1">
        {STEPS.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium transition-colors ${
              i === stepIndex
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : i < stepIndex
                ? "bg-[var(--secondary)] text-[var(--foreground)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            {step.icon} {step.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {currentStep === "destination" && (
          <div>
            <h2 className="text-lg font-semibold">🌍 Where do you want to go?</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DESTINATION_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setForm({ ...form, destinationType: type.value })}
                  className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                    form.destinationType === type.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  <div className="text-2xl">{type.icon}</div>
                  <div className="mt-1 font-medium">{type.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Destination</label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="e.g., GR20, Corsica, France"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
              ✅ AI will auto-research stages, refuges & logistics for your destination
            </p>
          </div>
        )}

        {currentStep === "transport" && (
          <div>
            <h2 className="text-lg font-semibold">🚆 How will you get there?</h2>
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">Departing from</label>
              <input
                type="text"
                value={form.departureCity}
                onChange={(e) => setForm({ ...form, departureCity: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRANSPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, transport: opt.value })}
                  className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                    form.transport === opt.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  <div className="text-2xl">{opt.icon}</div>
                  <div className="mt-1 font-medium">{opt.label}</div>
                  <div className="mt-0.5 text-xs text-[var(--muted-foreground)]">{opt.example}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === "dates" && (
          <div>
            <h2 className="text-lg font-semibold">📅 When are you going?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Start date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Number of travelers</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.travelers}
                onChange={(e) => setForm({ ...form, travelers: parseInt(e.target.value) || 1 })}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              📆 Duration: <strong>{form.durationDays} days</strong>
            </p>
          </div>
        )}

        {currentStep === "budget" && (
          <div>
            <h2 className="text-lg font-semibold">💰 What&apos;s your budget?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Total budget</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-sm text-[var(--muted-foreground)]">€</span>
                  <input
                    type="number"
                    min={0}
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-7 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              👤 Per person: <strong>€{Math.round(form.budget / form.travelers)}</strong>
            </p>
          </div>
        )}

        {currentStep === "preferences" && (
          <div>
            <h2 className="text-lg font-semibold">⚙️ Trip preferences</h2>
            <div className="mt-4">
              <label className="text-sm font-medium">Activity level</label>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ACTIVITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setForm({ ...form, activityLevel: level.value })}
                    className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                      form.activityLevel === level.value
                        ? "border-[var(--primary)] bg-[var(--primary)]/10"
                        : "border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted-foreground)]">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <label className="text-sm font-medium">Accommodation</label>
              <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {LODGING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, lodging: opt.value })}
                    className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                      form.lodging === opt.value
                        ? "border-[var(--primary)] bg-[var(--primary)]/10"
                        : "border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <div className="text-xl">{opt.icon}</div>
                    <div className="mt-1 text-xs font-medium">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        {stepIndex < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
          >
            🤖 Generate Itinerary with AI
          </button>
        )}
      </div>
    </div>
  );
}
