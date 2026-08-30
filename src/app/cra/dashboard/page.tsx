"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWorkflowStore, DEFAULT_C1 } from "@/lib/workflow-store"
import { 
  Plus, 
  List, 
  Users, 
  CreditCard, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Headphones,
  ShieldCheck,
  Building2,
  Calendar,
  Network
} from "lucide-react"

export default function CRADashboardOverview() {
  const { currentUser, orders, getUserWallet } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Safe SSR defaults to eliminate hydration mismatches
  const userName = mounted ? currentUser.name : DEFAULT_C1.name
  const userRole = mounted ? currentUser.role : DEFAULT_C1.role
  const userCode = mounted ? currentUser.code : DEFAULT_C1.code
  const userCity = mounted ? (currentUser.city || "Hyderabad") : "Hyderabad"
  const userIntroducer = mounted ? currentUser.c1Name : undefined
  const isC1 = userRole === "c1"

  const wallet = getUserWallet(currentUser.id)

  return (
    <div className="w-full font-sans space-y-4" suppressHydrationWarning>
      
      {/* 1. Account Identity & Welcome Card (Visible on Mobile & Desktop) */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#251b5c] to-[#382685] rounded-3xl p-3.5 sm:p-5 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3" suppressHydrationWarning>
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 z-10 min-w-0" suppressHydrationWarning>
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-mono font-black text-sm sm:text-base text-cyan-300 shadow-inner shrink-0" suppressHydrationWarning>
            {userName.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>

          <div className="min-w-0" suppressHydrationWarning>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-white truncate" suppressHydrationWarning>
                {userName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0" suppressHydrationWarning>
                {isC1 ? "Primary Partner (C1)" : "Secondary CRA (C2)"}
              </span>
            </div>

            <div className="text-[10.5px] sm:text-[11px] text-blue-200 font-medium mt-0.5 flex items-center gap-1.5 sm:gap-2 flex-wrap truncate" suppressHydrationWarning>
              <span>Code: <strong className="font-mono text-white font-bold">{userCode}</strong></span>
              <span>•</span>
              <span className="text-slate-300">{userCity}, India</span>
            </div>
          </div>
        </div>

        {/* Quick Profile Actions */}
        <div className="flex items-center gap-2 z-10 shrink-0 pt-0.5 sm:pt-0">
          <Link
            href="/cra/dashboard/profile"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] sm:text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
            <span>KYC Verified</span>
          </Link>
          <Link
            href="/cra/dashboard/add-lead"
            className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[11px] sm:text-xs font-black inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Refer Lead</span>
          </Link>
        </div>
      </div>

      {/* C2 Introducer Banner (if C2) */}
      {!isC1 && mounted && userIntroducer && (
        <div className="p-3 sm:p-3.5 bg-purple-50/90 border border-purple-200 rounded-2xl flex items-center justify-between gap-2.5 text-xs text-purple-950 font-medium animate-in fade-in" suppressHydrationWarning>
          <div className="flex items-center gap-2 min-w-0">
            <Network className="h-4 w-4 text-[#382685] shrink-0" />
            <span className="truncate">Introduced into AVM Labs by <strong>{userIntroducer}</strong></span>
          </div>
          <span className="text-[10px] sm:text-[10.5px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200 shrink-0">
            2-Level Partner
          </span>
        </div>
      )}

      {/* 2. THIS MONTH Card (Clean 3-Column Compact Grid on Mobile & Desktop) */}
      <div className="bg-[#f9fafb] border border-slate-200/90 rounded-3xl p-3.5 sm:p-5 space-y-2.5 shadow-2xs" suppressHydrationWarning>
        <div className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
          THIS MONTH
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* RR Generated */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between space-y-0.5 shadow-2xs" suppressHydrationWarning>
            <div className="font-mono font-bold text-sm sm:text-2xl text-slate-900 truncate">
              ₹{wallet.totalRealizedRevenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
              RR generated
            </div>
          </div>

          {/* My Incentive */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between space-y-0.5 shadow-2xs" suppressHydrationWarning>
            <div className="font-mono font-bold text-sm sm:text-2xl text-[#2F5FDE] truncate">
              ₹{wallet.totalIncentive.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight truncate">
              {wallet.overrideIncentive > 0 ? "30% + 10% bonus" : "30% direct"}
            </div>
          </div>

          {/* Active Leads */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between space-y-0.5 shadow-2xs" suppressHydrationWarning>
            <div className="font-mono font-bold text-sm sm:text-2xl text-slate-900 truncate">
              {wallet.transactions.length > 0 ? wallet.transactions.length : (isC1 ? 6 : 3)}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
              Active leads
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Grid (4 Columns on Desktop, 2 Columns on Mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Refer a Customer */}
        <Link
          href="/cra/dashboard/add-lead"
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F5FDE] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="font-bold text-xs sm:text-sm text-slate-900">
            Refer a Customer
          </div>
        </Link>

        {/* My Customers */}
        <Link
          href="/cra/dashboard/referrals"
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F5FDE] flex items-center justify-center group-hover:scale-105 transition-transform">
            <List className="h-5 w-5 stroke-[2]" />
          </div>
          <div className="font-bold text-xs sm:text-sm text-slate-900">
            My Customers
          </div>
        </Link>

        {/* My Team (C1 / Sai Mahendra) or Help & Support */}
        {isC1 || userName === "SAI MAHENDRA" ? (
          <Link
            href="/cra/dashboard/network"
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#382685] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-900">
              My Team (10% Override)
            </div>
          </Link>
        ) : (
          <Link
            href="/cra/dashboard/help"
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F5FDE] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Headphones className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-900">
              Help &amp; Support
            </div>
          </Link>
        )}

        {/* Earnings */}
        <Link
          href="/cra/dashboard/wallet"
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F5FDE] flex items-center justify-center group-hover:scale-105 transition-transform">
            <CreditCard className="h-5 w-5 stroke-[2]" />
          </div>
          <div className="font-bold text-xs sm:text-sm text-slate-900">
            Earnings
          </div>
        </Link>

      </div>

      {/* 4. Recent Activity */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm text-slate-900">Recent activity</h3>
          <Link
            href="/cra/dashboard/referrals"
            className="text-xs font-bold text-[#2F5FDE] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
          {wallet.transactions.slice(0, 4).map((txn) => {
            const isDirect = txn.type === "Direct 30% Incentive"
            const initials = txn.customerName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "CU"
            
            return (
              <div key={txn.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`h-10 w-10 rounded-full border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isDirect 
                      ? "bg-slate-100 border-slate-200 text-slate-700" 
                      : "bg-purple-100 border-purple-200 text-[#382685]"
                  }`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">{txn.customerName}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {isDirect ? "Direct Referral • Diagnostic Test" : `via Secondary Team (${txn.customerName.includes("(") ? txn.customerName.split("(")[1].replace(")", "") : "Team Partner"})`}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-mono font-black text-sm ${isDirect ? "text-emerald-700" : "text-purple-700"}`}>
                    +₹{txn.incentiveAmount}
                  </div>
                  <div className={`text-[10.5px] font-bold ${isDirect ? "text-emerald-600" : "text-purple-700"}`}>
                    {isDirect ? `30% Direct (RR ₹${txn.realizedRevenue})` : `10% Team Bonus (RR ₹${txn.realizedRevenue})`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
