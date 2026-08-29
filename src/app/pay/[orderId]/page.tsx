"use client"

import { useState, use } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Building2, 
  Home, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Coins, 
  Check, 
  Wallet,
  Smartphone,
  Layers,
  FlaskConical
} from "lucide-react"

export default function CustomerPaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const resolvedParams = use(params)
  const orderId = resolvedParams.orderId
  const router = useRouter()
  const { orders, payForOrder } = useWorkflowStore()

  const order = orders.find(o => o.id === orderId) || orders[0]

  // Flow State (1: Customer View, 2: Online Payment, 3: Booking Confirmed)
  const [customerScreen, setCustomerScreen] = useState<1 | 2 | 3>(
    order.status === "Paid" ? 3 : 1
  )

  // Payment Method
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI")
  const [paying, setPaying] = useState(false)

  const handlePayNow = () => {
    setCustomerScreen(2)
  }

  const handleMakePayment = () => {
    setPaying(true)
    setTimeout(() => {
      payForOrder(order.id, selectedMethod)
      setPaying(false)
      setCustomerScreen(3)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fd] via-[#f1f3fa] to-[#eaf0fc] font-sans text-slate-800 flex flex-col selection:bg-[#382685] selection:text-white">
      
      {/* Main Container */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:scale-102 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="AVMLabs Diagnostics"
              className="h-14 w-auto max-w-[200px] object-contain mix-blend-multiply mx-auto"
            />
          </Link>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Secure Diagnostic Test Checkout
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: ORDER BREAKDOWN                                                 */}
        {/* ========================================================================= */}
        {customerScreen === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6 max-w-lg mx-auto w-full animate-fade-in">
            <div className="text-center border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-900">Diagnostic Order Summary</h2>
              <p className="text-xs text-slate-500 font-medium">Order Number: <strong>{order.orderNumber}</strong></p>
            </div>

            {/* Profile Details Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900">
                Selected Health Package
              </div>
              <div className="font-black text-slate-900 text-sm">{order.profileName}</div>
              <div className="text-xs text-slate-600">Patient: <strong>{order.customerName}</strong> ({order.mobile})</div>
            </div>

            {/* Price Table */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-700">
                <span>Catalogue Rate (MRP)</span>
                <b>₹{order.cataloguePrice}</b>
              </div>

              <div className="flex justify-between items-center text-emerald-700 font-medium">
                <span>Partner Special Discount (20%)</span>
                <b>- ₹{order.discount}</b>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-slate-400" /> Home Sample Collection
                </span>
                <b>₹{order.homeCollectionFee}</b>
              </div>

              <hr className="border-slate-200 my-2" />

              <div className="flex justify-between items-center text-base">
                <b className="font-extrabold text-slate-900">Total Amount Payable</b>
                <b className="text-2xl font-black text-indigo-900">₹{order.totalPayable}</b>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              type="button"
              onClick={handlePayNow}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-101 transition-all"
            >
              <span>PROCEED TO PAYMENT (₹{order.totalPayable})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ONLINE PAYMENT OPTIONS                                          */}
        {/* ========================================================================= */}
        {customerScreen === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6 max-w-lg mx-auto w-full animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Online Payment Gateway</h2>
                <p className="text-xs text-slate-500 font-medium">Select payment mode for ₹{order.totalPayable}</p>
              </div>
              <button
                type="button"
                onClick={() => setCustomerScreen(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              
              {/* Option 1: UPI */}
              <div 
                onClick={() => setSelectedMethod("UPI")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === "UPI"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-400 flex items-center justify-center">
                    {selectedMethod === "UPI" && <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-slate-900">UPI (Google Pay / PhonePe / Paytm)</div>
                    <div className="text-[11px] text-slate-500 font-medium">Instant QR code or UPI ID verification</div>
                  </div>
                </div>
                <QrCode className="h-5 w-5 text-slate-400" />
              </div>

              {/* Option 2: Card */}
              <div 
                onClick={() => setSelectedMethod("Card")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === "Card"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-400 flex items-center justify-center">
                    {selectedMethod === "Card" && <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-slate-900">Credit / Debit Card</div>
                    <div className="text-[11px] text-slate-500 font-medium">Visa, Mastercard, RuPay &amp; Diners</div>
                  </div>
                </div>
                <CreditCard className="h-5 w-5 text-slate-400" />
              </div>

              {/* Option 3: Net Banking */}
              <div 
                onClick={() => setSelectedMethod("NetBanking")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === "NetBanking"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-400 flex items-center justify-center">
                    {selectedMethod === "NetBanking" && <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-slate-900">Net Banking</div>
                    <div className="text-[11px] text-slate-500 font-medium">HDFC, ICICI, SBI, Axis &amp; all major banks</div>
                  </div>
                </div>
                <Building2 className="h-5 w-5 text-slate-400" />
              </div>

            </div>

            {/* Make Payment Button */}
            <button
              type="button"
              disabled={paying}
              onClick={handleMakePayment}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 hover:opacity-95 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-indigo-950/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-101 transition-all"
            >
              <span>{paying ? "PROCESSING PAYMENT..." : `PAY ₹${order.totalPayable} NOW`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: BOOKING CONFIRMED                                               */}
        {/* ========================================================================= */}
        {customerScreen === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600 shadow-2xl space-y-6 max-w-lg mx-auto w-full animate-fade-in">
            <div className="text-center">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Booking Confirmed</h2>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">✓ Payment of ₹{order.totalPayable} Received</p>
            </div>

            {/* Confirmed Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Order ID</span>
                <span className="font-mono font-black text-sm text-slate-900">{order.orderNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Profile Booked</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">{order.profileName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Collection Type</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-emerald-600" /> Home Sample Collection
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Lab Hub</span>
                <span className="font-bold text-slate-900">AVMLabs Central — Indiranagar</span>
              </div>
            </div>

            {/* Return Link */}
            <div className="space-y-2 pt-1">
              <Link
                href="/cra/dashboard/wallet"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1e1b4b] to-[#382685] hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-101 transition-all"
              >
                <span>Return to Partner Portal →</span>
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
