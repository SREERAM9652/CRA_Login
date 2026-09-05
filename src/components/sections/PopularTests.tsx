"use client"

import { useState } from "react"
import { 
  FlaskConical, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Search
} from "lucide-react"
import { DIAGNOSTIC_TESTS } from "@/lib/mock-data"
import Link from "next/link"

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  Blood: "Hematology & Blood",
  Thyroid: "Thyroid & Hormones",
  Diabetes: "Diabetes & Sugar",
  Cardiology: "Lipid & Cardiac",
  Vitamins: "Vitamins & Minerals",
  Liver: "Liver Function",
  Kidney: "Kidney Function"
}

const categoryOrder = ["Blood", "Thyroid", "Diabetes", "Cardiology", "Vitamins", "Liver", "Kidney"]

// Dynamically generate category tabs from the actual test dataset
const availableCategories = Array.from(new Set(DIAGNOSTIC_TESTS.map(t => t.category)))
  .filter(Boolean)
  .sort((a, b) => {
    const idxA = categoryOrder.indexOf(a)
    const idxB = categoryOrder.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

const categories = [
  { id: "All", label: "All Tests" },
  ...availableCategories.map(cat => ({
    id: cat,
    label: CATEGORY_DISPLAY_NAMES[cat] || cat
  }))
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
    <section className="pt-12 pb-6 md:pt-16 md:pb-8 bg-[#f8fafc] font-sans border-t border-slate-200/80" id="tests">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-blue-50 text-[#0f2756] text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              <FlaskConical className="h-3.5 w-3.5 text-[#0f2756]" />
              <span>500+ Diagnostic Tests Available</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-[#0a1936]">
              Popular Laboratory Tests
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
              High-throughput bi-directional systems ensure seamless sample processing with zero manual touchpoints in core chemistry. Fast 6 to 12-hour report turnaround.
            </p>
          </div>

          {/* Quick search container with 5px border-radius and Dark Blue focus */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search 500+ tests..."
              className="w-full pl-8.5 pr-3.5 py-2 text-xs rounded-[5px] bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2756]/20 focus:border-[#0f2756] text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filter Tabs Container with 5px border radius */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const count = cat.id === "All" 
              ? DIAGNOSTIC_TESTS.length 
              : DIAGNOSTIC_TESTS.filter(t => t.category === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-2 rounded-[5px] text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  activeCategory === cat.id
                    ? "bg-[#0f2756] border-[#0f2756] text-white shadow-xs hover:bg-[#0a1e42]"
                    : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded-[5px] text-[10px] font-black leading-none ${
                  activeCategory === cat.id ? "bg-white/20 text-blue-100" : "bg-slate-100 text-slate-600 border border-slate-200/60"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Compact Test Cards Grid: 3 Columns x 2 Rows with Designed Colored Container & Category Badge Removed */}
        {paginatedTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {paginatedTests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md border border-slate-200/90 hover:border-[#0f2756] border-t-[3px] border-t-[#0f2756] group bg-white rounded-[5px] shadow-xs relative overflow-hidden"
              >
                {/* Upper Content Container with gentle gradient accent */}
                <div className="p-4 sm:p-4.5 bg-gradient-to-b from-blue-50/20 via-white to-white relative">
                  
                  {/* Popular Badge (Positioned absolute on top-right so no dead space is created) */}
                  {test.popular && (
                    <span className="absolute top-3.5 right-4 text-[9.5px] uppercase font-black tracking-wider px-2 py-0.5 rounded-[5px] bg-amber-500 text-white shadow-2xs">
                      Popular
                    </span>
                  )}

                  {/* Test Name - Starts cleanly at the top with zero dead space */}
                  <h3 className={`text-sm sm:text-[15px] font-black text-[#0a1936] leading-snug group-hover:text-[#0f2756] transition-colors line-clamp-1 ${test.popular ? "pr-16" : ""}`}>
                    {test.name}
                  </h3>

                  {/* Specimen & TAT Mini Container */}
                  <div className="mt-2.5 px-3 py-2 rounded-[5px] bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 truncate text-slate-700">
                      <FlaskConical className="h-3.5 w-3.5 text-[#0f2756] shrink-0" />
                      <span className="truncate font-medium">{test.sampleType}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {test.fastingRequired && (
                        <span className="px-1.5 py-0.5 rounded-[5px] bg-amber-50 text-amber-800 text-[9.5px] font-bold border border-amber-200">
                          {test.fastingHours}h Fasting
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-[#0f2756] font-bold">
                        <Clock className="h-3.5 w-3.5 text-[#0f2756] shrink-0" />
                        <span>{test.tat}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Pricing & Action Footer Container */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-t border-slate-100">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-lg text-[#0a1936]">₹{test.price}</span>
                      <span className="text-xs text-slate-400 line-through font-medium">₹{test.mrp}</span>
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-[5px] border border-emerald-200/80">
                        20% OFF
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/booking?test=${test.id}`}
                    className="h-8.5 px-4 text-xs font-bold bg-[#0f2756] hover:bg-[#0a1e42] text-white rounded-[5px] transition-all inline-flex items-center justify-center shadow-2xs hover:shadow cursor-pointer"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-[5px] border border-slate-200 shadow-2xs">
            <p className="text-slate-600 font-bold text-xs">No diagnostic tests match your filter.</p>
            <button
              type="button"
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="mt-2 px-3 py-1.5 text-xs font-bold text-[#0f2756] bg-blue-50 border border-blue-200 rounded-[5px] hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Numbered Pagination (2 rows x 3 columns) with 5px radius */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            
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
                className="h-8 px-2.5 rounded-[5px] border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
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
                      className={`h-8 w-8 rounded-[5px] text-xs font-black transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#0f2756] border border-[#0f2756] text-white shadow-xs hover:bg-[#0a1e42]"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
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
                className="h-8 px-2.5 rounded-[5px] border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
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
