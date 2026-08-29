import { Activity, ArrowRight, Sparkles, Coins, Users, ShieldCheck, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function CRAHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-[#f5f3ff]/40 to-white pt-16 md:pt-24 pb-16 md:pb-24 font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/90 text-[#382685] text-xs sm:text-sm font-extrabold mb-6 border border-purple-200 shadow-2xs">
          <Sparkles className="h-4 w-4 text-purple-700" />
          <span>AVMLabs Official Partner Program (CRA)</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
          Partner with AVMLabs &amp; Earn <br/>
          <span className="text-[#382685] bg-gradient-to-r from-[#251b5c] to-[#382685] bg-clip-text text-transparent">
            Up to 30% Cash on Every Test
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
          Help your friends, family, and patients get trusted diagnostic tests at <strong>20% discount</strong>, while you earn <strong>30% direct cash commission</strong> with guaranteed monthly payouts.
        </p>

        {/* 3 Simple Value Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 text-left">
          
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#382685] flex items-center justify-center font-bold shrink-0">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">30% Cash Payout</div>
              <div className="text-[11px] text-slate-500">Earned on every test booking</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">20% Customer Discount</div>
              <div className="text-[11px] text-slate-500">Flat discount for all your clients</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-cyan-100 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center font-bold shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">10% Team Bonus</div>
              <div className="text-[11px] text-slate-500">Earned from C2 partner sales</div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login" 
            className="h-13 px-8 rounded-2xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/15 transition-all w-full sm:w-auto hover:scale-102"
          >
            <span>Login to Partner Portal (C1 / C2)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link 
            href="/cra/dashboard/book-customer" 
            className="h-13 px-8 rounded-2xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-xs transition-all w-full sm:w-auto hover:border-slate-400"
          >
            <span>Book a Test for Customer</span>
          </Link>
        </div>

      </div>
    </section>
  )
}
