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

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: HERO HEADLINE & SEARCH BOX (6 COLS ON LG)                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#2F5FDE] text-xs font-black tracking-wider uppercase shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#2F5FDE]" />
              <span>B2C WELLNESS TESTING</span>
            </div>
            
            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Know your body.<br />
              <span className="text-[#251b5c]">
                Act on it.
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              Comprehensive wellness profiles with certified labs, optional home collection, and reports you actually understand.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-0.5">
              <Link
                href="#packages"
                className="px-6 py-3 rounded-2xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-950/15 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <span>Book a Test</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/cra"
                className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-[#2F5FDE]/50 text-[#2F5FDE] font-bold text-xs sm:text-sm shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#2F5FDE]" />
                <span>Become a CRA Partner</span>
              </Link>
            </div>

            {/* Integrated Search & Booking Widget */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 space-y-3.5">
              
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
                  className="py-3 px-6 text-xs sm:text-sm font-black bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white rounded-2xl shadow-md shadow-indigo-950/15 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Find &amp; Book</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Popular Test Suggestions Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-slate-500">
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

            {/* 3 Trust Signals - Clean & Compact */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Certified Phlebotomists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#382685] shrink-0" />
                <span>Reports in 6-12 Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-600 shrink-0" />
                <span>100% Barcoded Cold-Chain</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: HERO EXPERIENCE SHOWCASE VISUAL (6 COLS ON LG)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative w-full">
            
            {/* Visual Frame with Real Generated Lab Graphic */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero_diagnostic_lab.jpg"
                alt="AVM Labs Diagnostic Laboratory"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating Top Pill */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-bold shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Automated Roche Cobas Hub</span>
                </div>
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                  NABL Live
                </span>
              </div>

              {/* Bottom Quick Feature Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#382685]" />
                    <span className="text-xs sm:text-sm font-black text-slate-900">Comprehensive Health Panel</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    63 Parameters
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono font-black text-base sm:text-lg text-slate-900">₹1,999</span>
                    <span className="font-mono text-slate-400 line-through text-xs">₹4,200</span>
                    <span className="text-[10px] font-bold text-emerald-600">52% OFF</span>
                  </div>
                  
                  <Link
                    href="/booking?pkg=pkg-master"
                    className="px-4 py-2 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs transition-colors shadow-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Book Test</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-2.5 max-w-[270px] z-20">
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
