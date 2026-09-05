"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CustomerPortalOrder,
  MOCK_CUSTOMER_ORDERS,
  OrderTestingDetail
} from "@/lib/customer-portal-data"
import {
  ClipboardList,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Truck,
  FlaskConical,
  FileCheck,
  User,
  Phone,
  MapPin,
  Search,
  Filter,
  Download,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  Thermometer,
  Layers,
  FileText,
  BadgePercent,
  Check,
  HelpCircle
} from "lucide-react"

export default function CustomerOrdersAppointmentsPage() {
  const router = useRouter()

  // State
  const [orders, setOrders] = useState<CustomerPortalOrder[]>(MOCK_CUSTOMER_ORDERS)
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [patientFilter, setPatientFilter] = useState<string>("all")

  // Modal State
  const [selectedTestingOrder, setSelectedTestingOrder] = useState<CustomerPortalOrder | null>(null)
  const [rescheduleOrder, setRescheduleOrder] = useState<CustomerPortalOrder | null>(null)
  const [newSlot, setNewSlot] = useState("Tomorrow, 07:30 AM - 08:30 AM")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Unique patient list
  const patientsList = useMemo(() => {
    const set = new Set<string>()
    orders.forEach(o => set.add(`${o.patientName} (${o.patientRelation})`))
    return Array.from(set)
  }, [orders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === "active") {
        if (order.status === "Report Released" || order.status === "Cancelled") return false
      } else if (activeTab === "completed") {
        if (order.status !== "Report Released") return false
      }

      if (patientFilter !== "all") {
        const pTag = `${order.patientName} (${order.patientRelation})`
        if (pTag !== patientFilter) return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          order.orderNumber.toLowerCase().includes(q) ||
          order.patientName.toLowerCase().includes(q) ||
          order.profileName.toLowerCase().includes(q) ||
          order.testsList.some(t => t.toLowerCase().includes(q))
        if (!matches) return false
      }

      return true
    })
  }, [orders, activeTab, patientFilter, searchQuery])

  // Active highlighted order
  const liveActiveOrder = useMemo(() => {
    return orders.find(o => o.status !== "Report Released" && o.status !== "Cancelled") || orders[0]
  }, [orders])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleConfirmReschedule = () => {
    if (!rescheduleOrder) return
    setOrders(prev =>
      prev.map(o =>
        o.id === rescheduleOrder.id
          ? { ...o, appointmentSlot: newSlot, status: "Phlebotomist Assigned" }
          : o
      )
    )
    showToast(`Rescheduled ${rescheduleOrder.orderNumber} to ${newSlot}`)
    setRescheduleOrder(null)
  }

  const handleDownloadInvoice = (order: CustomerPortalOrder) => {
    const text = `
============================================================
           AVMLABS DIAGNOSTICS & CLINICAL LABS
                     TAX INVOICE & RECEIPT
============================================================
ORDER NUMBER    : ${order.orderNumber}
BOOKING DATE    : ${order.formattedBookingDate}
APPOINTMENT     : ${order.appointmentSlot}
PATIENT NAME    : ${order.patientName} (${order.patientRelation})
COLLECTION TYPE : ${order.collectionType}
ADDRESS         : ${order.collectionAddress}
------------------------------------------------------------
PACKAGE / TESTS ORDERED:
- ${order.profileName} (${order.testCount} Parameters)
${order.testsList.map(t => `  • ${t}`).join("\n")}
------------------------------------------------------------
PRICING & REVENUE REALIZATION:
Catalogue MRP Rate     : ₹${order.mrp}
CRA 20% Promo Discount : -₹${order.discount}
Home Sample Collection : ₹${order.collectionFee} (FREE)
------------------------------------------------------------
TOTAL AMOUNT PAID      : ₹${order.totalPayable}
PAYMENT METHOD         : ${order.paymentMethod}
PAYMENT STATUS         : ${order.paymentStatus}
============================================================
Thank you for choosing AVMLabs Diagnostics.
`
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Invoice_${order.orderNumber}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    showToast(`Invoice downloaded for ${order.orderNumber}`)
  }

  const TRACKING_STEPS = [
    { step: 1, label: "Order Placed", desc: "Confirmed" },
    { step: 2, label: "Phlebo Assigned", desc: "Home visit" },
    { step: 3, label: "Sample Collected", desc: "Cold sealed" },
    { step: 4, label: "In Lab Analysis", desc: "Testing" },
    { step: 5, label: "Report Released", desc: "Verified" }
  ]

  return (
    <div className="space-y-4 font-sans pb-12 text-slate-800">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. COMPACT CLASSIC HEADER                                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Orders &amp; Appointments
              </h1>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Live Status
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Track phlebotomist home visits, monitor sample analysis in lab, and view appointment history.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/booking"
              className="h-8 px-3 rounded-lg bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* COMPACT CLASSIC LIVE ORDER TRACKER (IF ACTIVE)                          */}
        {/* ======================================================================= */}
        {liveActiveOrder && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
                  Active Order:
                </span>
                <span className="font-mono font-bold text-[#1e3a8a] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 text-[11px]">
                  {liveActiveOrder.orderNumber}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] text-slate-600 font-medium truncate max-w-[200px] sm:max-w-none">
                  {liveActiveOrder.profileName}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Est. Delivery:</span>
                <strong className="text-slate-800 font-semibold">
                  {liveActiveOrder.estimatedReportTime}
                </strong>
              </div>
            </div>

            {/* Stepper Strip - Compact & Clean */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {TRACKING_STEPS.map((step) => {
                const isCompleted = step.step < liveActiveOrder.currentStep
                const isCurrent = step.step === liveActiveOrder.currentStep
                return (
                  <div
                    key={step.step}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? "bg-blue-50/80 border-blue-300 text-blue-900"
                        : isCompleted
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-white border-slate-100 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                      ) : (
                        <Circle className="h-2.5 w-2.5 text-slate-300" />
                      )}
                      <span className="text-[10px] font-bold">Step {step.step}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-900 truncate">
                      {step.label}
                    </div>
                    <div className="text-[9.5px] text-slate-500 truncate">
                      {step.desc}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Phlebotomist & Quick Action Bar */}
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 rounded-md bg-white border border-slate-200 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold mr-1.5">Phlebotomist:</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {liveActiveOrder.phlebotomist?.name || "AVMLabs Executive"}
                  </span>
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-[11px] text-slate-500 truncate">
                    {liveActiveOrder.phlebotomist?.eta || "En-route to lab"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {liveActiveOrder.phlebotomist?.collectionOtp && (
                  <div className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10.5px] flex items-center gap-1">
                    <span>OTP:</span>
                    <span className="font-mono text-slate-900 text-xs">
                      {liveActiveOrder.phlebotomist.collectionOtp}
                    </span>
                  </div>
                )}
                {liveActiveOrder.testingDetail && (
                  <button
                    type="button"
                    onClick={() => setSelectedTestingOrder(liveActiveOrder)}
                    className="h-7 px-2.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FlaskConical className="h-3 w-3 text-blue-600" />
                    <span>View Testing Details</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SEARCH STRIP                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          {/* Tabs: All / Active / Completed */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "active"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Active / Upcoming ({orders.filter(o => o.status !== "Report Released" && o.status !== "Cancelled").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "completed"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Completed ({orders.filter(o => o.status === "Report Released").length})
            </button>
          </div>

          {/* Patient dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline">
              Patient:
            </span>
            <div className="relative">
              <select
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
                className="pl-2.5 pr-7 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer appearance-none"
              >
                <option value="all">All Family Members</option>
                {patientsList.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 rotate-90 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (e.g. AVM-ORD-9952), patient, or test name..."
            className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ORDER CARDS LIST                                                       */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <ClipboardList className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-800">No orders found</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              No appointments match your filters. Try resetting filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all")
                setPatientFilter("all")
                setSearchQuery("")
              }}
              className="px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCompleted = order.status === "Report Released"
            const isInProgress = !isCompleted && order.status !== "Cancelled"

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-3.5 sm:p-4 shadow-2xs space-y-3 transition-all"
              >
                {/* Header: Order ID, Status, Booking Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Booked {order.formattedBookingDate}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="text-[11px]">Slot: {order.appointmentSlot}</span>
                  </div>
                </div>

                {/* Main Content: Patient + Package + Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start text-xs">
                  
                  {/* Col 1 (5 cols): Patient info & tests */}
                  <div className="md:col-span-5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {order.patientName.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-xs">
                          {order.patientName}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5">
                          ({order.patientRelation}, {order.patientAge}y)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#1e3a8a] text-xs">
                        {order.profileName}
                      </div>
                      <div className="text-[10.5px] text-slate-500 leading-normal line-clamp-1">
                        Includes: {order.testsList.slice(0, 3).join(", ")}
                        {order.testsList.length > 3 && ` +${order.testsList.length - 3} more`}
                      </div>
                    </div>
                  </div>

                  {/* Col 2 (4 cols): Collection type & Address */}
                  <div className="md:col-span-4 space-y-1 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center gap-1 font-semibold text-slate-700 text-[11px]">
                      <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                      <span>{order.collectionType}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal line-clamp-2">
                      {order.collectionAddress}
                    </p>
                    {order.phlebotomist && (
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/70">
                        Phlebo: <strong>{order.phlebotomist.name}</strong>
                      </div>
                    )}
                  </div>

                  {/* Col 3 (3 cols): Pricing & Payment */}
                  <div className="md:col-span-3 space-y-0.5 text-left md:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</div>
                    <div className="text-sm font-bold text-slate-900">
                      ₹{order.totalPayable}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded inline-block border border-emerald-100">
                      Saved ₹{order.discount} (20% Off)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {order.paymentMethod}
                    </div>
                  </div>

                </div>

                {/* Bottom Action Strip */}
                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(order)}
                      className="h-7 px-2.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-slate-500" />
                      <span>Invoice</span>
                    </button>

                    {isInProgress && (
                      <button
                        type="button"
                        onClick={() => setRescheduleOrder(order)}
                        className="h-7 px-2.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3 text-slate-500" />
                        <span>Reschedule</span>
                      </button>
                    )}

                    <Link
                      href="/customer/dashboard/help"
                      className="h-7 px-2 rounded-md text-slate-500 hover:text-slate-800 font-medium text-[11px] inline-flex items-center gap-1"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>Help</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {order.testingDetail && (
                      <button
                        type="button"
                        onClick={() => setSelectedTestingOrder(order)}
                        className="h-7 px-2.5 rounded-md border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-[#1e3a8a] font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FlaskConical className="h-3 w-3 text-blue-700" />
                        <span>Testing Details</span>
                      </button>
                    )}

                    {isCompleted && (
                      <Link
                        href="/customer/dashboard/reports"
                        className="h-7 px-3 rounded-md bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold text-[11px] inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <FileText className="h-3 w-3 text-sky-200" />
                        <span>View Lab Report</span>
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: ORDER TESTING DEEP-DIVE DETAILS (CENTRAL LAB WORKFLOW)          */}
      {/* ========================================================================= */}
      {selectedTestingOrder && selectedTestingOrder.testingDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-5 space-y-3 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                    {selectedTestingOrder.orderNumber}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    Cold-Chain Verified (4.6°C)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Lab Testing Progression
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedTestingOrder.profileName} • {selectedTestingOrder.patientName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTestingOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Specimen Integrity Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <div className="text-[9.5px] text-slate-400 font-bold uppercase">Barcode</div>
                <div className="font-mono font-bold text-slate-800 text-[11px]">
                  {selectedTestingOrder.testingDetail.sampleBarcode}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <div className="text-[9.5px] text-slate-400 font-bold uppercase">Temperature</div>
                <div className="font-bold text-blue-700 text-[11px] flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  <span>{selectedTestingOrder.testingDetail.temperatureCelsius}°C (2-8°C OK)</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <div className="text-[9.5px] text-slate-400 font-bold uppercase">Estimated TAT</div>
                <div className="font-bold text-slate-800 text-[11px]">
                  {selectedTestingOrder.testingDetail.estimatedTat}
                </div>
              </div>
            </div>

            {/* Specimen Tubes Collected */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Layers className="h-3 w-3 text-indigo-600" />
                <span>Sample Collection Tubes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                {selectedTestingOrder.testingDetail.tubesCollected.map((tube, i) => (
                  <div key={i} className="p-2 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${tube.capColor} shrink-0`} />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-[10.5px] truncate">{tube.tube}</div>
                      <div className="text-[9.5px] text-slate-500 truncate">{tube.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Progression Checklist */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-slate-700 flex items-center justify-between text-[11px]">
                <span>Investigation Test</span>
                <span>Testing Status</span>
              </div>
              <div className="divide-y divide-slate-100">
                {selectedTestingOrder.testingDetail.testsProgression.map((item, idx) => {
                  const isDone = item.status === "Verified by Pathologist"
                  const isTesting = item.status === "In Analysis"
                  return (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/70">
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{item.testName}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.department} {item.resultNote && `• ${item.resultNote}`}
                        </div>
                      </div>
                      <div>
                        <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded border ${
                          isDone
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isTesting
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Central Lab Info */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 text-[11px]">
                  {selectedTestingOrder.testingDetail.labCenter}
                </div>
                <div className="text-[10px] text-slate-500">
                  Analyst: {selectedTestingOrder.testingDetail.technicianName} • Pathologist: {selectedTestingOrder.testingDetail.pathologistReviewer}
                </div>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSelectedTestingOrder(null)}
                className="h-8 px-4 rounded-lg bg-slate-900 text-white font-medium text-xs cursor-pointer hover:bg-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: RESCHEDULE APPOINTMENT SLOT                                     */}
      {/* ========================================================================= */}
      {rescheduleOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reschedule Slot</h3>
                <p className="text-[11px] text-slate-500">
                  Order: <span className="font-mono font-bold">{rescheduleOrder.orderNumber}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleOrder(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 block text-[11px]">
                Select Morning Fasting Slot:
              </label>

              {[
                "Tomorrow, 07:00 AM - 08:00 AM (Fasting)",
                "Tomorrow, 08:00 AM - 09:00 AM",
                "Tomorrow, 09:00 AM - 10:00 AM",
                "Day After Tomorrow, 07:30 AM - 08:30 AM"
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setNewSlot(slot)}
                  className={`w-full p-2 rounded-lg border text-left font-medium text-[11px] transition-all cursor-pointer flex items-center justify-between ${
                    newSlot === slot
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{slot}</span>
                  {newSlot === slot && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRescheduleOrder(null)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="h-8 px-4 rounded-lg bg-[#1e3a8a] hover:bg-blue-800 text-white font-medium text-xs cursor-pointer shadow-2xs"
              >
                Confirm Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
