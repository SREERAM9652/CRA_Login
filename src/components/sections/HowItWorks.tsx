"use client"

import { 
  Search, 
  MapPin, 
  Calendar, 
  CreditCard, 
  FlaskConical, 
  FileText, 
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

const STEPS = [
  {
    stepNumber: "01",
    phase: "Phase 1: Booking & Scheduling",
    title: "Choose Test",
    description: "Search and select from 500+ diagnostic tests and curated health checkup packages.",
    icon: Search,
    badge: "500+ Tests & Packages",
    badgeStyle: "text-blue-700 bg-blue-50 border-blue-200/80",
    highlight: "Online search & curated panels"
  },
  {
    stepNumber: "02",
    phase: "Phase 1: Booking & Scheduling",
    title: "Select Method",
    description: "Opt for free home sample collection by a trained phlebotomist or walk in to your nearest lab center.",
    icon: MapPin,
    badge: "Free Home Pickup",
    badgeStyle: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    highlight: "Home visit or nearest lab walk-in"
  },
  {
    stepNumber: "03",
    phase: "Phase 1: Booking & Scheduling",
    title: "Pick a Slot",
    description: "Choose a convenient date and time slot that fits your schedule, starting as early as 6:30 AM.",
    icon: Calendar,
    badge: "Flexible 30-Min Slots",
    badgeStyle: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
    highlight: "Convenient morning time slots"
  },
  {
    stepNumber: "04",
    phase: "Phase 2: Collection & Delivery",
    title: "Book & Pay",
    description: "Confirm your appointment securely online with instant booking receipt and digital confirmation.",
    icon: CreditCard,
    badge: "Instant Confirmation",
    badgeStyle: "text-amber-800 bg-amber-50 border-amber-200/80",
    highlight: "UPI, Cards, Netbanking or Cash"
  },
  {
    stepNumber: "05",
    phase: "Phase 2: Collection & Delivery",
    title: "Sample Collection",
    description: "Our trained phlebotomist arrives on time to collect samples safely with barcoded, cold-chain protocols.",
    icon: FlaskConical,
    badge: "100% Barcoded Safety",
    badgeStyle: "text-sky-800 bg-sky-50 border-sky-200/80",
    highlight: "Trained phlebotomist & sealed kits"
  },
  {
    stepNumber: "06",
    phase: "Phase 2: Collection & Delivery",
    title: "Get Digital Reports",
    description: "Access verified digital lab reports online and via WhatsApp/Email within the guaranteed turnaround time.",
    icon: FileText,
    badge: "Guaranteed 6-12h TAT",
    badgeStyle: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    highlight: "WhatsApp, Email & Online Download"
  }
]

export function HowItWorks() {
  return (
    <section className="py-8 md:py-12 bg-slate-50/50 border-t border-slate-200/70 font-sans" id="how-it-works">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0f2756] text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-[#0f2756]" /> 500+ Tests &amp; Packages Available
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            How It Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            Booking a diagnostic test is now simpler and faster. Experience our seamless 6-step process designed for your convenience.
          </p>
        </div>

        {/* Phase 1: Booking & Scheduling */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0f2756]" />
              <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-800">
                Stage 1: Selection &amp; Scheduling (Steps 01 – 03)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Takes ~2 minutes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {STEPS.slice(0, 3).map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.stepNumber}
                  className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-[#0f2756] hover:-translate-y-0.5 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2756] transition-colors" />

                  <div>
                    {/* Top Row: Icon Box & Big Classic Step Number */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0f2756] group-hover:bg-[#0f2756] group-hover:text-white transition-all duration-200 shadow-2xs">
                        <Icon className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-200 group-hover:text-[#0f2756]/30 transition-colors font-mono tracking-tighter">
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Badge */}
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2 ${step.badgeStyle}`}>
                      {step.badge}
                    </span>

                    {/* Title & Description */}
                    <h4 className="text-base font-black text-slate-900 group-hover:text-[#0f2756] transition-colors leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 font-normal">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Feature Pill & Progression Arrow */}
                  <div className="pt-3 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10.5px]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{step.highlight}</span>
                    </span>
                    <span className="text-slate-300 group-hover:text-[#0f2756] group-hover:translate-x-1 transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Phase 2: Collection & Reports */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-slate-800">
                Stage 2: Sample Collection &amp; Accurate Reports (Steps 04 – 06)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Guaranteed TAT Delivery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {STEPS.slice(3, 6).map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.stepNumber}
                  className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-[#0f2756] hover:-translate-y-0.5 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2756] transition-colors" />

                  <div>
                    {/* Top Row: Icon Box & Big Classic Step Number */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0f2756] group-hover:bg-[#0f2756] group-hover:text-white transition-all duration-200 shadow-2xs">
                        <Icon className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-200 group-hover:text-[#0f2756]/30 transition-colors font-mono tracking-tighter">
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Badge */}
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2 ${step.badgeStyle}`}>
                      {step.badge}
                    </span>

                    {/* Title & Description */}
                    <h4 className="text-base font-black text-slate-900 group-hover:text-[#0f2756] transition-colors leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 font-normal">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Feature Pill & Progression Arrow */}
                  <div className="pt-3 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10.5px]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{step.highlight}</span>
                    </span>
                    <span className="text-slate-300 group-hover:text-[#0f2756] group-hover:translate-x-1 transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick CTA Bottom Bar in Brand Dark Blue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0a1936] via-[#0f2756] to-[#1e3a8a] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-white/10">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-white/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Explore over 500+ clinical tests</div>
              <div className="text-xs text-blue-100/80 font-medium">Free home sample collection available across Bengaluru, Mumbai &amp; NCR.</div>
            </div>
          </div>

          <Link
            href="/booking"
            className="h-10 px-5 text-xs sm:text-sm font-black bg-white hover:bg-slate-100 text-[#0f2756] rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 hover:scale-105"
          >
            <span>Browse 500+ Tests</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
