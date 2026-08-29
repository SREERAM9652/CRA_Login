"use client"

import { useState } from "react"
import Link from "next/link"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  Repeat, 
  Share2, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Search, 
  MessageCircle, 
  AlertCircle, 
  Coins, 
  User, 
  Calendar, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Sparkles
} from "lucide-react"

export interface RetestClient {
  id: string
  avatar: string
  customerName: string
  mobile: string
  city: string
  lastTestDate: string
  lastProfile: string
  realizedRevenue: number
  repeatIncentive: number
  daysAgo: number
  status: "Overdue" | "Due Soon" | "Healthy"
  statusLabel: string
}

const RETEST_CLIENTS: RetestClient[] = [
  {
    id: "REM-01",
    avatar: "SS",
    customerName: "Sunil Sharma",
    mobile: "+91 98450 99887",
    city: "Pune",
    lastTestDate: "28 May 2026",
    lastProfile: "Full Body Wellness Profile",
    realizedRevenue: 800,
    repeatIncentive: 240,
    daysAgo: 92,
    status: "Overdue",
    statusLabel: "Due for 90-Day Retest"
  },
  {
    id: "REM-02",
    avatar: "AD",
    customerName: "Ananya Deshmukh",
    mobile: "+91 98765 11223",
    city: "Mumbai",
    lastTestDate: "10 Jun 2026",
    lastProfile: "Women Advanced Wellness Profile",
    realizedRevenue: 1200,
    repeatIncentive: 360,
    daysAgo: 79,
    status: "Due Soon",
    statusLabel: "Due in 11 Days"
  },
  {
    id: "REM-03",
    avatar: "RV",
    customerName: "Ramesh Verma",
    mobile: "+91 98860 33445",
    city: "Hyderabad",
    lastTestDate: "15 May 2026",
    lastProfile: "Diabetic Comprehensive Management",
    realizedRevenue: 960,
    repeatIncentive: 288,
    daysAgo: 105,
    status: "Overdue",
    statusLabel: "Quarterly HbA1c Due"
  },
  {
    id: "REM-04",
    avatar: "KR",
    customerName: "Kavita Rao",
    mobile: "+91 97400 44556",
    city: "Bengaluru",
    lastTestDate: "20 Jul 2026",
    lastProfile: "Executive Heart & Cardiac Risk",
    realizedRevenue: 1600,
    repeatIncentive: 480,
    daysAgo: 39,
    status: "Healthy",
    statusLabel: "Next Due in Oct"
  },
  {
    id: "REM-05",
    avatar: "VS",
    customerName: "Vikas Sinha",
    mobile: "+91 98220 77665",
    city: "Pune",
    lastTestDate: "12 May 2026",
    lastProfile: "Full Body Wellness Profile",
    realizedRevenue: 800,
    repeatIncentive: 240,
    daysAgo: 108,
    status: "Overdue",
    statusLabel: "Due for 90-Day Retest"
  },
  {
    id: "REM-06",
    avatar: "PL",
    customerName: "Pooja Lodha",
    mobile: "+91 98110 99443",
    city: "Mumbai",
    lastTestDate: "05 Jun 2026",
    lastProfile: "Thyroid & Hormone Complete Profile",
    realizedRevenue: 720,
    repeatIncentive: 216,
    daysAgo: 84,
    status: "Due Soon",
    statusLabel: "Due in 6 Days"
  },
  {
    id: "REM-07",
    avatar: "NK",
    customerName: "Nitin Kothari",
    mobile: "+91 98450 11998",
    city: "Bengaluru",
    lastTestDate: "01 May 2026",
    lastProfile: "Liver & Gastrointestinal Vitality",
    realizedRevenue: 960,
    repeatIncentive: 288,
    daysAgo: 119,
    status: "Overdue",
    statusLabel: "Due for 90-Day Retest"
  },
  {
    id: "REM-08",
    avatar: "GS",
    customerName: "Geeta Sengupta",
    mobile: "+91 98330 44551",
    city: "Kolkata",
    lastTestDate: "18 Jun 2026",
    lastProfile: "Senior Citizen Comprehensive Care",
    realizedRevenue: 1440,
    repeatIncentive: 432,
    daysAgo: 71,
    status: "Due Soon",
    statusLabel: "Due in 19 Days"
  },
  {
    id: "REM-09",
    avatar: "AM",
    customerName: "Ajay Malhotra",
    mobile: "+91 98900 66778",
    city: "Hyderabad",
    lastTestDate: "25 Jul 2026",
    lastProfile: "Executive Heart & Cardiac Risk",
    realizedRevenue: 1600,
    repeatIncentive: 480,
    daysAgo: 34,
    status: "Healthy",
    statusLabel: "Next Due in Nov"
  },
  {
    id: "REM-10",
    avatar: "SB",
    customerName: "Shweta Bose",
    mobile: "+91 98210 33441",
    city: "Mumbai",
    lastTestDate: "22 May 2026",
    lastProfile: "Women Advanced Wellness Profile",
    realizedRevenue: 1200,
    repeatIncentive: 360,
    daysAgo: 98,
    status: "Overdue",
    statusLabel: "Due for 90-Day Retest"
  },
  {
    id: "REM-11",
    avatar: "HN",
    customerName: "Harish Nambiar",
    mobile: "+91 98440 22331",
    city: "Chennai",
    lastTestDate: "14 Jun 2026",
    lastProfile: "Diabetic Comprehensive Management",
    realizedRevenue: 960,
    repeatIncentive: 288,
    daysAgo: 75,
    status: "Due Soon",
    statusLabel: "Due in 15 Days"
  }
]

const REMINDER_FILTERS = [
  { id: "all", label: "All Clients" },
  { id: "overdue", label: "Overdue (>90 Days)" },
  { id: "due_soon", label: "Due Soon (<15 Days)" },
  { id: "healthy", label: "Healthy / Future Due" }
]

export default function ClientRemindersPage() {
  const { currentUser } = useWorkflowStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [toastMsg, setToastMsg] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSendNudge = (client: RetestClient) => {
    const text = `Hello ${client.customerName}, it's time for your 90-day quarterly health retest for ${client.lastProfile} with AVMLabs! Book home sample collection with your 20% discount: https://avmlabs.com/booking`
    window.open(`https://wa.me/${client.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank")
    setToastMsg(`✓ Retest reminder sent to ${client.customerName}!`)
    setTimeout(() => setToastMsg(""), 3500)
  }

  const filteredClients = RETEST_CLIENTS.filter((client) => {
    // Filter chips
    if (selectedFilter === "overdue" && client.status !== "Overdue") return false
    if (selectedFilter === "due_soon" && client.status !== "Due Soon") return false
    if (selectedFilter === "healthy" && client.status !== "Healthy") return false

    // Search query
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      client.customerName.toLowerCase().includes(q) ||
      client.mobile.includes(q) ||
      client.lastProfile.toLowerCase().includes(q) ||
      client.city.toLowerCase().includes(q)
    )
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredClients.length)
  const paginatedClients = filteredClients.slice(startIndex, endIndex)

  const overdueCount = RETEST_CLIENTS.filter(c => c.status === "Overdue").length
  const dueSoonCount = RETEST_CLIENTS.filter(c => c.status === "Due Soon").length
  const potentialRepeatIncome = RETEST_CLIENTS.filter(c => c.status !== "Healthy").reduce((sum, c) => sum + c.repeatIncentive, 0)

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    setCurrentPage(1)
  }

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Toast */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between border border-emerald-400/30">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg("")} className="text-emerald-300 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Client Reminders &amp; Retests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Automatic 90-day quarterly retest tracker to remind past clients for recurring health checkups
          </p>
        </div>

        <Link
          href="/cra/dashboard/referrals"
          className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <span>View All Customers</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
            Overdue For Retest (&gt;90 Days)
          </div>
          <div className="font-mono text-3xl font-black text-rose-600">
            {overdueCount} Clients
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">Overdue for quarterly retest</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
            Due in Next 15 Days
          </div>
          <div className="font-mono text-3xl font-black text-amber-600">
            {dueSoonCount} Clients
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">Reaching 90-day threshold</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-200 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
            Potential Repeat Income
          </div>
          <div className="font-mono text-3xl font-black text-emerald-900">
            ₹{potentialRepeatIncome.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-emerald-700 font-bold">From quarterly recurring tests</p>
        </div>
      </div>

      {/* Filter Chips & Search Toolbar */}
      <div className="space-y-3 pt-1">
        
        {/* Filter Chips Bar (Wrapped cleanly without horizontal scroll cutoffs) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {REMINDER_FILTERS.map((f) => {
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
            placeholder="Search client by name, mobile number, city, or package..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#382685] shadow-2xs"
          />
        </div>

      </div>

      {/* Data Presentation: Desktop Structured Table vs Mobile Box Containers */}
      <div className="space-y-3">
        
        {/* Desktop Structured Table */}
        <div className="hidden lg:block bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f8f9fc] border-b border-slate-200/80 text-slate-400 font-extrabold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-3.5 px-5">Customer &amp; Mobile</th>
                <th className="py-3.5 px-4">Last Tested Package</th>
                <th className="py-3.5 px-4">Last Test Date</th>
                <th className="py-3.5 px-4">Retest Status</th>
                <th className="py-3.5 px-4 text-right">Potential Earning</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClients.map((client) => {
                const isOverdue = client.status === "Overdue"
                const isDueSoon = client.status === "Due Soon"

                return (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0">
                          {client.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {client.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {client.mobile} • {client.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Last Package */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[220px]">
                        {client.lastProfile}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        RR ₹{client.realizedRevenue}
                      </div>
                    </td>

                    {/* Last Test Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div>{client.lastTestDate}</div>
                      <div className="text-[10px] text-slate-400 font-mono">({client.daysAgo} days ago)</div>
                    </td>

                    {/* Retest Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                        isOverdue 
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : isDueSoon
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isOverdue ? "bg-rose-500" : isDueSoon ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        <span>{client.statusLabel}</span>
                      </span>
                    </td>

                    {/* Potential Earning */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-black text-sm text-emerald-700">
                        +₹{client.repeatIncentive}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">30% Direct</div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSendNudge(client)}
                        className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Dedicated Box Containers (Cards) */}
        <div className="lg:hidden space-y-3">
          {paginatedClients.map((client) => {
            const isOverdue = client.status === "Overdue"
            const isDueSoon = client.status === "Due Soon"

            return (
              <div 
                key={client.id} 
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs space-y-3"
              >
                {/* Header Row: Avatar, Client Name & Repeat Earning */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-[#251b5c] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                      {client.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-sm text-slate-900 truncate">{client.customerName}</div>
                      <div className="text-[11.5px] text-slate-500 font-medium truncate mt-0.5">
                        {client.city} • {client.mobile}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-base text-emerald-700">+₹{client.repeatIncentive}</div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 inline-block mt-0.5">
                      30% Repeat
                    </span>
                  </div>
                </div>

                {/* Package & Last Test Box Grid */}
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs">
                  <div className="font-bold text-slate-800 text-xs truncate">
                    {client.lastProfile}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Last Test: <strong>{client.lastTestDate}</strong></span>
                    <span className="font-mono text-slate-400">({client.daysAgo} days ago)</span>
                  </div>
                </div>

                {/* Action Buttons & Status Row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                  <span className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border inline-flex items-center gap-1 ${
                    isOverdue 
                      ? "bg-rose-50 text-rose-800 border-rose-200" 
                      : isDueSoon 
                      ? "bg-amber-50 text-amber-800 border-amber-200" 
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isOverdue ? "bg-rose-500" : isDueSoon ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                    <span>{client.statusLabel}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${client.mobile}`}
                      className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                      title="Call Client"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleSendNudge(client)}
                      className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Reminder</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
            <User className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No retest clients found matching your filter</p>
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
        {filteredClients.length > 0 && (
          <div className="p-4 bg-white border border-slate-200/90 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{filteredClients.length}</span> clients
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
