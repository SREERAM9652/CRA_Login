"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { CRASidebar } from "@/components/layout/CRASidebar"
import { 
  LayoutDashboard, 
  Users, 
  Users2,
  ClipboardList,
  Wallet, 
  Sparkles, 
  Menu, 
  Search, 
  PanelLeftClose,
  PanelLeftOpen,
  User,
  LogOut
} from "lucide-react"

import { ReferralShareModal } from "@/components/cra/ReferralShareModal"

export default function CRADashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { currentUser, orgProfile } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileDropdownOpen])

  useEffect(() => {
    setProfileDropdownOpen(false)
  }, [pathname])

  // Safe SSR defaults
  const currentUserName = mounted ? currentUser.name : "THURAKA SREERAM"
  const avatarInitials = currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("")

  return (
    <div className="min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-blue-600 selection:text-white flex flex-col" suppressHydrationWarning>
      
      {/* Desktop + Mobile CRA Sidebar in one file */}
      <CRASidebar 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen}
        desktopOpen={desktopSidebarOpen}
        setDesktopOpen={setDesktopSidebarOpen}
      />

      {/* Main Container (Padded left on desktop if open, 100% full width if closed) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        desktopSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      }`}>
        
        {/* Mobile Top Header (Shows Logo + Account User Pill + Hamburger Menu) */}
        <header className="lg:hidden w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <Link href="/cra/dashboard" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avmlabs-logo.svg"
              alt="AVMLabs Diagnostics"
              className="h-11 w-auto max-w-[150px] object-contain"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Quick Share on Mobile */}
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="h-8 px-2.5 rounded-xl bg-[#251b5c] text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
              title="Share Referral Link & QR"
            >
              <Sparkles className="h-3 w-3 text-cyan-300" />
              <span>Share</span>
            </button>

            {/* Active User Account Badge on Mobile Header */}
            <Link
              href="/cra/dashboard/profile"
              className="h-8 w-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 hover:opacity-90 transition-opacity"
              title="View your account & KYC profile"
              suppressHydrationWarning
            >
              {avatarInitials}
            </Link>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -mr-1 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#382685] cursor-pointer flex items-center justify-center shrink-0 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Desktop Top Header Bar (Sticky at top) */}
        <header className="hidden lg:flex h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 items-center justify-between sticky top-0 z-30 shadow-xs">
          
          {/* Left: Sidebar Toggle + Search Input */}
          <div className="flex items-center gap-3 max-w-md w-full">
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-[#382685] hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center group shrink-0"
              title={desktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-label={desktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {desktopSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5 group-hover:scale-105 transition-transform" />
              ) : (
                <PanelLeftOpen className="h-5 w-5 text-[#382685] group-hover:scale-105 transition-transform" />
              )}
            </button>

            <div className="relative w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, phone or order ID..."
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
              />
            </div>
          </div>

          {/* Right Quick Badges */}
          <div className="flex items-center gap-3.5" suppressHydrationWarning>
            {/* Quick Share Referral & QR Button */}
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#251b5c] to-[#382685] hover:from-[#1e1b4b] hover:to-[#251b5c] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Share Link &amp; QR</span>
            </button>

            {/* Interactive Profile Menu with Dark Blue Circular Avatar */}
            <div className="relative shrink-0" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-slate-100/90 border border-slate-200/80 transition-all cursor-pointer group"
                aria-expanded={profileDropdownOpen}
                aria-label="Partner Profile Menu"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-900 transition-colors">
                    {currentUserName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Partner Agent
                  </div>
                </div>

                <div className="h-8 w-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0 group-hover:ring-blue-900/30 transition-all">
                  {avatarInitials}
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-100 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0">
                        {avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">{currentUserName}</div>
                        <div className="text-[10.5px] text-slate-500 font-medium truncate">
                          Partner Agent
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/cra/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#1e3a8a]" />
                      <span>CRA Dashboard</span>
                    </Link>
                    <Link
                      href="/cra/dashboard/leads"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <Users className="h-4 w-4 text-[#1e3a8a]" />
                      <span>Lead Management</span>
                    </Link>
                    <Link
                      href="/cra/dashboard/earnings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <Wallet className="h-4 w-4 text-[#1e3a8a]" />
                      <span>Commission &amp; Earnings</span>
                    </Link>
                    <Link
                      href="/cra/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <User className="h-4 w-4 text-[#1e3a8a]" />
                      <span>Account &amp; KYC</span>
                    </Link>
                  </div>

                  <div className="my-1.5 border-t border-slate-100" />

                  <Link
                    href="/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

        </header>

        {/* Page Content (Smooth vertical scrolling with safe bottom padding) */}
        <main className="flex-1 p-4 sm:p-6 w-full max-w-full pb-32 lg:pb-8">
          {children}
        </main>

      </div>

      {/* Modern High-End Mobile Bottom App Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 h-[68px] pb-3 pt-1.5 px-3 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.08)] overflow-visible">
        
        {/* Tab 1: Home */}
        <Link
          href="/cra/dashboard"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/cra/dashboard" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutDashboard className={`h-5 w-5 ${pathname === "/cra/dashboard" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${pathname === "/cra/dashboard" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Home
          </span>
          {pathname === "/cra/dashboard" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

        {/* Tab 2: Leads & Status */}
        <Link
          href="/cra/dashboard/referrals"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/cra/dashboard/referrals" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ClipboardList className={`h-5 w-5 ${pathname === "/cra/dashboard/referrals" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${pathname === "/cra/dashboard/referrals" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Leads
          </span>
          {pathname === "/cra/dashboard/referrals" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

        {/* Tab 3: Center Elevated Refer CTA */}
        <Link
          href="/cra/dashboard/add-lead"
          className="flex flex-col items-center justify-center -mt-6 group active:scale-95 transition-transform"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] via-[#251b5c] to-[#382685] text-white shadow-lg shadow-indigo-950/30 flex items-center justify-center border-2 border-white ring-4 ring-slate-100 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-cyan-300 stroke-[2.5]" />
          </div>
          <span className="text-[10px] leading-none font-black text-[#251b5c] mt-1">
            + Refer
          </span>
        </Link>

        {/* Tab 4: Earnings */}
        <Link
          href="/cra/dashboard/wallet"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/cra/dashboard/wallet" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Wallet className={`h-5 w-5 ${pathname === "/cra/dashboard/wallet" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${pathname === "/cra/dashboard/wallet" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Earnings
          </span>
          {pathname === "/cra/dashboard/wallet" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

        {/* Tab 5: Team */}
        <Link
          href="/cra/dashboard/network"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/cra/dashboard/network"
              ? "text-[#251b5c]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users2 className={`h-5 w-5 ${pathname === "/cra/dashboard/network" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${
            pathname === "/cra/dashboard/network"
              ? "font-extrabold text-[#251b5c]"
              : "font-medium"
          }`}>
            My Team
          </span>
          {pathname === "/cra/dashboard/network" && (
            <span className="h-1 w-1 rounded-full bg-[#251b5c]" />
          )}
        </Link>

      </nav>

      {/* Referral Link & QR Code Modal */}
      <ReferralShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        craName={currentUserName}
        craCode={currentUser.code}
        orgName={orgProfile?.brandName}
      />

    </div>
  )
}