"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Bell, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  Activity,
  Check,
  Package,
  UserCheck,
  Users2,
  Sparkles,
  ClipboardList
} from "lucide-react"

export interface NotificationItem {
  id: string
  type: "payout" | "lead" | "override" | "catalog"
  badgeText: string
  title: string
  description: string
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "payout" | "lead" | "catalog">("all")

  const notifications: NotificationItem[] = [
    {
      id: "NOTIF-01",
      type: "payout",
      badgeText: "Incentive Credited",
      title: "Direct Incentive Credited (+₹240)",
      description: "Anita Rao completed online payment for Full Body Wellness Panel. ₹240 cash incentive added to your wallet balance.",
      timestamp: "10 mins ago",
      read: false
    },
    {
      id: "NOTIF-02",
      type: "lead",
      badgeText: "Sample Collected",
      title: "Home Sample Collected for Divya Pillai",
      description: "Phlebotomist Ravi Kumar collected home blood sample for Order #ORD-9102. Test processing started at central lab.",
      timestamp: "1 hr ago",
      read: false
    },
    {
      id: "NOTIF-03",
      type: "override",
      badgeText: "Team Override",
      title: "10% Team Override Bonus (+₹80)",
      description: "Priya Shah (C2 Partner) successfully onboarded client Karan Joshi. 10% override credited to your account.",
      timestamp: "3 hrs ago",
      read: true
    },
    {
      id: "NOTIF-04",
      type: "catalog",
      badgeText: "New Package",
      title: "Vitamin Vitality Duo Added to Catalogue",
      description: "Vitamin Vitality Duo (D3 + B12) is now live in your catalogue at ₹800 discounted price (MRP ₹1,000).",
      timestamp: "Yesterday",
      read: true
    }
  ]

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "payout") return n.type === "payout" || n.type === "override"
    if (filter === "lead") return n.type === "lead"
    if (filter === "catalog") return n.type === "catalog"
    return true
  })

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Activity &amp; Incentive Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Instant updates on customer payments, lead milestones, team earnings, and new packages
          </p>
        </div>

        <Link
          href="/cra/dashboard"
          className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <span>Back to Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "all" ? "bg-[#2F5FDE] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("payout")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "payout" ? "bg-[#2F5FDE] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Incentive Payouts
        </button>
        <button
          type="button"
          onClick={() => setFilter("lead")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "lead" ? "bg-[#2F5FDE] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Lead Milestones
        </button>
        <button
          type="button"
          onClick={() => setFilter("catalog")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "catalog" ? "bg-[#2F5FDE] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Catalogue Updates
        </button>
      </div>

      {/* Structured Full-Width Notifications List */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.map((n) => {
          const isPayout = n.type === "payout"
          const isOverride = n.type === "override"
          const isLead = n.type === "lead"

          return (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.read ? "bg-blue-50/25" : "hover:bg-slate-50/70"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {/* Modern Crisp Icon Badge */}
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs border ${
                    isPayout
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                      : isOverride
                      ? "bg-purple-50 text-[#382685] border-purple-200/80"
                      : isLead
                      ? "bg-blue-50 text-[#2F5FDE] border-blue-200/80"
                      : "bg-amber-50 text-amber-700 border-amber-200/80"
                  }`}
                >
                  {isPayout ? (
                    <IndianRupee className="h-5 w-5" />
                  ) : isOverride ? (
                    <Users2 className="h-5 w-5" />
                  ) : isLead ? (
                    <UserCheck className="h-5 w-5" />
                  ) : (
                    <Package className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {n.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isPayout
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : isOverride
                          ? "bg-purple-50 text-purple-900 border-purple-200"
                          : isLead
                          ? "bg-blue-50 text-[#2F5FDE] border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {n.badgeText}
                    </span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-[#2F5FDE] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {n.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 font-mono text-[11px] text-slate-400 self-start mt-0.5">
                {n.timestamp}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
