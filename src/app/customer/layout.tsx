"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Sparkles
} from "lucide-react"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const navLinks = [
    { name: "My Health Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Find Tests & Book", href: "/booking", icon: Search },
    { name: "Orders & Appointments", href: "/customer/dashboard#orders", icon: ClipboardList },
    { name: "Digital Lab Reports", href: "/customer/dashboard#reports", icon: FileText },
  ]

  return (
    <div className="flex min-h-screen bg-[#f8f9fd] font-sans text-slate-800 selection:bg-[#382685] selection:text-white">
      
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 z-50 shadow-xs">
        
        {/* Logo - Direct Clean Presentation (Enlarged) */}
        <div className="h-24 flex items-center justify-start px-5 border-b border-slate-100/90">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-16 w-auto max-w-[200px] object-contain mix-blend-multiply"
            />
          </Link>
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6">
          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Healthcare Portal
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-md shadow-indigo-950/15"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#251b5c]"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Account & Help
            </div>
            <nav className="space-y-1">
              <Link
                href="/customer/dashboard"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Patient Profile</span>
              </Link>
              <Link
                href="/customer/dashboard"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Saved Addresses</span>
              </Link>
              <Link
                href="/#faq"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Help & FAQs</span>
              </Link>
              <Link
                href="/cra"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-accent hover:bg-accent/10 transition-colors mt-2"
              >
                <Sparkles className="h-4 w-4 text-accent" />
                <span>CRA Partner (30% RR)</span>
              </Link>
            </nav>
          </div>
        </div>
        
        {/* User Footer Profile */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                SM
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">Suresh M.</p>
                <p className="text-[10px] text-slate-500 font-mono">#AVM-PT-981</p>
              </div>
            </div>
            <Link
              href="/login"
              title="Logout"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors"
            >
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
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
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
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <item.icon className="h-4 w-4 text-[#382685]" />
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

      {/* Main Container */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#251b5c]">
                My Health Dashboard
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Award className="h-3 w-3" /> NABL Accredited
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:18001234567"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#382685] transition-colors bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200"
            >
              <Headphones className="h-3.5 w-3.5 text-[#382685]" />
              <span>1800 123 4567</span>
            </a>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900">Suresh M.</div>
                <div className="text-[10px] text-slate-400">Bengaluru • Indiranagar</div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                SM
              </div>
            </div>
          </div>

        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  )
}
