"use server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

export async function generateItinerary(destination: string, weatherForecast: any[]) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    // Return mock itinerary if API key is not set
    return {
      success: true,
      message: "Using mock itinerary (API key not set)",
      data: [
        {
          day: 1,
          theme: "Arrival and Exploration",
          activities: [
            "Morning: Check-in at hotel and local breakfast.",
            "Afternoon: Visit the central museum or landmark.",
            "Evening: Dinner at a traditional local restaurant.",
          ],
        },
        {
          day: 2,
          theme: "Nature and Adventure",
          activities: [
            "Morning: Outdoor hike or guided park tour.",
            "Afternoon: Local market visits and street food.",
            "Evening: Rooftop drinks or a cultural show.",
          ],
        },
        {
          day: 3,
          theme: "Relaxation and Departure",
          activities: [
            "Morning: Beach visit or spa session.",
            "Afternoon: Souvenir shopping and light lunch.",
            "Evening: Farewell dinner and departure.",
          ],
        },
      ],
    };
  }

  const prompt = `Act as a professional travel consultant. Create a 3-day curated itinerary for ${destination}. 
  The destination weather for the next few days is: ${JSON.stringify(weatherForecast)}. 
  Tailor the activities to the weather (e.g. indoor if raining, outdoor if sunny).
  Format the response as a JSON array of objects with keys: day (number), theme (string), and activities (array of strings).`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: MODEL,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return { success: true, data: result.itinerary || result };
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return { success: false, error: error.message };
  }
}
