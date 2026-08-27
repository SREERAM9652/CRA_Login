import { Network, ArrowDownCircle, Coins } from "lucide-react"

export function TierStructure() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">The Tier Structure: C1 and C2</h2>
          <p className="text-lg text-slate-600">
            Maximize your earnings by building a network. Introduce new sub-agencies and earn passive incentives.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          {/* C1 Tier */}
          <div className="flex-1 w-full bg-blue-50 border-2 border-primary rounded-3xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Network className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Primary Tier
              </span>
              <h3 className="text-4xl font-black text-slate-900 mb-2">C1</h3>
              <p className="text-xl font-semibold text-primary mb-6">Primary CRA</p>
              
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Coins className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">30%</div>
                  <div className="text-sm text-slate-500 font-medium">of Realised Revenue (RR)</div>
                </div>
              </div>
              
              <p className="text-slate-600">
                As a C1 CRA, you directly refer clients to AVMLabs and earn a substantial 30% incentive on the realized revenue of every test booked.
              </p>
            </div>
          </div>

          <ArrowDownCircle className="hidden lg:block w-12 h-12 text-slate-300 -rotate-90 shrink-0" />
          <ArrowDownCircle className="lg:hidden w-12 h-12 text-slate-300 shrink-0" />

          {/* C2 Tier */}
          <div className="flex-1 w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Network className="w-32 h-32 text-slate-900" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Secondary Tier
              </span>
              <h3 className="text-4xl font-black text-slate-900 mb-2">C2</h3>
              <p className="text-xl font-semibold text-slate-600 mb-6">Sub-Agency CRA</p>
              
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">10%</div>
                  <div className="text-sm text-slate-500 font-medium">of their Realised Revenue</div>
                </div>
              </div>
              
              <p className="text-slate-600">
                A C2 is a CRA introduced by a C1. While the C2 earns their direct incentives, you (the C1) earn a 10% passive incentive on all revenue they generate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
