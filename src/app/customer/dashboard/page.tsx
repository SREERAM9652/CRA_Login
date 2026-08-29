"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Calendar, 
  FileText, 
  Clock, 
  Home, 
  Search, 
  Upload, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Phone, 
  Microscope,
  Activity,
  Heart,
  ArrowRight,
  FlaskConical,
  Award,
  AlertCircle,
  Copy,
  Check
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function CustomerDashboardPage() {
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false)
  const [copiedOtp, setCopiedOtp] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "scheduled">("all")

  const handleCopyOtp = () => {
    navigator.clipboard.writeText("4821")
    setCopiedOtp(true)
    setTimeout(() => setCopiedOtp(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-extrabold uppercase tracking-wider mb-2 border border-purple-200/80">
            <Sparkles className="h-3.5 w-3.5 text-[#382685]" /> Patient ID: #AVM-PT-981
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            Welcome back, Suresh
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage your diagnostic appointments, live sample collection tracking, and downloadable lab reports.
          </p>
        </div>

        <Link
          href="/booking"
          className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-indigo-950/15 hover:scale-102 transition-all"
        >
          <Search className="h-4 w-4" />
          <span>+ Book New Test</span>
        </Link>
      </div>

      {/* Referral Partner Banner (Matching cra-prototype.html) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-[#1e1b4b] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-sm flex items-center gap-2">
              <span>Referred by Rajesh Joshi (CRA Partner)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black uppercase">
                20% OFF ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Your 20% discount is automatically applied at checkout on all Wellness Profiles.
            </p>
          </div>
        </div>

        <Link
          href="/booking"
          className="px-4 py-2 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
        >
          <span>Browse 12 Profiles</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* PROMINENT UPCOMING APPOINTMENT CARD (HIGH-END GRADIENT & MILESTONES)       */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1e1b4b] via-[#2e1f74] to-[#382685] text-white shadow-xl shadow-indigo-950/10 border border-white/10 overflow-hidden relative p-6 sm:p-8 space-y-6">
        
        {/* Soft Ambient Glows */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left Details */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-[10.5px] uppercase tracking-wider shadow-xs">
                Confirmed Appointment
              </span>
              <span className="text-xs text-blue-200 font-mono">Order #ORD-8493</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Comprehensive Master Health Profile (85 Parameters)
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 flex items-center gap-2">
                <Home className="h-4 w-4 text-cyan-300 shrink-0" />
                <span>Home Sample Collection • 12 Hours Fasting Required</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-blue-100 pt-1">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                <Calendar className="h-3.5 w-3.5 text-cyan-300" /> Tomorrow, 28 Aug 2026
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                <Clock className="h-3.5 w-3.5 text-cyan-300" /> Available Slot: 07:30 AM – 08:30 AM
              </span>
            </div>
          </div>

          {/* Phlebotomist & OTP Verification Box */}
          <div className="bg-slate-950/80 backdrop-blur-xl p-5 rounded-2xl border border-white/15 space-y-3 min-w-[280px] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="text-xs">
                <div className="text-slate-400 text-[11px]">Assigned Phlebotomist</div>
                <div className="font-bold text-white text-sm">Ravi Kumar</div>
              </div>
              <div className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Verified Vaccinated
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-slate-300">Sample Safety OTP:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-cyan-300 tracking-widest">4821</span>
                <button
                  type="button"
                  onClick={handleCopyOtp}
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                  title="Copy OTP"
                >
                  {copiedOtp ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => alert("Reschedule request received. Our care coordinator will reach out shortly.")}
                className="flex-1 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Reschedule Slot
              </button>
              <a
                href="tel:18001234567"
                className="p-2 rounded-xl bg-white text-[#251b5c] hover:bg-slate-100 transition-colors flex items-center justify-center shadow-xs"
                title="Call Helpline"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Milestone Progress Bar */}
        <div className="pt-4 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-200 mb-2">
            <span className="text-cyan-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 1. Booking Confirmed
            </span>
            <span className="text-cyan-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 2. Phlebotomist Assigned
            </span>
            <span className="text-white flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-400" /> 3. Home Sample Pickup
            </span>
            <span className="text-slate-400">4. Lab Testing</span>
            <span className="text-slate-400">5. Report Dispatched</span>
          </div>
          <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 h-full w-[55%] rounded-full" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4 QUICK ACTION CARDS (MATCHING LOGIN ICON STYLES)                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <Link
          href="/booking"
          className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="h-11 w-11 rounded-2xl bg-purple-50 border border-purple-100 text-[#5538b5] flex items-center justify-center font-bold mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
            <Microscope className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-[#382685] transition-colors">
            Book a Test
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search 120+ diagnostic tests & full body checkups with home pickup.
          </p>
        </Link>

        {/* Card 2 */}
        <a
          href="#reports"
          className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="h-11 w-11 rounded-2xl bg-blue-50 border border-blue-100 text-[#3056d3] flex items-center justify-center font-bold mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
            Download Lab Reports
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant digital access to NABL-verified medical test results.
          </p>
        </a>

        {/* Card 3 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-rose-300 shadow-sm hover:shadow-md transition-all group">
          <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-100 text-[#e04838] flex items-center justify-center font-bold mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
            <Upload className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-[#e04838] transition-colors">
            Upload Prescription
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload doctor advice slip. Our team will curate your required tests.
          </p>
          <button
            type="button"
            onClick={() => {
              setPrescriptionUploaded(true)
              setTimeout(() => setPrescriptionUploaded(false), 3000)
            }}
            className="mt-2 text-xs font-bold text-[#382685] hover:underline cursor-pointer"
          >
            {prescriptionUploaded ? "✓ Prescription Uploaded!" : "Upload Slip →"}
          </button>
        </div>

        {/* Card 4 */}
        <Link
          href="/#why-choose-us"
          className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-amber-300 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-100 text-[#e04838] flex items-center justify-center font-bold mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-[#e04838] transition-colors">
            Find Nearest Center
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Locate AVMLabs diagnostic hubs in Indiranagar, Koramangala & more.
          </p>
        </Link>

      </div>

      {/* ========================================================================= */}
      {/* RECENT ORDERS & DIGITAL REPORTS SECTION                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="reports">
        
        {/* Recent Orders List */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">Recent Test Orders</h3>
              <p className="text-xs text-slate-500">Track status of your diagnostic bookings</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-extrabold border border-purple-100">
              3 Active Orders
            </span>
          </div>

          <div className="space-y-3">
            {/* Order 1 */}
            <div className="p-4 rounded-2xl border border-purple-200/80 bg-purple-50/30 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">
                  Comprehensive Master Health Profile
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Order #ORD-8493 • Scheduled for 28 Aug 2026
                </div>
                <div className="text-xs font-black text-[#382685] pt-0.5">
                  ₹2,600 (Paid Online • Home Collection)
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px]">
                Scheduled
              </span>
            </div>

            {/* Order 2 */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">
                  Basic Wellness Checkup (45 Parameters)
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Order #ORD-7210 • 15 Aug 2026 • Indiranagar Hub
                </div>
                <div className="text-xs font-bold text-slate-700 pt-0.5">
                  ₹999 (Completed)
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                Report Ready
              </span>
            </div>

            {/* Order 3 */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">
                  Vitamin D (25-OH) & Vitamin B12 Duo
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Order #ORD-5192 • 02 Jan 2026 • Home Collection
                </div>
                <div className="text-xs font-bold text-slate-700 pt-0.5">
                  ₹1,199 (Completed)
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                Report Ready
              </span>
            </div>
          </div>
        </div>

        {/* Digital Lab Reports */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">Verified Lab Reports</h3>
              <p className="text-xs text-slate-500">Digitally signed by MD Pathologists</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-100">
              NABL Verified
            </span>
          </div>

          <div className="space-y-3">
            {/* Report 1 */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-purple-200 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Basic Wellness Checkup Report
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sample Date: 15 Aug 2026 • 45 Parameters Normal
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Dr. K. Sharma (MD Pathologist)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert("Downloading Verified PDF Report #ORD-7210 (2.4 MB)...")}
                className="h-9 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 text-[#382685] transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-[#382685]" />
                <span>PDF</span>
              </button>
            </div>

            {/* Report 2 */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-purple-200 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Vitamin D3 & B12 Panel Report
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sample Date: 02 Jan 2026 • Vit D: 32.4 ng/mL (Normal)
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Dr. R. Verma (MD Pathologist)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert("Downloading Verified PDF Report #ORD-5192 (1.8 MB)...")}
                className="h-9 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 text-[#382685] transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-[#382685]" />
                <span>PDF</span>
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-2xl text-center text-xs text-slate-600 font-medium border border-purple-100/60">
              Need past historical test reports? Call our 24/7 Helpline: <strong className="text-[#382685]">1800 123 4567</strong>.
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
