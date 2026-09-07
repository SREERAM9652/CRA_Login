"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  LogOut,
  Search,
  HelpCircle,
  X,
  Sparkles,
  Users,
  Wallet,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpRight
} from "lucide-react"

interface CustomerSidebarProps {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
  desktopOpen?: boolean
  setDesktopOpen?: (open: boolean) => void
}

export function CustomerSidebar({ 
  mobileOpen = false, 
  setMobileOpen,
  desktopOpen = true,
  setDesktopOpen
}: CustomerSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { customer, logoutCustomer, currentUser } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    name: string
    top: number
    isActive?: boolean
  } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const isCRAPartner = mounted 
    ? Boolean(currentUser?.role === "c1" || currentUser?.role === "c2" || customer?.isConvertedToCRA || currentUser?.hasDualRole)
    : false
  const customerName = mounted ? (customer?.name || currentUser?.name || "Patient") : "Patient"
  const customerId = mounted
    ? (customer?.id?.replace(/^CUST-/, "AVM-PT-") || (currentUser?.role === "c1" ? "AVM-CRA-C1" : currentUser?.role === "c2" ? currentUser.code : "AVM-PT-981"))
    : "AVM-PT-981"
  const walletBalance = mounted ? (customer?.walletBalance ?? 350) : 350

  const handleLogout = () => {
    logoutCustomer()
    router.push("/login?role=customer")
  }

  const navLinks = [
    { name: "My Health Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Find Tests & Book", href: "/booking", icon: Search },
    { name: "Orders & Appointments", href: "/customer/dashboard/orders", icon: ClipboardList },
    { name: "Digital Lab Reports", href: "/customer/dashboard/reports", icon: FileText },
  ]

  const allNavItems = [
    { name: "My Health Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Find Tests & Book", href: "/booking", icon: Search },
    { name: "Orders & Appointments", href: "/customer/dashboard/orders", icon: ClipboardList },
    { name: "Digital Lab Reports", href: "/customer/dashboard/reports", icon: FileText },
    { name: "Family Beneficiaries", href: "/customer/dashboard/beneficiaries", icon: Users },
    { name: "Wallet & Cashback", href: "/customer/dashboard#wallet", icon: Wallet },
    { name: "Help & FAQs", href: "/customer/dashboard/help", icon: HelpCircle },
    {
      name: isCRAPartner ? "CRA Partner Dashboard" : "Refer & Earn",
      href: isCRAPartner ? "/cra/dashboard" : "/customer/dashboard#referral-hub",
      icon: Sparkles,
      highlight: true
    }
  ]

  const avatarInitials = customerName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "PT"

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false)
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP FIXED SIDEBAR (Collapsible to Slim Icon Rail with Buttons)        */}
      {/* ========================================================================= */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 top-0 z-40 shadow-xs transition-all duration-300 ease-in-out ${
        desktopOpen ? "w-64" : "w-[72px]"
      }`}>
        {/* Brand Header */}
        <div className={`flex items-center border-b border-slate-100/90 bg-white transition-all ${
          desktopOpen ? "py-3 px-4 justify-center" : "h-16 px-2 justify-center"
        }`}>
          {desktopOpen ? (
            <Link href="/customer/dashboard" className="inline-flex items-center hover:opacity-90 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avmlabs-logo.svg"
                alt="AVMLabs Diagnostics"
                className="h-[76px] w-auto max-w-[210px] object-contain"
              />
            </Link>
          ) : (
            <Link
              href="/customer/dashboard"
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

        {/* Scrollable Navigation Body */}
        <div 
          onScroll={() => setHoveredTooltip(null)}
          className={`flex-1 overflow-y-auto thin-scrollbar ${
            desktopOpen ? "pt-4 pb-4 px-3.5 space-y-5" : "py-3 px-0 space-y-2"
          }`}
        >
          {desktopOpen ? (
            <div className="space-y-5">
              {/* Section 1: Healthcare Portal */}
              <div>
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Healthcare Portal</span>
                </div>
                <nav className="space-y-1">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm shadow-blue-900/25"
                            : "text-slate-600 hover:text-blue-950 hover:bg-slate-100/80"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400 group-hover:text-blue-600"}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Section 2: Account & Services */}
              <div>
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Account &amp; Services</span>
                </div>
                <nav className="space-y-1">
                  <Link
                    href="/customer/dashboard/beneficiaries"
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      pathname === "/customer/dashboard/beneficiaries"
                        ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm shadow-blue-900/25"
                        : "text-slate-600 hover:text-blue-950 hover:bg-slate-100/80"
                    }`}
                  >
                    <Users className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${pathname === "/customer/dashboard/beneficiaries" ? "text-sky-200 stroke-[2.5]" : "text-slate-400 group-hover:text-blue-600"}`} />
                    <span className="truncate">Family Beneficiaries</span>
                  </Link>

                  <Link
                    href="/customer/dashboard#wallet"
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-950 hover:bg-slate-100/80 transition-all duration-200"
                  >
                    <Wallet className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="truncate">Wallet &amp; Cashback</span>
                  </Link>

                  <Link
                    href="/customer/dashboard/help"
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      pathname === "/customer/dashboard/help"
                        ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm shadow-blue-900/25"
                        : "text-slate-600 hover:text-blue-950 hover:bg-slate-100/80"
                    }`}
                  >
                    <HelpCircle className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${pathname === "/customer/dashboard/help" ? "text-sky-200 stroke-[2.5]" : "text-slate-400 group-hover:text-blue-600"}`} />
                    <span className="truncate">Help &amp; FAQs</span>
                  </Link>
                </nav>

                {/* CRA Partner Switcher / Refer CTA */}
                <div className="pt-3">
                  {isCRAPartner ? (
                    <Link
                      href="/cra/dashboard"
                      className="group relative block p-3 rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#1e3a8a] text-white shadow-md shadow-indigo-950/20 border border-indigo-700/30 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-indigo-950/30 hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Partner Portal</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-white/15 px-1.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-0.5 text-white/90 group-hover:bg-white/25 transition-colors">
                          Switch <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white truncate">
                        CRA Partner Dashboard
                      </div>
                      <div className="text-[10px] text-indigo-200/80 mt-0.5 truncate">
                        Manage leads, network &amp; payouts
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/customer/dashboard#referral-hub"
                      className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/70 text-slate-800 hover:border-blue-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#1e3a8a] truncate">Refer &amp; Earn</div>
                          <div className="text-[10px] text-slate-500 truncate">Become a CRA Partner</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#1e3a8a] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* COLLAPSED ICON RAIL (Buttons for Laptop/Desktop Devices) */
            <nav className="flex flex-col items-center space-y-2 w-full">
              {allNavItems.map((item) => {
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
                        {/* Blue Accent Vertical Bar on Left Edge */}
                        <div className="absolute left-0 top-0.5 bottom-0.5 w-1.5 bg-[#1e3a8a] rounded-r-md z-20" />
                        
                        {/* Curved Active Background Tab */}
                        <Link
                          href={item.href}
                          className="w-full mr-2 ml-0 pl-4 py-2.5 bg-gradient-to-r from-blue-100/90 to-sky-100/80 rounded-r-2xl flex items-center justify-center text-[#1e3a8a] shadow-2xs transition-all"
                        >
                          <item.icon className="h-5 w-5 stroke-[2.5] text-[#1e3a8a]" />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          item.highlight
                            ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            : "text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-100"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${item.highlight ? "stroke-[2.2]" : "stroke-[2]"}`} />
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
          )}
        </div>

        {/* User Footer Profile Dropdown Trigger */}
        <div className={`border-t border-slate-100 bg-slate-50/90 relative z-50 ${desktopOpen ? "p-3" : "p-2"}`} ref={dropdownRef}>
          {/* Dropdown Menu (pops up above footer) */}
          {profileDropdownOpen && (
            <div className={`absolute bottom-full mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              desktopOpen ? "left-3 right-3" : "left-2 w-64"
            }`}>
              <div className="p-2.5 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-100 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0" suppressHydrationWarning>
                    {avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate" suppressHydrationWarning>
                      {customerName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate" suppressHydrationWarning>
                      #{customerId}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/customer/dashboard"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#1e3a8a]" />
                  <span>My Health Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {desktopOpen ? (
            /* Interactive Trigger Card (No border, with chevron up/down) */
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-200/60 active:bg-slate-200/80 transition-all cursor-pointer text-left group"
              aria-expanded={profileDropdownOpen}
              aria-label="User profile menu"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/10 shrink-0" suppressHydrationWarning>
                  {avatarInitials}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-bold text-slate-900 truncate" suppressHydrationWarning>
                    {customerName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate" suppressHydrationWarning>
                    #{customerId}
                  </div>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 ml-1">
                {profileDropdownOpen ? (
                  <ChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <ChevronUp className="h-4 w-4 transition-transform" />
                )}
              </div>
            </button>
          ) : (
            /* Collapsed Profile Button */
            <div 
              className="flex justify-center py-1 relative"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredTooltip({
                  name: `${customerName} (#${customerId})`,
                  top: rect.top + rect.height / 2,
                  isActive: false
                })
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
            >
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 hover:ring-blue-900/30 transition-all cursor-pointer active:scale-95"
                aria-label="User Profile"
                suppressHydrationWarning
              >
                {avatarInitials}
              </button>
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
              <Link href="/customer/dashboard" onClick={closeMobile} className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avmlabs-logo.svg"
                  alt="AVMLabs Diagnostics"
                  className="h-14 w-auto max-w-[180px] object-contain"
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
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-slate-100 flex items-center">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0">
                  {avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{customerName}</div>
                  <div className="text-[10px] font-semibold text-slate-500 font-mono mt-0.5">
                    #{customerId}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Nav List */}
            <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
              <div>
                <div className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Healthcare Services
                </div>
                <div className="space-y-1">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMobile}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm shadow-blue-900/25"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400"}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Account &amp; Benefits
                </div>
                <div className="space-y-1">
                  <Link
                    href="/customer/dashboard/beneficiaries"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === "/customer/dashboard/beneficiaries"
                        ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm shadow-blue-900/25"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Users className={`h-4 w-4 ${pathname === "/customer/dashboard/beneficiaries" ? "text-sky-200" : "text-slate-400"}`} />
                    <span>Family Beneficiaries</span>
                  </Link>

                  <Link
                    href="/customer/dashboard#wallet"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    <span>Wallet &amp; Cashback</span>
                  </Link>

                  <Link
                    href="/customer/dashboard/help"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === "/customer/dashboard/help"
                        ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm shadow-blue-900/25"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <HelpCircle className={`h-4 w-4 shrink-0 ${pathname === "/customer/dashboard/help" ? "text-sky-200 stroke-[2.5]" : "text-slate-400"}`} />
                    <span>Help &amp; FAQs</span>
                  </Link>

                  <div className="pt-2">
                    {isCRAPartner ? (
                      <Link
                        href="/cra/dashboard"
                        onClick={closeMobile}
                        className="group relative block p-3 rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#1e3a8a] text-white shadow-md"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Partner Portal</span>
                          </div>
                          <span className="text-[10px] font-semibold bg-white/15 px-1.5 py-0.5 rounded text-white/90">
                            Switch &rarr;
                          </span>
                        </div>
                        <div className="font-bold text-xs text-white truncate">
                          CRA Partner Dashboard
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/customer/dashboard#referral-hub"
                        onClick={closeMobile}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#1e3a8a] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/70 mt-1"
                      >
                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Refer &amp; Become a CRA</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  handleLogout()
                }}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout from Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

