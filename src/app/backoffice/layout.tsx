"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Building2, 
  Users, 
  Layers, 
  Inbox, 
  FileSpreadsheet, 
  Coins, 
  CheckCircle2, 
  Sliders, 
  Globe, 
  Repeat, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ClipboardList
} from "lucide-react"

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Executive Dashboard", href: "/backoffice", icon: BarChart3 },
    { name: "CRA Onboarding Queue", href: "/backoffice?tab=onboarding", icon: Users },
    { name: "CRA Hierarchy (C1/C2)", href: "/backoffice?tab=hierarchy", icon: Layers },
    { name: "Central Lead Inbox (<24h)", href: "/backoffice?tab=leads", icon: Inbox },
    { name: "RR & Incentive Engine", href: "/backoffice?tab=incentives", icon: Coins },
    { name: "Payout Reconciliation", href: "/backoffice?tab=payouts", icon: FileSpreadsheet },
    { name: "Catalogue & Price Rules", href: "/backoffice?tab=catalogue", icon: Sliders },
    { name: "Legacy / GCC Flagging", href: "/backoffice?tab=legacy", icon: Globe },
    { name: "Quarterly Retention Engine", href: "/backoffice?tab=retention", icon: Repeat },
  ]

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans text-slate-800 flex flex-col selection:bg-[#382685] selection:text-white">
      
      {/* Top Admin Header */}
      <header className="h-16 bg-[#1e1b4b] text-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        
        {/* Left: Logo & Portal Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs"
              className="h-10 w-auto bg-white px-2 py-0.5 rounded-lg object-contain"
            />
          </Link>
          
          <div className="hidden sm:block pl-3 border-l border-white/20">
            <span className="text-[10px] font-mono text-cyan-300 font-black uppercase tracking-wider block">
              CONSOLE 03
            </span>
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Central Back Office &amp; Operations
            </span>
          </div>
        </div>

        {/* Right: Quick Links to CRA & Customer Portals + Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/cra/dashboard"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-200 border border-white/15 transition-colors"
          >
            <span>Switch to CRA Portal →</span>
          </Link>

          <Link
            href="/customer/dashboard"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-200 border border-white/15 transition-colors"
          >
            <span>Customer View →</span>
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-white/15">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
              BO
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">Operations Admin</div>
              <div className="text-[10px] text-blue-200 font-medium">BDE / Finance Console</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>

      {/* Admin Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        AVMLabs Diagnostics • Internal Back Office Console • B2C Client Referral Agency Model Build
      </footer>
    </div>
  )
}
