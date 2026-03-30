"use client";

import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, CloudLightning, Wind } from "lucide-react";

interface WeatherData {
  date: string;
  temp: number;
  condition: string;
  icon: string;
}

interface WeatherForecastProps {
  data: WeatherData[];
  isLoading?: boolean;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  if (c.includes("sun") || c.includes("clear")) return <Sun className="w-8 h-8 text-yellow-500" />;
  if (c.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (c.includes("storm")) return <CloudLightning className="w-8 h-8 text-purple-400" />;
  if (c.includes("wind")) return <Wind className="w-8 h-8 text-gray-400" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
};

export default function WeatherForecast({ data, isLoading }: WeatherForecastProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 px-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-[120px] h-32 glass rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
      {data.map((item, index) => (
        <motion.div
          key={item.date}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="min-w-[120px] glass p-4 rounded-2xl text-center border-white/20 hover:scale-105 transition-transform"
        >
          <p className="text-xs font-bold text-foreground/50 mb-2 uppercase tracking-tight">
            {new Date(item.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </p>
          <div className="flex flex-col items-center gap-2">
            <WeatherIcon condition={item.condition} />
            <p className="text-2xl font-bold">{item.temp}°</p>
            <p className="text-[10px] font-semibold text-foreground/40 leading-none">{item.condition}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
