import { Trip, BudgetItem } from "./types";

export const sampleGR20Trip: Trip = {
  id: "gr20-corsica-2026",
  name: "GR20 Corsica",
  destination: "GR20, Corsica, France",
  destinationType: "trail",
  startDate: "2026-06-15",
  endDate: "2026-06-22",
  durationDays: 8,
  travelers: 2,
  budget: 1500,
  currency: "EUR",
  transport: "flight",
  activityLevel: "intense",
  lodging: "refuge",
  status: "planning",
  progress: 80,
  itinerary: [
    {
      day: 1,
      date: "2026-06-15",
      title: "Paris → Calvi → Calenzana → Ortu di u Piobbu",
      description:
        "Fly to Calvi, shuttle to Calenzana trailhead. Steep ascent through forests and maquis scrubland to the first mountain refuge.",
      distance: "12 km",
      elevation: "+1,460m / -180m",
      accommodation: "Refuge d'Ortu di u Piobbu",
      accommodationCost: 15,
      activities: [
        "✈️ Flight Paris CDG → Calvi (1h30)",
        "🚌 Shuttle Calvi → Calenzana",
        "🥾 Trek to first refuge",
      ],
    },
    {
      day: 2,
      date: "2026-06-16",
      title: "Ortu di u Piobbu → Refuge de Carrozzu",
      description:
        "Traverse rocky terrain and high ridges. Descent into the beautiful Spasimata valley.",
      distance: "8 km",
      elevation: "+600m / -950m",
      accommodation: "Refuge de Carrozzu",
      accommodationCost: 15,
      activities: [
        "🥾 Ridge traverse with panoramic views",
        "📸 Spasimata valley viewpoint",
      ],
    },
    {
      day: 3,
      date: "2026-06-17",
      title: "Carrozzu → Haut Asco",
      description:
        "Cross the Spasimata suspension bridge and scramble steep granite slabs. Technical day with chains and ladders.",
      distance: "10 km",
      elevation: "+700m / -800m",
      accommodation: "Haut Asco Station",
      accommodationCost: 25,
      activities: [
        "🌉 Spasimata suspension bridge",
        "🧗 Technical granite scrambling",
        "🍽️ Restaurant dinner at Haut Asco",
      ],
      warnings: ["⚠️ Technical section with chains"],
    },
    {
      day: 4,
      date: "2026-06-18",
      title: "Haut Asco → Tighjettu",
      description:
        "Most challenging day. Option to summit Monte Cinto (2,706m), highest peak in Corsica. Difficult crossings with chains and exposure.",
      distance: "9 km",
      elevation: "+1,200m / -1,000m",
      accommodation: "Refuge de Tighjettu",
      accommodationCost: 15,
      activities: [
        "🏔️ Optional Monte Cinto summit (2,706m)",
        "🧗 Chain-assisted scrambles",
        "📸 360° panoramic views from summit",
      ],
      warnings: [
        "⚠️ Most technical day",
        "⚠️ Exposed ridges — weather dependent",
      ],
    },
    {
      day: 5,
      date: "2026-06-19",
      title: "Tighjettu → Manganu (Double Stage)",
      description:
        "Long but rewarding day combining two stages. Rolling terrain across high meadows, pass through Ciottulu di i Mori.",
      distance: "22 km",
      elevation: "+1,100m / -1,200m",
      accommodation: "Refuge de Manganu",
      accommodationCost: 15,
      activities: [
        "🥾 Double stage — long day",
        "🌿 High alpine meadows",
        "🏔️ Ciottulu di i Mori pass",
      ],
      warnings: ["⚠️ Long day — start early"],
    },
    {
      day: 6,
      date: "2026-06-20",
      title: "Manganu → Petra Piana",
      description:
        "Beautiful day via Lac de Nino, a stunning glacial lake surrounded by pozzines (grassy pools). Mix of gentle valley and steep granite.",
      distance: "9 km",
      elevation: "+700m / -600m",
      accommodation: "Refuge de Petra Piana",
      accommodationCost: 15,
      activities: [
        "🏞️ Lac de Nino — iconic glacial lake",
        "🐴 Wild horses at the lake",
        "📸 Pozzines (unique grass pools)",
      ],
    },
    {
      day: 7,
      date: "2026-06-21",
      title: "Petra Piana → Onda",
      description:
        "Traverse a rugged ridge with splendid views. Some chain-protected scrambles in technical sections.",
      distance: "10 km",
      elevation: "+800m / -900m",
      accommodation: "Refuge de l'Onda",
      accommodationCost: 15,
      activities: [
        "🥾 Ridge traverse",
        "🧗 Chain-protected scrambles",
        "🌅 Sunset views over central Corsica",
      ],
    },
    {
      day: 8,
      date: "2026-06-22",
      title: "Onda → Vizzavona",
      description:
        "Final descent through fragrant pine forests and cascading streams. Vizzavona marks the midpoint of the full GR20. Celebrate with a Corsican beer!",
      distance: "14 km",
      elevation: "+400m / -1,200m",
      accommodation: "Hotel in Vizzavona / Train to Ajaccio",
      accommodationCost: 0,
      activities: [
        "🌲 Pine forest descent",
        "💦 Cascade des Anglais waterfall swim",
        "🍺 Celebratory Corsican Pietra beer",
        "🚆 Train Vizzavona → Ajaccio → Flight home",
      ],
    },
  ],
};

export const sampleBudget: BudgetItem[] = [
  { category: "Transport", icon: "✈️", amount: 240, perPerson: 120, percentage: 16 },
  { category: "Accommodation", icon: "🏠", amount: 280, perPerson: 140, percentage: 19 },
  { category: "Food", icon: "🍽️", amount: 480, perPerson: 240, percentage: 32 },
  { category: "Permits & Fees", icon: "🎫", amount: 40, perPerson: 20, percentage: 3 },
  { category: "Gear Rental", icon: "🎒", amount: 120, perPerson: 60, percentage: 8 },
  { category: "Insurance", icon: "📱", amount: 100, perPerson: 50, percentage: 7 },
  { category: "Local Transport", icon: "🚌", amount: 80, perPerson: 40, percentage: 5 },
];
