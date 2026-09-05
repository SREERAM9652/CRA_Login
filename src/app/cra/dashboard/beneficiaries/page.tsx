"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore, Beneficiary } from "@/lib/workflow-store"
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  FlaskConical, 
  Heart, 
  Sparkles,
  X,
  Phone
} from "lucide-react"

export default function CRABeneficiariesPage() {
  const router = useRouter()
  const { currentUser, beneficiaries, addBeneficiary, updateBeneficiary, removeBeneficiary, customProfiles } = useWorkflowStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    relation: "Father" as Beneficiary["relation"],
    age: "",
    gender: "Male" as Beneficiary["gender"],
    address: "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    pincode: "560038"
  })
  const [feedback, setFeedback] = useState("")

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      fullName: "",
      relation: "Father",
      age: "",
      gender: "Male",
      address: beneficiaries[0]?.address || "#42, 12th Cross, HAL 2nd Stage, Indiranagar",
      city: beneficiaries[0]?.city || "Bengaluru",
      pincode: beneficiaries[0]?.pincode || "560038"
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (ben: Beneficiary) => {
    setEditingId(ben.id)
    setFormData({
      fullName: ben.fullName,
      relation: ben.relation,
      age: ben.age.toString(),
      gender: ben.gender,
      address: ben.address,
      city: ben.city,
      pincode: ben.pincode
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName.trim() || !formData.age) return

    if (editingId) {
      updateBeneficiary(editingId, {
        fullName: formData.fullName.trim(),
        relation: formData.relation,
        age: parseInt(formData.age, 10) || 30,
        gender: formData.gender,
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim()
      })
      setFeedback("Beneficiary details updated successfully!")
    } else {
      addBeneficiary({
        fullName: formData.fullName.trim(),
        relation: formData.relation,
        age: parseInt(formData.age, 10) || 30,
        gender: formData.gender,
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        selectedTests: ["pkg-fullbody"]
      })
      setFeedback("New family member added to your CRA account!")
    }

    setModalOpen(false)
    setTimeout(() => setFeedback(""), 3000)
  }

  const handleBookForMember = (ben: Beneficiary) => {
    // Direct checkout pre-selecting this beneficiary
    router.push(`/booking?ref=${currentUser.code}&benName=${encodeURIComponent(ben.fullName)}&benId=${ben.id}`)
  }

  return (
    <div className="w-full font-sans space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/cra/dashboard" className="hover:text-indigo-900 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Family Beneficiaries</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F5FDE] border border-blue-200">
              Personal &amp; Family Care
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage your personal family members • MakeMyTrip-style beneficiary selection for diagnostic tests &amp; custom profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="h-10 px-4 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add Family Member</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-md animate-in fade-in flex items-center gap-2 border border-emerald-400/30">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Dual Context Notice Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-950 font-medium">
        <div className="flex items-center gap-2.5">
          <Heart className="h-5 w-5 text-rose-500 shrink-0" />
          <div>
            <strong>CRA Personal Booking Privilege:</strong> Because you are a CRA, you can book diagnostic tests and custom profiles for your own family at 20% off, paid online or directly debited from your CRA Wallet balance!
          </div>
        </div>
      </div>

      {/* Beneficiaries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beneficiaries.map((ben) => (
          <div
            key={ben.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header: Avatar, Name, Relation */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] to-[#382685] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {ben.fullName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-black text-sm text-slate-900">{ben.fullName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#382685] border border-purple-200">
                        {ben.relation}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-500 font-medium">{ben.gender}, {ben.age} yrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ben)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit details"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {ben.relation !== "Self" && (
                    <button
                      type="button"
                      onClick={() => removeBeneficiary(ben.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Address details */}
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600 border border-slate-100">
                <div className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11.5px] leading-relaxed line-clamp-2">
                    {ben.address}, {ben.city} - {ben.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Test Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleBookForMember(ben)}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-[#1e1b4b] to-[#382685] hover:from-[#0f172a] hover:to-[#251b5c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <FlaskConical className="h-3.5 w-3.5 text-cyan-300" />
                <span>Book Test for {ben.fullName.split(" ")[0]}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Beneficiary Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200/90 p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-[#382685]" />
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  {editingId ? "Edit Family Beneficiary" : "Add Family Beneficiary"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramanathan M."
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Relationship <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 70"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                  Sample Collection Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat/House No., Street, Area"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru, Hyderabad"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10.5px] tracking-wider mb-1">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 560038"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  {editingId ? "Save Changes" : "Add Beneficiary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
