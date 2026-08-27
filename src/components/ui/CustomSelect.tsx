"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { ChevronDown, Check, Search, X } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
  sublabel?: string
  badge?: string
  code?: string
  price?: number
  c1?: number
  icon?: ReactNode
}

export interface SelectGroup {
  group: string
  items: SelectOption[]
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options?: SelectOption[]
  groups?: SelectGroup[]
  placeholder?: string
  label?: string
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
  triggerClassName?: string
  popoverClassName?: string
  align?: "left" | "right"
  icon?: ReactNode
}

export function CustomSelect({
  value,
  onChange,
  options,
  groups,
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Search options...",
  className = "",
  triggerClassName = "",
  popoverClassName = "",
  align = "left",
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isOpen, searchable])

  // Find currently selected option
  const allOptions: SelectOption[] = options 
    ? options 
    : groups 
    ? groups.flatMap(g => g.items) 
    : []

  const selectedOption = allOptions.find(opt => opt.value === value)

  // Filter options based on search
  const filteredOptions = options
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase())) ||
        (opt.code && opt.code.toLowerCase().includes(search.toLowerCase()))
      )
    : null

  const filteredGroups = groups
    ? groups
        .map(group => ({
          ...group,
          items: group.items.filter(
            opt =>
              opt.label.toLowerCase().includes(search.toLowerCase()) ||
              (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase())) ||
              (opt.code && opt.code.toLowerCase().includes(search.toLowerCase()))
          ),
        }))
        .filter(group => group.items.length > 0)
    : null

  const totalResultsCount = filteredOptions
    ? filteredOptions.length
    : filteredGroups
    ? filteredGroups.reduce((acc, g) => acc + g.items.length, 0)
    : 0

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 flex items-center justify-between gap-2.5 px-3.5 sm:px-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
          isOpen
            ? "border-[#382685] bg-white ring-2 ring-[#382685]/20 shadow-md"
            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {icon && <span className="text-[#382685] shrink-0">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-1.5 truncate">
              {selectedOption.code && (
                <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[#382685] font-mono text-[10px] font-black border border-purple-100 shrink-0">
                  {selectedOption.code}
                </span>
              )}
              <span className="text-slate-900 font-bold truncate">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200 shrink-0">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 font-medium truncate">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#382685]" : ""
          }`}
        />
      </button>

      {/* Floating Popover Menu with Alignment Support */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-full min-w-[240px] sm:min-w-[280px] max-h-80 rounded-2xl bg-white border border-slate-100 shadow-2xl ring-1 ring-slate-900/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0 left-auto" : "left-0 right-auto"
          } ${popoverClassName}`}
        >
          {/* Search Box inside dropdown */}
          {searchable && (
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#382685]/30 focus:border-[#382685] text-slate-900 placeholder:text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options Scroll Container */}
          <div className="overflow-y-auto flex-1 p-1.5 space-y-1 divide-y divide-slate-100/60 custom-scrollbar">
            
            {/* Flat Options list */}
            {filteredOptions && filteredOptions.length > 0 && (
              <div className="space-y-0.5">
                {filteredOptions.map((opt) => {
                  const isSelected = opt.value === value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value)
                        setIsOpen(false)
                        setSearch("")
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#251b5c] text-white font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-[#251b5c]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-1">
                        {opt.code && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                            isSelected ? "bg-white/20 text-white" : "bg-purple-50 text-[#382685]"
                          }`}>
                            {opt.code}
                          </span>
                        )}
                        <div className="truncate">
                          <div className={`truncate ${isSelected ? "text-white font-bold" : "text-slate-900 font-semibold"}`}>
                            {opt.label}
                          </div>
                          {opt.sublabel && (
                            <div className={`text-[10px] truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                              {opt.sublabel}
                            </div>
                          )}
                        </div>
                      </div>

                      {opt.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {opt.badge}
                        </span>
                      )}

                      {isSelected && <Check className="h-4 w-4 text-cyan-300 shrink-0 ml-1" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Grouped Options */}
            {filteredGroups && filteredGroups.length > 0 && (
              <div className="space-y-3 pt-1">
                {filteredGroups.map((grp) => (
                  <div key={grp.group} className="space-y-1">
                    <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/60 rounded-lg">
                      {grp.group}
                    </div>
                    <div className="space-y-0.5">
                      {grp.items.map((opt) => {
                        const isSelected = opt.value === value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              onChange(opt.value)
                              setIsOpen(false)
                              setSearch("")
                            }}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#251b5c] text-white font-bold shadow-xs"
                                : "text-slate-700 hover:bg-slate-50 hover:text-[#251b5c]"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate flex-1">
                              {opt.code && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                                  isSelected ? "bg-white/20 text-white" : "bg-purple-50 text-[#382685]"
                                }`}>
                                  {opt.code}
                                </span>
                              )}
                              <div className="truncate">
                                <div className={`truncate ${isSelected ? "text-white font-bold" : "text-slate-900 font-semibold"}`}>
                                  {opt.label}
                                </div>
                                {opt.sublabel && (
                                  <div className={`text-[10px] truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                                    {opt.sublabel}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {opt.price !== undefined && (
                                <span className={`font-black ${isSelected ? "text-cyan-300" : "text-slate-900"}`}>
                                  ₹{opt.price}
                                </span>
                              )}
                              {opt.c1 !== undefined && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                }`}>
                                  ₹{opt.c1} C1
                                </span>
                              )}
                              {isSelected && <Check className="h-3.5 w-3.5 text-cyan-300 ml-1" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results found */}
            {totalResultsCount === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching results for &ldquo;{search}&rdquo;
              </div>
            )}

          </div>

          {/* Footer count indicator */}
          {searchable && (
            <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium flex justify-between items-center">
              <span>{totalResultsCount} options available</span>
              <span>AVMLabs Diagnostics</span>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
