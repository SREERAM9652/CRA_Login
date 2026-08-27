"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { 
  CheckCircle2, 
  Home, 
  Building2, 
  Search, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Check,
  AlertCircle,
  FlaskConical,
  Percent,
  Download,
  Microscope,
  Droplets,
  Dna,
  Stethoscope,
  Pill,
  Heart,
  Award,
  Zap,
  Copy,
  FileText,
  Activity
} from "lucide-react"
import Link from "next/link"
import { CustomSelect } from "@/components/ui/CustomSelect"
import { DIAGNOSTIC_TESTS, HEALTH_PACKAGES, LAB_LOCATIONS, AVAILABLE_TIME_SLOTS } from "@/lib/mock-data"

function BookingWizardContent() {
  const searchParams = useSearchParams()
  
  const initialTestParam = searchParams.get("test")
  const initialPkgParam = searchParams.get("package")
  const initialSearchParam = searchParams.get("search") || ""
  const initialRefParam = searchParams.get("ref") || ""

  // Wizard Step State (1: Select Test, 2: Collection & Patient, 3: Slot, 4: Review & Pay, 5: Success)
  const [step, setStep] = useState(1)

  // Filter Categories in Step 1
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Selection State
  const [selectedItems, setSelectedItems] = useState<string[]>(["pkg-master"])
  const [searchQuery, setSearchQuery] = useState(initialSearchParam)
  const [collectionMethod, setCollectionMethod] = useState<"Home Collection" | "Visit Center">("Home Collection")
  const [selectedCenter, setSelectedCenter] = useState(LAB_LOCATIONS[0].id)
  
  // Patient Details
  const [patientData, setPatientData] = useState({
    fullName: "Suresh M.",
    age: "42",
    gender: "Male",
    mobile: "+91 98450 12345",
    email: "suresh.m@example.com",
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    specialInstructions: "Please call 10 mins before arrival. Patient will fast 12 hours."
  })

  // Date & Slot Selection
  const [selectedDate, setSelectedDate] = useState("2026-08-28")
  const [selectedSlot, setSelectedSlot] = useState(AVAILABLE_TIME_SLOTS[1].time)

  // Referral / CRA Code
  const [referralCode, setReferralCode] = useState(initialRefParam || "AVM-RAJ-789")
  const [refApplied, setRefApplied] = useState(Boolean(initialRefParam || true))

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "NetBanking" | "CashOnCollection">("UPI")
  const [bookingId, setBookingId] = useState("")

  // Pre-selection based on URL query
  useEffect(() => {
    if (initialTestParam) {
      setSelectedItems([initialTestParam])
    } else if (initialPkgParam) {
      setSelectedItems([initialPkgParam])
    }
  }, [initialTestParam, initialPkgParam])

  // Toggle selection
  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter(i => i !== id))
      }
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Calculate pricing breakdown
  const selectedTestsList = DIAGNOSTIC_TESTS.filter(t => selectedItems.includes(t.id))
  const selectedPackagesList = HEALTH_PACKAGES.filter(p => selectedItems.includes(p.id))

  const subtotalMRP = 
    selectedTestsList.reduce((acc, t) => acc + t.mrp, 0) + 
    selectedPackagesList.reduce((acc, p) => acc + p.mrp, 0)

  const subtotalDiscountedPrice = 
    selectedTestsList.reduce((acc, t) => acc + t.price, 0) + 
    selectedPackagesList.reduce((acc, p) => acc + p.price, 0)

  const catalogueDiscount = subtotalMRP - subtotalDiscountedPrice
  const homeCollectionFee = collectionMethod === "Home Collection" ? 200 : 0
  const totalAmount = subtotalDiscountedPrice + homeCollectionFee

  const handleConfirmBooking = () => {
    const generated = `AVM-BK-${Math.floor(10000 + Math.random() * 90000)}`
    setBookingId(generated)
    setStep(5)
  }

  const stepsLabel = [
    { num: 1, name: "Select Tests", desc: "Packages & Tests" },
    { num: 2, name: "Patient Details", desc: "Address & Info" },
    { num: 3, name: "Available Slot", desc: "Date & Timings" },
    { num: 4, name: "Review & Pay", desc: "Instant Confirmation" }
  ]

  // Filter packages & tests based on search and category
  const filteredPackages = HEALTH_PACKAGES.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategory === "all") return matchesSearch
    if (selectedCategory === "popular") return matchesSearch && pkg.popular
    if (selectedCategory === "senior") return matchesSearch && pkg.id.includes("senior")
    return matchesSearch
  })

  const filteredTests = DIAGNOSTIC_TESTS.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.category.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategory === "all") return matchesSearch
    if (selectedCategory === "routine") return matchesSearch && (test.category === "Blood" || test.category === "Diabetes")
    if (selectedCategory === "cardiac") return matchesSearch && (test.category === "Cardiology")
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fd] via-[#f1f3fa] to-[#eaf0fc] font-sans text-slate-800 relative selection:bg-[#382685] selection:text-white">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-300/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-blue-300/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl py-8 md:py-12 relative z-10">
        
        {/* ======================================================================= */}
        {/* WIZARD STEPPER TRACK (MODERN GLOWING PILLS)                             */}
        {/* ======================================================================= */}
        {step < 5 && (
          <div className="mb-10 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/80 shadow-lg shadow-indigo-950/5">
              <div className="flex items-center justify-between relative">
                
                {/* Connecting Track Line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200/80 z-0 rounded-full" />
                <div 
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#251b5c] to-[#382685] z-0 rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 88}%` }}
                />
                
                {stepsLabel.map((s) => {
                  const isCurrent = step === s.num
                  const isPassed = step > s.num
                  return (
                    <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => isPassed && setStep(s.num)}
                        disabled={s.num > step}
                        className={`h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                          isCurrent
                            ? "bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white shadow-md shadow-indigo-950/20 ring-4 ring-purple-100 scale-105"
                            : isPassed
                            ? "bg-emerald-500 text-white shadow-xs cursor-pointer hover:scale-105"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {isPassed ? <Check className="h-4 w-4 stroke-[3]" /> : s.num}
                      </button>
                      <div className="text-center hidden sm:block">
                        <div className={`text-xs font-bold ${isCurrent ? "text-[#251b5c]" : isPassed ? "text-slate-700" : "text-slate-400"}`}>
                          {s.name}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 1: SELECT TESTS OR HEALTH CHECKUP PACKAGES                         */}
        {/* ======================================================================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-6">
              <span className="px-3 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-extrabold border border-purple-200/80 inline-flex items-center gap-1.5 shadow-xs">
                <Award className="h-3.5 w-3.5" /> NABL & ICMR Accredited Tests
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1e1b4b]">
                Select Diagnostic Tests & Packages
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Choose comprehensive full body health profiles or individual pathology tests. Home collection available across Bengaluru.
              </p>
            </div>

            {/* Glass Search & Quick Category Filters */}
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tests: CBC, Thyroid, Lipid, HbA1c, Master Health..."
                  className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] shadow-xs text-slate-900 placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                {[
                  { id: "all", label: "✨ All Tests & Profiles" },
                  { id: "popular", label: "🔥 Top Packages" },
                  { id: "routine", label: "🩸 Routine Blood Work" },
                  { id: "cardiac", label: "🫀 Heart & Lipid" },
                  { id: "senior", label: "🛡️ Senior Citizen" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[#251b5c] text-white shadow-xs"
                        : "bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Grid: Packages & Tests on Left, Sticky Summary on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
              
              {/* Left Column: Packages & Tests */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Health Packages */}
                {filteredPackages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#251b5c] flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" /> Full Body Health Packages
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500">
                        {filteredPackages.length} Available
                      </span>
                    </div>

                    <div className="space-y-3">
                      {filteredPackages.map((pkg) => {
                        const isSelected = selectedItems.includes(pkg.id)
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => toggleItem(pkg.id)}
                            className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                              isSelected
                                ? "border-[#382685] bg-[#f6f4fe] shadow-md ring-2 ring-[#382685]/15"
                                : "border-slate-200/90 bg-white/90 backdrop-blur-xs hover:border-purple-300 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              
                              {/* Left Info */}
                              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                <div className={`mt-1 h-6 w-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                                  isSelected 
                                    ? "bg-[#251b5c] border-[#251b5c] text-white shadow-xs" 
                                    : "border-slate-300 bg-white"
                                }`}>
                                  {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                                </div>

                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                                      {pkg.name}
                                    </h4>
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#382685] text-[10px] font-extrabold">
                                      {pkg.parameterCount} Parameters
                                    </span>
                                    {pkg.popular && (
                                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#e04838] text-[9.5px] font-extrabold">
                                        ★ Most Popular
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                                    {pkg.tagline}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold">
                                      <Droplets className="h-3 w-3 text-rose-500" /> Blood & Urine
                                    </span>
                                    <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold">
                                      <Clock className="h-3 w-3 text-[#382685]" /> 12h Fasting
                                    </span>
                                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/60 font-bold">
                                      Save ₹{pkg.mrp - pkg.price} (20% OFF)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Pricing */}
                              <div className="text-right shrink-0">
                                <div className="text-xl font-black text-[#251b5c]">₹{pkg.price}</div>
                                <div className="text-xs text-slate-400 line-through font-semibold">₹{pkg.mrp}</div>
                              </div>

                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Individual Diagnostic Tests */}
                {filteredTests.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#251b5c] flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-[#382685]" /> Individual Pathology Tests
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500">
                        {filteredTests.length} Tests
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {filteredTests.map((test) => {
                        const isSelected = selectedItems.includes(test.id)
                        return (
                          <div
                            key={test.id}
                            onClick={() => toggleItem(test.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                              isSelected
                                ? "border-[#382685] bg-[#f6f4fe] shadow-sm ring-1 ring-[#382685]/20"
                                : "border-slate-200/90 bg-white/90 backdrop-blur-xs hover:border-purple-200"
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                isSelected ? "bg-[#251b5c] border-[#251b5c] text-white" : "border-slate-300 bg-white"
                              }`}>
                                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{test.name}</h4>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                    {test.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {test.sampleType} • Turnaround Time: {test.tat}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-base font-black text-[#251b5c]">₹{test.price}</div>
                              <div className="text-[11px] text-slate-400 line-through">₹{test.mrp}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Sticky Booking Order Summary */}
              <div className="space-y-4">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-indigo-950/5 sticky top-24 p-5 sm:p-6 space-y-4">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-slate-900 text-base">Booking Summary</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#382685] font-extrabold text-xs border border-purple-200/60">
                      {selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Selected Items List with Remove Option */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {[...selectedPackagesList, ...selectedTestsList].map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100/80 gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleItem(item.id)
                            }}
                            className="text-slate-400 hover:text-rose-500 p-0.5"
                            title="Remove"
                          >
                            ×
                          </button>
                          <span className="font-bold text-slate-800 truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <span className="font-black text-[#251b5c] shrink-0">₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Savings Banner */}
                  {catalogueDiscount > 0 && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>You are saving ₹{catalogueDiscount} with package discount!</span>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Catalogue Total (MRP):</span>
                      <span className="line-through">₹{subtotalMRP}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount (20% OFF):</span>
                      <span>- ₹{catalogueDiscount}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Home Collection:</span>
                      <span className="text-slate-700 font-bold">₹200</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-900 text-lg pt-2 border-t border-slate-200">
                      <span>Total Amount:</span>
                      <span className="text-[#251b5c]">₹{subtotalDiscountedPrice + 200}</span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={selectedItems.length === 0}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Continue to Patient Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Trust footer */}
                  <div className="pt-2 text-center text-[10.5px] text-slate-400 space-y-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>100% NABL Verified Pathology Reports</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: COLLECTION METHOD & PATIENT INFORMATION                         */}
        {/* ======================================================================= */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">
                Collection Method & Patient Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Choose your sample collection preference and enter patient details for verified report generation.
              </p>
            </div>

            {/* Collection Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div
                onClick={() => setCollectionMethod("Home Collection")}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                  collectionMethod === "Home Collection"
                    ? "border-[#382685] bg-[#f6f4fe] shadow-md ring-2 ring-[#382685]/15"
                    : "border-slate-200/90 bg-white/90 hover:border-purple-200"
                }`}
              >
                <div className="h-11 w-11 rounded-2xl bg-rose-50 text-[#e04838] border border-rose-100 flex items-center justify-center shrink-0 shadow-xs">
                  <Home className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Home Collection</h4>
                    <span className="text-[10px] font-black bg-purple-100 text-[#382685] px-2 py-0.5 rounded-full">
                      +₹200
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vaccinated phlebotomist collects blood/urine at your home with temperature-controlled kit.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setCollectionMethod("Visit Center")}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                  collectionMethod === "Visit Center"
                    ? "border-[#382685] bg-[#f6f4fe] shadow-md ring-2 ring-[#382685]/15"
                    : "border-slate-200/90 bg-white/90 hover:border-purple-200"
                }`}
              >
                <div className="h-11 w-11 rounded-2xl bg-blue-50 text-[#3056d3] border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Visit Lab Center</h4>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Walk into any AVMLabs diagnostic center in Indiranagar, Koramangala or Jayanagar.
                  </p>
                </div>
              </div>

            </div>

            {/* Patient Details Form Container */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                Patient Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name (As on ID) *</label>
                  <input
                    type="text"
                    required
                    value={patientData.fullName}
                    onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Age *</label>
                  <input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender *</label>
                  <CustomSelect
                    value={patientData.gender}
                    onChange={(val) => setPatientData({ ...patientData, gender: val })}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Number (For OTP & Reports) *</label>
                  <input
                    type="tel"
                    required
                    value={patientData.mobile}
                    onChange={(e) => setPatientData({ ...patientData, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={patientData.email}
                    onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              {collectionMethod === "Home Collection" && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Complete Home Address *</label>
                    <input
                      type="text"
                      required
                      value={patientData.address}
                      onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                      placeholder="House/Flat No, Apartment name, Street, Landmark"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">City *</label>
                      <input
                        type="text"
                        value={patientData.city}
                        onChange={(e) => setPatientData({ ...patientData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Pincode *</label>
                      <input
                        type="text"
                        value={patientData.pincode}
                        onChange={(e) => setPatientData({ ...patientData, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-slate-700">Special Instructions / Fasting Notes</label>
                <textarea
                  rows={2}
                  value={patientData.specialInstructions}
                  onChange={(e) => setPatientData({ ...patientData, specialInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#382685] text-slate-900 bg-slate-50/50"
                />
              </div>

            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl border border-slate-300 font-bold text-xs hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Tests
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-950/20 flex items-center gap-2 cursor-pointer hover:opacity-95"
              >
                <span>Select Available Slot</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: AVAILABLE DATE & TIME SLOT                                      */}
        {/* ======================================================================= */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">
                Select Date & Available Slot
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Early morning slots are ideal for fasting blood sugar & lipid profiles.
              </p>
            </div>

            {/* 1. Date Chips */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-3 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Select Appointment Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { date: "2026-08-28", label: "Tomorrow", day: "Fri, 28 Aug" },
                  { date: "2026-08-29", label: "Weekend", day: "Sat, 29 Aug" },
                  { date: "2026-08-30", label: "Weekend", day: "Sun, 30 Aug" },
                  { date: "2026-08-31", label: "Weekday", day: "Mon, 31 Aug" },
                ].map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedDate === d.date
                        ? "border-[#382685] bg-[#f6f4fe] ring-2 ring-[#382685]/15 text-[#251b5c] font-black shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{d.label}</div>
                    <div className="text-xs font-bold mt-0.5">{d.day}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Slot Selection */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  2. Select Available Time Slot
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Availability
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      !slot.available
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                        : selectedSlot === slot.time
                        ? "bg-[#f6f4fe] border-[#382685] ring-2 ring-[#382685]/15 text-[#251b5c] font-black shadow-xs cursor-pointer"
                        : "bg-white border-slate-200 hover:border-purple-200 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-[#382685]" />
                      <span className="text-xs font-bold">{slot.time}</span>
                    </div>

                    {slot.available ? (
                      slot.fastFilling ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
                          Filling Fast
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Available
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-500 font-semibold">
                        Booked Out
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl border border-slate-300 font-bold text-xs hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Details
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-950/20 flex items-center gap-2 cursor-pointer hover:opacity-95"
              >
                <span>Review & Confirm Payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 4: REVIEW & PAYMENT GATEWAY                                        */}
        {/* ======================================================================= */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">
                Review & Confirm Booking
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Verify patient details, sample collection schedule, and complete your order.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Appointment Summary & CRA Code */}
              <div className="space-y-4">
                
                {/* Appointment Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 space-y-3 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-2">
                    Appointment Details
                  </h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="font-black text-slate-900 text-sm">{patientData.fullName}</div>
                      <div className="text-slate-500">{patientData.gender}, {patientData.age} yrs • {patientData.mobile}</div>
                      <div className="text-slate-700 font-medium pt-1">
                        📍 {collectionMethod}: {patientData.address}, {patientData.pincode}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/60 text-[#251b5c] space-y-0.5">
                      <div className="font-extrabold text-[11px] uppercase tracking-wider text-[#382685]">Scheduled Slot:</div>
                      <div className="font-black text-sm">{selectedDate} ({selectedSlot})</div>
                    </div>
                  </div>
                </div>

                {/* CRA Referral Code Card */}
                <div className="bg-gradient-to-br from-white to-purple-50/40 rounded-3xl border border-purple-200/80 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#382685]">
                    <Sparkles className="h-3.5 w-3.5 text-[#e04838]" /> CRA Referral / Promo Code
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter CRA Code (e.g. AVM-RAJ-789)"
                      className="flex-1 px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 uppercase focus:outline-none focus:border-[#382685] text-slate-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setRefApplied(true)}
                      className="px-4 py-2 bg-[#251b5c] text-white rounded-xl text-xs font-bold hover:bg-[#382685] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {refApplied && (
                    <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Partner referral active: 20% discount applied!
                    </p>
                  )}
                </div>

              </div>

              {/* Right Column: Price Breakdown & Payment Mode */}
              <div className="space-y-4">
                
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 space-y-4 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-2">
                    Payment Breakdown
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Total Test MRP:</span>
                      <span className="line-through">₹{subtotalMRP}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>20% Package Savings:</span>
                      <span>- ₹{catalogueDiscount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Home Collection Fee:</span>
                      <span>{homeCollectionFee > 0 ? `+ ₹${homeCollectionFee}` : "FREE"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">Total Payable:</span>
                    <span className="text-2xl font-black text-[#251b5c]">₹{totalAmount}</span>
                  </div>

                  {/* Payment Mode Selection */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="font-black text-slate-900 block text-xs">Select Payment Method</label>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { id: "UPI", label: "⚡ Instant UPI (GPay, PhonePe, Paytm, QR)" },
                        { id: "Card", label: "💳 Credit / Debit Card (Visa, Mastercard, RuPay)" },
                        { id: "NetBanking", label: "🏛️ Net Banking (All Indian Banks)" },
                        { id: "CashOnCollection", label: "💵 Pay on Sample Collection (Cash/UPI)" }
                      ].map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? "bg-[#f6f4fe] border-[#382685] ring-1 ring-[#382685] font-bold text-[#251b5c]"
                              : "bg-slate-50/50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymode"
                            checked={paymentMethod === m.id}
                            onChange={() => setPaymentMethod(m.id as any)}
                          />
                          <span>{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Complete Booking Button */}
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Confirm & Book Appointment</span>
                  </button>

                </div>

              </div>

            </div>

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-5 rounded-2xl border border-slate-300 font-bold text-xs hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Slots
              </button>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 5: BOOKING SUCCESSFUL & CONFIRMATION RECEIPT                        */}
        {/* ======================================================================= */}
        {step === 5 && (
          <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-400">
            
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-5">
              
              {/* Success Badge */}
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">
                  Appointment Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Your diagnostic appointment has been successfully scheduled.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-bold">Booking Reference:</span>
                  <span className="font-mono font-black text-[#251b5c] text-sm">{bookingId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{patientData.fullName} ({patientData.age} yrs)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date & Time:</span>
                  <span className="font-bold text-[#382685]">{selectedDate} ({selectedSlot})</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Collection Type:</span>
                  <span className="font-bold text-slate-900">{collectionMethod}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm">
                  <span className="text-slate-900">Total Paid:</span>
                  <span className="text-[#251b5c]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/customer/dashboard"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-950/20 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                >
                  <Activity className="h-4 w-4" />
                  <span>Go to My Patient Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => alert(`Downloading official booking invoice voucher for ${bookingId}...`)}
                  className="w-full py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#382685]" />
                  <span>Download Booking Receipt (PDF)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                SMS & WhatsApp confirmation sent to <strong>{patientData.mobile}</strong>.
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#382685] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <BookingWizardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
