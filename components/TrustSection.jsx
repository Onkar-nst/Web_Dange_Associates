"use client";

import { useLanguage } from "./LanguageContext";
import { FileText, ShieldCheck, MapPin, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import Reveal, { stagger, rise } from "./motion/Reveal";
import SectionLabel from "./ui/SectionLabel";

const TrustSection = () => {
  const { language } = useLanguage();
  const en = language === "en";

  const trustFactors = [
    {
      Icon: FileText,
      kicker: en ? "Papers First" : "आधी कागदपत्रे",
      title: en ? "Document Transparency" : "दस्तऐवज पारदर्शकता",
      description: en
        ? "We explain every paper — 7/12, search reports, and deeds — before you pay a single rupee."
        : "पेमेंटपूर्वी आम्ही प्रत्येक कागदपत्र — ७/१२, शोध अहवाल आणि डीड — स्पष्ट करतो.",
    },
    {
      Icon: ShieldCheck,
      kicker: en ? "Legal Certainty" : "कायदेशीर खात्री",
      title: en ? "Guaranteed Registry" : "नोंदणीची हमी",
      description: en
        ? "We ensure the property is legally transferred to your name immediately."
        : "आम्ही मालमत्ता तात्काळ तुमच्या नावावर कायदेशीररित्या हस्तांतरित करण्याची खात्री देतो.",
    },
    {
      Icon: MapPin,
      kicker: en ? "Always Nearby" : "नेहमी जवळ",
      title: en ? "Local Roots" : "स्थानिक उपस्थिती",
      description: en
        ? "Based in Kalmeshwar & Nagpur. We are your neighbors, available anytime for support."
        : "कळमेश्वर आणि नागपूरमध्ये स्थित. आम्ही तुमचे शेजारी आहोत, कोणत्याही वेळी मदतीसाठी उपलब्ध.",
    },
    {
      Icon: Handshake,
      kicker: en ? "Honest Pricing" : "प्रामाणिक किंमत",
      title: en ? "No Hidden Costs" : "कोणताही छुपा खर्च नाही",
      description: en
        ? "The price we quote is the price you pay. No surprise development charges later."
        : "आम्ही जी किंमत सांगतो तीच किंमत तुम्ही देता. वाढीव विकास शुल्क नाही.",
    },
  ];


  return (
    <section className="relative overflow-hidden bg-blue-950 py-10 text-white md:py-12">
      <div className="container relative mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Reveal>
              <SectionLabel dark>{en ? "Our Foundation of Trust" : "विश्वासाचा भक्कम पाया"}</SectionLabel>
            </Reveal>
            <h2 className="mt-6 text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">
              {en ? "Why Nagpur families" : "नागपूरची कुटुंबे"}
              <br />
              <span className="text-blue-300">{en ? "trust us since 2006" : "२००६ पासून विश्वास ठेवतात"}</span>
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-base leading-relaxed text-slate-400 lg:ml-auto">
              {en
                ? "Buying land shouldn't be stressful. We focus on legal safety so you can focus on building your home."
                : "जमीन खरेदी तणावमुक्त असावी. आम्ही कायदेशीर सुरक्षिततेवर लक्ष देतो, तुम्ही घर बांधण्यावर लक्ष द्या."}
            </p>
          </Reveal>
        </div>

        <motion.ul
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {trustFactors.map(({ Icon, kicker, title, description }) => (
            <motion.li
              variants={rise}
              key={title}
              className="group relative bg-blue-950 px-7 pb-9 pt-8 transition-colors duration-500 hover:bg-blue-900/60 md:px-10"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-blue-300 transition-transform duration-500 group-hover:scale-x-100" />
              <Icon className="h-8 w-8 text-blue-300" strokeWidth={1.25} />
              <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">{kicker}</p>
              <h3 className="mt-2 text-xl font-medium tracking-tight text-white md:text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default TrustSection;
