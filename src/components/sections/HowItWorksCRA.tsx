import { Search, Send, UserCheck, CalendarDays } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Identify",
    description: "Find individuals or parties in your network who can benefit from our B2C wellness diagnostics.",
    icon: <Search className="h-8 w-8" />,
  },
  {
    id: 2,
    title: "Submit Lead",
    description: "Give the leads to the company using the seamless CRA partner app provided to you.",
    icon: <Send className="h-8 w-8" />,
  },
  {
    id: 3,
    title: "Persuade",
    description: "Work in coordination with our expert team to persuade them to become our client.",
    icon: <UserCheck className="h-8 w-8" />,
  },
  {
    id: 4,
    title: "Remind",
    description: "Keep reminding the client for quarterly testing, supported by automated company alerts.",
    icon: <CalendarDays className="h-8 w-8" />,
  }
]

export function HowItWorksCRA() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">
            A simple 4-step process to generate business and earn your incentives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-0.5 bg-blue-200 z-0" />
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-100 shadow-md flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary group-hover:bg-blue-50 transition-all duration-300 mb-6 relative">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 max-w-[250px] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
