"use client"

import { useState } from "react"
import { 
  Users2, 
  UserPlus, 
  HandCoins, 
  IndianRupee, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  HelpCircle 
} from "lucide-react"

export default function NetworkTiers() {
  const [copied, setCopied] = useState(false)
  const inviteCode = "RAJESH-C1-X9A"
  const inviteLink = `https://avmlabs.in/cra?invitedBy=${inviteCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const subAgencies = [
    {
      id: "c2-1",
      name: "Rohan Associates",
      leadPerson: "Rohan V.",
      city: "Bengaluru",
      joinedDate: "01 Sep 2026",
      referredCount: 14,
      totalRR: 24000,
      overrideEarnings: 2400,
      status: "Active (High Volume)"
    },
    {
      id: "c2-2",
      name: "Priya Wellness Connect",
      leadPerson: "Priya S.",
      city: "Indiranagar",
      joinedDate: "05 Oct 2026",
      referredCount: 8,
      totalRR: 12000,
      overrideEarnings: 1200,
      status: "Active"
    },
    {
      id: "c2-3",
      name: "MediCare Clinic Outreach",
      leadPerson: "Dr. Suresh",
      city: "Whitefield",
      joinedDate: "20 Nov 2026",
      referredCount: 4,
      totalRR: 6000,
      overrideEarnings: 600,
      status: "Active"
    }
  ]

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200/80">
            <Sparkles className="h-3.5 w-3.5 text-[#382685]" /> Partner Team & Bonus
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e1b4b]">
            My Partner Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Invite other agents to join your team. You earn an extra <strong>10% bonus</strong> on all test bookings done by them.
          </p>
        </div>
      </div>

      {/* Network Invitation Code Banner (Compact & Sleek) */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1e1b4b] via-[#2e1f74] to-[#382685] text-white border border-white/10 shadow-lg overflow-hidden relative p-4 sm:p-6">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0 border border-white/20">
                <UserPlus className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9.5px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-white/15 text-cyan-300">
                  Your Team Invite Link
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">Invite Partners to Your Team</h3>
                <p className="text-xs text-blue-100/90 max-w-md leading-snug font-medium">
                  Share your link with colleagues, doctors, or agents to earn an extra 10% cash bonus on all their test bookings.
                </p>
              </div>
            </div>

            {/* Responsive Invite Box */}
            <div className="bg-slate-950/70 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-xl w-full lg:w-auto shrink-0">
              <div className="px-3.5 py-2 bg-white/10 rounded-xl text-center sm:text-left flex items-center justify-between sm:block border border-white/10">
                <div className="text-[9.5px] text-cyan-300 font-extrabold uppercase tracking-wider">Invite Code</div>
                <div className="font-mono text-base sm:text-lg font-black text-white tracking-wider leading-none mt-0.5 sm:mt-1">{inviteCode}</div>
              </div>

              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-10 px-4 rounded-xl bg-white text-[#251b5c] hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-[#382685]" />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Join AVMLabs as a partner with me and earn up to 30% on diagnostic tests: ${inviteLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Share2 className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Column */}
        <div className="space-y-4">
          
          {/* Card 1: Active Team Partners */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm bg-white p-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Team Partners
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="h-11 w-11 rounded-2xl bg-purple-50 flex items-center justify-center text-[#382685] font-bold border border-purple-100">
                <Users2 className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">3 Partners</div>
                <p className="text-[11px] text-slate-500 font-medium">Booking lab tests actively</p>
              </div>
            </div>
          </div>
          
          {/* Card 2: Total 10% Team Bonus */}
          <div className="rounded-2xl sm:rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 shadow-sm p-5 space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-800">
              Total 10% Team Bonus Earned
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="h-11 w-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <IndianRupee className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900">₹4,200</div>
                <p className="text-[11px] text-emerald-700 font-black">● 10% Automatic bonus on team orders</p>
              </div>
            </div>
          </div>

          {/* Card 3: Easy Explainer */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50/90 p-4 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-[#382685]" /> How Team Bonus Works:
            </div>
            <p className="leading-relaxed text-slate-600">
              When a partner in your team books a <strong>₹1,000 test</strong> for their customer, they get their 30% direct commission (₹300), and you automatically receive <strong>10% (₹100)</strong> in your wallet.
            </p>
          </div>
        </div>

        {/* Sub-Agencies Performance Table & Mobile Cards */}
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm bg-white p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Team Performance &amp; Earnings</h3>
            <p className="text-xs text-slate-500 font-medium">Customer bookings and your 10% bonus from each partner</p>
          </div>

          {/* Mobile Cards View (Visible on mobile screens < 768px) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {subAgencies.map((agency) => (
              <div key={agency.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2.5 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{agency.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{agency.leadPerson} • {agency.city}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200 shrink-0">
                    {agency.status}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10.5px]">Orders Total</span>
                    <div className="font-bold text-slate-900">₹{agency.totalRR.toLocaleString()} ({agency.referredCount} orders)</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10.5px]">Your 10% Bonus</span>
                    <div className="font-black text-[#251b5c]">₹{agency.overrideEarnings.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table View (Visible on tablet & desktop >= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5">Partner Name</th>
                  <th className="px-4 py-3.5">Joined Date</th>
                  <th className="px-4 py-3.5">Customer Orders Total</th>
                  <th className="px-4 py-3.5">Your 10% Bonus</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{agency.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{agency.leadPerson} • {agency.city}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {agency.joinedDate}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{agency.totalRR.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-black text-[#251b5c] text-sm">
                      ₹{agency.overrideEarnings.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-extrabold border border-emerald-200">
                        {agency.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}
