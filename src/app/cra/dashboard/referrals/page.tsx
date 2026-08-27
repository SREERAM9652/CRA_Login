"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  Clock, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  IndianRupee, 
  Send, 
  Sparkles, 
  ChevronRight,
  ArrowUpDown,
  Check,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { MOCK_CRA_REFERRALS, CRAReferralRecord } from "@/lib/mock-data"
import { CustomSelect } from "@/components/ui/CustomSelect"

export default function ReferralManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [tierFilter, setTierFilter] = useState("All")
  const [selectedReferral, setSelectedReferral] = useState<CRAReferralRecord | null>(null)
  const [reminderSent, setReminderSent] = useState(false)
  const [exportToast, setExportToast] = useState(false)

  // Filtered referrals
  const filteredReferrals = MOCK_CRA_REFERRALS.filter((ref) => {
    const matchesSearch = 
      ref.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.mobile.includes(searchQuery) ||
      ref.packageOrdered.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "All" || ref.status === statusFilter
    const matchesTier = tierFilter === "All" || ref.tier === tierFilter

    return matchesSearch && matchesStatus && matchesTier
  })

  // Summary Metrics
  const totalCount = MOCK_CRA_REFERRALS.length
  const activeCount = MOCK_CRA_REFERRALS.filter(r => ["Contacted", "Slot Booked", "Sample Collected"].includes(r.status)).length
  const completedCount = MOCK_CRA_REFERRALS.filter(r => r.status === "Completed").length
  const pendingCount = MOCK_CRA_REFERRALS.filter(r => r.status === "Lead Submitted").length

  const handleExportCSV = () => {
    setExportToast(true)
    setTimeout(() => setExportToast(false), 3000)
  }

  const handleSendReminder = () => {
    setReminderSent(true)
    setTimeout(() => setReminderSent(false), 3000)
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            My Customer Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Track all your customer orders, sample collections, and your earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-11 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV</span>
          </button>
          
          <Link
            href="/cra/dashboard/add-lead"
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2 shadow-lg shadow-indigo-950/15 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Book for a Customer</span>
          </Link>
        </div>
      </div>

      {/* Export Toast Feedback */}
      {exportToast && (
        <div className="p-3 bg-slate-900 text-white text-xs font-bold rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span>Customer bookings statement exported successfully (AVMLabs_Customer_Bookings.csv)</span>
          <button onClick={() => setExportToast(false)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Bookings</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Direct & team orders</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-100 bg-blue-50/30 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">In-Progress</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">{activeCount}</div>
          <div className="text-[11px] text-blue-600 mt-1">Booked / Sample processing</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 bg-emerald-50/30 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Completed & Paid</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">{completedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Earnings credited</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-amber-100 bg-amber-50/30 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Pending Follow-up</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">Team calling customer</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-100 shadow-sm bg-white p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name, mobile number, or diagnostic test..."
              className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-2xl bg-slate-50/70 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-full sm:w-44">
              <CustomSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                options={[
                  { value: "All", label: "All Statuses" },
                  { value: "Lead Submitted", label: "Lead Submitted" },
                  { value: "Contacted", label: "Contacted" },
                  { value: "Slot Booked", label: "Slot Booked" },
                  { value: "Sample Collected", label: "Sample Collected" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                ]}
              />
            </div>

            <div className="w-full sm:w-48">
              <CustomSelect
                value={tierFilter}
                onChange={(val) => setTierFilter(val)}
                align="right"
                options={[
                  { value: "All", label: "All Tiers" },
                  { value: "C1 Direct", label: "C1 Direct (30%)", sublabel: "Direct Attribution" },
                  { value: "C2 Sub-Agency", label: "C2 Sub-Agency (10%)", sublabel: "Network Override" },
                ]}
              />
            </div>
          </div>

        </div>

        {/* Referrals Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 min-w-[200px]">Customer Details</th>
                <th className="px-4 py-3.5">Order Date</th>
                <th className="px-4 py-3.5 min-w-[200px]">Package / Test Ordered</th>
                <th className="px-4 py-3.5">Order Type</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Customer Paid</th>
                <th className="px-4 py-3.5">Your Earning</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{ref.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{ref.mobile}</span>
                        <span>•</span>
                        <span className="text-slate-500 font-sans font-medium">{ref.relationship}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                      {ref.referredDate}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      <div className="truncate font-bold text-slate-900">{ref.packageOrdered}</div>
                      <div className="text-[10.5px] text-slate-400 font-medium">{ref.orderCount} Order(s) logged</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#382685] font-extrabold text-[10.5px] border border-purple-100">
                        {ref.tier}
                      </span>
                    </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={
                            ref.status === "Completed"
                              ? "success"
                              : ref.status === "Slot Booked"
                              ? "default"
                              : ref.status === "Sample Collected"
                              ? "accent"
                              : "warning"
                          }
                        >
                          {ref.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {ref.realizedRevenue > 0 ? `₹${ref.realizedRevenue.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-primary text-sm">
                        {ref.incentiveAmount > 0 ? (
                          <span>₹{Math.round(ref.incentiveAmount).toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReferral(ref)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                      No referrals found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Referral ID: {selectedReferral.id}
                </div>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedReferral.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReferral(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              
              {/* Contact Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-sm">Customer Contact Details</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <span className="font-bold text-slate-900">{selectedReferral.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="font-medium">{selectedReferral.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Relationship:</span>
                    <span className="font-medium text-slate-800">{selectedReferral.relationship}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Attribution Tier:</span>
                    <span className="font-bold text-primary">{selectedReferral.tier}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Incentive Breakdown */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>Incentive & Revenue Breakdown</span>
                  <Badge variant={selectedReferral.tier === "C1 Direct" ? "default" : "purple"}>
                    {selectedReferral.tier === "C1 Direct" ? "30% Direct C1" : "10% C2 Override"}
                  </Badge>
                </div>
                
                <div className="space-y-2 pt-1 border-t border-blue-100">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Referred Package:</span>
                    <span className="font-semibold text-slate-900">{selectedReferral.packageOrdered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Realized Revenue (RR):</span>
                    <span className="font-bold text-slate-900">₹{selectedReferral.realizedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-blue-200">
                    <span className="font-bold text-slate-800">Your Calculated Incentive:</span>
                    <span className="font-black text-primary text-base">
                      ₹{Math.round(selectedReferral.incentiveAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Referral Lifecycle Timeline */}
              <div>
                <div className="font-bold text-slate-800 text-sm mb-3">Referral Status Timeline</div>
                <div className="space-y-4 pl-2 border-l-2 border-slate-200">
                  {selectedReferral.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-5">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[19px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          step.done ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-slate-300"
                        }`}
                      />
                      <div className="font-bold text-slate-900 text-xs">{step.title}</div>
                      <div className="text-[10px] text-slate-400 mb-0.5">{step.timestamp}</div>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quarterly Re-testing Reminder Widget */}
              {selectedReferral.quarterlyRetestDue && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                  <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>Quarterly Wellness Retest Due: {selectedReferral.quarterlyRetestDue}</span>
                  </div>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    Remind this client for their regular quarterly blood glucose / thyroid follow-up to maintain continuous health tracking and earn recurring 30% incentives.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendReminder}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {reminderSent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                    <span>{reminderSent ? "Reminder Sent via WhatsApp!" : "Send Retest WhatsApp Reminder"}</span>
                  </button>
                </div>
              )}

              {/* Notes */}
              {selectedReferral.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                  <span className="font-bold text-slate-700 block mb-1">CRA Notes:</span>
                  {selectedReferral.notes}
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              <a
                href={`tel:${selectedReferral.mobile}`}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Call Customer</span>
              </a>
              <button
                onClick={() => setSelectedReferral(null)}
                className="py-2.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
