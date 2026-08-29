"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { Sparkles, RefreshCw, Smartphone, Monitor, ChevronRight } from "lucide-react"

export default function PrototypeNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { switchRole, resetDemo, currentUser } = useWorkflowStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleNav = (target: "home" | "login" | "sreeram" | "sudheer" | "mahendra" | "vishnu" | "customer-ref" | "customer-reg" | "backoffice") => {
    switch (target) {
      case "home":
        router.push("/")
        break
      case "login":
        router.push("/login")
        break
      case "sreeram":
        switchRole("sreeram")
        router.push("/cra/dashboard")
        break
      case "sudheer":
        switchRole("sudheer")
        router.push("/cra/dashboard")
        break
      case "mahendra":
        switchRole("mahendra")
        router.push("/cra/dashboard")
        break
      case "vishnu":
        switchRole("vishnu")
        router.push("/cra/dashboard")
        break
      case "customer-ref":
        switchRole("customer")
        router.push("/customer/dashboard?referred=true")
        break
      case "customer-reg":
        switchRole("customer")
        router.push("/customer/dashboard?referred=false")
        break
      case "backoffice":
        router.push("/backoffice")
        break
    }
  }

  const handleReset = () => {
    if (confirm("Reset prototype state to default demonstration data?")) {
      resetDemo()
      router.push("/")
    }
  }

  return (
    <div className="bg-[#18181b] text-zinc-200 border-b border-zinc-800 text-[11px] font-mono px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap sticky top-0 z-50 shadow-md">
      
      {/* Title */}
      <span className="font-bold text-[#8FA6FF] uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1 shrink-0">
        <Sparkles className="h-3 w-3 text-[#8FA6FF]" />
        <span>Switch Account:</span>
      </span>

      {/* Account 1: Thuraka Sreeram (C1) */}
      <button
        type="button"
        onClick={() => handleNav("sreeram")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname.startsWith("/cra") && currentUser.id === "C1-SREERAM"
            ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" 
            : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
        title="Thuraka Sreeram - Root Primary CRA Partner (C1)"
      >
        👑 Sreeram (C1)
      </button>

      {/* Account 2: Sudheer Reddy (C2) */}
      <button
        type="button"
        onClick={() => handleNav("sudheer")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname.startsWith("/cra") && currentUser.id === "C2-SUDHEER"
            ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" 
            : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
        title="Sudheer Reddy - Secondary Partner under Sreeram (C2)"
      >
        🩺 Sudheer (C2)
      </button>

      {/* Account 3: Sai Mahendra (C2) */}
      <button
        type="button"
        onClick={() => handleNav("mahendra")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname.startsWith("/cra") && currentUser.id === "C2-MAHENDRA"
            ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" 
            : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
        title="Sai Mahendra - Secondary Partner & Referrer of Vishnu (C2)"
      >
        🚀 Sai Mahendra (C2)
      </button>

      {/* Account 4: Vishnu (C2 under Mahendra) */}
      <button
        type="button"
        onClick={() => handleNav("vishnu")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname.startsWith("/cra") && currentUser.id === "C2-VISHNU"
            ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" 
            : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
        title="Vishnu Vardhan - Secondary Partner under Sai Mahendra (C2)"
      >
        🔬 Vishnu (C2)
      </button>

      <span className="text-zinc-600 px-0.5">/</span>

      <button
        type="button"
        onClick={() => handleNav("login")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname === "/login" ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
      >
        Login Page
      </button>

      <button
        type="button"
        onClick={() => handleNav("customer-ref")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname.startsWith("/customer") ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
      >
        Customer
      </button>

      <button
        type="button"
        onClick={() => handleNav("backoffice")}
        className={`px-2.5 py-1 rounded border text-[11px] cursor-pointer transition-colors ${
          pathname.startsWith("/backoffice") ? "bg-[#2F5FDE] border-[#2F5FDE] text-white font-bold" : "bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        }`}
      >
        Marketing MIS
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-800 text-zinc-400 text-[10.5px] cursor-pointer transition-colors ml-auto flex items-center gap-1"
        title="Reset Demo Data"
      >
        <RefreshCw className="h-3 w-3" />
        <span>Reset</span>
      </button>
    </div>
  )
}
