"use client"

import React, { useState, useEffect, useMemo } from "react"
import { X, Search, Check, FlaskConical, Sparkles, Trash2 } from "lucide-react"
import { BookingItem, BeneficiaryMember } from "@/app/booking/page"

interface SelectMemberTestsDrawerProps {
  isOpen: boolean
  onClose: () => void
  member: BeneficiaryMember | null
  allAvailableItems: BookingItem[]
  onToggleTest: (memberId: string, testId: string) => void
  onRemoveTest: (memberId: string, testId: string) => void
}

export function SelectMemberTestsDrawer({
  isOpen,
  onClose,
  member,
  allAvailableItems,
  onToggleTest,
  onRemoveTest
}: SelectMemberTestsDrawerProps) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"all" | "packages" | "tests">("all")

  // Handle open and close animation states
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 20)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsRendered(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setTab("all")
    }
  }, [isOpen])

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (isRendered) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isRendered])

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Filter items based on active tab and search query
  const filteredItems = useMemo(() => {
    return allAvailableItems.filter((item) => {
      if (tab === "packages" && item.type !== "package") return false
      if (tab === "tests" && item.type !== "test") return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
    })
  }, [allAvailableItems, tab, search])

  const packagesCount = useMemo(() => {
    return allAvailableItems.filter((i) => i.type === "package").length
  }, [allAvailableItems])

  const testsCount = useMemo(() => {
    return allAvailableItems.filter((i) => i.type === "test").length
  }, [allAvailableItems])

  if (!isRendered || !member) return null

  const selectedCount = member.selectedTestIds.length

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with smooth blur and fade in/out */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Sidebar Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 pointer-events-auto sm:rounded-l-[5px] transform transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-linear-to-r from-blue-50/70 via-white to-slate-50/50 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-extrabold uppercase bg-blue-50 text-[#1e3a8a] border border-blue-200">
                  {member.relation}
                </span>
                <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                  Select Tests for {member.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Choose wellness profiles or clinical pathology tests for this member.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-[5px] border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Bar & Filter Tabs */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests: CBC, Thyroid, Lipid, HbA1c, Full Body..."
                className="h-10 w-full pl-9 pr-3.5 rounded-[5px] border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-xs transition-all font-medium text-slate-900 shadow-2xs"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setTab("all")}
                className={`h-7 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  tab === "all"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>All</span>
                <span className="text-[10px] opacity-80">({allAvailableItems.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setTab("packages")}
                className={`h-7 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  tab === "packages"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Wellness Profiles</span>
                <span className="text-[10px] opacity-80">({packagesCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setTab("tests")}
                className={`h-7 px-3 rounded-[5px] text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  tab === "tests"
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Clinical Tests</span>
                <span className="text-[10px] opacity-80">({testsCount})</span>
              </button>
            </div>
          </div>

          {/* Scrollable Tests List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <FlaskConical className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No tests found matching &quot;{search}&quot;</p>
                <p className="text-[11px] text-slate-400">Try searching for a different test name or code.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = member.selectedTestIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleTest(member.id, item.id)}
                    className={`p-3 rounded-[5px] flex items-center justify-between gap-3 transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-200 text-blue-950 font-bold shadow-2xs"
                        : "border-transparent hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-5 w-5 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#1e3a8a] border-[#1e3a8a] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold truncate text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5 font-mono">
                          <span>{item.code}</span>
                          <span>•</span>
                          <span>{item.parameterCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#1e3a8a]">₹{item.price}</span>
                        <span className="text-[10px] line-through text-slate-400">₹{item.mrp}</span>
                      </div>
                      <span className="text-[9.5px] font-extrabold text-[#0f9f59] bg-[#e6f7ef] px-1.5 py-0.5 rounded-[4px]">
                        20% OFF
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Currently Selected Tray */}
          {selectedCount > 0 && (
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>
                  Selected for {member.name} ({selectedCount})
                </span>
                <span className="text-emerald-700 font-extrabold text-[11px] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>20% Discount Active</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {member.selectedTestIds.map((tId) => {
                  const item = allAvailableItems.find((i) => i.id === tId)
                  if (!item) return null
                  return (
                    <span
                      key={tId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                    >
                      <span className="truncate max-w-[150px] font-bold">{item.name}</span>
                      <span className="text-[#1e3a8a] font-bold">₹{item.price}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveTest(member.id, tId)
                        }}
                        className="text-slate-400 hover:text-rose-600 font-bold px-0.5 cursor-pointer transition-colors"
                        title="Remove test"
                      >
                        ✕
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sticky Action Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{selectedCount}</span> test{selectedCount === 1 ? "" : "s"} selected
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-[5px] bg-[#1e3a8a] hover:bg-[#152e6f] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Done Selecting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
