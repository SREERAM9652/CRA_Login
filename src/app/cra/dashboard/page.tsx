"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Users, 
  CheckCircle2, 
  HandCoins, 
  Network, 
  Copy, 
  Check, 
  Share2, 
  UserPlus, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  QrCode,
  IndianRupee,
  Award,
  Download,
  Percent,
  Activity,
  ArrowRight,
  ShieldCheck
} from "lucide-react"
import { MOCK_CRA_REFERRALS, MOCK_MONTHLY_PERFORMANCE } from "@/lib/mock-data"

export default function CRADashboardOverview() {
  const [copied, setCopied] = useState(false)
  const referralCode = "AVM-RAJ-789"
  const referralLink = `https://avmlabs.com/booking?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Summary Metrics calculations
  const totalReferrals = MOCK_CRA_REFERRALS.length
  const activeCustomers = MOCK_CRA_REFERRALS.filter(r => r.status !== "Cancelled").length
  const totalRealizedRevenue = MOCK_CRA_REFERRALS.reduce((acc, r) => acc + r.realizedRevenue, 0)
  const totalIncentivesEarned = MOCK_CRA_REFERRALS.reduce((acc, r) => acc + r.incentiveAmount, 0)

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Active Direct Partner (Earn 30%)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            My Partner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Track all your customer orders, sample collections, and your 30% direct earnings.
          </p>
        </div>

        {/* Quick Add Customer CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/cra/dashboard/add-lead"
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-indigo-950/15 hover:scale-102 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Book for a Customer</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPACT & SLEEK REFERRAL ATTRIBUTION HERO BANNER                          */}
      {/* ========================================================================= */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1e1b4b] via-[#2e1f74] to-[#382685] text-white shadow-lg border border-white/10 overflow-hidden relative p-4 sm:p-6">
        
        {/* Soft Ambient Glows */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-1.5 max-w-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-cyan-300 font-extrabold text-[9.5px] uppercase tracking-wider border border-white/10">
                Your Partner Code
              </span>
              <span className="text-[11px] text-blue-200/90 font-medium">Earn 30% on every customer test</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Share with Customers &amp; Earn 30%
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
              Customers get a flat <strong>20% discount</strong> on tests, and <strong>30% of the booking price</strong> is credited directly to your bank account.
            </p>
          </div>

          {/* Code Copy & Share Box (Responsive on Mobile) */}
          <div className="bg-slate-950/70 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-xl w-full lg:w-auto shrink-0">
            <div className="px-3.5 py-2 bg-white/10 rounded-xl border border-white/10 text-center sm:text-left flex items-center justify-between sm:block">
              <div className="text-[9.5px] text-cyan-300 font-extrabold uppercase tracking-wider">Your Code</div>
              <div className="font-mono text-base sm:text-lg font-black tracking-wider text-white leading-none mt-0.5 sm:mt-1">{referralCode}</div>
            </div>
            
            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="h-10 px-4 rounded-xl bg-white text-[#251b5c] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-[#382685]" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Book your health checkup on AVMLabs with 20% discount using my link: ${referralLink}`)}`}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Share2 className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Formula (Responsive Wrap) */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-blue-200/90 relative z-10">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px]">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9.5px] font-bold">How it works:</span>
            <span>Customer Price = MRP - 20% Off • Direct Earning = 30%</span>
          </div>
          <span className="text-cyan-300 font-bold text-[10.5px] flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Bank Payouts Every 1st &amp; 15th
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4 SUMMARY METRIC CARDS                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1 */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5538b5]">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalReferrals}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+18% from last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Active Bookings
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3056d3]">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{activeCustomers}</div>
          <div className="text-xs text-slate-500 mt-1.5 font-medium">
            4 Completed, 1 In-Progress
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Customer Sales
            </span>
            <div className="h-9 w-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
              <IndianRupee className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalRealizedRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1.5 font-medium">
            Total paid by your customers
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-purple-200/80 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-white to-purple-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#382685]">
              Total Earnings (30%)
            </span>
            <div className="h-9 w-9 rounded-xl bg-[#251b5c] text-white flex items-center justify-center shadow-xs">
              <HandCoins className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#251b5c]">₹{Math.round(totalIncentivesEarned).toLocaleString()}</div>
          <div className="text-xs text-emerald-700 font-black mt-1.5 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>₹2,519 Ready for Instant Payout</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MONTHLY PROGRESS & QUICK OPERATIONS                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Monthly Performance Visual */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">Monthly Customer Sales &amp; Your Earnings</h3>
              <p className="text-xs text-slate-500">Your total sales and earnings over the past 5 months</p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
              +28.5% Growth
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {MOCK_MONTHLY_PERFORMANCE.map((item) => {
              const maxRR = 90000
              const widthPct = Math.round((item.rr / maxRR) * 100)
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs font-bold gap-1 sm:gap-0">
                    <span className="text-slate-800">{item.month} ({item.referrals} orders)</span>
                    <div className="flex gap-3 sm:gap-4 text-[11px] sm:text-xs">
                      <span className="text-slate-500">Sales: ₹{item.rr.toLocaleString()}</span>
                      <span className="text-[#382685] font-black">Your Earning: ₹{item.c1Incentive.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-[#251b5c] to-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2 font-medium">
            <span>* You earn 30% on every customer test booking.</span>
            <span className="font-bold text-slate-700">Bank payouts processed every 1st &amp; 15th</span>
          </div>
        </div>

        {/* Quick Operations & Team Box */}
        <div className="space-y-5 sm:space-y-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-2">
              Quick Actions
            </h3>

            <div className="space-y-2 pt-1">
              <Link
                href="/cra/dashboard/add-lead"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-white font-bold text-xs flex items-center justify-between shadow-md shadow-indigo-950/15 hover:opacity-95 transition-all"
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-cyan-300" />
                  <span>Book for a Customer</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/cra/dashboard/referrals"
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>View All Customer Orders</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                href="/cra/dashboard/network"
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-[#382685]" />
                  <span>My Partner Team (10% Bonus)</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sub-Agency Quick Card */}
          <div className="bg-gradient-to-br from-purple-50/60 to-indigo-50/40 rounded-2xl sm:rounded-3xl p-5 border border-purple-200/60 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-100 text-[#382685] flex items-center justify-center font-bold">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">Partner Team Bonus</h4>
                <p className="text-[11px] text-slate-500">3 Sub-Agents onboarded</p>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-2xl border border-purple-100 text-xs flex justify-between items-center shadow-xs">
              <span className="text-slate-600 font-medium">10% Team Bonus:</span>
              <span className="font-black text-[#382685] text-sm">₹4,200 Earned</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RECENT CUSTOMER ORDERS TABLE & MOBILE CARDS                               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-500">Live status of orders placed through your link</p>
          </div>
          <Link
            href="/cra/dashboard/referrals"
            className="text-xs font-black text-[#382685] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Bookings</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Card List (Visible on mobile screens < 768px) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {MOCK_CRA_REFERRALS.slice(0, 4).map((ref) => (
            <div key={ref.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-black text-slate-900 text-sm">{ref.customerName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{ref.mobile}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] shrink-0 ${
                  ref.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800"
                    : ref.status === "Slot Booked"
                    ? "bg-blue-100 text-blue-800"
                    : ref.status === "Sample Collected"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {ref.status}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                {ref.packageOrdered}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Customer Paid: <strong className="text-slate-800">{ref.realizedRevenue > 0 ? `₹${ref.realizedRevenue.toLocaleString()}` : "—"}</strong></span>
                <span className="font-black text-[#251b5c]">Your Earning: {ref.incentiveAmount > 0 ? `₹${Math.round(ref.incentiveAmount).toLocaleString()}` : "Pending"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table View (Visible on tablet & desktop >= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 rounded-tl-2xl">Customer Details</th>
                <th className="px-4 py-3">Test / Package</th>
                <th className="px-4 py-3">Order Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Customer Paid</th>
                <th className="px-4 py-3 rounded-tr-2xl">Your Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CRA_REFERRALS.slice(0, 4).map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-black text-slate-900 text-sm">{ref.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{ref.mobile} • {ref.relationship}</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-700 max-w-[200px] truncate">
                    {ref.packageOrdered}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#382685] font-extrabold text-[10.5px] border border-purple-100">
                      {ref.tier === "C1 Direct" ? "Direct Order" : "Team Order"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${
                      ref.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : ref.status === "Slot Booked"
                        ? "bg-blue-100 text-blue-800"
                        : ref.status === "Sample Collected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    {ref.realizedRevenue > 0 ? `₹${ref.realizedRevenue.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3.5 font-black text-[#251b5c] text-sm">
                    {ref.incentiveAmount > 0 ? `₹${Math.round(ref.incentiveAmount).toLocaleString()}` : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
