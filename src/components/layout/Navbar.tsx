"use client"

import { useState } from "react"
import Link from "next/link"
import { Activity, User, Menu, X, Shield, Phone, Search, Sparkles, ChevronRight, Award } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all font-sans">
      
      {/* Top micro-bar for trust & helpline */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 hidden md:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Shield className="h-3 w-3" /> NABL Accredited Reference Lab
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">Free Home Sample Collection in 60 Mins</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+918049128800" className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors">
              <Phone className="h-3 w-3 text-cyan-400" /> 24/7 Helpline: +91 80 4912 8800
            </a>
            <span className="text-slate-600">|</span>
            <Link href="/cra" className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> CRA Partner Portal (Earn 30%)
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between">
        
        {/* Brand Logo - Crisp & Enlarged */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-12 sm:h-13 w-auto max-w-[170px] object-contain mix-blend-multiply transition-transform group-hover:scale-102"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#251b5c] transition-colors">
            Home
          </Link>
          <Link href="#tests" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#251b5c] transition-colors">
            Diagnostic Tests
          </Link>
          <Link href="#packages" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#251b5c] transition-colors">
            Health Packages
          </Link>
          <Link href="#how-it-works" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#251b5c] transition-colors">
            How It Works
          </Link>
          <Link href="#why-choose-us" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#251b5c] transition-colors">
            Why AVMLabs
          </Link>
          <Link href="#faq" className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#251b5c] transition-colors">
            FAQ
          </Link>
          <Link 
            href="/cra" 
            className="text-xs sm:text-sm font-black text-[#382685] hover:text-[#251b5c] transition-colors px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200/80"
          >
            Partner Portal (CRA)
          </Link>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/login"
            className="gap-1.5 hidden sm:inline-flex h-10 px-4 text-xs font-black items-center justify-center whitespace-nowrap rounded-2xl transition-all border border-indigo-900/40 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 shadow-xs"
          >
            <User className="h-3.5 w-3.5 text-indigo-900" />
            <span>C1 / C2 Partner Login</span>
          </Link>
          
          <Link
            href="/cra/dashboard/book-customer"
            className="h-10 px-5 text-xs sm:text-sm font-black inline-flex items-center justify-center whitespace-nowrap rounded-2xl transition-all bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white shadow-md shadow-indigo-950/15 hover:scale-102"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300 mr-1.5" />
            <span>CRA Flow Demo</span>
          </Link>

          {/* Mobile menu hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
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
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            href="#tests"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Diagnostic Tests (63 Tests)
          </Link>
          <Link
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Full Body Health Packages
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </Link>
          <Link
            href="/cra"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-black text-[#382685] bg-purple-50"
          >
            CRA Partner Program (Earn 30%)
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
            >
              Sign In (Patient / CRA Partner)
            </Link>
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-sm font-black text-white shadow-md"
            >
              Book a Test / Health Package
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
