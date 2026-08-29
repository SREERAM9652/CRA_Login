"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  Users, 
  UserPlus, 
  Search,
  Plus, 
  Coins, 
  Copy, 
  Check, 
  Share2, 
  Phone, 
  MapPin, 
  Calendar, 
  X, 
  User, 
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  TrendingUp
} from "lucide-react"

export interface C2TeamMember {
  id: string
  avatar: string
  name: string
  mobile: string
  city: string
  joinedDate: string
  customersCount: number
  totalRR: number
  overrideIncentive: number
  status: "Active" | "Pending KYC"
}

const INITIAL_C2_MEMBERS: C2TeamMember[] = [
  {
    id: "C2-01",
    avatar: "SR",
    name: "SUDHEER REDDY",
    mobile: "+91 98860 54321",
    city: "Bengaluru",
    joinedDate: "Mar 2025",
    customersCount: 7,
    totalRR: 9600,
    overrideIncentive: 960,
    status: "Active"
  },
  {
    id: "C2-02",
    avatar: "SM",
    name: "SAI MAHENDRA",
    mobile: "+91 97400 98765",
    city: "Pune",
    joinedDate: "May 2025",
    customersCount: 6,
    totalRR: 7800,
    overrideIncentive: 780,
    status: "Active"
  },
  {
    id: "C2-03",
    avatar: "VV",
    name: "VISHNU VARDHAN",
    mobile: "+91 98220 77112",
    city: "Vijayawada",
    joinedDate: "Jun 2025",
    customersCount: 4,
    totalRR: 4800,
    overrideIncentive: 480,
    status: "Active"
  },
  {
    id: "C2-04",
    avatar: "AK",
    name: "Anand Kulkarni",
    mobile: "+91 98330 11229",
    city: "Pune",
    joinedDate: "Aug 2025",
    customersCount: 5,
    totalRR: 6400,
    overrideIncentive: 640,
    status: "Active"
  },
  {
    id: "C2-05",
    avatar: "MB",
    name: "Meera Bannerjee",
    mobile: "+91 98210 44558",
    city: "Kolkata",
    joinedDate: "Sep 2025",
    customersCount: 3,
    totalRR: 3800,
    overrideIncentive: 380,
    status: "Active"
  },
  {
    id: "C2-06",
    avatar: "VK",
    name: "Vijay Kapoor",
    mobile: "+91 98190 77665",
    city: "Mumbai",
    joinedDate: "Oct 2025",
    customersCount: 6,
    totalRR: 7800,
    overrideIncentive: 780,
    status: "Active"
  },
  {
    id: "C2-07",
    avatar: "SM",
    name: "Sunita Menon",
    mobile: "+91 98450 33221",
    city: "Chennai",
    joinedDate: "Nov 2025",
    customersCount: 2,
    totalRR: 2400,
    overrideIncentive: 240,
    status: "Active"
  },
  {
    id: "C2-08",
    avatar: "DK",
    name: "Deepak Kumar",
    mobile: "+91 98660 55443",
    city: "Hyderabad",
    joinedDate: "Dec 2025",
    customersCount: 4,
    totalRR: 4800,
    overrideIncentive: 480,
    status: "Active"
  },
  {
    id: "C2-09",
    avatar: "RP",
    name: "Ritu Patel",
    mobile: "+91 98770 88992",
    city: "Pune",
    joinedDate: "Jan 2026",
    customersCount: 3,
    totalRR: 3600,
    overrideIncentive: 360,
    status: "Active"
  },
  {
    id: "C2-10",
    avatar: "AS",
    name: "Alok Singh",
    mobile: "+91 98330 99001",
    city: "Mumbai",
    joinedDate: "Feb 2026",
    customersCount: 1,
    totalRR: 1200,
    overrideIncentive: 120,
    status: "Active"
  },
  {
    id: "C2-11",
    avatar: "TG",
    name: "Tanvi Gupta",
    mobile: "+91 98110 55667",
    city: "Bengaluru",
    joinedDate: "Feb 2026",
    customersCount: 2,
    totalRR: 2800,
    overrideIncentive: 280,
    status: "Active"
  }
]

const TEAM_FILTERS = [
  { id: "all", label: "All Partners" },
  { id: "top", label: "Top Referrers (>3 Tests)" },
  { id: "pune", label: "Pune" },
  { id: "bengaluru", label: "Bengaluru" },
  { id: "mumbai", label: "Mumbai" },
  { id: "hyderabad", label: "Hyderabad" }
]

export default function MyTeamPage() {
  const { currentUser } = useWorkflowStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<C2TeamMember | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // New C2 Form State
  const [newC2, setNewC2] = useState({ name: "", mobile: "", city: "Pune" })
  
  const initialMembersForUser = currentUser.role === "c1"
    ? INITIAL_C2_MEMBERS
    : currentUser.id === "C2-MAHENDRA"
    ? [
        {
          id: "C2-03",
          avatar: "VV",
          name: "VISHNU VARDHAN",
          mobile: "+91 98220 77112",
          city: "Vijayawada",
          joinedDate: "Jun 2025",
          customersCount: 4,
          totalRR: 4800,
          overrideIncentive: 480,
          status: "Active" as const
        }
      ]
    : []

  const [c2List, setC2List] = useState<C2TeamMember[]>(initialMembersForUser)
  const [addSuccessToast, setAddSuccessToast] = useState(false)

  // Sync with user switch
  useEffect(() => {
    setC2List(
      currentUser.role === "c1"
        ? INITIAL_C2_MEMBERS
        : currentUser.id === "C2-MAHENDRA"
        ? [
            {
              id: "C2-03",
              avatar: "VV",
              name: "VISHNU VARDHAN",
              mobile: "+91 98220 77112",
              city: "Vijayawada",
              joinedDate: "Jun 2025",
              customersCount: 4,
              totalRR: 4800,
              overrideIncentive: 480,
              status: "Active" as const
            }
          ]
        : []
    )
  }, [currentUser])

  const handleAddC2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newC2.name || !newC2.mobile) return

    const newMember: C2TeamMember = {
      id: `C2-${c2List.length + 1 < 10 ? "0" : ""}${c2List.length + 1}`,
      avatar: newC2.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "C2",
      name: newC2.name,
      mobile: newC2.mobile,
      city: newC2.city,
      joinedDate: "Just now",
      customersCount: 0,
      totalRR: 0,
      overrideIncentive: 0,
      status: "Active"
    }

    setC2List([newMember, ...c2List])
    setIsInviteModalOpen(false)
    setAddSuccessToast(true)
    setTimeout(() => setAddSuccessToast(false), 3500)
    setNewC2({ name: "", mobile: "", city: "Pune" })
  }

  // Filtered list
  const filteredC2s = c2List.filter(c => {
    // Filter chips
    if (selectedFilter === "top" && c.customersCount <= 3) return false
    if (selectedFilter === "pune" && !c.city.toLowerCase().includes("pune")) return false
    if (selectedFilter === "bengaluru" && !c.city.toLowerCase().includes("bengaluru")) return false
    if (selectedFilter === "mumbai" && !c.city.toLowerCase().includes("mumbai")) return false
    if (selectedFilter === "hyderabad" && !c.city.toLowerCase().includes("hyderabad")) return false

    // Search query
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    )
  })

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredC2s.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredC2s.length)
  const paginatedC2s = filteredC2s.slice(startIndex, endIndex)

  // Totals
  const totalC2Revenue = c2List.reduce((sum, c) => sum + c.totalRR, 0)
  const totalOverrideEarned = c2List.reduce((sum, c) => sum + c.overrideIncentive, 0)
  const totalCustomersReferred = c2List.reduce((sum, c) => sum + c.customersCount, 0)

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    setCurrentPage(1)
  }

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Toast Notification */}
      {addSuccessToast && (
        <div className="p-3.5 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between border border-emerald-400/30">
          <span>✓ New Secondary CRA partner onboarded successfully!</span>
          <button onClick={() => setAddSuccessToast(false)} className="text-emerald-300 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            My Team (Secondary CRAs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage your introduced partner network • You receive a flat <strong>10% team bonus</strong> on all tests they complete
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Introduce Secondary CRA</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Secondary Partners</div>
          <div className="font-mono text-3xl font-black text-slate-900">{c2List.length}</div>
          <p className="text-[10.5px] text-slate-500 font-medium">{totalCustomersReferred} total tests referred</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Team Test Revenue (RR)</div>
          <div className="font-mono text-3xl font-black text-slate-900">₹{totalC2Revenue.toLocaleString("en-IN")}</div>
          <p className="text-[10.5px] text-slate-500 font-medium">Realized revenue generated by team</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/70 rounded-3xl p-5 border border-purple-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#382685]">Your 10% Team Bonus</div>
          <div className="font-mono text-3xl font-black text-[#382685]">₹{totalOverrideEarned.toLocaleString("en-IN")}</div>
          <p className="text-[10.5px] text-purple-700 font-bold">10% override on all team bookings</p>
        </div>
      </div>

      {/* Filter Chips & Search Toolbar */}
      <div className="space-y-3 pt-1">
        
        {/* Filter Chips Bar (Wrapped cleanly without horizontal scroll cutoffs) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {TEAM_FILTERS.map((f) => {
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
            placeholder="Search partner by name, mobile number, or city..."
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
                <th className="py-3.5 px-5">Partner Name &amp; Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-center">Tests Referred</th>
                <th className="py-3.5 px-4 text-right">Team Revenue (RR)</th>
                <th className="py-3.5 px-5 text-right">Your 10% Override</th>
                <th className="py-3.5 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedC2s.map((member) => (
                <tr 
                  key={member.id}
                  onClick={() => setSelectedPartner(member)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Partner Name */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0 group-hover:border-purple-300 transition-colors">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{member.name}</span>
                          <span className="text-[10.5px] font-mono text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                            {member.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {member.mobile}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {member.city}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {member.joinedDate}
                  </td>

                  {/* Tests Referred */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                      {member.customersCount} Tests
                    </span>
                  </td>

                  {/* Team Revenue */}
                  <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-slate-900">
                    ₹{member.totalRR.toLocaleString("en-IN")}
                  </td>

                  {/* Your 10% Override */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="font-mono font-black text-sm text-emerald-700">
                      +₹{member.overrideIncentive.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600">
                      10% Override
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>{member.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Dedicated Box Containers (Cards) */}
        <div className="lg:hidden space-y-3">
          {paginatedC2s.map((member) => (
            <div 
              key={member.id} 
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs space-y-3"
            >
              {/* Top Row: Avatar, Partner Name & 10% Override */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] to-[#382685] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="font-black text-sm text-slate-900 truncate">{member.name}</div>
                      <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                        {member.id}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-slate-500 font-medium truncate mt-0.5">
                      {member.city} • Joined {member.joinedDate}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-base text-emerald-700">+₹{member.overrideIncentive}</div>
                  <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/70 inline-block mt-0.5">
                    10% Bonus
                  </span>
                </div>
              </div>

              {/* Metrics Grid Box inside Container */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tests Referred</span>
                  <p className="font-mono font-black text-slate-900 text-sm mt-0.5">{member.customersCount} Tests</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Team Revenue (RR)</span>
                  <p className="font-mono font-black text-slate-900 text-sm mt-0.5">₹{member.totalRR.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100/80">
                <a
                  href={`tel:${member.mobile}`}
                  className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${member.mobile.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(member)}
                  className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredC2s.length === 0 && (
          <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
            <User className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No Secondary CRAs found matching your filter</p>
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
        {filteredC2s.length > 0 && (
          <div className="p-4 bg-white border border-slate-200/90 rounded-3xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to <span className="font-bold text-slate-800">{endIndex}</span> of <span className="font-bold text-slate-800">{filteredC2s.length}</span> partners
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

      {/* Introduce Secondary CRA Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">Introduce Secondary CRA</h3>
                <p className="text-xs text-slate-500">Add a sub-partner under your referral umbrella</p>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddC2} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partner Full Name</label>
                <input
                  type="text"
                  required
                  value={newC2.name}
                  onChange={(e) => setNewC2({ ...newC2, name: e.target.value })}
                  placeholder="e.g. Priya Shah"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newC2.mobile}
                  onChange={(e) => setNewC2({ ...newC2, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={newC2.city}
                  onChange={(e) => setNewC2({ ...newC2, city: e.target.value })}
                  placeholder="e.g. Pune, Mumbai, Bengaluru"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl text-xs text-purple-900">
                You will receive a permanent <strong>10% override</strong> on all diagnostic bookings completed by this partner.
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Onboard Secondary CRA Partner
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Partner Detail Slide-over Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#251b5c] text-white flex items-center justify-center font-mono font-bold text-xs">
                  {selectedPartner.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedPartner.name}</h3>
                  <p className="text-xs text-slate-500">{selectedPartner.city} • Joined {selectedPartner.joinedDate}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tests Referred</span>
                <p className="font-mono font-black text-slate-900 text-lg mt-0.5">{selectedPartner.customersCount}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Your 10% Override</span>
                <p className="font-mono font-black text-emerald-700 text-lg mt-0.5">+₹{selectedPartner.overrideIncentive}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={`tel:${selectedPartner.mobile}`}
                className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="h-4 w-4" />
                <span>Call Partner</span>
              </a>
              <a
                href={`https://wa.me/${selectedPartner.mobile.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
