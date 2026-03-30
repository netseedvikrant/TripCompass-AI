"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, DollarSign, Wallet } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { GLOBAL_CITIES } from "@/lib/cities";

interface HeroSectionProps {
  onSearch: (data: {
    origin: string;
    destination: string;
    range: DateRange | undefined;
    maxBudget: number;
    budgetClass: "low" | "mid" | "high" | "luxury";
    adults: number;
    kids: number;
  }) => void;
  isLoading: boolean;
}

const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  label 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string, 
  icon: any,
  label: string 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const suggestions = GLOBAL_CITIES.filter(c => 
    c.toLowerCase().includes(value.toLowerCase()) && value.length > 1
  ).slice(0, 5);

  return (
    <div className="flex-1 relative">
      <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl group transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer">
        <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        <div className="text-left flex-1">
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest leading-none mb-1">{label}</p>
          <input
            type="text"
            placeholder={placeholder}
            className="bg-transparent border-none focus:ring-0 w-full text-lg font-bold placeholder:text-foreground/20 focus:outline-none"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
        </div>
      </div>
      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass rounded-2xl overflow-hidden shadow-2xl border-white/20"
          >
            {suggestions.map((city) => (
              <button
                key={city}
                className="w-full text-left px-6 py-3 hover:bg-primary/20 transition-colors text-sm font-bold flex items-center gap-2"
                onClick={() => {
                  onChange(city);
                  setShowDropdown(false);
                }}
              >
                <MapPin className="w-4 h-4 text-primary" />
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BUDGET_CLASSES = [
  { id: "low", label: "Low", icon: "🚲" },
  { id: "mid", label: "Mid", icon: "🚗" },
  { id: "high", label: "High", icon: "✈️" },
  { id: "luxury", label: "Luxury", icon: "💎" },
] as const;

export default function HeroSection({ onSearch, isLoading }: HeroSectionProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [maxBudget, setMaxBudget] = useState<number>(1000);
  const [budgetClass, setBudgetClass] = useState<typeof BUDGET_CLASSES[number]["id"]>("mid");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);

  const handleSearch = () => {
    if (destination.trim()) {
      onSearch({ origin, destination, range, maxBudget, budgetClass, adults, kids });
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-60" />

      <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-6 py-2.5 mb-10 text-[11px] font-black tracking-[0.2em] text-[#020617] uppercase bg-primary rounded-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform cursor-default">
            AI-Powered Travel Consultant & Agent
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Your Next Adventure, <br />
            <span className="gradient-text">Perfectly Planned.</span>
          </h1>
          <p className="text-xl text-foreground/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Specify your dates, pick your style, and set your budget. 
            Our AI agent handles the logistics while you pack your bags.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass p-4 rounded-3xl md:rounded-[3rem] shadow-2xl space-y-4 max-w-6xl mx-auto border-white/40 relative z-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 items-stretch lg:items-center gap-2">
            
            <AutocompleteInput 
              value={origin} 
              onChange={setOrigin} 
              placeholder="Leaving from..." 
              icon={MapPin} 
              label="Starting City"
            />

            <AutocompleteInput 
              value={destination} 
              onChange={setDestination} 
              placeholder="Going to..." 
              icon={Search} 
              label="Where to next?"
            />

            {/* Date Range */}
            <div 
              className="relative flex-1 flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl group transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowDatePicker(!showDatePicker);
                setShowTravelers(false);
              }}
            >
              <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-left flex-1 overflow-hidden transition-all duration-300">
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest leading-none mb-1">Travel Dates</p>
                <p className="text-lg font-bold truncate">
                  {range?.from ? (
                    range.to ? (
                      <>
                        {format(range.from, "LLL dd")} - {format(range.to, "LLL dd")}
                      </>
                    ) : (
                      format(range.from, "LLL dd")
                    )
                  ) : (
                    "Select Dates"
                  )}
                </p>
              </div>

              <AnimatePresence>
                {showDatePicker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 glass p-4 rounded-3xl shadow-2xl border-white/40 min-w-max"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={2}
                      className="text-foreground"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Travelers */}
            <div 
              className="relative flex-1 flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl group transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowTravelers(!showTravelers);
                setShowDatePicker(false);
              }}
            >
              <Users className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-left flex-1">
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest leading-none mb-1">Travelers</p>
                <p className="text-lg font-bold truncate">
                  {adults}A, {kids}K
                </p>
              </div>

              <AnimatePresence>
                {showTravelers && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 glass p-6 rounded-3xl shadow-2xl border-white/40 min-w-[240px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">Adults</p>
                          <p className="text-xs text-foreground/40">Age 13+</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors font-bold"
                          >-</button>
                          <span className="font-bold w-4 text-center">{adults}</span>
                          <button 
                            onClick={() => setAdults(adults + 1)}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors font-bold"
                          >+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">Children</p>
                          <p className="text-xs text-foreground/40">Age 2-12</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setKids(Math.max(0, kids - 1))}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors font-bold"
                          >-</button>
                          <span className="font-bold w-4 text-center">{kids}</span>
                          <button 
                            onClick={() => setKids(kids + 1)}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors font-bold"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Max Budget */}
            <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl group transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer">
              <Wallet className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-left w-full">
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest leading-none mb-1">Total Budget</p>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">$</span>
                  <input
                    type="number"
                    className="bg-transparent border-none focus:ring-0 w-full text-lg font-bold focus:outline-none"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="lg:w-auto w-full bg-primary text-white px-10 py-5 rounded-2xl md:rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed text-lg text-nowrap"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              )}
              {isLoading ? "Planning..." : "Plan Trip"}
            </button>
          </div>

          {/* Budget Class Selector */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10">
            <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest mr-2">Trip Style:</span>
            {BUDGET_CLASSES.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setBudgetClass(tier.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95",
                  budgetClass === tier.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "bg-white/5 hover:bg-white/10 text-foreground/60"
                )}
              >
                <span>{tier.icon}</span>
                {tier.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-60">
          <div className="flex items-center gap-3 group hover:opacity-100 transition-opacity">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform"><Calendar className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-bold tracking-tight">Flexible Dates</span>
          </div>
          <div className="flex items-center gap-3 group hover:opacity-100 transition-opacity">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform"><DollarSign className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-bold tracking-tight">Budget Protection</span>
          </div>
          <div className="flex items-center gap-3 group hover:opacity-100 transition-opacity">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform"><Users className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-bold tracking-tight">Curated Local Tips</span>
          </div>
        </div>
      </div>
    </section>
  );
}
