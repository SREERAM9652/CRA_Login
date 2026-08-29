"use client"

import { useState } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Clock, 
  Coins, 
  Users,
  X,
  ArrowRight
} from "lucide-react"

export function LiveReferralTicker() {
  const { liveEvents, simulateLiveReferral } = useWorkflowStore()
  const [showSimToast, setShowSimToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const handleSimulate = () => {
    const order = simulateLiveReferral()
    setToastMsg(`⚡ Real-Time Booking: ${order.customerName} booked ${order.profileName}! +₹${Math.round(order.realizedRevenue * 0.3)} credited to your wallet.`)
    setShowSimToast(true)
    setTimeout(() => setShowSimToast(false), 4500)
  }

  return (
    <div className="space-y-3 font-sans">
      
      {/* Live Toast Notification on Real-Time Trigger */}
      {showSimToast && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-700 via-teal-800 to-indigo-950 text-white rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 border border-emerald-400/30">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center text-emerald-200">
              <Zap className="h-4 w-4 fill-emerald-300" />
            </div>
            <span className="text-xs font-bold">{toastMsg}</span>
          </div>
          <button onClick={() => setShowSimToast(false)} className="text-emerald-200 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Live Activity Container */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Header with Live Pulsing Badge & Simulation Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>Real-Time Referral Stream</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  LIVE
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-500 font-medium">Instant updates as customer bookings and payouts occur</p>
            </div>
          </div>

          {/* Simulate Action Button */}
          <button
            type="button"
            onClick={handleSimulate}
            className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#251b5c] to-[#382685] hover:opacity-90 text-white text-[11px] font-black inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform hover:scale-102"
          >
            <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
            <span>Simulate Live Referral</span>
          </button>
        </div>

        {/* Live Activity Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {liveEvents.slice(0, 3).map((event) => (
            <div 
              key={event.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-2 hover:bg-purple-50/50 hover:border-purple-200 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-slate-900 text-xs truncate">
                  {event.title}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                  {event.timestamp}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                {event.subtitle}
              </div>

              {event.amount && (
                <div className="text-[11px] font-black text-emerald-700 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>+₹{event.amount} Added to Wallet</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
