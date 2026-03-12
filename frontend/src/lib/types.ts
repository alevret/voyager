import { cn } from "@/lib/utils";

export type Trip = {
  id: string;
  name: string;
  destination: string;
  destinationType: "city" | "region" | "trail" | "country";
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  budget: number;
  currency: string;
  transport: "flight" | "train" | "car" | "multimodal";
  activityLevel: "relaxed" | "moderate" | "intense" | "extreme";
  lodging: "hotel" | "hostel" | "camping" | "refuge" | "mixed";
  status: "draft" | "planning" | "planned" | "in_progress" | "completed";
  progress: number;
  itinerary: ItineraryDay[];
};

export type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  description: string;
  distance?: string;
  elevation?: string;
  accommodation?: string;
  accommodationCost?: number;
  activities: string[];
  warnings?: string[];
};

export type BudgetItem = {
  category: string;
  icon: string;
  amount: number;
  perPerson: number;
  percentage: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function cn_util(...inputs: (string | undefined | false)[]) {
  return cn(...inputs);
}
