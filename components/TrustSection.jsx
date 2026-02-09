"use client";

import { useLanguage } from "./LanguageContext";
import { FileText, ShieldCheck, MapPin, Handshake } from "lucide-react";
import Image from "next/image";

const TrustSection = () => {
  const { language } = useLanguage();

  const trustFactors = [
    {
      icon: <FileText className="w-10 h-10 text-blue-700" />,
      title: language === "en" ? "Document Transparency" : "दस्तऐवज पारदर्शकता",
      description: language === "en" 
        ? "We explain every paper — 7/12, search reports, and deeds — before you pay a single rupee."
        : "पेमेंटपूर्वी आम्ही प्रत्येक कागदपत्र — ७/१२, शोध अहवाल आणि डीड — स्पष्ट करतो.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-blue-700" />,
      title: language === "en" ? "Guaranteed Registry" : "नोंदणीची हमी",
      description: language === "en"
        ? "We ensure the property is legally transferred to your name immediately."
        : "आम्ही मालमत्ता तात्काळ तुमच्या नावावर कायदेशीररित्या हस्तांतरित करण्याची खात्री देतो.",
    },
    {
      icon: <MapPin className="w-10 h-10 text-orange-600" />,
      title: language === "en" ? "Local Roots" : "स्थानिक उपस्थिती",
      description: language === "en"
        ? "Based in Kalmeshwar & Nagpur. We are your neighbors, available anytime for support."
        : "कळमेश्वर आणि नागपूरमध्ये स्थित. आम्ही तुमचे शेजारी आहोत, कोणत्याही वेळी मदतीसाठी उपलब्ध.",
    },
    {
      icon: <Handshake className="w-10 h-10 text-orange-600" />,
      title: language === "en" ? "No Hidden Costs" : "कोणताही छुपा खर्च नाही",
      description: language === "en"
        ? "The price we quote is the price you pay. No surprise development charges later."
        : "आम्ही जी किंमत सांगतो तीच किंमत तुम्ही देता. वाढीव विकास शुल्क नाही.",
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <span className="text-blue-700 font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 italic">
               {language === "en" ? "Our Foundation of Trust" : "विश्वासाचा भक्कम पाया"}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-6 leading-[1.2] tracking-tight max-w-lg">
              {language === "en" ? (
                <>
                  Why Nagpur Families <br className="hidden md:block" />
                  Trust Us <span className="text-blue-700">Since 2006</span>
                </>
              ) : (
                <>
                  नागपूरचे कुटुंब <span className="text-blue-700">२००६ पासून</span> <br className="hidden md:block" />
                  आमच्यावर का विश्वास ठेवतात?
                </>
              )}
            </h2>
            <p className="text-xl text-slate-600 mt-8 leading-relaxed font-medium">
              {language === "en"
                ? "Buying land shouldn't be stressful. We focus on 100% legal safety so you can focus on building your home."
                : "जमीन खरेदी तणावमुक्त असावी. आम्ही १००% कायदेशीर सुरक्षिततेवर लक्ष केंद्रित करतो जेणेकरून तुम्ही तुमचे घर बांधण्यावर लक्ष केंद्रित करू शकाल."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
              {trustFactors.map((factor, index) => (
                <div key={index} className="flex flex-col items-start group">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300 mb-5">
                    {factor.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{factor.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-sm">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="lg:w-1/2 relative group">
             <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white">
                <Image 
                  src="/hero-transparency.png" 
                  alt="Transparent Deal Meeting"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
             </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-blue-700 p-8 rounded-3xl shadow-2xl border-4 border-white max-w-xs animate-float">
               <div className="flex items-center gap-5">
                  <div className="text-5xl font-black text-white italic">18+</div>
                  <div className="text-xs text-blue-100 font-bold uppercase tracking-widest leading-6">
                     Successful <br/>Project Delivery
                  </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TrustSection;
