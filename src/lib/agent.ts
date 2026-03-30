import { ChatGroq } from "@langchain/groq";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";

// Define the state for our trip planning agent
const AgentState = Annotation.Root({
  origin: Annotation<string>(),
  destination: Annotation<string>(),
  startDate: Annotation<string>(),
  endDate: Annotation<string>(),
  maxBudget: Annotation<number>(),
  budgetClass: Annotation<"low" | "mid" | "high" | "luxury">(),
  weatherForecast: Annotation<any[]>(),
  // Results
  predictedBreakdown: Annotation<{
    flights: number;
    stay: number;
    food: number;
    activities: number;
  }>(),
  itinerary: Annotation<any[]>(),
  isSufficient: Annotation<boolean>(),
  totalPredicted: Annotation<number>(),
  upsellSuggestions: Annotation<string[]>(), // New field for extra budget ideas
});

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
});

// Node 1: Predict Costs
async function predictCosts(state: typeof AgentState.State) {
  const { origin, destination, budgetClass, startDate, endDate, maxBudget } = state;
  const duration = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const prompt = `Act as a travel cost estimator. Predict the approximate expenses for a ${duration}-day trip from ${origin} to ${destination} for a "${budgetClass}" budget class.
  Provide a JSON object with: 
  - flights: (estimated round trip for 1 person from ${origin} to ${destination})
  - stay: (total for ${duration} nights)
  - food: (total for ${duration} days)
  - activities: (total for ${duration} days)
  - upsellSuggestions: (Array of 3 strings offering luxury upgrades if the user has extra budget. Example: "Private Chef Dinner for $200")
  
  Be realistic based on current (2026) trends for trips starting in ${origin} and going to ${destination} for ${duration} days. 
  Return ONLY the JSON object.`;

  const response = await model.invoke(prompt);
  const content = typeof response.content === 'string' ? response.content : "";
  const cleaned = content.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleaned);

  const breakdown = {
    flights: data.flights,
    stay: data.stay,
    food: data.food,
    activities: data.activities,
  };

  const totalPredicted = breakdown.flights + breakdown.stay + breakdown.food + breakdown.activities;

  return {
    predictedBreakdown: breakdown,
    totalPredicted,
    isSufficient: totalPredicted <= maxBudget,
    upsellSuggestions: maxBudget > totalPredicted + 200 ? data.upsellSuggestions : [],
  };
}

// Node 2: Generate Itinerary
async function generateItinerary(state: typeof AgentState.State) {
  const { origin, destination, budgetClass, weatherForecast, startDate, endDate } = state;
  const duration = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  
  const prompt = `Act as a luxury travel consultant. Create a detailed ${duration}-day itinerary for a trip from ${origin} to ${destination} from ${startDate} to ${endDate}.
  The trip style is "${budgetClass}".
  Weather forecast: ${JSON.stringify(weatherForecast)}.
  Adjust activities for the weather (indoor if rain, outdoor if sun).
  Return a JSON array of EXACTLY ${duration} objects: { day: number, theme: string, activities: string[] }.
  Return ONLY the JSON array.`;

  const response = await model.invoke(prompt);
  const content = typeof response.content === 'string' ? response.content : "";
  const cleaned = content.replace(/```json|```/g, "").trim();
  const itinerary = JSON.parse(cleaned);

  return { itinerary };
}

// Build the graph
const workflow = new StateGraph(AgentState)
  .addNode("predict_costs", predictCosts)
  .addNode("generate_itinerary", generateItinerary)
  .addEdge("__start__", "predict_costs")
  .addEdge("predict_costs", "generate_itinerary")
  .addEdge("generate_itinerary", "__end__");

export const tripAgent = workflow.compile();
