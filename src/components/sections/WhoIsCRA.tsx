import { Briefcase, Clock, Heart, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"

const characteristics = [
  {
    title: "Not a Salaried Job",
    description: "You work as an independent partner and get highly rewarding incentives directly proportional to the turnover you generate.",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
  },
  {
    title: "Flexible Hours",
    description: "Perfect for anyone who feels they have 10+ hours a week free to dedicate towards networking and referrals.",
    icon: <Clock className="h-6 w-6 text-primary" />,
  },
  {
    title: "Wellness Advocate",
    description: "Ideal for someone who knows wellness better than others and wants to promote proactive healthcare.",
    icon: <Heart className="h-6 w-6 text-primary" />,
  },
  {
    title: "Well-Connected",
    description: "Those who have strong connections in society, neighborhoods, and the corporate world thrive as a CRA.",
    icon: <Users className="h-6 w-6 text-primary" />,
  }
]

export function WhoIsCRA() {
  return (
    <section className="py-16 md:py-24 bg-white" id="who-is-cra">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Who is a CRA?</h2>
          <p className="text-lg text-slate-600">
            A Client Referral Agency (CRA) is an independent partner who helps us reach B2C clients. It is a highly rewarding opportunity built on your network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {characteristics.map((item, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all bg-slate-50">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
