"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  Lock,
  Headphones,
  Check
} from "lucide-react"

export default function ProfileKYCPage() {
  const { currentUser } = useWorkflowStore()
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    name: currentUser.name,
    mobile: currentUser.mobile,
    email: currentUser.email,
    pan: "ABCDE1234F",
    aadhaar: "•••• •••• 8912",
    bankName: "HDFC Bank",
    accountNumber: "50100293849182",
    ifsc: "HDFC0001234",
    upiId: `${currentUser.name.toLowerCase().replace(/\s+/g, ".")}@okhdfcbank`
  })

  useEffect(() => {
    setFormData({
      name: currentUser.name,
      mobile: currentUser.mobile,
      email: currentUser.email,
      pan: "ABCDE1234F",
      aadhaar: "•••• •••• 8912",
      bankName: "HDFC Bank",
      accountNumber: "50100293849182",
      ifsc: "HDFC0001234",
      upiId: `${currentUser.name.toLowerCase().replace(/\s+/g, ".")}@okhdfcbank`
    })
  }, [currentUser])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            My Profile &amp; Banking Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage your personal identity credentials, CRA agreement status, and bank settlement accounts
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 inline-flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="h-4 w-4" />
          <span>KYC Verified &amp; Active</span>
        </span>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg animate-in fade-in flex items-center justify-between border border-emerald-400/30">
          <span>✓ Profile &amp; banking details updated successfully!</span>
        </div>
      )}

      {/* 2-Column Responsive Layout (No empty space on right) */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Personal & Banking Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Personal Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="h-4.5 w-4.5 text-[#382685]" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">Registered Mobile (OTP Login)</label>
                <input
                  type="text"
                  value={formData.mobile}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">CRA Partner Code</label>
                <input
                  type="text"
                  value={currentUser.code}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/50 font-mono font-bold text-[#382685] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bank Settlement Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="h-4.5 w-4.5 text-[#382685]" />
              <span>Bank Settlement Details (For Payouts)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[11px]">UPI ID / VPA</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#382685]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>

        {/* Right Column: KYC Status & Agreement Documents (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Identity & KYC Verification Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
              <span>Identity Verification</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">PAN Number</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{formData.pan}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Verified
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Aadhaar Card</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{formData.aadhaar}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Verified
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">CRA Agreement</div>
                  <div className="font-bold text-slate-900 mt-0.5">Signed &amp; Active</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Executed
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Senior BDE Support Card */}
          <div className="bg-gradient-to-br from-[#1e1b4b] to-[#2e1f74] text-white rounded-3xl p-5 sm:p-6 space-y-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 text-cyan-300 flex items-center justify-center">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">Dedicated Relationship Manager</span>
                <div className="font-black text-sm text-white">Vikram Sharma (Senior BDE)</div>
              </div>
            </div>
            <p className="text-xs text-blue-100/80 font-medium leading-relaxed">
              Contact your BDE for onboarding assistance, special volume pricing requests, or payment queries.
            </p>
            <div className="pt-2">
              <a
                href="tel:+919876543210"
                className="w-full h-9 rounded-xl bg-white text-[#1e1b4b] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call +91 98765 43210</span>
              </a>
            </div>
          </div>

        </div>

      </form>

    </div>
  )
}
