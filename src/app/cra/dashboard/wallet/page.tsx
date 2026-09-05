"use client"

import { useState, useEffect } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import Link from "next/link"
import { 
  Wallet, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Clock,
  Sparkles,
  ArrowUpRight,
  X,
  Building2,
  Check
} from "lucide-react"

export interface LedgerEntry {
  id: string
  avatar: string
  customerName: string
  source: string
  owner: "me" | "c2"
  profileName: string
  realizedRevenue: number
  rateApplied: string
  incentiveAmount: number
  date: string
  status: "Credited to Wallet" | "Pending Realisation"
}

const LEDGER_DATA: LedgerEntry[] = [
  {
    id: "TXN-8801",
    avatar: "AR",
    customerName: "Anita Rao",
    source: "Direct Referral",
    owner: "me",
    profileName: "Full Body Wellness Profile",
    realizedRevenue: 800,
    rateApplied: "30% Direct",
    incentiveAmount: 240,
    date: "28 Aug 2026, 10:30 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8802",
    avatar: "MK",
    customerName: "Meena K.",
    source: "via SAI MAHENDRA (C2)",
    owner: "c2",
    profileName: "Women Advanced Wellness Profile",
    realizedRevenue: 1200,
    rateApplied: "10% Override",
    incentiveAmount: 120,
    date: "27 Aug 2026, 04:15 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8803",
    avatar: "DP",
    customerName: "Divya Pillai",
    source: "Direct Referral",
    owner: "me",
    profileName: "Diabetic Comprehensive Management",
    realizedRevenue: 960,
    rateApplied: "30% Direct",
    incentiveAmount: 288,
    date: "26 Aug 2026, 11:00 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8804",
    avatar: "PB",
    customerName: "Pooja Bannerjee",
    source: "via SUDHEER REDDY (C2)",
    owner: "c2",
    profileName: "Liver & Gastrointestinal Vitality",
    realizedRevenue: 960,
    rateApplied: "10% Override",
    incentiveAmount: 96,
    date: "20 Aug 2026, 02:45 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8805",
    avatar: "SI",
    customerName: "Suresh Iyer",
    source: "Direct Referral",
    owner: "me",
    profileName: "Executive Heart & Cardiac Risk",
    realizedRevenue: 1600,
    rateApplied: "30% Direct",
    incentiveAmount: 480,
    date: "28 Aug 2026, 09:15 AM",
    status: "Pending Realisation"
  },
  {
    id: "TXN-8806",
    avatar: "KJ",
    customerName: "Karan Joshi",
    source: "via SAI MAHENDRA (C2)",
    owner: "c2",
    profileName: "Senior Citizen Comprehensive Care",
    realizedRevenue: 1440,
    rateApplied: "10% Override",
    incentiveAmount: 144,
    date: "25 Aug 2026, 05:00 PM",
    status: "Pending Realisation"
  },
  {
    id: "TXN-8807",
    avatar: "VS",
    customerName: "Vikram Singhania",
    source: "Direct Referral",
    owner: "me",
    profileName: "Executive Heart & Cardiac Risk",
    realizedRevenue: 1600,
    rateApplied: "30% Direct",
    incentiveAmount: 480,
    date: "24 Aug 2026, 03:45 PM",
    status: "Pending Realisation"
  },
  {
    id: "TXN-8808",
    avatar: "SS",
    customerName: "Sneha Sen",
    source: "via SUDHEER REDDY (C2)",
    owner: "c2",
    profileName: "Thyroid & Hormone Complete Profile",
    realizedRevenue: 720,
    rateApplied: "10% Override",
    incentiveAmount: 72,
    date: "23 Aug 2026, 10:15 AM",
    status: "Pending Realisation"
  },
  {
    id: "TXN-8809",
    avatar: "AG",
    customerName: "Amit Gupta",
    source: "Direct Referral",
    owner: "me",
    profileName: "Full Body Wellness Profile",
    realizedRevenue: 800,
    rateApplied: "30% Direct",
    incentiveAmount: 240,
    date: "22 Aug 2026, 01:20 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8810",
    avatar: "RM",
    customerName: "Rahul Mehta",
    source: "Direct Referral",
    owner: "me",
    profileName: "Full Body Wellness Profile",
    realizedRevenue: 800,
    rateApplied: "30% Direct",
    incentiveAmount: 240,
    date: "18 Aug 2026, 11:20 AM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8811",
    avatar: "NK",
    customerName: "Nandini Kulkarni",
    source: "via SAI MAHENDRA (C2)",
    owner: "c2",
    profileName: "Women Advanced Wellness Profile",
    realizedRevenue: 1200,
    rateApplied: "10% Override",
    incentiveAmount: 120,
    date: "17 Aug 2026, 09:00 AM",
    status: "Pending Realisation"
  },
  {
    id: "TXN-8812",
    avatar: "TS",
    customerName: "Tarun Sharma",
    source: "Direct Referral",
    owner: "me",
    profileName: "Diabetic Comprehensive Management",
    realizedRevenue: 960,
    rateApplied: "30% Direct",
    incentiveAmount: 288,
    date: "16 Aug 2026, 03:15 PM",
    status: "Credited to Wallet"
  },
  {
    id: "TXN-8813",
    avatar: "SB",
    customerName: "Sunita Bhatt",
    source: "via Priya Shah (C2)",
    owner: "c2",
    profileName: "Senior Citizen Comprehensive Care",
    realizedRevenue: 1440,
    rateApplied: "10% Override",
    incentiveAmount: 144,
    date: "15 Aug 2026, 01:45 PM",
    status: "Credited to Wallet"
  }
]

const EARNING_FILTERS = [
  { id: "all", label: "All Transactions" },
  { id: "credited", label: "Credited (Wallet)" },
  { id: "pending", label: "Pending Realisation" },
  { id: "direct", label: "30% Direct Referrals" },
  { id: "override", label: "10% Team Override" }
]

export default function EarningsStatementPage() {
  const { currentUser, getUserWallet, requestWalletWithdrawal } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)
  const wallet = getUserWallet(currentUser.id)
  const isC1 = currentUser.role === "c1"
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dual Utility Wallet Action State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(wallet.totalIncentive.toString() || "1000")
  const [withdrawMethod, setWithdrawMethod] = useState<"Bank Transfer" | "UPI">("Bank Transfer")
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false)

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    requestWalletWithdrawal({
      amount: parseInt(withdrawAmount, 10) || 500,
      method: withdrawMethod,
      bankDetails: {
        bankName: "HDFC Bank Ltd",
        accountNumber: "•••• •••• 9182",
        ifsc: "HDFC0001234",
        upiId: `${currentUser.name.toLowerCase().replace(/\s+/g, ".")}@okhdfcbank`
      }
    })
    setWithdrawSubmitted(true)
    setTimeout(() => {
      setWithdrawSubmitted(false)
      setShowWithdrawModal(false)
    }, 2500)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Combine store transactions or mapped ledger
  const activeEntries: LedgerEntry[] = (mounted && wallet.transactions.length > 0)
    ? wallet.transactions.map((t, idx) => ({
        id: t.id,
        avatar: t.customerName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "CU",
        customerName: t.customerName,
        source: t.type === "Direct 30% Incentive" ? "Direct Referral" : t.customerName.includes("(") ? t.customerName.split("(")[1].replace(")", "") : "Team Referral",
        owner: t.type === "Direct 30% Incentive" ? "me" : "c2",
        profileName: "Diagnostic Health Profile",
        realizedRevenue: t.realizedRevenue,
        rateApplied: t.type === "Direct 30% Incentive" ? "30% Direct" : "10% Override",
        incentiveAmount: t.incentiveAmount,
        date: t.date || "Recent",
        status: t.status as any
      }))
    : LEDGER_DATA

  const filteredEntries = activeEntries.filter((entry) => {
    // Filter chips
    if (selectedFilter === "credited" && entry.status !== "Credited to Wallet") return false
    if (selectedFilter === "pending" && entry.status !== "Pending Realisation") return false
    if (selectedFilter === "direct" && entry.owner !== "me") return false
    if (selectedFilter === "override" && entry.owner !== "c2") return false

    // Search query
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      entry.customerName.toLowerCase().includes(q) ||
      entry.profileName.toLowerCase().includes(q) ||
      entry.source.toLowerCase().includes(q)
    )
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredEntries.length)
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    setCurrentPage(1)
  }

  return (
    <div className="w-full font-sans space-y-4 pb-12" suppressHydrationWarning>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Earnings Statement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Track your 30% direct earnings and 10% team bonus on completed customer tests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cra/dashboard/payouts"
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <span>View Payout History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/cra/dashboard/add-lead"
            className="h-10 px-4 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>+ Refer a Customer</span>
          </Link>
        </div>
      </div>

      {/* 2 Clean KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Customer Test Revenue (This Month)
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900">
            ₹{wallet.totalRealizedRevenue.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-500 font-medium pt-1">
            Total diagnostic tests completed and paid by customers
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-3xl p-5 sm:p-6 border border-blue-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2F5FDE]">
            Total Earnings &amp; Incentives
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#2F5FDE]">
            ₹{wallet.totalIncentive.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-600 font-medium pt-1">
            {wallet.overrideIncentive > 0 ? "30% Direct Referrals + 10% Team Bonus" : "30% Direct Referrals"}
          </p>
        </div>
      </div>

      {/* Dual Utility Wallet Action Card (Encash vs. Retain & Use for Bookings) */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-[#1e1b4b] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Dual Wallet Utility
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Available Wallet Balance: ₹{wallet.totalIncentive.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-blue-200 leading-relaxed font-medium">
            You can either encash your earnings directly to your verified bank account or retain the balance in your wallet to book future lab tests for yourself and your family.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Action 1: Encash / Withdraw */}
          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="h-11 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Coins className="h-4 w-4 text-[#382685]" />
            <span>Encash / Withdraw</span>
          </button>

          {/* Action 2: Retain & Book for Family */}
          <Link
            href="/cra/dashboard/add-lead?mode=family"
            className="h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Wallet className="h-4 w-4" />
            <span>Use for Test Booking</span>
          </Link>
        </div>
      </div>

      {/* Filter Options & Search Toolbar (Optimized for Mobile & Desktop) */}
      <div className="space-y-3 pt-1">
        
        {/* Filter Chips Bar (Wraps cleanly without horizontal scroll cutoffs) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {EARNING_FILTERS.map((f) => {
            const isSelected = selectedFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterChange(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? "bg-[#251b5c] text-white border-[#251b5c] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search earnings by customer, package name, or source..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#382685] shadow-2xs"
          />
        </div>

      </div>

      {/* Data Presentation: Structured Table on Desktop, Box Containers on Mobile */}
      <div className="space-y-3">
        
        {/* Desktop Structured Table */}
        <div className="hidden lg:block bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f8f9fc] border-b border-slate-200/80 text-slate-400 font-extrabold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-3.5 px-5">Customer &amp; Source</th>
                <th className="py-3.5 px-4">Package Name</th>
                <th className="py-3.5 px-4 text-right">Order Amount (RR)</th>
                <th className="py-3.5 px-4 text-center">Earning Rate</th>
                <th className="py-3.5 px-5 text-right">Your Earnings</th>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEntries.map((entry) => {
                const isCredited = entry.status === "Credited to Wallet"
                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer & Source */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0">
                          {entry.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {entry.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {entry.source}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Package */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[220px]">
                        {entry.profileName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Ref: {entry.id}
                      </div>
                    </td>

                    {/* Order Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-black text-sm text-slate-900">
                        ₹{entry.realizedRevenue}
                      </div>
                      <div className="text-[10px] text-slate-400">RR Realized</div>
                    </td>

                    {/* Earning Rate */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.8 rounded-md bg-purple-50 text-[#382685] font-mono text-[10.5px] font-bold border border-purple-200/60">
                        {entry.rateApplied}
                      </span>
                    </td>

                    {/* Your Earning */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="font-mono font-black text-sm text-emerald-700">
                        +₹{entry.incentiveAmount}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">Net Incentive</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {entry.date}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                        isCredited
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isCredited ? "bg-emerald-600" : "bg-amber-500"}`} />
                        <span>{entry.status}</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Dedicated Box Containers (Cards) */}
        <div className="lg:hidden space-y-3">
          {paginatedEntries.map((entry) => {
            const isCredited = entry.status === "Credited to Wallet"
            return (
              <div 
                key={entry.id} 
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs space-y-3"
              >
                {/* Header Row: Avatar, Name & Net Incentive */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-[#251b5c] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                      {entry.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-sm text-slate-900 truncate">{entry.customerName}</div>
                      <div className="text-[11.5px] text-slate-500 font-medium truncate mt-0.5">{entry.profileName}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-base text-emerald-700">+₹{entry.incentiveAmount}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-[#382685] border border-purple-200/70 inline-block mt-0.5">
                      {entry.rateApplied}
                    </span>
                  </div>
                </div>

                {/* Metrics Box Grid inside Container */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Order Revenue (RR)</span>
                    <p className="font-mono font-black text-slate-800 text-sm mt-0.5">₹{entry.realizedRevenue}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Referral Source</span>
                    <p className="font-bold text-slate-700 text-xs mt-0.5 truncate">{entry.source}</p>
                  </div>
                </div>

                {/* Footer Row: Status & Timestamp */}
                <div className="flex items-center justify-between gap-2 pt-1 text-xs border-t border-slate-100/80">
                  <span className={`px-2.5 py-0.8 rounded-lg text-[10.5px] font-bold border inline-flex items-center gap-1 ${
                    isCredited 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isCredited ? "bg-emerald-600" : "bg-amber-500"}`} />
                    <span>{entry.status}</span>
                  </span>

                  <span className="text-slate-400 font-mono text-[10.5px]">{entry.date}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
            <User className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No transactions found matching your filter</p>
            <button
              type="button"
              onClick={() => {
                setSelectedFilter("all")
                setSearchQuery("")
                setCurrentPage(1)
              }}
              className="text-xs font-bold text-[#2F5FDE] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Standard 10-per-page Pagination Footer */}
        {filteredEntries.length > 0 && (
          <div className="p-4 bg-white border border-slate-200/90 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{filteredEntries.length}</span> transactions
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage === 1}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg font-bold transition-all cursor-pointer ${
                      safeCurrentPage === page
                        ? "bg-[#251b5c] text-white shadow-xs"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Encash / Withdraw to Bank Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200/90 p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="h-4.5 w-4.5 text-[#382685]" />
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Encash Wallet Earnings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {withdrawSubmitted ? (
              <div className="py-6 text-center space-y-3 animate-in fade-in">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                  <Check className="h-7 w-7 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">Withdrawal Request Submitted</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    ₹{withdrawAmount} requested to registered bank account. Payout batch runs every Monday.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    max={wallet.totalIncentive}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                  />
                  <span className="text-[10.5px] text-slate-400 mt-1 block">
                    Available balance: ₹{wallet.totalIncentive.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Payout Destination
                  </label>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#382685]" />
                        <span>HDFC Bank (Primary Account)</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        KYC Verified
                      </span>
                    </div>
                    <div className="font-mono text-slate-600 text-[11px]">
                      A/C: •••• •••• 9182 • IFSC: HDFC0001234
                    </div>
                  </div>
                </div>

                {/* Pending Confirmation Disclaimer Note */}
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                  <strong>Commercial Policy Notice:</strong> Minimum withdrawal thresholds, TDS deductor rules, and bank settlement turnaround times are conceptual and pending final business confirmation.
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
