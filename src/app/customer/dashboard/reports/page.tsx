"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  CustomerLabReport, 
  MOCK_CUSTOMER_REPORTS, 
  LabTestParameter 
} from "@/lib/customer-portal-data"
import {
  FileText,
  Download,
  Search,
  Calendar,
  User,
  Users,
  Filter,
  CheckCircle2,
  QrCode,
  Share2,
  Printer,
  ChevronRight,
  ExternalLink,
  ArrowUpDown,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Info,
  X,
  Clock,
  ArrowRight,
  Check
} from "lucide-react"

export default function CustomerLabReportsPage() {
  const router = useRouter()

  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<string>("all")
  const [dateFilterMode, setDateFilterMode] = useState<"all" | "7days" | "30days" | "90days" | "custom">("all")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const [selectedReportModal, setSelectedReportModal] = useState<CustomerLabReport | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const patientList = useMemo(() => {
    const list = new Set<string>()
    MOCK_CUSTOMER_REPORTS.forEach(r => list.add(`${r.patientName} (${r.patientRelation})`))
    return Array.from(list)
  }, [])

  const filteredReports = useMemo(() => {
    return MOCK_CUSTOMER_REPORTS.filter((report) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesSearch = 
          report.testTitle.toLowerCase().includes(q) ||
          report.id.toLowerCase().includes(q) ||
          report.orderNumber.toLowerCase().includes(q) ||
          report.patientName.toLowerCase().includes(q) ||
          report.labDoctor.toLowerCase().includes(q) ||
          report.category.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }

      if (selectedPatient !== "all") {
        const patientTag = `${report.patientName} (${report.patientRelation})`
        if (patientTag !== selectedPatient) return false
      }

      if (dateFilterMode !== "all") {
        const reportDate = new Date(report.date).getTime()
        const now = new Date("2026-09-05").getTime()
        const dayMs = 24 * 60 * 60 * 1000

        if (dateFilterMode === "7days") {
          if (now - reportDate > 7 * dayMs) return false
        } else if (dateFilterMode === "30days") {
          if (now - reportDate > 30 * dayMs) return false
        } else if (dateFilterMode === "90days") {
          if (now - reportDate > 90 * dayMs) return false
        } else if (dateFilterMode === "custom") {
          if (customStartDate && new Date(report.date) < new Date(customStartDate)) return false
          if (customEndDate && new Date(report.date) > new Date(customEndDate)) return false
        }
      }

      return true
    })
  }, [searchQuery, selectedPatient, dateFilterMode, customStartDate, customEndDate])

  const handleDownloadReport = (report: CustomerLabReport) => {
    setDownloadingId(report.id)
    setTimeout(() => {
      setDownloadingId(null)
      const blobContent = `
============================================================
              AVMLABS CLINICAL DIAGNOSTICS
        CENTRAL REFERENCE LABORATORY & DIAGNOSTICS
============================================================
REPORT ID       : ${report.id}
ORDER NO        : ${report.orderNumber}
PATIENT NAME    : ${report.patientName} (${report.patientRelation})
AGE / GENDER    : ${report.patientAge} Yrs / ${report.patientGender}
DATE OF REPORT  : ${report.formattedDate}
SAMPLE STATUS   : ${report.status}
REPORTING MD    : ${report.labDoctor} (Reg: ${report.doctorRegNo})
------------------------------------------------------------
INVESTIGATION FINDINGS:
------------------------------------------------------------
${report.parameters
  .map(
    (p) =>
      `${p.name.padEnd(35)}: ${p.value.padStart(8)} ${p.unit.padEnd(10)} [Ref: ${p.refRange.padEnd(14)}] (${p.flag})`
  )
  .join("\n")}
------------------------------------------------------------
CLINICAL PATHOLOGIST REMARKS:
${report.summaryNotes}
------------------------------------------------------------
Digital Verification Hash: SHA256-AVM-${report.id}-VERIFIED-OK
Issued by: AVMLabs Central Reference Laboratory, Indiranagar, BLR.
============================================================
`
      const element = document.createElement("a")
      const file = new Blob([blobContent], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${report.id}_${report.patientName.replace(/\s+/g, "_")}_AVMLabs.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      showToast(`Downloaded verified report for ${report.patientName}`)
    }, 600)
  }


  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleShare = (report: CustomerLabReport) => {
    navigator.clipboard?.writeText(window.location.href)
    setCopiedLink(true)
    showToast(`Report link copied for ${report.id}`)
    setTimeout(() => setCopiedLink(false), 2000)
  }

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
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Digital Lab Reports
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Lifetime digital medical records for you and your family. Search date-wise, filter by patient, and download reports.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/booking"
              className="h-8 px-3 rounded-lg bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Book Test</span>
            </Link>
          </div>
        </div>

        {/* Compact Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
          <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Reports</div>
            <div className="text-xs font-bold text-slate-900">{MOCK_CUSTOMER_REPORTS.length} Released</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Family Members</div>
            <div className="text-xs font-bold text-slate-900">{patientList.length} Registered</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Normal Parameters</div>
            <div className="text-xs font-bold text-emerald-700">
              {MOCK_CUSTOMER_REPORTS.filter(r => !r.hasAbnormalFlag).length} Records
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Attention Advised</div>
            <div className="text-xs font-bold text-amber-700">
              {MOCK_CUSTOMER_REPORTS.filter(r => r.hasAbnormalFlag).length} Records
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADVANCED SEARCH & FILTER CONTROLS                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-3">
        
        {/* Row 1: Search Bar & Patient Filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by test, ID, doctor, or biomarker..."
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

          <div className="md:col-span-5 relative">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline">
                Patient:
              </span>
              <div className="relative flex-1">
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full pl-2.5 pr-7 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer appearance-none"
                >
                  <option value="all">All Family Members ({patientList.length})</option>
                  {patientList.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Date-wise Filter Strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>Date:</span>
            </span>

            <button
              type="button"
              onClick={() => setDateFilterMode("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dateFilterMode === "all"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setDateFilterMode("7days")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dateFilterMode === "7days"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setDateFilterMode("30days")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dateFilterMode === "30days"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setDateFilterMode("90days")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dateFilterMode === "90days"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Last 3 Months
            </button>
            <button
              type="button"
              onClick={() => setDateFilterMode("custom")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dateFilterMode === "custom"
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Custom Range
            </button>
          </div>

          {(searchQuery || selectedPatient !== "all" || dateFilterMode !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedPatient("all")
                setDateFilterMode("all")
                setCustomStartDate("")
                setCustomEndDate("")
              }}
              className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Custom Date Inputs */}
        {dateFilterMode === "custom" && (
          <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-700">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2 py-1 rounded border border-slate-200 bg-white text-xs"
            />
            <span className="text-[11px] font-semibold text-slate-700">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2 py-1 rounded border border-slate-200 bg-white text-xs"
            />
          </div>
        )}



      </div>

      {/* ========================================================================= */}
      {/* 3. REPORTS LIST / GRID VIEW                                               */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 px-0.5">
          <span className="text-[11px] font-semibold">
            Showing <strong className="text-slate-900">{filteredReports.length}</strong> reports
          </span>
          <span className="text-[10.5px] text-slate-400 hidden sm:inline">
            Click &apos;Biomarkers&apos; to view values or &apos;Download PDF&apos; for digital copy
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <FileText className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-800">No matching reports found</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              We couldn&apos;t find reports matching your search or date filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedPatient("all")
                setDateFilterMode("all")
              }}
              className="px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredReports.map((report) => {
              const isDownloading = downloadingId === report.id
              return (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between transition-all"
                >
                  {/* Top Bar: Patient Pill + Date */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded bg-indigo-50 text-[#1e3a8a] flex items-center justify-center font-bold text-xs shrink-0">
                        {report.patientName.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">{report.patientName}</span>
                          <span className="text-[10px] text-slate-400">
                            ({report.patientRelation})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {report.patientAge}y • {report.patientGender}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-end gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{report.formattedDate}</span>
                      </div>
                      <span className="text-[9.5px] font-mono text-slate-400">{report.id}</span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9.5px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                        {report.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {report.testTitle}
                    </h4>

                    <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-normal">
                      {report.summaryNotes}
                    </p>
                  </div>

                  {/* Parameters Preview */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">
                        <strong>{report.parameters.length}</strong> Biomarkers
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {report.labDoctor.split(",")[0]}
                      </span>
                    </div>


                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedReportModal(report)}
                      className="w-full h-7 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileText className="h-3 w-3 text-slate-500" />
                      <span>Biomarkers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadReport(report)}
                      disabled={isDownloading}
                      className="w-full h-7 rounded-md bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold text-[11px] inline-flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Download className="h-3 w-3" />
                      <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: DETAILED LAB REPORT PREVIEW WITH PARAMETERS & QR                 */}
      {/* ========================================================================= */}
      {selectedReportModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-5 space-y-3 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {selectedReportModal.id}
                  </span>

                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {selectedReportModal.testTitle}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedReportModal.patientName} ({selectedReportModal.patientRelation}, {selectedReportModal.patientAge}y) • {selectedReportModal.formattedDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Doctor Note */}
            <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-100 text-xs space-y-0.5">
              <div className="font-bold text-[#1e3a8a] flex items-center gap-1 text-[11px]">
                <Info className="h-3 w-3 text-blue-600" />
                <span>Clinical Interpretation</span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {selectedReportModal.summaryNotes}
              </p>
            </div>

            {/* Parameters Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 font-bold text-slate-700 flex items-center justify-between text-[11px]">
                <span>Biomarker / Investigation</span>
                <span className="hidden sm:inline">Reference Interval</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {selectedReportModal.parameters.map((p, idx) => {
                    const isHigh = p.flag === "High" || p.flag === "Critical"
                    const isLow = p.flag === "Low"
                    return (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-900 text-xs">{p.name}</div>
                          <div className="text-[9.5px] text-slate-400">{p.department || "Biochemistry"}</div>
                        </td>
                        <td className="p-2.5 text-right sm:text-left">
                          <div className="flex items-center justify-end sm:justify-start gap-1">
                            <span className={`font-bold text-xs ${
                              isHigh 
                                ? "text-rose-600" 
                                : isLow 
                                ? "text-amber-600" 
                                : "text-[#1e3a8a]"
                            }`}>
                              {p.value}
                            </span>
                            <span className="text-[10px] text-slate-500">{p.unit}</span>
                          </div>
                          <div className="sm:hidden text-[9.5px] text-slate-400">Ref: {p.refRange}</div>
                        </td>
                        <td className="p-2.5 hidden sm:table-cell text-slate-500 text-[10.5px]">
                          {p.refRange} {p.unit}
                        </td>
                        <td className="p-2.5 text-right">
                          <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded ${
                            isHigh 
                              ? "bg-rose-50 text-rose-700 border border-rose-200" 
                              : isLow 
                              ? "bg-amber-50 text-amber-700 border border-amber-200" 
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {p.flag}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Doctor Seal & Verification */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 text-xs">{selectedReportModal.labDoctor}</div>
                <div className="text-[10px] text-slate-500">Reg: {selectedReportModal.doctorRegNo} • Pathologist</div>
                <div className="text-[9.5px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                  <span>Digitally Signed with Cryptographic Seal</span>
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-center shrink-0">
                <QrCode className="h-8 w-8 text-slate-800 mx-auto" />
                <span className="text-[8.5px] font-mono text-slate-400 block">Verified</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleShare(selectedReportModal)}
                  className="h-8 px-2.5 rounded-md border border-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="h-3 w-3" />
                  <span>{copiedLink ? "Copied" : "Share"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-2.5 rounded-md border border-slate-200 text-slate-700 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedReportModal(null)}
                  className="h-8 px-3 rounded-md border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadReport(selectedReportModal)}
                  className="h-8 px-3.5 rounded-md bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Download className="h-3 w-3" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
