"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { 
  Bell,
  User,
  Share2,
  Search,
  CheckCircle2, 
  Calendar, 
  Clock, 
  Home, 
  Upload, 
  Download, 
  Sparkles, 
  Phone, 
  Activity,
  Heart,
  ArrowRight,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  QrCode,
  ShieldCheck,
  Tag,
  Droplets,
  SlidersHorizontal,
  ChevronRight,
  Users,
  Award,
  FlaskConical,
  X,
  Package,
  ClipboardList
} from "lucide-react"

export interface CustomerTestItem {
  id: string
  type: "package" | "test"
  code: string
  name: string
  category: string
  mrp: number
  discount: number
  price: number
  parameterCount: string
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const { 
    customer, 
    beneficiaries, 
    addBeneficiary, 
    removeBeneficiary, 
    prescriptionRequests, 
    addPrescriptionRequest 
  } = useWorkflowStore()

  // Full Catalog of 100+ tests matching CRA standard
  const allCatalogItems = useMemo<CustomerTestItem[]>(() => {
    const packages: CustomerTestItem[] = HEALTH_PACKAGES.map((pkg, idx) => {
      const discount = Math.round(pkg.mrp * 0.20)
      const price = pkg.mrp - discount
      return {
        id: pkg.id,
        type: "package",
        code: `PKG-${idx + 1 < 10 ? "0" : ""}${idx + 1}`,
        name: pkg.name,
        category: "Curated Wellness Profiles",
        mrp: pkg.mrp,
        discount: discount,
        price: price,
        parameterCount: `${pkg.parameterCount} Parameters`
      }
    })

    const tests: CustomerTestItem[] = CRA_TESTS.map((test) => {
      const discount = Math.round(test.catalogueRate * 0.20)
      const price = test.catalogueRate - discount
      return {
        id: `test-${test.code}`,
        type: "test",
        code: test.code,
        name: test.name,
        category: test.category || "Clinical Pathology",
        mrp: test.catalogueRate,
        discount: discount,
        price: price,
        parameterCount: `${test.sample || "Blood"} • ${test.technology || "Lab Test"}`
      }
    })

    return [...packages, ...tests]
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  
  const [selectedReportModal, setSelectedReportModal] = useState<any>(null)

  // SEARCH DROPDOWN STATE & LOGIC (Inline auto-suggest dropdown)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTab, setSearchTab] = useState<"all" | "packages" | "tests">("all")
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchDropdownItems = useMemo(() => {
    return allCatalogItems.filter((item) => {
      if (searchTab === "packages" && item.type !== "package") return false
      if (searchTab === "tests" && item.type !== "test") return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
    })
  }, [allCatalogItems, searchTab, searchQuery])

  // Beneficiary Modal State
  const [showAddBenModal, setShowAddBenModal] = useState(false)
  const [benForm, setBenForm] = useState({
    fullName: "",
    relation: "Father" as any,
    age: "",
    gender: "Male" as any,
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038"
  })

  // Prescription Upload Form State
  const [rxModal, setRxModal] = useState(false)
  const [rxForm, setRxForm] = useState({
    name: customer?.name || "Suresh M.",
    mobile: "+91 98450 12345",
    fileName: "Doctor_Prescription_Aug2026.pdf",
    notes: "Doctor recommended 6-month preventive lipid and thyroid screening."
  })
  const [rxSuccess, setRxSuccess] = useState(false)

  // Recommended Health Packages (Concise & Classic)
  const RECOMMENDED_PACKAGES = [
    {
      id: "pkg-fullbody",
      title: "Full Body Wellness Panel",
      subtitle: "62 parameters · fasting required",
      originalPrice: 1000,
      discountedPrice: 800,
      discountBadge: "20% off",
      category: "fullbody",
      popular: true,
      parameters: "62 Tests",
      icon: ShieldCheck
    },
    {
      id: "pkg-women",
      title: "Women's Wellness Profile",
      subtitle: "Hormone & nutrition panel",
      originalPrice: 1200,
      discountedPrice: 960,
      discountBadge: "20% off",
      category: "women",
      popular: true,
      parameters: "58 Tests",
      icon: Sparkles
    },
    {
      id: "pkg-senior",
      title: "Senior Citizen Health Profile",
      subtitle: "74 parameters · vitals & bone health",
      originalPrice: 1800,
      discountedPrice: 1440,
      discountBadge: "20% off",
      category: "senior",
      popular: false,
      parameters: "74 Tests",
      icon: Award
    },
    {
      id: "pkg-cardiac",
      title: "Cardiac Risk & Heart Panel",
      subtitle: "Lipid profile & cardiac markers",
      originalPrice: 1500,
      discountedPrice: 1200,
      discountBadge: "20% off",
      category: "cardiac",
      popular: false,
      parameters: "42 Tests",
      icon: Activity
    },
    {
      id: "pkg-diabetes",
      title: "Executive Diabetes Care Profile",
      subtitle: "HbA1c & fasting glucose vitals",
      originalPrice: 1100,
      discountedPrice: 880,
      discountBadge: "20% off",
      category: "diabetes",
      popular: false,
      parameters: "38 Tests",
      icon: Droplets
    },
    {
      id: "test-vitd",
      title: "Vitamin D & Vitamin B12 Duo",
      subtitle: "Bone strength & vitality panel",
      originalPrice: 900,
      discountedPrice: 720,
      discountBadge: "20% off",
      category: "routine",
      popular: false,
      parameters: "2 Tests",
      icon: FlaskConical
    }
  ]

  // Filtered packages on dashboard
  const filteredPackages = RECOMMENDED_PACKAGES.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeCategory === "all") return matchesSearch
    if (activeCategory === "fullbody") return matchesSearch && pkg.category === "fullbody"
    if (activeCategory === "women") return matchesSearch && pkg.category === "women"
    if (activeCategory === "senior") return matchesSearch && pkg.category === "senior"
    if (activeCategory === "cardiac") return matchesSearch && pkg.category === "cardiac"
    if (activeCategory === "diabetes") return matchesSearch && pkg.category === "diabetes"
    return matchesSearch
  })

  // Mock Lab Reports
  const LAB_REPORTS = [
    {
      id: "REP-9921",
      orderNumber: "ORD-7210",
      title: "Comprehensive Master Health Profile (85 Parameters)",
      date: "15 Aug 2026",
      patient: "Neha S. (Self)",
      status: "Verified by MD Pathologist",
      labDoctor: "Dr. K. S. Reddy, MD (Pathology)",
      parameters: [
        { name: "Fasting Blood Sugar (Glucose)", value: "94 mg/dL", ref: "70 - 99 mg/dL", flag: "Normal" },
        { name: "HbA1c (Glycated Hemoglobin)", value: "5.2 %", ref: "< 5.7 %", flag: "Normal" },
        { name: "Total Cholesterol", value: "182 mg/dL", ref: "< 200 mg/dL", flag: "Normal" },
        { name: "HDL Good Cholesterol", value: "56 mg/dL", ref: "> 40 mg/dL", flag: "Optimal" },
        { name: "Thyroid Stimulating Hormone (TSH)", value: "2.10 µIU/mL", ref: "0.45 - 4.50 µIU/mL", flag: "Normal" },
        { name: "Serum Creatinine", value: "0.85 mg/dL", ref: "0.7 - 1.2 mg/dL", flag: "Normal" }
      ]
    },
    {
      id: "REP-8812",
      orderNumber: "ORD-5192",
      title: "Women's Wellness Hormone Panel",
      date: "02 Jan 2026",
      patient: "Neha S. (Self)",
      status: "Verified by MD Pathologist",
      labDoctor: "Dr. Ananya Sharma, MD",
      parameters: [
        { name: "25-Hydroxy Vitamin D", value: "42.5 ng/mL", ref: "30.0 - 100.0 ng/mL", flag: "Sufficient" },
        { name: "Vitamin B12 (Cyanocobalamin)", value: "510 pg/mL", ref: "211 - 911 pg/mL", flag: "Normal" }
      ]
    }
  ]

  const handleBookNow = (pkgId: string) => {
    router.push(`/booking?package=${pkgId}`)
  }

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault()
    addPrescriptionRequest({
      customerName: rxForm.name,
      mobile: rxForm.mobile,
      fileName: rxForm.fileName,
      notes: rxForm.notes
    })
    setRxSuccess(true)
    setTimeout(() => {
      setRxSuccess(false)
      setRxModal(false)
    }, 1800)
  }

  const handleAddBeneficiarySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!benForm.fullName || !benForm.age) return
    addBeneficiary({
      fullName: benForm.fullName,
      relation: benForm.relation,
      age: parseInt(benForm.age) || 40,
      gender: benForm.gender,
      address: benForm.address,
      city: benForm.city,
      pincode: benForm.pincode,
      selectedTests: []
    })
    setBenForm({
      fullName: "",
      relation: "Father",
      age: "",
      gender: "Male",
      address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
      city: "Bengaluru",
      pincode: "560038"
    })
    setShowAddBenModal(false)
  }

  return (
    <div className="space-y-4 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP REFERRAL PROMO BANNER (CLASSIC HEALTHCARE PARTNER BANNER)           */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#1e293b] p-3.5 sm:p-4 text-white shadow-xs border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 shrink-0">
            <Share2 className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-bold text-white">
              Referred by {customer?.referrerName || "THURAKA SREERAM"}
            </h2>
            <p className="text-xs text-slate-300 font-normal">
              Special partner pricing applied across all diagnostic tests &amp; wellness packages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FlaskConical className="h-3.5 w-3.5 text-white" />
            <span>Select Tests &amp; Profiles ({allCatalogItems.length}+)</span>
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN BALANCED DASHBOARD GRID (8 COLS LEFT, 4 COLS RIGHT)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN (LG:COL-SPAN-8): SEARCH & RECOMMENDED PACKAGES              */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-3.5">
          
          {/* Search Bar with Auto-suggest Dropdown */}
          <div ref={searchContainerRef} className="relative z-30">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              placeholder="Search 100+ tests &amp; profiles (e.g. Full Body, Thyroid, CBC, Lipid)..."
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setIsSearchOpen(false)
                }}
                className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
            >
              <FlaskConical className="h-3 w-3 text-slate-300" />
              <span>Browse</span>
            </button>

            {/* Inline Search Dropdown Results */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 z-50">
                {/* Search Dropdown Filter Header */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSearchTab("all")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        searchTab === "all"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      All ({allCatalogItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab("packages")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        searchTab === "packages"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Packages (12)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab("tests")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        searchTab === "tests"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Tests (90+)
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    20% Discount Active
                  </span>
                </div>

                {/* Dropdown Results List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
                  {searchDropdownItems.slice(0, 15).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false)
                        router.push(`/booking?package=${item.id}`)
                      }}
                      className="p-2.5 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5 font-mono mt-0.5">
                          <span>{item.code}</span>
                          <span>•</span>
                          <span>{item.parameterCount}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="flex items-baseline gap-1.5 justify-end">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">₹{item.price}</span>
                            <span className="text-[10px] line-through text-slate-400">₹{item.mrp}</span>
                          </div>
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                            20% OFF
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsSearchOpen(false)
                            router.push(`/booking?package=${item.id}`)
                          }}
                          className="px-3 py-1 rounded-lg bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}

                  {searchDropdownItems.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No diagnostic tests or profiles found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                {searchDropdownItems.length > 15 && (
                  <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      href="/booking"
                      className="text-xs font-semibold text-blue-600 hover:underline"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      View all {searchDropdownItems.length} matching tests in catalog →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
            {[
              { id: "all", label: "All Profiles", icon: Sparkles },
              { id: "fullbody", label: "Full Body", icon: ShieldCheck },
              { id: "women", label: "Women's Health", icon: Heart },
              { id: "senior", label: "Senior Care", icon: Award },
              { id: "cardiac", label: "Cardiac", icon: Activity },
              { id: "diabetes", label: "Diabetes", icon: Droplets },
            ].map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Section: Recommended for you */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Recommended for you
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                  {filteredPackages.length} Profiles
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/booking')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>See all ({allCatalogItems.length}+)</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Product Cards Grid: Clean, Compact, Classic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Top: Title + Subtitle + Discount Badge */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-normal">
                          {pkg.subtitle}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold shrink-0">
                        {pkg.discountBadge}
                      </span>
                    </div>

                      {/* Clean 1-Line Info */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-700">{pkg.parameters}</span>
                        <span>•</span>
                        <span>Fasting Required</span>
                        <span>•</span>
                        <span>Home Pickup</span>
                      </div>
                    </div>

                    {/* Bottom: Price + Action Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          ₹{pkg.discountedPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{pkg.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBookNow(pkg.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (LG:COL-SPAN-4): WIDGETS (REPORTS, BENEFICIARIES, RX)       */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-3.5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto no-scrollbar">
          

          {/* 1. Verified Pathology Reports Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-md bg-slate-100 text-[#1e3a8a] flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Pathology Lab Reports
                </h3>
              </div>
              <Link
                href="/customer/dashboard/reports"
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                <span>View All &amp; Download</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {LAB_REPORTS.map((r) => (
                <div key={r.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <div className="font-bold text-slate-900 truncate text-xs">{r.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{r.date}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{r.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedReportModal(r)}
                      className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified PDF: ${r.id}.pdf`)}
                      className="p-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/customer/dashboard/reports"
              className="w-full py-1.5 text-center block text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100"
            >
              Open Complete Reports Archive ({filteredPackages.length + 6} Records) →
            </Link>
          </div>

          {/* 3. Family Members Widget */}
          <div id="beneficiaries" className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-md bg-slate-100 text-[#1e3a8a] flex items-center justify-center">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Family Members
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBenModal(true)}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {beneficiaries.map((b) => (
                <div key={b.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {b.relation.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-[11px] truncate">{b.fullName}</div>
                      <div className="text-[10px] text-slate-500">{b.relation} • {b.age} yrs • {b.gender}</div>
                    </div>
                  </div>
                  {b.relation !== "Self" && (
                    <button
                      type="button"
                      onClick={() => removeBeneficiary(b.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove member"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/customer/dashboard/beneficiaries"
              className="w-full py-1.5 text-center block text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100"
            >
              View All &amp; Manage Beneficiaries ({beneficiaries.length}) →
            </Link>
          </div>

          {/* 4. Prescription Upload CTA Card */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs sm:text-sm">
              <div className="h-6 w-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span>Have a Prescription?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Upload doctor prescription slip to get customized lab test assistance within 10 minutes.
            </p>
            <button
              type="button"
              onClick={() => setRxModal(true)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Prescription</span>
            </button>
          </div>

        </div>

      </div>



      {/* ========================================================================= */}
      {/* POPUP MODAL: LAB REPORT PREVIEW WITH QR CODE & REFERENCE RANGES           */}
      {/* ========================================================================= */}
      {selectedReportModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{selectedReportModal.id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedReportModal.title}</h3>
                <p className="text-xs text-slate-500">{selectedReportModal.patient} • {selectedReportModal.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Investigation</th>
                    <th className="p-2.5">Result</th>
                    <th className="p-2.5">Ref. Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedReportModal.parameters.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-slate-900 font-medium">{p.name}</td>
                      <td className="p-2.5 font-bold text-[#2F5FDE]">{p.value}</td>
                      <td className="p-2.5 text-slate-500 text-[11px]">{p.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{selectedReportModal.labDoctor}</div>
                <div className="text-[10px] text-emerald-700 font-bold">✓ Digitally Signed &amp; Verified</div>
              </div>
              <QrCode className="h-8 w-8 text-slate-700" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert(`Downloading verified PDF report: ${selectedReportModal.id}.pdf`)}
                className="px-4 py-2 rounded-xl bg-[#2F5FDE] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL: ADD BENEFICIARY                                              */}
      {/* ========================================================================= */}
      {showAddBenModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Family Member</h3>
              <button
                type="button"
                onClick={() => setShowAddBenModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBeneficiarySubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramanathan M."
                  value={benForm.fullName}
                  onChange={(e) => setBenForm({ ...benForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Relation *</label>
                  <select
                    value={benForm.relation}
                    onChange={(e) => setBenForm({ ...benForm, relation: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 70"
                    value={benForm.age}
                    onChange={(e) => setBenForm({ ...benForm, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Gender *</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setBenForm({ ...benForm, gender: g as any })}
                      className={`py-2 rounded-xl border text-center font-bold cursor-pointer ${
                        benForm.gender === g
                          ? "bg-[#2F5FDE] text-white border-[#2F5FDE]"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Collection Address *</label>
                <input
                  type="text"
                  required
                  value={benForm.address}
                  onChange={(e) => setBenForm({ ...benForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBenModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2F5FDE] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL: PRESCRIPTION UPLOAD & CALLBACK                               */}
      {/* ========================================================================= */}
      {rxModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Upload Prescription</h3>
              </div>
              <button
                type="button"
                onClick={() => setRxModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {rxSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Prescription Uploaded!</h4>
                <p className="text-xs text-emerald-800">
                  Our lab care coordinator will call you to confirm your tests.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreatePrescription} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={rxForm.name}
                    onChange={(e) => setRxForm({ ...rxForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Callback Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={rxForm.mobile}
                    onChange={(e) => setRxForm({ ...rxForm, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Prescription File (PDF / Image) *</label>
                  <div className="p-4 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/30 text-center space-y-1 cursor-pointer">
                    <Droplets className="h-6 w-6 text-[#2F5FDE] mx-auto" />
                    <div className="font-bold text-slate-800">{rxForm.fileName}</div>
                    <div className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Doctor Advice / Notes</label>
                  <textarea
                    rows={2}
                    value={rxForm.notes}
                    onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRxModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#2F5FDE] text-white font-bold shadow-xs cursor-pointer"
                  >
                    Submit Prescription
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
