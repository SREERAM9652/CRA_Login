"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  MapPin, 
  User, 
  LogOut, 
  Search, 
  HelpCircle, 
  Headphones, 
  Menu, 
  X,
  Activity,
  Award,
  Sparkles,
  Users,
  Wallet,
  Upload,
  Bell,
  Clock
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

  const handleLogout = () => {
    logoutCustomer()
    router.push("/login?role=customer")
  }

  const navLinks = [
    { name: "My Health Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Find Tests & Book", href: "/booking", icon: Search },
    { name: "Orders & Appointments", href: "/customer/dashboard", icon: ClipboardList },
    { name: "Digital Lab Reports", href: "/customer/dashboard", icon: FileText },
  ]

  const customerName = customer?.name || "Suresh M."
  const avatarInitials = customerName.split(" ").map(n => n[0]).slice(0, 2).join("")

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-[#382685] selection:text-white overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* DESKTOP FIXED SIDEBAR                                                     */}
      {/* ========================================================================= */}
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
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-5">
          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Healthcare Portal
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-md shadow-indigo-950/15"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#251b5c]"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-cyan-300 stroke-[2.5]" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Account &amp; Services
            </div>
            <nav className="space-y-1">
              <Link
                href="/customer/dashboard"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Users className="h-4 w-4 text-slate-400" />
                <span>Family Beneficiaries</span>
              </Link>
              <Link
                href="/customer/dashboard"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Wallet className="h-4 w-4 text-slate-400" />
                <div className="flex items-center justify-between w-full">
                  <span>Wallet &amp; Cashback</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ₹{customer?.walletBalance || 350}
                  </span>
                </div>
              </Link>
              <Link
                href="/cra/dashboard/help"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Help &amp; FAQs</span>
              </Link>
              <Link
                href="/cra"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#382685] bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-colors mt-2"
              >
                <Sparkles className="h-4 w-4 text-[#e04838]" />
                <span>Become a CRA Partner</span>
              </Link>
            </nav>
          </div>
        </div>
        
        {/* User Footer Profile */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {avatarInitials}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{customerName}</p>
                <p className="text-[10px] text-slate-500 font-mono">#AVM-PT-981</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER (Padded left on desktop, 100% full width on mobile)        */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 overflow-x-hidden">
        
        {/* ======================================================================= */}
        {/* MOBILE TOP HEADER (MATCHING CRA DASHBOARD STANDARD)                     */}
        {/* ======================================================================= */}
        <header className="lg:hidden w-full bg-white border-b border-slate-200/90 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <Link href="/customer/dashboard" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-11 w-auto max-w-[150px] object-contain mix-blend-multiply"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            <a
              href="tel:18001234567"
              className="h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 shadow-2xs"
            >
              <Headphones className="h-3 w-3 text-[#382685]" />
              <span>Call</span>
            </a>

            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {avatarInitials}
            </div>

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

        {/* ======================================================================= */}
        {/* DESKTOP TOP HEADER BAR                                                  */}
        {/* ======================================================================= */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200/80 px-6 items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-slate-900 tracking-tight">
              Customer Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:18001234567"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Headphones className="h-3.5 w-3.5 text-[#382685]" />
              <span>1800 123 4567</span>
            </a>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">{customerName}</div>
                <div className="text-[10.5px] text-slate-400">Bengaluru • Indiranagar</div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {avatarInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto pb-28 lg:pb-8 overflow-x-hidden">
          {children}
        </main>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MODAL (MATCHING CRA DASHBOARD STANDARD)                     */}
      {/* ========================================================================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          
          <div className="relative flex-1 flex flex-col max-w-[310px] w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <Link href="/customer/dashboard" onClick={() => setMobileSidebarOpen(false)} className="inline-block">
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
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{customerName}</div>
                  <div className="text-[10px] font-semibold text-purple-700 mt-0.5">
                    Patient #{customer?.id || "AVM-PT-981"}
                  </div>
                </div>
              </div>

              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                Wallet: ₹{customer?.walletBalance || 350}
              </span>
            </div>
            
            {/* Scrollable Nav List */}
            <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
              
              {/* Group 1: Core Navigation */}
              <div>
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Healthcare Services
                </div>
                <div className="space-y-1">
                  {navLinks.map((item) => {
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
                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-cyan-300 stroke-[2.5]" : "text-slate-400"}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Group 2: Account & Family */}
              <div>
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Account &amp; Benefits
                </div>
                <div className="space-y-1">
                  <Link
                    href="/customer/dashboard"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Family Beneficiaries</span>
                  </Link>

                  <Link
                    href="/customer/dashboard"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    <span>Wallet &amp; Coupons (₹{customer?.walletBalance || 350})</span>
                  </Link>

                  <Link
                    href="/cra"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-[#382685] bg-purple-50 hover:bg-purple-100 border border-purple-100 mt-2"
                  >
                    <Sparkles className="h-4 w-4 text-[#e04838]" />
                    <span>CRA Partner Portal</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setMobileSidebarOpen(false)
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
          href="/customer/dashboard"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all relative"
        >
          <div className="relative">
            <ClipboardList className="h-5 w-5 stroke-[1.75]" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-[10px] leading-none font-medium">
            Orders
          </span>
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
          href="/customer/dashboard"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all"
        >
          <FileText className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] leading-none font-medium">
            Reports
          </span>
        </Link>

        {/* Tab 5: Family Members */}
        <Link
          href="/customer/dashboard"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all"
        >
          <Users className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] leading-none font-medium">
            Family
          </span>
        </Link>

      </nav>

    </div>
  )
}
