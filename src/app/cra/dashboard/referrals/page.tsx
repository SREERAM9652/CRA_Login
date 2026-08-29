"use client"

import { useState } from "react"
import Link from "next/link"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Calendar, 
  Coins, 
  Sparkles,
  FileText,
  User,
  FlaskConical,
  Check,
  X,
  MessageCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export interface CustomerLeadRecord {
  id: string
  avatar: string
  name: string
  mobile: string
  city: string
  packageName: string
  parameters: number
  realizedRevenue: number
  directIncentive: number
  teamBonus: number
  owner: "me" | "c2"
  c2PartnerName?: string
  status: "New" | "Contacted" | "Client Onboarded" | "Test Scheduled" | "Report Delivered"
  statusSubtext: string
  date: string
}

const INITIAL_LEADS: CustomerLeadRecord[] = [
  {
    id: "LEAD-101",
    avatar: "AR",
    name: "Anita Rao",
    mobile: "+91 98765 43210",
    city: "Pune",
    packageName: "Full Body Wellness Profile",
    parameters: 62,
    realizedRevenue: 800,
    directIncentive: 240,
    teamBonus: 80,
    owner: "me",
    status: "Report Delivered",
    statusSubtext: "Report delivered • via you",
    date: "28 Aug 2026, 10:30 AM"
  },
  {
    id: "LEAD-102",
    avatar: "SI",
    name: "Suresh Iyer",
    mobile: "+91 98450 11223",
    city: "Mumbai",
    packageName: "Executive Heart & Cardiac Risk Profile",
    parameters: 58,
    realizedRevenue: 1600,
    directIncentive: 480,
    teamBonus: 160,
    owner: "me",
    status: "Test Scheduled",
    statusSubtext: "Sample collection scheduled for tomorrow 7:30 AM",
    date: "28 Aug 2026, 09:15 AM"
  },
  {
    id: "LEAD-103",
    avatar: "MK",
    name: "Meena K.",
    mobile: "+91 98220 55441",
    city: "Bengaluru",
    packageName: "Women Advanced Wellness Profile",
    parameters: 54,
    realizedRevenue: 1200,
    directIncentive: 360,
    teamBonus: 120,
    owner: "c2",
    c2PartnerName: "SAI MAHENDRA",
    status: "Report Delivered",
    statusSubtext: "Converted • via SAI MAHENDRA (C2)",
    date: "27 Aug 2026, 04:15 PM"
  },
  {
    id: "LEAD-104",
    avatar: "FA",
    name: "Farhan Ali",
    mobile: "+91 98110 77889",
    city: "Hyderabad",
    packageName: "Comprehensive Master Health Checkup",
    parameters: 68,
    realizedRevenue: 800,
    directIncentive: 240,
    teamBonus: 80,
    owner: "c2",
    c2PartnerName: "SUDHEER REDDY",
    status: "New",
    statusSubtext: "New lead submitted • via SUDHEER REDDY (C2)",
    date: "27 Aug 2026, 02:30 PM"
  },
  {
    id: "LEAD-105",
    avatar: "DP",
    name: "Divya Pillai",
    mobile: "+91 98330 22334",
    city: "Chennai",
    packageName: "Diabetic Comprehensive Management",
    parameters: 48,
    realizedRevenue: 960,
    directIncentive: 288,
    teamBonus: 96,
    owner: "c2",
    c2PartnerName: "SUDHEER REDDY",
    status: "Report Delivered",
    statusSubtext: "Report delivered • via SUDHEER REDDY (C2)",
    date: "26 Aug 2026, 11:00 AM"
  },
  {
    id: "LEAD-106",
    avatar: "KJ",
    name: "Karan Joshi",
    mobile: "+91 98990 44556",
    city: "Pune",
    packageName: "Senior Citizen Comprehensive Care",
    parameters: 64,
    realizedRevenue: 1440,
    directIncentive: 432,
    teamBonus: 144,
    owner: "c2",
    c2PartnerName: "SAI MAHENDRA",
    status: "Client Onboarded",
    statusSubtext: "Converted • via SAI MAHENDRA (C2)",
    date: "25 Aug 2026, 05:00 PM"
  },
  {
    id: "LEAD-107",
    avatar: "VS",
    name: "Vikram Singhania",
    mobile: "+91 98770 66778",
    city: "Bengaluru",
    packageName: "Executive Heart & Cardiac Risk",
    parameters: 58,
    realizedRevenue: 1600,
    directIncentive: 480,
    teamBonus: 160,
    owner: "me",
    status: "Contacted",
    statusSubtext: "Call completed • Awaiting time slot confirmation",
    date: "24 Aug 2026, 03:45 PM"
  },
  {
    id: "LEAD-108",
    avatar: "SS",
    name: "Sneha Sen",
    mobile: "+91 98440 88990",
    city: "Kolkata",
    packageName: "Thyroid & Hormone Complete Profile",
    parameters: 36,
    realizedRevenue: 720,
    directIncentive: 216,
    teamBonus: 72,
    owner: "c2",
    c2PartnerName: "SUDHEER REDDY",
    status: "Test Scheduled",
    statusSubtext: "Sample collection scheduled for Friday morning",
    date: "23 Aug 2026, 10:15 AM"
  },
  {
    id: "LEAD-109",
    avatar: "AG",
    name: "Amit Gupta",
    mobile: "+91 98660 11445",
    city: "Pune",
    packageName: "Full Body Wellness Profile",
    parameters: 62,
    realizedRevenue: 800,
    directIncentive: 240,
    teamBonus: 80,
    owner: "me",
    status: "Report Delivered",
    statusSubtext: "Report delivered • via you",
    date: "22 Aug 2026, 01:20 PM"
  },
  {
    id: "LEAD-110",
    avatar: "PB",
    name: "Pooja Bannerjee",
    mobile: "+91 98230 44112",
    city: "Kolkata",
    packageName: "Liver & Gastrointestinal Vitality",
    parameters: 42,
    realizedRevenue: 960,
    directIncentive: 288,
    teamBonus: 96,
    owner: "c2",
    c2PartnerName: "SAI MAHENDRA",
    status: "Report Delivered",
    statusSubtext: "Report delivered • via SAI MAHENDRA (C2)",
    date: "20 Aug 2026, 02:45 PM"
  },
  {
    id: "LEAD-111",
    avatar: "MD",
    name: "Manish Deshmukh",
    mobile: "+91 98900 33774",
    city: "Mumbai",
    packageName: "Executive Heart & Cardiac Risk",
    parameters: 58,
    realizedRevenue: 1600,
    directIncentive: 480,
    teamBonus: 160,
    owner: "me",
    status: "Client Onboarded",
    statusSubtext: "Profile confirmed • Home collection requested",
    date: "19 Aug 2026, 04:30 PM"
  },
  {
    id: "LEAD-112",
    avatar: "RM",
    name: "Rahul Mehta",
    mobile: "+91 98210 99443",
    city: "Pune",
    packageName: "Full Body Wellness Profile",
    parameters: 62,
    realizedRevenue: 800,
    directIncentive: 240,
    teamBonus: 80,
    owner: "me",
    status: "Report Delivered",
    statusSubtext: "Report delivered • via you",
    date: "18 Aug 2026, 11:20 AM"
  },
  {
    id: "LEAD-113",
    avatar: "NK",
    name: "Nandini Kulkarni",
    mobile: "+91 98450 77112",
    city: "Bengaluru",
    packageName: "Women Advanced Wellness Profile",
    parameters: 54,
    realizedRevenue: 1200,
    directIncentive: 360,
    teamBonus: 120,
    owner: "c2",
    c2PartnerName: "SUDHEER REDDY",
    status: "Test Scheduled",
    statusSubtext: "Home collection booked for Sunday",
    date: "17 Aug 2026, 09:00 AM"
  },
  {
    id: "LEAD-114",
    avatar: "TS",
    name: "Tarun Sharma",
    mobile: "+91 98110 33221",
    city: "Hyderabad",
    packageName: "Diabetic Comprehensive Management",
    parameters: 48,
    realizedRevenue: 960,
    directIncentive: 288,
    teamBonus: 96,
    owner: "me",
    status: "Report Delivered",
    statusSubtext: "Report delivered • via you",
    date: "16 Aug 2026, 03:15 PM"
  },
  {
    id: "LEAD-115",
    avatar: "SB",
    name: "Sunita Bhatt",
    mobile: "+91 98330 66554",
    city: "Mumbai",
    packageName: "Senior Citizen Comprehensive Care",
    parameters: 64,
    realizedRevenue: 1440,
    directIncentive: 432,
    teamBonus: 144,
    owner: "c2",
    c2PartnerName: "SAI MAHENDRA",
    status: "Client Onboarded",
    statusSubtext: "Onboarded via SAI MAHENDRA (C2)",
    date: "15 Aug 2026, 01:45 PM"
  }
]

const STAGE_FILTERS = [
  { id: "All", label: "All Stages" },
  { id: "New", label: "New Lead" },
  { id: "Contacted", label: "Contacted" },
  { id: "Client Onboarded", label: "Onboarded" },
  { id: "Test Scheduled", label: "Scheduled" },
  { id: "Report Delivered", label: "Delivered" }
]

export default function MyCustomersLeadsPage() {
  const { currentUser } = useWorkflowStore()
  const isC1 = currentUser.role === "c1"

  const [activeOwnerTab, setActiveOwnerTab] = useState<"all" | "me" | "c2">("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<CustomerLeadRecord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter leads based on tab, status, and search query
  const filteredLeads = INITIAL_LEADS.filter((lead) => {
    // Owner tab filter
    if (activeOwnerTab === "me" && lead.owner !== "me") return false
    if (activeOwnerTab === "c2" && lead.owner !== "c2") return false

    // Status filter
    if (selectedStatusFilter !== "All" && lead.status !== selectedStatusFilter) return false

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      const matches = 
        lead.name.toLowerCase().includes(q) ||
        lead.mobile.includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.packageName.toLowerCase().includes(q) ||
        (lead.c2PartnerName && lead.c2PartnerName.toLowerCase().includes(q))
      if (!matches) return false
    }

    return true
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLeads.length)
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex)

  // Counts for tabs
  const totalCount = INITIAL_LEADS.length
  const meCount = INITIAL_LEADS.filter(l => l.owner === "me").length
  const c2Count = INITIAL_LEADS.filter(l => l.owner === "c2").length

  const handleTabChange = (tab: "all" | "me" | "c2") => {
    setActiveOwnerTab(tab)
    setCurrentPage(1)
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatusFilter(status)
    setCurrentPage(1)
  }

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            My Customers &amp; Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {isC1 
              ? `${totalCount} total referrals across you (${meCount}) and your team (${c2Count})`
              : "Track all diagnostic referrals submitted by you directly"
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cra/dashboard/add-lead"
            className="h-10 px-4 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Refer a Customer</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Stage Chips Toolbar */}
      <div className="space-y-3 pt-1">
        
        {/* Row 1: Owner Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOwnerTab === "all"
                ? "bg-[#251b5c] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("me")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeOwnerTab === "me"
                ? "bg-[#251b5c] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Referred by Me ({meCount})
          </button>

          {isC1 && (
            <button
              type="button"
              onClick={() => handleTabChange("c2")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeOwnerTab === "c2"
                  ? "bg-[#251b5c] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Secondary CRAs ({c2Count})
            </button>
          )}
        </div>

        {/* Row 2: Stage Chips Filter (Wrapped nicely, no horizontal scroll clipping) */}
        <div className="flex flex-wrap items-center gap-1.5 py-0.5">
          {STAGE_FILTERS.map((stage) => {
            const isSelected = selectedStatusFilter === stage.id
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleStatusChange(stage.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {stage.label}
              </button>
            )
          })}
        </div>

        {/* Row 3: Search Input */}
        <div className="relative w-full">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search customer, phone, city, or package..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#382685] shadow-2xs"
          />
        </div>

      </div>

      {/* Data Presentation: Desktop Structured Table vs Mobile Dedicated Box Containers */}
      <div className="space-y-3">
        
        {/* Desktop Structured Table */}
        <div className="hidden lg:block bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f8f9fc] border-b border-slate-200/80 text-slate-400 font-extrabold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-3.5 px-5">Customer &amp; Location</th>
                <th className="py-3.5 px-4">Interested Wellness Profile</th>
                <th className="py-3.5 px-4">Referral Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Realised Revenue</th>
                <th className="py-3.5 px-5 text-right">Your Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeads.map((lead) => {
                const isDirect = lead.owner === "me"
                const isDelivered = lead.status === "Report Delivered"
                const isScheduled = lead.status === "Test Scheduled"
                const isNew = lead.status === "New"
                const isOnboarded = lead.status === "Client Onboarded"

                return (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Customer & Location */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0 group-hover:border-purple-300 transition-colors">
                          {lead.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{lead.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{lead.mobile}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{lead.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Wellness Profile */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[220px]">
                        {lead.packageName}
                      </div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">
                        {lead.parameters} Test Parameters • {lead.date}
                      </div>
                    </td>

                    {/* Referral Source */}
                    <td className="py-3.5 px-4">
                      {isDirect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-md bg-blue-50 text-[#2F5FDE] font-mono text-[10.5px] font-bold border border-blue-200/60">
                          Direct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-md bg-slate-100 text-slate-700 font-mono text-[10.5px] font-bold border border-slate-200">
                          via {lead.c2PartnerName} (C2)
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                        isDelivered 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : isScheduled
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : isNew
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : isOnboarded
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : "bg-blue-50 text-[#2F5FDE] border-blue-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isDelivered ? "bg-emerald-600" : isScheduled ? "bg-amber-500" : isNew ? "bg-slate-400" : "bg-[#2F5FDE]"
                        }`} />
                        <span>{lead.status}</span>
                      </span>
                    </td>

                    {/* Realised Revenue */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-black text-sm text-slate-900">
                        ₹{lead.realizedRevenue}
                      </div>
                      <div className="text-[10px] text-slate-400">RR Realized</div>
                    </td>

                    {/* Your Earning */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="font-mono font-black text-sm text-emerald-700">
                        +₹{isDirect ? lead.directIncentive : lead.teamBonus}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">
                        {isDirect ? "30% Direct" : "10% Override"}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Dedicated Responsive Box Containers (Cards) */}
        <div className="lg:hidden space-y-3">
          {paginatedLeads.map((lead) => {
            const isDirect = lead.owner === "me"
            const isDelivered = lead.status === "Report Delivered"
            const isScheduled = lead.status === "Test Scheduled"
            const isNew = lead.status === "New"
            const isOnboarded = lead.status === "Client Onboarded"

            return (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs space-y-3 hover:border-slate-300 transition-colors cursor-pointer"
              >
                {/* Header Row: Avatar, Name, Package & Earnings */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-[#251b5c] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                      {lead.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-sm text-slate-900 truncate">
                        {lead.name}
                      </div>
                      <div className="text-[11.5px] text-slate-500 font-medium truncate mt-0.5">
                        {lead.packageName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-base text-emerald-700">
                      +₹{isDirect ? lead.directIncentive : lead.teamBonus}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/70 inline-block mt-0.5">
                      {isDirect ? "30% Direct" : "10% Override"}
                    </span>
                  </div>
                </div>

                {/* Inner Financial & Location Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Order Revenue (RR)</span>
                    <p className="font-mono font-black text-slate-800 text-sm mt-0.5">₹{lead.realizedRevenue}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Source</span>
                    <p className="font-bold text-slate-700 text-xs mt-0.5 truncate">
                      {isDirect ? "Direct" : `via ${lead.c2PartnerName}`}
                    </p>
                  </div>
                </div>

                {/* Footer Row: Status Pill on Left, Location & Date on Right */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80 text-xs">
                  <span className={`px-2.5 py-0.8 rounded-lg text-[10.5px] font-bold border inline-flex items-center gap-1 ${
                    isDelivered 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : isScheduled
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : isNew
                      ? "bg-slate-100 text-slate-700 border-slate-200"
                      : isOnboarded
                      ? "bg-purple-50 text-purple-800 border-purple-200"
                      : "bg-blue-50 text-[#2F5FDE] border-blue-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isDelivered ? "bg-emerald-600" : isScheduled ? "bg-amber-500" : isNew ? "bg-slate-400" : "bg-[#2F5FDE]"
                    }`} />
                    <span>{lead.status}</span>
                  </span>

                  <div className="text-slate-400 font-medium text-[11px] truncate text-right">
                    <span>{lead.city}</span>
                    <span className="mx-1">•</span>
                    <span>{lead.date.split(",")[0]}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
            <User className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No customer referrals found matching your filter</p>
            <button
              type="button"
              onClick={() => {
                setActiveOwnerTab("all")
                setSelectedStatusFilter("All")
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
        {filteredLeads.length > 0 && (
          <div className="p-4 bg-white border border-slate-200/90 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{filteredLeads.length}</span> referrals
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

      {/* Slide-Over Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#251b5c] text-white flex items-center justify-center font-mono font-bold text-xs">
                  {selectedLead.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-500">{selectedLead.mobile} • {selectedLead.city}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Realised Revenue</span>
                <p className="font-mono font-black text-slate-900 text-base mt-0.5">₹{selectedLead.realizedRevenue}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Your Incentive</span>
                <p className="font-mono font-black text-emerald-700 text-base mt-0.5">
                  +₹{selectedLead.owner === "me" ? selectedLead.directIncentive : selectedLead.teamBonus}
                </p>
              </div>
            </div>

            {/* Profile & Status */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Wellness Package</span>
                <span className="font-bold text-slate-900">{selectedLead.packageName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Referral Source</span>
                <span className="font-bold text-slate-900">
                  {selectedLead.owner === "me" ? "Direct Referral" : `via ${selectedLead.c2PartnerName} (C2)`}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current Status</span>
                <span className="font-bold text-[#251b5c]">{selectedLead.status}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Date Logged</span>
                <span className="font-mono text-slate-700">{selectedLead.date}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`tel:${selectedLead.mobile}`}
                className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call Client</span>
              </a>
              <a
                href={`https://wa.me/${selectedLead.mobile.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
