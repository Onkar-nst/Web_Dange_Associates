"use client";

import { useLanguage } from "./LanguageContext";
import { ArrowRight, Phone, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "./motion/CountUp";

const EASE = [0.22, 1, 0.36, 1];

// Masked line reveal
const Line = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "105%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

const HeroSection = () => {
  const { language } = useLanguage();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 90]);
  const imgScale = useTransform(scrollY, [0, 700], [1, 1.08]);

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-slate-50 pt-14">
      {/* Background with Subtle Pattern and Image */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-200/30 blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-6 h-full pt-8 pb-12 md:pt-16 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] mb-6">
              {language === "en" ? (
                <>
                  <Line delay={0.15}>Build Your Future on</Line>
                  <Line delay={0.3}>
                    <span className="text-blue-700 font-extrabold italic font-serif">Clear-Title</span> Residential Plots
                  </Line>
                </>
              ) : (
                <>
                  <Line delay={0.15}>तुमच्या भविष्याचा पाया</Line>
                  <Line delay={0.3}>
                    <span className="text-blue-700 font-extrabold italic font-serif">स्पष्ट-शीर्षक</span> प्लॉट्ससह रचा
                  </Line>
                </>
              )}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
              className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium"
            >
              {language === "en"
                ? "Dange Associates brings you 18+ years of trust in Nagpur's real estate. Fully developed layouts with immediate possession and registry."
                : "डांगे असोसिएट्स तुमच्यासाठी नागपूरच्या रिअल इस्टेटमधील १८+ वर्षांचा विश्वास घेऊन येत आहे. तात्काळ ताबा आणि नोंदणीसह पूर्ण विकसित लेआउट."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link
                href="/projects"
                className="relative overflow-hidden bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-lg"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                <span className="relative">{language === "en" ? "Explore Projects" : "प्रकल्प पहा"}</span>
                <ArrowRight className="relative w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#contact-section"
                className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-700 hover:-translate-y-0.5 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              >
                <Phone className="w-5 h-5" />
                {language === "en" ? "Book Free Site Visit" : "मोफत साइट भेट बुक करा"}
              </Link>
            </motion.div>
          </div>

          {/* Impact Image / Visual Section */}
          <div className="relative hidden lg:block h-[600px] w-full">
            <motion.div
              initial={{ clipPath: "inset(0 0 0 100% round 50px 0 0 50px)" }}
              animate={{ clipPath: "inset(0 0 0 0% round 50px 0 0 50px)" }}
              transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
              className="absolute inset-0 translate-x-20 overflow-hidden rounded-l-[50px]"
            >
              <motion.div style={{ y: imgY, scale: imgScale }} className="absolute -inset-y-16 inset-x-0">
                <Image src="/hero-bg.png" alt="Land for Sale Showcase" fill className="object-cover" priority />
              </motion.div>
              {/* Gradient Overlay for seamless blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-transparent"></div>
            </motion.div>

            {/* Floating trust chips */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
              className="absolute left-2 top-16 z-10"
            >
              <div className="animate-float flex items-center gap-4 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-2xl backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black leading-none text-slate-900">
                    <CountUp value="18+" />
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {language === "en" ? "Years of trust" : "वर्षांचा विश्वास"}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
              className="absolute bottom-16 left-24 z-10"
            >
              <div className="animate-float flex items-center gap-4 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-2xl backdrop-blur-md [animation-delay:1.5s]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black leading-none text-slate-900">
                    <CountUp value="1200+" />
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {language === "en" ? "Happy families" : "आनंदी कुटुंबे"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
