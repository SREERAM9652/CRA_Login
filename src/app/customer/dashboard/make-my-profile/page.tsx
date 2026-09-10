"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore, CRA_DISCOUNT_CONFIG, CRACustomProfile } from "@/lib/workflow-store"
import { CRA_TESTS } from "@/lib/cra-tests"
import {
  Sparkles,
  Check,
  Plus,
  Share2,
  ArrowLeft,
  Trash2,
  Search,
  FlaskConical,
  Users,
  User,
  Clock,
  ArrowRight,
  Heart,
  CheckCircle2,
  Copy,
  Package,
  Calendar,
  X,
  ChevronDown,
  Filter,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Droplets,
  ExternalLink,
  Info,
  CalendarCheck
} from "lucide-react"

export interface SelectableTest {
  code: string
  name: string
  category: string
  mrp: number
  sample: string
}

export default function CustomerMakeMyProfilePage() {
  const router = useRouter()
  const {
    customer,
    currentUser,
    isCustomerLoggedIn,
    customProfiles,
    createCustomProfile,
    deleteCustomProfile
  } = useWorkflowStore()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // 100+ AVM Labs Tests for custom profile builder
  const allTests = useMemo<SelectableTest[]>(() => {
    return CRA_TESTS.map(t => ({
      code: t.code,
      name: t.name,
      category: t.category || "Diagnostic Pathology",
      mrp: t.catalogueRate,
      sample: t.sample || "Blood"
    }))
  }, [])

  // Search, Filter & Sort for Published / Created Profiles
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "tests_desc" | "title_asc">("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(6)

  // Feedback states
  const [copiedProfileId, setCopiedProfileId] = useState<string | null>(null)
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState<CRACustomProfile | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Drawer Animation & Scroll Lock State (Slide-over Right Sidebar)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)

  // Lock background scrolling while drawer is open
  useEffect(() => {
    if (isBuilderOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isBuilderOpen])

  // Support ?action=create or ?create=true URL query
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("action") === "create" || params.get("create") === "true") {
        setIsBuilderOpen(true)
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isBuilderOpen) setIsBuilderOpen(false)
        if (showShareModal) setShowShareModal(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isBuilderOpen, showShareModal])

  const [builderTitle, setBuilderTitle] = useState("")
  const [builderCategory, setBuilderCategory] = useState<"Wellness & Preventive" | "Cardio-Diabetic" | "Women's Health" | "Senior Care" | "Custom Clinic Panel">("Wellness & Preventive")
  const [builderDescription, setBuilderDescription] = useState("")
  const [selectedCodes, setSelectedCodes] = useState<string[]>(["H6", "FBS", "LIPID", "TSH"])
  const [builderSearch, setBuilderSearch] = useState("")
  const [builderCategoryFilter, setBuilderCategoryFilter] = useState<string>("All")
  const [builderError, setBuilderError] = useState<string | null>(null)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  // Customer Name display
  const customerDisplayName = mounted ? (customer?.name || currentUser?.name || "Patient") : "Patient"

  // Filtered available tests in the builder
  const filteredBuilderTests = useMemo(() => {
    return allTests.filter(t => {
      if (builderCategoryFilter !== "All") {
        const match = 
          (builderCategoryFilter === "Blood & CBC" && (t.category.includes("Hematology") || t.sample === "EDTA" || t.name.includes("HEMO") || t.name.includes("CBC"))) ||
          (builderCategoryFilter === "Diabetes & Glucose" && (t.name.includes("GLUCOSE") || t.name.includes("SUGAR") || t.name.includes("HBA1C") || t.name.includes("INSULIN"))) ||
          (builderCategoryFilter === "Thyroid & Hormones" && (t.name.includes("THYROID") || t.name.includes("TSH") || t.name.includes("T3") || t.name.includes("T4") || t.category.includes("Endocrinology"))) ||
          (builderCategoryFilter === "Lipid & Cardiology" && (t.name.includes("LIPID") || t.name.includes("CHOLESTEROL") || t.name.includes("TRIGLYCERIDES") || t.name.includes("CARDIAC"))) ||
          (builderCategoryFilter === "Liver & Kidney" && (t.name.includes("LIVER") || t.name.includes("SGOT") || t.name.includes("SGPT") || t.name.includes("CREATININE") || t.name.includes("UREA") || t.name.includes("BILIRUBIN") || t.name.includes("KIDNEY"))) ||
          (builderCategoryFilter === "Vitamins & Urine" && (t.name.includes("VITAMIN") || t.sample === "Urine" || t.name.includes("URINE")))

        if (!match) return false
      }
      if (!builderSearch.trim()) return true
      const q = builderSearch.toLowerCase()
      return (
        t.name.toLowerCase().includes(q) || 
        t.code.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q) ||
        t.sample.toLowerCase().includes(q)
      )
    })
  }, [allTests, builderSearch, builderCategoryFilter])

  // Builder pricing calculations
  const selectedTestsData = useMemo(() => {
    return allTests.filter(t => selectedCodes.includes(t.code))
  }, [allTests, selectedCodes])

  const builderTotalMrp = useMemo(() => {
    return selectedTestsData.reduce((sum, t) => sum + t.mrp, 0)
  }, [selectedTestsData])

  const discountRate = CRA_DISCOUNT_CONFIG.customerDiscountPercent / 100
  const builderDiscount = Math.round(builderTotalMrp * discountRate)
  const builderFinalPrice = builderTotalMrp - builderDiscount

  const handleToggleTest = (code: string) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 1) {
        setSelectedCodes(selectedCodes.filter(c => c !== code))
      }
    } else {
      setSelectedCodes([...selectedCodes, code])
    }
  }

  // Handle Save Profile
  const handleSaveProfile = (proceedToBooking = false) => {
    if (selectedCodes.length === 0) {
      setBuilderError("Please select at least 1 diagnostic test.")
      return
    }

    const title = builderTitle.trim() || `${builderCategory.split(" ")[0]} Health Panel (${selectedCodes.length} Tests)`

    const newProfile = createCustomProfile({
      brandOrOrgName: `${customerDisplayName}'s Profile`,
      profileTitle: title,
      description: builderDescription.trim() || `Custom health profile curated by ${customerDisplayName} with AVM Labs.`,
      category: builderCategory,
      selectedTestCodes: selectedCodes,
      testNames: selectedTestsData.map(t => t.name),
      totalMrp: builderTotalMrp,
      discountedPrice: builderFinalPrice,
      realizedRevenue: builderFinalPrice,
      directIncentive: Math.round(builderFinalPrice * 0.30),
      isCustomerCreated: true,
      createdByRole: "customer"
    })

    setSaveSuccessMsg(`Profile "${title}" created successfully!`)
    setIsBuilderOpen(false)
    setBuilderTitle("")
    setBuilderDescription("")
    setSelectedCodes(["H6", "FBS", "LIPID", "TSH"])
    setCategoryFilter("All")
    setSearchQuery("")
    setCurrentPage(1)

    setTimeout(() => {
      setSaveSuccessMsg(null)
    }, 4000)

    if (proceedToBooking && newProfile?.id) {
      router.push(`/booking?profile=${newProfile.id}`)
    }
  }

  // Filter & Sort Profiles for Main Catalog
  const categoriesList = useMemo(() => {
    if (!mounted) {
      return ["All", "Cardio-Diabetic", "Wellness & Preventive", "Women's Health", "Senior Care"]
    }
    const cats = Array.from(new Set(customProfiles.map(p => p.category)))
    return ["All", ...cats]
  }, [customProfiles, mounted])

  const filteredProfiles = useMemo(() => {
    return customProfiles
      .filter((p) => {
        if (categoryFilter !== "All" && p.category !== categoryFilter) {
          return false
        }
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          p.profileTitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.testNames.some(t => t.toLowerCase().includes(q)) ||
          p.selectedTestCodes.some(c => c.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sortBy === "newest") return 0
        if (sortBy === "price_asc") return a.discountedPrice - b.discountedPrice
        if (sortBy === "tests_desc") return b.selectedTestCodes.length - a.selectedTestCodes.length
        if (sortBy === "title_asc") return a.profileTitle.localeCompare(b.profileTitle)
        return 0
      })
  }, [customProfiles, categoryFilter, searchQuery, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / pageSize))
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProfiles.slice(start, start + pageSize)
  }, [filteredProfiles, currentPage, pageSize])

  // Share & Copy Handlers
  const handleOpenShareModal = (p: CRACustomProfile) => {
    setShowShareModal(p)
  }

  const handleCopyShareLink = (p: CRACustomProfile) => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/booking?profile=${p.id}`
      : `https://avmlabs.com/booking?profile=${p.id}`

    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url)
      setCopiedProfileId(p.id)
      setTimeout(() => setCopiedProfileId(null), 2000)
    }
  }

  // Direct Book Handler - 1-Click Redirect to Booking Wizard
  const handleBookProfile = (profileId: string) => {
    router.push(`/booking?profile=${profileId}`)
  }

  return (
    <div className="w-full font-sans space-y-6 pb-20" suppressHydrationWarning>

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/customer/dashboard" className="hover:text-blue-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Make My Profile</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              Custom Health Packages
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Personalized health checkup packages curated for you and your family with 20% guaranteed savings.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="btn-create-custom-profile"
            type="button"
            onClick={() => setIsBuilderOpen(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1d4ed8] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-950/15 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom Profile</span>
          </button>

          <Link
            href="/booking"
            className="h-10 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <FlaskConical className="h-3.5 w-3.5 text-[#1e3a8a]" />
            <span>Find Single Tests</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between border border-emerald-400/30">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-200 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-white/80 hover:text-white text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created Profiles</div>
            <div className="text-xl font-black text-slate-900 font-mono">
              <span suppressHydrationWarning>{mounted ? customProfiles.length : "--"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AVM Labs Tests</div>
            <div className="text-xl font-black text-slate-900 font-mono">100+ Available</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Discount</div>
            <div className="text-xl font-black text-emerald-700 font-mono">20% Flat OFF</div>
          </div>
        </div>
      </div>

      {/* Main Container: Created Profiles Catalog */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
        
        {/* Top Controls: Title, Search, Category Chips & Sort */}
        <div className="space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#1e3a8a]" />
              <h2 className="font-black text-sm sm:text-base text-slate-900">
                Created Profiles &amp; Packages
              </h2>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1e3a8a] border border-blue-200">
                <span suppressHydrationWarning>{mounted ? `${filteredProfiles.length} Available` : "Available"}</span>
              </span>
            </div>

            {/* Search & Sort Bar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search profiles or tests..."
                  className="w-full h-9 pl-9 pr-7 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Sort Select */}
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none"
              >
                <option value="newest">Sort: Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="tests_desc">Most Tests</option>
                <option value="title_asc">Title: A to Z</option>
              </select>

              {/* View Mode Toggle (Grid vs List) */}
              <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-blue-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-white text-blue-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="List view"
                >
                  <ListIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categoriesList.map((cat) => {
              const isSelected = categoryFilter === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(cat)
                    setCurrentPage(1)
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1e3a8a] text-white shadow-2xs"
                      : "bg-slate-100/80 hover:bg-slate-200/70 text-slate-600"
                  }`}
                >
                  <span suppressHydrationWarning>
                    {cat === "All" ? (mounted ? `All Categories (${customProfiles.length})` : "All Categories") : cat}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Profile Cards Grid / List */}
        {!mounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-100/70 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProfiles.length === 0 ? (
          /* Empty State */
          <div className="py-14 text-center space-y-3 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center mx-auto">
              <Package className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-sm text-slate-800">No matching health profiles found</h3>
              <p className="text-xs text-slate-500">
                Try searching with different keywords or create your own custom profile bundling tests.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("All")
              }}
              className="px-4 py-2 rounded-xl bg-[#1e3a8a] text-white font-bold text-xs cursor-pointer hover:bg-blue-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedProfiles.map((p) => {
              const isExpanded = expandedProfileId === p.id
              const savings = p.totalMrp - p.discountedPrice
              const isUserCreated = p.isCustomerCreated || p.craId === customer?.id || p.craName === customerDisplayName

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header & Badge */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#1e3a8a] border border-blue-100">
                        {p.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {p.selectedTestCodes.length} Tests
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-900 transition-colors">
                        {p.profileTitle}
                      </h3>
                    </div>

                    {/* Included Tests Pill List */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10.5px] font-bold uppercase text-slate-400 tracking-wider">
                        Included Diagnostic Tests:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.testNames.slice(0, isExpanded ? p.testNames.length : 3).map((testName, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10.5px] font-medium text-slate-700"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span className="truncate max-w-[180px]">{testName}</span>
                          </span>
                        ))}
                      </div>

                      {p.testNames.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setExpandedProfileId(isExpanded ? null : p.id)}
                          className="text-[10.5px] font-bold text-[#1e3a8a] hover:underline cursor-pointer pt-0.5 inline-block"
                        >
                          {isExpanded ? "Show less" : `+ ${p.testNames.length - 3} more tests`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Pricing & Booking Footer */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-lg sm:text-xl font-black text-slate-900">
                            ₹{p.discountedPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="font-mono text-xs text-slate-400 line-through">
                            ₹{p.totalMrp.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <span>20% Discount Applied</span>
                          <span>• Save ₹{savings.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* Share & Delete buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenShareModal(p)}
                          className="h-8 w-8 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#1e3a8a] hover:border-blue-300 hover:bg-blue-50/60 flex items-center justify-center transition-colors cursor-pointer"
                          title="Share Profile"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>

                        {isUserCreated && (
                          <button
                            type="button"
                            onClick={() => deleteCustomProfile(p.id)}
                            className="h-8 w-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete this profile"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Primary Booking Redirect Button */}
                    <button
                      type="button"
                      onClick={() => handleBookProfile(p.id)}
                      className="w-full h-10 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <CalendarCheck className="h-4 w-4 text-cyan-300" />
                      <span>Book This Profile</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="space-y-3">
            {paginatedProfiles.map((p) => {
              const isExpanded = expandedProfileId === p.id
              const savings = p.totalMrp - p.discountedPrice
              const isUserCreated = p.isCustomerCreated || p.craId === customer?.id || p.craName === customerDisplayName

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#1e3a8a] border border-blue-100">
                        {p.category}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {p.selectedTestCodes.length} Tests
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                      {p.profileTitle}
                    </h3>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                      <span className="font-bold">Tests:</span>
                      <span className="text-slate-500 truncate">
                        {p.testNames.slice(0, 4).join(", ")}
                        {p.testNames.length > 4 && ` + ${p.testNames.length - 4} more`}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Book Action */}
                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-right">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="font-mono text-lg font-black text-slate-900">
                          ₹{p.discountedPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="font-mono text-xs text-slate-400 line-through">
                          ₹{p.totalMrp.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        20% Off • Save ₹{savings.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenShareModal(p)}
                        className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-900 hover:bg-blue-50/60 flex items-center justify-center transition-colors cursor-pointer"
                        title="Share Profile"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>

                      {isUserCreated && (
                        <button
                          type="button"
                          onClick={() => deleteCustomProfile(p.id)}
                          className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete profile"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleBookProfile(p.id)}
                        className="h-9 px-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <CalendarCheck className="h-3.5 w-3.5 text-cyan-300" />
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {mounted && filteredProfiles.length > pageSize && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div>
              Showing <strong className="font-mono text-slate-800">{paginatedProfiles.length}</strong> of{" "}
              <strong className="font-mono text-slate-800">{filteredProfiles.length}</strong> profiles
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-mono font-bold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SLIDE-OVER RIGHT SIDEBAR DRAWER: CREATE CUSTOM PROFILE                    */}
      {/* ========================================================================= */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with smooth blur and fade in */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-drawer-fade-in transition-opacity"
            onClick={() => setIsBuilderOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Sidebar Container on the Right (Family Beneficiaries Style) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
            <div
              className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 pointer-events-auto sm:rounded-l-2xl animate-drawer-slide-in"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-50/80 via-white to-slate-50/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles className="h-5 w-5 text-cyan-300 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Make My Profile Builder
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bundle multiple lab tests into your custom health panel
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1 thin-scrollbar text-xs">
                
                {builderError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-between">
                    <span>{builderError}</span>
                    <button type="button" onClick={() => setBuilderError(null)} className="text-rose-500 hover:text-rose-800">×</button>
                  </div>
                )}

                {/* Title & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Profile Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={builderTitle}
                      onChange={(e) => {
                        setBuilderTitle(e.target.value)
                        setBuilderError(null)
                      }}
                      placeholder="e.g. My Family Checkup, Parents Health Panel"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={builderCategory}
                      onChange={(e: any) => setBuilderCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                    >
                      <option value="Wellness & Preventive">Wellness &amp; Preventive</option>
                      <option value="Cardio-Diabetic">Cardio-Diabetic</option>
                      <option value="Women's Health">Women's Health</option>
                      <option value="Senior Care">Senior Care</option>
                      <option value="Custom Clinic Panel">Custom Routine Panel</option>
                    </select>
                  </div>
                </div>

                {/* Test Search & Department Filters */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Tests to Bundle ({selectedCodes.length} selected):
                    </label>
                    <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full">
                      Total MRP: ₹{builderTotalMrp}
                    </span>
                  </div>

                  {/* Filter Department Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                    {["All", "Blood & CBC", "Diabetes & Glucose", "Thyroid & Hormones", "Lipid & Cardiology", "Liver & Kidney", "Vitamins & Urine"].map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setBuilderCategoryFilter(dept)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          builderCategoryFilter === dept
                            ? "bg-[#1e3a8a] text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>

                  {/* Search tests input */}
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={builderSearch}
                      onChange={(e) => setBuilderSearch(e.target.value)}
                      placeholder="Search 100+ tests by name or code (e.g. Glucose, Thyroid, CBC, Lipid)..."
                      className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {/* Test Selection List (Scrollable) */}
                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 p-1 bg-slate-50/40 thin-scrollbar">
                    {filteredBuilderTests.map((t) => {
                      const isChecked = selectedCodes.includes(t.code)
                      return (
                        <div
                          key={t.code}
                          onClick={() => handleToggleTest(t.code)}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            isChecked ? "bg-blue-50/80 text-blue-950 font-bold" : "hover:bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              className="h-4 w-4 rounded text-[#1e3a8a] focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="font-mono text-[10px] text-blue-800 bg-blue-100/70 px-1 py-0.5 rounded font-bold">
                              {t.code}
                            </span>
                            <span className="truncate max-w-[240px] sm:max-w-xs font-medium text-slate-900">
                              {t.name}
                            </span>
                          </div>

                          <div className="font-mono font-bold text-slate-900 text-right shrink-0">
                            ₹{t.mrp}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Selected Tests Chips */}
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200/80 thin-scrollbar">
                    {selectedTestsData.map((t) => (
                      <span
                        key={t.code}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[10.5px] font-semibold text-blue-900"
                      >
                        <span className="font-mono text-[9.5px] font-bold">{t.code}</span>
                        <span className="truncate max-w-[120px]">{t.name}</span>
                        <span className="font-mono text-[#1e3a8a]">₹{t.mrp}</span>
                        {selectedCodes.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleTest(t.code)
                            }}
                            className="text-blue-400 hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Calculation Summary */}
                <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-2xl border border-blue-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Total Diagnostic Price (MRP):</span>
                    <span className="font-mono font-medium text-slate-900">₹{builderTotalMrp.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700 font-semibold">
                    <span>Patient 20% Direct Discount:</span>
                    <span className="font-mono">- ₹{builderDiscount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-blue-200/60 text-slate-900 font-black text-sm">
                    <span>Final Booking Price:</span>
                    <span className="font-mono text-[#1e3a8a] text-base">₹{builderFinalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

              </div>

              {/* Drawer Sticky Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProfile(false)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    Save Profile Only
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveProfile(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-950/15 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CalendarCheck className="h-3.5 w-3.5 text-cyan-300" />
                    <span>Save &amp; Book Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHARE PROFILE MODAL                                                       */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center">
                  <Share2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Share Health Profile</h3>
                  <p className="text-[11px] text-slate-500">Share direct booking link with family or friends</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(null)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1e3a8a]">
                    {showShareModal.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    20% OFF
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{showShareModal.profileTitle}</div>
                <div className="text-[11px] text-slate-600 flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900">₹{showShareModal.discountedPrice}</span>
                  <span className="line-through text-slate-400 font-mono text-[10px]">₹{showShareModal.totalMrp}</span>
                  <span>• {showShareModal.selectedTestCodes.length} Tests Bundled</span>
                </div>
              </div>

              {/* Copy Link Row */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Direct Booking Link
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== "undefined" ? `${window.location.origin}/booking?profile=${showShareModal.id}` : `https://avmlabs.com/booking?profile=${showShareModal.id}`}
                    className="flex-1 h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(showShareModal)}
                    className="h-9 px-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    {copiedProfileId === showShareModal.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share via WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this custom health checkup package on AVM Labs: ${showShareModal.profileTitle} with ${showShareModal.selectedTestCodes.length} tests at ₹${showShareModal.discountedPrice} (20% OFF). Book here: ${typeof window !== "undefined" ? `${window.location.origin}/booking?profile=${showShareModal.id}` : `https://avmlabs.com/booking?profile=${showShareModal.id}`}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
