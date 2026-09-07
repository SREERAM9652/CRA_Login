"use client"

import React, { useState, useEffect } from "react"
import { X, User, Users, MapPin, Sparkles, Check, Calendar, ChevronDown } from "lucide-react"

export interface FamilyMemberFormData {
  name: string
  relation: "Self" | "Father" | "Mother" | "Wife" | "Husband" | "Son" | "Daughter" | "Brother" | "Sister" | "Friend" | "Other"
  age: string
  gender: "Male" | "Female" | "Other"
  address: string
}

interface AddFamilyMemberDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FamilyMemberFormData) => void
  defaultAddress?: string
  initialData?: FamilyMemberFormData | null
  title?: string
}

const COMMON_RELATIONS: Array<FamilyMemberFormData["relation"]> = [
  "Self",
  "Father",
  "Mother",
  "Wife",
  "Husband",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Friend",
  "Other"
]

export function AddFamilyMemberDrawer({
  isOpen,
  onClose,
  onSave,
  defaultAddress = "",
  initialData = null,
  title
}: AddFamilyMemberDrawerProps) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  const [formData, setFormData] = useState<FamilyMemberFormData>({
    name: "",
    relation: "Father",
    age: "",
    gender: "Male",
    address: defaultAddress
  })

  const [errors, setErrors] = useState<{ name?: string; age?: string; address?: string }>({})

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

  // Reset or initialize form whenever drawer opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          relation: initialData.relation || "Father",
          age: initialData.age ? String(initialData.age) : "",
          gender: initialData.gender || "Male",
          address: initialData.address || defaultAddress
        })
      } else {
        setFormData({
          name: "",
          relation: "Father",
          age: "",
          gender: "Male",
          address: defaultAddress
        })
      }
      setErrors({})
    }
  }, [isOpen, initialData, defaultAddress])

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

  if (!isRendered) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; age?: string; address?: string } = {}
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required"
    } else {
      const ageNum = parseInt(formData.age, 10)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Please enter a valid age (1-120)"
      }
    }
    if (!formData.address.trim()) {
      newErrors.address = "Collection address is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
    onClose()
  }

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
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 pointer-events-auto sm:rounded-l-[5px] transform transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-linear-to-r from-blue-50/70 via-white to-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[5px] bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs shrink-0">
                <Users className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {title || (initialData ? "Edit Family Member" : "Add Family Member")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select tests and home sample collection for this member.
                </p>
              </div>
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

          {/* Form Body - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                  <span>Full Name *</span>
                  {errors.name && <span className="text-rose-500 font-normal">{errors.name}</span>}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramanathan M."
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={`h-10 w-full pl-9 pr-3.5 rounded-[5px] border text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-xs transition-all ${
                      errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                </div>
              </div>

              {/* Relation & Age */}
              <div className="grid grid-cols-2 gap-3">
                {/* Relation Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 text-xs flex items-center h-4">
                    <span>Relation *</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <select
                      value={formData.relation}
                      onChange={(e) => setFormData({ ...formData, relation: e.target.value as any })}
                      className="h-10 w-full pl-9 pr-8 rounded-[5px] border border-slate-300 text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-xs transition-all font-medium appearance-none cursor-pointer"
                    >
                      {COMMON_RELATIONS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Age Input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 text-xs flex items-center justify-between h-4">
                    <span>Age (Yrs) *</span>
                    {errors.age && <span className="text-rose-500 font-normal text-[10px]">{errors.age}</span>}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      placeholder="e.g. 70"
                      value={formData.age}
                      onChange={(e) => {
                        setFormData({ ...formData, age: e.target.value })
                        if (errors.age) setErrors({ ...errors, age: undefined })
                      }}
                      className={`h-10 w-full pl-9 pr-3 rounded-[5px] border text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-xs transition-all ${
                        errors.age ? "border-rose-400 bg-rose-50/20" : "border-slate-300"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Relation Chips */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Select Relation</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Self", "Father", "Mother", "Wife", "Husband", "Son", "Daughter"].map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setFormData({ ...formData, relation: rel as any })}
                      className={`h-7 px-3 rounded-[5px] text-[11px] font-semibold border flex items-center justify-center transition-all cursor-pointer ${
                        formData.relation === rel
                          ? "bg-blue-50 text-[#1e3a8a] border-blue-300 shadow-2xs font-bold"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Radio Segment */}
              <div className="space-y-1.5 pt-0.5">
                <label className="font-bold text-slate-700 text-xs block">Gender *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Male", "Female", "Other"] as const).map((g) => {
                    const isSelected = formData.gender === g
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`h-10 rounded-[5px] border font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        <span>{g}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Collection Address */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 text-xs">
                    Collection Address *
                  </label>
                  {defaultAddress && formData.address !== defaultAddress && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, address: defaultAddress })}
                      className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Use Primary Address
                    </button>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  <textarea
                    rows={2}
                    required
                    placeholder="Street address, apartment, locality, city & pincode"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value })
                      if (errors.address) setErrors({ ...errors, address: undefined })
                    }}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-[5px] border text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] text-xs transition-all leading-relaxed ${
                      errors.address ? "border-rose-400 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Phlebotomist will visit this address for blood / urine sample collection.
                </p>
              </div>
              

            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-[5px] border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-[5px] bg-[#1e3a8a] hover:bg-[#152e6f] text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{initialData ? "Update Member" : "Save Member"}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
