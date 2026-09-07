"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import {
  LayoutDashboard,
  Users,
  Users2,
  UserPlus,
  Network,
  Wallet,
  Sparkles,
  LogOut,
  X,
  ClipboardList,
  ShieldCheck,
  FlaskConical,
  FileSpreadsheet,
  Headphones,
  Bell,
  HeartHandshake,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

interface CRASidebarProps {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
  desktopOpen?: boolean
  setDesktopOpen?: (open: boolean) => void
}

export function CRASidebar({ 
  mobileOpen = false, 
  setMobileOpen,
  desktopOpen = true,
  setDesktopOpen
}: CRASidebarProps) {
  const pathname = usePathname()
  const { currentUser } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    name: string
    top: number
    isActive?: boolean
  } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentUserName = mounted ? currentUser.name : "THURAKA SREERAM"
  const isC1 = mounted ? currentUser.role === "c1" : true

  const navigationItems = [
    { name: "Home Dashboard", href: "/cra/dashboard", icon: LayoutDashboard },
    { name: "Make My Profile", href: "/cra/dashboard/make-my-profile", icon: Sparkles },
    { name: "Family Beneficiaries", href: "/cra/dashboard/beneficiaries", icon: Users },
    { name: "Add Referral", href: "/cra/dashboard/add-lead", icon: UserPlus },
    { name: "My Leads & Status", href: "/cra/dashboard/referrals", icon: ClipboardList },
    { name: "My Team (Secondary CRAs)", href: "/cra/dashboard/network", icon: Network },
    { name: "Wellness Catalogue", href: "/cra/dashboard/catalog", icon: FlaskConical },
    { name: "Earnings Statement", href: "/cra/dashboard/wallet", icon: Wallet },
    { name: "Payout History", href: "/cra/dashboard/payouts", icon: FileSpreadsheet },
    { name: "Client Reminders", href: "/cra/dashboard/reminders", icon: HeartHandshake },
    { name: "Notifications", href: "/cra/dashboard/notifications", icon: Bell },
    { name: "Profile & KYC", href: "/cra/dashboard/profile", icon: ShieldCheck },
    { name: "Help & How-it-Works", href: "/cra/dashboard/help", icon: Headphones },
  ]

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false)
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP FIXED SIDEBAR (Collapsible to Slim Icon Rail)                      */}
      {/* ========================================================================= */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 top-0 z-40 shadow-xs transition-all duration-300 ease-in-out ${
        desktopOpen ? "w-64" : "w-[72px]"
      }`}>
        {/* Desktop Header */}
        <div className={`h-16 flex items-center border-b border-slate-100/90 bg-white transition-all ${
          desktopOpen ? "px-4 justify-start" : "px-2 justify-center"
        }`}>
          {desktopOpen ? (
            <Link href="/cra/dashboard" className="inline-block hover:scale-102 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avmlabs-logo.svg"
                alt="AVMLabs Diagnostics"
                className="h-14 w-auto max-w-[170px] object-contain"
              />
            </Link>
          ) : (
            <Link
              href="/cra/dashboard"
              className="flex items-center justify-center p-1 rounded-xl hover:bg-slate-50 transition-all group"
              title="AVM Labs Diagnostics"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/AVMLabs-Favco.png"
                alt="AVM Labs Diagnostics"
                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform drop-shadow-2xs"
              />
            </Link>
          )}
        </div>

        {/* Navigation list */}
        <div 
          onScroll={() => setHoveredTooltip(null)}
          className={`flex-1 overflow-y-auto thin-scrollbar py-3 space-y-4 ${
            desktopOpen ? "px-3" : "px-0"
          }`}
        >
          {desktopOpen ? (
            /* EXPANDED VIEW */
            <div>
              <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                CRA Partner Portal
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold transition-all group ${
                        isActive
                          ? "bg-[#1e3a8a] text-white shadow-sm shadow-blue-950/20"
                          : "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400 group-hover:text-slate-600 stroke-[2]"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          ) : (
            /* COLLAPSED ICON RAIL (Matches user's screenshot) */
            <nav className="flex flex-col items-center space-y-2 w-full">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <div 
                    key={item.name} 
                    className="relative w-full flex items-center"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setHoveredTooltip({
                        name: item.name,
                        top: rect.top + rect.height / 2,
                        isActive
                      })
                    }}
                    onMouseLeave={() => setHoveredTooltip(null)}
                  >
                    {/* Active Left Indicator & Curved Tab Background */}
                    {isActive ? (
                      <div className="w-full flex items-center relative">
                        {/* Orange Accent Vertical Bar on Left Edge */}
                        <div className="absolute left-0 top-0.5 bottom-0.5 w-1.5 bg-orange-600 rounded-r-md z-20" />
                        
                        {/* Curved Peach / Warm Cream Background Tab */}
                        <Link
                          href={item.href}
                          className="w-full mr-2 ml-0 pl-4 py-2.5 bg-gradient-to-r from-orange-100/90 to-amber-100/80 rounded-r-2xl flex items-center justify-center text-orange-600 shadow-2xs transition-all"
                        >
                          <item.icon className="h-5 w-5 stroke-[2.5] text-orange-600" />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        <item.icon className="h-5 w-5 stroke-[2]" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-100 bg-slate-50/90" suppressHydrationWarning>
          {desktopOpen ? (
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0">
                  {currentUserName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUserName}</p>
                  <p className="text-[10.5px] text-slate-500 font-medium truncate">Partner Agent</p>
                </div>
              </div>

              <Link
                href="/login"
                title="Logout"
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div 
              className="py-3 flex flex-col items-center gap-2.5 relative"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredTooltip({
                  name: `${currentUserName} (Partner Agent)`,
                  top: rect.top + rect.height / 2,
                  isActive: false
                })
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
            >
              <Link
                href="/cra/dashboard/profile"
                className="h-9 w-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 hover:ring-blue-900/30 transition-all cursor-pointer"
              >
                {currentUserName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* High-Performance Fixed Floating Tooltip for Collapsed Sidebar */}
      {!desktopOpen && hoveredTooltip && (
        <div 
          className="hidden lg:flex fixed left-[78px] z-[9999] pointer-events-none items-center -translate-y-1/2 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: `${hoveredTooltip.top}px` }}
        >
          {/* Subtle Left-Pointing Arrow Pointer */}
          <div className="w-2 h-2 rotate-45 bg-slate-900 border-l border-b border-white/10 -mr-1 z-10" />
          
          {/* Tooltip Content Box */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-white/10 whitespace-nowrap">
            <span className="tracking-wide">{hoveredTooltip.name}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MODAL                                                       */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={closeMobile}
          />

          <div className="relative flex-1 flex flex-col max-w-[310px] w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <Link href="/cra/dashboard" onClick={closeMobile} className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avmlabs-logo.svg"
                  alt="AVMLabs Diagnostics"
                  className="h-10 w-auto max-w-[140px] object-contain"
                />
              </Link>

              <button
                onClick={closeMobile}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Mini Card */}
            <div
              className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/50 border-b border-slate-100 flex items-center justify-between"
              suppressHydrationWarning
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0">
                  {currentUserName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
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
            <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto scrollbar-hide">
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
                        onClick={closeMobile}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#1e3a8a] text-white shadow-sm shadow-blue-950/20"
                            : "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <item.icon
                          className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400 stroke-[2]"}`}
                        />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

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
                        onClick={closeMobile}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#1e3a8a] text-white shadow-sm shadow-blue-950/20"
                            : "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <item.icon
                          className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400 stroke-[2]"}`}
                        />
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
                onClick={closeMobile}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout from Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
