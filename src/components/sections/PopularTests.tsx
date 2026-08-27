"use client"

import { useState } from "react"
import { 
  FlaskConical, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  Search,
  CheckCircle2,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { DIAGNOSTIC_TESTS } from "@/lib/mock-data"
import Link from "next/link"

const categories = [
  { id: "All", label: "All Tests" },
  { id: "Blood", label: "Hematology & Blood" },
  { id: "Thyroid", label: "Thyroid & Hormones" },
  { id: "Diabetes", label: "Diabetes & Sugar" },
  { id: "Cardiology", label: "Lipid & Cardiac" },
  { id: "Vitamins", label: "Vitamins & Minerals" },
  { id: "Liver", label: "Liver Function" },
  { id: "Kidney", label: "Kidney Function" }
]

const ITEMS_PER_PAGE = 6 // 3 Columns x 2 Rows = 6 Cards per page

export function PopularTests() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTests = DIAGNOSTIC_TESTS.filter(test => {
    const matchesCategory = activeCategory === "All" || test.category === activeCategory
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.sampleType.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE) || 1
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    const element = document.getElementById("tests")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-12 md:py-16 bg-white font-sans border-t border-slate-100" id="tests">
      <div className="container mx-auto px-4 md:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div className="max-w-2xl space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-[#382685] text-xs font-black uppercase tracking-wider border border-purple-200/80">
              <FlaskConical className="h-3.5 w-3.5" /> 500+ Certified Diagnostic Tests Available
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
              Popular Laboratory Tests
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-normal">
              Standardized clinical pathology tests with automated analyzer precision. Fast 6 to 12-hour report turnaround.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search 500+ tests..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const count = cat.id === "All" 
              ? DIAGNOSTIC_TESTS.length 
              : DIAGNOSTIC_TESTS.filter(t => t.category === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeCategory === cat.id ? "bg-white/20 text-cyan-200" : "bg-white text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Compact Test Cards Grid: 3 Columns x 2 Rows (6 Cards per Page) */}
        {paginatedTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedTests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 hover:shadow-lg border border-slate-200/90 group bg-white rounded-2xl p-4 sm:p-4.5 shadow-xs relative"
              >
                {/* Top badges row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#382685] text-[10.5px] font-black border border-purple-100">
                        {test.category}
                      </span>
                      {test.fastingRequired && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                          {test.fastingHours}h Fasting
                        </span>
                      )}
                    </div>
                    {test.popular && (
                      <span className="text-[9.5px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400/15 text-amber-800 border border-amber-300/40">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Test Name */}
                  <h3 className="text-sm sm:text-[15px] font-black text-slate-900 leading-snug group-hover:text-[#251b5c] transition-colors line-clamp-1">
                    {test.name}
                  </h3>

                  {/* Specimen / TAT info in 1 compact row */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mt-1.5">
                    <div className="flex items-center gap-1 truncate">
                      <FlaskConical className="h-3 w-3 text-[#382685] shrink-0" />
                      <span className="truncate">{test.sampleType}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1 shrink-0 text-cyan-700 font-semibold">
                      <Clock className="h-3 w-3 text-cyan-600 shrink-0" />
                      <span>{test.tat}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Action Row */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-lg text-slate-900">₹{test.price}</span>
                      <span className="text-xs text-slate-400 line-through font-semibold">₹{test.mrp}</span>
                      <span className="text-[9.5px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        20% OFF
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/booking?test=${test.id}`}
                    className="h-8 px-3.5 text-xs font-black bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-95 text-white rounded-xl transition-all inline-flex items-center gap-1 shadow-xs"
                  >
                    <span>Book</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 font-bold text-xs">No diagnostic tests match your filter.</p>
            <button
              type="button"
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="mt-2 px-3 py-1.5 text-xs font-black text-[#382685] bg-purple-100 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Numbered Pagination (2 rows x 3 columns) */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Range Counter */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTests.length)}</span> of{" "}
              <span className="font-bold text-slate-900">{filteredTests.length}</span> tests (Page {currentPage} of {totalPages})
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1.5">
              
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-[#251b5c] to-[#382685] text-white shadow-xs"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                } else if (
                  pageNum === currentPage - 2 || 
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-0.5 text-slate-400 text-xs font-bold">
                      ...
                    </span>
                  )
                }
                return null
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}
