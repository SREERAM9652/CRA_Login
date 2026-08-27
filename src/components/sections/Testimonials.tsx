import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Regular Patient",
    content: "The home collection service was incredibly smooth. The phlebotomist was professional and punctual. Got my reports online within 12 hours.",
    rating: 5,
    initial: "R"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Corporate Executive",
    content: "I booked the Comprehensive Master Health Package. The entire process at the center was organized, and the staff was extremely courteous. Highly recommended.",
    rating: 5,
    initial: "P"
  },
  {
    id: 3,
    name: "Amit Desai",
    role: "Senior Citizen",
    content: "Very satisfied with the senior citizen care package. The digital reports were easy to understand, and the historical trend feature helped my doctor immensely.",
    rating: 4,
    initial: "A"
  }
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-slate-50/50 -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">What Our Patients Say</h2>
          <p className="text-slate-600">
            Trusted by millions across India. Read about their experiences with AVMLabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg transition-shadow">
              <Quote className="absolute top-6 right-6 h-10 w-10 text-slate-100" />
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              
              <p className="text-slate-700 mb-8 relative z-10 text-sm leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
