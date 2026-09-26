"use client";

import { useLanguage } from "./LanguageContext";
import { FileText, ShieldCheck, MapPin, Handshake } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal, { stagger, rise } from "./motion/Reveal";
import CountUp from "./motion/CountUp";

const TrustSection = () => {
  const { language } = useLanguage();

  const trustFactors = [
    {
      icon: <FileText className="w-6 h-6 text-blue-700" />,
      title: language === "en" ? "Document Transparency" : "दस्तऐवज पारदर्शकता",
      description: language === "en" 
        ? "We explain every paper — 7/12, search reports, and deeds — before you pay a single rupee."
        : "पेमेंटपूर्वी आम्ही प्रत्येक कागदपत्र — ७/१२, शोध अहवाल आणि डीड — स्पष्ट करतो.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-700" />,
      title: language === "en" ? "Guaranteed Registry" : "नोंदणीची हमी",
      description: language === "en"
        ? "We ensure the property is legally transferred to your name immediately."
        : "आम्ही मालमत्ता तात्काळ तुमच्या नावावर कायदेशीररित्या हस्तांतरित करण्याची खात्री देतो.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-orange-600" />,
      title: language === "en" ? "Local Roots" : "स्थानिक उपस्थिती",
      description: language === "en"
        ? "Based in Kalmeshwar & Nagpur. We are your neighbors, available anytime for support."
        : "कळमेश्वर आणि नागपूरमध्ये स्थित. आम्ही तुमचे शेजारी आहोत, कोणत्याही वेळी मदतीसाठी उपलब्ध.",
    },
    {
      icon: <Handshake className="w-6 h-6 text-orange-600" />,
      title: language === "en" ? "No Hidden Costs" : "कोणताही छुपा खर्च नाही",
      description: language === "en"
        ? "The price we quote is the price you pay. No surprise development charges later."
        : "आम्ही जी किंमत सांगतो तीच किंमत तुम्ही देता. वाढीव विकास शुल्क नाही.",
    }
  ];

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-white py-16 md:py-20">
      <div className="container relative mx-auto px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text Content */}
          <Reveal className="lg:w-7/12">
            <span className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium uppercase italic tracking-widest text-blue-700">
              {language === "en" ? "Our Foundation of Trust" : "विश्वासाचा भक्कम पाया"}
            </span>
            <h2 className="mt-5 max-w-xl text-3xl font-medium leading-tight tracking-tight text-slate-900 md:text-4xl">
              {language === "en" ? (
                <>
                  Why Nagpur Families Trust Us <span className="text-blue-700">Since 2006</span>
                </>
              ) : (
                <>
                  नागपूरचे कुटुंब <span className="text-blue-700">२००६ पासून</span> आमच्यावर का विश्वास ठेवतात?
                </>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              {language === "en"
                ? "Buying land shouldn't be stressful. We focus on 100% legal safety so you can focus on building your home."
                : "जमीन खरेदी तणावमुक्त असावी. आम्ही १००% कायदेशीर सुरक्षिततेवर लक्ष केंद्रित करतो जेणेकरून तुम्ही तुमचे घर बांधण्यावर लक्ष केंद्रित करू शकाल."}
            </p>

            <motion.div
              variants={stagger(0.1, 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {trustFactors.map((factor, index) => (
                <motion.div
                  variants={rise}
                  key={index}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-colors duration-300 hover:border-blue-100 hover:bg-white hover:shadow-md"
                >
                  <div className="shrink-0 rounded-xl border border-slate-100 bg-white p-2.5 transition-colors duration-300 group-hover:bg-blue-50">{factor.icon}</div>
                  <div>
                    <h3 className="text-base font-medium text-slate-900">{factor.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{factor.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-full max-w-md lg:w-5/12 lg:max-w-none"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-white shadow-xl lg:aspect-[5/6] lg:max-h-[440px]">
              <Image
                src="/hero-transparency.webp"
                alt="Transparent Deal Meeting"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
            <div className="absolute -bottom-5 -left-4 max-w-xs rounded-2xl border-4 border-white bg-blue-700 px-5 py-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-medium italic text-white">
                  <CountUp value="18+" />
                </div>
                <div className="text-[10px] uppercase leading-5 tracking-widest text-blue-100">
                  {language === "en" ? (
                    <>
                      Successful <br />
                      Project Delivery
                    </>
                  ) : (
                    <>
                      यशस्वी <br />
                      प्रकल्प पूर्तता
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
