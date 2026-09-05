"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Calendar, Sparkles, Handshake, ChevronRight, User, LogOut, FileText, Users } from "lucide-react"
import { useWorkflowStore } from "@/lib/workflow-store"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { customer, isCustomerLoggedIn, logoutCustomer } = useWorkflowStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const showCustomerLoggedIn = mounted && isCustomerLoggedIn

  const marqueeContent = (
    <>
      <Link href="/cra" className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium shrink-0">
        <span>🤝</span>
        <span>Franchise &amp; Partner Portal</span>
      </Link>

      <span className="text-slate-300">|</span>

      <span className="text-slate-500 font-normal shrink-0">
        GCC Footprint Active
      </span>

      <span className="text-slate-300">|</span>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-600 font-semibold text-[10px] uppercase shadow-2xs">
          <span>🛰️</span> Official Launch
        </span>
        <span className="text-slate-600">
          Operations Commencement Across India: <strong className="text-[#1e3a8a] font-semibold">September 2026</strong>
        </span>
      </div>

      <span className="text-slate-300">|</span>

      <Link href="/cra" className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium shrink-0">
        <span>🤝</span>
        <span>Franchise &amp; Partner Portal</span>
      </Link>

      <span className="text-slate-300">|</span>

      <span className="text-slate-500 font-normal shrink-0">
        GCC Footprint Active
      </span>

      <span className="text-slate-300">|</span>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-600 font-semibold text-[10px] uppercase shadow-2xs">
          <span>🛰️</span> Official Launch
        </span>
        <span className="text-slate-600">
          Operations Commencement Across India: <strong className="text-[#1e3a8a] font-semibold">September 2026</strong>
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
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-18 sm:h-20 flex items-center justify-between gap-6">
        
        {/* Left: Brand Logo & Typography */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <Link href="/" className="flex items-center gap-3.5 group py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/AVMLabs - Logo - WL .svg"
              alt="AVMLabs Diagnostics"
              className="h-14 sm:h-16 md:h-20 w-auto max-w-[160px] sm:max-w-[190px] md:max-w-[240px] object-contain mix-blend-multiply"
            />
            
            <div className="hidden sm:flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base sm:text-lg font-bold text-[#1e1b4b] tracking-tight">AVMLabs</span>
                <span className="bg-[#dc2626] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  INDIA
                </span>
              </div>
              <span className="text-[8px] sm:text-[8.5px] font-medium text-slate-400 tracking-wider uppercase mt-1">
                NEXT-GEN DIAGNOSTICS &amp; PREVENTIVE HEALTH
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 shrink-0">
          <Link 
            href="/#packages" 
            className="text-sm font-medium text-[#1e3a8a] hover:text-[#172554] transition-colors py-1 cursor-pointer"
          >
            Tests &amp; Profiles
          </Link>
          <Link 
            href="/#why-choose-us" 
            className="text-sm font-medium text-[#1e3a8a] hover:text-[#172554] transition-colors py-1 cursor-pointer"
          >
            About
          </Link>
          <Link 
            href="/cra" 
            className="text-sm font-medium text-[#1e3a8a] hover:text-[#172554] transition-colors py-1 cursor-pointer"
          >
            Become a CRA
          </Link>
          <Link 
            href="/#contact" 
            className="text-sm font-medium text-[#1e3a8a] hover:text-[#172554] transition-colors py-1 cursor-pointer"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Dynamic Action Buttons (Handles Logged-In Customer / CRA vs Unauthenticated) */}
        <div className="flex items-center justify-end gap-3 flex-1">
          
          {showCustomerLoggedIn ? (
            /* Logged-in Customer View */
            <div className="flex items-center gap-2">
              <Link
                href="/customer/dashboard"
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#251b5c] font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-[#251b5c] text-white flex items-center justify-center font-black text-[10px]">
                  {customer.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight truncate max-w-[110px]">{customer.name}</span>
                  <span className="text-[9.5px] text-emerald-700 font-extrabold leading-tight">Customer Portal</span>
                </div>
                <span className="sm:hidden text-xs font-bold">Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => logoutCustomer()}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Logout from Customer Account"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <Link
                href="/cra/dashboard"
                className="h-10 px-3.5 sm:px-4 text-xs sm:text-sm font-bold inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-all bg-[#2F5FDE] hover:bg-[#1d4ed8] text-white shadow-xs cursor-pointer"
              >
                <span>CRA Login</span>
              </Link>
            </div>
          ) : (
            /* Unauthenticated View */
            <Link
              href="/login"
              className="h-10 px-6 text-xs sm:text-sm font-medium inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-all bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-md shadow-blue-950/20 cursor-pointer hover:scale-102"
            >
              <span>Login</span>
            </Link>
          )}

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
          
          {showCustomerLoggedIn && (
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-[#251b5c] text-white flex items-center justify-center font-bold text-xs">
                  {customer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{customer.name}</div>
                  <div className="text-[10.5px] text-purple-800 font-medium">{customer.mobile}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Link
                  href="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#251b5c] text-white font-bold text-xs"
                >
                  Portal
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logoutCustomer()
                  }}
                  className="p-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <Link
            href="/#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#1e3a8a] hover:bg-blue-50"
          >
            Tests &amp; Profiles
          </Link>
          <Link
            href="/#why-choose-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#1e3a8a] hover:bg-blue-50"
          >
            About
          </Link>
          <Link
            href="/cra"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#1e3a8a] hover:bg-blue-50"
          >
            Become a CRA
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-[#1e3a8a] hover:bg-blue-50"
          >
            Contact
          </Link>

          {!showCustomerLoggedIn && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-3 rounded-xl bg-[#1e3a8a] text-white text-center font-bold text-xs hover:bg-[#172554] transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}

    </header>
  )
}
