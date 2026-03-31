"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { DollarSign, ArrowRightLeft, TrendingUp, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.5 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 151.3 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.35 },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[1]);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const fromRate = fromCurrency.rate;
    const toRate = toCurrency.rate;
    const converted = (amount / fromRate) * toRate;
    setResult(converted);
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-20 px-4">
        {/* Decorative Blur */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              Trip Utilities
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Currency <span className="gradient-text">Intelligence.</span>
            </h1>
            <p className="text-lg text-foreground/60 max-w-xl mx-auto font-medium">
              Real-time travel estimates converted to your local currency. 
              Plan smarter with transparent pricing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/40 space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-6">
              {/* From */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">From</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <span className="text-xl font-bold text-primary">{fromCurrency.symbol}</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black outline-none transition-all"
                  />
                  <select 
                    value={fromCurrency.code}
                    onChange={(e) => setFromCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                    className="absolute inset-y-2 right-2 bg-[#020617] border border-white/10 rounded-xl px-4 font-bold text-sm outline-none cursor-pointer hover:bg-[#0f172a] transition-colors"
                  >
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <button 
                onClick={swapCurrencies}
                className="mt-6 md:mt-0 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all group active:scale-95"
              >
                <ArrowRightLeft className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* To */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">To</label>
                <div className="relative">
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-6 pr-24 text-2xl font-black">
                    {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <select 
                    value={toCurrency.code}
                    onChange={(e) => setToCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                    className="absolute inset-y-2 right-2 bg-[#020617] border border-white/10 rounded-xl px-4 font-bold text-sm outline-none cursor-pointer hover:bg-[#0f172a] transition-colors"
                  >
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 group hover:bg-white/10 transition-all">
                <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Exchange Rate</p>
                <p className="font-bold text-lg">1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}</p>
              </div>
              
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 group hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Base Value</p>
                <p className="font-bold text-lg">{fromCurrency.symbol}{amount.toLocaleString()}</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 group hover:bg-white/10 transition-all">
                <div className="bg-orange-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Converted</p>
                <p className="font-bold text-lg text-primary">{toCurrency.symbol}{result.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </motion.div>

          <footer className="text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Live exchange rates provided for reference only.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
