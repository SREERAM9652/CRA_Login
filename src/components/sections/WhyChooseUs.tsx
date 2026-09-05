"use client"

import { 
  Workflow, 
  ScanLine, 
  Smartphone, 
  Sparkles 
} from "lucide-react"

const FEATURES = [
  {
    title: "Bi-Directional Systems",
    tag: "Automation",
    tagStyle: "text-blue-700 bg-blue-50 border-blue-200/80",
    description: "High-throughput automated analyzers ensure seamless sample processing with zero manual touchpoints in core chemistry.",
    icon: Workflow,
  },
  {
    title: "Barcoded Sample Integrity",
    tag: "Barcode Integrity",
    tagStyle: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
    description: "End-to-end barcode tracking guarantees 100% specimen traceability from collection tube to final digital verification.",
    icon: ScanLine,
  },
  {
    title: "Smart Digital Reporting",
    tag: "Digital Reporting",
    tagStyle: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    description: "Intuitive wellness reports featuring trend analysis and historical biomarker tracking delivered straight to WhatsApp and Email.",
    icon: Smartphone,
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/80 font-sans" id="why-choose-us">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0f2756] text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#0f2756]" /> Speed &amp; Low Cost &bull; Automation
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Why Choose AVMLabs?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Advanced automation, barcoded precision, and instant digital reporting delivering certified diagnostics at high speed and low cost.
          </p>
        </div>

        {/* 3 Focused Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#0f2756] hover:-translate-y-1 transition-all duration-300 p-7 sm:p-8 flex flex-col group overflow-hidden"
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0f2756] transition-colors" />

                <div>
                  {/* Top Row: Icon container & Tag */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="h-14 w-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0f2756] group-hover:bg-[#0f2756] group-hover:text-white transition-all duration-300 shadow-2xs shrink-0">
                      <Icon className="h-7 w-7 stroke-[2.2]" />
                    </div>

                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${feature.tagStyle}`}>
                      {feature.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0f2756] transition-colors leading-snug mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
