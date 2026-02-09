"use client";

import { useLanguage } from "./LanguageContext";
import { motion } from "framer-motion";

const BrandStatement = () => {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-white overflow-hidden relative border-y border-slate-100">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-8 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-blue-700 font-bold uppercase tracking-widest text-[10px]">
                {language === "en" ? "Established Since 2006" : "२००६ पासून स्थापित"}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-10">
              {language === "en" ? (
                <>
                  Building{" "}
                  <motion.span 
                    initial={{ filter: "blur(12px)", opacity: 0.4 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-blue-700 underline decoration-orange-500 underline-offset-8 inline-block"
                  >
                    Trust
                  </motion.span>, 
                  {" "}Transforming <span className="text-slate-500">Spaces.</span>
                </>
              ) : (
                <>
                  <motion.span 
                    initial={{ filter: "blur(12px)", opacity: 0.4 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-blue-700 underline decoration-orange-500 underline-offset-8 inline-block"
                  >
                    विश्वास
                  </motion.span>{" "}
                  निर्माण, जागांचे <span className="text-slate-500">रूपांतर.</span>
                </>
              )}
            </h2>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-3xl mx-auto">
              {language === "en" 
                ? "Transforming Dreams into Reality in Nagpur's Thriving Real Estate Market. Explore Elegant Flats, Grand Townships, and Secure NATP-Sanctioned Plots with Dange Associates."
                : "नागपूरच्या वेगाने वाढणाऱ्या रिअल इस्टेट मार्केटमध्ये स्वप्नांना वास्तवात बदलणे. डांगे असोसिएट्ससह शोभिवंत फ्लॅट्स, भव्य टाउनशिप आणि सुरक्षित NATP-मंजूर प्लॉट्स एक्सप्लोर करा."}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandStatement;

