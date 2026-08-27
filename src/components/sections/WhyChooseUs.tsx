import { Shield, Clock, Award, Users, Microscope, FileCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"

const features = [
  {
    title: "Accurate Results",
    description: "State-of-the-art technology and rigorous quality control for precise diagnostics.",
    icon: <Microscope className="h-6 w-6 text-primary" />,
  },
  {
    title: "Quick Turnaround",
    description: "Fast processing ensures your reports are delivered within the promised timeframe.",
    icon: <Clock className="h-6 w-6 text-primary" />,
  },
  {
    title: "Certified Labs",
    description: "NABL and CAP accredited laboratories maintaining the highest global standards.",
    icon: <Award className="h-6 w-6 text-primary" />,
  },
  {
    title: "Expert Pathologists",
    description: "Highly qualified doctors and technicians overseeing every single test.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Data Privacy",
    description: "Secure digital infrastructure to keep your health data completely confidential.",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
  {
    title: "Smart Reports",
    description: "Easy-to-understand digital reports with historical trends and insights.",
    icon: <FileCheck className="h-6 w-6 text-primary" />,
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Why Choose AVMLabs?</h2>
          <p className="text-slate-600">
            We combine medical expertise with advanced technology to deliver diagnostic services you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
