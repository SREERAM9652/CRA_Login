import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { PopularTests } from "@/components/sections/PopularTests"
import { HealthPackages } from "@/components/sections/HealthPackages"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { WhyChooseUs } from "@/components/sections/WhyChooseUs"
import { Testimonials } from "@/components/sections/Testimonials"
import { FAQ } from "@/components/sections/FAQ"
import { BookingCTA } from "@/components/sections/BookingCTA"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PopularTests />
        <HealthPackages />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <BookingCTA />
      </main>
      <Footer />
    </div>
  )
}
