"use client"

import { useState, useEffect, useRef, useMemo, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
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
  LayoutDashboard,
  ClipboardList,
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
  Activity,
  Users,
  Plus,
  Trash2,
  Lock,
  ChevronDown,
  X,
  Package,
  Pencil,
  Tag,
  Headphones,
  FileCheck,
  RefreshCw,
  Upload
} from "lucide-react"
import Link from "next/link"
import { AddFamilyMemberDrawer, FamilyMemberFormData } from "@/components/booking/AddFamilyMemberDrawer"
import { SelectMemberTestsDrawer } from "@/components/booking/SelectMemberTestsDrawer"
import { HEALTH_PACKAGES, LAB_LOCATIONS, AVAILABLE_TIME_SLOTS } from "@/lib/mock-data"
import { CRA_TESTS } from "@/lib/cra-tests"
import { useWorkflowStore } from "@/lib/workflow-store"

export interface BookingItem {
  id: string
  type: "package" | "test"
  code: string
  name: string
  category: string
  mrp: number
  discount: number
  price: number
  parameterCount: string
  sampleType?: string
}

export interface BeneficiaryMember {
  id: string
  name: string
  relation: "Self" | "Father" | "Mother" | "Wife" | "Husband" | "Son" | "Daughter" | "Brother" | "Sister" | "Friend" | "Other"
  age: string
  gender: "Male" | "Female" | "Other"
  mobile: string
  address: string
  selectedTestIds: string[]
}

function BookingWizardContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { customer, isCustomerLoggedIn, beneficiaries: storeBeneficiaries, addPrescriptionRequest, createCustomerBooking, payForOrder, loginCustomer } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoggedIn = mounted ? isCustomerLoggedIn : false
  const homeHref = isLoggedIn ? "/customer/dashboard" : "/"
  const ordersHref = isLoggedIn ? "/customer/dashboard/orders" : "/login?role=customer&redirect=/customer/dashboard/orders"
  const reportsHref = isLoggedIn ? "/customer/dashboard/reports" : "/login?role=customer&redirect=/customer/dashboard/reports"
  const beneficiariesHref = isLoggedIn ? "/customer/dashboard/beneficiaries" : "/login?role=customer&redirect=/customer/dashboard/beneficiaries"

  const initialTestParam = searchParams.get("test")
  const initialPkgParam = searchParams.get("package")
  const initialSearchParam = searchParams.get("search") || ""
  const initialRefParam = searchParams.get("ref") || ""
  const initialStepParam = searchParams.get("step")
  const isUploadParam = searchParams.get("upload") === "prescription"
  const isFamilyParam = searchParams.get("mode") === "family" || !!searchParams.get("benId")

  const allAvailableItems = useMemo<BookingItem[]>(() => {
    const packages: BookingItem[] = HEALTH_PACKAGES.map((pkg, idx) => {
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
        parameterCount: `${pkg.parameterCount} Parameters`,
        sampleType: "Blood & Urine"
      }
    })

    const tests: BookingItem[] = CRA_TESTS.map((test) => {
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
        parameterCount: `${test.sample || "Blood"} • ${test.technology || "Lab Test"}`,
        sampleType: test.sample
      }
    })

    return [...packages, ...tests]
  }, [])

  // Wizard Step State (1: Select Test, 2: Beneficiaries & Assignment, 3: Slot, 4: Review & Pay, 5: Success)
  const [step, setStep] = useState(initialStepParam ? (parseInt(initialStepParam, 10) || 1) : 1)

  // MULTI-TEST SELECTION STATE for Step 1
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    "pkg-master",
    "test-H6",
    "test-CUA"
  ])

  // Dropdown & Search Filter State in Step 1
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownSearch, setDropdownSearch] = useState("")
  const [dropdownTab, setDropdownTab] = useState<"all" | "packages" | "tests">("all")
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

  const [collectionMethod, setCollectionMethod] = useState<"Home Collection" | "Visit Center">("Home Collection")

  // Beneficiaries State: Populated from store if logged in, or customized by user
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryMember[]>([])

  useEffect(() => {
    if (isCustomerLoggedIn && storeBeneficiaries && storeBeneficiaries.length > 0) {
      setBeneficiaries(prev => {
        // If the user already added/assigned tests during this booking draft, keep them
        if (prev.length > 0) return prev

        return storeBeneficiaries.map((b, idx) => ({
          id: b.id || `ben-${idx + 1}`,
          name: b.fullName || (b as any).name || "Family Member",
          relation: b.relation || "Self",
          age: String(b.age || "35"),
          gender: b.gender || "Male",
          mobile: (b as any).mobile || customer?.mobile || "+91 98450 12345",
          address: b.address || "12th Cross, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
          selectedTestIds: b.selectedTests || selectedItemIds
        }))
      })
    }
  }, [isCustomerLoggedIn, storeBeneficiaries, customer, selectedItemIds])

  // Member Test Selection Drawer State
  const [assigningMemberId, setAssigningMemberId] = useState<string | null>(null)

  // Edit / Add Beneficiary Modal State
  const [editingMember, setEditingMember] = useState<BeneficiaryMember | null>(null)
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false)

  // Prescription Upload Modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(isUploadParam)
  const [rxForm, setRxForm] = useState({
    name: customer?.name || "",
    mobile: customer?.mobile || "",
    fileName: "Dr_Sharma_Prescription_Aug2026.pdf",
    notes: "Doctor advised routine checkup for sugar & thyroid."
  })
  const [rxSubmitted, setRxSubmitted] = useState(false)

  // Scheduling State (Step 3)
  const [selectedDate, setSelectedDate] = useState("2026-08-28")
  const [selectedSlot, setSelectedSlot] = useState("07:00 AM - 08:00 AM (Fasting Preferred)")
  const [patientData, setPatientData] = useState({
    fullName: isCustomerLoggedIn ? (customer?.name || "") : "",
    mobile: isCustomerLoggedIn ? (customer?.mobile || "") : "",
    email: isCustomerLoggedIn ? (customer?.email || "") : "",
    address: "",
    pincode: "560038",
    city: "Bengaluru",
    age: "35",
    gender: "Male" as const,
    specialInstructions: "Please call 10 mins before arrival."
  })

  // State to show "Login Required Before Payment" modal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Automatically sync logged-in customer info to patientData
  useEffect(() => {
    if (isCustomerLoggedIn && customer) {
      setPatientData(prev => ({
        ...prev,
        fullName: prev.fullName || customer.name || "Suresh M.",
        mobile: prev.mobile || customer.mobile || "+91 98450 12345",
        email: prev.email || customer.email || "suresh.m@example.com",
        address: prev.address || customer.address || "12th Cross, HAL 2nd Stage, Indiranagar, Bengaluru - 560038"
      }))
    }
  }, [isCustomerLoggedIn, customer])

  // Save current booking draft to sessionStorage before navigating to login page
  const saveBookingDraft = () => {
    try {
      const draft = {
        step: 4,
        selectedItemIds,
        beneficiaries,
        collectionMethod,
        selectedDate,
        selectedSlot,
        patientData,
        referralCode
      }
      sessionStorage.setItem("avm_booking_draft", JSON.stringify(draft))
    } catch (e) {
      console.error("Failed to save booking draft:", e)
    }
  }

  // Restore booking draft when returning from login page
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? sessionStorage.getItem("avm_booking_draft") : null
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.step) setStep(draft.step)
        if (Array.isArray(draft.selectedItemIds) && draft.selectedItemIds.length > 0) {
          setSelectedItemIds(draft.selectedItemIds)
        }
        if (Array.isArray(draft.beneficiaries) && draft.beneficiaries.length > 0) {
          setBeneficiaries(draft.beneficiaries)
        }
        if (draft.collectionMethod) setCollectionMethod(draft.collectionMethod)
        if (draft.selectedDate) setSelectedDate(draft.selectedDate)
        if (draft.selectedSlot) setSelectedSlot(draft.selectedSlot)
        if (draft.patientData) {
          setPatientData(prev => ({
            ...prev,
            ...draft.patientData,
            fullName: isCustomerLoggedIn ? (customer?.name || draft.patientData.fullName) : draft.patientData.fullName,
            mobile: isCustomerLoggedIn ? (customer?.mobile || draft.patientData.mobile) : draft.patientData.mobile,
            email: isCustomerLoggedIn ? (customer?.email || draft.patientData.email) : draft.patientData.email
          }))
        }
        if (draft.referralCode) setReferralCode(draft.referralCode)
        sessionStorage.removeItem("avm_booking_draft")
      }
    } catch (e) {
      console.error("Failed to restore booking draft:", e)
    }
  }, [isCustomerLoggedIn, customer])

  // Intercept proceed to Review & Pay if not logged in
  const handleProceedToReviewAndPayment = () => {
    if (!isCustomerLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    setStep(4)
  }

  // Direct navigation to Login page with redirect back to step 4
  const handleGoToLoginPage = () => {
    saveBookingDraft()
    router.push("/login?role=customer&redirect=/booking?step=4")
  }

  // Payment & Promo (Step 4)
  const [referralCode, setReferralCode] = useState(initialRefParam || "")
  const [paymentType, setPaymentType] = useState<"Prepaid" | "Postpaid (Pay on Collection)">("Prepaid")
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "NetBanking" | "CashOnCollection">("UPI")
  const [bookingId, setBookingId] = useState("")

  // Introducer / Referral Partner Info (Only displayed if referred or logged in with introducer)
  const introducerInfo = useMemo(() => {
    const code = initialRefParam || referralCode || (isCustomerLoggedIn && customer?.referralCode ? customer.referralCode : "")
    if (!code) return null

    const upper = code.toUpperCase()
    if (upper.includes("SREERAM") || upper === "C1-SREERAM" || upper === "AVM-SREERAM-C1") {
      return { name: "THURAKA SREERAM", role: "C1" }
    }
    if (upper.includes("SUDHEER") || upper === "C2-SUDHEER" || upper === "AVM-SUDHEER-C2") {
      return { name: "SUDHEER REDDY", role: "C2" }
    }
    if (upper.includes("MAHENDRA") || upper === "C2-MAHENDRA" || upper === "AVM-MAHENDRA-C2") {
      return { name: "SAI MAHENDRA", role: "C2" }
    }
    if (upper.includes("VISHNU") || upper === "C2-VISHNU" || upper === "AVM-VISHNU-C2") {
      return { name: "VISHNU VARDHAN", role: "C2" }
    }
    if (isCustomerLoggedIn && customer?.referrerName) {
      return { name: customer.referrerName.toUpperCase(), role: "CRA Partner" }
    }
    return { name: code, role: "Partner" }
  }, [initialRefParam, referralCode, isCustomerLoggedIn, customer])

  // Pre-populate if query parameter passed
  useEffect(() => {
    const initialItemsParam = searchParams.get("items")
    if (initialItemsParam) {
      const ids = initialItemsParam.split(",").filter(Boolean)
      if (ids.length > 0) {
        setSelectedItemIds(ids)
        setBeneficiaries(prev => prev.map((b, i) => i === 0 ? { ...b, selectedTestIds: ids } : b))
        return
      }
    }

    if (initialTestParam) {
      const match = allAvailableItems.find(i => i.id === initialTestParam || i.code === initialTestParam)
      if (match) {
        setSelectedItemIds([match.id])
        setBeneficiaries(prev => prev.map((b, i) => i === 0 ? { ...b, selectedTestIds: [match.id] } : b))
      }
    } else if (initialPkgParam) {
      const match = allAvailableItems.find(i => i.id === initialPkgParam)
      if (match) {
        setSelectedItemIds([match.id])
        setBeneficiaries(prev => prev.map((b, i) => i === 0 ? { ...b, selectedTestIds: [match.id] } : b))
      }
    }
  }, [initialTestParam, initialPkgParam, searchParams, allAvailableItems])

  // Handle Prescription Submission
  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addPrescriptionRequest({
      customerName: rxForm.name,
      mobile: rxForm.mobile,
      fileName: rxForm.fileName,
      notes: rxForm.notes
    })
    setRxSubmitted(true)
    setTimeout(() => {
      setRxSubmitted(false)
      setShowPrescriptionModal(false)
    }, 2000)
  }

  // Step 1 Toggle Item
  const handleToggleStep1Item = (itemId: string) => {
    if (selectedItemIds.includes(itemId)) {
      if (selectedItemIds.length > 1) {
        setSelectedItemIds(selectedItemIds.filter(id => id !== itemId))
      }
    } else {
      setSelectedItemIds([...selectedItemIds, itemId])
    }
  }

  const handleRemoveStep1Item = (itemId: string) => {
    if (selectedItemIds.length > 1) {
      setSelectedItemIds(selectedItemIds.filter(id => id !== itemId))
    }
  }

  // Proceed from Step 1 to Step 2
  const handleProceedToStep2 = () => {
    // Sync selected items from Step 1 to primary beneficiary
    setBeneficiaries(prev => prev.map((b, i) => {
      if (i === 0) {
        return { ...b, selectedTestIds: selectedItemIds }
      }
      return b
    }))
    setStep(2)
  }

  // Multi-Selection Helper Functions for Member Specific Assignment in Step 2
  const toggleMemberTest = (memberId: string, testId: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === memberId) {
        const exists = b.selectedTestIds.includes(testId)
        const updated = exists
          ? b.selectedTestIds.filter(id => id !== testId)
          : [...b.selectedTestIds, testId]
        return { ...b, selectedTestIds: updated }
      }
      return b
    }))
  }

  // Remove test from member
  const removeMemberTest = (memberId: string, testId: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === memberId) {
        return { ...b, selectedTestIds: b.selectedTestIds.filter(id => id !== testId) }
      }
      return b
    }))
  }

  // Remove family member
  const handleRemoveMember = (memberId: string) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter(b => b.id !== memberId))
    }
  }

  // Add new family member from sidebar drawer
  const handleAddNewBeneficiary = (data: FamilyMemberFormData) => {
    if (!data.name || !data.age) return

    const newBen: BeneficiaryMember = {
      id: `ben-${Date.now()}`,
      name: data.name,
      relation: data.relation || "Father",
      age: data.age,
      gender: data.gender || "Male",
      mobile: patientData.mobile,
      address: data.address || patientData.address,
      selectedTestIds: beneficiaries.length === 0 ? [...selectedItemIds] : []
    }
    setBeneficiaries([...beneficiaries, newBen])
    setShowAddBeneficiary(false)
  }

  // Edit existing family member from sidebar drawer
  const handleUpdateMember = (data: FamilyMemberFormData) => {
    if (!editingMember) return
    setBeneficiaries(prev => prev.map(b => b.id === editingMember.id ? {
      ...b,
      name: data.name,
      relation: data.relation,
      age: data.age,
      gender: data.gender,
      address: data.address
    } : b))
    setEditingMember(null)
  }

  // STEP 1 Selected Items
  const step1SelectedItems = useMemo(() => {
    return selectedItemIds
      .map(id => allAvailableItems.find(i => i.id === id))
      .filter((i): i is BookingItem => Boolean(i))
  }, [selectedItemIds, allAvailableItems])

  // STEP 2-4 Beneficiary Assigned Tests
  const activeBeneficiaries = beneficiaries.filter(b => b.selectedTestIds.length > 0)

  const allAssignedTestsList = useMemo(() => {
    const list: { item: BookingItem; memberName: string; memberId: string }[] = []
    beneficiaries.forEach(b => {
      b.selectedTestIds.forEach(testId => {
        const found = allAvailableItems.find(i => i.id === testId)
        if (found) {
          list.push({ item: found, memberName: b.name, memberId: b.id })
        }
      })
    })
    return list
  }, [beneficiaries, allAvailableItems])

  // Dynamic active items for Sidebar Summary based on current step
  const activeSummaryItems = useMemo(() => {
    if (step === 1 || allAssignedTestsList.length === 0) {
      return step1SelectedItems.map(item => ({ item, count: 1, totalPrice: item.price }))
    }
    // Group items by ID for steps 2-4
    const map = new Map<string, { item: BookingItem; count: number; totalPrice: number }>()
    allAssignedTestsList.forEach(({ item }) => {
      const existing = map.get(item.id)
      if (existing) {
        existing.count += 1
        existing.totalPrice += item.price
      } else {
        map.set(item.id, { item, count: 1, totalPrice: item.price })
      }
    })
    return Array.from(map.values())
  }, [step, step1SelectedItems, allAssignedTestsList])

  const totalItemCount = (step === 1 || allAssignedTestsList.length === 0)
    ? step1SelectedItems.length
    : allAssignedTestsList.length

  const subtotalMRP = (step === 1 || allAssignedTestsList.length === 0)
    ? step1SelectedItems.reduce((sum, item) => sum + item.mrp, 0)
    : allAssignedTestsList.reduce((sum, entry) => sum + entry.item.mrp, 0)

  const catalogueDiscount = (step === 1 || allAssignedTestsList.length === 0)
    ? step1SelectedItems.reduce((sum, item) => sum + item.discount, 0)
    : allAssignedTestsList.reduce((sum, entry) => sum + entry.item.discount, 0)

  const realizedRevenue = (step === 1 || allAssignedTestsList.length === 0)
    ? step1SelectedItems.reduce((sum, item) => sum + item.price, 0)
    : allAssignedTestsList.reduce((sum, entry) => sum + entry.item.price, 0)

  // Smart Order Merging: Flat ₹150 for same address
  const uniqueAddresses = new Set(activeBeneficiaries.map(b => b.address.trim().toLowerCase()))
  const isAddressMerged = uniqueAddresses.size === 1 && activeBeneficiaries.length > 1

  const homeCollectionFee = collectionMethod === "Home Collection"
    ? (uniqueAddresses.size > 0 ? uniqueAddresses.size * 150 : 150)
    : 0

  const totalAmount = realizedRevenue + homeCollectionFee
  const totalSavings = catalogueDiscount // 20% savings

  // Quick 1-Tap Popular Chips
  const POPULAR_QUICK_PICKS = [
    { id: "pkg-master", label: "Full Body Master (₹800)" },
    { id: "test-H6", label: "CBC Hemogram (₹240)" },
    { id: "test-CUA", label: "Urine Analysis (₹240)" },
    { id: "pkg-women", label: "Women's Wellness (₹960)" },
    { id: "pkg-senior", label: "Senior Citizen (₹1,440)" },
    { id: "pkg-cardiac", label: "Cardiac Risk (₹1,200)" },
    { id: "pkg-diabetes", label: "Diabetes Care (₹880)" },
    { id: "test-AMYL", label: "Serum Amylase (₹160)" }
  ]

  // Filter items in Dropdown by tab and search
  const filteredDropdownItems = allAvailableItems.filter(item => {
    if (dropdownTab === "packages" && item.type !== "package") return false
    if (dropdownTab === "tests" && item.type !== "test") return false
    if (!dropdownSearch.trim()) return true
    const q = dropdownSearch.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const currentAssigningMember = beneficiaries.find(b => b.id === assigningMemberId)

  // Handle final booking submission
  const handleConfirmBooking = () => {
    if (!isCustomerLoggedIn) {
      setShowLoginPrompt(true)
      return
    }

    const generatedOrderNum = `AVM-${Math.floor(1000 + Math.random() * 9000)}`
    setBookingId(generatedOrderNum)

    const primaryTest = step === 1
      ? step1SelectedItems[0] || { id: "custom", name: "Comprehensive Health Panel" }
      : allAssignedTestsList[0]?.item || { id: "custom", name: "Comprehensive Health Panel" }

    const compositeName = totalItemCount === 1
      ? primaryTest.name
      : `${primaryTest.name} + ${totalItemCount - 1} more test${totalItemCount > 2 ? 's' : ''}`

    const createdOrder = createCustomerBooking({
      customerName: patientData.fullName,
      mobile: patientData.mobile,
      email: patientData.email,
      profileId: primaryTest.id,
      profileName: compositeName,
      cataloguePrice: subtotalMRP,
      discount: catalogueDiscount,
      realizedRevenue: realizedRevenue,
      homeCollectionFee: homeCollectionFee,
      totalPayable: totalAmount,
      isFamilyMember: isFamilyParam
    })

    if (paymentType === "Prepaid") {
      setTimeout(() => {
        payForOrder(createdOrder.id, `Online (${paymentMethod})`)
      }, 500)
    }

    setStep(5)
  }

  const stepsList = [
    { num: 1, name: "Select Tests", shortName: "Tests", subtitle: "Choose tests or packages" },
    { num: 2, name: "Family Members", shortName: "Members", subtitle: "Select tests for family members" },
    { num: 3, name: "Available Slot", shortName: "Slot", subtitle: "Choose date & time" },
    { num: 4, name: "Review & Pay", shortName: "Review", subtitle: "Confirm & complete" }
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fd] flex flex-col font-sans selection:bg-[#1e3a8a] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 pb-28 lg:pb-8 space-y-6">

        {/* ======================================================================= */}
        {/* 1. TOP STEPPER CAPSULE WITH CONNECTED PROGRESS TRACK                    */}
        {/* ======================================================================= */}
        {step <= 4 && (
          <div className="bg-white rounded-[10px] py-3 px-3 sm:px-6 border border-slate-200/90 shadow-2xs">

            {/* Mobile Stepper (< sm): Clean 4-step progress with circles & labels */}
            <div className="sm:hidden">
              <div className="grid grid-cols-4 relative">
                {/* Connecting track running behind circles */}
                <div className="absolute top-3.5 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: step === 1 ? "0%" : step === 2 ? "33.3%" : step === 3 ? "66.6%" : "100%"
                    }}
                  />
                </div>

                {stepsList.map((s) => {
                  const isCurrent = step === s.num
                  const isPassed = step > s.num
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => { if (isPassed) setStep(s.num) }}
                      disabled={!isPassed && !isCurrent}
                      className={`flex flex-col items-center gap-1.5 relative z-10 ${
                        !isPassed && !isCurrent ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCurrent
                          ? "bg-[#1e3a8a] text-white shadow-xs ring-4 ring-blue-100"
                          : isPassed
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white text-slate-500 border-2 border-slate-200"
                      }`}>
                        {isPassed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.num}
                      </div>

                      <span className={`text-[11px] font-bold text-center leading-tight truncate max-w-full px-0.5 ${
                        isCurrent ? "text-[#1e3a8a]" : isPassed ? "text-slate-800" : "text-slate-400"
                      }`}>
                        {s.shortName}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Desktop / Tablet Stepper (>= sm) */}
            <div className="hidden sm:flex items-center justify-between w-full">
              {stepsList.map((s, idx) => {
                const isCurrent = step === s.num
                const isPassed = step > s.num
                return (
                  <div key={s.num} className="flex items-center flex-1 last:flex-none">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPassed) setStep(s.num)
                      }}
                      disabled={!isPassed && !isCurrent}
                      className={`flex items-center gap-2.5 shrink-0 transition-all text-left ${
                        !isPassed && !isCurrent ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCurrent
                          ? "bg-[#1e3a8a] text-white shadow-xs ring-4 ring-blue-50"
                          : isPassed
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {isPassed ? <Check className="h-4 w-4 stroke-[3]" /> : s.num}
                      </div>

                      <div className="text-left leading-tight">
                        <div className={`text-xs font-bold whitespace-nowrap ${
                          isCurrent ? "text-[#1e3a8a]" : isPassed ? "text-slate-800" : "text-slate-500"
                        }`}>
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium hidden md:block whitespace-nowrap">
                          {s.subtitle}
                        </div>
                      </div>
                    </button>

                    {/* Progress Connecting Line */}
                    {idx < stepsList.length - 1 && (
                      <div className="flex-1 mx-3 sm:mx-4 h-0.5 bg-slate-200 min-w-[16px] rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${
                          isPassed ? "bg-emerald-500 w-full" : "w-0"
                        }`} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* STEPS 1-4: UNIFIED 2-COLUMN RESPONSIVE E-COMMERCE GRID                  */}
        {/* ======================================================================= */}
        {step <= 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ===================================================================== */}
            {/* LEFT COLUMN: WIZARD STEP CONTENT (LG:COL-SPAN-8)                      */}
            {/* ===================================================================== */}
            <div className="lg:col-span-8 space-y-6">

              {/* ------------------------------------------------------------------- */}
              {/* TOP MEDICAL SAPPHIRE BANNER WITH UPLOAD PRESCRIPTION BUTTON         */}
              {/* ------------------------------------------------------------------- */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] border border-blue-500/30 rounded-[8px] p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 shadow-sm">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute left-1/3 -top-12 w-36 h-36 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Left Content */}
                <div className="space-y-2 relative z-10 flex-1 min-w-0">
                  {introducerInfo && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-white/15 border border-white/20 backdrop-blur-xs text-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        INTRODUCED BY
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="text-xs font-bold text-white tracking-wide">
                        {introducerInfo.name} ({introducerInfo.role})
                      </span>
                    </div>
                  )}

                  <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    Diagnostic Tests &amp; Preventive Profiles
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                    Select single or multiple tests or wellness packages.
                  </p>
                </div>

                {/* Right Actions: Perfectly Aligned Button & Subtext */}
                <div className="flex flex-col items-start sm:items-end justify-center shrink-0 relative z-10 gap-1.5 sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(true)}
                    className="px-5 py-2.5 rounded-[8px] bg-white text-[#1e3a8a] hover:bg-blue-50 text-xs font-black inline-flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer border border-white/90 whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4 text-[#1e3a8a] stroke-[2.5]" />
                    <span>Upload Prescription</span>
                  </button>
                  <p className="text-[11px] text-blue-100 font-medium tracking-tight text-left sm:text-right">
                    We&apos;ll suggest tests for you
                  </p>
                </div>
              </div>

              {/* ------------------------------------------------------------------- */}
              {/* STEP 1 CONTENT: SELECT TESTS & PROFILES (WITH COMPLETE LIST)        */}
              {/* ------------------------------------------------------------------- */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4" ref={dropdownRef}>

                    {/* Header with Selected Counter */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4.5 w-4.5 text-[#1e3a8a]" />
                        <label className="text-xs sm:text-sm font-black text-slate-900">
                          Select Tests &amp; Packages <span className="text-rose-500">*</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-[8px] text-xs font-bold bg-blue-50 text-[#1e3a8a] border border-blue-200">
                          {selectedItemIds.length} Selected
                        </span>
                        {selectedItemIds.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setSelectedItemIds([allAvailableItems[0].id])}
                            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search / Click to Add Input Bar */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full h-12 px-4 rounded-[8px] border border-slate-200 text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
                      >
                        <div className="flex items-center gap-2.5 text-slate-500 text-xs sm:text-sm font-medium">
                          <Search className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">Click to add more tests or wellness packages...</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-[8px] border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[380px] flex flex-col">
                          <div className="p-3 border-b border-slate-100 bg-slate-50/90 space-y-2.5 shrink-0">
                            <div className="relative">
                              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={dropdownSearch}
                                onChange={(e) => setDropdownSearch(e.target.value)}
                                placeholder="Search from 100+ tests: CBC, Thyroid, Lipid, HbA1c, Full Body..."
                                className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-[#1e3a8a] font-medium"
                                autoFocus
                              />
                            </div>

                            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                              <button
                                type="button"
                                onClick={() => setDropdownTab("all")}
                                className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold transition-colors cursor-pointer ${dropdownTab === "all" ? "bg-[#1e3a8a] text-white" : "bg-white text-slate-600 border border-slate-200"}`}
                              >
                                All ({allAvailableItems.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setDropdownTab("packages")}
                                className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold transition-colors cursor-pointer ${dropdownTab === "packages" ? "bg-[#1e3a8a] text-white" : "bg-white text-slate-600 border border-slate-200"}`}
                              >
                                Profiles (12)
                              </button>
                              <button
                                type="button"
                                onClick={() => setDropdownTab("tests")}
                                className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold transition-colors cursor-pointer ${dropdownTab === "tests" ? "bg-[#1e3a8a] text-white" : "bg-white text-slate-600 border border-slate-200"}`}
                              >
                                Tests (90+)
                              </button>
                            </div>
                          </div>

                          <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-50 flex-1">
                            {filteredDropdownItems.map((item) => {
                              const isSelected = selectedItemIds.includes(item.id)
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => handleToggleStep1Item(item.id)}
                                  className={`p-2.5 rounded-[8px] flex items-center justify-between gap-3 transition-colors cursor-pointer ${isSelected ? "bg-blue-50 font-bold" : "hover:bg-slate-50"
                                    }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`h-5 w-5 rounded-[6px] border flex items-center justify-center shrink-0 ${isSelected ? "bg-[#1e3a8a] border-[#1e3a8a] text-white" : "bg-white border-slate-300"}`}>
                                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="truncate text-xs text-slate-900 font-bold">{item.name}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">{item.code} • {item.parameterCount}</div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-bold text-xs text-[#1e3a8a]">₹{item.price}</span>
                                    <span className="text-[10px] line-through text-slate-400 ml-1">₹{item.mrp}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <div className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                              {selectedItemIds.length} Tests Selected (₹{realizedRevenue})
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(false)}
                              className="px-4 py-1.5 rounded-[8px] bg-[#1e3a8a] hover:bg-[#152e6f] text-white text-xs font-bold cursor-pointer transition-colors"
                            >
                              Done Selecting ✓
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick 1-Tap Popular Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Quick Popular Selections:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_QUICK_PICKS.map((quick) => {
                          const isSelected = selectedItemIds.includes(quick.id)
                          return (
                            <button
                              key={quick.id}
                              type="button"
                              onClick={() => handleToggleStep1Item(quick.id)}
                              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                                ? "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 hover:text-[#1e3a8a]"
                                }`}
                            >
                              {isSelected ? (
                                <Check className="h-3.5 w-3.5 stroke-[2.5] text-white" />
                              ) : (
                                <Plus className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              <span>{quick.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Active Selected Tests Cards List */}
                    <div className="space-y-2.5 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Active Selected Tests ({step1SelectedItems.length})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {step1SelectedItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-[8px] bg-white border border-slate-200/90 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {item.name}
                              </div>
                              <div className="text-[10.5px] text-slate-500 truncate mt-0.5 font-mono">
                                {item.code} • {item.parameterCount}
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <div className="text-right">
                                <div className="font-extrabold text-xs sm:text-sm text-[#1e3a8a]">₹{item.price}</div>
                                <div className="text-[10px] line-through text-slate-400">₹{item.mrp}</div>
                              </div>
                              {selectedItemIds.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStep1Item(item.id)}
                                  className="h-6 w-6 rounded-[6px] bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                                  title="Remove test"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 1 Bottom Action */}
                    <div className="flex justify-end pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        className="py-3 px-7 rounded-[8px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <span>Continue to Beneficiaries</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------- */}
              {/* STEP 2 CONTENT: BENEFICIARIES & SAMPLE COLLECTION                   */}
              {/* ------------------------------------------------------------------- */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">

                  {/* Section Title */}
                  <div className="space-y-0.5">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Beneficiaries &amp; Sample Collection
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Book for yourself or family members. We&apos;ll handle the rest.
                    </p>
                  </div>

                  {/* Collection Method Cards (Home Collection vs Visit Lab Center) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Home Collection Card */}
                    <div
                      onClick={() => setCollectionMethod("Home Collection")}
                      className={`p-5 rounded-[8px] border transition-all cursor-pointer relative flex items-start gap-4 ${collectionMethod === "Home Collection"
                        ? "border-[#1e3a8a] bg-white shadow-xs ring-2 ring-[#1e3a8a]/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                      {collectionMethod === "Home Collection" && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="h-12 w-12 rounded-[8px] bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center shrink-0">
                        <Home className="h-6 w-6" />
                      </div>

                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Home Collection</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          We&apos;ll collect samples from your doorstep. Same address? Only one collection fee.
                        </p>
                      </div>
                    </div>

                    {/* Visit Center Card */}
                    <div
                      onClick={() => setCollectionMethod("Visit Center")}
                      className={`p-5 rounded-[8px] border transition-all cursor-pointer relative flex items-start gap-4 ${collectionMethod === "Visit Center"
                        ? "border-[#1e3a8a] bg-white shadow-xs ring-2 ring-[#1e3a8a]/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                      {collectionMethod === "Visit Center" && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="h-12 w-12 rounded-[8px] bg-blue-50 text-[#1e3a8a] border border-blue-100 flex items-center justify-center shrink-0">
                        <FlaskConical className="h-6 w-6" />
                      </div>

                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Visit Lab Center</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Visit any AVMLabs center near you. Fast, hygienic &amp; convenient.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Who is this booking for? Section Header */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Who is this booking for?
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select tests for family members and add more if needed.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddBeneficiary(true)}
                      className="px-3.5 py-1.5 rounded-[5px] border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {/* Beneficiary Cards List (Only rendered if beneficiaries exist) */}
                  {beneficiaries.length > 0 && (
                    <div className="space-y-4">
                      {beneficiaries.map((ben) => {
                        const initials = ben.name.split(" ").map(n => n[0]).slice(0, 2).join("")
                        const assignedCount = ben.selectedTestIds.length
                        return (
                          <div
                            key={ben.id}
                            className="bg-white rounded-[5px] border border-slate-200/90 p-5 space-y-3.5 shadow-2xs hover:shadow-xs transition-shadow"
                          >

                            {/* Member Top Info Row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-[5px] bg-[#1e3a8a] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                                  {initials}
                                </div>

                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{ben.name}</h4>
                                    <span className="px-2 py-0.5 rounded-[5px] bg-blue-50 text-[#1e3a8a] border border-blue-200 text-[10px] font-bold">
                                      {ben.relation}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium">
                                    {ben.gender} • {ben.age} yrs • {ben.address}
                                  </p>
                                </div>
                              </div>

                              {/* Right Actions: Test Count + Edit + Delete */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-right hidden sm:block pr-2">
                                  <div className="text-xs font-bold text-slate-900">{assignedCount} {assignedCount === 1 ? "Test" : "Tests"}</div>
                                  <div className="text-[10px] text-slate-400">Selected</div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setEditingMember(ben)}
                                  className="p-1.5 rounded-[5px] border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                                  title="Edit Member Details"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>

                                {ben.relation !== "Self" && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMember(ben.id)}
                                    className="p-1.5 rounded-[5px] border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    title="Remove Member"
                                  >
                                    <Trash2 className="h-4 w-4 text-rose-500" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Member Selected Tests Section */}
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                Selected Tests / Packages
                              </span>

                              <div className="flex flex-wrap items-center gap-2">
                                {ben.selectedTestIds.map((tId) => {
                                  const foundTest = allAvailableItems.find(i => i.id === tId)
                                  if (!foundTest) return null
                                  return (
                                    <span
                                      key={tId}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#1e3a8a] text-white text-xs font-bold shadow-2xs group"
                                    >
                                      <Check className="h-3 w-3 text-white stroke-[2.5]" />
                                      <span>{foundTest.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeMemberTest(ben.id, tId)}
                                        className="ml-1 text-slate-300 hover:text-rose-300 cursor-pointer"
                                        title="Remove from member"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  )
                                })}

                                {/* Button to Add More Tests & Profiles for This Single Member */}
                                <button
                                  type="button"
                                  onClick={() => setAssigningMemberId(ben.id)}
                                  className="px-3 py-1.5 rounded-[5px] border border-dashed border-blue-300 bg-blue-50/70 hover:bg-blue-100 text-[#1e3a8a] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>Select Tests</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add more family members or beneficiaries Dashed Card */}
                  <div className="p-6 sm:p-8 rounded-[5px] border-2 border-dashed border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-[5px] bg-blue-100 text-[#1e3a8a] flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Add more family members or beneficiaries</h4>
                        <p className="text-xs text-slate-500">You can add family members and select tests for them.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddBeneficiary(true)}
                      className="px-4 py-2 rounded-[5px] bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {/* Bottom Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 rounded-[8px] bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ArrowLeft className="h-4 w-4 shrink-0" />
                      <span>Back to Tests</span>
                    </button>

                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (beneficiaries.length === 0) {
                            setShowAddBeneficiary(true)
                            return
                          }
                          setStep(3)
                        }}
                        disabled={totalItemCount === 0}
                        className="w-full sm:w-auto py-3 px-7 rounded-[8px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <span>Continue to Slot Selection</span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------------- */}
              {/* STEP 3 CONTENT: AVAILABLE DATE & TIME SLOT                          */}
              {/* ------------------------------------------------------------------- */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Select Date &amp; Available Time Slot
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Early morning slots are ideal for fasting blood sugar &amp; lipid profiles.
                    </p>
                  </div>

                  <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
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
                          className={`p-3 rounded-[8px] border text-center transition-all cursor-pointer ${selectedDate === d.date
                            ? "border-[#1e3a8a] bg-blue-50/60 ring-2 ring-[#1e3a8a]/10 text-[#1e3a8a] font-black shadow-xs"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                            }`}
                        >
                          <div className="text-[10px] uppercase font-bold text-slate-400">{d.label}</div>
                          <div className="text-xs font-bold mt-0.5">{d.day}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Select Available Time Slot
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {AVAILABLE_TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`p-3.5 rounded-[8px] border text-left flex items-center justify-between transition-all cursor-pointer ${selectedSlot === slot.time
                            ? "bg-blue-50/60 border-[#1e3a8a] ring-2 ring-[#1e3a8a]/10 text-[#1e3a8a] font-bold shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Clock className="h-4 w-4 text-[#1e3a8a]" />
                            <span className="text-xs font-bold">{slot.time}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                            Available
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-[8px] bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ArrowLeft className="h-4 w-4 shrink-0" />
                      <span>Back to Beneficiaries</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToReviewAndPayment}
                      className="py-3 px-7 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Review &amp; Pay</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------- */}
              {/* STEP 4 CONTENT: REVIEW & PAYMENT GATEWAY                            */}
              {/* ------------------------------------------------------------------- */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Review &amp; Confirm Booking
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Verify beneficiary test allocations, collection schedule, and choose payment mode.
                    </p>
                  </div>

                  <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 space-y-4 shadow-2xs">
                    <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                      Choose Payment Method
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType("Prepaid")}
                        className={`p-3.5 rounded-[8px] border text-left transition-all cursor-pointer ${paymentType === "Prepaid"
                          ? "bg-blue-50/60 border-[#1e3a8a] ring-2 ring-[#1e3a8a]/10 text-[#1e3a8a] font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        <div className="text-xs font-bold text-slate-900">⚡ Prepaid Online (Instant)</div>
                        <div className="text-[10.5px] text-slate-500 mt-0.5">UPI, Credit/Debit Cards, NetBanking</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentType("Postpaid (Pay on Collection)")
                          setPaymentMethod("CashOnCollection")
                        }}
                        className={`p-3.5 rounded-[8px] border text-left transition-all cursor-pointer ${paymentType === "Postpaid (Pay on Collection)"
                          ? "bg-blue-50/60 border-[#1e3a8a] ring-2 ring-[#1e3a8a]/10 text-[#1e3a8a] font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        <div className="text-xs font-bold text-slate-900">💵 Pay on Collection (Postpaid)</div>
                        <div className="text-[10.5px] text-slate-500 mt-0.5">Pay via Cash / QR during sample pickup</div>
                      </button>
                    </div>

                    {paymentType === "Prepaid" && (
                      <div className="space-y-2 text-xs pt-1">
                        {[
                          { id: "UPI", label: "⚡ Instant UPI (GPay, PhonePe, Paytm, QR)" },
                          { id: "Card", label: "💳 Credit / Debit Card (Visa, Mastercard, RuPay)" },
                          { id: "NetBanking", label: "🏛️ Net Banking (All Indian Banks)" }
                        ].map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center gap-2.5 p-3 rounded-[8px] border transition-all cursor-pointer ${paymentMethod === m.id
                              ? "bg-blue-50/60 border-[#1e3a8a] font-bold text-[#1e3a8a]"
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
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-[8px] bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ArrowLeft className="h-4 w-4 shrink-0" />
                      <span>Back to Slots</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="py-3.5 px-8 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Confirm &amp; Book Appointment</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ===================================================================== */}
            {/* RIGHT COLUMN: STICKY BOOKING SUMMARY & SUPPORT                        */}
            {/* ===================================================================== */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">

              {/* 1. Main Booking Summary Card */}
              <div className="bg-white rounded-[8px] border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">

                {/* Header with Items Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base">Booking Summary</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1e3a8a] font-bold text-xs border border-blue-200">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Assigned Items List Grouped with Pricing */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 divide-y divide-slate-50">
                  {activeSummaryItems.map(({ item, count, totalPrice }) => (
                    <div key={item.id} className="flex justify-between items-center text-xs py-2 gap-2">
                      <div className="truncate">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        {count > 1 && <span className="text-[#1e3a8a] font-black ml-1.5">× {count}</span>}
                      </div>
                      <span className="font-black text-slate-900 shrink-0">₹{totalPrice}</span>
                    </div>
                  ))}

                  {totalItemCount === 0 && (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      No tests selected yet.
                    </p>
                  )}
                </div>

                {/* Green 20% OFF Applied Banner */}
                {totalSavings > 0 && (
                  <div className="p-2.5 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>You save ₹{totalSavings} (20% OFF applied)</span>
                  </div>
                )}

                {/* Financials Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Catalog Total (MRP)</span>
                    <span className="line-through">₹{subtotalMRP}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Customer Discount 20%</span>
                    <span>- ₹{catalogueDiscount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Home Collection Fee</span>
                    <span className="text-slate-900 font-bold">
                      {collectionMethod === "Home Collection" ? (isAddressMerged ? "₹150" : `₹${homeCollectionFee}`) : "FREE"}
                    </span>
                  </div>
                </div>

                {/* Total Amount in Bold */}
                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                    <span className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</span>
                  </div>
                  <span className="text-2xl font-black text-[#1e3a8a]">₹{totalAmount}</span>
                </div>

                {/* Green Your Savings Pill */}
                {totalSavings > 0 && (
                  <div className="p-3 rounded-[8px] bg-[#e6f7ef] border border-[#bbf0d4] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#0f9f59] font-bold">
                      <Tag className="h-4 w-4" />
                      <span>Your Savings</span>
                    </div>
                    <span className="font-black text-sm text-[#0f9f59]">₹{totalSavings}</span>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-1">
                  {step === 1 && (
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      disabled={totalItemCount === 0}
                      className="w-full py-3.5 px-4 rounded-[8px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>Continue to Beneficiaries</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={totalItemCount === 0}
                      className="w-full py-3.5 px-4 rounded-[8px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>Continue to Slot Selection</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="button"
                      onClick={handleProceedToReviewAndPayment}
                      className="w-full py-3.5 px-4 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Review &amp; Confirm Payment</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  {step === 4 && (
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="w-full py-3.5 px-4 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Pay ₹{totalAmount} &amp; Confirm</span>
                    </button>
                  )}
                </div>

              </div>

              {/* 2. Have a Prescription? Card */}
              <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 space-y-2 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[8px] bg-blue-50 text-[#1e3a8a] border border-blue-100 flex items-center justify-center shrink-0">
                    <Upload className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Have a Prescription?</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Upload prescription and our experts will help you choose the right tests.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(true)}
                  className="text-xs font-bold text-[#1e3a8a] hover:text-blue-700 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Upload Now</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* 3. Need Help? Helpline Card */}
              <div className="bg-white rounded-[8px] border border-slate-200/90 p-5 space-y-2 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[8px] bg-blue-50 text-[#1e3a8a] border border-blue-100 flex items-center justify-center shrink-0">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Need Help?</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Our customer care is ready to assist you.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 pt-1">
                  Call Us: <a href="tel:18001234567" className="text-[#1e3a8a] hover:underline">1800-123-4567</a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 5: BOOKING SUCCESS RECEIPT & CONFIRMATION                          */}
        {/* ======================================================================= */}
        {step === 5 && (
          <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 py-6">
            <div className="bg-white rounded-[8px] border border-slate-200/90 shadow-xl p-6 sm:p-8 text-center space-y-5">

              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-[8px] mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[#1e3a8a]">
                  Appointment Confirmed!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Your diagnostic appointment has been successfully scheduled.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 sm:p-5 rounded-[8px] bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Booking Reference:</span>
                  <span className="font-mono font-black text-[#1e3a8a] text-sm">{bookingId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Patient:</span>
                  <span className="font-bold text-slate-900">{patientData.fullName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date &amp; Slot:</span>
                  <span className="font-bold text-[#1e3a8a]">{selectedDate} ({selectedSlot})</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Collection Type:</span>
                  <span className="font-bold text-slate-900">{collectionMethod}</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span className="text-slate-900">Total Paid / Payable:</span>
                  <span className="text-[#1e3a8a] font-black">₹{totalAmount}</span>
                </div>
              </div>

              {/* Phlebotomist Live Tracking Info */}
              <div className="p-4 bg-[#eef4ff] border border-[#d6e4ff] rounded-[8px] text-left space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1e3a8a]">Phlebotomist: Ravi Kumar (Assigned)</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    Safety OTP: 4821
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600">
                  Phlebotomist will arrive on {selectedDate} with temperature-controlled vacutainers. Please share Safety OTP <b>4821</b> before sample handover.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Downloading verified PDF booking receipt for ${bookingId}`)}
                  className="py-3 px-4 rounded-[8px] border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Receipt</span>
                </button>

                <Link
                  href="/customer/dashboard"
                  className="py-3 px-4 rounded-[8px] bg-[#1e3a8a] hover:bg-[#152e6f] text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <span>Track in Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* SLIDE-OVER SIDEBAR: SELECT MEMBER TESTS (DRAWER WITH SMOOTH ANIMATION)   */}
      {/* ========================================================================= */}
      <SelectMemberTestsDrawer
        isOpen={Boolean(assigningMemberId && currentAssigningMember)}
        onClose={() => setAssigningMemberId(null)}
        member={currentAssigningMember || null}
        allAvailableItems={allAvailableItems}
        onToggleTest={toggleMemberTest}
        onRemoveTest={removeMemberTest}
      />

      {/* ========================================================================= */}
      {/* SLIDE-OVER SIDEBAR: ADD & EDIT FAMILY MEMBER                              */}
      {/* ========================================================================= */}
      <AddFamilyMemberDrawer
        isOpen={showAddBeneficiary}
        onClose={() => setShowAddBeneficiary(false)}
        onSave={handleAddNewBeneficiary}
        defaultAddress={patientData.address}
        title="Add Family Member"
      />

      <AddFamilyMemberDrawer
        isOpen={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        onSave={handleUpdateMember}
        defaultAddress={patientData.address}
        initialData={editingMember ? {
          name: editingMember.name,
          relation: editingMember.relation as any,
          age: editingMember.age,
          gender: editingMember.gender,
          address: editingMember.address
        } : null}
        title="Edit Member Details"
      />

      {/* ========================================================================= */}
      {/* MODAL: ASK LOGIN BEFORE PAYMENT                                           */}
      {/* ========================================================================= */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop with subtle blur and fade */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowLoginPrompt(false)}
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-[5px] border border-slate-200 shadow-2xl max-w-md w-full p-6 z-10 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[5px] bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Lock className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Login Required
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in to continue to review &amp; pay
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="h-8 w-8 rounded-[5px] border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Explanation card */}
            <div className="my-4 p-3.5 rounded-[5px] bg-blue-50/70 border border-blue-100 text-xs text-slate-700 space-y-2.5">
              <p className="leading-relaxed text-slate-600">
                Please log in to your account before proceeding to payment. Your selected tests, scheduled time slot, and patient details are safely saved.
              </p>
              <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] font-semibold text-[#1e3a8a]">
                <span>Order Total: <strong className="text-sm font-black">₹{totalAmount}</strong></span>
                <span className="text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-[5px] font-bold">
                  ✓ Booking Draft Saved
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleGoToLoginPage}
                className="w-full h-11 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Go to Login Page</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
              >
                Cancel &amp; Review Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL: PRESCRIPTION UPLOAD                                          */}
      {/* ========================================================================= */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#1e3a8a] stroke-[2.5]" />
                <h3 className="text-base font-bold text-slate-900">Upload Doctor&apos;s Prescription</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrescriptionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {rxSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[8px] text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Prescription Uploaded!</h4>
                <p className="text-xs text-emerald-800">
                  Our lab care coordinator will review and call you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePrescriptionSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={rxForm.name}
                    onChange={(e) => setRxForm({ ...rxForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[8px] border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Callback Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={rxForm.mobile}
                    onChange={(e) => setRxForm({ ...rxForm, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[8px] border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Prescription Slip (PDF / Image) *</label>
                  <div className="p-4 border-2 border-dashed border-blue-200 rounded-[8px] bg-blue-50/30 text-center space-y-1">
                    <Upload className="h-6 w-6 text-[#1e3a8a] mx-auto stroke-[2.2]" />
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
                    className="w-full px-3.5 py-2 rounded-[8px] border border-slate-200 text-slate-900 bg-slate-50/50"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(false)}
                    className="px-4 py-2.5 rounded-[8px] border border-slate-300 font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-[8px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold shadow-xs cursor-pointer transition-all inline-flex items-center gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Submit Prescription</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />

      {/* ========================================================================= */}
      {/* MODERN HIGH-END MOBILE BOTTOM APP NAVIGATION BAR (MATCHING CUSTOMER APP)  */}
      {/* ========================================================================= */}
      <nav 
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 h-[68px] pb-3 pt-1.5 px-3 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.08)] overflow-visible"
        suppressHydrationWarning
      >

        {/* Tab 1: Home */}
        <Link
          href={homeHref}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all"
          suppressHydrationWarning
        >
          <Home className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] leading-none font-medium">
            Home
          </span>
        </Link>

        {/* Tab 2: Orders & Live Tracking */}
        <Link
          href={ordersHref}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all relative"
          suppressHydrationWarning
        >
          <div className="relative">
            <ClipboardList className="h-5 w-5 stroke-[1.75]" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-[10px] leading-none font-medium">
            Orders
          </span>
        </Link>

        {/* Tab 3: Center Elevated Book Test CTA (Active on /booking) */}
        <Link
          href="/booking"
          className="flex flex-col items-center justify-center -mt-6 group active:scale-95 transition-transform"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] via-[#251b5c] to-[#382685] text-white shadow-lg shadow-indigo-950/30 flex items-center justify-center border-2 border-white ring-4 ring-slate-100 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-cyan-300 stroke-[2.5]" />
          </div>
          <span className="text-[10px] leading-none font-black text-[#251b5c] mt-1">
            + Book Test
          </span>
        </Link>

        {/* Tab 4: Lab Reports */}
        <Link
          href={reportsHref}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all"
          suppressHydrationWarning
        >
          <FileText className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] leading-none font-medium">
            Reports
          </span>
        </Link>

        {/* Tab 5: Family Members */}
        <Link
          href={beneficiariesHref}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-400 hover:text-slate-600 transition-all"
          suppressHydrationWarning
        >
          <Users className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] leading-none font-medium">
            Family
          </span>
        </Link>

      </nav>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fd] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    }>
      <BookingWizardContent />
    </Suspense>
  )
}
