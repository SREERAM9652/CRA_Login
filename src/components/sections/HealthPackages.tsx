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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Wellness Profiles
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              A dozen curated profiles, priced simply.
            </p>
          </div>

          <Link
            href="/booking"
            className="text-xs sm:text-sm font-bold text-[#251b5c] hover:text-[#382685] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Packages Grid - Sleek, Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
          {HEALTH_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col justify-between relative rounded-3xl transition-all duration-200 bg-white p-5 sm:p-6 ${
                pkg.popular
                  ? "border-2 border-[#251b5c] shadow-lg ring-4 ring-purple-50"
                  : "border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Popular / Specialized Banner Centered on Top Border */}
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#251b5c] text-white text-[10px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md z-10 whitespace-nowrap">
                  {pkg.badge}
                </div>
              )}

              <div>
                {/* Top Row: Parameters Pill & Turnaround Time */}
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#382685] text-[11px] font-black border border-purple-100/80">
                    {pkg.parameterCount} Parameters
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {pkg.tat}
                  </span>
                </div>
                
                {/* Title & Tagline */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal min-h-[36px]">
                  {pkg.tagline}
                </p>

                {/* Price block */}
                <div className="py-3 my-3 border-y border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{pkg.price}</span>
                    <span className="text-xs text-slate-400 line-through font-semibold">₹{pkg.mrp}</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Save {Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <span>✓</span> Free Home Sample Collection
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-2 text-xs text-slate-600 mb-6">
                  <div className="font-extrabold text-slate-800 uppercase tracking-wider text-[10.5px]">
                    INCLUDES {pkg.parameterCount} TESTS:
                  </div>
                  <ul className="space-y-1.5 font-medium">
                    {pkg.includes.slice(0, 4).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11.5px]">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="truncate">{inc}</span>
                      </li>
                    ))}
                    {pkg.includes.length > 4 && (
                      <li className="text-[11px] font-bold text-[#382685] pl-6 pt-0.5">
                        + {pkg.includes.length - 4} more panels
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/booking?package=${pkg.id}`}
                className="w-full h-11 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md bg-[#251b5c] hover:bg-[#1e1b4b] text-white hover:scale-101 cursor-pointer"
              >
                <span>Book Package</span>
                <ArrowRight className="h-4 w-4" />
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
