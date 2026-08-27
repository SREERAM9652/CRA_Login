"use client"

import { Check, Clock, Sparkles, ArrowRight, ShieldCheck, UserCheck, Award } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import Link from "next/link"

export function HealthPackages() {
  return (
    <section className="py-12 md:py-16 bg-slate-50/60 border-t border-slate-200/60 font-sans" id="packages">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[#382685] text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#382685]" /> Proactive Preventive Healthcare
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            Comprehensive Health Packages
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Curated by clinical pathologists. Full-body screening covering cardiac, liver, kidney, thyroid, sugar, and vitamins.
          </p>
        </div>

        {/* Packages Grid - Compact & Sleek */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {HEALTH_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col justify-between relative rounded-2xl transition-all duration-200 bg-white p-4 sm:p-5 ${
                pkg.popular
                  ? "border-2 border-[#382685] shadow-lg ring-2 ring-purple-100/80"
                  : "border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Popular / Specialized Banner */}
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#251b5c] to-[#382685] text-white text-[10px] font-black uppercase tracking-wider py-0.5 px-3 rounded-full shadow-xs">
                  {pkg.badge}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#382685] text-[10.5px] font-black border border-purple-100">
                    {pkg.parameterCount} Parameters
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" /> {pkg.tat}
                  </span>
                </div>
                
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {pkg.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug font-medium line-clamp-2">
                  {pkg.tagline}
                </p>

                {/* Price block */}
                <div className="py-2.5 my-2 border-y border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900">₹{pkg.price}</span>
                    <span className="text-xs text-slate-400 line-through font-semibold">₹{pkg.mrp}</span>
                    <span className="text-[9.5px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Save {Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100)}%
                    </span>
                  </div>
                  <div className="text-[10.5px] text-emerald-700 font-bold mt-0.5">
                    ✓ Free Home Sample Collection
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-1.5 text-[11px] text-slate-600 mb-4">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Includes {pkg.parameterCount} Tests:
                  </div>
                  <ul className="space-y-1 font-medium">
                    {pkg.includes.slice(0, 4).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5 truncate">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="truncate">{inc}</span>
                      </li>
                    ))}
                    {pkg.includes.length > 4 && (
                      <li className="text-[10.5px] font-bold text-[#382685] pl-5">
                        + {pkg.includes.length - 4} more panels
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <Link
                href={`/booking?package=${pkg.id}`}
                className={`w-full h-9 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  pkg.popular
                    ? "bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white"
                    : "bg-slate-900 hover:bg-[#251b5c] text-white"
                }`}
              >
                <span>Book Package</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Doctor Consultation Banner (Compact) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1e1b4b] via-[#2e1f74] to-[#382685] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0 mx-auto md:mx-0 border border-white/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Complimentary Doctor Consultation with Master Packages
              </h3>
              <p className="text-xs text-blue-100/85 max-w-xl font-medium">
                Every Master Health Checkup includes a 1-on-1 tele-consultation with a senior physician to interpret your lab reports.
              </p>
            </div>
          </div>
          <Link
            href="/booking?package=pkg-master"
            className="h-9 px-4 bg-white text-[#251b5c] hover:bg-slate-100 font-black rounded-xl text-xs whitespace-nowrap shadow-xs shrink-0 transition-transform hover:scale-105 flex items-center"
          >
            Book Master Package
          </Link>
        </div>

      </div>
    </section>
  )
}
