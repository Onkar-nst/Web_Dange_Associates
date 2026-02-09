"use client";

import { useLanguage } from "./LanguageContext";
import { motion } from "framer-motion";

const WhyInvestSection = () => {
  const { language } = useLanguage();

  const benefits = [
    {
      title: language === "en" ? "Clear Title Guarantee" : "स्पष्ट शीर्षक हमी",
      description:
        language === "en"
          ? "100% clear title on all properties for your peace of mind."
          : "तुमच्या मनःशांतीसाठी सर्व मालमत्तांवर १००% स्पष्ट शीर्षक.",
    },
    {
      title: language === "en" ? "NATP-Sanctioned" : "NATP मंजूर",
      description:
        language === "en"
          ? "Fully sanctioned projects ensuring zero legal complications."
          : "शून्य कायदेशीर गुंतागुंत सुनिश्चित करणारे पूर्णपणे मंजूर प्रकल्प.",
    },
    {
      title: language === "en" ? "18+ Years Legacy" : "१८+ वर्षांचा वारसा",
      description:
        language === "en"
          ? "Trusted by hundreds of families since 2007."
          : "२००७ पासून शेकडो कुटुंबांचा विश्वास.",
    },
    {
      title: language === "en" ? "Transparent Process" : "पारदर्शक प्रक्रिया",
      description:
        language === "en"
          ? "Complete transparency from booking to handover."
          : "बुकिंगपासून हस्तांतरणापर्यंत संपूर्ण पारदर्शकता.",
    },
    {
      title: language === "en" ? "Lifetime Support" : "आयुष्यभर समर्थन",
      description:
        language === "en"
          ? "We are with you even after the sale is complete."
          : "विक्री पूर्ण झाल्यानंतरही आम्ही तुमच्या सोबत आहोत.",
    },
  ];

  return (
    <section id="why-invest" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-orange-500 font-bold tracking-wider uppercase">
            {language === "en" ? "Why Choose Us" : "आम्हाला का निवडावे"}
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mt-4 mb-6 leading-tight">
            {language === "en"
              ? "Invest in Trust."
              : "विश्वासात गुंतवणूक करा."}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              {language === "en" ? "Build Your Future." : "तुमचे भविष्य घडवा."}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            {language === "en"
              ? "We don't just sell land; we deliver promises. Here is why hundreds of families trust Dange Developers."
              : "आम्ही फक्त जमीन विकत नाही; आम्ही वचने पूर्ण करतो. म्हणूनच शेकडो कुटुंबे डांगे डेव्हलपर्सवर विश्वास ठेवतात."}
          </p>
        </motion.div>

        <div className="space-y-12">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative border-t border-gray-200 pt-12"
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12">
                {/* Large Number */}
                <span className="text-8xl md:text-9xl font-black text-gray-100 group-hover:text-orange-100 transition-colors duration-500 select-none">
                  {`0${index + 1}`}
                </span>

                {/* Content */}
                <div className="relative z-10 -mt-10 md:mt-0">
                  <h3 className="text-3xl md:text-5xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Arrow (Visual Cue) */}
                <div className="hidden md:block ml-auto opacity-0 group-hover:opacity-100 transform translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                  <svg
                    className="w-12 h-12 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyInvestSection;
