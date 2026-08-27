"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  UserPlus, 
  ClipboardList, 
  FlaskConical, 
  Users2, 
  FileSpreadsheet,
  Headphones, 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react"

export default function CRADashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navigationItems = [
    { name: "Dashboard Overview", href: "/cra/dashboard", icon: LayoutDashboard },
    { name: "Book for a Customer", href: "/cra/dashboard/add-lead", icon: UserPlus },
    { name: "My Customer Bookings", href: "/cra/dashboard/referrals", icon: ClipboardList },
    { name: "Test Prices & Earnings", href: "/cra/dashboard/catalog", icon: FlaskConical },
    { name: "Price Estimator & PDF", href: "/cra/dashboard/estimate", icon: FileSpreadsheet },
    { name: "My Partner Team", href: "/cra/dashboard/network", icon: Users2 },
  ]

  return (
    <div className="flex min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-[#382685] selection:text-white">
      
      {/* Desktop Fixed Sidebar (Identical Clean White Theme like Customer Dashboard) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 z-50 shadow-xs">
        
        {/* Logo - Prominently Enlarged and Centered */}
        <div className="h-24 flex items-center justify-center px-4 border-b border-slate-100/90 bg-white">
          <Link href="/" className="inline-block hover:scale-102 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-18 w-auto max-w-[195px] object-contain mix-blend-multiply"
            />
          </Link>
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6">
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
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all group ${
                      isActive
                        ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-lg shadow-indigo-950/15"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#251b5c]"
                    }`}
                  >
                    <item.icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-cyan-300 stroke-[2.5]" : "text-slate-400 group-hover:text-[#382685] stroke-[2]"
                    }`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        
        {/* User Card Profile Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RJ
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">Rajesh J.</p>
                <p className="text-[10.5px] text-emerald-700 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Direct Agent (Earn 30%)
                </p>
              </div>
            </div>
            <Link href="/login" title="Logout" className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
              <Link href="/" className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="AVMLabs Diagnostics"
                  className="h-12 w-auto object-contain mix-blend-multiply"
                />
              </Link>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold ${
                    pathname === item.href ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link href="/" className="block py-2 text-xs text-slate-600 font-bold">
                  ← Back to AVMLabs Home
                </Link>
                <Link href="/login" className="block py-2 text-xs text-rose-600 font-bold">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Top Search */}
            <div className="relative hidden sm:block w-72 md:w-96">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search referred customer, phone or order ID..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Support Helpline */}
            <a
              href="tel:18001234567"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#382685] transition-colors bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200"
            >
              <Headphones className="h-3.5 w-3.5 text-[#382685]" />
              <span>1800 123 4567</span>
            </a>

            {/* Notification Bell with alert dot */}
            <div className="relative">
              <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors relative cursor-pointer">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#e04838] ring-2 ring-white" />
              </button>
            </div>

            {/* CRA Partner status badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-slate-900">Rajesh J.</div>
                <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Direct Agent • Earn 30%
                </div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RJ
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  )
}
