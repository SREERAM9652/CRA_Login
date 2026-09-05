"use client"

import { useState, useMemo } from "react"
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
  UserCheck
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
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Family Beneficiaries
              </h1>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                {beneficiaries.length} Members Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              Add family members to book health checkups, track individual pathology records, and schedule door-step sample collections for your entire household.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="h-9 px-4 rounded-xl bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Household</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {beneficiaries.length} Beneficiaries
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Primary Contact</div>
            <div className="text-sm font-bold text-[#1e3a8a] truncate mt-0.5">
              {beneficiaries.find(b => b.relation === "Self")?.fullName || "Suresh M."}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Registered City</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Bengaluru (560038)
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Digital Coverage</div>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              100% Active Profiles
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER STRIP                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member by name, relation, or city..."
            className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Relation Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden md:inline">
            Relation:
          </span>
          {[
            { id: "all", label: "All" },
            { id: "self", label: "Self" },
            { id: "parents", label: "Parents" },
            { id: "spouse", label: "Spouse" },
            { id: "children", label: "Children" }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedRelation(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRelation === item.id
                  ? "bg-[#1e3a8a] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No beneficiaries found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {searchQuery ? "No members matched your search query." : "You haven't added any family members under this category yet."}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#1e3a8a] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Beneficiary</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredBeneficiaries.map((b) => {
            const isSelf = b.relation === "Self"
            const initials = b.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all space-y-3.5 flex flex-col justify-between"
              >
                {/* Member Top Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-blue-900/15 shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {b.fullName}
                        </h3>
                        {isSelf && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                            Primary Account
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{b.relation}</span>
                        <span>•</span>
                        <span>{b.age} Yrs</span>
                        <span>•</span>
                        <span>{b.gender}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete Confirmation Inline Alert */}
                {deleteConfirmId === b.id && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2 animate-in fade-in-50">
                    <p className="text-rose-800 font-medium">
                      Remove <strong>{b.fullName}</strong> from family beneficiaries?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(b.id, b.fullName)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Yes, Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Home Address Info */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-slate-600 text-[11px] leading-relaxed">
                    <span className="font-semibold text-slate-800">{b.address}</span>, {b.city} - {b.pincode}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}



      {/* ========================================================================= */}
      {/* 5. ADD / EDIT BENEFICIARY POPUP MODAL                                     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {editingBeneficiary ? "Edit Beneficiary Details" : "Add New Family Beneficiary"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Enter member details for accurate pathology reporting.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh M."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Relation <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value as Beneficiary["relation"] })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium cursor-pointer"
                  >
                    <option value="Self">Self</option>
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
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Beneficiary["gender"] })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Collection Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, flat / house number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  {editingBeneficiary ? "Save Changes" : "Register Member"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
