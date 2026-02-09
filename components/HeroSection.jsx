"use client";

import { useLanguage } from "./LanguageContext";
import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-slate-50 pt-14">
      {/* Background with Subtle Pattern and Image */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>
      
      <div className="container mx-auto px-6 h-full pt-8 pb-12 md:pt-16 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl animate-fade-in text-left">

            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] mb-6">
              {language === "en" ? (
                <>
                  Build Your Future on <br className="hidden md:block" />
                  <span className="text-blue-700 font-extrabold italic font-serif">Clear-Title</span> Residential Plots
                </>
              ) : (
                <>
                  तुमच्या भविष्याचा पाया <br className="hidden md:block" />
                  <span className="text-blue-700 font-extrabold italic font-serif">स्पष्ट-शीर्षक</span> प्लॉट्ससह रचा
                </>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              {language === "en"
                ? "Dange Associates brings you 18+ years of trust in Nagpur's real estate. Fully developed layouts with immediate possession and registry."
                : "डांगे असोसिएट्स तुमच्यासाठी नागपूरच्या रिअल इस्टेटमधील १८+ वर्षांचा विश्वास घेऊन येत आहे. तात्काळ ताबा आणि नोंदणीसह पूर्ण विकसित लेआउट."}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/projects"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-orange-200 flex items-center justify-center gap-2 group text-lg"
              >
                {language === "en" ? "Explore Projects" : "प्रकल्प पहा"}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="#contact-section"
                className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-700 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              >
                <Phone className="w-5 h-5" />
                {language === "en" ? "Book Free Site Visit" : "मोफत साइट भेट बुक करा"}
              </Link>
            </div>


          </div>

          {/* Impact Image / Visual Section */}
          <div className="relative hidden lg:block h-[600px] w-full">
            <div className="absolute inset-0 translate-x-20 overflow-hidden rounded-l-[50px]">
               <Image
                src="/hero-bg.png" 
                alt="Land for Sale Showcase"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay for seamless blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-transparent"></div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
