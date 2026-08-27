import { Activity, Percent, HandCoins, Building2, Calculator } from "lucide-react"

export function WhatToSell() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 text-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">What To Sell & The Economics</h2>
          <p className="text-lg text-slate-300">
            We provide a dozen highly sought-after Wellness Profiles. Here is a simplified breakdown of how your incentives are calculated.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Calculator className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Example: Wellness Profile Sale</h3>
              <p className="text-slate-400">Let's walk through the exact math for a standard test.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm font-medium mb-1">Catalogue Rate</div>
                  <div className="text-2xl font-bold text-white">₹1,000</div>
                  <div className="text-xs text-slate-500 mt-1">The base price of the wellness profile.</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Percent className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-slate-400 text-sm font-medium mb-1">Customer Discount (20%)</div>
                  <div className="text-2xl font-bold text-accent">- ₹200</div>
                  <div className="text-xs text-slate-500 mt-1">We give a standard 20% discount to all clients.</div>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-700">
                <div className="mt-1 h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <HandCoins className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-1">Realised Revenue (RR)</div>
                  <div className="text-4xl font-black text-white">₹800</div>
                  <div className="text-sm text-slate-400 mt-1">This is the amount upon which incentives are calculated.</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 space-y-6">
              <h4 className="font-semibold text-white border-b border-slate-700 pb-3">The Split</h4>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">Your C1 Incentive (30%)</div>
                  <div className="text-xs text-slate-400 mt-1">30% of ₹800 RR</div>
                </div>
                <div className="text-2xl font-bold text-green-400">₹240</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-slate-300 font-medium">Company Share</div>
                  <div className="text-xs text-slate-500 mt-1">Remaining amount</div>
                </div>
                <div className="text-xl font-bold text-slate-300">₹560</div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <div>
                  <div className="text-slate-400 text-sm font-medium">Home Collection (If needed)</div>
                  <div className="text-xs text-slate-500 mt-1">Charged extra to customer</div>
                </div>
                <div className="text-lg font-semibold text-slate-400">+ ₹200</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
