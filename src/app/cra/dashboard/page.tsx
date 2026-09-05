"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWorkflowStore, DEFAULT_C1, CRA_DISCOUNT_CONFIG } from "@/lib/workflow-store"
import { ReferralShareModal } from "@/components/cra/ReferralShareModal"
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
  Network,
  Share2,
  Copy,
  Check,
  Smartphone,
  QrCode,
  FlaskConical,
  Heart,
  Tag,
  Info
} from "lucide-react"

export default function CRADashboardOverview() {
  const { 
    currentUser, 
    orders, 
    getUserWallet, 
    customProfiles, 
    orgProfile, 
    beneficiaries 
  } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"partner" | "personal">("partner")

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

  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/booking?ref=${userCode}`
    : `https://avmlabs.com/booking?ref=${userCode}`

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! 👋 Book certified diagnostic lab tests with AVM Labs through ${userName} (${orgProfile?.brandName || "AVM Labs Diagnostics"}).\n\n` +
      `🎁 Special Partner Discount: *${CRA_DISCOUNT_CONFIG.customerDiscountPercent}% OFF*\n` +
      `🏠 Free Home Sample Collection & Smart WhatsApp Reports\n\n` +
      `Book now: ${referralUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  return (
    <div className="w-full font-sans space-y-4" suppressHydrationWarning>
      
      {/* 1. Account Identity & Welcome Card */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#251b5c] to-[#382685] rounded-3xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4" suppressHydrationWarning>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10 min-w-0" suppressHydrationWarning>
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-mono font-black text-sm sm:text-base text-cyan-300 shadow-inner shrink-0" suppressHydrationWarning>
            {userName.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>

          <div className="min-w-0" suppressHydrationWarning>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-white truncate" suppressHydrationWarning>
                {userName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0" suppressHydrationWarning>
                {isC1 ? "Primary Partner (C1)" : "Secondary CRA (C2)"}
              </span>
            </div>

            <div className="text-[11px] text-blue-200 font-medium mt-0.5 flex items-center gap-2 flex-wrap truncate" suppressHydrationWarning>
              <span>Code: <strong className="font-mono text-white font-bold">{userCode}</strong></span>
              <span>•</span>
              <span className="text-slate-300">{orgProfile?.brandName || `${userCity}, India`}</span>
            </div>
          </div>
        </div>

        {/* Quick Profile Actions */}
        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5 text-cyan-300" />
            <span>QR Flyer</span>
          </button>
          <Link
            href="/cra/dashboard/add-lead"
            className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ Refer Lead</span>
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

      {/* ========================================================================= */}
      {/* 2. DEDICATED REFERRAL LINK & MULTI-CHANNEL SHARING HERO CARD               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-white to-indigo-50/40 border border-indigo-100 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#251b5c] text-white flex items-center justify-center">
              <Share2 className="h-4 w-4 text-cyan-300" />
            </div>
            <div>
              <h2 className="font-black text-sm text-slate-900">Your Unique Referral Link &amp; Sharing</h2>
              <p className="text-[11px] text-slate-500">Every customer booking via this link earns you 30% direct cash incentive</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              {CRA_DISCOUNT_CONFIG.customerDiscountPercent}% Discount Pre-Applied
            </span>
          </div>
        </div>

        {/* Link Input & 1-Click Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 relative">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 select-all truncate shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`h-11 px-4 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                copiedLink
                  ? "bg-emerald-600 text-white"
                  : "bg-white hover:bg-slate-50 border border-slate-200 text-slate-800"
              }`}
            >
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedLink ? "Copied Link!" : "Copy Link"}</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Smartphone className="h-4 w-4" />
              <span>WhatsApp</span>
            </button>

            {/* QR Code Modal Button */}
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="h-11 px-4 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <QrCode className="h-4 w-4 text-cyan-300" />
              <span>QR Flyer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAKE MY PROFILE CO-BRANDING BANNER & CUSTOM PROFILES PREVIEW             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1e1b4b] text-white rounded-3xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="space-y-1 z-10 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider bg-purple-400/20 text-purple-200 border border-purple-400/30">
              Co-Branded Diagnostic Identity
            </span>
          </div>
          <h3 className="font-black text-sm sm:text-base text-white truncate">
            {orgProfile?.diagnosticCenterName || `${orgProfile?.brandName} (Powered by AVM Labs)`}
          </h3>
          <p className="text-[11px] text-blue-200 font-medium">
            You have created <strong>{customProfiles.length} custom diagnostic profiles</strong> bundled from AVM Labs test catalogue.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <Link
            href="/cra/dashboard/make-my-profile"
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#382685]" />
            <span>Make My Profile / Bundles</span>
          </Link>
        </div>
      </div>

      {/* 4. THIS MONTH Metrics Card */}
      <div className="bg-[#f9fafb] border border-slate-200/90 rounded-3xl p-3.5 sm:p-5 space-y-2.5 shadow-2xs" suppressHydrationWarning>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
            THIS MONTH PERFORMANCE
          </span>
          <span className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400" />
            <span>10%–30% discount logic pending confirmation</span>
          </span>
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

      {/* 5. Dual-Purpose Operations: Tab Segmented Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("partner")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "partner"
                  ? "bg-[#251b5c] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              A. Partner &amp; Referral Operations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "personal"
                  ? "bg-[#251b5c] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              B. Personal &amp; Family Care ({beneficiaries.length} Members)
            </button>
          </div>
        </div>

        {activeTab === "partner" ? (
          /* Tab A: Partner Operations Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in">
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

            {/* My Customers / Leads */}
            <Link
              href="/cra/dashboard/referrals"
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F5FDE] flex items-center justify-center group-hover:scale-105 transition-transform">
                <List className="h-5 w-5 stroke-[2]" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                My Leads &amp; Status
              </div>
            </Link>

            {/* My Team Network */}
            <Link
              href="/cra/dashboard/network"
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#382685] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5 stroke-[2]" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                My Team (10% Bonus)
              </div>
            </Link>

            {/* Earnings & Wallet */}
            <Link
              href="/cra/dashboard/wallet"
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2.5 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CreditCard className="h-5 w-5 stroke-[2]" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Earnings Statement
              </div>
            </Link>
          </div>
        ) : (
          /* Tab B: Personal & Family Care Grid */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-in fade-in">
            {/* Make My Profile / Bundler */}
            <Link
              href="/cra/dashboard/make-my-profile"
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#382685] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-[#382685]" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Make My Profile
              </div>
              <p className="text-[11px] text-slate-500">
                Bundle multiple AVM tests into a custom profile for patients or family
              </p>
            </Link>

            {/* Family Beneficiaries */}
            <Link
              href="/cra/dashboard/beneficiaries"
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F5FDE] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Family Beneficiaries ({beneficiaries.length})
              </div>
              <p className="text-[11px] text-slate-500">
                Maintain family members &amp; select them when booking diagnostic tests
              </p>
            </Link>

            {/* Book for Self or Family */}
            <Link
              href="/cra/dashboard/add-lead?mode=family"
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-start gap-2 hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="h-5 w-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                Book Test for Family Member
              </div>
              <p className="text-[11px] text-slate-500">
                20% discount applied automatically • Pay via Wallet balance or UPI
              </p>
            </Link>
          </div>
        )}
      </div>

      {/* 6. Recent Activity */}
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

      {/* Referral Link Sharing Modal */}
      <ReferralShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        craName={userName}
        craCode={userCode}
        orgName={orgProfile?.brandName}
        discountPercent={CRA_DISCOUNT_CONFIG.customerDiscountPercent}
      />

    </div>
  )
}
