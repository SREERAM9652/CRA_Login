"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { CustomerSidebar } from "@/components/layout/CustomerSidebar"
import { 
  Menu,
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  FileText,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  HelpCircle
} from "lucide-react"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { customer, logoutCustomer } = useWorkflowStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  const customerName = customer?.name || "Suresh M."
  const avatarInitials = customerName.split(" ").map(n => n[0]).slice(0, 2).join("")

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        desktopDropdownRef.current && !desktopDropdownRef.current.contains(target) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)
      ) {
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

  const handleLogout = () => {
    setProfileDropdownOpen(false)
    logoutCustomer()
    router.push("/login?role=customer")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      
      {/* Customer Sidebar (Desktop + Mobile Drawer in one file) */}
      <CustomerSidebar 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen}
        desktopOpen={desktopSidebarOpen}
        setDesktopOpen={setDesktopSidebarOpen}
      />

      {/* ========================================================================= */}
      {/* MAIN CONTAINER (Padded left on desktop if open, 100% full width if closed)*/}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        desktopSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      }`}>
        
        {/* ======================================================================= */}
        {/* MOBILE TOP HEADER (CLEAN & FLEXIBLE FOR ALL MOBILE SCREENS)              */}
        {/* ======================================================================= */}
        <header className="lg:hidden w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#382685] cursor-pointer flex items-center justify-center shrink-0 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/customer/dashboard" className="inline-block shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avmlabs-logo.svg"
                alt="AVMLabs Diagnostics"
                className="h-10 w-auto max-w-[145px] object-contain"
              />
            </Link>
          </div>
          
          <div className="relative shrink-0" ref={mobileDropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="h-9 w-9 rounded-full bg-[#1e3a8a] hover:bg-[#172554] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 cursor-pointer transition-all active:scale-95"
              aria-label="Patient Profile Menu"
              aria-expanded={profileDropdownOpen}
            >
              {avatarInitials}
            </button>

            {/* Mobile Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-100 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-blue-900/15 shrink-0">
                      {avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{customer?.mobile || "+91 98765 43210"}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/customer/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#1e3a8a]" />
                    <span>My Health Dashboard</span>
                  </Link>
                  <Link
                    href="/customer/dashboard/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <ClipboardList className="h-4 w-4 text-[#1e3a8a]" />
                    <span>Orders &amp; Appointments</span>
                  </Link>

                  <Link
                    href="/customer/dashboard/help"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 text-[#1e3a8a]" />
                    <span>Help &amp; FAQs</span>
                  </Link>
                </div>

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ======================================================================= */}
        {/* DESKTOP TOP HEADER BAR (FLEXIBLE STICKY HEADER WITH PROFILE BUTTON)     */}
        {/* ======================================================================= */}
        <header className="hidden lg:flex h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Sidebar Close/Open Toggle Button */}
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

            <span className="text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
              Customer Portal
            </span>
          </div>

          {/* Interactive Profile Button with Dark Blue Circular Avatar & Dropdown */}
          <div className="relative shrink-0" ref={desktopDropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="p-0.5 rounded-full hover:bg-slate-100/90 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
              aria-expanded={profileDropdownOpen}
              aria-label="Patient Profile Menu"
            >
              <div className="h-9 w-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-900/15 shrink-0 group-hover:ring-blue-900/30 transition-all">
                {avatarInitials}
              </div>
            </button>

            {/* Desktop Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-100 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-blue-900/15 shrink-0">
                      {avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{customer?.mobile || "+91 98765 43210"}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/customer/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#1e3a8a]" />
                    <span>My Health Dashboard</span>
                  </Link>
                  <Link
                    href="/customer/dashboard/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <ClipboardList className="h-4 w-4 text-[#1e3a8a]" />
                    <span>Orders &amp; Appointments</span>
                  </Link>

                  <Link
                    href="/customer/dashboard/help"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 text-[#1e3a8a]" />
                    <span>Help &amp; FAQs</span>
                  </Link>
                </div>

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:px-6 lg:py-5 w-full max-w-full pb-28 lg:pb-8">
          {children}
        </main>

      </div>

      {/* ========================================================================= */}
      {/* MODERN HIGH-END MOBILE BOTTOM APP NAVIGATION BAR (EXACT CRA STYLE)        */}
      {/* ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 h-[68px] pb-3 pt-1.5 px-3 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.08)] overflow-visible">
        
        {/* Tab 1: Home */}
        <Link
          href="/customer/dashboard"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/customer/dashboard" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutDashboard className={`h-5 w-5 ${pathname === "/customer/dashboard" ? "stroke-[2.5] text-[#251b5c]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${pathname === "/customer/dashboard" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Home
          </span>
          {pathname === "/customer/dashboard" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

        {/* Tab 2: Orders & Live Tracking */}
        <Link
          href="/customer/dashboard/orders"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all relative ${
            pathname === "/customer/dashboard/orders" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <ClipboardList className={`h-5 w-5 ${pathname === "/customer/dashboard/orders" ? "stroke-[2.5] text-[#251b5c]" : "stroke-[1.75]"}`} />
            <span className="h-2 w-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white animate-pulse" />
          </div>
          <span className={`text-[10px] leading-none ${pathname === "/customer/dashboard/orders" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Orders
          </span>
          {pathname === "/customer/dashboard/orders" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

        {/* Tab 3: Center Elevated Book Test CTA (Matches CRA +Refer CTA) */}
        <Link
          href="/booking"
          className="flex flex-col items-center justify-center -mt-6 group active:scale-95 transition-transform"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] via-[#251b5c] to-[#382685] text-white shadow-lg shadow-indigo-950/30 flex items-center justify-center border-2 border-white ring-4 ring-slate-100 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-cyan-300 stroke-[2.5]" />
          </div>
          <span className="text-[10px] leading-none font-black text-[#251b5c] mt-1">
            + Book Test
          </span>
        </Link>

        {/* Tab 4: Lab Reports */}
        <Link
          href="/customer/dashboard/reports"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/customer/dashboard/reports" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FileText className={`h-5 w-5 ${pathname === "/customer/dashboard/reports" ? "stroke-[2.5] text-[#251b5c]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${pathname === "/customer/dashboard/reports" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Reports
          </span>
          {pathname === "/customer/dashboard/reports" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

        {/* Tab 5: Family Members */}
        <Link
          href="/customer/dashboard/beneficiaries"
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
            pathname === "/customer/dashboard/beneficiaries" ? "text-[#251b5c]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users className={`h-5 w-5 ${pathname === "/customer/dashboard/beneficiaries" ? "stroke-[2.5] text-[#251b5c]" : "stroke-[1.75]"}`} />
          <span className={`text-[10px] leading-none ${pathname === "/customer/dashboard/beneficiaries" ? "font-extrabold text-[#251b5c]" : "font-medium"}`}>
            Family
          </span>
          {pathname === "/customer/dashboard/beneficiaries" && <span className="h-1 w-1 rounded-full bg-[#251b5c]" />}
        </Link>

      </nav>

    </div>
  )
}