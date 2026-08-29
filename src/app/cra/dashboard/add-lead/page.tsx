"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { 
  Sparkles, 
  Check, 
  Copy, 
  Share2, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Coins, 
  CheckCircle2, 
  ChevronDown, 
  Search, 
  FlaskConical,
  Users2,
  X,
  Plus,
  Trash2
} from "lucide-react"

export interface CombinedTestItem {
  id: string
  type: "package" | "test"
  code: string
  name: string
  category: string
  mrp: number
  discount: number
  realizedRevenue: number
  parameterCount: string
  directIncentive: number
  teamOverride: number
}

export default function AddReferralPage() {
  const router = useRouter()
  const { currentUser, createCustomerBooking } = useWorkflowStore()
  const isC1 = currentUser.role === "c1"

  // Unified items list: 12 Curated Packages + 90+ Clinical Tests
  const allAvailableItems = useMemo<CombinedTestItem[]>(() => {
    const packages: CombinedTestItem[] = HEALTH_PACKAGES.map((pkg, idx) => {
      const discount = Math.round(pkg.mrp * 0.20)
      const rr = pkg.mrp - discount
      return {
        id: pkg.id,
        type: "package",
        code: `PKG-${idx + 1 < 10 ? "0" : ""}${idx + 1}`,
        name: pkg.name,
        category: "Curated Wellness Profiles",
        mrp: pkg.mrp,
        discount: discount,
        realizedRevenue: rr,
        parameterCount: `${pkg.parameterCount} Tests`,
        directIncentive: Math.round(rr * 0.30),
        teamOverride: Math.round(rr * 0.10)
      }
    })

    const tests: CombinedTestItem[] = CRA_TESTS.map((test) => {
      const discount = Math.round(test.catalogueRate * 0.20)
      const rr = test.catalogueRate - discount
      return {
        id: `test-${test.code}`,
        type: "test",
        code: test.code,
        name: test.name,
        category: test.category || "Diagnostic Tests",
        mrp: test.catalogueRate,
        discount: discount,
        realizedRevenue: rr,
        parameterCount: `${test.sample || "Blood"} • ${test.technology || "Lab Test"}`,
        directIncentive: Math.round(rr * 0.30),
        teamOverride: Math.round(rr * 0.10)
      }
    })

    return [...packages, ...tests]
  }, [])

  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [city, setCity] = useState("Pune")
  
  // MULTIPLE TEST SELECTION STATE (Defaults to popular tests matching mockup)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    "test-H6",
    "test-CUA"
  ])
  
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "packages" | "tests">("all")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Multi-Selection Helper Functions
  const handleToggleItem = (itemId: string) => {
    if (selectedItemIds.includes(itemId)) {
      if (selectedItemIds.length > 1) {
        setSelectedItemIds(selectedItemIds.filter(id => id !== itemId))
      }
    } else {
      setSelectedItemIds([...selectedItemIds, itemId])
    }
  }

  const handleRemoveItem = (itemId: string) => {
    if (selectedItemIds.length > 1) {
      setSelectedItemIds(selectedItemIds.filter(id => id !== itemId))
    }
  }

  // Selected Items & Combined Financials
  const selectedItems = allAvailableItems.filter(item => selectedItemIds.includes(item.id))
  const totalMrp = selectedItems.reduce((sum, item) => sum + item.mrp, 0)
  const totalCustomerDiscount = selectedItems.reduce((sum, item) => sum + item.discount, 0)
  const totalRealizedRevenue = selectedItems.reduce((sum, item) => sum + item.realizedRevenue, 0)
  const totalDirectIncentive = Math.round(totalRealizedRevenue * 0.30)
  const totalTeamOverride = Math.round(totalRealizedRevenue * 0.10)

  // Filter packages & tests by tab and search
  const filteredItems = allAvailableItems.filter(item => {
    if (activeTab === "packages" && item.type !== "package") return false
    if (activeTab === "tests" && item.type !== "test") return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !mobile || selectedItems.length === 0) return

    const primaryItem = selectedItems[0]
    const compositeName = selectedItems.length === 1 
      ? primaryItem.name 
      : `${primaryItem.name} + ${selectedItems.length - 1} more test${selectedItems.length > 2 ? 's' : ''}`

    createCustomerBooking({
      customerName: fullName,
      mobile: mobile,
      email: `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      profileId: primaryItem.id,
      profileName: compositeName,
      cataloguePrice: totalMrp,
      discount: totalCustomerDiscount,
      realizedRevenue: totalRealizedRevenue,
      homeCollectionFee: 0,
      totalPayable: totalRealizedRevenue
    })

    setSubmitted(true)
  }

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/booking?ref=${currentUser.code}&items=${selectedItemIds.join(",")}`
    : `https://avmlabs.com/booking?ref=${currentUser.code}`

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full font-sans space-y-6 pb-12">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/cra/dashboard" className="hover:text-indigo-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Refer a Customer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Log a new B2C client prospect • Select single or multiple tests • Follow-up within 24 hours
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cra/dashboard/catalog"
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Package className="h-4 w-4 text-[#382685]" />
            <span>Wellness Catalogue ({allAvailableItems.length} Tests)</span>
          </Link>
        </div>
      </div>

      {submitted ? (
        /* Success State */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto text-center shadow-sm">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Referral Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
              Our central medical operations team will contact <strong>{fullName}</strong> ({mobile}) within 24 hours to schedule their sample collection for {selectedItems.length} test{selectedItems.length > 1 ? 's' : ''}.
            </p>
          </div>

          {/* Incentive Summary Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tests Selected ({selectedItems.length})</div>
              <div className="font-bold text-slate-900 truncate mt-0.5">
                {selectedItems.map(i => i.name).join(", ")}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Patient Pays (20% Off)</div>
              <div className="font-mono font-black text-emerald-700 mt-0.5">₹{totalRealizedRevenue.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Your 30% Incentive</div>
              <div className="font-mono font-black text-[#2F5FDE] mt-0.5">+₹{totalDirectIncentive.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Team 10% Override</div>
              <div className="font-mono font-black text-purple-700 mt-0.5">+₹{totalTeamOverride.toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setFullName("")
                setMobile("")
                setNotes("")
                setSelectedItemIds([allAvailableItems[0].id])
              }}
              className="h-11 px-5 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              + Refer Another Customer
            </button>
            <Link
              href="/cra/dashboard/referrals"
              className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View My Leads &amp; Status</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* The SARC-Simple 1-Screen Referral Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            
            <div className="space-y-4">
              
              {/* Field 1: Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anita Rao"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                  />
                </div>
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                  />
                </div>
              </div>

              {/* Field 3: City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Mumbai, Hyderabad, Bengaluru"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                  />
                </div>
              </div>

              {/* Field 4: EXACT MULTI-TEST SELECTION COMPONENT MATCHING USER DESIGN */}
              <div className="space-y-3 pt-1" ref={dropdownRef}>
                
                {/* 1. Header with Badge & Clear All */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4.5 w-4.5 text-[#382685]" />
                    <label className="text-xs sm:text-sm font-black text-slate-900">
                      Select Tests &amp; Packages <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-[#382685] border border-purple-200">
                      {selectedItems.length} Selected
                    </span>
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedItemIds([allAvailableItems[0].id])}
                        className="text-rose-600 hover:text-rose-700 font-bold text-xs hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Search / Click to Add Input Bar */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full h-12 px-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs ${
                      isDropdownOpen 
                        ? "bg-white border-[#382685] ring-2 ring-[#382685]/10" 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-slate-500 text-xs sm:text-sm font-medium">
                      <Search className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">Click to add more tests or packages...</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Multi-Select Dropdown Search Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[380px] flex flex-col">
                      
                      {/* Search & Tabs Toolbar inside Dropdown */}
                      <div className="p-3 border-b border-slate-100 bg-slate-50/80 space-y-2.5 shrink-0">
                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search from 102+ clinical tests & packages..."
                            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] font-medium"
                            autoFocus
                          />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveTab("all")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              activeTab === "all" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            All ({allAvailableItems.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("packages")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              activeTab === "packages" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            Profiles (12)
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("tests")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              activeTab === "tests" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            Clinical Tests (90+)
                          </button>
                        </div>
                      </div>

                      {/* Scrollable Item Options List */}
                      <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-50 flex-1">
                        {filteredItems.map((item) => {
                          const isSelected = selectedItemIds.includes(item.id)
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleToggleItem(item.id)}
                              className={`p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                                isSelected 
                                  ? "bg-purple-50/90 border border-purple-200 text-purple-950 font-bold" 
                                  : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? "bg-[#382685] border-[#382685] text-white" : "border-slate-300 bg-white"
                                }`}>
                                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                                </div>

                                <div className="min-w-0">
                                  <div className="text-xs font-bold truncate">
                                    {item.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                                    <span>{item.code}</span>
                                    <span>•</span>
                                    <span>{item.parameterCount}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="flex items-center justify-end gap-1">
                                  <span className="font-mono font-black text-xs text-slate-900">₹{item.realizedRevenue}</span>
                                  <span className="text-[9.5px] line-through text-slate-400 font-mono">₹{item.mrp}</span>
                                </div>
                                <div className="text-[10px] font-bold text-emerald-700">
                                  +₹{item.directIncentive} (30%)
                                </div>
                              </div>
                            </div>
                          )
                        })}

                        {filteredItems.length === 0 && (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No profiles or tests found matching &quot;{searchQuery}&quot;
                          </div>
                        )}
                      </div>

                      {/* Bottom Action inside Dropdown */}
                      <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs shrink-0">
                        <span className="font-bold text-slate-700 text-[11px]">
                          {selectedItems.length} test{selectedItems.length > 1 ? "s" : ""} selected (₹{totalRealizedRevenue.toLocaleString("en-IN")} RR)
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#251b5c] text-white text-[11px] font-bold hover:bg-[#1e1b4b] cursor-pointer shadow-xs"
                        >
                          Done Selecting ✓
                        </button>
                      </div>

                    </div>
                  )}
                </div>

                {/* 3. Quick Add Popular Tests Section */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span className="text-amber-500">✨</span>
                    <span>Quick Add Popular Tests:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "test-CUA", label: "Complete Urine Analysis", price: 240 },
                      { id: "test-H6", label: "Hemogram - 6 Part (H6)", price: 240 },
                      { id: "test-HBA1C", label: "HbA1c (Diabetes)", price: 280 },
                      { id: "test-TSH", label: "Thyroid (TSH)", price: 160 },
                      { id: "test-VITD", label: "Vitamin D Total", price: 640 },
                      { id: "pkg-master", label: "Master Health Checkup", price: 2499 }
                    ].map((test) => {
                      const isSelected = selectedItemIds.includes(test.id)
                      return (
                        <button
                          key={test.id}
                          type="button"
                          onClick={() => handleToggleItem(test.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-[#1e1b4b] text-white shadow-xs"
                              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span>{isSelected ? "✓" : "+"}</span>
                          <span>{test.label} (₹{test.price})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 4. Tests Added to This Booking List (Matching User Design) */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Tests Added to This Booking ({selectedItems.length}):
                  </div>

                  <div className="space-y-2">
                    {selectedItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Index circle */}
                          <div className="h-6 w-6 rounded-full bg-purple-50 text-[#382685] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {index + 1}
                          </div>

                          {/* Code Badge */}
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#382685] font-mono font-bold text-[10px] border border-purple-200 shrink-0">
                            {item.code}
                          </span>

                          {/* Test Name & Category */}
                          <div className="min-w-0">
                            <div className="font-black text-xs sm:text-sm text-slate-900 uppercase truncate">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {item.category} • Sample: {item.parameterCount.includes("Blood") ? "Blood" : item.parameterCount.includes("Urine") ? "Urine" : "EDTA"}
                            </div>
                          </div>
                        </div>

                        {/* Price, Earning & Remove Button */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs line-through text-slate-400 font-mono">₹{item.mrp}</span>
                              <span className="font-mono font-black text-sm text-slate-900">₹{item.realizedRevenue}</span>
                            </div>
                            <div className="text-xs font-bold text-emerald-600 mt-0.5">
                              +₹{item.directIncentive} Earning
                            </div>
                          </div>

                          {selectedItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove test"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Field 5: Note (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything the medical ops team should know (e.g. preferred morning collection time)..."
                  className="w-full p-3 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

            </div>

            {/* Banner: What happens next (<24h follow-up) */}
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-900 font-medium">
              <Clock className="h-5 w-5 text-[#2F5FDE] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">What happens next</div>
                <p className="text-slate-600 text-[11.5px] mt-0.5">
                  Our central team follows up within <strong>24 hours</strong> to coordinate home sample collection and keeps you updated in real time.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Submit Referral Lead ({selectedItems.length} Test{selectedItems.length > 1 ? "s" : ""})</span>
              <ArrowRight className="h-4 w-4" />
            </button>

          </form>

          {/* Right Column: Live Realised Revenue & Incentive Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Commercial Breakdown Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-[#382685]" />
                  <span className="font-bold text-sm text-slate-900">Incentive Breakdown</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-100 text-[#382685] border border-purple-200">
                  {selectedItems.length} Test{selectedItems.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Itemized Tests List */}
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                  Selected Tests &amp; Profiles:
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs text-slate-700">
                      <span className="truncate max-w-[180px] font-medium">{item.name}</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">₹{item.realizedRevenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Total Catalogue MRP:</span>
                  <span className="font-mono text-slate-700">₹{totalMrp.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span>Customer 20% Discount:</span>
                  <span className="font-mono">- ₹{totalCustomerDiscount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-900 font-bold">
                  <span>Customer Final Price:</span>
                  <span className="font-mono font-black text-sm text-slate-900">₹{totalRealizedRevenue.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Realised Revenue (RR):</span>
                  <span className="font-mono font-bold text-slate-800">₹{totalRealizedRevenue.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Direct Incentive & Team Override Highlight */}
              <div className="space-y-2.5">
                {/* 30% Direct */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-blue-900">
                    Your Direct Cash Incentive (30%)
                  </div>
                  <div className="font-mono text-3xl font-black text-[#2F5FDE]">
                    ₹{totalDirectIncentive.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Calculated on ₹{totalRealizedRevenue.toLocaleString("en-IN")} Realised Revenue
                  </div>
                </div>

                {/* 10% Team Override with Exact Amount */}
                <div className="bg-gradient-to-br from-purple-50 to-amber-50/50 border border-purple-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-purple-100 text-[#382685] flex items-center justify-center font-bold shrink-0">
                      <Users2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-purple-950">Team Override (10%)</div>
                      <div className="text-[10.5px] text-slate-500">If referred by your Secondary C2</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono font-black text-base text-purple-900">
                    +₹{totalTeamOverride.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Referral Partner Details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Referring Partner</span>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Referral Code</span>
                  <span className="font-mono font-bold text-[#382685]">{currentUser.code}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}
