"use client"

import { useState } from "react"
import Link from "next/link"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Search,
  Receipt,
  FileCheck
} from "lucide-react"

const PAYOUTS_DATA = [
  {
    id: "PAY-2026-08A",
    payoutDate: "15 Aug 2026",
    period: "01 Aug 2026 – 15 Aug 2026",
    amount: 14400,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC9823419082",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-07B",
    payoutDate: "31 Jul 2026",
    period: "16 Jul 2026 – 31 Jul 2026",
    amount: 19200,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC7710293847",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-07A",
    payoutDate: "15 Jul 2026",
    period: "01 Jul 2026 – 15 Jul 2026",
    amount: 11600,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC6619028374",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-06B",
    payoutDate: "30 Jun 2026",
    period: "16 Jun 2026 – 30 Jun 2026",
    amount: 16800,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC5518293041",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-06A",
    payoutDate: "15 Jun 2026",
    period: "01 Jun 2026 – 15 Jun 2026",
    amount: 13200,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC4419203948",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-05B",
    payoutDate: "31 May 2026",
    period: "16 May 2026 – 31 May 2026",
    amount: 21500,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC3318294059",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-05A",
    payoutDate: "15 May 2026",
    period: "01 May 2026 – 15 May 2026",
    amount: 10400,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC2219405968",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-04B",
    payoutDate: "30 Apr 2026",
    period: "16 Apr 2026 – 30 Apr 2026",
    amount: 18600,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC1129485069",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-04A",
    payoutDate: "15 Apr 2026",
    period: "01 Apr 2026 – 15 Apr 2026",
    amount: 12800,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC0019485768",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-03B",
    payoutDate: "31 Mar 2026",
    period: "16 Mar 2026 – 31 Mar 2026",
    amount: 15400,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC9928374650",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-03A",
    payoutDate: "15 Mar 2026",
    period: "01 Mar 2026 – 15 Mar 2026",
    amount: 11900,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC8837465920",
    status: "Settled & Transferred"
  },
  {
    id: "PAY-2026-02B",
    payoutDate: "28 Feb 2026",
    period: "16 Feb 2026 – 28 Feb 2026",
    amount: 14800,
    mode: "Bank NEFT Transfer",
    account: "HDFC Bank •••• 4892",
    utr: "HDFC7746592839",
    status: "Settled & Transferred"
  }
]

const PAYOUT_FILTERS = [
  { id: "all", label: "All Settlements" },
  { id: "settled", label: "Settled & Transferred" },
  { id: "high", label: "High Value (>₹15k)" },
  { id: "q3", label: "Q3 2026 Batches" }
]

export default function PayoutHistoryPage() {
  const { currentUser, getUserWallet } = useWorkflowStore()
  const wallet = getUserWallet(currentUser.id)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const itemsPerPage = 10

  const filteredPayouts = PAYOUTS_DATA.filter((p) => {
    // Filter chips
    if (selectedFilter === "settled" && p.status !== "Settled & Transferred") return false
    if (selectedFilter === "high" && p.amount < 15000) return false
    if (selectedFilter === "q3" && !p.payoutDate.includes("Jul") && !p.payoutDate.includes("Aug") && !p.payoutDate.includes("Sep")) return false

    // Search query
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.id.toLowerCase().includes(q) ||
      p.utr.toLowerCase().includes(q) ||
      p.period.toLowerCase().includes(q) ||
      p.payoutDate.toLowerCase().includes(q)
    )
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredPayouts.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPayouts.length)
  const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex)

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    setCurrentPage(1)
  }

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Payout History &amp; Bank Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Record of all payments transferred directly to your bank account twice every month
          </p>
        </div>

        <Link
          href="/cra/dashboard/wallet"
          className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <span>View Earnings Statement</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Paid Out</div>
          <div className="font-mono text-3xl font-black text-slate-900">₹1,72,600</div>
          <p className="text-[10.5px] text-emerald-700 font-bold">Paid on 1st &amp; 15th of every month</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Current Accrued Balance</div>
          <div className="font-mono text-3xl font-black text-emerald-900">₹{wallet.totalIncentive.toLocaleString()}</div>
          <p className="text-[10.5px] text-emerald-700 font-medium">Ready for next payout</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">Next Scheduled Payout</div>
          <div className="text-2xl font-black text-[#1e1b4b]">01 Sept 2026</div>
          <p className="text-[10.5px] text-slate-500 font-medium">Transferred automatically</p>
        </div>
      </div>

      {/* Primary Bank Account on File */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-blue-200 font-extrabold uppercase tracking-wider">Primary Bank Account on File</div>
            <div className="font-mono text-base font-bold text-white mt-0.5">HDFC Bank • A/C No: •••••••• 4892</div>
            <div className="text-[11px] text-slate-400">IFSC: HDFC0001234 • Name: {currentUser.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>KYC Verified</span>
          </span>
          <Link
            href="/cra/dashboard/profile"
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Filter Chips & Search Toolbar */}
      <div className="space-y-3 pt-1">
        
        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PAYOUT_FILTERS.map((f) => {
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
            placeholder="Search by payout ID, bank UTR, or date..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#382685] shadow-2xs"
          />
        </div>

      </div>

      {/* Data Presentation: Desktop Structured Table vs Mobile Box Containers */}
      <div className="space-y-3">
        
        {/* Desktop Structured Table */}
        <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900">Historical Payout Batches</h3>
            <span className="text-xs font-bold text-slate-500">{filteredPayouts.length} Total Settlements</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8f9fc] border-b border-slate-200/80 text-slate-400 font-extrabold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3.5 px-5">Payout Ref ID</th>
                  <th className="py-3.5 px-4">Settlement Date</th>
                  <th className="py-3.5 px-4">Incentive Period</th>
                  <th className="py-3.5 px-4 text-right">Disbursed Amount</th>
                  <th className="py-3.5 px-4">Bank UTR / Reference</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-black text-slate-900">{p.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{p.payoutDate}</td>
                    <td className="py-3.5 px-4 text-slate-500">{p.period}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-800 text-sm text-right">₹{p.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{p.utr}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{p.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Dedicated Box Containers (Cards) */}
        <div className="lg:hidden space-y-3">
          {paginatedPayouts.map((p) => (
            <div 
              key={p.id}
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs space-y-3"
            >
              {/* Top Header: Ref ID & Disbursed Amount */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-mono font-black text-sm text-slate-900">{p.id}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{p.payoutDate}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-lg text-emerald-800">
                    ₹{p.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">Disbursed</div>
                </div>
              </div>

              {/* Settlement Period & Account Details Box */}
              <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[10.5px] font-bold uppercase text-slate-400">Incentive Period</span>
                  <span className="font-semibold text-slate-800 text-right">{p.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10.5px] font-bold uppercase text-slate-400">Bank Transfer</span>
                  <span className="font-mono text-slate-700">{p.account}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-[10.5px] font-bold uppercase text-slate-400">UTR / Ref No.</span>
                  <span className="font-mono font-bold text-slate-900">{p.utr}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                <span className="px-2.5 py-0.8 rounded-lg text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{p.status}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">NEFT Settled</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPayouts.length === 0 && (
          <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
            <Building2 className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No payout settlements found matching your filter</p>
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
        {filteredPayouts.length > 0 && (
          <div className="p-4 bg-white border border-slate-200/90 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{filteredPayouts.length}</span> settlements
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

    </div>
  )
}
