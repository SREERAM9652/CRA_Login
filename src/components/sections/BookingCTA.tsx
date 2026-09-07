"use client"

import Link from "next/link"
import { 
  CalendarCheck, 
  PhoneCall, 
  ArrowRight, 
  Truck, 
  Clock, 
  ShieldCheck 
} from "lucide-react"

export function BookingCTA() {
  return (
    <section 
      className="relative w-full py-12 sm:py-16 lg:py-24 xl:py-28 overflow-hidden text-white bg-cover bg-no-repeat bg-[position:80%_center] sm:bg-[position:right_center] lg:bg-center"
      style={{ backgroundImage: "url('/banner1.png')" }}
    >
      {/* Mobile & Tablet high-contrast backdrop overlay:
          - Deep royal blue across the top & middle so headline, cyan highlight, description & buttons are 100% crisp and readable without microscope glare
          - Softens toward the bottom so the medical stethoscope and test tubes show naturally */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#002466]/98 via-[#00338a]/92 via-65% to-[#00205b]/60 sm:bg-gradient-to-r sm:from-[#002e82] sm:via-[#003d9e]/90 sm:to-transparent lg:hidden pointer-events-none" />

      {/* Main container */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 relative z-10">
        <div className="max-w-xl lg:max-w-2xl text-left space-y-5 sm:space-y-6">
          
          {/* Kicker */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-[11px] sm:text-[13px] font-bold tracking-wider sm:tracking-widest text-sky-200 uppercase">
              Trusted Diagnostics. Healthier Tomorrow.
            </span>
            <div className="h-0.5 w-8 sm:w-16 bg-white/40 rounded-full shrink-0" />
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-[54px] font-black tracking-tight leading-[1.2] sm:leading-[1.12] text-white">
            Ready to take charge of{" "}
            <span className="text-[#38bdf8] block sm:inline">
              your health?
            </span>
          </h2>

          {/* Description */}
          <p className="text-blue-100/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal">
            Book your diagnostic test today and get accurate, doctor-verified reports delivered straight to your phone within 6 hours. Zero waiting times, painless sample pickup.
          </p>

          {/* Action Buttons */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-[#e50914] hover:bg-[#cc0813] text-white font-bold text-sm sm:text-base shadow-lg shadow-red-950/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <CalendarCheck className="w-5 h-5 text-white shrink-0" />
              <span>Book a Test Online</span>
              <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-white">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center ring-2 ring-sky-300/30 shrink-0 shadow-md">
                <Truck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs sm:text-xs leading-tight font-semibold text-blue-50">
                <span className="sm:block inline">Free doorstep </span>
                <span className="sm:block inline">collection</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-white/25 shrink-0" />

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center ring-2 ring-sky-300/30 shrink-0 shadow-md">
                <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs sm:text-xs leading-tight font-semibold text-blue-50">
                <span className="sm:block inline">Rapid 6 – 12h </span>
                <span className="sm:block inline">turnaround</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-white/25 shrink-0" />

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center ring-2 ring-sky-300/30 shrink-0 shadow-md">
                <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs sm:text-xs leading-tight font-semibold text-blue-50">
                <span className="sm:block inline">100% Secure </span>
                <span className="sm:block inline">&amp; Confidential</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
