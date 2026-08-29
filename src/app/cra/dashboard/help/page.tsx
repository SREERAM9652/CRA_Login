"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  HelpCircle, 
  Headphones, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageCircle, 
  Coins, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  ChevronDown
} from "lucide-react"

export default function HelpHowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: "How does the CRA Referral Model work?",
      a: "As a CRA, you refer B2C customers who need diagnostic wellness profiles. When your referred customer books and pays for a test, you earn 30% of the Realised Revenue (RR) directly. There is no sales quota or salary—earnings are 100% automated based on realized business."
    },
    {
      q: "What is Realised Revenue (RR)?",
      a: "Realised Revenue is the Catalogue MRP minus the 20% customer discount. For example: A ₹1,000 profile with 20% off has an RR of ₹800. Your 30% incentive (₹240) is calculated on this ₹800 base. Logistics/Home collection (₹200) is billed separately and sits outside the incentive split."
    },
    {
      q: "Can I introduce other Secondary CRA partners (C2s)?",
      a: "Yes! As a Primary C1 partner, you can introduce Secondary C2 associates under you. When your C2 refers a customer, they earn their direct 30% incentive, and you earn an automatic 10% second-level bonus on that RR. The system strictly stops after 2 levels."
    },
    {
      q: "When and how do I receive my payouts?",
      a: "Incentives accrue in your wallet immediately when the customer completes online payment. Payouts are transferred automatically via NEFT/UPI to your registered bank account twice a month on the 1st and 15th."
    },
    {
      q: "What is the 90-day retest retain & repeat loop?",
      a: "Diagnostic tests are typically repeated quarterly (every 90 days) for health monitoring. Our app automatically notifies you with a 1-tap WhatsApp nudge when your client's retest is due. When they rebook, you earn your 30% incentive again!"
    }
  ]

  return (
    <div className="w-full font-sans space-y-5 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Help, FAQs &amp; Assigned BDE Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Everything you need to understand the CRA workflow, commercial calculations, and connect with your dedicated account manager
          </p>
        </div>

        <a
          href="https://wa.me/919876543210?text=Hi%20AVMLabs%20BDE,%20I%20need%20assistance%20with%20a%20customer%20referral"
          target="_blank"
          rel="noreferrer"
          className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Chat with Assigned BDE</span>
        </a>
      </div>



      {/* 4-Step How It Works Explainer */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#382685]">Simple 4-Step Process</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">How the Referral Model Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-[#1e1b4b] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Identify &amp; Submit Lead</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Spot B2C prospects in your network and log their details via the 1-screen form in under a minute.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-[#251b5c] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">24h Company Follow-Up</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              AVMLabs care coordinators contact the client, assist with package selection, and schedule home collection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Payment &amp; RR Realised</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Client pays online with 20% discount. Payment is recognized as Revenue Realised against your account.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Incentive Credited</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              30% (Direct) or 10% (Team Override) credited automatically to your wallet for bi-monthly bank transfer.
            </p>
          </div>
        </div>
      </div>

      {/* Dedicated BDE Card */}
      <div className="bg-gradient-to-r from-[#1e1b4b] to-[#2e1f74] text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/10 text-cyan-300 flex items-center justify-center font-bold text-base shadow-xs">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">Dedicated Account Manager</span>
            <div className="text-base font-black text-white">Vikram Sharma (Senior BDE)</div>
            <div className="text-xs text-blue-100/80 font-medium">Assigned to help you close patient referrals &amp; answer queries</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+919876543210"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors border border-white/15"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>+91 98765 43210</span>
          </a>
          <a
            href="mailto:bde.support@avmlabs.com"
            className="px-4 py-2.5 rounded-xl bg-white text-[#1e1b4b] font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email BDE</span>
          </a>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
