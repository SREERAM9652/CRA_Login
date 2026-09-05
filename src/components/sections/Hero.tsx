"use client"

import { 
  Home, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Activity, 
  FlaskConical, 
  FileDown, 
  Zap, 
  Users,
  TrendingUp 
} from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfcfd] pt-10 sm:pt-14 lg:pt-18 pb-16 sm:pb-22 lg:pb-26 border-b border-slate-100 font-sans min-h-[560px] lg:min-h-[620px] flex items-center">
      
      {/* ========================================================================= */}
      {/* FULL BACKGROUND IMAGE (hero1.png) WITH NATURAL SUNLIGHT & FADE OVERLAYS   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero1.png"
          alt="A Healthier You, Every Day"
          className="w-full h-full object-cover object-[88%_center] sm:object-[90%_center] md:object-[92%_center] lg:object-[92%_center]"
        />

        {/* Clean white gradient on the left half to ensure 100% crisp typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent max-w-2xl sm:max-w-3xl md:max-w-5xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent sm:hidden pointer-events-none" />

        {/* Flowing Organic Blue Layered Wave at the bottom left */}
        <div className="absolute -bottom-1 left-0 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl pointer-events-none">
          <svg
            viewBox="0 0 800 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16 sm:h-24 md:h-32"
            preserveAspectRatio="none"
          >
            <path
              d="M0 160V100C120 70 240 140 380 100C520 60 640 120 800 50V160H0Z"
              fill="url(#hero-wave-light)"
            />
            <path
              d="M0 160V120C100 95 200 150 340 115C480 80 600 130 760 75C780 68 790 62 800 58V160H0Z"
              fill="url(#hero-wave-deep)"
            />
            <defs>
              <linearGradient id="hero-wave-light" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#93c5fd" stopOpacity="0.3" />
                <stop offset="80%" stopColor="#bfdbfe" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-wave-deep" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
                <stop offset="35%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HANDWRITTEN SCRIPT - MOVED TO THE SUNLIT SPACE TO THE LEFT OF HER FACE   */}
      {/* ========================================================================= */}
      <div className="hidden 2xl:flex flex-col items-center absolute top-12 lg:top-16 xl:top-20 right-[35%] z-20 pointer-events-none select-none">
        <div className="font-signature font-bold text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] text-[#1e3a8a] tracking-wide -rotate-6 text-center leading-tight drop-shadow-sm">
          A Healthier<br />You, Every Day
        </div>
        <svg className="w-28 sm:w-32 lg:w-36 h-4 text-[#1e3a8a] mt-0.5 -rotate-6" viewBox="0 0 160 20" fill="none">
          <path d="M5 14C45 3 115 2 155 12C120 7 70 8 20 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER CONTENT (GRID-ALIGNED TO REST OF WEBSITE)                  */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-end">
          
          {/* Left Column: Diagnostics & Care */}
          <div className="lg:col-span-6 xl:col-span-6 max-w-xl xl:max-w-2xl space-y-5 sm:space-y-6 text-left">
            
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/95 border border-blue-200/90 text-[#1e3a8a] text-xs font-black tracking-wider uppercase shadow-2xs">
              <Activity className="h-3.5 w-3.5 text-[#1e3a8a]" />
              <span>Built on 30+ Years of Diagnostic Leadership</span>
            </div>
            
            {/* Hero Heading - Refined, Balanced & Impactful */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-black tracking-tight text-slate-900 leading-[1.08]">
              Connect Wellness.<br />
              <span className="text-[#1e3a8a]">
                Create Opportunities.
              </span>
            </h1>
            
            {/* Subheading - High Contrast & Thicker Display */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-800 leading-relaxed font-semibold max-w-xl sm:max-w-2xl">
              Access 500+ diagnostic tests with advanced technologies, convenient home sample collection, on-time report delivery, and easy-to-download digital reports—all in one place.
            </p>

            {/* Action Buttons - Refined Size */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="#packages"
                className="px-7 sm:px-8 py-3.5 rounded-2xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-black text-xs sm:text-sm shadow-md shadow-blue-950/20 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <span>Book a Test</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              
              <Link
                href="/cra"
                className="px-6 sm:px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-[#1e3a8a]/40 text-[#1e3a8a] font-bold text-xs sm:text-sm shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <Users className="h-4.5 w-4.5 text-[#1e3a8a]" />
                <span>Become a CRA Partner</span>
              </Link>
            </div>

            {/* 4 Feature Badges in a Row - Clean Transparent Icons (No BG, No Border) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3.5 max-w-lg pt-1.5 sm:pt-2.5 select-none">
              <div className="flex flex-col items-center gap-1 sm:gap-2 text-center group cursor-default select-none">
                <div className="h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center transition-transform group-hover:scale-110 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/flask.png" alt="500+ Tests Available" draggable={false} className="w-full h-full object-contain drop-shadow-xs pointer-events-none select-none" />
                </div>
                <span className="text-[9.5px] sm:text-xs font-extrabold text-slate-900 leading-tight select-none">500+ Tests<br />Available</span>
              </div>

              <div className="flex flex-col items-center gap-1 sm:gap-2 text-center group cursor-default select-none">
                <div className="h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center transition-transform group-hover:scale-110 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/nurse.png" alt="Home Sample Collection" draggable={false} className="w-full h-full object-contain drop-shadow-xs pointer-events-none select-none" />
                </div>
                <span className="text-[9.5px] sm:text-xs font-extrabold text-slate-900 leading-tight select-none">Home Sample<br />Collection</span>
              </div>

              <div className="flex flex-col items-center gap-1 sm:gap-2 text-center group cursor-default select-none">
                <div className="h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center transition-transform group-hover:scale-110 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/report.png" alt="Easy Report Download" draggable={false} className="w-full h-full object-contain drop-shadow-xs pointer-events-none select-none" />
                </div>
                <span className="text-[9.5px] sm:text-xs font-extrabold text-slate-900 leading-tight select-none">Easy Report<br />Download</span>
              </div>

              <div className="flex flex-col items-center gap-1 sm:gap-2 text-center group cursor-default select-none">
                <div className="h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center transition-transform group-hover:scale-110 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/fast-time.png" alt="On-Time Report Delivery" draggable={false} className="w-full h-full object-contain drop-shadow-xs pointer-events-none select-none" />
                </div>
                <span className="text-[9.5px] sm:text-xs font-extrabold text-slate-900 leading-tight select-none">On-Time Report<br />Delivery</span>
              </div>
            </div>

            {/* Trust Signals Bar - Balanced & Bold */}
            <div className="flex items-center gap-3.5 pt-2 text-xs text-slate-800 font-bold select-none">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#1e3a8a] shrink-0" />
                <span>Reports in 6–12 Hours</span>
              </div>
              <span className="text-slate-400 font-light">|</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-600 shrink-0" />
                <span>100% Barcoded Cold-Chain</span>
              </div>
            </div>

          </div>

          {/* Right Column: CRA Referral Opportunity (Transparent on Mobile, Blue Blur on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-start lg:-translate-x-6 xl:-translate-x-14">
            <div className="w-full max-w-lg lg:max-w-[450px] xl:max-w-[490px] space-y-2.5 text-left bg-transparent lg:bg-white/30 lg:backdrop-blur-md shadow-none lg:shadow-md p-0 lg:p-4 xl:p-5 rounded-none lg:rounded-2xl">
              
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-slate-900 leading-[1.15]">
                Refer Wellness. <span className="text-[#1e3a8a]">Earn Rewards.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                Become an AVMLabs CRA and earn incentives by connecting people with trusted wellness testing services.
              </p>

              {/* Value Highlights with Larger SVG Icons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs sm:text-sm font-black text-slate-900 select-none">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Incentives</span>
                </div>
                <span className="text-slate-300 font-light">|</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4.5 w-4.5 text-[#1e3a8a] shrink-0" />
                  <span>Flexible Opportunity</span>
                </div>
                <span className="text-slate-300 font-light">|</span>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                  <span>Simple Referrals</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
