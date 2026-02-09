"use client";

import { useLanguage } from "./LanguageContext";
import { Route, Droplets, Zap, Trees, DoorOpen, Waves, Square, Gamepad2, Compass, BadgeCheck } from "lucide-react";

const AmenitiesSection = () => {
  const { language } = useLanguage();

  const amenities = [
    {
      title: language === "en" ? "Cement Concrete Roads" : "सिमेंट काँक्रीट रस्ते",
      icon: <Route className="w-8 h-8 text-slate-700" />,
      description: language === "en" ? "Long-lasting internal roads" : "दीर्घकाळ टिकणारे अंतर्गत रस्ते",
    },
    {
      title: language === "en" ? "Water Pipeline" : "पाणी पाईपलाईन",
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      description: language === "en" ? "Connection to every plot" : "प्रत्येक प्लॉटला कनेक्शन",
    },
    {
      title: language === "en" ? "Electrification" : "विद्य विद्युतीकरण",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      description: language === "en" ? "Transformer & street lights" : "ट्रान्सफॉर्मर आणि पथदिवे",
    },
    {
      title: language === "en" ? "Drainage System" : "ड्रेनेज सिस्टम",
      icon: <Waves className="w-8 h-8 text-cyan-600" />,
      description: language === "en" ? "Underground sewage line" : "भूमिगत मलनिस्सारण ​​रेषा",
    },
    {
      title: language === "en" ? "Grand Entrance" : "भव्य प्रवेशद्वार",
      icon: <DoorOpen className="w-8 h-8 text-orange-600" />,
      description: language === "en" ? "Gated community security" : "गेटेड कम्युनिटी सुरक्षितता",
    },
    {
      title: language === "en" ? "Garden & Greenery" : "बाग आणि हिरवळ",
      icon: <Trees className="w-8 h-8 text-green-600" />,
      description: language === "en" ? "Open space for recreation" : "मनोरंजनासाठी मोकळी जागा",
    },
    {
      title: language === "en" ? "Demarcated Plots" : "सीमांकन केलेले प्लॉट",
      icon: <Square className="w-8 h-8 text-indigo-600" />,
      description: language === "en" ? "Clear boundary stones for each plot" : "प्रत्येक प्लॉटसाठी स्पष्ट सीमा दगड",
    },
    {
      title: language === "en" ? "Children's Play Area" : "मुलांचे खेळण्याचे क्षेत्र",
      icon: <Gamepad2 className="w-8 h-8 text-pink-500" />,
      description: language === "en" ? "Safe play zone for kids" : "मुलांना खेळण्यासाठी सुरक्षित झोन",
    },
    {
      title: language === "en" ? "Vastu Compliant" : "वास्तुशास्त्रानुसार",
      icon: <Compass className="w-8 h-8 text-violet-600" />,
      description: language === "en" ? "Designed for positive energy" : "सकारात्मक ऊर्जेसाठी डिझाइन केलेले",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="text-blue-700 font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 italic">
               {language === "en" ? "Standard Infrastructure" : "मानक पायाभूत सुविधा"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-4 tracking-tight">
               {language === "en" ? "Technical Specifications We Deliver" : "आम्ही दिलेली तांत्रिक वैशिष्ट्ये"}
            </h2>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-bold flex items-center gap-2">
               <BadgeCheck className="w-5 h-5 text-green-600" />
               {language === "en" ? "Part of the Sanctioned NATP Layout" : "NATP मंजूर लेआउटचा भाग"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {amenities.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex items-start gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AmenitiesSection;

