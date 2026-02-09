"use client"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import BrandStatement from "@/components/BrandStatement"
import ProjectShowcase from "@/components/ProjectShowcase"
import TrustSection from "@/components/TrustSection"
import ProcessTimeline from "@/components/ProcessTimeline"
import ImpactStats from "@/components/ImpactStats"

import Testimonials from "@/components/Testimonials"
import HomeEnquiry from "@/components/HomeEnquiry"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      <Navbar />
      <HeroSection />
      <BrandStatement />
      
      <div className="relative z-10">
        <ProjectShowcase />
        <TrustSection />
        <ProcessTimeline />
        <ImpactStats />

        <Testimonials />
        <HomeEnquiry />
      </div>
      
      <Footer />
    </main>
  )
}

