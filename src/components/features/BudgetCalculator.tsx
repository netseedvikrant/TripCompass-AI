"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plane, Hotel, Utensils, Activity, CreditCard, ChevronRight, ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetBreakdown {
  flights: number;
  stay: number;
  food: number;
  activities: number;
}

interface BudgetCalculatorProps {
  predictedBreakdown: BudgetBreakdown;
  maxBudget: number;
  isCalculating?: boolean;
  upsellSuggestions?: string[];
  budgetClass?: "low" | "mid" | "high" | "luxury";
}

const BudgetItem = ({ icon: Icon, label, value, color, detail }: { icon: any, label: string, value: number, color: string, detail: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
    <div className={cn("p-3 rounded-xl", color)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-foreground/60">{label}</p>
        <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase tracking-widest">{detail}</span>
      </div>
      <p className="text-xl font-bold tracking-tight">${value.toLocaleString()}</p>
    </div>
  </div>
);

export default function BudgetCalculator({ 
  predictedBreakdown, 
  maxBudget, 
  isCalculating, 
  upsellSuggestions = [],
  budgetClass = "mid"
}: BudgetCalculatorProps) {
  const getBudgetItemDetail = (type: keyof BudgetBreakdown) => {
    const details = {
      low: { flights: "Economy Class", stay: "Hostel/2★ Hotel", food: "Local Street Food", activities: "Guided Walks" },
      mid: { flights: "Economy Class", stay: "Boutique 3★ Hotel", food: "Mid-Range Dining", activities: "Museums & Tours" },
      high: { flights: "Premium Economy", stay: "Luxury 4★ Hotel", food: "Fine Dining", activities: "Private Tours" },
      luxury: { flights: "Business Class", stay: "Exclusive 5★ Hotel", food: "Gourmet Experience", activities: "Bespoke Activities" },
    }[budgetClass];
    return details[type];
  };
  const total = predictedBreakdown.flights + predictedBreakdown.stay + predictedBreakdown.food + predictedBreakdown.activities;
  const isOverBudget = total > maxBudget;
  const hasExtraBudget = maxBudget > total + 200;
  const percentageOfBudget = Math.min((total / maxBudget) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-6 shadow-xl border-white/20 h-fit sticky top-24 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Smart Budget Agent</h2>
        </div>
        {isCalculating && (
          <div className="flex items-center gap-2 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="text-xs font-bold uppercase tracking-tighter">Calculating...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <BudgetItem
          icon={Plane}
          label="Flights"
          value={predictedBreakdown.flights}
          color="bg-blue-500/20 text-blue-500"
          detail={getBudgetItemDetail("flights")}
        />
        <BudgetItem
          icon={Hotel}
          label="Accommodation"
          value={predictedBreakdown.stay}
          color="bg-purple-500/20 text-purple-500"
          detail={getBudgetItemDetail("stay")}
        />
        <BudgetItem
          icon={Utensils}
          label="Dining & Drinks"
          value={predictedBreakdown.food}
          color="bg-orange-500/20 text-orange-500"
          detail={getBudgetItemDetail("food")}
        />
        <BudgetItem
          icon={Activity}
          label="Experiences"
          value={predictedBreakdown.activities}
          color="bg-teal-500/20 text-teal-500"
          detail={getBudgetItemDetail("activities")}
        />
      </div>

      <div className="pt-8 mt-8 border-t border-white/10 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Estimated Minimum</p>
            <p className={cn("text-4xl font-extrabold tracking-tighter", isOverBudget ? "text-red-500" : "gradient-text")}>
              ${total.toLocaleString()}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Your Limit: ${maxBudget.toLocaleString()}</p>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
              isOverBudget ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
            )}>
              {isOverBudget ? "Over Budget" : "Budget OK"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageOfBudget}%` }}
              className={cn(
                "h-full transition-colors duration-500",
                isOverBudget ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-primary to-accent"
              )}
            />
          </div>
          <p className="text-[10px] text-center font-bold text-foreground/30 uppercase tracking-widest">
            {isOverBudget ? `Exceeds limit by $${(total - maxBudget).toLocaleString()}` : `Savings identified: $${(maxBudget - total).toLocaleString()}`}
          </p>
        </div>

        <AnimatePresence>
          {isOverBudget ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-red-500 leading-none">Insufficient Funds</p>
                <p className="text-xs text-red-500/70 leading-tight">
                  This trip style requires at least ${total.toLocaleString()}. Please increase your budget or choose a lower style.
                </p>
              </div>
            </motion.div>
          ) : hasExtraBudget && upsellSuggestions.length > 0 ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="p-5 rounded-3xl bg-primary/10 border border-primary/20 space-y-3"
            >
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Luxury Upgrades Available</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-medium">
                You have ${maxBudget - total} extra budget. Here's how you can maximize your experience:
              </p>
              <ul className="space-y-2">
                {upsellSuggestions.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                    <span className="text-primary">•</span> {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex gap-3 items-center"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <p className="text-xs font-bold text-green-500 uppercase tracking-tight">
                Budget is sufficient for this plan.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
