import { Button } from "@/components/ui/Button"

export function BookingCTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary z-0" />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent z-0" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
          Ready to take charge of your health?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
          Book your diagnostic test today and get accurate reports delivered straight to your phone. Don&apos;t compromise on your wellbeing.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg border-none text-lg px-10 h-14">
            Book Now
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white bg-white/5 text-lg px-10 h-14">
            Call Us to Book
          </Button>
        </div>
      </div>
    </section>
  )
}
