"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore, CRA_DISCOUNT_CONFIG } from "@/lib/workflow-store"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { ReferralShareModal } from "@/components/cra/ReferralShareModal"
import { 
  Sparkles, 
  Check, 
  Plus, 
  Share2, 
  ArrowLeft, 
  Trash2, 
  Search, 
  FlaskConical, 
  Building2, 
  Users, 
  User,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  Send,
  ArrowRight,
  Heart,
  CheckCircle2, 
  Copy, 
  Smartphone, 
  QrCode, 
  Package, 
  Coins, 
  Info,
  Calendar,
  X,
  ChevronDown,
  Filter,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUp
} from "lucide-react"

export interface SelectableTest {
  code: string
  name: string
  category: string
  mrp: number
  sample: string
}

export default function MakeMyProfilePage() {
  const router = useRouter()
  const { 
    currentUser, 
    customProfiles, 
    createCustomProfile, 
    deleteCustomProfile, 
    orgProfile, 
    updateOrgProfile,
    beneficiaries
  } = useWorkflowStore()

  // 100+ AVM Labs Tests
  const allTests = useMemo<SelectableTest[]>(() => {
    return CRA_TESTS.map(t => ({
      code: t.code,
      name: t.name,
      category: t.category || "Diagnostic Pathology",
      mrp: t.catalogueRate,
      sample: t.sample || "Blood"
    }))
  }, [])

  // Form State for creating a new custom profile
  const [brandName, setBrandName] = useState(orgProfile?.brandName || "XYZ Yoga & Wellness Center")
  const [profileTitle, setProfileTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"Wellness & Preventive" | "Cardio-Diabetic" | "Women's Health" | "Senior Care" | "Custom Clinic Panel">("Wellness & Preventive")
  const [selectedCodes, setSelectedCodes] = useState<string[]>(["H6", "FBS", "LIPID", "TSH"])
  const [searchQuery, setSearchQuery] = useState("")
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Health Category Focus Custom Dropdown State
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)

  // Test Selection Dropdown State
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All")
  const testDropdownRef = useRef<HTMLDivElement>(null)

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [activeShareProfile, setActiveShareProfile] = useState<any>(null)

  // Published Profiles Manager State (Compact, Scalable UX for 30+ items)
  const [publishedSearchQuery, setPublishedSearchQuery] = useState("")
  const [publishedCategoryFilter, setPublishedCategoryFilter] = useState("All")
  const [publishedSortBy, setPublishedSortBy] = useState<"newest" | "earning_desc" | "price_asc" | "title_asc">("newest")
  const [publishedViewMode, setPublishedViewMode] = useState<"compact" | "list">("compact")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(4)
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null)
  const [copiedProfileId, setCopiedProfileId] = useState<string | null>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (testDropdownRef.current && !testDropdownRef.current.contains(event.target as Node)) {
        setIsTestDropdownOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Popular medical department / organ categories
  const testCategories = useMemo(() => {
    return [
      "All Tests",
      "Blood & CBC",
      "Diabetes & Glucose",
      "Thyroid & Hormones",
      "Lipid & Cardiology",
      "Liver & Kidney",
      "Vitamins & Urine"
    ]
  }, [])

  // Filtered available tests with search and category filter
  const filteredTests = useMemo(() => {
    return allTests.filter(t => {
      if (activeCategoryFilter !== "All Tests") {
        const cat = activeCategoryFilter.toLowerCase()
        const match = 
          (activeCategoryFilter === "Blood & CBC" && (t.category.includes("Hematology") || t.sample === "EDTA" || t.name.includes("HEMO") || t.name.includes("CBC"))) ||
          (activeCategoryFilter === "Diabetes & Glucose" && (t.name.includes("GLUCOSE") || t.name.includes("SUGAR") || t.name.includes("HBA1C") || t.name.includes("INSULIN"))) ||
          (activeCategoryFilter === "Thyroid & Hormones" && (t.name.includes("THYROID") || t.name.includes("TSH") || t.name.includes("T3") || t.name.includes("T4") || t.category.includes("Endocrinology"))) ||
          (activeCategoryFilter === "Lipid & Cardiology" && (t.name.includes("LIPID") || t.name.includes("CHOLESTEROL") || t.name.includes("TRIGLYCERIDES") || t.name.includes("CARDIAC"))) ||
          (activeCategoryFilter === "Liver & Kidney" && (t.name.includes("LIVER") || t.name.includes("SGOT") || t.name.includes("SGPT") || t.name.includes("CREATININE") || t.name.includes("UREA") || t.name.includes("BILIRUBIN") || t.name.includes("KIDNEY"))) ||
          (activeCategoryFilter === "Vitamins & Urine" && (t.name.includes("VITAMIN") || t.sample === "Urine" || t.name.includes("URINE")))

        if (!match) return false
      }
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        t.name.toLowerCase().includes(q) || 
        t.code.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q) ||
        t.sample.toLowerCase().includes(q)
      )
    })
  }, [allTests, searchQuery, activeCategoryFilter])

  // Calculations for newly selected tests
  const selectedTestsData = allTests.filter(t => selectedCodes.includes(t.code))
  const totalMrp = selectedTestsData.reduce((sum, t) => sum + t.mrp, 0)
  const discountRate = CRA_DISCOUNT_CONFIG.customerDiscountPercent / 100
  const totalDiscount = Math.round(totalMrp * discountRate)
  const discountedPrice = totalMrp - totalDiscount
  const realizedRevenue = discountedPrice
  const directIncentive = Math.round(realizedRevenue * (CRA_DISCOUNT_CONFIG.directIncentivePercent / 100))

  const handleToggleTest = (code: string) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 1) {
        setSelectedCodes(selectedCodes.filter(c => c !== code))
      }
    } else {
      setSelectedCodes([...selectedCodes, code])
    }
  }

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileTitle.trim() || selectedCodes.length === 0) return

    createCustomProfile({
      brandOrOrgName: brandName,
      profileTitle: profileTitle.trim(),
      description: description.trim() || `Custom health test profile curated by ${currentUser.name} (${brandName}) with AVM Labs.`,
      category,
      selectedTestCodes: selectedCodes,
      testNames: selectedTestsData.map(t => t.name),
      totalMrp,
      discountedPrice,
      realizedRevenue,
      directIncentive
    })

    // Also update org name
    updateOrgProfile({
      brandName: brandName,
      diagnosticCenterName: brandName.includes("Diagnostic") ? brandName : `${brandName.replace(/& Wellness|Wellness|Center|Clinic/g, "").trim()} Diagnostic Center`
    })

    setSavedSuccess(true)
    setProfileTitle("")
    setDescription("")
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleOpenShare = (profile: any) => {
    setActiveShareProfile(profile)
    setShareModalOpen(true)
  }

  // Categories present in published profiles
  const publishedCategories = useMemo(() => {
    const cats = Array.from(new Set(customProfiles.map(p => p.category)))
    return ["All", ...cats]
  }, [customProfiles])

  // Filtered & Sorted published profiles
  const filteredPublishedProfiles = useMemo(() => {
    return customProfiles
      .filter((p) => {
        if (publishedCategoryFilter !== "All" && p.category !== publishedCategoryFilter) {
          return false
        }
        if (!publishedSearchQuery.trim()) return true
        const q = publishedSearchQuery.toLowerCase()
        return (
          p.profileTitle.toLowerCase().includes(q) ||
          p.brandOrOrgName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.testNames.some(t => t.toLowerCase().includes(q)) ||
          p.selectedTestCodes.some(c => c.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (publishedSortBy === "earning_desc") return b.directIncentive - a.directIncentive
        if (publishedSortBy === "price_asc") return a.discountedPrice - b.discountedPrice
        if (publishedSortBy === "title_asc") return a.profileTitle.localeCompare(b.profileTitle)
        return 0
      })
  }, [customProfiles, publishedCategoryFilter, publishedSearchQuery, publishedSortBy])

  const totalPages = Math.max(1, Math.ceil(filteredPublishedProfiles.length / (pageSize === -1 ? filteredPublishedProfiles.length || 1 : pageSize)))
  
  const paginatedProfiles = useMemo(() => {
    if (pageSize === -1) return filteredPublishedProfiles
    const start = (currentPage - 1) * pageSize
    return filteredPublishedProfiles.slice(start, start + pageSize)
  }, [filteredPublishedProfiles, currentPage, pageSize])

  // Auto-adjust page if filter or search changes total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  const handleCopyProfileLink = (p: any) => {
    const url = p.shareLink || (typeof window !== "undefined"
      ? `${window.location.origin}/booking?ref=${currentUser.code}&profile=${p.id}`
      : `https://avmlabs.com/booking?ref=${currentUser.code}&profile=${p.id}`)
    
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url)
      setCopiedProfileId(p.id)
      setTimeout(() => setCopiedProfileId(null), 2000)
    }
  }

  return (
    <div className="w-full font-sans space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/cra/dashboard" className="hover:text-indigo-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Make My Profile</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-[#382685] border border-purple-200">
              Custom Diagnostic Bundler
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Select multiple tests of AVM Labs to build a curated health profile under your brand • Can be ordered by your customers or booked for family members
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cra/dashboard/beneficiaries"
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Users className="h-4 w-4 text-[#382685]" />
            <span>Family Beneficiaries ({beneficiaries.length})</span>
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between border border-emerald-400/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
            <span>Custom Diagnostic Profile created and published successfully! Ready to share or order.</span>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Profile Builder Form */}
        <form onSubmit={handleCreateProfile} className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs space-y-5">
          
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#382685]" />
              <h2 className="font-black text-sm sm:text-base text-slate-900">
                1. Curate &amp; Bundle AVM Labs Tests
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#382685] bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              {selectedCodes.length} Tests Selected
            </span>
          </div>

          {/* Organization & Profile Branding Details */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Organization / Brand Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. XYZ Yoga & Wellness Center, Dr. Sharma Clinic"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Patients will see this as: <strong>{brandName.includes("Diagnostic") ? brandName : `${brandName} (Powered by AVM Labs)`}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Profile Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                  placeholder="e.g. Complete Yoga Vitality & Detox Panel"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Health Category Focus
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className={`w-full h-11 px-3.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isCategoryDropdownOpen
                      ? "bg-white border-[#382685] ring-2 ring-[#382685]/15 shadow-sm"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-[#382685] shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {category}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isCategoryDropdownOpen ? "rotate-180 text-[#382685]" : ""}`} />
                </button>

                {/* Custom Category Options Dropdown */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                    {[
                      { val: "Wellness & Preventive", desc: "General health, routine vitality & wellness checkups" },
                      { val: "Cardio-Diabetic", desc: "Heart health, glucose monitoring & lipids" },
                      { val: "Women's Health", desc: "Hormonal balance, fertility & wellness" },
                      { val: "Senior Care", desc: "Geriatric profiles, mobility & vitality" },
                      { val: "Custom Clinic Panel", desc: "Specialist & clinician practice profiles" }
                    ].map((item) => {
                      const isSelected = category === item.val
                      return (
                        <div
                          key={item.val}
                          onClick={() => {
                            setCategory(item.val as any)
                            setIsCategoryDropdownOpen(false)
                          }}
                          className={`px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-purple-50 text-purple-950 font-bold border border-purple-200/80"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900">{item.val}</div>
                            <div className="text-[10.5px] text-slate-400 font-normal">{item.desc}</div>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#382685] stroke-[3] shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Profile Description / Recommendation Note
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Recommended for routine quarterly vitality checkup, metabolic health & energy monitoring..."
                className="w-full p-3 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
              />
            </div>
          </div>

          {/* Test Selection Multi-Picker with Modern Collapsible Dropdown */}
          <div className="space-y-3 pt-2" ref={testDropdownRef}>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select AVM Labs Tests to Include <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Choose individual pathology and clinical tests to package into your profile
                </span>
              </div>
              <span className="text-xs font-mono font-black text-[#382685] bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                {selectedCodes.length} selected
              </span>
            </div>

            {/* Dropdown Trigger Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTestDropdownOpen(!isTestDropdownOpen)}
                className={`w-full h-12 px-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs ${
                  isTestDropdownOpen 
                    ? "bg-white border-[#382685] ring-2 ring-[#382685]/15 shadow-sm" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 text-slate-700 text-xs sm:text-sm font-medium">
                  <FlaskConical className="h-4 w-4 text-[#382685] shrink-0" />
                  <span className="truncate font-semibold text-slate-800">
                    {selectedCodes.length === 0 
                      ? "Select tests from AVM Labs clinical directory..." 
                      : `Bundled: ${selectedTestsData.slice(0, 2).map(t => t.name).join(", ")}${selectedTestsData.length > 2 ? ` + ${selectedTestsData.length - 2} more` : ""}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                    ₹{totalMrp} MRP
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isTestDropdownOpen ? "rotate-180 text-[#382685]" : ""}`} />
                </div>
              </button>

              {/* Floating Dropdown Menu */}
              {isTestDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[350px] flex flex-col">
                  
                  {/* Dropdown Search & Category Filters */}
                  <div className="p-3 border-b border-slate-100 bg-slate-50/90 space-y-2 shrink-0">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tests: CBC, Thyroid, Glucose, Lipid, Liver, Serum, EDTA..."
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

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                      {testCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                            activeCategoryFilter === cat
                              ? "bg-[#382685] text-white shadow-2xs"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Showing <strong>{filteredTests.length}</strong> clinical tests</span>
                      <span className="font-semibold text-purple-900">{selectedCodes.length} selected</span>
                    </div>
                  </div>

                  {/* Scrollable Tests Selection List with Compact Height */}
                  <div className="overflow-y-auto p-1.5 divide-y divide-slate-100 max-h-56">
                    {filteredTests.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No tests found matching &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      filteredTests.map((t) => {
                        const isSelected = selectedCodes.includes(t.code)
                        return (
                          <div
                            key={t.code}
                            onClick={() => handleToggleTest(t.code)}
                            className={`px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2.5 text-xs transition-colors cursor-pointer ${
                              isSelected 
                                ? "bg-purple-50/90 border border-purple-200/80 text-purple-950 font-bold" 
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-[#251b5c] border-[#251b5c] text-white" : "border-slate-300 bg-white"
                              }`}>
                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <div className="truncate">
                                <span className="font-mono text-[9.5px] text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded mr-1.5 border border-purple-200 font-bold">
                                  {t.code}
                                </span>
                                <span className="font-semibold text-slate-900 truncate">{t.name}</span>
                                <span className="text-slate-400 text-[10px] ml-1.5 font-normal">({t.sample})</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-xs">₹{t.mrp}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Dropdown Footer Action */}
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                    <span className="text-xs text-slate-600 font-medium">
                      Total MRP: <strong className="text-slate-900 font-mono">₹{totalMrp}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTestDropdownOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#382685] hover:bg-[#251b5c] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                    >
                      Done Selecting ({selectedCodes.length})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Tests Summary Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  Currently Bundled Tests ({selectedTestsData.length}):
                </span>
                {selectedCodes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCodes([selectedCodes[0]])}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    Reset to 1 Test
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                {selectedTestsData.map(t => (
                  <span
                    key={t.code}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200/80 text-[11px] font-semibold text-purple-950 shadow-2xs"
                  >
                    <span className="font-mono text-[10px] text-purple-700 bg-purple-100 px-1 py-0.2 rounded font-bold">{t.code}</span>
                    <span className="font-medium text-slate-800">{t.name}</span>
                    <span className="font-mono font-bold text-[#382685]">₹{t.mrp}</span>
                    {selectedCodes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleToggleTest(t.code)}
                        className="text-purple-400 hover:text-rose-600 font-bold ml-0.5 text-xs cursor-pointer"
                        title={`Remove ${t.name}`}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>Create &amp; Save Custom Diagnostic Profile ({selectedCodes.length} Tests)</span>
          </button>

        </form>

        {/* Right 5 Columns: Commercial Breakdown & Active Custom Profiles */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Live Commercial Pricing Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900">
                <Coins className="h-4 w-4 text-[#382685]" />
                <span>Commercial &amp; Incentive Estimate</span>
              </div>
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {CRA_DISCOUNT_CONFIG.customerDiscountPercent}% Partner Discount
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Sum of Individual MRPs ({selectedCodes.length} tests):</span>
                <span className="font-mono text-slate-800 font-medium">₹{totalMrp.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-700 font-semibold">
                <span>Customer / Family Discount ({CRA_DISCOUNT_CONFIG.customerDiscountPercent}%):</span>
                <span className="font-mono">- ₹{totalDiscount.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-900 font-bold">
                <span>Final Realized Revenue (RR):</span>
                <span className="font-mono font-black text-sm text-slate-900">₹{realizedRevenue.toLocaleString("en-IN")}</span>
              </div>

              {/* Direct 30% Incentive Box */}
              <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/80 rounded-2xl border border-blue-200/80 text-center space-y-0.5 mt-2">
                <div className="text-[10.5px] uppercase font-bold text-blue-900">
                  Your 30% Direct Earning per Order
                </div>
                <div className="font-mono text-2xl font-black text-[#2F5FDE]">
                  +₹{directIncentive.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-slate-500">
                  Earned when referred patients or customers book this profile
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Discount logic is configurable (10%–30% range discussed, pending final sign-off).</span>
            </div>
          </div>

          {/* Active Custom Profiles Manager & Catalog */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 space-y-3.5 shadow-2xs">
            
            {/* Header: Title, Count badge & View Switcher */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#382685]" />
                <h3 className="font-black text-xs sm:text-sm text-slate-900">
                  Published Profiles
                </h3>
                <span className="font-mono text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#382685]">
                  {customProfiles.length}
                </span>
              </div>

              {/* View Toggle (Compact Cards vs Dense List) */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPublishedViewMode("compact")}
                  className={`h-7 px-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                    publishedViewMode === "compact"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Card View (Compact)"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPublishedViewMode("list")}
                  className={`h-7 px-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                    publishedViewMode === "list"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Dense List View (Best for 10+ profiles)"
                >
                  <ListIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            {/* Quick Search & Sort Filter Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={publishedSearchQuery}
                    onChange={(e) => {
                      setPublishedSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder={`Search ${customProfiles.length} profiles by title or test...`}
                    className="w-full h-8 pl-8 pr-7 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#382685]"
                  />
                  {publishedSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setPublishedSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <select
                  value={publishedSortBy}
                  onChange={(e: any) => setPublishedSortBy(e.target.value)}
                  className="h-8 px-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#382685] cursor-pointer"
                  title="Sort profiles"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="earning_desc">Earning: High → Low</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="title_asc">Title: A → Z</option>
                </select>
              </div>

              {/* Category Pills */}
              {publishedCategories.length > 2 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  {publishedCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setPublishedCategoryFilter(cat)
                        setCurrentPage(1)
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors cursor-pointer ${
                        publishedCategoryFilter === cat
                          ? "bg-[#251b5c] text-white shadow-2xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {cat === "All" ? `All (${customProfiles.length})` : cat.split(" ")[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scroll-contained List / Cards Container */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {paginatedProfiles.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-2xl bg-slate-50/80 border border-dashed border-slate-200 space-y-2">
                  <Package className="h-8 w-8 text-slate-300 mx-auto" />
                  <div className="text-xs font-bold text-slate-700">
                    {publishedSearchQuery || publishedCategoryFilter !== "All"
                      ? "No matching profiles found"
                      : "No custom profiles published yet"}
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    {publishedSearchQuery || publishedCategoryFilter !== "All"
                      ? "Try searching with a different term or clear your category filter."
                      : "Select tests on the left and click 'Create & Save' to publish your first branded bundle."}
                  </p>
                  {(publishedSearchQuery || publishedCategoryFilter !== "All") && (
                    <button
                      type="button"
                      onClick={() => {
                        setPublishedSearchQuery("")
                        setPublishedCategoryFilter("All")
                      }}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#382685] hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : publishedViewMode === "compact" ? (
                /* Compact Cards View */
                paginatedProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-2 hover:border-slate-300 hover:shadow-xs transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-purple-50 text-[#382685] border border-purple-200">
                            {p.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate">by {p.brandOrOrgName}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate" title={p.profileTitle}>
                          {p.profileTitle}
                        </h4>
                      </div>

                      {/* Quick Icons */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyProfileLink(p)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy direct referral booking link"
                        >
                          {copiedProfileId === p.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenShare(p)}
                          className="p-1 rounded-lg text-slate-400 hover:text-[#382685] hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Share Flyer & WhatsApp"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCustomProfile(p.id)}
                          className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete profile"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tests snippet & collapsible trigger */}
                    <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <FlaskConical className="h-3 w-3 text-[#382685] shrink-0" />
                        <span className="font-bold text-slate-700 text-[10.5px]">{p.selectedTestCodes.length} Tests:</span>
                        <span className="truncate text-slate-500 text-[10.5px]">{p.testNames.slice(0, 2).join(", ")}{p.testNames.length > 2 ? ` +${p.testNames.length - 2} more` : ""}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedProfileId(expandedProfileId === p.id ? null : p.id)}
                        className="text-[10px] font-bold text-[#382685] hover:underline shrink-0 ml-1.5 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{expandedProfileId === p.id ? "Hide" : "Details"}</span>
                        {expandedProfileId === p.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>

                    {/* Expanded Drawer */}
                    {expandedProfileId === p.id && (
                      <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100 text-[10.5px] space-y-1.5 animate-in fade-in">
                        <p className="text-slate-600 italic">{p.description}</p>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {p.testNames.map((name, idx) => (
                            <span key={idx} className="bg-white border border-purple-200/80 text-purple-950 px-1.5 py-0.5 rounded text-[9.5px] font-medium shadow-2xs">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price & Earning inline */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Pays:</span>
                        <span className="font-mono font-black text-sm text-slate-900">₹{p.discountedPrice}</span>
                        <span className="text-[10px] line-through text-slate-400 font-mono">₹{p.totalMrp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Earn:</span>
                        <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-lg">
                          +₹{p.directIncentive} (30%)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Customer & Family */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/cra/dashboard/add-lead?mode=referral&profileId=${p.id}`)}
                        className="h-8 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Book for customer"
                      >
                        <User className="h-3 w-3 text-emerald-100" />
                        <span>Book Customer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/cra/dashboard/add-lead?mode=family&profileId=${p.id}`)}
                        className="h-8 px-2 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Book for family member"
                      >
                        <Users className="h-3 w-3 text-cyan-300" />
                        <span>Book Family</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                /* Dense List View (Super space-efficient for 30+ items) */
                paginatedProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between gap-2.5 text-xs"
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-purple-50 text-[#382685] flex items-center justify-center font-mono font-black text-[11px] shrink-0 border border-purple-100">
                        {p.selectedTestCodes.length}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="font-bold text-slate-900 text-xs truncate max-w-[150px] sm:max-w-[200px]" title={p.profileTitle}>
                            {p.profileTitle}
                          </h4>
                          <span className="px-1 py-0.2 text-[8px] font-extrabold uppercase bg-slate-100 text-slate-600 rounded shrink-0">
                            {p.category.split(" ")[0]}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-medium truncate">
                          ₹{p.discountedPrice} <span className="line-through text-slate-300 font-mono">₹{p.totalMrp}</span> • <span className="text-emerald-600 font-bold font-mono">+₹{p.directIncentive}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => router.push(`/cra/dashboard/add-lead?mode=referral&profileId=${p.id}`)}
                        className="h-7 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Book for Customer"
                      >
                        <User className="h-3 w-3" />
                        <span className="hidden sm:inline">Customer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`/cra/dashboard/add-lead?mode=family&profileId=${p.id}`)}
                        className="h-7 px-2 rounded-lg bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-[10.5px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Book for Family"
                      >
                        <Users className="h-3 w-3 text-cyan-300" />
                        <span className="hidden sm:inline">Family</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenShare(p)}
                        className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-500 hover:text-[#382685] flex items-center justify-center transition-colors cursor-pointer"
                        title="Share Flyer & Link"
                      >
                        <Share2 className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCustomProfile(p.id)}
                        className="h-7 w-7 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination & Footer Controls */}
            {filteredPublishedProfiles.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="text-[11px]">
                  Showing <strong className="text-slate-800 font-mono">{paginatedProfiles.length}</strong> of{" "}
                  <strong className="text-slate-800 font-mono">{filteredPublishedProfiles.length}</strong>
                  {pageSize !== -1 && totalPages > 1 && ` (Pg ${currentPage}/${totalPages})`}
                </div>

                <div className="flex items-center gap-1">
                  {/* Page Size selector */}
                  <select
                    value={pageSize}
                    onChange={(e: any) => {
                      setPageSize(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="h-7 px-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10.5px] font-bold text-slate-600 focus:outline-none cursor-pointer mr-1"
                    title="Items per page"
                  >
                    <option value={4}>4 / page</option>
                    <option value={8}>8 / page</option>
                    <option value={12}>12 / page</option>
                    <option value={-1}>All</option>
                  </select>

                  {/* Previous / Next buttons */}
                  {pageSize !== -1 && totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                        title="Previous page"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                        title="Next page"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Share / QR Code Modal for specific Custom Profile */}
      <ReferralShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        craName={currentUser.name}
        craCode={currentUser.code}
        orgName={activeShareProfile?.brandOrOrgName}
        profileTitle={activeShareProfile?.profileTitle}
        shareUrl={activeShareProfile?.shareLink}
        discountPercent={CRA_DISCOUNT_CONFIG.customerDiscountPercent}
      />

    </div>
  )
}
