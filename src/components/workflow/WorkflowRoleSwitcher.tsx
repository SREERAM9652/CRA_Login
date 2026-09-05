"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { Sparkles, Users, UserCheck, RotateCcw, ArrowRight, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function WorkflowRoleSwitcher() {
  const { currentUser, c1, c2List, switchRole, resetDemo } = useWorkflowStore()

  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#1a1438] to-slate-900 text-white text-xs py-2 px-3 sm:px-4 border-b border-indigo-950/80 shadow-md no-print print:hidden z-50 sticky top-0">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: Workflow Controller Label */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" /> Interactive Flow Simulator
          </span>
          <span className="hidden sm:inline text-slate-300 text-[11px]">
            Live Wireframe Persona:
          </span>
        </div>

        {/* Center: Switch Persona Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          
          {/* C1 Button */}
          <button
            type="button"
            onClick={() => switchRole("c1")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentUser.role === "c1"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-300 font-black"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>👑 C1 Primary (Rajesh)</span>
            <span className="text-[10px] opacity-80 font-normal">30% + 10%</span>
          </button>

          {/* C2 Button */}
          <button
            type="button"
            onClick={() => switchRole("c2")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentUser.role === "c2"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40 ring-2 ring-cyan-300 font-black"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            <span>🤝 C2 Secondary ({c2List[0]?.name.split(" ")[0] || "Rohan"})</span>
            <span className="text-[10px] opacity-80 font-normal">30% Direct</span>
          </button>

          {/* Customer Button */}
          <button
            type="button"
            onClick={() => switchRole("customer")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentUser.role === "customer"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-2 ring-emerald-300 font-black"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-300" />
            <span>👤 Customer View</span>
          </button>
        </div>

        {/* Right: Reset Demo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset demo data to initial state?")) {
                resetDemo()
              }
            }}
            title="Reset to fresh demo state"
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo</span>
          </button>
        </div>

      </div>
    </div>
  )
}
