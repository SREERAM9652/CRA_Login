"use client"

import Link from "next/link"
import { 
  CalendarCheck, 
  PhoneCall, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Activity, 
  FileCheck2, 
  MapPin 
} from "lucide-react"

export function BookingCTA() {
  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-[#061a4a] via-[#0f2f7d] to-[#1e3a8a] text-white">
      {/* Subtle Grid Dot Matrix overlay across full width */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Decorative ambient glowing lights */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      
      {/* Faint ECG heartbeat decorative wave at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none overflow-hidden flex items-end">
        <svg 
          viewBox="0 0 1200 120" 
          className="w-full h-12 text-cyan-200 stroke-current fill-none stroke-[2]"
          preserveAspectRatio="none"
        >
          <path d="M0,60 L200,60 L220,20 L240,100 L260,30 L280,75 L300,60 L600,60 L620,15 L640,105 L660,25 L680,80 L700,60 L1200,60" />
        </svg>
      </div>

      {/* Responsive content wrapper with widescreen max-width */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
              Ready to take charge of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                your health?
              </span>
            </h2>

            {/* Description */}
            <p className="text-blue-100/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-normal">
              Book your diagnostic test today and get accurate, doctor-verified reports delivered straight to your phone within 6 hours. Zero waiting times, painless sample pickup.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <CalendarCheck className="w-5 h-5 text-white" />
                <span>Book a Test Online</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="tel:+918049128800"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/25 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <PhoneCall className="w-5 h-5 text-cyan-300" />
                <span>Call: +91 80 4912 8800</span>
              </a>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Free doorstep collection</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="font-medium">Rapid 6–12h turnaround</span>
              </div>
            </div>

          </div>

          {/* Right Interactive Preview Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-7 shadow-2xl text-white">
              
              {/* Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-200">
                    Home Sample Pickup Active
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 text-white font-mono">
                  TAT: 6 Hrs
                </span>
              </div>

              {/* Card Body */}
              <div className="mt-5 space-y-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-200 font-medium">Most Popular Package</p>
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">Master Full Body Checkup</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-amber-300 font-semibold">82 Vital Tests Included</span>
                    </div>
                  </div>
                </div>

                {/* Feature Bullets */}
                <div className="space-y-2.5 text-xs text-blue-100/90 pl-1 pb-1">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>Smart WhatsApp &amp; Email digital PDF report</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>Available across all pin codes in Bengaluru</span>
                  </div>
                </div>

                {/* Direct WhatsApp Action */}
                <div className="pt-2 border-t border-white/15">
                  <a
                    href="https://wa.me/918049128800?text=Hi%20AVMLabs,%20I%20would%20like%20to%20book%20a%20health%20test."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-semibold text-xs transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Quick Booking via WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
