"use client";

import { useLanguage } from "./LanguageContext";
import { ArrowRight, Phone, MapPin, Rotate3d, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Magnetic from "./fx/Magnetic";

const EASE = [0.22, 1, 0.36, 1];

// Masked line reveal
const Line = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, delay, ease: EASE }}>
      {children}
    </motion.span>
  </span>
);

const HeroSection = () => {
  const { language } = useLanguage();
  const en = language === "en";

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 pt-14">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>
      <div className="pointer-events-none absolute -left-24 -top-24 z-0 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 z-0 h-80 w-80 rounded-full bg-orange-200/25 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-8 md:pb-24 md:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="max-w-2xl text-left">
            <h1 className="mb-6 text-4xl font-medium leading-[1.15] text-slate-900 md:text-5xl lg:text-6xl">
              {en ? (
                <>
                  <Line delay={0.15}>Build Your Future on</Line>
                  <Line delay={0.3}>
                    <span className="font-serif font-semibold italic text-blue-700">Clear-Title</span> Residential Plots
                  </Line>
                </>
              ) : (
                <>
                  <Line delay={0.15}>तुमच्या भविष्याचा पाया</Line>
                  <Line delay={0.3}>
                    <span className="font-serif font-semibold italic text-blue-700">स्पष्ट-शीर्षक</span> प्लॉट्ससह रचा
                  </Line>
                </>
              )}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
              className="mb-10 text-lg leading-relaxed text-slate-600 md:text-xl"
            >
              {en
                ? "Dange Associates brings you 18+ years of trust in Nagpur's real estate. Fully developed layouts with immediate possession and registry."
                : "डांगे असोसिएट्स तुमच्यासाठी नागपूरच्या रिअल इस्टेटमधील १८+ वर्षांचा विश्वास घेऊन येत आहे. तात्काळ ताबा आणि नोंदणीसह पूर्ण विकसित लेआउट."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
              className="flex flex-col gap-5 sm:flex-row"
            >
              <Magnetic className="block">
                <Link
                  href="/projects"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-orange-200"
                >
                  {en ? "Explore Projects" : "प्रकल्प पहा"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic className="block">
                <Link
                  href="#contact-section"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-700"
                >
                  <Phone className="h-5 w-5" />
                  {en ? "Book Free Site Visit" : "मोफत साइट भेट बुक करा"}
                </Link>
              </Magnetic>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600"
            >
              {(en ? ["Clear title", "Immediate registry", "NATP-sanctioned layouts"] : ["स्पष्ट शीर्षक", "तात्काळ नोंदणी", "NATP-मंजूर लेआउट"]).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-blue-700" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Flagship project showcase */}
          <div className="relative h-[420px] w-full sm:h-[500px] lg:h-[560px]">
            <motion.div
              initial={{ clipPath: "inset(0 0 0 100% round 2rem)" }}
              animate={{ clipPath: "inset(0 0 0 0% round 2rem)" }}
              transition={{ duration: 1.3, delay: 0.2, ease: EASE }}
              className="group absolute inset-y-0 right-0 w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/15 lg:w-[92%]"
            >
              <img
                src="/project-imgg.webp"
                alt="Shree Ram Nagri-1 layout"
                fetchPriority="high"
                className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
              <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-800 shadow">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {en ? "Bookings open" : "बुकिंग सुरू"}
              </div>
              <div className="absolute inset-x-5 bottom-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-300">{en ? "Current project" : "सध्याचा प्रकल्प"}</p>
                  <h3 className="mt-1 text-2xl font-medium md:text-3xl">{en ? "Shree Ram Nagri-1" : "श्री राम नगरी-१"}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    {en ? "State Highway 250, Kalmeshwar" : "राज्य महामार्ग २५०, कळमेश्वर"}
                  </p>
                </div>
                <Link
                  href="/projects/shree-ram-nagri-1#flythrough"
                  className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-lg transition-colors hover:bg-blue-50 sm:self-auto"
                >
                  <Rotate3d className="h-4 w-4 text-blue-700" />
                  {en ? "Take the 3D tour" : "3D सफर करा"}
                </Link>
              </div>
            </motion.div>

            {/* Ready-to-move card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
              className="absolute -left-2 top-10 hidden w-52 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl lg:block"
            >
              <Link href="/projects/ready-to-move-homes" className="group block">
                <div className="h-32 overflow-hidden">
                  <img src="/ghar.jpg" alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-slate-900">{en ? "Ready to Move Homes" : "तयार घरे"}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    {en ? "Beside Tahsil Office" : "तहसील कार्यालयाजवळ"}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
