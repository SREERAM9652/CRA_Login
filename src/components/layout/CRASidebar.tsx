"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import {
  LayoutDashboard,
  Users2,
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
} from "lucide-react"

interface CRASidebarProps {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
}

export function CRASidebar({ mobileOpen = false, setMobileOpen }: CRASidebarProps) {
  const pathname = usePathname()
  const { currentUser } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentUserName = mounted ? currentUser.name : "THURAKA SREERAM"
  const isC1 = mounted ? currentUser.role === "c1" : true

  const navigationItems = [
    { name: "Home Dashboard", href: "/cra/dashboard", icon: LayoutDashboard },
    { name: "Make My Profile", href: "/cra/dashboard/make-my-profile", icon: Sparkles },
    { name: "Family Beneficiaries", href: "/cra/dashboard/beneficiaries", icon: Users2 },
    { name: "Add Referral", href: "/cra/dashboard/add-lead", icon: ClipboardList },
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

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false)
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP FIXED SIDEBAR                                                     */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 top-0 z-40 shadow-xs">
        {/* Logo */}
        <div className="py-2 px-3 flex items-center justify-center border-b border-slate-100/90 bg-white">
          <Link href="/" className="inline-block hover:scale-102 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avmlabs-logo.svg"
              alt="AVMLabs Diagnostics"
              className="h-[76px] w-auto max-w-[225px] object-contain"
            />
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto pt-2.5 pb-5 px-3 space-y-4">
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
        </div>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/90" suppressHydrationWarning>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 bg-gradient-to-tr from-indigo-900 to-purple-800">
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
        </div>
      </aside>

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
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#1e1b4b] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
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
            <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
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
