"use client"

import { useState, useMemo } from "react"
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
  Package
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
  
  const [copiedOtp, setCopiedOtp] = useState(false)
  const [selectedReportModal, setSelectedReportModal] = useState<any>(null)

  // SELECT TESTS & PROFILES MODAL STATE (CRA Standard)
  const [isSelectTestsModalOpen, setIsSelectTestsModalOpen] = useState(false)
  const [modalSearchQuery, setModalSearchQuery] = useState("")
  const [modalTab, setModalTab] = useState<"all" | "packages" | "tests">("all")
  const [modalSelectedIds, setModalSelectedIds] = useState<string[]>(["pkg-master"])
  
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

  const handleCopyOtp = () => {
    navigator.clipboard.writeText("4821")
    setCopiedOtp(true)
    setTimeout(() => setCopiedOtp(false), 2000)
  }

  // Modal Multi-Select Toggle
  const handleModalToggleItem = (itemId: string) => {
    if (modalSelectedIds.includes(itemId)) {
      if (modalSelectedIds.length > 1) {
        setModalSelectedIds(modalSelectedIds.filter(id => id !== itemId))
      }
    } else {
      setModalSelectedIds([...modalSelectedIds, itemId])
    }
  }

  const handleModalRemoveItem = (itemId: string) => {
    if (modalSelectedIds.length > 1) {
      setModalSelectedIds(modalSelectedIds.filter(id => id !== itemId))
    }
  }

  const modalSelectedItems = allCatalogItems.filter(item => modalSelectedIds.includes(item.id))
  const modalTotalMrp = modalSelectedItems.reduce((sum, item) => sum + item.mrp, 0)
  const modalTotalDiscount = modalSelectedItems.reduce((sum, item) => sum + item.discount, 0)
  const modalTotalPrice = modalSelectedItems.reduce((sum, item) => sum + item.price, 0)

  // Filter items in modal
  const filteredModalItems = allCatalogItems.filter(item => {
    if (modalTab === "packages" && item.type !== "package") return false
    if (modalTab === "tests" && item.type !== "test") return false
    if (!modalSearchQuery.trim()) return true
    const q = modalSearchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  // Quick 1-Tap Popular Chips in Modal
  const POPULAR_QUICK_PICKS = [
    { id: "pkg-master", label: "Full Body Master (₹800)" },
    { id: "pkg-women", label: "Women's Wellness (₹960)" },
    { id: "pkg-senior", label: "Senior Citizen (₹1,440)" },
    { id: "pkg-cardiac", label: "Cardiac Risk Panel (₹1,200)" },
    { id: "pkg-diabetes", label: "Diabetes Care (₹880)" },
    { id: "test-H6", label: "CBC Hemogram (₹240)" },
    { id: "test-CUA", label: "Urine Analysis (₹240)" },
    { id: "test-AMYL", label: "Serum Amylase (₹160)" }
  ]

  // Proceed to Booking with selected tests
  const handleProceedToBooking = () => {
    setIsSelectTestsModalOpen(false)
    router.push(`/booking?items=${modalSelectedIds.join(",")}`)
  }

  // Recommended Health Packages matching Image 1
  const RECOMMENDED_PACKAGES = [
    {
      id: "pkg-fullbody",
      title: "Full Body Wellness Panel",
      subtitle: "62 parameters · fasting required",
      originalPrice: 1000,
      discountedPrice: 800,
      discountBadge: "20% off",
      category: "fullbody",
      popular: true
    },
    {
      id: "pkg-women",
      title: "Women's Wellness Profile",
      subtitle: "Hormone & nutrition panel",
      originalPrice: 1200,
      discountedPrice: 960,
      discountBadge: "20% off",
      category: "women",
      popular: true
    },
    {
      id: "pkg-senior",
      title: "Senior Citizen Health Profile",
      subtitle: "74 parameters · vitals, bone & kidney health",
      originalPrice: 1800,
      discountedPrice: 1440,
      discountBadge: "20% off",
      category: "senior",
      popular: false
    },
    {
      id: "pkg-cardiac",
      title: "Cardiac Risk & Heart Panel",
      subtitle: "Lipid profile, hsCRP, ApoB & cardiac markers",
      originalPrice: 1500,
      discountedPrice: 1200,
      discountBadge: "20% off",
      category: "cardiac",
      popular: false
    },
    {
      id: "pkg-diabetes",
      title: "Executive Diabetes Care Profile",
      subtitle: "HbA1c, Fasting Glucose, Microalbumin, Kidney vitals",
      originalPrice: 1100,
      discountedPrice: 880,
      discountBadge: "20% off",
      category: "diabetes",
      popular: false
    },
    {
      id: "test-vitd",
      title: "Vitamin D (25-OH) & Vitamin B12 Duo",
      subtitle: "Bone strength, immunity & nerve vitality",
      originalPrice: 900,
      discountedPrice: 720,
      discountBadge: "20% off",
      category: "routine",
      popular: false
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
    <div className="space-y-6 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP REFERRAL PROMO BANNER (EXACT IMAGE 1 DESIGN: FULL WIDTH ON TOP)   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#eef4ff] border border-[#d6e4ff] p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="text-[#2F5FDE] shrink-0 mt-0.5">
            <Share2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-xs sm:text-base font-bold text-[#1d4ed8]">
                Referred by {customer?.referrerName || "Ramesh Gupta"}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] sm:text-[10px] font-black uppercase">
                20% DISCOUNT ACTIVE
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-relaxed">
              You get 20% off your first wellness profile — already applied below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSelectTestsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#2F5FDE] hover:bg-[#2554c7] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition-all cursor-pointer"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Select Tests &amp; Profiles ({allCatalogItems.length}+)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN BALANCED DASHBOARD GRID (8 COLS LEFT, 4 COLS RIGHT)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* ======================================================================= */}
        {/* LEFT / CENTER MAIN COLUMN (LG:COL-SPAN-8): SEARCH & RECOMMENDED CARDS   */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          
          {/* Search Bar matching Image 1 with Quick Modal Launcher */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onClick={() => setIsSelectTestsModalOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests & wellness profiles (Click to open full selector)..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2F5FDE] focus:ring-2 focus:ring-[#2F5FDE]/10 shadow-2xs transition-all cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setIsSelectTestsModalOpen(true)}
              className="absolute right-2 top-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#251b5c] font-bold text-xs border border-purple-200 cursor-pointer hidden sm:inline-flex items-center gap-1"
            >
              <FlaskConical className="h-3 w-3" />
              <span>Browse All</span>
            </button>
          </div>

          {/* Filter Category Chips with Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: "all", label: "All Profiles" },
              { id: "fullbody", label: "Full Body" },
              { id: "women", label: "Women's Health" },
              { id: "senior", label: "Senior Care" },
              { id: "cardiac", label: "Cardiac" },
              { id: "diabetes", label: "Diabetes" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#2F5FDE] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Section: Recommended for you with See all */}
          <div className="space-y-3 sm:space-y-4 pt-1">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">
                Recommended for you
              </h2>
              <button
                type="button"
                onClick={() => setIsSelectTestsModalOpen(true)}
                className="text-xs sm:text-sm font-semibold text-[#2F5FDE] hover:underline cursor-pointer"
              >
                See all ({allCatalogItems.length}+)
              </button>
            </div>

            {/* Product Cards Grid: 1 Column on Mobile, 2 Columns on Tablet/Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  
                  {/* Top Image Container */}
                  <div className="w-full h-32 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-xs tracking-wide select-none group-hover:bg-blue-50/40 group-hover:border-blue-200 transition-colors">
                    profile image
                  </div>

                  {/* Title & 20% off Badge */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {pkg.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#e6f7ef] text-[#0f9f59] border border-[#bbf0d4] text-[10.5px] sm:text-[11px] font-bold shrink-0">
                        {pkg.discountBadge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-normal line-clamp-1 sm:line-clamp-2">
                      {pkg.subtitle}
                    </p>
                  </div>

                  {/* Price & Book Now Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-xs text-slate-400 line-through font-medium">
                        ₹{pkg.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#2F5FDE]">
                        ₹{pkg.discountedPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookNow(pkg.id)}
                      className="px-4 py-1.5 sm:py-2 rounded-xl bg-[#2F5FDE] hover:bg-[#2554c7] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (LG:COL-SPAN-4): WIDGETS (TRACKING, REPORTS, BENEFICIARIES) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* 1. Active Live Sample Tracking Widget */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] to-[#251b5c] text-white p-5 space-y-4 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-[10px] uppercase">
                  Live Appointment
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">
                  Full Body Wellness Panel
                </h3>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  Tomorrow, 07:30 AM • Home Pickup
                </p>
              </div>
              <span className="text-[10.5px] font-mono text-blue-200">#ORD-8493</span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 border border-white/15 flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-300 text-[10.5px]">Phlebotomist: <b>Ravi Kumar</b></div>
                <div className="text-cyan-300 font-mono font-bold text-sm mt-0.5">Safety OTP: 4821</div>
              </div>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="px-3 py-1.5 rounded-xl bg-white text-[#1e1b4b] font-bold text-xs shadow-xs hover:bg-slate-100 cursor-pointer"
              >
                {copiedOtp ? "Copied ✓" : "Copy OTP"}
              </button>
            </div>

            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between text-[10px] text-blue-200 font-semibold">
                <span className="text-cyan-300">✓ Assigned</span>
                <span className="text-white">Sample Pickup</span>
                <span className="text-slate-400">Lab Test</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full w-[50%] rounded-full" />
              </div>
            </div>
          </div>

          {/* 2. Verified Pathology Reports Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#382685]" />
                <span>Pathology Lab Reports</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="space-y-2">
              {LAB_REPORTS.map((r) => (
                <div key={r.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <div className="font-bold text-slate-900 truncate">{r.title}</div>
                    <div className="text-[10.5px] text-slate-500">{r.date}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedReportModal(r)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#382685] font-bold text-[11px] hover:bg-purple-100"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified PDF: ${r.id}.pdf`)}
                      className="p-1 rounded-lg bg-[#2F5FDE] text-white hover:bg-blue-700"
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Family Beneficiaries Quick Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Family Members</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBenModal(true)}
                className="text-[11px] font-bold text-[#2F5FDE] hover:underline cursor-pointer"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-1.5">
              {beneficiaries.map((b) => (
                <div key={b.id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-[#251b5c] text-white flex items-center justify-center font-bold text-[10px]">
                      {b.relation.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-[11.5px]">{b.fullName}</div>
                      <div className="text-[10px] text-slate-400">{b.relation} • {b.age} yrs</div>
                    </div>
                  </div>
                  {b.relation !== "Self" && (
                    <button
                      type="button"
                      onClick={() => removeBeneficiary(b.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Prescription Upload CTA Card */}
          <div className="p-4 rounded-3xl border border-rose-200 bg-rose-50/50 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <FileText className="h-4 w-4 text-rose-600" />
              <span>Have a Doctor&apos;s Prescription?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Upload your prescription slip and our lab care coordinator will call you to build your test package.
            </p>
            <button
              type="button"
              onClick={() => setRxModal(true)}
              className="w-full py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Upload Prescription Slip
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* POPUP MODAL: SELECT TESTS & PROFILES (CRA MULTI-SELECT STANDARD)          */}
      {/* ========================================================================= */}
      {isSelectTestsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#251b5c] border border-purple-200">
                    20% Discount Active
                  </span>
                  <h3 className="font-black text-lg text-slate-900">Select Tests &amp; Profiles</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose from 100+ diagnostic tests &amp; comprehensive wellness profiles
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSelectTestsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Bar & Tabs */}
            <div className="space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder="Search tests: CBC, Thyroid, Lipid, HbA1c, Full Body..."
                  className="w-full h-10 pl-10 pr-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#251b5c] font-medium text-slate-900"
                  autoFocus
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  type="button"
                  onClick={() => setModalTab("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    modalTab === "all" ? "bg-[#251b5c] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  All ({allCatalogItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("packages")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    modalTab === "packages" ? "bg-[#251b5c] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Wellness Profiles (12)
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("tests")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    modalTab === "tests" ? "bg-[#251b5c] text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Clinical Tests (90+)
                </button>
              </div>

              {/* Quick 1-Tap Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {POPULAR_QUICK_PICKS.map((pick) => {
                  const isSelected = modalSelectedIds.includes(pick.id)
                  return (
                    <button
                      key={pick.id}
                      type="button"
                      onClick={() => handleModalToggleItem(pick.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? "bg-[#251b5c] text-white border-[#251b5c]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}{pick.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scrollable Tests List */}
            <div className="overflow-y-auto p-1 space-y-1.5 divide-y divide-slate-100 flex-1 min-h-[220px]">
              {filteredModalItems.map((item) => {
                const isSelected = modalSelectedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleModalToggleItem(item.id)}
                    className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected 
                        ? "bg-purple-50/90 border border-purple-200 text-purple-950 font-bold" 
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[#251b5c] border-[#251b5c] text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold truncate text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5 font-mono">
                          <span>{item.code}</span>
                          <span>•</span>
                          <span>{item.parameterCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#251b5c]">₹{item.price}</span>
                        <span className="text-[10px] line-through text-slate-400">₹{item.mrp}</span>
                      </div>
                      <span className="text-[9.5px] font-extrabold text-[#0f9f59] bg-[#e6f7ef] px-1.5 py-0.5 rounded">
                        20% OFF
                      </span>
                    </div>
                  </div>
                )
              })}

              {filteredModalItems.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No tests or profiles found matching &quot;{modalSearchQuery}&quot;
                </div>
              )}
            </div>

            {/* Selected Items Tray */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Selected Items ({modalSelectedItems.length})</span>
                <span className="text-emerald-700 font-extrabold text-[11px]">20% Discount Active</span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {modalSelectedItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                  >
                    <span className="truncate max-w-[130px] font-bold">{item.name}</span>
                    <span className="text-[#251b5c] font-bold">₹{item.price}</span>
                    {modalSelectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleModalRemoveItem(item.id)
                        }}
                        className="text-slate-400 hover:text-rose-600 font-bold px-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 shrink-0">
              <div>
                <div className="text-[11px] text-slate-500">
                  Total MRP: <span className="line-through">₹{modalTotalMrp}</span> • Saving: <span className="text-emerald-600 font-bold">₹{modalTotalDiscount}</span>
                </div>
                <div className="text-sm sm:text-base font-black text-[#251b5c]">
                  Total Payable: ₹{modalTotalPrice}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSelectTestsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedToBooking}
                  className="px-5 py-2.5 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Booking ({modalSelectedItems.length})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
