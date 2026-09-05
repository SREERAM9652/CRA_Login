"use client"

import { useState } from "react"
import { Check, Clock, UserCheck, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import Link from "next/link"

function PackageCard({ pkg }: { pkg: (typeof HEALTH_PACKAGES)[0] }) {
  const isHighlighted = Boolean(pkg.badge) // "Most Popular", "Specialized", "Flagship"

  return (
    <div
      key={pkg.id}
      className={`flex flex-col justify-between relative rounded-3xl transition-all duration-200 bg-white p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 ${
        isHighlighted
          ? "border-2 border-[#0f2756] shadow-md ring-1 ring-[#0f2756]/10"
          : "border-2 border-transparent shadow-sm hover:border-[#0f2756]"
      }`}
    >
      {/* Popular / Specialized / Flagship Banner Centered on Top Border */}
      {pkg.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0f2756] text-white text-[10px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md z-10 whitespace-nowrap">
          {pkg.badge}
        </div>
      )}

      <div>
        {/* Top Row: Parameters Pill & Turnaround Time */}
        <div className="flex justify-between items-center mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0f2756] text-[11px] font-bold border border-blue-200/70">
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
            <span className="text-2xl sm:text-3xl font-black text-[#0a1936]">₹{pkg.price}</span>
            <span className="text-xs text-slate-400 line-through font-medium">₹{pkg.mrp}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
              <li className="text-[11px] font-bold text-[#0f2756] pl-6 pt-0.5">
                + {pkg.includes.length - 4} more panels
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Button - Restored Rounded-2xl */}
      <Link
        href={`/booking?package=${pkg.id}`}
        className="w-full h-11 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-md bg-[#0f2756] hover:bg-[#0a1e42] text-white hover:scale-101 cursor-pointer"
      >
        Book Package
      </Link>
    </div>
  )
}

function PackageSkeleton() {
  return (
    <div className="flex flex-col justify-between relative rounded-3xl bg-white p-5 sm:p-6 border-2 border-slate-100 shadow-sm animate-pulse min-h-[440px]">
      <div>
        {/* Top Row: Pill & TAT skeleton */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-24 rounded-full bg-slate-200"></div>
          <div className="h-4 w-16 rounded bg-slate-200"></div>
        </div>

        {/* Title & Tagline skeleton */}
        <div className="h-5 w-3/4 rounded-md bg-slate-200 mb-2 mt-1"></div>
        <div className="h-3.5 w-full rounded bg-slate-100 mb-1"></div>
        <div className="h-3.5 w-2/3 rounded bg-slate-100 mb-3"></div>

        {/* Price block skeleton */}
        <div className="py-3 my-3 border-y border-slate-100 space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-20 rounded-md bg-slate-200"></div>
            <div className="h-4 w-12 rounded bg-slate-100"></div>
            <div className="h-4 w-16 rounded bg-emerald-100/60"></div>
          </div>
          <div className="h-3.5 w-44 rounded bg-emerald-100/70"></div>
        </div>

        {/* Inclusions skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-28 rounded bg-slate-200 mb-2.5"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-slate-200 shrink-0"></div>
                <div className="h-3 w-4/5 rounded bg-slate-100"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="w-full h-11 rounded-2xl bg-slate-200 mt-2"></div>
    </div>
  )
}

export function HealthPackages() {
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleViewAll = () => {
    if (!showAll) {
      setIsLoading(true)
      setShowAll(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 600)
    } else {
      setShowAll(false)
    }
  }

  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-14 bg-slate-50/60 border-t border-slate-200/60 font-sans" id="packages">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
        
        {/* Section Header */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Wellness Profiles
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            12 curated health checkup packages with simple, transparent pricing.
          </p>
        </div>

        {/* Packages Grid - Displays First 4 Packages initially, and Skeletons when View All is clicked */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4 sm:pt-5">
          {/* Always display the first 4 featured packages */}
          {HEALTH_PACKAGES.slice(0, 4).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}

          {/* Remaining packages or loading skeletons */}
          {showAll && (
            isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <PackageSkeleton key={`skeleton-${i}`} />
                ))
              : HEALTH_PACKAGES.slice(4).map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))
          )}
        </div>

        {/* View All / Show Less Toggle Button */}
        {HEALTH_PACKAGES.length > 4 && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleToggleViewAll}
              className="h-11 px-7 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-[#0f2756] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer hover:border-[#0f2756]/40 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#0f2756]" />
                  <span>Loading Packages...</span>
                </>
              ) : (
                <>
                  <span>{showAll ? "Show Featured Packages Only" : `View All ${HEALTH_PACKAGES.length} Packages`}</span>
                  {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </>
              )}
            </button>
          </div>
        )}

        {/* Doctor Consultation Banner - Restored Rounded-2xl */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0a1936] via-[#0f2756] to-[#1e3a8a] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
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
            className="h-9 px-4 bg-white text-[#0f2756] hover:bg-slate-100 font-bold rounded-xl text-xs whitespace-nowrap shadow-xs shrink-0 transition-transform hover:scale-105 flex items-center"
          >
            Book Master Package
          </Link>
        </div>

      </div>
    </section>
  )
}
