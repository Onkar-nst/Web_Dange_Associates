"use client";

import { useLanguage } from "./LanguageContext";
import { motion } from "framer-motion";
import CountUp from "./motion/CountUp";
import PlotWave from "./fx/PlotWave";

const ImpactStats = () => {
  const { language } = useLanguage();

  const stats = [
    {
      value: "18+",
      label: language === "en" ? "Years Experience" : "वर्षांचा अनुभव",
    },
    {
      value: "12+",
      label: language === "en" ? "Completed Layouts" : "पूर्ण लेआउट्स",
    },
    {
      value: "1200+",
      label: language === "en" ? "Happy Families" : "आनंदी कुटुंबे",
    },

  ];

  return (
    <section className="py-24 md:py-28 bg-slate-900 overflow-hidden relative">
      <PlotWave className="opacity-70" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(15,23,42,0.85)_75%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-center group flex-1 rounded-3xl border border-white/0 px-6 py-6 transition-all duration-500 hover:border-white/10 hover:bg-white/5 hover:backdrop-blur-sm"
            >
              <div className="relative inline-block">
                <h3 className="text-6xl md:text-7xl font-medium mb-4 tracking-tighter transition-all duration-500 group-hover:scale-110 bg-gradient-to-b from-white to-blue-400 bg-clip-text text-transparent">
                  <CountUp value={stat.value} />
                </h3>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.4 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="h-1.5 w-16 bg-orange-600 mx-auto rounded-full mb-6 transform transition-all duration-500 group-hover:w-24 group-hover:bg-blue-500"
                ></motion.div>
              </div>
              <p className="text-sm md:text-base font-medium text-blue-100 uppercase tracking-[0.25em] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
