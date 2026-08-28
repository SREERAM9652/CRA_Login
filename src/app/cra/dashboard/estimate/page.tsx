"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CRA_TESTS, CRATestItem } from "@/lib/cra-tests"
import Link from "next/link"
import { 
  Printer, 
  Share2, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Building2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  IndianRupee, 
  X, 
  Upload, 
  UserPlus, 
  ShieldCheck, 
  Loader2,
  Edit3,
  Search,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react"

function EstimateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [selectedTests, setSelectedTests] = useState<CRATestItem[]>([])
  const [isCustomerCopy, setIsCustomerCopy] = useState(true)
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false)
  const [testSearchQuery, setTestSearchQuery] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit")

  // Custom Clinic Branding
  const [branding, setBranding] = useState({
    logo: "",
    clinicName: "",
    phone: "",
    address: "",
    doctorName: ""
  })
  const [tempBranding, setTempBranding] = useState({
    logo: "",
    clinicName: "",
    phone: "",
    address: "",
    doctorName: ""
  })

  // Patient Details
  const [patientDetails, setPatientDetails] = useState({
    name: "Ms. Priya Sharma",
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com",
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  })

  useEffect(() => {
    // Load branding from localStorage
    const saved = localStorage.getItem("craBranding")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setBranding(parsed)
        setTempBranding(parsed)
      } catch (e) {
        console.error("Failed to load branding", e)
      }
    }

    // Load tests from URL query params
    const testsParam = searchParams.get("tests")
    if (testsParam) {
      const codes = testsParam.split(",").map(c => c.trim().toUpperCase())
      const foundTests = codes
        .map(code => CRA_TESTS.find(t => t.code.toUpperCase() === code))
        .filter((t): t is CRATestItem => Boolean(t))
      
      if (foundTests.length > 0) {
        setSelectedTests(foundTests)
        return
      }
    }

    // Default selection if none provided
    if (selectedTests.length === 0) {
      const defaults = ["CUA", "H6", "TSH", "VITDC"]
        .map(code => CRA_TESTS.find(t => t.code === code))
        .filter((t): t is CRATestItem => Boolean(t))
      setSelectedTests(defaults)
    }
  }, [searchParams])

  const saveBranding = () => {
    try {
      localStorage.setItem("craBranding", JSON.stringify(tempBranding))
    } catch (e) {
      console.error("Failed to save branding to localStorage", e)
    }
    setBranding(tempBranding)
    setIsBrandingModalOpen(false)
  }

  const removeTest = (code: string) => {
    setSelectedTests(prev => prev.filter(t => t.code !== code))
  }

  const addTest = (test: CRATestItem) => {
    if (!selectedTests.some(t => t.code === test.code)) {
      setSelectedTests(prev => [...prev, test])
    }
  }

  // Calculations
  const totalCatalogue = selectedTests.reduce((sum, test) => sum + (test.catalogueRate || 0), 0)
  const totalDiscount = Math.round(totalCatalogue * 0.2) // 20% Catalogue Discount
  const totalRR = totalCatalogue - totalDiscount
  const totalC1 = Math.round(totalRR * 0.3) // 30% Direct Incentive
  const totalC2 = Math.round(totalRR * 0.1) // 10% Team Override Bonus
  const netCompanyShare = totalRR - totalC1 - totalC2
  const selectedCodesString = selectedTests.map(t => t.code).join(",")

  // Export to Formatted Excel (.xls)
  const handleExportCSV = () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test to export.")
      return
    }

    const colCount = isCustomerCopy ? 8 : 9

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>AVMLabs Quotation</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                  <x:DoNotDisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 10.5pt; color: #1e293b; margin: 0; padding: 0; }
          table { border-collapse: collapse; table-layout: fixed; }
          .header-banner { background-color: #251b5c; color: #ffffff; font-size: 14pt; font-weight: bold; text-align: center; height: 38px; vertical-align: middle; white-space: nowrap; }
          .sub-banner { background-color: #382685; color: #e0e7ff; font-size: 10pt; font-weight: bold; text-align: center; height: 22px; vertical-align: middle; white-space: nowrap; }
          .meta-title { background-color: #f1f5f9; color: #334155; font-weight: bold; font-size: 9.5pt; border: 1px solid #cbd5e1; padding: 4px 8px; white-space: nowrap; }
          .meta-val { background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 4px 8px; white-space: nowrap; }
          .th-head { background-color: #1e1b4b; color: #ffffff; font-weight: bold; font-size: 10pt; text-align: center; border: 1px solid #0f172a; height: 28px; vertical-align: middle; white-space: nowrap; }
          .td-num { text-align: center; border: 1px solid #e2e8f0; vertical-align: middle; white-space: nowrap; }
          .td-code { text-align: center; font-weight: bold; color: #382685; background-color: #faf5ff; border: 1px solid #e2e8f0; vertical-align: middle; font-family: monospace; white-space: nowrap; }
          .td-name { font-weight: bold; color: #0f172a; border: 1px solid #e2e8f0; vertical-align: middle; padding-left: 8px; }
          .td-cat { color: #475569; border: 1px solid #e2e8f0; vertical-align: middle; padding-left: 6px; white-space: nowrap; }
          .td-money { text-align: right; color: #64748b; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; white-space: nowrap; }
          .td-money-disc { text-align: right; color: #059669; font-weight: bold; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; white-space: nowrap; }
          .td-money-final { text-align: right; color: #1e1b4b; font-weight: bold; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; background-color: #f8fafc; white-space: nowrap; }
          .td-money-earning { text-align: right; color: #047857; font-weight: bold; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; background-color: #ecfdf5; white-space: nowrap; }
          .td-money-bonus { text-align: right; color: #6b21a8; font-weight: bold; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; background-color: #faf5ff; white-space: nowrap; }
          .total-label { text-align: right; padding-right: 12px; font-weight: bold; font-size: 10.5pt; color: #1e293b; background-color: #f8fafc; border: 1px solid #cbd5e1; white-space: nowrap; }
          .total-val { text-align: right; padding-right: 8px; font-weight: bold; font-size: 10.5pt; border: 1px solid #cbd5e1; white-space: nowrap; }
          .grand-label { text-align: right; padding-right: 12px; font-weight: bold; font-size: 11pt; color: #065f46; background-color: #ecfdf5; border: 1px solid #059669; white-space: nowrap; }
          .grand-val { text-align: right; padding-right: 12px; font-weight: bold; font-size: 12pt; color: #065f46; background-color: #ecfdf5; border: 1px solid #059669; white-space: nowrap; }
          .footer-note { font-size: 9pt; color: #64748b; font-style: italic; border: none; white-space: normal; padding-top: 4px; }
        </style>
      </head>
      <body>
        <table>
          <!-- Explicit Column Widths for Excel -->
          <colgroup>
            <col width="45" style="width:34pt">
            <col width="90" style="width:68pt">
            <col width="280" style="width:210pt">
            <col width="170" style="width:128pt">
            <col width="130" style="width:98pt">
            <col width="110" style="width:82pt">
            ${
              isCustomerCopy
                ? `<col width="140" style="width:105pt"><col width="140" style="width:105pt">`
                : `<col width="140" style="width:105pt"><col width="150" style="width:112pt"><col width="130" style="width:98pt">`
            }
          </colgroup>

          <!-- Header Banner -->
          <tr>
            <td colspan="${colCount}" class="header-banner">
              AVMLABS CENTRAL REFERENCE DIAGNOSTICS NETWORK
            </td>
          </tr>
          <tr>
            <td colspan="${colCount}" class="sub-banner">
              ${branding.clinicName || "Prestige Tech Cloud, Bengaluru - 562110 • Helpline: +91 80 4912 8800"}
            </td>
          </tr>
          <tr><td colspan="${colCount}" style="height:8px;"></td></tr>

          <!-- Metadata Section (Clean 2-Column Pairs: A+B, C+D, E+F, G+H) -->
          <tr>
            <td colspan="2" class="meta-title">Patient Name:</td>
            <td colspan="2" class="meta-val" style="font-weight:bold;">${patientDetails.name}</td>
            <td colspan="2" class="meta-title">Quotation Type:</td>
            <td colspan="${colCount - 6}" class="meta-val" style="font-weight:bold;color:#382685;">${isCustomerCopy ? "Patient Quotation (20% Off)" : "Partner Commercial Estimate"}</td>
          </tr>
          <tr>
            <td colspan="2" class="meta-title">Phone Number:</td>
            <td colspan="2" class="meta-val">${patientDetails.phone}</td>
            <td colspan="2" class="meta-title">Date:</td>
            <td colspan="${colCount - 6}" class="meta-val">${patientDetails.date}</td>
          </tr>
          <tr>
            <td colspan="2" class="meta-title">Email Address:</td>
            <td colspan="2" class="meta-val">${patientDetails.email}</td>
            <td colspan="2" class="meta-title">Sample Collection:</td>
            <td colspan="${colCount - 6}" class="meta-val" style="color:#059669;font-weight:bold;">Free Home Sample Pickup (100% Barcoded Safety)</td>
          </tr>
          <tr><td colspan="${colCount}" style="height:8px;"></td></tr>

          <!-- Table Header Row -->
          <tr>
            <th class="th-head">#</th>
            <th class="th-head">Test Code</th>
            <th class="th-head" style="text-align:left;padding-left:8px;">Medical Test Name</th>
            <th class="th-head" style="text-align:left;padding-left:8px;">Technology</th>
            <th class="th-head" style="text-align:left;padding-left:8px;">Sample Type</th>
            <th class="th-head" style="text-align:right;padding-right:8px;">MRP (₹)</th>
            ${
              isCustomerCopy
                ? `<th class="th-head" style="text-align:right;padding-right:8px;">Discount 20% (₹)</th>
                   <th class="th-head" style="text-align:right;padding-right:8px;">Final Price (₹)</th>`
                : `<th class="th-head" style="text-align:right;padding-right:8px;">Customer Price (₹)</th>
                   <th class="th-head" style="text-align:right;padding-right:8px;">Your Earning 30% (₹)</th>
                   <th class="th-head" style="text-align:right;padding-right:8px;">Team Bonus 10% (₹)</th>`
            }
          </tr>

          <!-- Table Data Rows -->
          ${selectedTests.map((t, idx) => {
            const disc = Math.round(t.catalogueRate * 0.2)
            const rr = t.catalogueRate - disc
            const c1 = Math.round(rr * 0.3)
            const c2 = Math.round(rr * 0.1)
            const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc"

            return `
              <tr style="background-color:${rowBg};height:26px;">
                <td class="td-num">${idx + 1}</td>
                <td class="td-code">${t.code}</td>
                <td class="td-name">${t.name}</td>
                <td class="td-cat">${t.technology}</td>
                <td class="td-cat">${t.sample}</td>
                <td class="td-money">₹ ${t.catalogueRate}</td>
                ${
                  isCustomerCopy
                    ? `<td class="td-money-disc">- ₹ ${disc}</td>
                       <td class="td-money-final">₹ ${rr}</td>`
                    : `<td class="td-money-final">₹ ${rr}</td>
                       <td class="td-money-earning">+ ₹ ${c1}</td>
                       <td class="td-money-bonus">+ ₹ ${c2}</td>`
                }
              </tr>
            `
          }).join("")}

          <!-- Commercial Summary Rows -->
          <tr style="height:28px;">
            <td colspan="5" class="total-label">TOTAL MRP (${selectedTests.length} Items):</td>
            <td class="total-val">₹ ${totalCatalogue.toLocaleString()}</td>
            ${
              isCustomerCopy
                ? `<td class="total-val" style="color:#059669;">- ₹ ${totalDiscount.toLocaleString()}</td>
                   <td class="total-val" style="color:#1e1b4b;font-weight:bold;">₹ ${totalRR.toLocaleString()}</td>`
                : `<td class="total-val">₹ ${totalRR.toLocaleString()}</td>
                   <td class="total-val" style="color:#047857;">+ ₹ ${totalC1.toLocaleString()}</td>
                   <td class="total-val" style="color:#6b21a8;">+ ₹ ${totalC2.toLocaleString()}</td>`
            }
          </tr>

          <!-- Highlighted Final Amount Row -->
          <tr style="height:32px;">
            <td colspan="5" class="grand-label">FINAL AMOUNT PAYABLE (20% OFF + FREE HOME PICKUP):</td>
            <td colspan="${colCount - 5}" class="grand-val">₹ ${totalRR.toLocaleString()}</td>
          </tr>

          ${
            !isCustomerCopy
              ? `
              <tr><td colspan="${colCount}" style="height:8px;"></td></tr>
              <tr style="height:26px;">
                <td colspan="${colCount}" style="background-color:#382685;color:#ffffff;font-weight:bold;text-align:center;font-size:10pt;letter-spacing:1px;white-space:nowrap;border:1px solid #251b5c;">
                  PARTNER COMMISSION BREAKDOWN
                </td>
              </tr>
              <tr style="height:26px;">
                <td colspan="5" class="total-label">Realized Revenue (RR):</td>
                <td colspan="${colCount - 5}" class="total-val" style="color:#1e293b;font-weight:bold;text-align:right;padding-right:12px;">₹ ${totalRR.toLocaleString()}</td>
              </tr>
              <tr style="height:26px;background-color:#ecfdf5;">
                <td colspan="5" class="total-label" style="color:#047857;background-color:#ecfdf5;">Direct Earning (30%):</td>
                <td colspan="${colCount - 5}" class="total-val" style="color:#047857;font-size:11pt;font-weight:bold;background-color:#ecfdf5;text-align:right;padding-right:12px;">+ ₹ ${totalC1.toLocaleString()}</td>
              </tr>
              <tr style="height:26px;background-color:#faf5ff;">
                <td colspan="5" class="total-label" style="color:#6b21a8;background-color:#faf5ff;">Team Bonus (10%):</td>
                <td colspan="${colCount - 5}" class="total-val" style="color:#6b21a8;font-size:11pt;font-weight:bold;background-color:#faf5ff;text-align:right;padding-right:12px;">+ ₹ ${totalC2.toLocaleString()}</td>
              </tr>
              <tr style="height:28px;background-color:#ffffff;">
                <td colspan="5" class="total-label" style="color:#1e1b4b;font-weight:bold;background-color:#ffffff;border:2px solid #cbd5e1;">Net Lab Share:</td>
                <td colspan="${colCount - 5}" class="total-val" style="color:#1e1b4b;font-weight:bold;font-size:11.5pt;background-color:#ffffff;border:2px solid #cbd5e1;text-align:right;padding-right:12px;">₹ ${netCompanyShare.toLocaleString()}</td>
              </tr>
              `
              : ""
          }

          <tr><td colspan="${colCount}" style="height:10px;"></td></tr>
          <!-- Footer Notes -->
          <tr>
            <td colspan="${colCount}" class="footer-note">
              * Important Note: This is an official estimated price quote from AVMLabs Central Reference Diagnostics Network. All tests include free home sample pickup with 100% barcoded safety protocols. Rates in INR (₹). Fasting instructions apply where applicable.
            </td>
          </tr>
          <tr>
            <td colspan="${colCount}" class="footer-note">
              * Contact Helpline: 1800 123 4567 • Email: info@avmlabs.com • Website: www.avmlabs.com
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `AVMLabs_Quotation_${patientDetails.name.replace(/\s+/g, "_")}.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Copy WhatsApp Quotation
  const handleCopyQuote = () => {
    const listText = selectedTests.map((t, i) => `${i + 1}. *${t.name}* (${t.code}) - MRP: ₹${t.catalogueRate} ➔ *₹${t.realizedRevenue}*`).join("\n")
    const fullText = `*AVMLabs Health Diagnostics Quotation*\n` +
      `👤 Patient: *${patientDetails.name}*\n` +
      `📅 Date: ${patientDetails.date}\n\n` +
      `📋 *Recommended Tests (${selectedTests.length} Items):*\n${listText}\n\n` +
      `💰 *Total MRP:* ₹${totalCatalogue}\n` +
      `🏷️ *20% Special Discount:* -₹${totalDiscount}\n` +
      `✅ *Final Amount Payable:* *₹${totalRR}*\n\n` +
      `🚚 Includes Free Home Sample Collection (100% Barcoded Safety).\n` +
      `📞 Book via AVMLabs Partner: +91 80 4912 8800`

    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // PDF Generation & Share
  const handleSharePDF = async () => {
    try {
      setIsGeneratingPDF(true)
      const { toJpeg } = await import("html-to-image")
      const { jsPDF } = await import("jspdf")
      const element = document.getElementById("printable-area")

      if (!element) {
        throw new Error("Printable area not found")
      }

      const dataUrl = await toJpeg(element, {
        quality: 0.98,
        backgroundColor: "#ffffff",
        pixelRatio: 2
      })

      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth

      pdf.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight)
      const pdfBlob = pdf.output("blob")
      const file = new File([pdfBlob], `AVMLabs_Estimate_${patientDetails.name.replace(/\s+/g, "_")}.pdf`, { type: "application/pdf" })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Diagnostic Estimate - ${patientDetails.name}`,
          text: `Here is the official AVMLabs pricing estimate for ${patientDetails.name}.`,
        })
      } else {
        const url = URL.createObjectURL(pdfBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = `AVMLabs_Estimate_${patientDetails.name.replace(/\s+/g, "_")}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error generating or sharing PDF:", error)
      alert("Opening native print dialog...")
      window.print()
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const popularQuickTests = [
    { code: "CUA", name: "Urine Routine" },
    { code: "H6", name: "Hemogram (CBC)" },
    { code: "TSH", name: "Thyroid (TSH)" },
    { code: "HBA", name: "HbA1c Diabetes" },
    { code: "VITDC", name: "Vitamin D" },
    { code: "LFT", name: "Liver Profile" },
    { code: "KFT", name: "Kidney Profile" },
    { code: "LIPID", name: "Lipid Profile" }
  ]

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Print Specific CSS Rules */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible !important;
          }
          #printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 100vh !important;
            background: white !important;
          }
          .print-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* PAGE HEADER & TOP ACTION TOOLBAR (SINGLE CLEAN ROW)                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-bold uppercase tracking-wider mb-1.5 border border-purple-200/80">
            <Sparkles className="h-3.5 w-3.5 text-[#382685]" /> Quotation &amp; Bill Estimator
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#1e1b4b]">
            Quotation &amp; Price Estimator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mt-0.5">
            Add tests, preview the patient bill in real time, and download Excel, PDF, or print.
          </p>
        </div>

        {/* Global Action Buttons - Responsive Wrap on Mobile, Clean Single Row on Desktop */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Customer Copy / Partner View Switch */}
          <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none bg-white h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors shrink-0">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isCustomerCopy}
                onChange={() => setIsCustomerCopy(!isCustomerCopy)}
              />
              <div className={`block w-7 h-4 rounded-full transition-colors ${isCustomerCopy ? "bg-emerald-500" : "bg-slate-300"}`} />
              <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${isCustomerCopy ? "translate-x-3" : ""}`} />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 whitespace-nowrap">
              {isCustomerCopy ? "Customer Copy" : "Partner View"}
            </span>
          </label>

          <button
            onClick={handleCopyQuote}
            className="h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Copy Quote for WhatsApp"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Export Excel (CSV)"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>

          <button
            onClick={handleSharePDF}
            disabled={isGeneratingPDF}
            className="h-8.5 sm:h-9 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
            title="Download / Share PDF"
          >
            {isGeneratingPDF ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="h-8.5 sm:h-9 px-3 sm:px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
            title="Print Document"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE-ONLY TAB SWITCHER: FORM EDIT VS LIVE PREVIEW                        */}
      {/* ========================================================================= */}
      <div className="xl:hidden flex rounded-2xl bg-slate-200/80 p-1 no-print shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveMobileTab("edit")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMobileTab === "edit"
              ? "bg-white text-[#1e1b4b] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Edit3 className="h-3.5 w-3.5 text-[#382685]" />
          <span>Edit Bill &amp; Tests ({selectedTests.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMobileTab === "preview"
              ? "bg-[#251b5c] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-cyan-300" />
          <span>Live Bill Preview (₹{totalRR.toLocaleString()})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN BALANCED WORKSPACE GRID (NO EMPTY GAPS)                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: INTERACTIVE CONTROLS & TEST PICKER (5 COLS ON XL)          */}
        {/* ======================================================================= */}
        <div className={`xl:col-span-5 space-y-5 no-print ${activeMobileTab === "preview" ? "hidden xl:block" : "block"}`}>
          
          {/* Card 1: Custom Clinic / Doctor Branding */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#382685]">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinic Details</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Shown on the bill letterhead</p>
                </div>
              </div>

              <button
                onClick={() => setIsBrandingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#382685] font-bold text-xs border border-purple-200/80 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{branding.clinicName ? "Edit" : "+ Add"}</span>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="font-bold text-slate-800 break-words">
                {branding.clinicName || "AVMLabs Central Reference Laboratory (Default)"}
              </div>
              {branding.doctorName && (
                <div className="text-[11px] text-[#382685] font-bold mt-0.5">{branding.doctorName}</div>
              )}
              <div className="text-[11px] text-slate-500 break-words mt-0.5">
                {branding.address || "Prestige Tech Cloud, Bengaluru"} {branding.phone ? `• ${branding.phone}` : "• +91 80 4912 8800"}
              </div>
            </div>
          </div>

          {/* Card 2: Patient Information Inputs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#251b5c]">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Details</h3>
                <p className="text-[11px] text-slate-500 font-medium">Updates live on the bill</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Patient Name</label>
                <input
                  type="text"
                  value={patientDetails.name}
                  onChange={e => setPatientDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#382685]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Phone Number</label>
                <input
                  type="text"
                  value={patientDetails.phone}
                  onChange={e => setPatientDetails(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#382685]/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Email Address</label>
                <input
                  type="email"
                  value={patientDetails.email}
                  onChange={e => setPatientDetails(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#382685]/30"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Test Search & Selection */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#382685]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Tests</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedTests.length} tests added</p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Popular Add Chips */}
            <div className="space-y-1">
              <span className="text-[10.5px] font-extrabold uppercase text-slate-400">Quick Add:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularQuickTests.map(q => {
                  const testItem = CRA_TESTS.find(t => t.code === q.code)
                  if (!testItem) return null
                  const isAdded = selectedTests.some(t => t.code === q.code)

                  return (
                    <button
                      key={q.code}
                      type="button"
                      onClick={() => isAdded ? removeTest(q.code) : addTest(testItem)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? "bg-purple-100 text-[#382685] border border-purple-300 shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                      }`}
                    >
                      <span>{isAdded ? "✓" : "+"}</span>
                      <span>{q.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search Input across tests */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={testSearchQuery}
                onChange={e => setTestSearchQuery(e.target.value)}
                placeholder="Search by test name or code (e.g. CBC, Vitamin, Sugar)..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 text-slate-900"
              />
            </div>

            {/* Search Results Dropdown List */}
            {testSearchQuery.trim() && (
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl p-2 divide-y divide-slate-100 bg-slate-50/50">
                {CRA_TESTS.filter(t => 
                  t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
                  t.code.toLowerCase().includes(testSearchQuery.toLowerCase())
                ).slice(0, 8).map(test => {
                  const isSelected = selectedTests.some(t => t.code === test.code)
                  return (
                    <div key={test.code} className="py-2 flex items-center justify-between gap-2 px-2">
                      <div className="truncate">
                        <div className="font-bold text-slate-900 text-xs truncate">{test.name}</div>
                        <div className="text-[10px] text-slate-500">{test.code} • MRP: ₹{test.catalogueRate} • Price: ₹{test.realizedRevenue}</div>
                      </div>
                      <button
                        onClick={() => isSelected ? removeTest(test.code) : addTest(test)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          isSelected ? "bg-rose-50 text-rose-700" : "bg-[#251b5c] text-white"
                        }`}
                      >
                        {isSelected ? "Remove" : "+ Add"}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Selected Tests List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10.5px] font-extrabold uppercase text-slate-400">Selected Tests ({selectedTests.length}):</span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {selectedTests.map((test) => (
                  <div key={test.code} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#382685]">
                        {test.code}
                      </span>
                      <span className="font-bold text-slate-800 text-xs truncate">{test.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-slate-900 text-xs">₹{test.realizedRevenue}</span>
                      <button
                        onClick={() => removeTest(test.code)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Card 4: Live Bill Summary & Direct Order CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#251b5c] to-[#382685] text-white p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Bill Summary</span>
              <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded-full">{selectedTests.length} Tests</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-blue-200">
                <span>Total MRP:</span>
                <span className="font-bold text-white">₹{totalCatalogue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-bold">
                <span>Customer Discount (20% Off):</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-white/10">
                <span>Final Patient Price:</span>
                <span className="text-cyan-300 text-base font-black">₹{totalRR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold text-xs pt-1 border-t border-white/10">
                <span>Your Earning (30%):</span>
                <span>₹{totalC1.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setActiveMobileTab("preview")}
                className="xl:hidden w-full py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Eye className="h-4 w-4 text-cyan-300" />
                <span>View Live Printable Bill</span>
              </button>

              <Link
                href={`/cra/dashboard/add-lead?tests=${selectedCodesString}`}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Book Order for Patient</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: LIVE FULL-WIDTH PRINTABLE A4 QUOTATION PREVIEW (7 COLS)   */}
        {/* ======================================================================= */}
        <div className={`xl:col-span-7 w-full print:block ${activeMobileTab === "edit" ? "hidden xl:block" : "block"}`}>
          
          <div 
            id="printable-area" 
            className="bg-white w-full shadow-xl print:shadow-none flex flex-col justify-between relative overflow-hidden rounded-3xl print:rounded-none border border-slate-200/90 print:border-none min-h-[940px] sm:min-h-[1020px]"
          >
            {/* Top Gradient Header Bar */}
            <div className="h-3 w-full bg-gradient-to-r from-[#251b5c] via-[#382685] to-cyan-600 shrink-0" />

            <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              
              {/* Header Letterhead */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div className="flex-1 space-y-1">
                  {branding.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={branding.logo} alt="Clinic Logo" className="h-12 sm:h-14 w-auto object-contain mb-2" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/logo.jpg" alt="AVMLabs Diagnostics" className="h-11 sm:h-12 w-auto object-contain mix-blend-multiply mb-1" />
                  )}

                  {branding.clinicName ? (
                    <>
                      <h2 className="font-black text-[#1e1b4b] text-lg sm:text-xl tracking-tight leading-tight">
                        {branding.clinicName}
                      </h2>
                      {branding.doctorName && (
                        <p className="text-xs font-bold text-[#382685]">Attending: {branding.doctorName}</p>
                      )}
                      <p className="text-slate-500 text-[11px] font-medium max-w-sm">{branding.address}</p>
                      <p className="text-slate-500 text-[11px] font-medium">{branding.phone}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-slate-600 font-bold">
                        AVMLabs Central Reference Diagnostics Network
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Prestige Tech Cloud, Bengaluru - 562110 • Helpline: +91 80 4912 8800
                      </div>
                    </>
                  )}
                </div>

                <div className="text-right flex flex-col items-end space-y-1.5 shrink-0">
                  <span className="text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-purple-50 text-[#382685] border border-purple-200">
                    {isCustomerCopy ? "Test Price Quote" : "Partner Estimate"}
                  </span>
                  <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#382685]" />
                    <span>{patientDetails.date}</span>
                  </div>
                </div>
              </div>

              {/* Patient Details & Summary Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Patient Info Card */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#251b5c] font-bold text-[11px] uppercase tracking-wider">
                    <User className="h-3 w-3" />
                    <span>Patient Details</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-slate-900">{patientDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-semibold text-slate-800">{patientDetails.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">{patientDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Collection:</span>
                      <span className="font-bold text-emerald-700">Free Home Sample Pickup</span>
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 rounded-2xl p-3.5 border border-purple-200/80 flex flex-col justify-between space-y-1.5">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Total Tests:</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded border border-purple-200">{selectedTests.length} Items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Total MRP:</span>
                      <span className="font-bold text-slate-800">₹{totalCatalogue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-700 font-bold">
                      <span>Discount (20% Off):</span>
                      <span>- ₹{totalDiscount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-2 flex items-center justify-between border border-purple-200 shadow-xs">
                    <span className="text-xs font-bold text-[#251b5c]">Amount to Pay:</span>
                    <span className="text-lg font-black text-[#251b5c]">₹{totalRR.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Itemized Test Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#251b5c] flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Selected Medical Tests</span>
                  </h3>
                  <span className="text-[10.5px] text-slate-500 font-medium">100% Barcoded &amp; Safe</span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="px-3 py-2 w-8 text-center">#</th>
                        <th className="px-3 py-2">Test Name</th>
                        <th className="px-3 py-2 text-center">Code</th>
                        <th className="px-3 py-2">Sample / Technology</th>
                        <th className="px-3 py-2 text-right">MRP (₹)</th>
                        <th className="px-3 py-2 text-right">Price (20% Off)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTests.length > 0 ? (
                        selectedTests.map((test, index) => (
                          <tr key={test.code} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-3 py-2 text-center text-slate-400 font-bold">{index + 1}</td>
                            <td className="px-3 py-2">
                              <div className="font-bold text-slate-900 text-xs uppercase">{test.name}</div>
                              <div className="text-[10px] text-slate-500">{test.category}</div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="px-1.5 py-0.2 rounded bg-purple-50 text-[#382685] font-mono font-bold text-[9.5px] border border-purple-100">
                                {test.code}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-[10.5px] text-slate-600 font-medium">
                              {test.sample} • {test.technology}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-400 line-through font-semibold text-[11px]">
                              ₹{test.catalogueRate}
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-[#251b5c] text-xs">
                              ₹{test.realizedRevenue}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400 font-medium">
                            No tests selected. Add tests from the left panel.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial Summary Box */}
              <div className="space-y-2">
                <div className={`grid ${isCustomerCopy ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 gap-3"}`}>
                  
                  {/* Customer View */}
                  <div className="border-2 border-emerald-200 bg-emerald-50/40 rounded-2xl p-3.5 space-y-2">
                    <div className="text-[9.5px] font-bold text-emerald-800 uppercase tracking-widest text-center border-b border-emerald-200 pb-1">
                      Total Bill Summary
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-700 font-medium">
                        <span>Total MRP:</span>
                        <span>₹{totalCatalogue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Special 20% Discount:</span>
                        <span>- ₹{totalDiscount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-600 text-white rounded-xl p-2.5 flex justify-between items-center shadow-xs">
                      <div>
                        <div className="font-bold text-xs">Final Amount Payable</div>
                        <div className="text-[9.5px] text-emerald-100">Includes 20% discount &amp; free home sample pickup</div>
                      </div>
                      <div className="font-black text-lg sm:text-xl">₹{totalRR.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Internal Partner Breakdown */}
                  {!isCustomerCopy && (
                    <div className="border-2 border-purple-200 bg-purple-50/50 rounded-2xl p-3.5 space-y-2">
                      <div className="text-[9.5px] font-bold text-[#382685] uppercase tracking-widest text-center border-b border-purple-200 pb-1">
                        Partner Commission Breakdown
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-700 font-medium">
                          <span>Realized Revenue (RR):</span>
                          <span className="font-bold text-slate-900">₹{totalRR.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Direct Earning (30%):</span>
                          <span>+ ₹{totalC1.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-indigo-700 font-bold">
                          <span>Team Bonus (10%):</span>
                          <span>+ ₹{totalC2.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-white border border-purple-200 text-[#251b5c] rounded-xl p-2.5 flex justify-between items-center shadow-xs">
                        <div className="font-bold text-xs">Net Lab Share</div>
                        <div className="font-bold text-base">₹{netCompanyShare.toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Footer Notes & Signatory */}
              <div className="pt-3 border-t-2 border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-3 mt-auto">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-w-sm text-[10px] text-slate-500 space-y-0.5">
                  <span className="font-bold text-slate-800 block">Important Note</span>
                  <p className="leading-snug">
                    This is an estimated price quote. Rates in <strong>INR (₹)</strong>. Fasting and sample guidelines will be checked during sample pickup.
                  </p>
                </div>

                <div className="text-right px-2">
                  <div className="text-xs font-bold text-slate-900 mb-4">For AVMLabs Diagnostics</div>
                  <div className="text-[9.5px] text-slate-500 font-bold border-t border-slate-300 pt-0.5 w-28 text-center ml-auto">
                    Authorized Signatory
                  </div>
                </div>
              </div>

            </div>

            {/* Print Bottom Contact Bar */}
            <div className="bg-[#1e1b4b] px-6 py-2.5 flex justify-between items-center text-[9.5px] text-blue-200 font-medium mt-auto">
              <div className="flex items-center gap-3.5">
                <span>✉️ info@avmlabs.com</span>
                <span>🌐 www.avmlabs.com</span>
                <span>📞 1800 123 4567</span>
              </div>
              <div className="font-semibold text-blue-100 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-cyan-300" />
                <span>Accurate &amp; Confidential Diagnostics</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* BRANDING MODAL                                                            */}
      {/* ========================================================================= */}
      {isBrandingModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Clinic &amp; Doctor Details</h3>
                <p className="text-xs text-slate-500">Add your clinic logo and contact details to show on the quotation.</p>
              </div>
              <button onClick={() => setIsBrandingModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              {/* Logo Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden shrink-0">
                    {tempBranding.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tempBranding.logo} alt="Logo preview" className="w-full h-full object-contain" />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="px-3 py-1.5 bg-purple-50 text-[#382685] border border-purple-200 rounded-xl cursor-pointer font-bold text-xs hover:bg-purple-100 inline-block">
                      Choose Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setTempBranding(prev => ({ ...prev, logo: event.target?.result as string }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                    {tempBranding.logo && (
                      <button
                        onClick={() => setTempBranding(prev => ({ ...prev, logo: "" }))}
                        className="block text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic / Hospital Name</label>
                <input
                  type="text"
                  value={tempBranding.clinicName}
                  onChange={e => setTempBranding(prev => ({ ...prev, clinicName: e.target.value }))}
                  placeholder="e.g. City Health Clinic"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#382685]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={tempBranding.doctorName}
                  onChange={e => setTempBranding(prev => ({ ...prev, doctorName: e.target.value }))}
                  placeholder="e.g. Dr. Rajesh Sharma, MD"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#382685]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={tempBranding.phone}
                  onChange={e => setTempBranding(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#382685]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <textarea
                  value={tempBranding.address}
                  onChange={e => setTempBranding(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. 12 MG Road, Bengaluru"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#382685]/30 resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  const empty = { logo: "", clinicName: "", phone: "", address: "", doctorName: "" }
                  setTempBranding(empty)
                  setBranding(empty)
                  localStorage.removeItem("craBranding")
                  setIsBrandingModalOpen(false)
                }}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Reset Default
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsBrandingModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBranding}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-[#251b5c] text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function EstimatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-xs">Loading estimate...</div>}>
      <EstimateContent />
    </Suspense>
  )
}
