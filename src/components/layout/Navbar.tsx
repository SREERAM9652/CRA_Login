"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Calendar, Sparkles, Handshake, ChevronRight, User } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const marqueeContent = (
    <>
      <Link href="/cra" className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold shrink-0">
        <span>🤝</span>
        <span>Franchise &amp; Partner Portal</span>
      </Link>

      <span className="text-slate-300">|</span>

      <span className="text-slate-500 font-medium shrink-0">
        GCC Footprint Active
      </span>

      <span className="text-slate-300">|</span>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-600 font-black text-[10px] uppercase shadow-2xs">
          <span>🛰️</span> Official Launch
        </span>
        <span className="text-slate-600">
          Operations Commencement Across India: <strong className="text-[#1e3a8a] font-black">September 2026</strong>
        </span>
      </div>

      <span className="text-slate-300">|</span>

      <Link href="/cra" className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold shrink-0">
        <span>🤝</span>
        <span>Franchise &amp; Partner Portal</span>
      </Link>

      <span className="text-slate-300">|</span>

      <span className="text-slate-500 font-medium shrink-0">
        GCC Footprint Active
      </span>

      <span className="text-slate-300">|</span>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-600 font-black text-[10px] uppercase shadow-2xs">
          <span>🛰️</span> Official Launch
        </span>
        <span className="text-slate-600">
          Operations Commencement Across India: <strong className="text-[#1e3a8a] font-black">September 2026</strong>
        </span>
      </div>

      <span className="text-slate-300">|</span>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/98 backdrop-blur-md transition-all font-sans shadow-xs">
      
      {/* Top Auto-Scrolling Marquee Ribbon */}
      <div className="bg-[#fff5f5] text-slate-700 text-xs h-8 border-b border-rose-100/90 overflow-hidden flex items-center select-none">
        <div className="w-full overflow-hidden relative">
          <div className="animate-marquee-smooth flex items-center gap-6 whitespace-nowrap text-[11px] sm:text-xs">
            {marqueeContent}
            {marqueeContent}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-6">
        
        {/* Left: Brand Logo & Typography */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-3.5 group py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-13 sm:h-14 w-auto max-w-[170px] sm:max-w-[200px] object-contain mix-blend-multiply transition-transform group-hover:scale-102"
            />
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base sm:text-lg font-black text-[#1e1b4b] tracking-tight">AVMLabs</span>
                <span className="bg-[#dc2626] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  INDIA
                </span>
              </div>
              <span className="text-[8px] sm:text-[8.5px] font-black text-slate-400 tracking-wider uppercase mt-1">
                NEXT-GEN DIAGNOSTICS &amp; PREVENTIVE HEALTH
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Exact 4 Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          <Link 
            href="#packages" 
            className="text-sm font-bold text-[#2F5FDE] hover:text-[#1e3a8a] transition-colors py-1 cursor-pointer"
          >
            Tests &amp; Profiles
          </Link>
          <Link 
            href="#why-choose-us" 
            className="text-sm font-bold text-[#2F5FDE] hover:text-[#1e3a8a] transition-colors py-1 cursor-pointer"
          >
            About
          </Link>
          <Link 
            href="/cra" 
            className="text-sm font-bold text-[#2F5FDE] hover:text-[#1e3a8a] transition-colors py-1 cursor-pointer"
          >
            Become a CRA
          </Link>
          <Link 
            href="#faq" 
            className="text-sm font-bold text-[#2F5FDE] hover:text-[#1e3a8a] transition-colors py-1 cursor-pointer"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Exact 2 Action Buttons (Customer Login & CRA Login) */}
        <div className="flex items-center gap-3 shrink-0">
          
          <Link
            href="/login?role=customer"
            className="h-10 px-5 text-xs sm:text-sm font-bold inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-all border border-[#2F5FDE] bg-white hover:bg-blue-50 text-[#2F5FDE] shadow-xs cursor-pointer hover:scale-102"
          >
            <span>Customer Login</span>
          </Link>

          <Link
            href="/login"
            className="h-10 px-6 text-xs sm:text-sm font-black inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-all bg-[#2F5FDE] hover:bg-[#1d4ed8] text-white shadow-md shadow-blue-950/15 cursor-pointer hover:scale-102"
          >
            <span>CRA Login</span>
          </Link>

          {/* Mobile menu hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-[#2F5FDE] hover:bg-blue-50"
          >
            Tests &amp; Profiles
          </Link>
          <Link
            href="#why-choose-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            About
          </Link>
          <Link
            href="/cra"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Become a CRA
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login?role=customer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-[#2F5FDE] text-sm font-bold text-[#2F5FDE]"
            >
              Customer Login
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#2F5FDE] text-sm font-black text-white shadow-md"
            >
              CRA Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
