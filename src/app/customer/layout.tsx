"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { CustomerSidebar } from "@/components/layout/CustomerSidebar"
import { 
  Headphones, 
  Menu,
  LayoutDashboard,
  ClipboardList,
  Sparkles,
  FileText,
  Users
} from "lucide-react"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { customer } = useWorkflowStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const customerName = customer?.name || "Suresh M."
  const avatarInitials = customerName.split(" ").map(n => n[0]).slice(0, 2).join("")

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-[#382685] selection:text-white overflow-x-hidden">
      
      {/* Customer Sidebar (Desktop + Mobile Drawer in one file) */}
      <CustomerSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

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
              src="/avmlabs-logo.svg"
              alt="AVMLabs Diagnostics"
              className="h-13 w-auto max-w-[170px] object-contain"
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