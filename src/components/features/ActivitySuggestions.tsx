"use client";

import { motion } from "framer-motion";
import { Sparkles, Umbrella, Sun, Map, ArrowRight } from "lucide-react";

interface ActivitySuggestionsProps {
  weatherCondition: string;
}

export default function ActivitySuggestions({ weatherCondition }: ActivitySuggestionsProps) {
  const isRainy = weatherCondition.toLowerCase().includes("rain") || weatherCondition.toLowerCase().includes("cloud");
  const isSunny = weatherCondition.toLowerCase().includes("sun") || weatherCondition.toLowerCase().includes("clear");

  const suggestions = isRainy 
    ? [
        { title: "Indoor Museum", icon: Map, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Stay dry while exploring history." },
        { title: "Local Art Gallery", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", desc: "A creative escape from the rain." },
        { title: "Gourmet Dinner", icon: Sparkles, color: "text-orange-500", bg: "bg-orange-500/10", desc: "Cozy up with some local flavors." }
      ]
    : isSunny
    ? [
        { title: "Beach Day", icon: Sun, color: "text-yellow-500", bg: "bg-yellow-500/10", desc: "Perfect time for a splash!" },
        { title: "Guided City Hike", icon: Map, color: "text-green-500", bg: "bg-green-500/10", desc: "Explore the streets in total sun." },
        { title: "Outdoor Market", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-500/10", desc: "Shop local under the bright sky." }
      ]
    : [
        { title: "Sightseeing Tour", icon: Map, color: "text-primary", bg: "bg-primary/10", desc: "Classic exploration of the city." },
        { title: "Local Cuisine Hunt", icon: Sparkles, color: "text-accent", bg: "bg-accent/10", desc: "Find the best hidden eateries." }
      ];

  return (
    <div className="glass p-8 rounded-[2.5rem] border-white/20 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-32 h-32" />
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/20 p-3 rounded-2xl animate-pulse">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Agent Selection</h3>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Weather-Based Picks</p>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl mb-8 border border-white/10">
        <p className="text-sm text-foreground/70 italic leading-relaxed">
          "The forecast says <span className="text-primary font-bold">{weatherCondition}</span>. Based on your trip style, our agent hand-picked these for you:"
        </p>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-5 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-transparent hover:border-white/20 group cursor-pointer shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl transition-all group-hover:rotate-12 ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                <span className="text-[10px] uppercase font-black text-foreground/30 tracking-widest">
                  {item.desc}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
