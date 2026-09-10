"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { HEALTH_PACKAGES } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { AddFamilyMemberDrawer } from "@/components/booking/AddFamilyMemberDrawer"
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
  Crown,
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
  ClipboardList,
  AlertCircle
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
  const [refParam, setRefParam] = useState<string | null>(null)

  const {
    customer,
    beneficiaries,
    addBeneficiary,
    removeBeneficiary,
    prescriptionRequests,
    addPrescriptionRequest,
    currentUser,
    generateCustomerReferralCode,
    convertCustomerToCRA
  } = useWorkflowStore()

  const [copiedReferral, setCopiedReferral] = useState(false)
  const [simulatingConversion, setSimulatingConversion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("referred")
      setRefParam(p)
    }
  }, [])

  const isConverted = mounted ? Boolean(customer?.isConvertedToCRA) : false
  const referralCode = mounted ? (customer?.generatedReferralCode || "REF-SURESH-10") : "REF-SURESH-10"
  const craCode = mounted ? (customer?.craCode || "AVM-SURESH-CRA") : "AVM-SURESH-CRA"

  const customerBeneficiaries = useMemo(() => {
    return beneficiaries
  }, [beneficiaries])

  // Determine effective referrer name for this customer / dual-role user
  const effectiveReferrerName = useMemo(() => {
    // If URL query param explicitly marks referred=false
    if (refParam === "false") return null
    if (refParam === "true") {
      return customer?.referrerName || "THURAKA SREERAM"
    }

    // If current customer is C1 (Sreeram) or named THURAKA SREERAM, he has no introducer/referrer!
    const isSreeram =
      customer?.name?.toUpperCase().includes("SREERAM") ||
      currentUser?.id === "C1-SREERAM" ||
      (currentUser?.role === "c1" && !currentUser?.c1Name)

    if (isSreeram) {
      return null
    }

    // If current user is a C2 CRA user with an introducer/c1Name
    if (currentUser?.role === "c2" && currentUser?.c1Name) {
      return currentUser.c1Name
    }

    // Check customer profile in store
    if (customer?.isReferred && customer?.referrerName && customer.referrerName.trim()) {
      // Prevent self-referral (user being referred by themselves)
      if (customer.referrerName.trim().toUpperCase() !== customer.name?.trim().toUpperCase()) {
        return customer.referrerName
      }
    }

    return null
  }, [customer, currentUser, refParam])

  const showReferralBanner = mounted && Boolean(effectiveReferrerName)

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

      {/* 1. TOP BANNER: REFERRED BY CRA PARTNER CONTAINER (Only displayed if user is referred by someone) */}
      {showReferralBanner && (
        <div className="relative rounded-2xl bg-gradient-to-r from-[#071d49] via-[#0a3178] to-[#1253b8] p-3.5 sm:p-4 md:p-5 text-white shadow-xl shadow-blue-950/20 border border-blue-400/25 overflow-hidden min-h-[110px] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          
          {/* Family Banner Image - Seamlessly blended into royal blue background, hiding cursive text */}
          <div className="absolute inset-y-0 right-0 sm:right-[175px] md:right-[195px] lg:right-[210px] flex items-center pointer-events-none select-none z-0 opacity-25 sm:opacity-90 md:opacity-100 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/banner.png?v=6"
              alt="Healthy Families"
              className="h-full w-auto object-contain"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, transparent 35%, black 48%, black 85%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 35%, black 48%, black 85%, transparent 100%)"
              }}
            />
          </div>

          {/* Ambient Lighting & Soft Glows */}
          <div className="absolute -top-12 left-1/4 w-72 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-1/4 w-60 h-32 bg-blue-300/15 rounded-full blur-xl pointer-events-none" />

          {/* Left: Referral details - transparent background color REMOVED completely */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-cyan-300 shrink-0 backdrop-blur-md shadow-inner ring-4 ring-white/5">
              <Share2 className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-cyan-300" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-[10.5px] sm:text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                Referred by
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white uppercase truncate drop-shadow-xs">
                  {effectiveReferrerName}
                </h2>
                <Crown className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 text-amber-950 text-[9.5px] font-black uppercase tracking-wider shadow-xs">
                  CRA PARTNER
                </span>
              </div>
              <p className="text-xs sm:text-[12.5px] text-blue-100 font-medium leading-normal drop-shadow-xs max-w-xl">
                Special partner pricing applied across all diagnostic tests &amp; wellness packages.
              </p>
            </div>
          </div>

          {/* Right: Primary Call to Action Button */}
          <div className="relative z-10 w-full sm:w-auto flex items-center justify-end shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#004ce6] hover:from-[#0057e6] hover:to-[#003ec7] active:scale-98 text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center shadow-lg shadow-blue-950/30 hover:shadow-blue-900/50 border border-white/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Select Tests &amp; Profiles</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOWCHART: CUSTOMER-TO-CRA REFERRAL & DUAL-ROLE CONVERSION HUB           */}
      {/* ========================================================================= */}
      <div id="referral-hub" className="rounded-2xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#251b5c]/10 text-[#251b5c] flex items-center justify-center font-bold shrink-0">
              <Share2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Refer Customers &amp; Become a CRA Partner
                </h3>
                {isConverted ? (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active CRA Dual-Role
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Referral Program
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Share wellness: Referred customers get <strong>10% Referral Discount</strong>. <strong>ONLY when a referred customer&apos;s payment is successfully completed</strong>, you earn <strong>30% CRA Incentive</strong> and unlock the CRA Partner Portal! If unpaid or payment fails, no incentive is earned and you remain a customer.
              </p>
            </div>
          </div>

          {isConverted && (
            <Link
              href="/cra/dashboard"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all inline-flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Go to CRA Dashboard &rarr;</span>
            </Link>
          )}
        </div>

        {/* 2-Column Referral & Dual-Role Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl border transition-all bg-emerald-50/50 border-emerald-200 text-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold pb-1 text-[11px] text-slate-500 uppercase tracking-wide border-b border-emerald-100">
              <span>Referral Code &amp; Link</span>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">YOUR REFERRAL CODE (10% DISCOUNT):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs sm:text-sm text-[#251b5c] bg-white px-2.5 py-1 rounded-lg border border-indigo-200/80 shadow-2xs">
                    {referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(referralCode)
                      setCopiedReferral(true)
                      setTimeout(() => setCopiedReferral(false), 2000)
                    }}
                    className="text-[10.5px] font-bold px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shadow-2xs cursor-pointer transition-colors"
                  >
                    {copiedReferral ? "Copied! ✓" : "Copy Code"}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-0.5">SHAREABLE REFERRAL LINK:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    readOnly
                    value={`https://avmlabs.com/booking?ref=${referralCode}`}
                    className="w-full bg-white/90 border border-slate-200 text-slate-600 font-mono text-[10px] px-2 py-1 rounded-lg truncate select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://avmlabs.com/booking?ref=${referralCode}`)
                      setCopiedReferral(true)
                      setTimeout(() => setCopiedReferral(false), 2000)
                    }}
                    className="text-[10.5px] font-bold px-2.5 py-1 bg-[#251b5c] hover:bg-[#1a1340] text-white rounded-lg shadow-2xs cursor-pointer shrink-0 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-tight">
                Automatically generated &amp; ready to share. Anyone using your link receives an instant 10% discount.
              </p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${isConverted
              ? "bg-purple-50/60 border-purple-200 text-slate-800"
              : "bg-slate-50/70 border-slate-200 text-slate-600"
            }`}>
            <div className="flex items-center justify-between font-bold pb-1 text-[11px] text-slate-500 uppercase tracking-wide border-b border-slate-100">
              <span>Dual-Role &amp; 30% Incentive Activation</span>
              {isConverted ? (
                <span className="text-purple-700 font-extrabold text-[10px] bg-purple-100 px-2 py-0.5 rounded-full">
                  ✓ Active (Paid)
                </span>
              ) : (
                <span className="text-amber-700 font-extrabold text-[10px] bg-amber-100 px-2 py-0.5 rounded-full">
                  Customer Payment Required
                </span>
              )}
            </div>

            {isConverted ? (
              <div className="space-y-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-purple-200 space-y-1">
                  <div className="flex justify-between font-bold text-purple-900">
                    <span>30% CRA Incentive Credited:</span>
                    <span className="text-emerald-700 text-xs font-black">30%</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500">
                    Earned on realized revenue after 10% customer referral discount.
                  </div>
                  <div className="text-slate-600 font-mono text-[10.5px] pt-1 border-t border-slate-100">
                    Assigned CRA Partner ID: <strong className="text-slate-900">{craCode}</strong>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-semibold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Dual Access: Customer Role + CRA Portal Unlocked!</span>
                </div>

                <Link
                  href="/cra/dashboard"
                  className="w-full py-2 px-3 rounded-lg bg-[#251b5c] hover:bg-[#1a1340] text-white font-bold text-[11px] shadow-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Open CRA Partner Dashboard &rarr;</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-1 text-[11px]">
                <p className="text-slate-600 leading-snug">
                  When a referred customer books tests and <strong>successfully completes payment</strong>, you earn <strong>30% CRA Incentive</strong> and your account is elevated to CRA Partner with Dual-Role access!
                </p>

                <div className="p-2 rounded-lg bg-white border border-slate-200/80 space-y-0.5 text-[10.5px]">
                  <div className="font-bold text-slate-800">Flowchart Rule:</div>
                  <div className="text-slate-500">• 30% Incentive credited <strong>ONLY IF customer completes payment</strong>.</div>
                  <div className="text-slate-500">• If unpaid / pending, you remain a customer with 0% incentive.</div>
                </div>

                <button
                  type="button"
                  disabled={simulatingConversion}
                  onClick={() => {
                    setSimulatingConversion(true)
                    setTimeout(() => {
                      convertCustomerToCRA(1000)
                      setSimulatingConversion(false)
                    }, 600)
                  }}
                  className="w-full py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  {simulatingConversion ? "Verifying Customer Payment..." : "⚡ Simulate Referred Customer Order & Payment"}
                </button>
              </div>
            )}
          </div>
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
          <div ref={searchContainerRef} className="relative z-20">
            <div className="relative flex items-center w-full bg-white rounded-2xl border-2 border-slate-200/90 hover:border-indigo-300 focus-within:border-[#251b5c] focus-within:ring-4 focus-within:ring-[#251b5c]/10 shadow-xs transition-all">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#251b5c] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                placeholder="Search 100+ tests &amp; profiles (e.g. Full Body, Thyroid, CBC, Lipid)..."
                className="w-full pl-11 pr-28 py-3 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setIsSearchOpen(false)
                  }}
                  className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer transition-colors"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#251b5c] to-[#31237a] hover:from-[#1b1344] hover:to-[#251b5c] text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <FlaskConical className="h-3.5 w-3.5 text-cyan-300" />
                <span>Browse</span>
              </button>
            </div>

            {/* Inline Search Dropdown Results */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 z-50">
                {/* Search Dropdown Filter Header */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSearchTab("all")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${searchTab === "all"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      All ({allCatalogItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab("packages")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${searchTab === "packages"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      Packages (12)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchTab("tests")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${searchTab === "tests"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${isActive
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
              <div className="flex items-center gap-2">
                <Link
                  href="/customer/dashboard/make-my-profile"
                  className="text-xs font-bold text-[#1e3a8a] bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg hover:bg-blue-100/70 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Make My Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => router.push('/booking')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>See all ({allCatalogItems.length}+)</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
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

            <div className="space-y-1.5" suppressHydrationWarning>
              {customerBeneficiaries.map((b) => (
                <div key={b.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs" suppressHydrationWarning>
                  <div className="flex items-center gap-2 min-w-0" suppressHydrationWarning>
                    <div className="h-7 w-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0" suppressHydrationWarning>
                      {b.relation.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0" suppressHydrationWarning>
                      <div className="font-bold text-slate-900 text-[11px] truncate" suppressHydrationWarning>{b.fullName}</div>
                      <div className="text-[10px] text-slate-500" suppressHydrationWarning>{b.relation} • {b.age} yrs • {b.gender}</div>
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
              View All &amp; Manage Beneficiaries ({customerBeneficiaries.length}) →
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
      {/* SLIDE-OVER SIDEBAR DRAWER: ADD FAMILY BENEFICIARY                         */}
      {/* ========================================================================= */}
      <AddFamilyMemberDrawer
        isOpen={showAddBenModal}
        onClose={() => setShowAddBenModal(false)}
        onSave={(data) => {
          addBeneficiary({
            fullName: data.name,
            relation: data.relation,
            age: parseInt(data.age) || 30,
            gender: data.gender,
            address: data.address,
            city: "Bengaluru",
            pincode: "560038",
            selectedTests: []
          })
          setShowAddBenModal(false)
        }}
        defaultAddress={customer?.address || "#42, 12th Cross, HAL 2nd Stage, Indiranagar"}
        title="Add Family Member"
      />

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
