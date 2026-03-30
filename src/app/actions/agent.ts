"use server";

import { tripAgent } from "@/lib/agent";

export async function runTripAgent(data: {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  maxBudget: number;
  budgetClass: "low" | "mid" | "high" | "luxury";
  weatherForecast: any[];
}) {
  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY || GROQ_KEY === "your_groq_api_key_here") {
    // Return high-quality mock data for testing/demonstration
    const duration = Math.floor(
      (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    // Predicted breakdown based on class
    const averages = {
      low: { flights: 400, stay: 50, food: 30, activities: 20 },
      mid: { flights: 800, stay: 150, food: 70, activities: 50 },
      high: { flights: 1500, stay: 400, food: 150, activities: 120 },
      luxury: { flights: 3000, stay: 1000, food: 300, activities: 250 },
    }[data.budgetClass];

    const predictedBreakdown = {
      flights: averages.flights,
      stay: averages.stay * duration,
      food: averages.food * duration,
      activities: averages.activities * duration,
    };
    const totalPredicted = predictedBreakdown.flights + predictedBreakdown.stay + predictedBreakdown.food + predictedBreakdown.activities;

    return {
      success: true,
      predictedBreakdown,
      totalPredicted,
      isSufficient: totalPredicted <= data.maxBudget,
      upsellSuggestions: data.maxBudget > totalPredicted + 200 ? [
        "Upgrade to a private villa with pool",
        "Book a premium 5-course tasting menu",
        "Private chauffeur for city transfers"
      ] : [],
      itinerary: Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        theme: i === 0 ? "Arrival & Local Exploration" : i === duration - 1 ? "Modern Vibe & Wrap-up" : "Bespoke Cultural Tour",
        activities: [
          "Curated morning activity",
          "Local gourmet lunch",
          "Evening entertainment or relaxation"
        ]
      }))
    };
  }

  try {
    const result = await tripAgent.invoke(data);
    return { success: true, ...result };
  } catch (error: any) {
    console.error("Agent Execution Error:", error);
    return { success: false, error: error.message };
  }
}
