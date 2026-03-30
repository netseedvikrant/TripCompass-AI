"use server";

import { ChatGroq } from "@langchain/groq";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
});

export async function getForecastForDates(city: string, startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  const maxForecastDate = new Date();
  maxForecastDate.setDate(today.getDate() + 5);

  // If dates are within the next 5 days and API key exists, use real weather
  if (API_KEY && API_KEY !== "your_openweathermap_api_key_here" && end <= maxForecastDate) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod === "200") {
        const dailyData = data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);
        return {
          success: true,
          type: "real",
          data: dailyData.map((item: any) => ({
            date: item.dt_txt.split(" ")[0],
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          })),
        };
      }
    } catch (e) {
      console.error("Weather Fetch fail, falling back to simulation", e);
    }
  }

  // Fallback: Use AI to predict climatological weather for those dates
  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY || GROQ_KEY === "your_groq_api_key_here") {
    const duration = Math.floor(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    const mockData = Array.from({ length: duration }, (_, i) => {
      const date = new Date(new Date(startDate).getTime() + i * 86400000).toISOString().split('T')[0];
      return { 
        date, 
        temp: 20 + Math.floor(Math.random() * 10), 
        condition: i % 3 === 0 ? "Partly Cloudy" : "Sunny", 
        icon: "01d" 
      };
    });

    return {
      success: true,
      type: "mock",
      data: mockData,
    };
  }

  const duration = Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const prompt = `Predict a realistic ${duration}-day weather forecast for ${city} between ${startDate} and ${endDate}. 
  Base it on historical climatological data for this time of year.
  Return ONLY a JSON array of EXACTLY ${duration} objects: { date: string, temp: number (Celsius), condition: string, icon: string (use OWM codes like 01d, 03d, 10d) }.`;

  try {
    const response = await model.invoke(prompt);
    const content = typeof response.content === 'string' ? response.content : "";
    const cleaned = content.replace(/```json|```/g, "").trim();
    const simulatedData = JSON.parse(cleaned);

    return {
      success: true,
      type: "simulated",
      data: simulatedData,
    };
  } catch (error: any) {
    console.error("Weather Simulation Error:", error);
    return { success: false, error: error.message };
  }
}
