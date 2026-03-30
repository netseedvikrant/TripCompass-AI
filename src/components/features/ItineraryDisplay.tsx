"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Calendar, Compass, Download } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface ItineraryDay {
  day: number;
  theme: string;
  activities: string[];
}

interface ItineraryDisplayProps {
  data: ItineraryDay[];
  isLoading?: boolean;
  origin?: string;
  destination?: string;
  budgetClass?: "low" | "mid" | "high" | "luxury";
}

export default function ItineraryDisplay({ data, isLoading, origin, destination, budgetClass }: ItineraryDisplayProps) {
  const handleDownload = async () => {
    const element = document.getElementById("trip-content");
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, { 
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#020617",
        skipFonts: true,
        fontEmbedCSS: "",
        style: {
          fontFamily: "sans-serif",
        },
      });
      
      const link = document.createElement("a");
      const filename = `${origin || "departure"}-to-${destination || "destination"}.png`
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();
        
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Image Export failed:", error);
      alert("Browser compatibility error. Please use 'Print to PDF' instead.");
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass p-6 rounded-3xl animate-pulse h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((day, index) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="glass p-8 rounded-[2rem] border-white/20 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all"
        >
          {/* Day Badge */}
          <div className="absolute top-0 right-0 bg-primary/20 px-6 py-2 rounded-bl-3xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            Day {day.day}
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary/20 p-3 rounded-2xl group-hover:bg-primary/30 transition-colors">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">{day.theme}</h3>
              <p className="text-sm font-medium text-foreground/40 uppercase tracking-widest mt-1">Curated Experience</p>
            </div>
          </div>

          <ul className="space-y-4">
            {day.activities.map((activity, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                className="flex items-start gap-3 group/item border-l-2 border-white/10 pl-4 hover:border-primary/50 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <span className="text-lg text-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
                  {activity}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}

      {data && data.length > 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-12 pb-8 flex justify-center"
        >
          <button 
            onClick={handleDownload}
            className="flex items-center gap-3 px-12 py-6 glass border border-white/10 rounded-full font-bold hover:bg-white/10 hover:border-primary transition-all text-xl hover:scale-[1.02] active:scale-95 group shadow-2xl"
          >
            <Download className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            Download Adventure Report
          </button>
        </motion.div>
      )}
    </div>
  );
}
