"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRatingLocked, setIsRatingLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative py-20 px-4 overflow-hidden flex items-center justify-center">
        {/* Background Decorations */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="max-w-xl w-full relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Planner
          </Link>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-white/20"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary/20 p-3 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Tell us more</h1>
                    <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Reviews & Suggestions</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/60 ml-1">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Alex Explorer"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/60 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="alex@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/60 ml-1">Trip Experience / Idea</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How was your planned trip? Any features you'd like to see?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm font-bold text-foreground/60 ml-1">Rate your experience:</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button 
                          key={s} 
                          type="button" 
                          onClick={() => {
                            if (!isRatingLocked) {
                              setRating(s);
                              setIsRatingLocked(true);
                            }
                          }}
                          className={`transition-all ${rating >= s ? "text-yellow-500 scale-110" : "text-foreground/20 hover:text-yellow-500"} ${isRatingLocked ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <Star className={`w-6 h-6 ${rating >= s ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Feedback
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-[2.5rem] shadow-2xl border-white/20 text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="bg-green-500/20 p-6 rounded-full">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight">Thank you!</h2>
                <p className="text-lg text-foreground/60 max-w-xs mx-auto">
                  Your review has been received. Our agents will use your feedback to craft even better journeys.
                </p>
                <Link 
                  href="/"
                  className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
                >
                  Back to Planner
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-12 glass border-t border-white/10 text-center opacity-40">
        <p className="text-xs font-bold uppercase tracking-widest">© 2026 TripCompass AI Agent. Perfectly Planned.</p>
      </footer>
    </div>
  );
}
