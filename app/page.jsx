"use client"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import BrandStatement from "@/components/BrandStatement"
import AboutDange from "@/components/AboutDange"
import ProjectShowcase from "@/components/ProjectShowcase"
import TrustSection from "@/components/TrustSection"
import Footprint from "@/components/footprint/Footprint"
import ProcessTimeline from "@/components/ProcessTimeline"
import ImpactStats from "@/components/ImpactStats"

import Testimonials from "@/components/Testimonials"
import HomeEnquiry from "@/components/HomeEnquiry"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="overflow-x-clip bg-white">
      <Navbar />
      <HeroSection />
      <div className="relative z-10">
        <ImpactStats />
      </div>
      <BrandStatement />
      <AboutDange />
      
      <div className="relative z-10">
        <ProjectShowcase />
        <TrustSection />
        <ProcessTimeline />
        <Footprint />
        <Testimonials />
        <HomeEnquiry />
      </div>
      
      <Footer />
    </main>
  )
}

