"use client";

import { useEffect, useRef } from "react";
import { Shield, FileCheck, Eye, Users, Clock, Award } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const WhyInvestSection = () => {
  const sectionRef = useRef(null);
  const { language } = useLanguage(); // Use the language context

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(".timeline-item");
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      items.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  const timelineItems = [
    {
      title:
        language === "en"
          ? "18+ Years of Transforming Land into Legacies"
          : "१८+ वर्षे जमिनीचे वारशामध्ये रूपांतर",
      description:
        language === "en"
          ? "With over 18 years of experience, we have a proven track record of successfully developing land projects."
          : "१८+ वर्षांच्या अनुभवासह, आम्ही यशस्वी जमीन प्रकल्प विकसित करण्याचा सिद्ध इतिहास ठेवतो.",
      icon: <Award className="h-12 w-12 text-orange-500" />,
      position: "right",
      highlight: true,
    },
    {
      title:
        language === "en" ? "NATP-Sanctioned Projects" : "NATP मंजूर प्रकल्प",
      description:
        language === "en"
          ? "All our projects are Sanctioned by the NATP, ensuring full legal compliance."
          : "आमचे सर्व प्रकल्प NATP द्वारे मंजूर आहेत, पूर्ण कायदेशीर अनुपालन सुनिश्चित करतात.",
      icon: <Shield className="h-10 w-10 text-blue-700" />,
      position: "left",
    },
    {
      title: language === "en" ? "Clear Title Guarantee" : "स्पष्ट शीर्षक हमी",
      description:
        language === "en"
          ? "We provide a 100% clear title guarantee on all our properties, offering you complete peace of mind."
          : "आमच्या सर्व मालमत्तांवर आम्ही १००% स्पष्ट शीर्षक हमी देतो, तुम्हाला पूर्ण मनःशांती प्रदान करतो.",
      icon: <FileCheck className="h-10 w-10 text-orange-500" />,
      position: "right",
    },
    {
      title:
        language === "en"
          ? "Transparency from Acquisition to Handover"
          : "खरेदीपासून हस्तांतरणापर्यंत पारदर्शकता",
      description:
        language === "en"
          ? "We ensure complete transparency throughout the entire process, from land acquisition to the final handover."
          : "जमीन खरेदीपासून अंतिम हस्तांतरणापर्यंत आम्ही संपूर्ण प्रक्रियेत पूर्ण पारदर्शकता सुनिश्चित करतो.",
      icon: <Eye className="h-10 w-10 text-blue-700" />,
      position: "left",
    },
    {
      title: language === "en" ? "Site Visits Available" : "साइट भेटी उपलब्ध",
      description:
        language === "en"
          ? "We encourage site visits so you can see your investment firsthand before making a decision."
          : "आम्ही साइट भेटी प्रोत्साहित करतो जेणेकरून तुम्ही निर्णय घेण्यापूर्वी तुमची गुंतवणूक प्रत्यक्ष पाहू शकता.",
      icon: <Users className="h-10 w-10 text-orange-500" />,
      position: "right",
    },
    {
      title: language === "en" ? "Post-Sales Support" : "विक्रीनंतर समर्थन",
      description:
        language === "en"
          ? "Our relationship doesn't end after the sale. We provide comprehensive post-sales support for all our clients."
          : "आमचे नाते विक्रीनंतर संपत नाही. आम्ही आमच्या सर्व ग्राहकांसाठी व्यापक विक्रीनंतर समर्थन प्रदान करतो.",
      icon: <Clock className="h-10 w-10 text-blue-700" />,
      position: "left",
    },
  ];

  return (
    <section id="why-invest" className="py-20 relative" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          {language === "en"
            ? "Why Invest With Us"
            : "आमच्यासोबत गुंतवणूक का करावी"}
        </h2>
        <div className="gradient-line"></div>

        <div className="relative vertical-timeline mt-20 pb-10">
          <div className="max-w-6xl mx-auto">
            {timelineItems.map((item, index) => (
              <div
                key={index}
                className={`timeline-item opacity-0 flex items-center mb-20 relative ${
                  item.position === "left" ? "justify-end" : "justify-start"
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  opacity: 0,
                  transform:
                    item.position === "left"
                      ? "translateX(-50px)"
                      : "translateX(50px)",
                  transition: "all 0.6s ease-out",
                }}
              >
                <div
                  className={`w-full md:w-5/12 relative ${
                    item.highlight ? "md:w-[45.83%]" : "md:w-5/12"
                  }`}
                >
                  <div
                    className={`connector-line ${
                      item.position === "left"
                        ? "connector-line-left"
                        : "connector-line-right"
                    }`}
                  ></div>
                  <div
                    className={`card ${
                      item.highlight
                        ? "border-2 border-orange-500 bg-gradient-to-br from-white to-orange-50"
                        : "border-2 border-blue-750"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-gray-100 rounded-full">
                        {item.icon}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            item.highlight ? "text-2xl text-orange-600" : ""
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default WhyInvestSection;
