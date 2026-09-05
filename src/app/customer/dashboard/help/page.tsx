"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  HelpCircle, 
  Headphones, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  FileText,
  Home,
  Sparkles,
  Users,
  CheckCircle2
} from "lucide-react"

export default function CustomerHelpFaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: "How does my 20% Referral Discount work?",
      a: "Because you were referred by an authorized healthcare partner, a 20% discount is automatically unlocked and deducted from the catalogue MRP across all wellness profiles and lab tests. There is no coupon code needed—your discount is applied instantly at checkout."
    },
    {
      q: "How do I prepare for home sample collection?",
      a: "For full body and lipid/glucose profiles, an 8 to 12-hour overnight fasting is recommended (plain water is allowed). You will receive an SMS reminder and a call from your assigned certified phlebotomist 30 minutes before arrival."
    },
    {
      q: "When and how will I receive my lab test reports?",
      a: "Routine blood and wellness reports are digitally verified by our MD Pathologists within 6 to 24 hours. You will receive an instant WhatsApp alert with a secure PDF download link, and the report will also be permanently archived under 'Digital Lab Reports' on this dashboard."
    },
    {
      q: "Is home sample pickup safe and certified?",
      a: "Yes. All samples are collected using pre-sealed, barcoded, single-use vacuum BD Vacutainer® tubes by certified phlebotomists wearing PPE. A safety 4-digit OTP is verified at your doorstep before sample collection."
    },
    {
      q: "Can I book tests for my family members?",
      a: "Yes! Use the 'Family Members' section to add parents, spouse, or children. You can select different tests for each family member and schedule sample collection in a single convenient home visit."
    },
    {
      q: "What should I do if I need to reschedule or cancel my appointment?",
      a: "You can reschedule or cancel anytime free of charge up to 2 hours before your scheduled slot. Call our 24/7 patient helpline at 1800 123 4567 or text us on WhatsApp."
    }
  ]

  return (
    <div className="w-full font-sans space-y-4 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href="/customer/dashboard" 
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Customer Help &amp; FAQs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Everything you need to know about diagnostic tests, home sample collection, and reports
          </p>
        </div>

        <a
          href="https://wa.me/919845012345?text=Hi%20AVMLabs%20Support,%20I%20need%20help%20with%20my%20test%20booking"
          target="_blank"
          rel="noreferrer"
          className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Patient Care</span>
        </a>
      </div>

      {/* 3 Quick Contact Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
            <Headphones className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Toll-Free Patient Care</div>
            <a href="tel:18001234567" className="text-sm font-bold text-blue-600 hover:underline">
              1800 123 4567
            </a>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Mon - Sun: 06:00 AM - 10:00 PM</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">WhatsApp Support</div>
            <a 
              href="https://wa.me/919845012345" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm font-bold text-emerald-700 hover:underline"
            >
              +91 98450 12345
            </a>
          </div>
          <div className="text-[11px] text-slate-500">
            Instant booking &amp; report status updates
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Email Customer Care</div>
            <a href="mailto:care@avmlabs.com" className="text-sm font-bold text-slate-700 hover:underline">
              care@avmlabs.com
            </a>
          </div>
          <div className="text-[11px] text-slate-500">
            Guaranteed response within 2 hours
          </div>
        </div>
      </div>

      {/* Patient FAQs Section */}
      <div className="space-y-2.5 pt-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quality & Safety Assurance Card */}
      <div className="p-4 rounded-2xl bg-[#1e293b] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">
              Advanced Clinical Pathology &amp; Diagnostics
            </div>
            <div className="text-[11px] text-slate-300">
              Calibrated automated analyzers with dual MD Pathologist verification on every release.
            </div>
          </div>
        </div>

        <Link
          href="/customer/dashboard"
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1 shrink-0 transition-colors"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>

    </div>
  )
}
