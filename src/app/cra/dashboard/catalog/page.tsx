"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Sparkles, 
  Percent, 
  Copy, 
  Check, 
  Share2, 
  Filter, 
  FlaskConical, 
  Microscope, 
  Droplets,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Award,
  FileSpreadsheet,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { CRA_TESTS, CRATestItem } from "@/lib/cra-tests"
import { CustomSelect } from "@/components/ui/CustomSelect"
import { useWorkflowStore } from "@/lib/workflow-store"

export default function CRACatalogPage() {
  const { currentUser } = useWorkflowStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTech, setSelectedTech] = useState("All")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedTests, setSelectedTests] = useState<CRATestItem[]>([])
  const [copiedList, setCopiedList] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pageSizeDropdownOpen, setPageSizeDropdownOpen] = useState(false)
  const pageSizeRef = useRef<HTMLDivElement>(null)

  const referralCode = currentUser.code || "AVM-SREERAM-C1"

  // Click outside to close page size dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target as Node)) {
        setPageSizeDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Unique categories and technologies
  const categories = ["All", ...Array.from(new Set(CRA_TESTS.map(t => t.category))).sort()]
  const technologies = ["All", ...Array.from(new Set(CRA_TESTS.map(t => t.technology))).sort()]

  const filteredTests = CRA_TESTS.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory
    const matchesTech = selectedTech === "All" || test.technology === selectedTech
    return matchesSearch && matchesCategory && matchesTech
  })

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredTests.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTests.length)
  const paginatedTests = filteredTests.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    const tableEl = document.getElementById("tests-table-section")
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total]
    }
    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
    }
    return [1, "...", current - 1, current, current + 1, "...", total]
  }

  const handleCopyTestLink = (testCode: string, testName: string) => {
    const link = `https://avmlabs.com/booking?ref=${referralCode}&test=${testCode.toLowerCase()}`
    navigator.clipboard.writeText(link)
    setCopiedCode(testCode)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleSelectTest = (test: CRATestItem) => {
    if (selectedTests.some(t => t.code === test.code)) {
      setSelectedTests(prev => prev.filter(t => t.code !== test.code))
    } else {
      setSelectedTests(prev => [...prev, test])
    }
  }

  // Multi-item Quote calculations
  const totalCatalogue = selectedTests.reduce((sum, t) => sum + t.catalogueRate, 0)
  const totalRR = selectedTests.reduce((sum, t) => sum + t.realizedRevenue, 0)
  const totalC1 = selectedTests.reduce((sum, t) => sum + t.c1Incentive, 0)
  const selectedCodesString = selectedTests.map(t => t.code).join(",")

  const handleExportCSV = () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test to export.")
      return
    }

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Price Catalog Quote</x:Name>
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
          .th-head { background-color: #1e1b4b; color: #ffffff; font-weight: bold; font-size: 10pt; text-align: center; border: 1px solid #0f172a; height: 28px; vertical-align: middle; white-space: nowrap; }
          .td-num { text-align: center; border: 1px solid #e2e8f0; vertical-align: middle; white-space: nowrap; }
          .td-code { text-align: center; font-weight: bold; color: #382685; background-color: #faf5ff; border: 1px solid #e2e8f0; vertical-align: middle; font-family: monospace; white-space: nowrap; }
          .td-name { font-weight: bold; color: #0f172a; border: 1px solid #e2e8f0; vertical-align: middle; padding-left: 8px; }
          .td-cat { color: #475569; border: 1px solid #e2e8f0; vertical-align: middle; padding-left: 6px; white-space: nowrap; }
          .td-money { text-align: right; color: #64748b; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; white-space: nowrap; }
          .td-money-final { text-align: right; color: #1e1b4b; font-weight: bold; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; background-color: #f8fafc; white-space: nowrap; }
          .td-money-earning { text-align: right; color: #047857; font-weight: bold; border: 1px solid #e2e8f0; vertical-align: middle; padding-right: 8px; background-color: #ecfdf5; white-space: nowrap; }
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
            <col width="140" style="width:105pt">
            <col width="110" style="width:82pt">
            <col width="140" style="width:105pt">
            <col width="150" style="width:112pt">
          </colgroup>

          <!-- Header Banner -->
          <tr>
            <td colspan="8" class="header-banner">
              AVMLABS CENTRAL REFERENCE DIAGNOSTICS NETWORK
            </td>
          </tr>
          <tr>
            <td colspan="8" class="sub-banner">
              Official Diagnostic Price Catalog &amp; Quotation • Ref: ${referralCode}
            </td>
          </tr>
          <tr><td colspan="8" style="height:8px;"></td></tr>

          <!-- Table Header -->
          <tr>
            <th class="th-head">#</th>
            <th class="th-head">Test Code</th>
            <th class="th-head" style="text-align:left;padding-left:8px;">Medical Test Name</th>
            <th class="th-head" style="text-align:left;padding-left:8px;">Category</th>
            <th class="th-head" style="text-align:left;padding-left:8px;">Technology</th>
            <th class="th-head" style="text-align:right;padding-right:8px;">MRP (₹)</th>
            <th class="th-head" style="text-align:right;padding-right:8px;">Customer Price (₹)</th>
            <th class="th-head" style="text-align:right;padding-right:8px;">Your Earning 30% (₹)</th>
          </tr>

          <!-- Table Rows -->
          ${selectedTests.map((t, idx) => {
            const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc"
            return `
              <tr style="background-color:${rowBg};height:26px;">
                <td class="td-num">${idx + 1}</td>
                <td class="td-code">${t.code}</td>
                <td class="td-name">${t.name}</td>
                <td class="td-cat">${t.category}</td>
                <td class="td-cat">${t.technology}</td>
                <td class="td-money">₹ ${t.catalogueRate}</td>
                <td class="td-money-final">₹ ${t.realizedRevenue}</td>
                <td class="td-money-earning">+ ₹ ${t.c1Incentive}</td>
              </tr>
            `
          }).join("")}

          <!-- Commercial Summary Rows -->
          <tr style="height:28px;">
            <td colspan="5" class="total-label">TOTAL (${selectedTests.length} Selected Tests):</td>
            <td class="total-val">₹ ${totalCatalogue.toLocaleString()}</td>
            <td class="total-val" style="color:#1e1b4b;font-weight:bold;">₹ ${totalRR.toLocaleString()}</td>
            <td class="total-val" style="color:#047857;font-weight:bold;">+ ₹ ${totalC1.toLocaleString()}</td>
          </tr>

          <!-- Highlighted Row -->
          <tr style="height:32px;">
            <td colspan="5" class="grand-label">FINAL PATIENT PAYABLE (20% DISCOUNT APPLIED):</td>
            <td colspan="3" class="grand-val">₹ ${totalRR.toLocaleString()}</td>
          </tr>

          <tr><td colspan="8" style="height:10px;"></td></tr>
          <tr>
            <td colspan="8" class="footer-note">
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
    link.download = `AVMLabs_Quote_${selectedTests.length}_Tests.xls`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopySelectedList = () => {
    const listText = selectedTests.map((t, i) => `${i + 1}. *${t.name}* (${t.code}) - MRP: ₹${t.catalogueRate} ➔ *₹${t.realizedRevenue}* (Your 30%: ₹${t.c1Incentive})`).join("\n")
    const fullText = `*AVMLabs Test Quotation & Commission Summary*\n\n${listText}\n\n` +
      `💰 *Total MRP:* ₹${totalCatalogue}\n` +
      `🏷️ *Customer Final Price (20% Off):* *₹${totalRR}*\n` +
      `💵 *Your Direct Earning (30%):* *₹${totalC1}*`

    navigator.clipboard.writeText(fullText)
    setCopiedList(true)
    setTimeout(() => setCopiedList(false), 2000)
  }

  // Summary counts
  const totalTests = CRA_TESTS.length
  const maxIncentive = Math.max(...CRA_TESTS.map(t => t.c1Incentive))
  const avgIncentive = Math.round(CRA_TESTS.reduce((acc, t) => acc + t.c1Incentive, 0) / totalTests)

  return (
    <div className="space-y-6 font-sans pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-extrabold uppercase tracking-wider mb-2 border border-purple-200/80">
            <Award className="h-3.5 w-3.5 text-[#382685]" /> Diagnostic Price List &amp; Estimate Tools
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            Lab Tests &amp; Your Earnings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Check all test prices, customer discounts, generate professional PDF estimates, and track your 30% direct earnings.
          </p>
        </div>

        {/* Action Button: Open PDF Estimator Tool */}
        <div className="flex items-center gap-3">
          <Link
            href="/cra/dashboard/estimate"
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-indigo-950/15 transition-all shrink-0"
          >
            <FileSpreadsheet className="h-4 w-4 text-cyan-300" />
            <span>Open PDF Price Estimator</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3 Metric Pills - Compact 3-Column Strip on Mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="p-2.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <div className="text-[9.5px] sm:text-[11px] text-slate-500 font-bold uppercase truncate">Total Lab Tests</div>
            <div className="text-sm sm:text-2xl font-black text-slate-900 truncate">{totalTests} Tests</div>
          </div>
          <div className="hidden sm:flex h-10 w-10 rounded-xl bg-purple-50 text-[#5538b5] items-center justify-center font-bold shrink-0">
            <FlaskConical className="h-5 w-5" />
          </div>
        </div>

        <div className="p-2.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <div className="text-[9.5px] sm:text-[11px] text-slate-500 font-bold uppercase truncate">Highest Earning</div>
            <div className="text-sm sm:text-2xl font-black text-emerald-700 truncate">₹{maxIncentive} <span className="hidden sm:inline text-xs font-semibold">/ test</span></div>
          </div>
          <div className="hidden sm:flex h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 items-center justify-center font-bold shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="p-2.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <div className="text-[9.5px] sm:text-[11px] text-slate-500 font-bold uppercase truncate">Avg Direct Earning</div>
            <div className="text-sm sm:text-2xl font-black text-[#251b5c] truncate">₹{avgIncentive} <span className="hidden sm:inline text-xs font-semibold">/ test</span></div>
          </div>
          <div className="hidden sm:flex h-10 w-10 rounded-xl bg-blue-50 text-[#251b5c] items-center justify-center font-bold shrink-0">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by test code (e.g. HBA, TSH) or test name..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] text-slate-900"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <CustomSelect
              options={categories.map(cat => ({
                value: cat,
                label: cat === "All" ? "All Categories" : cat,
                badge: (cat === "All" ? totalTests : CRA_TESTS.filter(t => t.category === cat).length).toString()
              }))}
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(val)
                setCurrentPage(1)
              }}
              placeholder="Filter Category"
            />
          </div>

          {/* Technology Dropdown */}
          <div className="md:col-span-3">
            <CustomSelect
              options={technologies.map(tech => ({
                value: tech,
                label: tech === "All" ? "All Technologies" : tech
              }))}
              value={selectedTech}
              onChange={(val) => {
                setSelectedTech(val)
                setCurrentPage(1)
              }}
              placeholder="Filter Technology"
            />
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{startIndex + 1}–{endIndex}</strong> of {filteredTests.length} tests (Page {safeCurrentPage} of {totalPages})
          </div>
          {selectedTests.length > 0 && (
            <div className="font-bold text-[#382685] flex items-center gap-2">
              <span>{selectedTests.length} tests selected for quotation</span>
              <button onClick={() => setSelectedTests([])} className="text-rose-600 hover:underline cursor-pointer">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div id="tests-table-section" />

      {/* Mobile Top Pagination & Quick Nav Strip */}
      <div className="md:hidden flex items-center justify-between bg-white px-3 py-2 rounded-2xl border border-slate-100 shadow-2xs text-xs">
        <button
          type="button"
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold disabled:opacity-30 disabled:cursor-not-allowed text-[11px] flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="h-3 w-3" />
          <span>Prev</span>
        </button>

        <span className="font-bold text-slate-700 text-[11px]">
          Page <strong className="text-[#251b5c] font-black">{safeCurrentPage}</strong> of {totalPages} ({filteredTests.length} tests)
        </span>

        <button
          type="button"
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          className="px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold disabled:opacity-30 disabled:cursor-not-allowed text-[11px] flex items-center gap-1 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Mobile Tests Card List (Visible on mobile screens < 768px) */}
      <div className="grid grid-cols-1 gap-2.5 md:hidden">
        {paginatedTests.map((test) => {
          const isCopied = copiedCode === test.code
          const directLink = `https://avmlabs.com/booking?ref=${referralCode}&test=${test.code.toLowerCase()}`
          const isSelected = selectedTests.some(t => t.code === test.code)

          return (
            <div 
              key={test.code} 
              className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                isSelected 
                  ? "bg-purple-50/95 border-[#382685]/50 shadow-xs ring-1 ring-[#382685]/30" 
                  : "bg-white border-slate-100 shadow-2xs"
              }`}
            >
              {/* Top Row: Checkbox, Code, Sample, and Direct Earning Badge */}
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-start gap-2.5 flex-1 cursor-pointer min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectTest(test)}
                    className="h-4.5 w-4.5 mt-0.5 rounded border-slate-300 text-[#382685] focus:ring-[#382685]/30 cursor-pointer shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-[#382685] border border-purple-200/80">
                        {test.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">• {test.sample}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug mt-1">
                      {test.name}
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                      {test.category} ({test.technology})
                    </div>
                  </div>
                </label>

                {/* Direct Earning Badge on Top Right */}
                <div className="text-right shrink-0">
                  <span className="text-[10.5px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 block">
                    +₹{test.c1Incentive} (30%)
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-medium">Earn Direct</span>
                </div>
              </div>

              {/* Bottom Row: Customer Price & Fast Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100/90 gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Customer Price</div>
                  <div className="font-black text-slate-900 text-xs flex items-center gap-1">
                    <span>₹{test.realizedRevenue}</span>
                    <span className="text-slate-400 line-through text-[10.5px] font-normal">₹{test.catalogueRate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyTestLink(test.code, test.name)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-[#382685]" />}
                    <span>{isCopied ? "Copied" : "Copy"}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Book ${test.name} on AVMLabs with 20% discount: ${directLink}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* Tests Table (Visible on tablet & desktop >= 768px) */}
      <div className="hidden md:block rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">Select</th>
                <th className="px-4 py-3.5">Test Name &amp; Code</th>
                <th className="px-4 py-3.5">Category &amp; Technology</th>
                <th className="px-4 py-3.5">Sample</th>
                <th className="px-4 py-3.5 text-right">MRP</th>
                <th className="px-4 py-3.5 text-right">Customer Price (20% Off)</th>
                <th className="px-4 py-3.5 text-right text-emerald-800">Your Direct Earning (30%)</th>
                <th className="px-4 py-3.5 text-right text-purple-700">Team Bonus (10%)</th>
                <th className="px-4 py-3.5 text-center">Share Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTests.map((test) => {
                const c2Incentive = Math.round(test.realizedRevenue * 0.1)
                const isCopied = copiedCode === test.code
                const directLink = `https://avmlabs.com/booking?ref=${referralCode}&test=${test.code.toLowerCase()}`
                const isSelected = selectedTests.some(t => t.code === test.code)

                return (
                  <tr key={test.code} className={`transition-colors ${isSelected ? "bg-purple-50/60" : "hover:bg-slate-50/80"}`}>
                    
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectTest(test)}
                        className="h-4 w-4 rounded border-slate-300 text-[#382685] focus:ring-[#382685]/30 cursor-pointer"
                      />
                    </td>

                    {/* Code & Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-[#382685] border border-purple-100">
                          {test.code}
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {test.name}
                        </span>
                      </div>
                    </td>

                    {/* Category & Tech */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-700">{test.category}</div>
                      <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">{test.technology}</div>
                    </td>

                    {/* Sample */}
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10.5px]">
                        {test.sample}
                      </span>
                    </td>

                    {/* MRP */}
                    <td className="px-4 py-3.5 text-right text-slate-400 line-through font-semibold">
                      ₹{test.catalogueRate}
                    </td>

                    {/* Realized Revenue */}
                    <td className="px-4 py-3.5 text-right font-black text-slate-900">
                      ₹{test.realizedRevenue}
                    </td>

                    {/* C1 Incentive */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                        ₹{test.c1Incentive}
                      </span>
                    </td>

                    {/* C2 Incentive */}
                    <td className="px-4 py-3.5 text-right font-bold text-purple-700">
                      ₹{c2Incentive}
                    </td>

                    {/* Share Action */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyTestLink(test.code, test.name)}
                          className="p-1.5 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          title="Copy direct booking link"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-[#382685]" />}
                          <span>{isCopied ? "Copied" : "Copy"}</span>
                        </button>
                        
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Book ${test.name} on AVMLabs with 20% discount: ${directLink}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Integrated Table Footer: Pagination & Page Size (Unified inside Table Card) */}
        {filteredTests.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 flex items-center justify-between gap-3 text-xs">
            
            {/* Showing Summary & Page Size Selector */}
            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <span>
                Showing <strong className="text-slate-900 font-black">{startIndex + 1}</strong> to <strong className="text-slate-900 font-black">{endIndex}</strong> of <strong className="text-slate-900 font-black">{filteredTests.length}</strong> tests
              </span>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500">Show:</span>
                <div className="relative" ref={pageSizeRef}>
                  <button
                    type="button"
                    onClick={() => setPageSizeDropdownOpen(!pageSizeDropdownOpen)}
                    className="bg-white border border-slate-200 hover:border-[#382685] rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{itemsPerPage} / page</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${pageSizeDropdownOpen ? "rotate-180 text-[#382685]" : ""}`} />
                  </button>

                  {pageSizeDropdownOpen && (
                    <div className="absolute bottom-full mb-1.5 left-0 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1 w-28 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-900/5">
                      {[
                        { value: 10, label: "10 / page" },
                        { value: 20, label: "20 / page" },
                        { value: 50, label: "50 / page" },
                        { value: 90, label: "All (90)" },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setItemsPerPage(opt.value)
                            setCurrentPage(1)
                            setPageSizeDropdownOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-left transition-colors cursor-pointer ${
                            itemsPerPage === opt.value
                              ? "bg-[#251b5c] text-white"
                              : "text-slate-700 hover:bg-slate-50 hover:text-[#382685]"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {itemsPerPage === opt.value && <Check className="h-3 w-3 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers(safeCurrentPage, totalPages).map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-bold">
                        ...
                      </span>
                    )
                  }
                  const isCurrent = p === safeCurrentPage
                  return (
                    <button
                      key={`page-${p}`}
                      type="button"
                      onClick={() => handlePageChange(p as number)}
                      className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#251b5c] text-white shadow-xs scale-105"
                          : "bg-white hover:bg-purple-50 text-slate-700 border border-slate-200 hover:border-purple-200"
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Mobile-Only Bottom Pagination Bar */}
      {filteredTests.length > 0 && (
        <div className="md:hidden bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold text-[11px]">
            Page {safeCurrentPage} of {totalPages} ({filteredTests.length} tests)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING MULTI-TEST QUOTATION CART BAR                                    */}
      {/* ========================================================================= */}
      {selectedTests.length > 0 && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-8 sm:max-w-2xl bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl z-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Left summary */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-purple-500/20 text-cyan-300 flex items-center justify-center font-black text-xs sm:text-sm border border-white/10 shrink-0">
              {selectedTests.length}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-300 truncate">Quotation Summary ({selectedTests.length} Tests)</div>
              <div className="text-xs sm:text-sm font-black text-white">
                Price: ₹{totalRR.toLocaleString()} • <span className="text-emerald-400">Your 30%: ₹{totalC1.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right tool buttons */}
          <div className="grid grid-cols-4 sm:flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopySelectedList}
              className="px-2.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="Copy Quotation Summary"
            >
              {copiedList ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copiedList ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="Export to Excel CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <Link
              href={`/cra/dashboard/estimate?tests=${selectedCodesString}`}
              className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1 transition-transform hover:scale-105"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>PDF</span>
            </Link>

            <Link
              href={`/cra/dashboard/add-lead?tests=${selectedCodesString}`}
              className="px-3 py-2 bg-white text-[#1e1b4b] hover:bg-slate-100 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1 transition-transform hover:scale-105"
            >
              <span>Book</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}
