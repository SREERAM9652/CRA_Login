"use client"

import { useState } from "react"
import Link from "next/link"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  Building2, 
  Users, 
  Layers, 
  Inbox, 
  FileSpreadsheet, 
  Coins, 
  CheckCircle2, 
  Sliders, 
  Globe, 
  Repeat, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  Phone, 
  Mail, 
  Sparkles, 
  IndianRupee, 
  Download,
  AlertCircle,
  Home,
  FlaskConical,
  Filter
} from "lucide-react"

export default function BackOfficeConsolePage() {
  const { orders, transactions, c1, c2List } = useWorkflowStore()
  
  const [activeTab, setActiveTab] = useState<
    "overview" | "onboarding" | "hierarchy" | "leads" | "incentives" | "payouts" | "pricing" | "legacy" | "retention"
  >("overview")

  const [toastMsg, setToastMsg] = useState("")

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3500)
  }

  // Mock Onboarding Queue
  const [onboardingQueue, setOnboardingQueue] = useState([
    {
      id: "KYC-101",
      name: "Dr. Arvind Swamy",
      mobile: "+91 98450 77665",
      type: "C1 (Primary Partner)",
      city: "Hyderabad",
      docs: "Aadhaar + Agreement Signed",
      status: "Pending Approval"
    },
    {
      id: "KYC-102",
      name: "Kavita Reddy",
      mobile: "+91 97400 33221",
      type: "C2 (Under Rajesh Joshi)",
      city: "Bengaluru",
      docs: "PAN + Agreement Signed",
      status: "Pending Approval"
    }
  ])

  // Mock Central Leads Inbox (< 24h follow-up)
  const [leadsInbox, setLeadsInbox] = useState([
    {
      id: "LEAD-901",
      customerName: "Ramesh Patel",
      mobile: "+91 98765 43210",
      city: "Hyderabad",
      interestedProfile: "Comprehensive Master Health Profile",
      referredBy: "Rajesh Joshi (C1)",
      submittedAt: "2 hrs ago",
      assignedBDE: "Vikram (Ops Hub)",
      status: "Contacted"
    },
    {
      id: "LEAD-902",
      customerName: "Ananya Sharma",
      mobile: "+91 98450 11998",
      city: "Bengaluru",
      interestedProfile: "Women Wellness Profile",
      referredBy: "Sudheer DSA (C2)",
      submittedAt: "4 hrs ago",
      assignedBDE: "Deepa (BDE Care)",
      status: "Sample Scheduled"
    },
    {
      id: "LEAD-903",
      customerName: "Karthik Verma",
      mobile: "+91 97400 88221",
      city: "Chennai",
      interestedProfile: "Executive Diabetes & Heart",
      referredBy: "Rajesh Joshi (C1)",
      submittedAt: "10 mins ago",
      assignedBDE: "Unassigned",
      status: "New (<24h SARC SLA)"
    }
  ])

  const handleApproveKYC = (id: string, name: string) => {
    setOnboardingQueue(prev => prev.filter(k => k.id !== id))
    showToast(`✓ Approved KYC for ${name}. Credentials and app access sent via SMS!`)
  }

  const handleAssignBDE = (leadId: string) => {
    setLeadsInbox(prev => prev.map(l => l.id === leadId ? { ...l, assignedBDE: "Assigned (You)", status: "Follow-up Scheduled" } : l))
    showToast(`✓ Lead assigned to care coordinator for immediate customer call.`)
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 border border-emerald-400/30">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg("")} className="text-emerald-200 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Console Top Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-950 text-[10.5px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Back Office Master Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            CRA Operations &amp; Incentive Reconciler
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Full governance of B2C Client Referral Agencies, 24h lead dispatch, and automated RR incentive engines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/cra/dashboard"
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <span>Open CRA Portal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Module Navigation Tabs (Scoped in Section 04 of Build Spec) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        {[
          { id: "overview", label: "Executive Overview", icon: BarChart3 },
          { id: "onboarding", label: "Onboarding Queue (KYC)", icon: Users, badge: onboardingQueue.length },
          { id: "hierarchy", label: "CRA Hierarchy (C1/C2)", icon: Layers },
          { id: "leads", label: "Lead Inbox (<24h)", icon: Inbox, badge: leadsInbox.length },
          { id: "incentives", label: "RR & Incentive Engine", icon: Coins },
          { id: "payouts", label: "Payout Batches", icon: FileSpreadsheet },
          { id: "pricing", label: "Catalogue & Price Rules", icon: Sliders },
          { id: "legacy", label: "Legacy / GCC Terms", icon: Globe },
          { id: "retention", label: "Quarterly Retention", icon: Repeat },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#1e1b4b] text-white shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === tab.id ? "bg-cyan-400 text-slate-950" : "bg-purple-100 text-purple-900"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXECUTIVE OVERVIEW                                                  */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total CRAs Active</div>
              <div className="text-3xl font-black text-slate-900">48 Agents</div>
              <p className="text-[10.5px] text-slate-500 font-medium">18 Primary (C1) • 30 Introduced (C2)</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Realised Revenue (RR)</div>
              <div className="text-3xl font-black text-indigo-950">₹3,84,000</div>
              <p className="text-[10.5px] text-emerald-600 font-bold">100% Diagnostic Realised Base</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Total Payouts Dispatched</div>
              <div className="text-3xl font-black text-emerald-900">₹1,15,200</div>
              <p className="text-[10.5px] text-emerald-700 font-medium">30% Direct + 10% Overrides</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">Net Lab Retained Share</div>
              <div className="text-3xl font-black text-purple-950">₹2,68,800</div>
              <p className="text-[10.5px] text-purple-700 font-medium">70% (Direct) / 60% (Team)</p>
            </div>
          </div>

          {/* Core Workflow Pillars (From Build Spec Section 00 & 01) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#2e1f74] text-white p-6 rounded-3xl shadow-md space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">01. Scope Guardrails</div>
              <h3 className="font-black text-lg text-white">B2C Wellness Only</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Zero B2B or corporate-account confusion. CRAs see only wellness health profiles and earn purely on Realised Revenue (RR).
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#382685]">02. Strict 2-Tier Ceiling</div>
              <h3 className="font-black text-lg text-slate-900">C1 (30%) &amp; C2 (10%)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                C1 refers directly $\rightarrow$ 30%. C2 refers $\rightarrow$ C2 gets 30%, C1 gets 10%. Chain strictly terminates at level 2.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">03. Automated Settlement</div>
              <h3 className="font-black text-lg text-slate-900">Direct Bank / UPI Ledger</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ledger calculates incentives in real time upon online payment completion. Batched and disbursed on the 1st and 15th of every month.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ONBOARDING QUEUE                                                   */}
      {/* ========================================================================= */}
      {activeTab === "onboarding" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900">CRA KYC &amp; Onboarding Approvals</h3>
              <p className="text-xs text-slate-500">Review prospective C1 and C2 credentials before issuing app access</p>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-900 text-xs font-bold rounded-xl border border-purple-200">
              {onboardingQueue.length} Pending
            </span>
          </div>

          {onboardingQueue.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              All KYC requests have been reviewed and approved.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Applicant Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Tier Application</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Verification Docs</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {onboardingQueue.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-4 font-bold text-slate-900">{item.name}</td>
                      <td className="px-4 py-4 text-slate-600 font-mono">{item.mobile}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 font-extrabold text-[10.5px] border border-purple-200">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700">{item.city}</td>
                      <td className="px-4 py-4 text-slate-500 font-medium">{item.docs}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleApproveKYC(item.id, item.name)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve &amp; Issue Code</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CRA HIERARCHY MASTER                                               */}
      {/* ========================================================================= */}
      {activeTab === "hierarchy" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">Master CRA Relationship Tree</h3>
            <p className="text-xs text-slate-500">Visual hierarchy of Primary C1 partners and their nested C2 associates</p>
          </div>

          {/* Tree Node Example */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-purple-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#1e1b4b] text-white flex items-center justify-center font-bold text-xs">
                  C1
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm">{c1.name}</div>
                  <div className="text-[11px] text-slate-500">{c1.mobile} • Code: <span className="font-mono font-bold text-[#382685]">{c1.code}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-slate-600">Direct Realised: <b className="text-slate-900">₹48,000</b></span>
                <span className="text-emerald-700">30% Earned: <b className="text-emerald-900">₹14,400</b></span>
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-[10.5px]">Primary CRA</span>
              </div>
            </div>

            {/* Nested C2 Children */}
            <div className="pl-6 sm:pl-10 space-y-2.5 border-l-2 border-dashed border-purple-300 ml-4 sm:ml-5">
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">Introduced C2 Associates (10% Team Override to C1)</div>
              {c2List.map(c2 => (
                <div key={c2.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-cyan-800 text-white flex items-center justify-center font-bold text-xs">
                      C2
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{c2.name}</div>
                      <div className="text-[10px] text-slate-500">{c2.mobile} • Code: <span className="font-mono font-bold">{c2.code}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-600">C2 Sales: <b>₹24,000</b></span>
                    <span className="text-emerald-700">C2 30%: <b>₹7,200</b></span>
                    <span className="text-amber-700">C1 10% Override: <b>₹2,400</b></span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-900 font-bold text-[10px]">C2 Associate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CENTRAL LEAD INBOX (< 24h SLA)                                      */}
      {/* ========================================================================= */}
      {activeTab === "leads" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900">Central Lead Inbox (SARC 24h SLA)</h3>
              <p className="text-xs text-slate-500">Shared inbox where operations &amp; BDE team coordinates with CRAs to close bookings</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              SLA: &lt; 24h Call Guarantee
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Customer Lead</th>
                  <th className="px-4 py-3">Interested Health Profile</th>
                  <th className="px-4 py-3">Referred By</th>
                  <th className="px-4 py-3">Assigned BDE</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leadsInbox.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{lead.customerName}</div>
                      <div className="text-[10.5px] text-slate-500 font-mono">{lead.mobile} • {lead.city}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {lead.interestedProfile}
                      <div className="text-[10px] text-slate-400">Submitted: {lead.submittedAt}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#382685]">{lead.referredBy}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{lead.assignedBDE}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        lead.status.includes("Contacted") ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {lead.assignedBDE === "Unassigned" ? (
                        <button
                          type="button"
                          onClick={() => handleAssignBDE(lead.id)}
                          className="px-3 py-1 rounded-lg bg-[#251b5c] text-white font-bold text-xs hover:bg-[#1e1b4b]"
                        >
                          Claim &amp; Call
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">In Progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RR & INCENTIVE ENGINE                                              */}
      {/* ========================================================================= */}
      {activeTab === "incentives" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">Realised Revenue (RR) Incentive Ledger</h3>
            <p className="text-xs text-slate-500">Automated 30% / 10% splits calculated strictly on Realised Revenue</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">MRP (₹)</th>
                  <th className="px-4 py-3">20% Off</th>
                  <th className="px-4 py-3">RR (Base)</th>
                  <th className="px-4 py-3">Home (+₹200)</th>
                  <th className="px-4 py-3">Direct (30%)</th>
                  <th className="px-4 py-3">Team (10%)</th>
                  <th className="px-4 py-3">Lab Retained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3.5 font-mono font-black text-slate-900">{o.orderNumber}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{o.customerName}</td>
                    <td className="px-4 py-3.5 text-slate-500">₹{o.cataloguePrice}</td>
                    <td className="px-4 py-3.5 text-rose-600 font-bold">-₹{o.discount}</td>
                    <td className="px-4 py-3.5 font-black text-indigo-950">₹{o.realizedRevenue}</td>
                    <td className="px-4 py-3.5 text-slate-500">₹{o.homeCollectionFee}</td>
                    <td className="px-4 py-3.5 font-black text-emerald-800">+₹{Math.round(o.realizedRevenue * 0.3)}</td>
                    <td className="px-4 py-3.5 font-black text-purple-800">+₹{Math.round(o.realizedRevenue * 0.1)}</td>
                    <td className="px-4 py-3.5 font-black text-slate-800">₹{Math.round(o.realizedRevenue * 0.6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CATALOGUE & PRICE RULES                                            */}
      {/* ========================================================================= */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">Commercial Rule Engine</h3>
            <p className="text-xs text-slate-500">Master configuration of discount rates, logistics fees, and incentive rules</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Customer Discount Rule</span>
              <div className="text-2xl font-black text-slate-900">20% Flat Discount</div>
              <p className="text-[11px] text-slate-500">Automatically deducted from B2C catalogue rate</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Home Phlebotomy Fee</span>
              <div className="text-2xl font-black text-slate-900">₹200 Fixed Charge</div>
              <p className="text-[11px] text-slate-500">Direct logistics recovery; sits outside incentive split</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Incentive Architecture</span>
              <div className="text-2xl font-black text-emerald-800">30% Direct / 10% Team</div>
              <p className="text-[11px] text-slate-500">Calculated strictly on Realised Revenue (RR)</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: LEGACY / GCC FLAG                                                  */}
      {/* ========================================================================= */}
      {activeTab === "legacy" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">Legacy &amp; GCC Structure Governance (Section 03)</h3>
            <p className="text-xs text-slate-500">Rules separating existing terms from the simplified C1/C2 model</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                Legacy Active Flag
              </span>
              <h4 className="font-black text-slate-900 text-base">Existing CRAs (incl. GCC)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Current contract terms continue unchanged through <strong>31 Dec 2027</strong>. No forced mid-stream migration.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                New Standard Model
              </span>
              <h4 className="font-black text-slate-900 text-base">New Onboardings Today (India &amp; GCC)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every newly onboarded CRA joins directly under the clean <strong>Two-Tier (30% / 10%)</strong> logic.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: RETENTION ENGINE                                                   */}
      {/* ========================================================================= */}
      {activeTab === "retention" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">Quarterly Retest Retention Engine</h3>
            <p className="text-xs text-slate-500">Automated 90-day retest nudges generated for CRAs to retain clients</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs">
            <div className="font-bold text-indigo-950 flex items-center gap-2">
              <Repeat className="h-4 w-4 text-indigo-600" />
              <span>Step 9: Retain &amp; Repeat Automation</span>
            </div>
            <p className="text-slate-600">
              When 90 days elapse from a patient&apos;s previous test, the CRA app receives an automatic one-tap WhatsApp nudge reminder. When rebooked, the CRA earns 30% again!
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
