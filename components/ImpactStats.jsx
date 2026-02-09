"use client";

import { useLanguage } from "./LanguageContext";

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
    <section className="py-20 bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group flex-1">
              <div className="relative inline-block">
                <h3 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter transition-all duration-500 group-hover:scale-110 bg-gradient-to-b from-white to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <div className="h-1.5 w-16 bg-orange-600 mx-auto rounded-full mb-6 transform transition-all duration-500 group-hover:w-24 group-hover:bg-blue-500"></div>
              </div>
              <p className="text-sm md:text-base font-bold text-blue-100 uppercase tracking-[0.25em] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
