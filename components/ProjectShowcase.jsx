"use client";

import { useLanguage } from "./LanguageContext";
import { BadgeCheck, MapPin, Ruler, ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ProjectShowcase = () => {
  const { language } = useLanguage();

  const projects = [
    {
      id: 1,
      name: language === "en" ? "Shree Ram Nagri-1" : "श्री राम नगरी-१",
      location: language === "en" ? "State Highway 250, Kalemshwar, Bramni" : "राज्य महामार्ग २५०, कळमेश्वर, ब्रामणी",
      status: language === "en" ? "Current Project" : "सध्याचा प्रकल्प",
      statusColor: "bg-blue-100 text-blue-700",
      description: language === "en"
        ? "Premium residential plots with clear titles and immediate possession. Fully developed layout with all modern amenities."
        : "स्पष्ट शीर्षक आणि तात्काळ ताबा असलेले प्रीमियम निवासी प्लॉट. सर्व आधुनिक सुविधांसह पूर्णपणे विकसित लेआउट.",
      image: "/project-imgg.jpg", 
      sold: 70,
    },
    {
      id: 2,
      name: language === "en" ? "Ready to Move Homes" : "तयार घरे",
      location: language === "en" ? "Beside Tahsil Office, Kalemshwar, Nagpur" : "तहसील कार्यालयाजवळ, कळमेश्वर, नागपूर",
      status: language === "en" ? "Ready to Move" : "तयार",
      statusColor: "bg-green-100 text-green-700",
      description: language === "en"
        ? "Move-in ready residential properties with complete documentation and legal clearance. Perfect for immediate occupancy."
        : "संपूर्ण दस्तऐवजीकरण आणि कायदेशीर मंजुरीसह तयार निवासी मालमत्ता. तात्काळ वास्तव्यासाठी योग्य.",
      image: "/ghar.jpg",
      sold: 20,
    },
    {
      id: 3,
      name: language === "en" ? "Om Sai Ram Nagar 1" : "ओम साई राम नगर १",
      location: language === "en" ? "National Highway 353J, Kohli" : "राष्ट्रीय महामार्ग ३५३जे, कोहली",
      status: language === "en" ? "Few Plots Left" : "काही प्लॉट शिल्लक",
      statusColor: "bg-red-100 text-red-700",
      description: language === "en"
        ? "Highway-facing residential plots with excellent road connectivity. Ideal for modern living."
        : "उत्कृष्ट रस्ता कनेक्टिव्हिटीसह महामार्गासमोरील निवासी प्लॉट. आधुनिक राहणीसाठी आदर्श.",
      image: "/project-imgg.jpg",
      sold: 90,
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-3xl">
            <span className="text-blue-700 font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 italic">
              {language === "en" ? "Our Active Projects" : "आमचे सक्रिय प्रकल्प"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-4">
              {language === "en" ? "Invest in Verified & Sanctioned Layouts" : "सत्यापित आणि मंजूर लेआउट्समध्ये गुंतवणूक करा"}
            </h2>
            <p className="text-slate-600 mt-6 text-lg leading-relaxed">
              {language === "en" 
                ? "Reliable land development across Nagpur's fastest-growing areas. Every project comes with a 100% legal guarantee and immediate registration."
                : "नागपूरच्या वेगाने वाढणाऱ्या क्षेत्रांमध्ये विश्वसनीय जमीन विकास. प्रत्येक प्रकल्प १००% कायदेशीर हमी आणि तात्काळ नोंदणीसह येतो."}
            </p>
          </div>
          
          <Link 
            href="/projects" 
            className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            {language === "en" ? "View All Projects" : "सर्व प्रकल्प पहा"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-60 overflow-hidden shrink-0">
                <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider shadow-sm ${project.statusColor}`}>
                  {project.status}
                </div>
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight group-hover:text-blue-700 transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-red-500 mt-0.5 shrink-0" />
                    <span className="font-bold text-slate-700 text-sm">{project.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                   <Link
                    href={`/projects`}
                    className="flex items-center justify-center bg-slate-100 text-slate-800 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all text-sm"
                  >
                    {language === "en" ? "Details" : "तपशील"}
                  </Link>
                  <Link
                    href={`/contact`}
                    className="flex items-center justify-center bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-md hover:shadow-orange-200 text-sm"
                  >
                    {language === "en" ? "Enquire" : "चौकशी करा"}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
            <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold w-full justify-center"
          >
            {language === "en" ? "View All Projects" : "सर्व प्रकल्प पहा"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ProjectShowcase;
