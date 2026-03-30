"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Compass } from "lucide-react";
import WeatherForecast from "@/components/features/WeatherForecast";
import ItineraryDisplay from "@/components/features/ItineraryDisplay";
import BudgetCalculator from "@/components/features/BudgetCalculator";
import ActivitySuggestions from "@/components/features/ActivitySuggestions";
import { getForecastForDates } from "@/app/actions/weather";
import { runTripAgent } from "@/app/actions/agent";
import { motion, AnimatePresence } from "framer-motion";
import { DateRange } from "react-day-picker";

const LandingHero = () => (
  <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/trip-showcase.mp4" type="video/mp4" />
    </video>
    <div className="absolute top-0 left-0 w-full h-full bg-[#020617]/70 z-10" />
    
    <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="space-y-6"
      >
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">
          Adventure, <span className="text-primary italic">Redefined.</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold text-white/80 max-w-2xl mx-auto">
          Planning isn't about restriction. It's about maximizing every heartbeat of your journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="glass p-8 rounded-[2.5rem] border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-2xl group-hover:bg-primary transition-colors">
              <Compass className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Why Plan Itineraries?</h3>
          </div>
          <p className="text-lg opacity-60 leading-relaxed font-medium">
            Avoid tourist traps and wasted transfers. A curated itinerary syncs with local transport, weather, and crowds to give you more experience in less time.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="glass p-8 rounded-[2.5rem] border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/20 p-3 rounded-2xl group-hover:bg-primary transition-colors">
              <Compass className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Why Smart Budgeting?</h3>
          </div>
          <p className="text-lg opacity-60 leading-relaxed font-medium">
            Never return with debt or regret. Smart budgeting identifies hidden savings so you can upgrade the moments that actually matter.
          </p>
        </motion.div>
      </div>

      <motion.button 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="bg-primary text-[#020617] px-12 py-6 rounded-full font-black text-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/40 group"
      >
        Start Planning My Trip
      </motion.button>
    </div>
  </section>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<any[]>([]);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [predictedBreakdown, setPredictedBreakdown] = useState({
    flights: 0,
    stay: 0,
    food: 0,
    activities: 0,
  });
  const [maxBudget, setMaxBudget] = useState(1000);
  const [budgetClass, setBudgetClass] = useState<"low" | "mid" | "high" | "luxury">("mid");

  const [upsellSuggestions, setUpsellSuggestions] = useState<string[]>([]);

  const handleSearch = async (data: {
    origin: string;
    destination: string;
    range: DateRange | undefined;
    maxBudget: number;
    budgetClass: "low" | "mid" | "high" | "luxury";
    adults: number;
    kids: number;
  }) => {
    setIsLoading(true);
    setOrigin(data.origin);
    setDestination(data.destination);
    setMaxBudget(data.maxBudget);
    setBudgetClass(data.budgetClass);
    
    try {
      const startDate = data.range?.from?.toISOString() || new Date().toISOString();
      const endDate = data.range?.to?.toISOString() || new Date().toISOString();

      // 1. Get Weather (Real or Simulated)
      const weatherRes = await getForecastForDates(data.destination, startDate, endDate);
      if (weatherRes.success) {
        setWeather(weatherRes.data);
        
        // 2. Run Trip Agent for Costs and Itinerary
        const agentRes = await runTripAgent({
          ...data,
          startDate,
          endDate,
          weatherForecast: weatherRes.data,
        });

        if (agentRes.success && "itinerary" in agentRes) {
          setItinerary(agentRes.itinerary || []);
          setPredictedBreakdown(agentRes.predictedBreakdown || { flights: 0, stay: 0, food: 0, activities: 0 });
          setUpsellSuggestions(agentRes.upsellSuggestions || []);
        }
      }
    } catch (error) {
      console.error("Agent Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <LandingHero />
        <HeroSection onSearch={handleSearch} isLoading={isLoading} />
        
        <AnimatePresence>
          {(weather.length > 0 || itinerary.length > 0 || isLoading) && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 glass rounded-[3.5rem] border-white/40 shadow-2xl relative my-20"
            >
              <div id="trip-content" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-[#020617] p-8 md:p-12 rounded-[2.5rem]">
                {/* Main Content (Weather & Itinerary) */}
                <div className="lg:col-span-8 space-y-20">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-4xl font-extrabold tracking-tight">
                        Destination: <span className="gradient-text">{destination}</span>
                      </h2>
                    </div>
                    <WeatherForecast data={weather} isLoading={isLoading} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-4xl font-extrabold tracking-tight mb-8">Curated Adventure</h2>
                    <ItineraryDisplay 
                      data={itinerary} 
                      isLoading={isLoading} 
                      origin={origin}
                      destination={destination}
                      budgetClass={budgetClass}
                    />
                  </motion.div>
                </div>

                {/* Sidebar (Budget & Suggestions) */}
                <div className="lg:col-span-4 space-y-12 h-fit lg:sticky lg:top-24">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <BudgetCalculator 
                      predictedBreakdown={predictedBreakdown}
                      maxBudget={maxBudget}
                      isCalculating={isLoading}
                      upsellSuggestions={upsellSuggestions}
                      budgetClass={budgetClass}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ActivitySuggestions 
                      weatherCondition={weather[0]?.condition || "Sunny"} 
                    />
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-16 glass border-t border-white/10 text-center opacity-40">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-bold uppercase tracking-widest">© 2026 TripCompass AI Agent. Perfectly Planned.</p>
        </div>
      </footer>
    </div>
  );
}
