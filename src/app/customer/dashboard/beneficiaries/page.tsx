"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWorkflowStore, Beneficiary } from "@/lib/workflow-store"
import {
  Users,
  Plus,
  Search,
  MapPin,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  UserCheck,
  User,
  Check,
  Calendar,
  ChevronDown
} from "lucide-react"

export default function FamilyBeneficiariesPage() {
  const router = useRouter()
  const { 
    beneficiaries, 
    addBeneficiary, 
    updateBeneficiary, 
    removeBeneficiary,
    customer 
  } = useWorkflowStore()

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRelation, setSelectedRelation] = useState<string>("all")
  
  // Drawer / Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Manage drawer enter & exit animations
  useEffect(() => {
    if (isModalOpen) {
      setIsRendered(true)
      const timer = setTimeout(() => setIsVisible(true), 20)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsRendered(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    relation: "Other" as Beneficiary["relation"],
    age: 30,
    gender: "Male" as Beneficiary["gender"],
    address: customer ? "#42, 12th Cross, HAL 2nd Stage, Indiranagar" : "",
    city: "Bengaluru",
    pincode: "560038"
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filtered beneficiaries
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches = 
          b.fullName.toLowerCase().includes(q) ||
          b.relation.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q)
        if (!matches) return false
      }

      if (selectedRelation !== "all") {
        if (selectedRelation === "parents") {
          if (b.relation !== "Father" && b.relation !== "Mother") return false
        } else if (selectedRelation === "children") {
          if (b.relation !== "Son" && b.relation !== "Daughter") return false
        } else if (selectedRelation === "spouse") {
          if (b.relation !== "Wife" && b.relation !== "Husband") return false
        } else if (b.relation.toLowerCase() !== selectedRelation.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [beneficiaries, searchQuery, selectedRelation])

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingBeneficiary(null)
    setFormData({
      fullName: "",
      relation: "Other",
      age: 28,
      gender: "Male",
      address: beneficiaries[0]?.address || "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
      city: "Bengaluru",
      pincode: "560038"
    })
    setIsModalOpen(true)
  }

  // Open Modal for Edit
  const handleOpenEdit = (b: Beneficiary) => {
    setEditingBeneficiary(b)
    setFormData({
      fullName: b.fullName,
      relation: b.relation,
      age: b.age,
      gender: b.gender,
      address: b.address,
      city: b.city,
      pincode: b.pincode
    })
    setIsModalOpen(true)
  }

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName.trim()) return

    if (editingBeneficiary) {
      updateBeneficiary(editingBeneficiary.id, {
        fullName: formData.fullName.trim(),
        relation: formData.relation,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim()
      })
      showToast(`Updated details for ${formData.fullName.trim()}`)
    } else {
      addBeneficiary({
        fullName: formData.fullName.trim(),
        relation: formData.relation,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        selectedTests: []
      })
      showToast(`Added ${formData.fullName.trim()} to family beneficiaries`)
    }

    setIsModalOpen(false)
  }

  // Handle Delete
  const handleConfirmDelete = (id: string, name: string) => {
    removeBeneficiary(id)
    setDeleteConfirmId(null)
    showToast(`Removed ${name} from beneficiaries`)
  }

  return (
    <div className="space-y-4 sm:space-y-5 font-sans pb-16 text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HEADER SECTION                                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[5px] border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-[5px] bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Family Beneficiaries
                  </h1>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-[5px]">
                    {beneficiaries.length} Members Registered
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage family members for home collection bookings &amp; individual lab reports.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="h-10 px-5 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER STRIP                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[5px] border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member by name, relation, or city..."
            className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-[5px] border border-slate-300 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Relation Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-xs font-bold text-slate-500 shrink-0 hidden md:inline mr-1">
            Relation:
          </span>
          {[
            { id: "all", label: "All Members" },
            { id: "self", label: "Self" },
            { id: "parents", label: "Parents" },
            { id: "spouse", label: "Spouse" },
            { id: "children", label: "Children" }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedRelation(item.id)}
              className={`h-8 px-3.5 rounded-[5px] text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedRelation === item.id
                  ? "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs"
                  : "bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BENEFICIARIES LIST GRID                                                */}
      {/* ========================================================================= */}
      {filteredBeneficiaries.length === 0 ? (
        <div className="bg-white rounded-[5px] border border-slate-200 p-10 text-center space-y-3 shadow-xs">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No beneficiaries found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {searchQuery ? "No members matched your search query." : "You haven't added any family members under this category yet."}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-[5px] bg-[#1e3a8a] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#172554] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Beneficiary</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBeneficiaries.map((b) => {
            const isSelf = b.relation === "Self"
            const initials = b.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")

            const getRelationBadge = () => {
              if (isSelf) {
                return {
                  label: "Primary Account",
                  className: "bg-emerald-50 text-emerald-700 border-emerald-200"
                }
              }
              const relLower = b.relation.toLowerCase()
              if (relLower.includes("father") || relLower.includes("mother") || relLower.includes("parent")) {
                return {
                  label: b.relation,
                  className: "bg-blue-50 text-blue-800 border-blue-200"
                }
              }
              if (relLower.includes("spouse") || relLower.includes("wife") || relLower.includes("husband")) {
                return {
                  label: b.relation,
                  className: "bg-purple-50 text-purple-700 border-purple-200"
                }
              }
              if (relLower.includes("son") || relLower.includes("daughter") || relLower.includes("child")) {
                return {
                  label: b.relation,
                  className: "bg-amber-50 text-amber-800 border-amber-200"
                }
              }
              return {
                label: b.relation,
                className: "bg-slate-100 text-slate-700 border-slate-200"
              }
            }

            const badge = getRelationBadge()

            return (
              <div
                key={b.id}
                className="bg-white rounded-[5px] border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-2xs group"
              >
                {/* Member Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-[5px] bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center font-bold text-base shadow-xs ring-1 ring-blue-900/20 shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {b.fullName}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[5px] border shrink-0 ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                        <span className="font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-[5px]">
                          {b.relation}
                        </span>
                        <span className="font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-[5px]">
                          {b.age} Yrs
                        </span>
                        <span className="font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-[5px]">
                          {b.gender}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation Inline Alert */}
                {deleteConfirmId === b.id && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-[5px] text-xs space-y-2.5 animate-in fade-in-50">
                    <p className="text-rose-900 font-bold">
                      Remove <span className="underline">{b.fullName}</span> from family members?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(b.id, b.fullName)}
                        className="h-7 px-3 rounded-[5px] bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Yes, Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="h-7 px-3 rounded-[5px] bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Sample Collection Address Box */}
                <div className="bg-slate-50/80 rounded-[5px] border border-slate-200 p-3 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-[5px] bg-blue-50 text-[#1e3a8a] border border-blue-100 shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Sample Collection Address
                    </div>
                    <div className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
                      {b.address}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {b.city} — {b.pincode}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/booking?benId=${b.id}&mode=family`)}
                    className="h-8 px-3.5 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Book Test</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(b)}
                      className="h-8 px-3 rounded-[5px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(b.id)}
                        className="h-8 w-8 rounded-[5px] border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}



      {/* ========================================================================= */}
      {/* 5. ADD / EDIT BENEFICIARY SLIDE-OVER SIDEBAR DRAWER                       */}
      {/* ========================================================================= */}
      {isRendered && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with smooth blur and fade in/out */}
          <div
            className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsModalOpen(false)}
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
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-linear-to-r from-blue-50/70 via-white to-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[5px] bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs shrink-0">
                    <UserCheck className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingBeneficiary ? "Edit Beneficiary Details" : "Add Family Beneficiary"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter member details for accurate pathology reporting.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-[5px] border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Body - Form */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

                  {/* Quick Select Relationship Chips */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Quick Select Relation
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["Self", "Father", "Mother", "Wife", "Husband", "Son", "Daughter", "Brother", "Sister", "Friend", "Other"] as const).map((rel) => {
                        const isSelected = formData.relation === rel
                        return (
                          <button
                            key={rel}
                            type="button"
                            onClick={() => setFormData({ ...formData, relation: rel })}
                            className={`h-7 px-2.5 rounded-[5px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
                              isSelected
                                ? "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            <span>{rel}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Ramesh M."
                        className="w-full h-10 pl-9 pr-3 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Relation Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Relation with Account Holder <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <select
                        value={formData.relation}
                        onChange={(e) => setFormData({ ...formData, relation: e.target.value as Beneficiary["relation"] })}
                        className="w-full h-10 pl-9 pr-8 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors cursor-pointer appearance-none"
                      >
                        <option value="Self">Self (Account Holder)</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Wife">Wife</option>
                        <option value="Husband">Husband</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Age & Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Age (Years) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <input
                          type="number"
                          required
                          min={1}
                          max={120}
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                          className="w-full h-10 pl-9 pr-3 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors"
                          placeholder="e.g. 42"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as Beneficiary["gender"] })}
                          className="w-full h-10 px-3 pr-8 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors cursor-pointer appearance-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Collection Address */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Sample Collection Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Street address, flat / house number"
                        className="w-full h-10 pl-9 pr-3 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* City & PIN Code */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-10 px-3 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors"
                        placeholder="e.g. Bengaluru"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full h-10 px-3 rounded-[5px] border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] bg-slate-50/50 focus:bg-white transition-colors"
                        placeholder="e.g. 560038"
                      />
                    </div>
                  </div>

                </div>

                {/* Sticky Drawer Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 rounded-[5px] border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-[5px] bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingBeneficiary ? "Save Changes" : "Register Member"}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
