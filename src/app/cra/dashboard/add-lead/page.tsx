"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { 
  UserPlus, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  HeartHandshake,
  AlertCircle,
  TrendingUp,
  IndianRupee,
  Clock,
  FlaskConical,
  Award,
  HelpCircle,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  X,
  Package,
  Layers
} from "lucide-react"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { CustomSelect } from "@/components/ui/CustomSelect"

export interface SelectedTestItem {
  id: string
  code: string
  name: string
  category: string
  sample: string
  mrp: number
  discount: number
  rr: number
  c1: number
  c2: number
  isPackage: boolean
}

export default function AddReferralPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    relationship: "Corporate Contact",
    selectedTests: ["H6", "CUA"] as string[], // Multi-test array
    collectionType: "Home Collection",
    notes: ""
  })

  // Dropdown open state for test search
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false)
  const [testSearchQuery, setTestSearchQuery] = useState("")
  const testDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (testDropdownRef.current && !testDropdownRef.current.contains(event.target as Node)) {
        setIsTestDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const [generatedRefId, setGeneratedRefId] = useState("")

  // Calculate itemized details for all selected tests
  const selectedItems = useMemo(() => {
    return formData.selectedTests.map(id => {
      // Check if it's a health package
      const pkg = HEALTH_PACKAGES.find(p => p.id === id)
      if (pkg) {
        const mrp = pkg.mrp
        const discount = mrp - pkg.price
        const rr = pkg.price
        const c1 = Math.round(rr * 0.3)
        const c2 = Math.round(rr * 0.1)
        return {
          id: pkg.id,
          code: "PKG",
          name: pkg.name,
          category: "Full Body Package",
          sample: "Blood & Urine",
          mrp,
          discount,
          rr,
          c1,
          c2,
          isPackage: true
        }
      }

      // Check if it's an individual CRA test
      const test = CRA_TESTS.find(t => t.code === id)
      if (test) {
        return {
          id: test.code,
          code: test.code,
          name: test.name,
          category: test.category,
          sample: test.sample,
          mrp: test.catalogueRate,
          discount: test.discount,
          rr: test.realizedRevenue,
          c1: test.c1Incentive,
          c2: Math.round(test.realizedRevenue * 0.1),
          isPackage: false
        }
      }

      return null
    }).filter(Boolean) as SelectedTestItem[]
  }, [formData.selectedTests])

  // Total summary calculation
  const totalSummary = useMemo(() => {
    const totalMrp = selectedItems.reduce((sum, item) => sum + item.mrp, 0)
    const totalDiscount = selectedItems.reduce((sum, item) => sum + item.discount, 0)
    const totalRR = selectedItems.reduce((sum, item) => sum + item.rr, 0)
    const totalC1 = selectedItems.reduce((sum, item) => sum + item.c1, 0)
    const totalC2 = selectedItems.reduce((sum, item) => sum + item.c2, 0)
    const uniqueSamples = Array.from(new Set(selectedItems.map(item => item.sample).filter(Boolean)))
    return {
      totalMrp,
      totalDiscount,
      totalRR,
      totalC1,
      totalC2,
      uniqueSamples,
      count: selectedItems.length
    }
  }, [selectedItems])

  // Toggle test selection
  const handleToggleTest = (testId: string) => {
    setFormData(prev => {
      const exists = prev.selectedTests.includes(testId)
      if (exists) {
        return { ...prev, selectedTests: prev.selectedTests.filter(id => id !== testId) }
      } else {
        return { ...prev, selectedTests: [...prev.selectedTests, testId] }
      }
    })
  }

  // Remove test by id
  const handleRemoveTest = (testId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.filter(id => id !== testId)
    }))
  }

  // Quick add popular tests
  const popularTests = [
    { code: "CUA", name: "Complete Urine Analysis", price: 240, c1: 72 },
    { code: "H6", name: "Hemogram - 6 Part (H6)", price: 240, c1: 72 },
    { code: "HBA", name: "HbA1c (Diabetes)", price: 280, c1: 84 },
    { code: "TSH", name: "Thyroid (TSH)", price: 160, c1: 48 },
    { code: "VITDC", name: "Vitamin D Total", price: 640, c1: 192 },
    { code: "pkg-master", name: "Master Health Checkup", price: 2499, c1: 750, isPackage: true },
  ]

  // Filter available tests for search dropdown
  const filteredCRA = CRA_TESTS.filter(t => 
    t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(testSearchQuery.toLowerCase())
  )

  const filteredPackages = HEALTH_PACKAGES.filter(p => 
    p.name.toLowerCase().includes(testSearchQuery.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.mobile) {
      alert("Please enter customer name and valid mobile number.")
      return
    }

    if (formData.selectedTests.length === 0) {
      alert("Please select at least one test or health package to book.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const newId = `REF-${Math.floor(1000 + Math.random() * 9000)}`
      setGeneratedRefId(newId)
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  const referralCode = "AVM-RAJ-789"
  const testNamesSummary = selectedItems.map(i => i.name).join(", ")
  const referralLink = `https://avmlabs.in/booking?ref=${referralCode}&client=${encodeURIComponent(formData.fullName || "Client")}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
        <div>
          {/* Desktop Multi-Level Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <Link href="/cra/dashboard" className="hover:text-[#382685] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/cra/dashboard/referrals" className="hover:text-[#382685] transition-colors">
              Customer Bookings
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#251b5c]">Book for a Customer</span>
          </nav>

          {/* Mobile Clean Back Navigation */}
          <div className="sm:hidden mb-1.5">
            <Link href="/cra/dashboard/referrals" className="inline-flex items-center gap-1 text-xs font-bold text-[#382685] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Customer Bookings</span>
            </Link>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#1e1b4b]">
            Book Tests for a Customer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mt-0.5">
            Select one or multiple tests to book. You earn 30% commission directly into your account once samples are collected.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 pt-1 sm:pt-0">
          <Link
            href="/cra/dashboard/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#382685] bg-purple-50 hover:bg-purple-100 px-3 sm:px-3.5 py-2 rounded-xl border border-purple-200/70 transition-colors shadow-2xs"
          >
            <FlaskConical className="h-3.5 w-3.5" /> 
            <span>View 63 Test Prices</span>
          </Link>
          <Link
            href="/cra/dashboard/referrals"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#382685] transition-colors shrink-0 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Bookings
          </Link>
        </div>
      </div>

      {!submitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: MAIN FORM (8 COLUMNS ON LG)                                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-3xl shadow-xl shadow-indigo-950/5 border border-slate-100 bg-white overflow-hidden">
            
            {/* Header Attribution Banner */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1f74] to-[#382685] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center font-bold text-white shadow-xs border border-white/20">
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                    Your Partner Code: {referralCode}
                  </div>
                  <div className="text-[11.5px] text-blue-100 font-medium">
                    Logged by: Rajesh J. (Direct Agent • Earn 30% on Completed Tests)
                  </div>
                </div>
              </div>
              <span className="text-[10.5px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-400 text-slate-950 shadow-xs w-fit">
                Verified Agent
              </span>
            </div>

            <div className="p-4 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                
                {/* Row 1: Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#382685]" /> Customer Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] transition-all text-slate-900 bg-slate-50/50 placeholder:text-slate-400"
                      placeholder="e.g. Ramesh Patel"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" /> Mobile Number *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] transition-all text-slate-900 bg-slate-50/50 placeholder:text-slate-400"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Relationship */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address (Optional)
                    </label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] transition-all text-slate-900 bg-slate-50/50 placeholder:text-slate-400"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <HeartHandshake className="h-3.5 w-3.5 text-[#e04838]" /> Relationship / Category *
                    </label>
                    <CustomSelect
                      value={formData.relationship}
                      onChange={(val) => setFormData({ ...formData, relationship: val })}
                      options={[
                        { value: "Family", label: "Family Member", sublabel: "Direct relative" },
                        { value: "Friend", label: "Friend / Acquaintance", sublabel: "Social connection" },
                        { value: "Corporate Contact", label: "Corporate Colleague / Executive", sublabel: "Office & professional" },
                        { value: "Neighbor", label: "Neighbor / Residential Society", sublabel: "Local community" },
                        { value: "Client", label: "Direct Customer Client", sublabel: "Walk-in or external" },
                      ]}
                    />
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* MULTI-TEST SELECTION SECTION                                              */}
                {/* ========================================================================= */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <FlaskConical className="h-4 w-4 text-[#382685]" />
                      Select Diagnostic Tests & Packages *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#382685] text-[11px] font-black border border-purple-200">
                        {formData.selectedTests.length} Test{formData.selectedTests.length !== 1 ? "s" : ""} Selected
                      </span>
                      {formData.selectedTests.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, selectedTests: [] })}
                          className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Select Search Dropdown Trigger */}
                  <div className="relative" ref={testDropdownRef}>
                    <div 
                      onClick={() => setIsTestDropdownOpen(!isTestDropdownOpen)}
                      className="w-full min-h-[48px] rounded-2xl border border-slate-200 hover:border-[#382685] bg-white p-2.5 px-3.5 flex items-center justify-between gap-2 cursor-pointer transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <Search className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-600">
                          {formData.selectedTests.length === 0 
                            ? "Click to search and add tests (63 tests available)..."
                            : `Click to add more tests or packages...`
                          }
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isTestDropdownOpen ? "rotate-180 text-[#382685]" : ""}`} />
                    </div>

                    {/* Dropdown Popover */}
                    {isTestDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        
                        {/* Search Input */}
                        <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              autoFocus
                              value={testSearchQuery}
                              onChange={(e) => setTestSearchQuery(e.target.value)}
                              placeholder="Search 63 tests by code (e.g. HBA, TSH, VITDC) or name..."
                              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] text-slate-900"
                            />
                            {testSearchQuery && (
                              <button 
                                onClick={() => setTestSearchQuery("")}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* List of Options */}
                        <div className="max-h-72 overflow-y-auto p-2 space-y-3">
                          
                          {/* Packages Group */}
                          {filteredPackages.length > 0 && (
                            <div>
                              <div className="px-3 py-1 text-[10.5px] font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5 text-[#382685]" />
                                Health Checkup Packages
                              </div>
                              <div className="space-y-1 mt-1">
                                {filteredPackages.map(pkg => {
                                  const isSelected = formData.selectedTests.includes(pkg.id)
                                  return (
                                    <div
                                      key={pkg.id}
                                      onClick={() => handleToggleTest(pkg.id)}
                                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                        isSelected 
                                          ? "bg-[#382685]/10 border border-[#382685]/30 text-slate-900 font-bold"
                                          : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                          isSelected ? "bg-[#382685] border-[#382685] text-white" : "border-slate-300 bg-white"
                                        }`}>
                                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                        </div>
                                        <div className="truncate">
                                          <div className="font-bold text-slate-900 truncate">{pkg.name}</div>
                                          <div className="text-[10.5px] text-slate-400">{pkg.parameterCount} Parameters</div>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <div className="font-black text-slate-900">₹{pkg.price}</div>
                                        <div className="text-[10px] text-emerald-700 font-bold">+₹{Math.round(pkg.price * 0.3)} Earning</div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Individual Tests Group */}
                          {filteredCRA.length > 0 && (
                            <div>
                              <div className="px-3 py-1 text-[10.5px] font-black uppercase tracking-wider text-[#382685] flex items-center gap-1.5">
                                <FlaskConical className="h-3.5 w-3.5" />
                                Individual Pathology Tests (63 Tests)
                              </div>
                              <div className="space-y-1 mt-1">
                                {filteredCRA.map(test => {
                                  const isSelected = formData.selectedTests.includes(test.code)
                                  return (
                                    <div
                                      key={test.code}
                                      onClick={() => handleToggleTest(test.code)}
                                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                        isSelected 
                                          ? "bg-[#382685]/10 border border-[#382685]/30 text-slate-900 font-bold"
                                          : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                          isSelected ? "bg-[#382685] border-[#382685] text-white" : "border-slate-300 bg-white"
                                        }`}>
                                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                        </div>
                                        <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-50 text-[#382685] border border-purple-100 shrink-0">
                                          {test.code}
                                        </span>
                                        <div className="truncate">
                                          <div className="font-bold text-slate-900 truncate">{test.name}</div>
                                          <div className="text-[10.5px] text-slate-400">{test.category} • {test.sample}</div>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <div className="font-black text-slate-900">₹{test.realizedRevenue}</div>
                                        <div className="text-[10px] text-emerald-700 font-bold">+₹{test.c1Incentive} Earning</div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {filteredCRA.length === 0 && filteredPackages.length === 0 && (
                            <div className="text-center py-6 text-xs text-slate-400">
                              No tests found matching &quot;{testSearchQuery}&quot;
                            </div>
                          )}

                        </div>

                        {/* Dropdown Footer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-600">
                            {formData.selectedTests.length} tests selected
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsTestDropdownOpen(false)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#251b5c] text-white font-bold text-xs hover:bg-[#382685] transition-colors cursor-pointer"
                          >
                            Done Selecting
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Fast 1-Click Popular Tests Chips */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span>Quick Add Popular Tests:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularTests.map(pt => {
                        const isSelected = formData.selectedTests.includes(pt.code)
                        return (
                          <button
                            key={pt.code}
                            type="button"
                            onClick={() => handleToggleTest(pt.code)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isSelected
                                ? "bg-[#251b5c] text-white border-[#251b5c] shadow-xs"
                                : "bg-slate-50/80 hover:bg-purple-50 text-slate-700 border-slate-200 hover:border-purple-200"
                            }`}
                          >
                            {isSelected ? <Check className="h-3 w-3 text-cyan-300" /> : <Plus className="h-3 w-3 text-slate-400" />}
                            <span>{pt.name}</span>
                            <span className={isSelected ? "text-cyan-300 font-mono" : "text-[#382685] font-mono"}>
                              (₹{pt.price})
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Selected Tests Cards (Basket) */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-700">
                      Tests Added to This Booking ({selectedItems.length}):
                    </div>

                    {selectedItems.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {selectedItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 truncate">
                              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#382685] font-black text-[10px] flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-[#382685] border border-purple-100 shrink-0">
                                {item.code}
                              </span>
                              <div className="truncate">
                                <div className="font-bold text-slate-900 text-xs truncate">
                                  {item.name}
                                </div>
                                <div className="text-[10.5px] text-slate-400">
                                  {item.category} • Sample: <strong className="text-slate-600">{item.sample}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <div className="flex items-center gap-1.5 justify-end">
                                  <span className="text-[11px] line-through text-slate-400">₹{item.mrp}</span>
                                  <span className="font-black text-slate-900 text-xs sm:text-sm">₹{item.rr}</span>
                                </div>
                                <div className="text-[10.5px] text-emerald-700 font-extrabold">
                                  +₹{item.c1} Earning
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveTest(item.id)}
                                title="Remove test"
                                className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-1.5">
                        <FlaskConical className="h-6 w-6 text-slate-300 mx-auto" />
                        <div className="text-xs font-bold text-slate-600">No tests selected yet</div>
                        <p className="text-[11px] text-slate-400">
                          Click the search bar above or choose from the quick-add chips to add tests.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 4: Collection Preference */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-800">
                    Sample Collection Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Home Collection", "Visit Lab Center"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, collectionType: method })}
                        className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          formData.collectionType === method
                            ? "border-[#382685] bg-[#f6f4fe] text-[#251b5c] ring-1 ring-[#382685]"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{method}</span>
                          {formData.collectionType === method && (
                            <span className="h-2 w-2 rounded-full bg-[#382685]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 5: Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Special Instructions / Best Time to Call (Optional)
                  </label>
                  <textarea 
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] transition-all text-slate-900 bg-slate-50/50 placeholder:text-slate-400"
                    placeholder="e.g. Call after 5 PM, customer has high blood sugar history, wants home collection on Saturday morning."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || formData.selectedTests.length === 0}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-950/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Booking Tests...</span>
                      </div>
                    ) : (
                      <>
                        <UserPlus className="h-4.5 w-4.5" />
                        <span>Book {totalSummary.count} Test{totalSummary.count !== 1 ? "s" : ""} for Customer</span>
                      </>
                    )}
                  </button>
                  
                  <Link
                    href="/cra/dashboard/referrals"
                    className="py-4 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm text-center transition-colors"
                  >
                    Cancel
                  </Link>
                </div>

              </form>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: REAL-TIME INCENTIVE CALCULATOR & ATTRIBUTION (4-5 COLS)     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Live Pricing & Earnings Card with Indian Rupee Icon */}
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-2xl bg-purple-50 text-[#382685] flex items-center justify-center font-bold border border-purple-100">
                    <IndianRupee className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Live Earnings Calculator</h3>
                    <p className="text-[10.5px] text-slate-400 font-medium">Combined for all selected tests</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                  {totalSummary.count} Selected
                </span>
              </div>

              {/* Selected Tests Mini Summary */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1.5">
                <div className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider flex justify-between">
                  <span>Selected Tests ({totalSummary.count})</span>
                  {totalSummary.uniqueSamples.length > 0 && (
                    <span className="text-purple-700 font-bold">Samples: {totalSummary.uniqueSamples.join(", ")}</span>
                  )}
                </div>
                
                {selectedItems.length > 0 ? (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex justify-between text-xs font-semibold text-slate-800">
                        <span className="truncate max-w-[170px]">{item.name}</span>
                        <span className="font-bold text-slate-900">₹{item.rr}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">No tests selected yet</div>
                )}
              </div>

              {/* Price Breakdown Matrix */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Total Lab Price (MRP)</span>
                  <span className="line-through text-slate-400 font-semibold">₹{totalSummary.totalMrp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Customer Discount (20% Off)</span>
                  <span>- ₹{totalSummary.totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black pt-2 border-t border-slate-100">
                  <span>Final Total Customer Price</span>
                  <span className="text-base">₹{totalSummary.totalRR.toLocaleString()}</span>
                </div>
              </div>

              {/* Highlighting 30% Direct Earnings */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/70 border border-purple-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#251b5c] uppercase tracking-wider">
                    Your Total 30% Direct Earning
                  </span>
                  <Award className="h-4 w-4 text-[#382685]" />
                </div>
                <div className="text-3xl font-black text-[#251b5c]">
                  ₹{totalSummary.totalC1.toLocaleString()}
                </div>
                <p className="text-[10.5px] text-slate-500 font-medium">
                  Credited to your payout wallet instantly after samples are collected.
                </p>
              </div>

              {/* Team Bonus */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-semibold">Team Bonus (10%):</span>
                <span className="font-black text-purple-700">₹{totalSummary.totalC2.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Share Attribution Box */}
            <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] to-[#251b5c] text-white p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-300">
                  Instant Customer Booking Link
                </div>
                <Sparkles className="h-4 w-4 text-cyan-300" />
              </div>
              <p className="text-xs text-blue-100/90 font-medium leading-relaxed">
                Prefer to let the customer self-book? Share your direct link with 20% discount applied:
              </p>
              
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white text-[#251b5c] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-[#382685]" />}
                  <span>{copied ? "Copied Link!" : "Copy Booking Link"}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Book tests (${testNamesSummary}) on AVMLabs with 20% discount: https://avmlabs.in/booking?ref=${referralCode}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                  title="Share WhatsApp"
                >
                  <Share2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* What Happens Next Lifecycle */}
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                What Happens Next?
              </h4>
              <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-purple-50 text-[#382685] font-black text-[10px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Our medical support calls customer within 15 minutes to confirm date & time.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-purple-50 text-[#382685] font-black text-[10px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Certified phlebotomist collects sample from their home.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>30% commission automatically credits to your balance for payout.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* SUCCESS STATE CARD                                                        */
        /* ========================================================================= */
        <div className="rounded-3xl shadow-xl border border-emerald-200 bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 text-center space-y-2">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-lg">
              <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Customer Booking Successfully Registered!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto font-medium">
              Order reference code <strong className="text-white underline">{generatedRefId}</strong> has been created for <strong className="text-white">{formData.fullName}</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-xs font-black text-slate-600 uppercase tracking-wider">
                Direct Customer Booking Link (With Your Code Pre-Applied)
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 px-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-700 font-bold"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-10 px-4 rounded-xl bg-[#251b5c] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#382685] transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi ${formData.fullName}, your AVMLabs booking for (${testNamesSummary}) is registered with 20% discount: ${referralLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <Share2 className="h-4 w-4" />
                  <span>WhatsApp Link</span>
                </a>
              </div>
            </div>

            {/* Booked Tests Summary */}
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
              <div className="text-xs font-bold text-[#382685] uppercase tracking-wider">
                Booked Tests ({selectedItems.length}):
              </div>
              <div className="space-y-1.5">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{item.name} ({item.code})</span>
                    <span className="text-[#251b5c]">₹{item.rr} (You earn ₹{item.c1})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-slate-500">Customer</div>
                <div className="font-bold text-slate-900">{formData.fullName}</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-slate-500">Total Customer Price</div>
                <div className="font-bold text-slate-900">₹{totalSummary.totalRR.toLocaleString()}</div>
              </div>
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200/80">
                <div className="text-[#382685] font-semibold">Your Total Earning</div>
                <div className="font-black text-[#251b5c] text-sm">₹{totalSummary.totalC1.toLocaleString()} (30%)</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    fullName: "",
                    mobile: "",
                    email: "",
                    relationship: "Corporate Contact",
                    selectedTests: ["H6", "CUA"],
                    collectionType: "Home Collection",
                    notes: ""
                  })
                  setSubmitted(false)
                }}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md text-center cursor-pointer"
              >
                + Book Another Customer
              </button>
              
              <Link
                href="/cra/dashboard/referrals"
                className="py-3 px-6 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm text-center transition-colors"
              >
                View in Customer Bookings
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
