"use client";

import { useLanguage } from "./LanguageContext";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, LandPlot, Users, ShieldCheck } from "lucide-react";
import CountUp from "./motion/CountUp";

const ease = [0.22, 1, 0.36, 1];

const ImpactStats = () => {
  const { language } = useLanguage();
  const en = language === "en";

  const stats = [
    {
      value: "18+",
      icon: Award,
      label: en ? "Years Experience" : "वर्षांचा अनुभव",
      desc: en ? "Building trust in land since 2007" : "२००७ पासून विश्वासाचा वारसा",
    },
    {
      value: "12+",
      icon: LandPlot,
      label: en ? "Completed Layouts" : "पूर्ण लेआउट्स",
      desc: en ? "Approved, demarcated & delivered" : "मंजूर, सीमांकित आणि हस्तांतरित",
    },
    {
      value: "1200+",
      icon: Users,
      label: en ? "Happy Families" : "आनंदी कुटुंबे",
      desc: en ? "Who now own their piece of land" : "ज्यांनी स्वतःची जमीन घेतली",
    },
    {
      value: "100%",
      icon: ShieldCheck,
      label: en ? "Clear-Title Plots" : "स्पष्ट मालकी प्लॉट",
      desc: en ? "Every document shown before you pay" : "पैसे देण्यापूर्वी प्रत्येक कागदपत्र",
    },
  ];

  // One trigger for the whole row so every counter starts at the same moment.
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="relative border-y border-slate-100 bg-white py-4 md:py-5">
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease }}
              className="px-4 text-center"
            >
              <p className="text-3xl font-medium tracking-tight text-slate-900 tabular-nums">
                <CountUp value={stat.value} duration={2.5} start={inView} />
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
