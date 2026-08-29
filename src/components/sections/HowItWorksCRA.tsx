import { UserCheck, Sparkles, Share2, Wallet, ArrowRight } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "1. Enter Customer Info",
    description: "Enter your customer's name and mobile number in the partner app.",
    icon: <UserCheck className="h-7 w-7 text-[#382685]" />,
  },
  {
    id: 2,
    title: "2. Pick Test with 20% Off",
    description: "Choose a wellness profile. Customer gets an automatic 20% discount.",
    icon: <Sparkles className="h-7 w-7 text-emerald-600" />,
  },
  {
    id: 3,
    title: "3. Share Payment Link",
    description: "Share the link on WhatsApp. Customer pays securely via UPI or Card.",
    icon: <Share2 className="h-7 w-7 text-blue-600" />,
  },
  {
    id: 4,
    title: "4. Get 30% Cash Payout",
    description: "Your 30% commission is instantly added to your wallet for bank payout.",
    icon: <Wallet className="h-7 w-7 text-purple-700" />,
  }
]

export function HowItWorksCRA() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100 font-sans" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#382685] text-xs font-black uppercase tracking-wider mb-3 border border-purple-200">
            <Sparkles className="h-3.5 w-3.5" /> 4-Step Earning Flow
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
            How It Works in 4 Simple Steps
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Zero complicated paperwork. Book online, share payment link, and earn instant commissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all text-left">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
                  {step.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
