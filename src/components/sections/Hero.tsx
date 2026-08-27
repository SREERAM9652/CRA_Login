"use client"

import { useState } from "react"
import { 
  Search, 
  Home, 
  Building2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FlaskConical, 
  Award,
  ChevronRight,
  Zap,
  Activity,
  HeartPulse
} from "lucide-react"
import Link from "next/link"

export function Hero() {
  const [collectionMethod, setCollectionMethod] = useState<"home" | "center">("home")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 pt-8 sm:pt-12 lg:pt-14 pb-14 sm:pb-20 border-b border-slate-100 font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 pointer-events-none">
        <div className="w-[450px] h-[450px] rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: HERO HEADLINE & SEARCH BOX (7 COLS ON LG)                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-[#382685] text-xs font-black shadow-xs">
              <Sparkles className="h-4 w-4 text-[#382685]" />
              <span>Gold Standard Clinical Testing • 500+ Tests &amp; Health Packages</span>
            </div>
            
            {/* Hero Heading - Proportional & Balanced */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.16]">
              Accurate Lab Results.<br />
              <span className="bg-gradient-to-r from-[#251b5c] via-[#382685] to-cyan-600 bg-clip-text text-transparent">
                Better Healthcare Decisions.
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Book routine clinical tests and full-body health profiles online from our catalog of <strong>500+ pathology tests</strong>. Experience gold-standard laboratory precision with <strong>100% painless home sample collection</strong>.
            </p>

            {/* Integrated Search & Booking Widget */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 max-w-xl mx-auto lg:mx-0 space-y-3.5">
              
              {/* Collection Method Selector Pills */}
              <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit mx-auto lg:mx-0">
                <button
                  type="button"
                  onClick={() => setCollectionMethod("home")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    collectionMethod === "home"
                      ? "bg-white text-[#251b5c] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Home className="h-3.5 w-3.5 text-[#382685]" />
                  <span>Free Home Collection</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCollectionMethod("center")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    collectionMethod === "center"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5 text-cyan-600" />
                  <span>Visit Lab Hub</span>
                </button>
              </div>

              {/* Input + Find Test CTA */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 500+ Tests: CBC, Thyroid, Lipid, HbA1c, Vitamin D..."
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50/70 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
                <Link
                  href={`/booking?search=${encodeURIComponent(searchQuery)}&method=${collectionMethod}`}
                  className="py-3 px-6 text-xs sm:text-sm font-black bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white rounded-2xl shadow-md shadow-indigo-950/15 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Find Test &amp; Book</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Popular Test Suggestions Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
                <span className="font-bold text-slate-700 text-[11px]">Popular:</span>
                {[
                  { name: "Hemogram (H6)", query: "Hemogram" },
                  { name: "HbA1c Diabetes", query: "HbA1c" },
                  { name: "Thyroid (TSH)", query: "Thyroid" },
                  { name: "Vitamin D & B12", query: "Vitamin D" },
                  { name: "Master Health Checkup", query: "Master Health" },
                ].map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/booking?search=${encodeURIComponent(tag.query)}`}
                    className="px-2.5 py-1 rounded-xl bg-slate-100/90 hover:bg-purple-50 hover:text-[#382685] transition-colors font-bold text-[11px] text-slate-600 border border-slate-200/60"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>

            </div>

            {/* 3 Trust Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-600 max-w-lg mx-auto lg:mx-0 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Certified Phlebotomists</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#382685] shrink-0" />
                <span>Reports in 6-12 Hours</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <ShieldCheck className="h-4 w-4 text-cyan-600 shrink-0" />
                <span>100% Barcoded Cold-Chain</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: HERO EXPERIENCE SHOWCASE CARD (5 COLS ON LG)                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
            
            {/* Main Interactive Showcase Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#251b5c] to-[#382685] text-white p-6 sm:p-7 shadow-2xl border border-white/15 space-y-5 relative overflow-hidden">
              
              {/* Soft Radial Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Top Hub Status */}
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider">Automated Diagnostic Hub</div>
                    <div className="text-xs font-bold text-white">Roche Cobas &amp; Beckman Coulter Analyzers</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  NABL Live
                </span>
              </div>

              {/* Featured Diagnostic Panel Snapshot */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                    ⭐ Most Popular Panel
                  </span>
                  <span className="text-[10.5px] text-cyan-200 font-mono font-bold">63 Parameters</span>
                </div>
                
                <div>
                  <h4 className="text-base font-black text-white">Comprehensive Vital Health Profile</h4>
                  <p className="text-[11px] text-blue-100/80 mt-0.5 font-medium">
                    CBC, Liver, Kidney, Lipid, Thyroid (TSH), Blood Sugar, HbA1c &amp; Urine
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-white">₹1,999</span>
                      <span className="text-xs text-blue-200 line-through">₹4,200</span>
                      <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">52% OFF</span>
                    </div>
                    <span className="text-[10px] text-blue-200 font-medium">Includes Free Home Collection</span>
                  </div>

                  <Link
                    href="/booking?pkg=pkg-master"
                    className="px-4 py-2 rounded-xl bg-white text-[#251b5c] hover:bg-slate-100 font-black text-xs transition-transform hover:scale-105 shadow-md shrink-0 flex items-center gap-1"
                  >
                    <span>Book Now</span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#382685]" />
                  </Link>
                </div>
              </div>

              {/* Bottom 3 Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2 bg-white/5 rounded-xl">
                  <div className="text-lg font-black text-white">99.98%</div>
                  <div className="text-[9.5px] text-blue-200 uppercase font-extrabold tracking-wider">Accuracy</div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl">
                  <div className="text-lg font-black text-cyan-300">&lt; 12h</div>
                  <div className="text-[9.5px] text-blue-200 uppercase font-extrabold tracking-wider">TAT Reports</div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl">
                  <div className="text-lg font-black text-emerald-300">1.5M+</div>
                  <div className="text-[9.5px] text-blue-200 uppercase font-extrabold tracking-wider">Tests Done</div>
                </div>
              </div>

            </div>

            {/* Floating Trust Pill */}
            <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 max-w-[270px] z-20">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div className="truncate">
                <p className="font-extrabold text-slate-900 text-xs">Home Pickup in 60 Mins</p>
                <p className="text-[10.5px] text-slate-500 font-medium">Temperature-controlled box</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
