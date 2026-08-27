"use client"

import { useState } from "react"
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
  Printer
} from "lucide-react"
import { CRA_TESTS, CRATestItem } from "@/lib/cra-tests"
import { CustomSelect } from "@/components/ui/CustomSelect"

export default function CRACatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTech, setSelectedTech] = useState("All")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedTests, setSelectedTests] = useState<CRATestItem[]>([])
  const [copiedList, setCopiedList] = useState(false)

  const referralCode = "AVM-RAJ-789"

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

  const handleCopyTestLink = (testCode: string, testName: string) => {
    const link = `https://avmlabs.in/booking?ref=${referralCode}&test=${testCode.toLowerCase()}`
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
    const headers = ["#", "Code", "Test Name", "Category", "Methodology", "Sample", "MRP (INR)", "Final Price (INR)", "Your Earning 30% (INR)"]
    const rows = selectedTests.map((t, idx) => [
      idx + 1,
      t.code,
      `"${t.name}"`,
      `"${t.category}"`,
      t.technology,
      t.sample,
      t.catalogueRate,
      t.realizedRevenue,
      t.c1Incentive
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [
      `"AVMLabs Diagnostic Price List & Quotation"`,
      "",
      headers.join(","),
      ...rows.map(r => r.join(",")),
      "",
      `"TOTAL",,"${selectedTests.length} Tests",,,,"${totalCatalogue}","${totalRR}","${totalC1}"`
    ].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `AVMLabs_Quote_${selectedTests.length}_Tests.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase">Total Lab Tests</div>
            <div className="text-2xl font-black text-slate-900">{totalTests} Tests Available</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#5538b5] flex items-center justify-center font-bold">
            <FlaskConical className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase">Highest Single Test Earning</div>
            <div className="text-2xl font-black text-emerald-700">₹{maxIncentive} / test</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase">Average Direct Earning</div>
            <div className="text-2xl font-black text-[#251b5c]">₹{avgIncentive} / test</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#251b5c] flex items-center justify-center font-bold">
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onChange={setSelectedCategory}
              placeholder="Filter Category"
            />
          </div>

          {/* Technology Dropdown */}
          <div className="md:col-span-3">
            <CustomSelect
              options={technologies.map(tech => ({
                value: tech,
                label: tech === "All" ? "All Methods" : tech
              }))}
              value={selectedTech}
              onChange={setSelectedTech}
              placeholder="Filter Method"
            />
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredTests.length}</strong> of {totalTests} tests
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

      {/* Tests Table */}
      <div className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">Select</th>
                <th className="px-4 py-3.5">Test Name &amp; Code</th>
                <th className="px-4 py-3.5">Category &amp; Method</th>
                <th className="px-4 py-3.5">Sample</th>
                <th className="px-4 py-3.5 text-right">MRP</th>
                <th className="px-4 py-3.5 text-right">Customer Price (20% Off)</th>
                <th className="px-4 py-3.5 text-right text-emerald-800">Your Direct Earning (30%)</th>
                <th className="px-4 py-3.5 text-right text-purple-700">Team Bonus (10%)</th>
                <th className="px-4 py-3.5 text-center">Share Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((test) => {
                const c2Incentive = Math.round(test.realizedRevenue * 0.1)
                const isCopied = copiedCode === test.code
                const directLink = `https://avmlabs.in/booking?ref=${referralCode}&test=${test.code.toLowerCase()}`
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
      </div>

      {/* ========================================================================= */}
      {/* FLOATING MULTI-TEST QUOTATION CART BAR                                    */}
      {/* ========================================================================= */}
      {selectedTests.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-2xl bg-slate-900 text-white rounded-2xl p-4 shadow-2xl z-50 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Left summary */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-cyan-300 flex items-center justify-center font-black text-sm border border-white/10 shrink-0">
              {selectedTests.length}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Quotation Summary ({selectedTests.length} Tests)</div>
              <div className="text-sm font-black text-white">
                Price: ₹{totalRR.toLocaleString()} • <span className="text-emerald-400">Your 30%: ₹{totalC1.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right tool buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopySelectedList}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy Quotation Summary"
            >
              {copiedList ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedList ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export to Excel CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>

            <Link
              href={`/cra/dashboard/estimate?tests=${selectedCodesString}`}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>PDF Estimate</span>
            </Link>

            <Link
              href={`/cra/dashboard/add-lead?tests=${selectedCodesString}`}
              className="px-3.5 py-1.5 bg-white text-[#1e1b4b] hover:bg-slate-100 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span>Book Order</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}
