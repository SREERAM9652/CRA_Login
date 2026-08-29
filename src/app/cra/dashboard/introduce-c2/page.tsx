"use client"

import { useState } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { useRouter } from "next/navigation"
import { 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  ArrowRight, 
  Smartphone, 
  Mail, 
  User, 
  Copy, 
  Check, 
  Share2, 
  Users2, 
  ShieldCheck,
  Building2,
  AlertCircle,
  MapPin
} from "lucide-react"

export default function IntroducePartnerPage() {
  const router = useRouter()
  const { currentUser, c1, c2List, introduceC2 } = useWorkflowStore()

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "Hyderabad"
  })

  const [createdPartner, setCreatedPartner] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.mobile) {
      alert("Please enter at least Partner Name and Mobile Number")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const newPartner = introduceC2({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`
      })
      setCreatedPartner(newPartner)
      setLoading(false)
      setFormData({ name: "", mobile: "", email: "", city: "Hyderabad" })
    }, 400)
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`https://avmlabs.com/login?ref=${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
          Refer a Partner / Associate
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Introduce a new referral partner to AVMLabs. They earn <strong>30% direct commission</strong> on customer test bookings, and you earn an automatic <strong>10% second-level referral bonus</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#251b5c] to-[#382685] absolute top-0 left-0" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900 font-bold">
                <UserPlus className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Partner Details</h3>
                <p className="text-[11px] text-slate-500 font-medium">Add referral partner to your network</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-[10.5px] font-extrabold border border-purple-200">
              Introduced by You
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Partner Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Partner Full Name *
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar / Sudheer Associates"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Field 2: Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Smartphone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="e.g. +91 98450 67890"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Field 3: City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Region *
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Hyderabad / Bengaluru / Dubai"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1e1b4b] to-[#382685] hover:opacity-95 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-indigo-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-101 mt-4"
            >
              {loading ? "Creating Partner..." : "REGISTER PARTNER"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Success Notification */}
          {createdPartner && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Partner <strong>{createdPartner.name}</strong> registered successfully!</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Partner Referral Code</div>
                  <div className="font-mono font-black text-slate-900">{createdPartner.code}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(createdPartner.code)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy Invite"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 2-Level Referral Structure Explainer */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Revenue Split Rule Box (Meeting Point 1 & 5 Specification) */}
          <div className="bg-gradient-to-br from-[#1e1b4b] to-[#2d1b69] text-white rounded-3xl p-6 shadow-lg border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
              <Coins className="h-4 w-4" /> 2-Level Referral Benefit Model
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-cyan-200 font-bold uppercase">Direct Referrer</div>
                <div className="text-2xl font-black text-white mt-0.5">30%</div>
                <p className="text-[10.5px] text-blue-100/80 mt-1">on all customer orders</p>
              </div>
              
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-amber-300 font-bold uppercase">Second-Level Referrer</div>
                <div className="text-2xl font-black text-amber-300 mt-0.5">10%</div>
                <p className="text-[10.5px] text-blue-100/80 mt-1">on introduced partner orders</p>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl text-xs text-blue-100 leading-relaxed font-medium space-y-1">
              <div className="font-bold text-white">Chain stops strictly after 2 levels:</div>
              <div>• Person A refers B $\rightarrow$ B refers C $\rightarrow$ When C books a test: B gets 30%, A gets 10%, beyond 2 levels gets 0%.</div>
            </div>
          </div>

          {/* Active Introduced Partners List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Users2 className="h-4 w-4 text-[#382685]" /> Partners Introduced by You ({c2List.length})
              </h3>
              <span className="text-[11px] font-bold text-slate-500">10% Referral Bonus</span>
            </div>

            <div className="space-y-2.5">
              {c2List.map((partner) => (
                <div 
                  key={partner.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center">
                      {partner.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{partner.name}</div>
                      <div className="text-[10.5px] text-slate-500">{partner.mobile} • <span className="font-mono text-[#382685] font-bold">{partner.code}</span></div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-extrabold border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
