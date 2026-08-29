import { Network, ArrowRight, Coins, Users, UserCheck, CheckCircle2, Sparkles } from "lucide-react"

export function TierStructure() {
  return (
    <section className="py-16 md:py-24 bg-white font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#382685] text-xs font-black uppercase tracking-wider mb-3 border border-purple-200">
            <Sparkles className="h-3.5 w-3.5" /> Simple 2-Level Referral Model
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
            Transparent DSA Referral Workflow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            A straightforward referral benefit structure with zero multi-level complexity. Strict 2-level benefit ceiling.
          </p>
        </div>

        {/* 3 Connected Roles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Direct Referrer Role */}
          <div className="bg-purple-50/70 border-2 border-[#382685] rounded-3xl p-7 relative overflow-hidden shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-[#382685] text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                Direct Referrer
              </span>
              
              <div>
                <h3 className="text-3xl font-black text-slate-900">Direct Partner</h3>
                <p className="text-sm font-bold text-[#382685] mt-1">Refers B2C Customers</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-purple-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold">Direct Incentive:</span>
                  <span className="text-lg font-black text-emerald-800">30% of RR</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                  <span className="text-xs text-slate-600 font-bold">Calculation Base:</span>
                  <span className="text-xs font-bold text-slate-500">Realised Revenue</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Submits or books tests directly for customers &amp; earns 30%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Shares instant online payment link for customer checkout.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs font-bold text-[#382685] border-t border-purple-200">
              Example: Earn ₹240 cash on ₹800 realized revenue
            </div>
          </div>

          {/* Second-Level Introduced Partner Role */}
          <div className="bg-cyan-50/70 border-2 border-cyan-700 rounded-3xl p-7 relative overflow-hidden shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-cyan-800 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                Second-Level Benefit
              </span>
              
              <div>
                <h3 className="text-3xl font-black text-slate-900">Introduced Partner</h3>
                <p className="text-sm font-bold text-cyan-900 mt-1">Introduced Associate</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-cyan-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold">Partner Direct Share:</span>
                  <span className="text-lg font-black text-emerald-800">30% of RR</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                  <span className="text-xs text-slate-600 font-bold">Original Referrer:</span>
                  <span className="text-base font-black text-amber-700">10% Override</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Partner earns full 30% direct commission on customer orders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Referral chain strictly stops after 2 levels (0% beyond).</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs font-bold text-cyan-900 border-t border-cyan-200">
              Example: Partner gets ₹240, Referrer gets ₹80
            </div>
          </div>

          {/* Customer Role */}
          <div className="bg-emerald-50/70 border-2 border-emerald-600 rounded-3xl p-7 relative overflow-hidden shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-emerald-700 text-white text-[11px] font-black rounded-full uppercase tracking-wider">
                End Customer
              </span>
              
              <div>
                <h3 className="text-3xl font-black text-slate-900">Patient / Client</h3>
                <p className="text-sm font-bold text-emerald-900 mt-1">Diagnostic Beneficiary</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold">Referral Discount:</span>
                  <span className="text-lg font-black text-emerald-800">Flat 20% Off</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                  <span className="text-xs text-slate-600 font-bold">Sample Collection:</span>
                  <span className="text-xs font-bold text-slate-700">Home in 60 Mins (+₹200)</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pays discounted price (₹1,000 profile for only ₹800).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Certified digital report sent directly via WhatsApp &amp; Email.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs font-bold text-emerald-800 border-t border-emerald-200">
              Customer saves ₹200 on every booking
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
