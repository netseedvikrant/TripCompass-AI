"use client";

import Link from "next/link";
import { Compass, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight gradient-text">
                TripCompass
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Planner</Link>
            <Link href="/currency" className="text-sm font-medium hover:text-primary transition-colors">Currency Converter</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Reviews & Suggestions</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={cn("md:hidden glass", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block px-3 py-2 text-base font-medium hover:text-primary">Planner</Link>
          <Link href="/currency" className="block px-3 py-2 text-base font-medium hover:text-primary">Currency Converter</Link>
          <Link href="/contact" className="block px-3 py-2 text-base font-medium hover:text-primary">Reviews & Suggestions</Link>
        </div>
      </div>
    </nav>
  );
}
