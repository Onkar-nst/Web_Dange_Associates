"use client";

import { useLanguage } from "./LanguageContext";
import { motion } from "framer-motion";
import ScrollWords from "./fx/ScrollWords";
import SectionLabel from "./ui/SectionLabel";

// Hand-drawn brush stroke under a word; draws itself in when scrolled into view.
const HandUnderline = () => (
  <svg
    aria-hidden
    viewBox="0 0 200 20"
    preserveAspectRatio="none"
    className="pointer-events-none absolute -bottom-3 left-[-4%] h-[0.32em] w-[108%] overflow-visible text-blue-300"
  >
    <motion.path
      d="M3 13 C 40 6, 85 4, 120 7 S 180 11, 197 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
    />
    <motion.path
      d="M18 17 C 60 12, 110 11, 170 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.7"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: 1.3, ease: [0.65, 0, 0.35, 1] }}
    />
  </svg>
);

const BrandStatement = () => {
  const { language } = useLanguage();


  return (
    <section className="py-12 bg-white overflow-hidden relative border-y border-slate-100">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel className="mb-8">{language === "en" ? "Established Since 2006" : "२००६ पासून स्थापित"}</SectionLabel>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 leading-tight tracking-tight mb-10">
              {language === "en" ? (
                <>
                  Building{" "}
                  <motion.span
                    initial={{ filter: "blur(12px)", opacity: 0.4 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative inline-block text-blue-700"
                  >
                    Trust
                    <HandUnderline />
                  </motion.span>
                  , {" "}Transforming <span className="text-slate-400">Spaces.</span>
                </>
              ) : (
                <>
                  <motion.span
                    initial={{ filter: "blur(12px)", opacity: 0.4 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative inline-block text-blue-700"
                  >
                    विश्वास
                    <HandUnderline />
                  </motion.span>{" "}
                  निर्माण, जागांचे <span className="text-slate-400">रूपांतर.</span>
                </>
              )}
            </h2>
          </motion.div>

          <ScrollWords
            key={language}
            className="text-lg md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto"
            text={
              language === "en"
                ? "Transforming Dreams into Reality in Nagpur's Thriving Real Estate Market. Explore Elegant Flats, Grand Townships, and Secure NATP-Sanctioned Plots with Dange Associates."
                : "नागपूरच्या वेगाने वाढणाऱ्या रिअल इस्टेट मार्केटमध्ये स्वप्नांना वास्तवात बदलणे. डांगे असोसिएट्ससह शोभिवंत फ्लॅट्स, भव्य टाउनशिप आणि सुरक्षित NATP-मंजूर प्लॉट्स एक्सप्लोर करा."
            }
          />
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
