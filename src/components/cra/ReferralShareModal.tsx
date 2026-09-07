"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Smartphone,
  CheckCircle2,
  FileImage
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
  orgName = "",
  profileTitle,
  shareUrl,
  discountPercent = 20
}: ReferralShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(true)
  const [downloadingStandee, setDownloadingStandee] = useState<boolean>(false)
  const [downloadingPureQr, setDownloadingPureQr] = useState<boolean>(false)
  const [standeeDownloaded, setStandeeDownloaded] = useState<boolean>(false)

  const resolvedUrl = shareUrl || (typeof window !== "undefined"
    ? `${window.location.origin}/booking?ref=${craCode}`
    : `https://avmlabs.com/booking?ref=${craCode}`)

  // Generate real, scannable QR code on mount or URL change
  useEffect(() => {
    if (!isOpen) return
    let isSubscribed = true
    setIsGeneratingQr(true)

    QRCode.toDataURL(resolvedUrl, {
      width: 440,
      margin: 1.5,
      color: {
        dark: "#1e1b4b",
        light: "#ffffff"
      },
      errorCorrectionLevel: "H"
    })
      .then((url) => {
        if (isSubscribed) {
          setQrDataUrl(url)
          setIsGeneratingQr(false)
        }
      })
      .catch((err) => {
        console.error("QR generation error:", err)
        if (isSubscribed) setIsGeneratingQr(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [isOpen, resolvedUrl])

  if (!isOpen) return null

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(resolvedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Pre-filled WhatsApp promotional message
  const whatsappText = encodeURIComponent(
    `Hello! 👋 Book certified diagnostic lab tests & health checkups with AVM Labs through ${craName}${orgName ? ` (${orgName})` : ""}.\n\n` +
    (profileTitle ? `🩺 Recommended Profile: *${profileTitle}*\n` : `🩺 100+ Clinical & Preventive Tests Available\n`) +
    `🎁 Special Customer Discount: *${discountPercent}% OFF applied automatically*\n` +
    `🏠 Free Home Sample Collection by Certified Phlebotomists\n` +
    `⚡ Smart WhatsApp & Fast Digital Lab Reports\n\n` +
    `Scan or Book online here:\n${resolvedUrl}`
  )

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank")
  }

  // Pure QR code image download (PNG)
  const handleDownloadPureQR = () => {
    if (!qrDataUrl) return
    setDownloadingPureQr(true)
    const link = document.createElement("a")
    link.download = `AVMLabs_QR_${craCode}.png`
    link.href = qrDataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => setDownloadingPureQr(false), 1200)
  }

  // High-Resolution 1200x1600 Standee Graphic Download
  const handleDownloadStandee = async () => {
    if (!qrDataUrl) return
    setDownloadingStandee(true)

    try {
      // 1. Create a high-DPI off-screen Canvas
      const width = 1200
      const height = 1600
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas 2D context not available")

      // Background - clean white
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Outer border frame
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 12
      ctx.strokeRect(24, 24, width - 48, height - 48)

      // Top Hero Banner Header
      const headerGrad = ctx.createLinearGradient(0, 24, width, 320)
      headerGrad.addColorStop(0, "#1e1b4b")
      headerGrad.addColorStop(0.5, "#2e1065")
      headerGrad.addColorStop(1, "#3b0764")
      ctx.fillStyle = headerGrad
      ctx.fillRect(24, 24, width - 48, 280)

      // Top Brand Text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 44px 'Segoe UI', Roboto, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("AVM LABS DIAGNOSTICS", width / 2, 105)

      ctx.fillStyle = "#67e8f9"
      ctx.font = "bold 20px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("WELLNESS LABORATORY  •  HORMONES  •  VITAMINS  •  WELLNESS", width / 2, 150)

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
      ctx.font = "500 20px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("Certified Partner Diagnostic Collection Center", width / 2, 230)

      // Center Clinic / Partner Card
      ctx.fillStyle = "#f8fafc"
      ctx.beginPath()
      ctx.roundRect(80, 335, width - 160, 150, 24)
      ctx.fill()
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 3
      ctx.stroke()

      const displayName = orgName || craName
      ctx.fillStyle = "#1e1b4b"
      ctx.font = "bold 38px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText(displayName, width / 2, 400)

      if (profileTitle) {
        ctx.fillStyle = "#4338ca"
        ctx.font = "600 22px 'Segoe UI', Roboto, sans-serif"
        ctx.fillText(`Featured: ${profileTitle}`, width / 2, 445)
      } else {
        ctx.fillStyle = "#64748b"
        ctx.font = "500 22px 'Segoe UI', Roboto, sans-serif"
        ctx.fillText(`Partner CRA: ${craName}  •  Code: ${craCode}`, width / 2, 445)
      }

      // Instruction heading above QR
      ctx.fillStyle = "#0f172a"
      ctx.font = "bold 30px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("SCAN WITH ANY PHONE CAMERA TO BOOK TESTS", width / 2, 545)

      ctx.fillStyle = "#64748b"
      ctx.font = "500 21px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("Works with iPhone Camera, Google Lens & Android QR Scanner", width / 2, 580)

      // QR Code Drawing
      const qrImg = new Image()
      qrImg.crossOrigin = "anonymous"
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve()
        qrImg.onerror = reject
        qrImg.src = qrDataUrl
      })

      // QR White Container Box with Shadow
      const qrBoxSize = 520
      const qrBoxX = (width - qrBoxSize) / 2
      const qrBoxY = 620

      ctx.fillStyle = "#ffffff"
      ctx.shadowColor = "rgba(0, 0, 0, 0.12)"
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 10
      ctx.beginPath()
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28)
      ctx.fill()
      ctx.strokeStyle = "#e0e7ff"
      ctx.lineWidth = 4
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // Draw QR inside
      const qrInnerPadding = 25
      ctx.drawImage(
        qrImg,
        qrBoxX + qrInnerPadding,
        qrBoxY + qrInnerPadding,
        qrBoxSize - qrInnerPadding * 2,
        qrBoxSize - qrInnerPadding * 2
      )

      // Central AVM Badge inside QR code
      const centerBadgeSize = 80
      const centerBadgeX = (width - centerBadgeSize) / 2
      const centerBadgeY = qrBoxY + (qrBoxSize - centerBadgeSize) / 2
      ctx.fillStyle = "#1e1b4b"
      ctx.beginPath()
      ctx.roundRect(centerBadgeX, centerBadgeY, centerBadgeSize, centerBadgeSize, 14)
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 24px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("AVM", width / 2, centerBadgeY + 50)

      // 20% DISCOUNT BANNER
      const discountY = 1180
      ctx.fillStyle = "#ecfdf5"
      ctx.beginPath()
      ctx.roundRect(90, discountY, width - 180, 85, 20)
      ctx.fill()
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.fillStyle = "#065f46"
      ctx.font = "bold 32px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText(`🎁  ${discountPercent}% PATIENT DISCOUNT APPLIED AUTOMATICALLY  🎁`, width / 2, discountY + 54)

      // 4 Service Highlights Icons / Bullets
      const perks = [
        "✓ 100+ Certified Blood Tests & Preventive Health Panels",
        "✓ Free Home Sample Collection by Certified Phlebotomists",
        "✓ NABL & ICMR Standard Certified Lab Processing",
        "✓ Smart Digital Reports on WhatsApp within 24 Hours"
      ]

      ctx.textAlign = "left"
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 23px 'Segoe UI', Roboto, sans-serif"
      perks.forEach((perk, index) => {
        const col = index % 2
        const row = Math.floor(index / 2)
        const px = col === 0 ? 110 : 640
        const py = 1310 + row * 55
        ctx.fillText(perk, px, py)
      })

      // Bottom Footer Bar
      const footerY = 1460
      ctx.fillStyle = "#f1f5f9"
      ctx.fillRect(24, footerY, width - 48, 116)

      ctx.textAlign = "center"
      ctx.fillStyle = "#0f172a"
      ctx.font = "bold 20px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText(`Partner Referral Code: ${craCode}   •   Booking Link: ${resolvedUrl}`, width / 2, footerY + 45)

      ctx.fillStyle = "#64748b"
      ctx.font = "500 18px 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("Powered by AVM Labs Diagnostics   •   Patient Helpline & Support: +91 98450 12345", width / 2, footerY + 80)

      // Download triggered
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `AVMLabs_Clinic_Standee_${craCode}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setStandeeDownloaded(true)
      setTimeout(() => setStandeeDownloaded(false), 3000)
    } catch (err) {
      console.error("Standee generator error:", err)
      alert("Failed to create standee image. Downloading direct QR code instead.")
      handleDownloadPureQR()
    } finally {
      setDownloadingStandee(false)
    }
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
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body with INVISIBLE SCROLLBAR */}
        <div className="p-4 sm:p-6 overflow-y-auto scrollbar-hide space-y-5 text-xs">
          
          {/* Real QR Code Presentation Box */}
          <div className="bg-gradient-to-b from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-3xl p-5 text-center space-y-3 shadow-inner">
            <div className="inline-block p-3.5 bg-white rounded-2xl border-2 border-[#382685]/20 shadow-md relative group">
              {isGeneratingQr ? (
                <div className="w-44 h-44 sm:w-48 sm:h-48 mx-auto flex flex-col items-center justify-center text-slate-400 gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1e1b4b] border-t-transparent" />
                  <span className="text-[11px] font-medium">Generating scannable QR...</span>
                </div>
              ) : qrDataUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`Real QR Code for ${craCode}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 mx-auto block rounded-lg select-none"
                  />
                  {/* Central AVM Brand Badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 bg-[#1e1b4b] text-white rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm border-2 border-white pointer-events-none">
                    AVM
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-slate-500 font-medium">
                Real scannable QR code • Scans with any smartphone camera or Google Lens
              </p>
            </div>
          </div>

          {/* Direct Link Input with 1-Click Copy */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase text-[10.5px] tracking-wider flex items-center justify-between">
              <span>Referral URL</span>
              <span className="text-slate-400 font-mono font-medium">Code: {craCode}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={resolvedUrl}
                className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-700 select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`h-11 px-4 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 ${
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

          {/* Download Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Smartphone className="h-4 w-4" />
                <span>Share on WhatsApp</span>
              </button>

              {/* Working High-Res Standee Download */}
              <button
                type="button"
                onClick={handleDownloadStandee}
                disabled={downloadingStandee || !qrDataUrl}
                className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border ${
                  standeeDownloaded
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-[#1e1b4b] hover:bg-[#131135] border-[#1e1b4b] text-white"
                }`}
              >
                {downloadingStandee ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                    <span>Generating Standee...</span>
                  </>
                ) : standeeDownloaded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Standee Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-cyan-300" />
                    <span>Download Clinic Standee QR</span>
                  </>
                )}
              </button>
            </div>

            {/* Pure QR Download Link */}
            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={handleDownloadPureQR}
                disabled={downloadingPureQr || !qrDataUrl}
                className="text-[11px] text-slate-500 hover:text-[#1e1b4b] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:underline"
              >
                <FileImage className="h-3.5 w-3.5 text-slate-400" />
                <span>{downloadingPureQr ? "Downloading QR image..." : "Need pure QR image only? Download QR PNG"}</span>
              </button>
            </div>
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
