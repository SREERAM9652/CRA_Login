"use client"

import { useState, useRef, useEffect, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useWorkflowStore, CRA_DISCOUNT_CONFIG } from "@/lib/workflow-store"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { ReferralShareModal } from "@/components/cra/ReferralShareModal"
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
  Trash2,
  Smartphone,
  QrCode,
  Heart,
  Users
} from "lucide-react"

export interface CombinedTestItem {
  id: string
  type: "package" | "test" | "custom_profile"
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

function AddReferralContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "family" ? "family" : "referral"

  const { 
    currentUser, 
    createCustomerBooking, 
    beneficiaries, 
    customProfiles, 
    orgProfile 
  } = useWorkflowStore()
  
  const isC1 = currentUser.role === "c1"

  const [bookingMode, setBookingMode] = useState<"referral" | "family">(initialMode)
  const [selectedBenId, setSelectedBenId] = useState<string>(beneficiaries[0]?.id || "")

  // Unified items list: Curated Packages + Clinical Tests + CRA Custom Profiles
  const allAvailableItems = useMemo<CombinedTestItem[]>(() => {
    // 1. Custom Profiles created via Make My Profile
    const customItems: CombinedTestItem[] = (customProfiles || []).map((cp) => ({
      id: cp.id,
      type: "custom_profile",
      code: "CUSTOM",
      name: cp.profileTitle,
      category: `Custom Profile (${cp.brandOrOrgName})`,
      mrp: cp.totalMrp,
      discount: cp.totalMrp - cp.discountedPrice,
      realizedRevenue: cp.realizedRevenue,
      parameterCount: `${cp.selectedTestCodes.length} Tests`,
      directIncentive: cp.directIncentive,
      teamOverride: Math.round(cp.realizedRevenue * 0.10)
    }))

    // 2. Wellness Packages
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

    // 3. Clinical Tests
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

    return [...customItems, ...packages, ...tests]
  }, [customProfiles])

  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [city, setCity] = useState("Bengaluru")
  
  // Multiple test selection
  const profileIdParam = searchParams.get("profileId")
  const itemsParam = searchParams.get("items")
  const modeParam = searchParams.get("mode")

  // Match custom profile if navigated from Make My Profile
  const matchedCustomProfile = useMemo(() => {
    if (!profileIdParam) return null
    return customProfiles.find(cp => cp.id === profileIdParam) || null
  }, [profileIdParam, customProfiles])

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => {
    if (profileIdParam) return [profileIdParam]
    if (itemsParam) return itemsParam.split(",")
    return ["test-H6", "test-CUA"]
  })

  // Sync mode changes from URL
  useEffect(() => {
    const currentMode = searchParams.get("mode")
    if (currentMode === "family") {
      setBookingMode("family")
    } else if (currentMode === "referral") {
      setBookingMode("referral")
    }
  }, [searchParams])

  // Sync selected tests/profiles from search params
  useEffect(() => {
    const currentProfileId = searchParams.get("profileId")
    const currentItems = searchParams.get("items")
    if (currentProfileId) {
      setSelectedItemIds([currentProfileId])
    } else if (currentItems) {
      setSelectedItemIds(currentItems.split(","))
    }
  }, [searchParams, customProfiles])
  
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "custom" | "packages" | "tests">("all")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // When switching to Family mode or picking a beneficiary, prefill their details
  useEffect(() => {
    if (bookingMode === "family") {
      const ben = beneficiaries.find(b => b.id === selectedBenId) || beneficiaries[0]
      if (ben) {
        setFullName(ben.fullName)
        setMobile(currentUser.mobile || "+91 98450 12345")
        setCity(ben.city || "Bengaluru")
        setNotes(`Sample collection at: ${ben.address}`)
      }
    }
  }, [bookingMode, selectedBenId, beneficiaries, currentUser.mobile])

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
    if (activeTab === "custom" && item.type !== "custom_profile") return false
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
    <div className="w-full font-sans space-y-5 pb-16">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/cra/dashboard" className="hover:text-indigo-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {bookingMode === "referral" ? "Refer a Customer" : "Book for Family Beneficiary"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {bookingMode === "referral" 
              ? "Log a new customer prospect • Select single or multiple tests • Earn 30% direct commission"
              : "Book diagnostic tests for family members • 20% discount pre-applied • Pay online or via wallet"}
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setBookingMode("referral")
              setFullName("")
              setMobile("")
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              bookingMode === "referral"
                ? "bg-[#251b5c] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Refer a Customer
          </button>
          <button
            type="button"
            onClick={() => setBookingMode("family")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              bookingMode === "family"
                ? "bg-[#251b5c] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Family Beneficiary
          </button>
        </div>
      </div>

      {/* Quick Referral Link Banner (in Referral Mode) */}
      {bookingMode === "referral" && (
        <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Share2 className="h-4.5 w-4.5 text-[#2F5FDE] shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900">Want the customer to book by themselves?</span>
              <p className="text-[11px] text-slate-500 truncate">Share your unique link or QR flyer directly on WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className={`h-8 px-3 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                copied ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="h-8 px-3 rounded-lg bg-[#251b5c] hover:bg-[#1e1b4b] text-white text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <QrCode className="h-3.5 w-3.5 text-cyan-300" />
              <span>QR Flyer</span>
            </button>
          </div>
        </div>
      )}

      {/* Auto-Loaded Custom Profile Highlight Banner */}
      {matchedCustomProfile && (
        <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50/80 to-emerald-50/70 border border-purple-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#382685] border border-purple-200">
                Auto-Loaded Custom Profile
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                by {matchedCustomProfile.brandOrOrgName}
              </span>
            </div>
            <h3 className="font-black text-sm text-slate-900">
              {matchedCustomProfile.profileTitle}
            </h3>
            <p className="text-[11px] text-slate-600">
              Includes {matchedCustomProfile.selectedTestCodes.length} Tests: <span className="font-semibold text-slate-800">{matchedCustomProfile.testNames.join(", ")}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{bookingMode === "family" ? "Family Price (20% Off)" : "Customer Price (20% Off)"}</span>
              <span className="font-mono font-black text-slate-900 text-sm">₹{matchedCustomProfile.discountedPrice}</span>
            </div>
            <div className="text-right pl-3 border-l border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{bookingMode === "family" ? "Family Saved" : "Direct Earning (30%)"}</span>
              <span className="font-mono font-black text-emerald-600 text-sm">
                {bookingMode === "family" ? `₹${matchedCustomProfile.totalMrp - matchedCustomProfile.discountedPrice}` : `+₹${matchedCustomProfile.directIncentive}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {submitted ? (
        /* Success State */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 max-w-2xl mx-auto text-center shadow-sm">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {bookingMode === "family" ? "Family Test Booking Placed!" : "Referral Submitted Successfully!"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
              Our central lab operations team will coordinate home sample pickup for <strong>{fullName}</strong> ({mobile}) within 24 hours.
            </p>
          </div>

          {/* Incentive Summary Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tests ({selectedItems.length})</div>
              <div className="font-bold text-slate-900 truncate mt-0.5">
                {selectedItems.map(i => i.name).join(", ")}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Price (20% Off)</div>
              <div className="font-mono font-black text-emerald-700 mt-0.5">₹{totalRealizedRevenue.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Your Earning (30%)</div>
              <div className="font-mono font-black text-[#2F5FDE] mt-0.5">+₹{totalDirectIncentive.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Team 10% Override</div>
              <div className="font-mono font-black text-purple-700 mt-0.5">+₹{totalTeamOverride.toLocaleString("en-IN")}</div>
            </div>
          </div>

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
              + {bookingMode === "family" ? "Book Another Test" : "Refer Another Customer"}
            </button>
            <Link
              href="/cra/dashboard/referrals"
              className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Leads &amp; Status</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* The 1-Screen Referral / Family Booking Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xs">
            
            {/* Beneficiary Selector in Family Mode */}
            {bookingMode === "family" && (
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                    <Users className="h-4 w-4 text-[#382685]" />
                    <span>Select Family Beneficiary</span>
                  </div>
                  <Link
                    href="/cra/dashboard/beneficiaries"
                    className="text-[11px] font-bold text-[#2F5FDE] hover:underline"
                  >
                    + Manage Members
                  </Link>
                </div>
                <select
                  value={selectedBenId}
                  onChange={(e) => setSelectedBenId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-slate-800"
                >
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.fullName} ({b.relation} • {b.gender}, {b.age} yrs • {b.city})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Field 1: Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {bookingMode === "family" ? "Beneficiary Name" : "Customer Full Name"} <span className="text-rose-500">*</span>
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
                  Contact Mobile Number <span className="text-rose-500">*</span>
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

              {/* Field 4: Multi-Test Selection Component */}
              <div className="space-y-3 pt-1" ref={dropdownRef}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4.5 w-4.5 text-[#382685]" />
                    <label className="text-xs sm:text-sm font-black text-slate-900">
                      Select Tests &amp; Profiles <span className="text-rose-500">*</span>
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

                {/* Search / Click to Add Input Bar */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full h-12 px-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs ${
                      isDropdownOpen 
                        ? "bg-white border-[#382685] ring-2 ring-[#382685]/15 shadow-sm" 
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 text-slate-700 text-xs sm:text-sm font-medium">
                      <Search className="h-4 w-4 text-[#382685] shrink-0" />
                      <span className="truncate font-semibold text-slate-800">
                        {selectedItems.length === 0 
                          ? "Click to select tests, wellness profiles or custom bundles..." 
                          : `Selected: ${selectedItems.slice(0, 2).map(i => i.name).join(", ")}${selectedItems.length > 2 ? ` + ${selectedItems.length - 2} more` : ""}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                        ₹{totalRealizedRevenue} Total
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isDropdownOpen ? "rotate-180 text-[#382685]" : ""}`} />
                    </div>
                  </button>

                  {/* Multi-Select Dropdown Search Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[350px] flex flex-col">
                      
                      {/* Search & Tabs Toolbar */}
                      <div className="p-3 border-b border-slate-100 bg-slate-50/90 space-y-2 shrink-0">
                        <div className="relative">
                          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tests, custom profiles, parameters, samples..."
                            className="w-full h-8.5 pl-8.5 pr-8 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] font-medium"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                          <button
                            type="button"
                            onClick={() => setActiveTab("all")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              activeTab === "all" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            All ({allAvailableItems.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("custom")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              activeTab === "custom" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            My Profiles ({customProfiles?.length || 0})
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("packages")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              activeTab === "packages" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Wellness (12)
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("tests")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              activeTab === "tests" ? "bg-[#382685] text-white shadow-2xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Clinical Tests (90+)
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                          <span>Showing <strong>{filteredItems.length}</strong> available items</span>
                          <span className="font-semibold text-purple-900">{selectedItemIds.length} selected</span>
                        </div>
                      </div>

                      {/* Scrollable Item Options List with Compact Height */}
                      <div className="overflow-y-auto p-1.5 divide-y divide-slate-100 max-h-56">
                        {filteredItems.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No items found matching &quot;{searchQuery}&quot;
                          </div>
                        ) : (
                          filteredItems.map(item => {
                            const isSelected = selectedItemIds.includes(item.id)
                            return (
                              <div
                                key={item.id}
                                onClick={() => handleToggleItem(item.id)}
                                className={`px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2.5 text-xs transition-colors cursor-pointer ${
                                  isSelected ? "bg-purple-50/90 border border-purple-200/80 text-purple-950 font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                                    isSelected ? "bg-[#251b5c] border-[#251b5c] text-white" : "border-slate-300 bg-white"
                                  }`}>
                                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                  </div>
                                  <div className="truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-semibold text-slate-900 truncate">{item.name}</span>
                                      {item.type === "custom_profile" && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-purple-100 text-[#382685] border border-purple-200 shrink-0">
                                          Custom Profile
                                        </span>
                                      )}
                                      {item.type === "package" && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                          Wellness
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-normal">
                                      {item.parameterCount} • {item.category}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-mono font-bold text-slate-900 text-xs">₹{item.realizedRevenue}</div>
                                  <div className="text-[10px] text-emerald-600 font-semibold">
                                    {bookingMode === "family" ? "20% Saved" : `+₹${item.directIncentive} (30%)`}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                        <span className="text-xs text-slate-600 font-medium">
                          Total Realized: <strong className="text-slate-900 font-mono">₹{totalRealizedRevenue}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#382685] hover:bg-[#251b5c] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          Done Selecting ({selectedItemIds.length})
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tests Added to Booking */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Tests Added to This Booking ({selectedItems.length}):
                  </div>

                  <div className="space-y-2">
                    {selectedItems.map((item, index) => {
                      const matchedCp = customProfiles.find(cp => cp.id === item.id)
                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-6 w-6 rounded-full bg-purple-50 text-[#382685] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {index + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="font-black text-xs text-slate-900 truncate flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {item.type === "custom_profile" && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-100 text-[#382685] border border-purple-200 shrink-0">
                                    Custom Bundle ({matchedCp?.selectedTestCodes.length || item.parameterCount})
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium truncate">
                                {matchedCp ? (
                                  <span>Includes: <strong className="text-slate-700">{matchedCp.testNames.join(", ")}</strong></span>
                                ) : (
                                  item.category
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="font-mono font-black text-xs text-slate-900">₹{item.realizedRevenue}</span>
                              <span className="text-[10.5px] text-emerald-600 block font-bold">
                                {bookingMode === "family" ? "20% Discount" : `+₹${item.directIncentive}`}
                              </span>
                            </div>

                            {selectedItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Field 5: Note (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Collection Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Address landmarks, preferred time slot, fasting notes..."
                  className="w-full p-3 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>
                {bookingMode === "family"
                  ? `Book Tests for ${fullName.split(" ")[0] || "Beneficiary"} (₹${totalRealizedRevenue})`
                  : `Submit Referral Lead (${selectedItems.length} Tests)`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>

          </form>

          {/* Right Column: Commercial Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Coins className="h-4.5 w-4.5 text-[#382685]" />
                  <span>Commercial Summary</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-purple-100 text-[#382685]">
                  {selectedItems.length} Tests Selected
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Total Catalogue MRP:</span>
                  <span className="font-mono text-slate-700">₹{totalMrp.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span>Patient 20% Discount:</span>
                  <span className="font-mono">- ₹{totalCustomerDiscount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-900 font-bold">
                  <span>Realised Revenue (RR):</span>
                  <span className="font-mono font-black text-sm text-slate-900">₹{totalRealizedRevenue.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Direct Incentive Highlight */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 text-center space-y-1">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-blue-900">
                  Your Direct 30% Incentive
                </div>
                <div className="font-mono text-3xl font-black text-[#2F5FDE]">
                  ₹{totalDirectIncentive.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Credited to your CRA wallet upon sample completion
                </div>
              </div>

              {/* Referring Partner Pill */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Partner: <strong>{currentUser.name}</strong></span>
                <span>Code: <strong className="font-mono text-[#382685]">{currentUser.code}</strong></span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Referral Share Modal */}
      <ReferralShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        craName={currentUser.name}
        craCode={currentUser.code}
        orgName={orgProfile?.brandName}
        discountPercent={CRA_DISCOUNT_CONFIG.customerDiscountPercent}
      />

    </div>
  )
}

export default function AddReferralPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading booking workflow...</div>}>
      <AddReferralContent />
    </Suspense>
  )
}
