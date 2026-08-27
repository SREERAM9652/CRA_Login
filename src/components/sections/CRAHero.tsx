import { Activity, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export function CRAHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-20 md:pt-32 pb-16 md:pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-primary text-sm font-semibold mb-8">
          <Activity className="h-4 w-4" />
          <span>AVMLabs Wellness Laboratory</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
          Become an AVMLabs <br/>
          <span className="text-primary">Client Referral Agency</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          We are looking for B2C client partners. Partner with us, refer clients for wellness profiles, and earn highly rewarding incentives on the revenue you generate.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/cra/dashboard" className="inline-flex items-center justify-center whitespace-nowrap bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg border-none text-lg px-8 h-14 w-full sm:w-auto font-medium transition-colors">
            Join as CRA <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="#how-it-works" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-lg px-8 h-14 w-full sm:w-auto font-medium transition-colors">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}
