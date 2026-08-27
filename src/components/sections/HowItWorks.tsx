"use client"

import { 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  FlaskConical, 
  FileText, 
  Sparkles,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const row1Steps = [
  {
    id: 1,
    title: "Choose Test",
    description: "Search and select from 500+ certified diagnostic tests and health packages.",
    icon: Search,
    badge: "500+ Tests"
  },
  {
    id: 2,
    title: "Select Method",
    description: "Opt for free home sample collection or visit your nearest lab center.",
    icon: MapPin,
    badge: "Free Home Pickup"
  },
  {
    id: 3,
    title: "Pick a Slot",
    description: "Choose a convenient date and time slot for your appointment.",
    icon: Calendar,
    badge: "Flexible Time"
  }
]

const row2Steps = [
  {
    id: 4,
    title: "Book & Pay",
    description: "Complete your booking securely online with instant confirmation.",
    icon: CheckCircle2,
    badge: "Instant Confirm"
  },
  {
    id: 5,
    title: "Sample Collection",
    description: "Our certified phlebotomist collects your sample safely with cold-chain care.",
    icon: FlaskConical,
    badge: "100% Barcoded"
  },
  {
    id: 6,
    title: "Get Reports",
    description: "Access your accurate digital reports online within the promised TAT.",
    icon: FileText,
    badge: "6-12h Delivery"
  }
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-slate-100 font-sans" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[#382685] text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#382685]" /> 500+ Tests &amp; Packages Available
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            How It Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Booking a diagnostic test is now simpler and faster. Experience our seamless 6-step process designed for your convenience.
          </p>
        </div>

        {/* Process Flow - Clean Stepped Connecting Line Design */}
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Row 1: Steps 1, 2, 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Horizontal Line strictly aligned through circle centers */}
            <div className="hidden md:block absolute top-9 left-[16.6%] right-[16.6%] h-[2px] bg-slate-200 z-0" />
            
            {row1Steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                  
                  {/* Step Circle with Number Badge */}
                  <div className="w-18 h-18 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center text-[#382685] group-hover:border-[#382685] group-hover:scale-105 transition-all duration-300 mb-4 relative">
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#e04838] text-white flex items-center justify-center font-black text-xs shadow-xs border-2 border-white">
                      {step.id}
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mb-1.5">
                    {step.badge}
                  </span>

                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-[#251b5c] transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[240px] font-medium">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Row 2: Steps 4, 5, 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pt-2">
            {/* Horizontal Line strictly aligned through circle centers */}
            <div className="hidden md:block absolute top-11 left-[16.6%] right-[16.6%] h-[2px] bg-slate-200 z-0" />
            
            {row2Steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                  
                  {/* Step Circle with Number Badge */}
                  <div className="w-18 h-18 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center text-[#382685] group-hover:border-[#382685] group-hover:scale-105 transition-all duration-300 mb-4 relative">
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#e04838] text-white flex items-center justify-center font-black text-xs shadow-xs border-2 border-white">
                      {step.id}
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mb-1.5">
                    {step.badge}
                  </span>

                  <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-[#251b5c] transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[240px] font-medium">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>

        {/* Quick CTA Bottom Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">Explore over 500+ certified clinical tests</div>
              <div className="text-xs text-slate-500 font-medium">Free home sample collection available across Bengaluru, Mumbai &amp; NCR.</div>
            </div>
          </div>

          <Link
            href="/booking"
            className="h-10 px-5 text-xs sm:text-sm font-black bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Browse 500+ Tests</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
