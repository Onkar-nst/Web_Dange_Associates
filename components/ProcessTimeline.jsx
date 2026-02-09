import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { MapPin, MousePointerClick, FileSearch, PenTool, Key } from "lucide-react";

const ProcessTimeline = () => {
  const { language } = useLanguage();

  const steps = [
    {
      id: 1,
      title: language === "en" ? "Site Visit" : "साइट भेट",
      description: language === "en" 
        ? "Pick-up & drop facility available. See the location yourself." 
        : "पिक-अप आणि ड्रॉप सुविधा उपलब्ध. स्वतः जागा पहा.",
      icon: MapPin,
    },
    {
      id: 2,
      title: language === "en" ? "Plot Selection" : "प्लॉट निवड",
      description: language === "en" 
        ? "Choose your preferred plot based on Vastu or budget." 
        : "वास्तु किंवा बजेटनुसार तुमचा आवडता प्लॉट निवडा.",
      icon: MousePointerClick,
    },
    {
      id: 3,
      title: language === "en" ? "Legal Verification" : "कायदेशीर पडताळणी",
      description: language === "en" 
        ? "Take our file to your lawyer. Verify everything." 
        : "आमची फाईल तुमच्या वकिलाकडे न्या. सर्वकाही तपासा.",
      icon: FileSearch,
    },
    {
      id: 4,
      title: language === "en" ? "Agreement & Registry" : "करार आणि नोंदणी",
      description: language === "en" 
        ? "Transparent paperwork and government formalities." 
        : "पारदर्शक कागदपत्रे आणि सरकारी औपचारिकता.",
      icon: PenTool,
    },
    {
      id: 5,
      title: language === "en" ? "Possession" : "ताबा",
      description: language === "en" 
        ? "Handover of your plot with demarcated boundaries." 
        : "सीमांकन केलेल्या सीमांसह तुमच्या प्लॉटचा ताबा.",
      icon: Key,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-blue-700 font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 italic">
            {language === "en" ? "How it Works" : "प्रक्रिया कशी आहे"}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-6 tracking-tight">
            {language === "en" ? "Your 5-Step Path to Land Ownership" : "जमीन मालकीचा तुमचा ५-टप्प्यांचा प्रवास"}
          </h2>
          <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            {language === "en" 
              ? "We believe in a transparent and structured buying journey with no surprises." 
              : "आम्ही पारदर्शक आणि संरचित खरेदी प्रवासावर विश्वास ठेवतो."}
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div 
            className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-slate-200 z-0"
          ></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="relative z-10 flex flex-col items-center text-center group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl font-black text-slate-100 select-none z-0">
                  0{step.id}
                </div>
                
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 group-hover:border-blue-600 group-hover:shadow-xl transition-all duration-300 flex items-center justify-center mb-8 relative z-10">
                    <step.icon className="w-8 h-8 text-blue-700" />
                </div>
                
                <h3 className="text-xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessTimeline;
