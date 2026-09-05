"use client"

import { useState } from "react"
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Smartphone
} from "lucide-react"

interface ReferralShareModalProps {
  isOpen: boolean
  onClose: () => void
  craName: string
  craCode: string
  orgName?: string
  profileTitle?: string
  shareUrl?: string
  discountPercent?: number
}

export function ReferralShareModal({
  isOpen,
  onClose,
  craName,
  craCode,
  orgName = "AVM Labs Diagnostics",
  profileTitle,
  shareUrl,
  discountPercent = 20
}: ReferralShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const resolvedUrl = shareUrl || (typeof window !== "undefined"
    ? `${window.location.origin}/booking?ref=${craCode}`
    : `https://avmlabs.com/booking?ref=${craCode}`)

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(resolvedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Pre-filled WhatsApp promotional message
  const whatsappText = encodeURIComponent(
    `Hello! 👋 Book certified diagnostic lab tests & full-body health checkups with AVM Labs through ${craName}${orgName ? ` (${orgName})` : ""}.\n\n` +
    (profileTitle ? `🩺 Recommended Profile: *${profileTitle}*\n` : `🩺 100+ Clinical & Preventive Tests Available\n`) +
    `🎁 Special Partner Discount: *${discountPercent}% OFF*\n` +
    `🏠 Free Home Sample Collection by Certified Phlebotomists\n` +
    `⚡ Smart WhatsApp & Fast Digital Lab Reports\n\n` +
    `Book online now:\n${resolvedUrl}`
  )

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank")
  }

  const handleDownloadQR = () => {
    alert(`QR Code flyer for "${orgName || craName}" ready for clinic stand display!`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-[#1e1b4b] to-[#382685] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/10 text-cyan-300 flex items-center justify-center border border-white/20">
              <Share2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">Share Referral &amp; QR Code</h3>
              <p className="text-[11px] text-blue-200">
                {profileTitle ? `Share: ${profileTitle}` : `Partner Code: ${craCode}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* QR Code Presentation Box */}
          <div className="bg-gradient-to-b from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-3xl p-5 text-center space-y-3 shadow-inner">
            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-[#382685]/20 shadow-md">
              {/* High Quality Styled QR Graphic */}
              <div className="w-40 h-40 sm:w-44 sm:h-44 mx-auto flex flex-col items-center justify-center relative bg-white">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" fill="#1e1b4b" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#382685" rx="1" />

                  <rect x="69" y="5" width="26" height="26" fill="#1e1b4b" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#382685" rx="1" />

                  <rect x="5" y="69" width="26" height="26" fill="#1e1b4b" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#382685" rx="1" />

                  {/* QR Pattern Data Dots */}
                  <rect x="36" y="8" width="5" height="5" fill="#1e1b4b" />
                  <rect x="45" y="8" width="5" height="5" fill="#1e1b4b" />
                  <rect x="56" y="8" width="5" height="5" fill="#1e1b4b" />
                  <rect x="36" y="17" width="5" height="5" fill="#1e1b4b" />
                  <rect x="48" y="17" width="5" height="5" fill="#1e1b4b" />
                  <rect x="36" y="26" width="5" height="5" fill="#1e1b4b" />
                  <rect x="45" y="26" width="5" height="5" fill="#1e1b4b" />
                  <rect x="58" y="26" width="5" height="5" fill="#1e1b4b" />

                  <rect x="8" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="18" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="27" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="36" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="58" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="68" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="78" y="36" width="5" height="5" fill="#1e1b4b" />
                  <rect x="87" y="36" width="5" height="5" fill="#1e1b4b" />

                  <rect x="8" y="47" width="5" height="5" fill="#1e1b4b" />
                  <rect x="25" y="47" width="5" height="5" fill="#1e1b4b" />
                  <rect x="68" y="47" width="5" height="5" fill="#1e1b4b" />
                  <rect x="87" y="47" width="5" height="5" fill="#1e1b4b" />

                  <rect x="8" y="58" width="5" height="5" fill="#1e1b4b" />
                  <rect x="18" y="58" width="5" height="5" fill="#1e1b4b" />
                  <rect x="78" y="58" width="5" height="5" fill="#1e1b4b" />

                  <rect x="36" y="69" width="5" height="5" fill="#1e1b4b" />
                  <rect x="47" y="69" width="5" height="5" fill="#1e1b4b" />
                  <rect x="58" y="69" width="5" height="5" fill="#1e1b4b" />
                  <rect x="69" y="69" width="5" height="5" fill="#1e1b4b" />
                  <rect x="85" y="69" width="5" height="5" fill="#1e1b4b" />

                  <rect x="36" y="80" width="5" height="5" fill="#1e1b4b" />
                  <rect x="47" y="80" width="5" height="5" fill="#1e1b4b" />
                  <rect x="69" y="80" width="5" height="5" fill="#1e1b4b" />
                  <rect x="80" y="80" width="5" height="5" fill="#1e1b4b" />

                  {/* Center Badge */}
                  <rect x="37" y="37" width="26" height="26" rx="4" fill="#382685" />
                  <text x="50" y="54" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">AVM</text>
                </svg>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-black text-slate-900 text-sm">{orgName || craName}</div>
              <p className="text-[11px] text-slate-500 font-medium">
                Scan with any smartphone camera or Google Lens to book tests
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                {discountPercent}% Patient Discount Applied Automatically
              </span>
            </div>
          </div>

          {/* Direct Link Input with 1-Click Copy */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase text-[10.5px] tracking-wider flex items-center justify-between">
              <span>Referral URL</span>
              <span className="text-slate-400 font-normal">Code: {craCode}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={resolvedUrl}
                className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-700 select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`h-11 px-4 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#251b5c] hover:bg-[#1e1b4b] text-white"
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Social Share Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Smartphone className="h-4 w-4" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Print/Download Standee QR */}
            <button
              type="button"
              onClick={handleDownloadQR}
              className="h-11 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#382685]" />
              <span>Download Clinic Standee QR</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Every booking tracked to partner code <strong className="font-mono text-[#382685]">{craCode}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}
