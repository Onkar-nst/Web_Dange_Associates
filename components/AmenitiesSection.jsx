"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "./LanguageContext";

const AmenitiesSection = () => {
  const { language } = useLanguage(); // Use the language context
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionRef.current) {
            const cards = sectionRef.current.querySelectorAll(".amenity-card");
            if (cards.length > 0) {
              cards.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add("opacity-100");
                  card.classList.remove("translate-y-10");
                }, index * 100);
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, []);

  const amenities = [
    {
      title: language === "en" ? "Cement Roads" : "सिमेंट रस्ते",
      description:
        language === "en"
          ? "Durable and smooth cement roads for easy travel."
          : "सुलभ प्रवासासाठी टिकाऊ आणि गुळगुळीत सिमेंट रस्ते.",
    },
    {
      title: language === "en" ? "Main Gate" : "मुख्य प्रवेशद्वार",
      description:
        language === "en"
          ? "A grand entrance with a secure and aesthetic main gate."
          : "सुरक्षित आणि सौंदर्यपूर्ण मुख्य प्रवेशद्वारासह भव्य प्रवेश.",
    },
    {
      title: language === "en" ? "Electric Poles" : "विद्युत खांब",
      description:
        language === "en"
          ? "Well-planned electric poles for uninterrupted power."
          : "अखंडित वीजेसाठी चांगले नियोजित विद्युत खांब.",
    },
    {
      title: language === "en" ? "Sewage System" : "सांडपाणी व्यवस्थापन",
      description:
        language === "en"
          ? "Modern sewage system ensuring proper waste management."
          : "योग्य कचरा व्यवस्थापन सुनिश्चित करणारी आधुनिक सांडपाणी प्रणाली.",
    },
    {
      title: language === "en" ? "Water Connection" : "पाणी कनेक्शन",
      description:
        language === "en"
          ? "Reliable water supply with efficient pipelines."
          : "कार्यक्षम पाईपलाइनसह विश्वासार्ह पाणीपुरवठा.",
    },
    {
      title: language === "en" ? "Open Space" : "मोकळी जागा",
      description:
        language === "en"
          ? "Spacious open areas for relaxation and recreation."
          : "विश्रांती आणि मनोरंजनासाठी प्रशस्त मोकळ्या जागा.",
    },
    {
      title: language === "en" ? "Green Gym" : "ग्रीन जिम",
      description:
        language === "en"
          ? "Eco-friendly gym equipment for a healthy lifestyle."
          : "निरोगी जीवनशैलीसाठी पर्यावरणपूरक जिम उपकरणे.",
    },
    {
      title: language === "en" ? "Connect with Nature" : "निसर्गाशी जोडणी",
      description:
        language === "en"
          ? "Beautiful landscapes to help you reconnect with nature."
          : "तुम्हाला निसर्गाशी पुन्हा जोडण्यासाठी सुंदर लँडस्केप्स.",
    },
  ];

  return (
    <section id="amenities" className="py-20 relative" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          {language === "en" ? "Amenities" : "सुविधा"}
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mt-2">
          {language === "en"
            ? "We provide world-class amenities to make your living experience truly exceptional."
            : "तुमचा राहण्याचा अनुभव खरोखरच अपवादात्मक बनवण्यासाठी आम्ही जागतिक दर्जाच्या सुविधा प्रदान करतो."}
        </p>
        <br />
        <div className="gradient-line"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="amenity-card opacity-0 translate-y-10 transition-all duration-500 ease-out bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border border-black-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-center mb-2">
                  {amenity.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {amenity.description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default AmenitiesSection;

