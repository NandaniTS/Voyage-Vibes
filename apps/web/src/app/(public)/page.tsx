'use client'


import React from 'react'
import { NavBar } from "./__components/NavBar";
import { Discover } from "./__components/Discover";
import { DestinationsSection } from "./__components/DestinationsSection";
import { HowItWorksSection } from "./__components/HowItWorksSection";
import { AgentsSection } from "./__components/AgentsSection";
import { CTASection } from "./__components/CTASection";
import { Footer } from "./__components/Footer";


const page = () => {
  return (
    <div>
        <main className="min-h-screen">
              <NavBar />
              <Discover />
              <DestinationsSection />
              <HowItWorksSection />
              <AgentsSection />
              <CTASection />
              <Footer />
            </main>
    </div>
  )
}

export default page