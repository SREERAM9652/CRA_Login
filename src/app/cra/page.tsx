import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CRAHero } from "@/components/sections/CRAHero"
import { WhoIsCRA } from "@/components/sections/WhoIsCRA"
import { HowItWorksCRA } from "@/components/sections/HowItWorksCRA"
import { TierStructure } from "@/components/sections/TierStructure"
import { WhatToSell } from "@/components/sections/WhatToSell"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <CRAHero />
        <WhoIsCRA />
        <HowItWorksCRA />
        <TierStructure />
        <WhatToSell />
      </main>
      <Footer />
    </div>
  )
}
