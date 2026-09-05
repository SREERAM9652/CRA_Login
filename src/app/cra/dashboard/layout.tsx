"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  LayoutDashboard, 
  Users2, 
  Wallet, 
  Sparkles, 
  LogOut, 
  Menu, 
  X, 
  ClipboardList,
  ShieldCheck, 
  FlaskConical, 
  FileSpreadsheet, 
  Search, 
  Headphones, 
  Bell, 
  HeartHandshake 
} from "lucide-react"

export default function CRADashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { currentUser } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Safe SSR defaults
  const currentUserName = mounted ? currentUser.name : "THURAKA SREERAM"
  const isC1 = mounted ? currentUser.role === "c1" : true

  // Hydration-stable static navigation items
  const navigationItems = [
    { name: "Home Dashboard", href: "/cra/dashboard", icon: LayoutDashboard },
    { name: "Add Referral", href: "/cra/dashboard/add-lead", icon: Sparkles },
    { name: "My Leads & Status", href: "/cra/dashboard/referrals", icon: ClipboardList },
    { name: "My Team (Secondary CRAs)", href: "/cra/dashboard/network", icon: Users2 },
    { name: "Wellness Catalogue", href: "/cra/dashboard/catalog", icon: FlaskConical },
    { name: "Earnings Statement", href: "/cra/dashboard/wallet", icon: Wallet },
    { name: "Payout History", href: "/cra/dashboard/payouts", icon: FileSpreadsheet },
    { name: "Client Reminders", href: "/cra/dashboard/reminders", icon: HeartHandshake },
    { name: "Notifications", href: "/cra/dashboard/notifications", icon: Bell },
    { name: "Profile & KYC", href: "/cra/dashboard/profile", icon: ShieldCheck },
    { name: "Help & How-it-Works", href: "/cra/dashboard/help", icon: Headphones },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-[#382685] selection:text-white flex flex-col overflow-x-hidden" suppressHydrationWarning>
      
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 top-0 z-40 shadow-xs">
        
        {/* Logo */}
        <div className="h-24 flex items-center justify-center px-4 border-b border-slate-100/90 bg-white">
          <Link href="/" className="inline-block hover:scale-102 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-16 w-auto max-w-[210px] object-contain mix-blend-multiply"
            />
          </Link>
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-4">
          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              CRA Partner Portal
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                      isActive
                        ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-md shadow-indigo-950/15"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#251b5c]"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-cyan-300 stroke-[2.5]" : "text-slate-400 group-hover:text-[#382685] stroke-[2]"
                    }`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        
        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/90" suppressHydrationWarning>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 bg-gradient-to-tr from-indigo-900 to-purple-800">
                {currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUserName}</p>
                <p className="text-[10.5px] text-slate-500 font-medium truncate">
                  Partner Agent
                </p>
              </div>
            </div>
            
            <Link href="/login" title="Logout" className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container (Padded left on desktop, 100% full width on mobile) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 overflow-x-hidden">
        
        {/* Mobile Top Header (Shows Logo + Account User Pill + Hamburger Menu) */}
        <header className="lg:hidden w-full bg-white border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <Link href="/cra/dashboard" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-11 w-auto max-w-[150px] object-contain mix-blend-multiply"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Active User Account Badge on Mobile Header */}
            <Link
              href="/cra/dashboard/profile"
              className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#1e1b4b] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:opacity-90 transition-opacity"
              title="View your account & KYC profile"
              suppressHydrationWarning
            >
              {currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </Link>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200/80 px-6 items-center justify-between sticky top-0 z-30 shadow-2xs">
          
          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, phone or order ID..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
            />
          </div>

          {/* Right Quick Badges */}
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <a
              href="tel:18001234567"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs"
            >
              <Headphones className="h-3.5 w-3.5 text-[#382685]" />
              <span>1800 123 4567</span>
            </a>

            <div className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="h-2 w-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </div>

            {/* Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200" suppressHydrationWarning>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">{currentUserName}</div>
                <div className="text-[10.5px] text-slate-500 font-medium">
                  Partner Agent
                </div>
              </div>

              <div className="h-8 w-8 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs bg-gradient-to-tr from-indigo-950 to-purple-900">
                {currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
            </div>
          </div>

        </header>

        {/* Page Content (Smooth vertical scrolling with safe bottom padding) */}
        <main className="flex-1 p-4 sm:p-6 w-full max-w-full pb-32 lg:pb-8 overflow-x-hidden">
          {children}
        </main>

      </div>

      {/* Premium Mobile Drawer Modal */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          
          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-[310px] w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <Link href="/cra/dashboard" onClick={() => setMobileSidebarOpen(false)} className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="AVMLabs Diagnostics"
                  className="h-10 w-auto max-w-[140px] object-contain mix-blend-multiply"
                />
              </Link>

              <button 
                onClick={() => setMobileSidebarOpen(false)} 
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Mini Card */}
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/50 border-b border-slate-100 flex items-center justify-between" suppressHydrationWarning>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#1e1b4b] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {currentUserName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{currentUserName}</div>
                  <div className="text-[10px] font-semibold text-purple-700 mt-0.5">
                    {isC1 ? "Primary Partner (C1)" : "Secondary CRA (C2)"}
                  </div>
                </div>
              </div>

              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                ₹1,240
              </span>
            </div>
            
            {/* Scrollable Nav List */}
            <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
              
              {/* Group 1: Core Operations */}
              <div>
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Core Workflows
                </div>
                <div className="space-y-1">
                  {navigationItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive 
                            ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-md shadow-indigo-950/15" 
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#251b5c]"
                        }`}
                      >
                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-cyan-300 stroke-[2.5]" : "text-slate-400 stroke-[2]"}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Group 2: Financials & Support */}
              <div>
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Financials &amp; Account
                </div>
                <div className="space-y-1">
                  {navigationItems.slice(5).map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive 
                            ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-md shadow-indigo-950/15" 
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#251b5c]"
                        }`}
                      >
                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-cyan-300 stroke-[2.5]" : "text-slate-400 stroke-[2]"}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50">
              <Link
                href="/login"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout from Portal</span>
              </Link>
            </div>

          </div>
        </div>
      )}

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

    </div>
  )
}
