"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "./LanguageContext";
import { MapPin, Rocket, CheckCircle2 } from "lucide-react";
import SiteVisitEnquiry from "./SiteVisitEnquiry";

export default function ProjectsPage() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState("all");

  // Section 1: Current Projects
  const currentProjects = [
    {
      id: 1,
      name: language === "en" ? "Shree Ram Nagri-1" : "श्री राम नगरी-१",
      location: language === "en" 
        ? "State Highway 250, Kalemshwar, Bramni" 
        : "राज्य महामार्ग २५०, कळमेश्वर, ब्रामणी",
      description: language === "en"
        ? "Premium residential plots with clear titles and immediate possession. Fully developed layout with all modern amenities."
        : "स्पष्ट शीर्षक आणि तात्काळ ताबा असलेले प्रीमियम निवासी प्लॉट. सर्व आधुनिक सुविधांसह पूर्णपणे विकसित लेआउट.",
      image: "/project-imgg.jpg",
      status: language === "en" ? "Current Project" : "सध्याचा प्रकल्प",
      statusType: "current",
      mapQuery: "State Highway 250, Kalemshwar, Bramni"
    }
  ];

  // Section 2: Ready to Move Homes
  const readyToMoveProjects = [
    {
      id: 2,
      name: language === "en" ? "Ready to Move Homes" : "तयार घरे",
      location: language === "en" 
        ? "Beside Tahsil Office, Kalemshwar, Nagpur" 
        : "तहसील कार्यालयाजवळ, कळमेश्वर, नागपूर",
      description: language === "en"
        ? "Move-in ready residential properties with complete documentation and legal clearance. Perfect for immediate occupancy."
        : "संपूर्ण दस्तऐवजीकरण आणि कायदेशीर मंजुरीसह तयार निवासी मालमत्ता. तात्काळ वास्तव्यासाठी योग्य.",
      image: "/ghar.jpg",
      status: language === "en" ? "Ready to Move" : "तयार",
      statusType: "ready",
      mapQuery: "Tahsil Office, Kalemshwar, Nagpur"
    }
  ];

  // Section 3: Previous Projects
  const completedProjects = [
    {
      id: 3,
      name: language === "en" ? "Dange Layout 1" : "डांगे लेआउट १",
      location: language === "en" 
        ? "Behind Panchayat Samiti, Kalemshwar" 
        : "पंचायत समितीमागे, कळमेश्वर",
      description: language === "en"
        ? "Successfully completed residential layout with satisfied homeowners. All plots sold and occupied."
        : "समाधानी घरमालकांसह यशस्वीरित्या पूर्ण झालेला निवासी लेआउट. सर्व प्लॉट विकले आणि व्यापलेले.",
      image: "/project-imgg.jpg",
      status: language === "en" ? "Completed" : "पूर्ण",
      statusType: "completed",
      mapQuery: "Panchayat Samiti, Kalemshwar"
    },
    {
      id: 4,
      name: language === "en" ? "Dange Layout 2" : "डांगे लेआउट २",
      location: language === "en" 
        ? "Opposite Regent High School, Kalemshwar" 
        : "रेजेंट हायस्कूलसमोर, कळमेश्वर",
      description: language === "en"
        ? "Prime location residential development near educational institutions. Fully developed with modern infrastructure."
        : "शैक्षणिक संस्थांजवळ प्रमुख स्थानावरील निवासी विकास. आधुनिक पायाभूत सुविधांसह पूर्णपणे विकसित.",
      image: "/project-imgg.jpg",
      status: language === "en" ? "Completed" : "पूर्ण",
      statusType: "completed",
      mapQuery: "Regent High School, Kalemshwar"
    },
    {
      id: 5,
      name: language === "en" ? "Dange Layout 3" : "डांगे लेआउट ३",
      location: language === "en" 
        ? "Behind PWS College, Kalemshwar Bypass Road" 
        : "पीडब्ल्यूएस कॉलेजमागे, कळमेश्वर बायपास रोड",
      description: language === "en"
        ? "Strategic location on bypass road with excellent connectivity. Well-planned layout with all amenities."
        : "उत्कृष्ट कनेक्टिव्हिटीसह बायपास रोडवर धोरणात्मक स्थान. सर्व सुविधांसह सुनियोजित लेआउट.",
      image: "/project-imgg.jpg",
      status: language === "en" ? "Completed" : "पूर्ण",
      statusType: "completed",
      mapQuery: "PWS College, Kalemshwar Bypass Road"
    },
    {
      id: 6,
      name: language === "en" ? "Dange Layout 4" : "डांगे लेआउट ४",
      location: language === "en" 
        ? "Kohli Market Area, Mouza Kohli" 
        : "कोहली मार्केट एरिया, मौजा कोहली",
      description: language === "en"
        ? "Established residential community in Kohli market area. Complete infrastructure and peaceful environment."
        : "कोहली मार्केट क्षेत्रात स्थापित निवासी समुदाय. संपूर्ण पायाभूत सुविधा आणि शांत वातावरण.",
      image: "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=2232&auto=format&fit=crop",
      status: language === "en" ? "Completed" : "पूर्ण",
      statusType: "completed",
      mapQuery: "Kohli Market, Kalemshwar"
    },
    {
      id: 7,
      name: language === "en" ? "Om Sai Ram Nagar 1" : "ओम साई राम नगर १",
      location: language === "en" 
        ? "National Highway 353J, Kohli" 
        : "राष्ट्रीय महामार्ग ३५३जे, कोहली",
      description: language === "en"
        ? "Highway-facing residential plots with excellent road connectivity. Ideal for modern living."
        : "उत्कृष्ट रस्ता कनेक्टिव्हिटीसह महामार्गासमोरील निवासी प्लॉट. आधुनिक राहणीसाठी आदर्श.",
      image: "/project-imgg.jpg",
      status: language === "en" ? "Completed" : "पूर्ण",
      statusType: "completed",
      mapQuery: "National Highway 353J, Kohli, Kalemshwar"
    },
    {
      id: 8,
      name: language === "en" ? "Om Sai Ram Nagar 2" : "ओम साई राम नगर २",
      location: language === "en" 
        ? "Behind PWS College, Kalemshwar Bypass Road" 
        : "पीडब्ल्यूएस कॉलेजमागे, कळमेश्वर बायपास रोड",
      description: language === "en"
        ? "Well-established residential layout near educational hub. Family-friendly neighborhood with modern facilities."
        : "शैक्षणिक केंद्राजवळ सुस्थापित निवासी लेआउट. आधुनिक सुविधांसह कुटुंब-अनुकूल परिसर.",
      image: "/project-imgg.jpg",
      status: language === "en" ? "Completed" : "पूर्ण",
      statusType: "completed",
      mapQuery: "PWS College, Kalemshwar Bypass Road"
    }
  ];

  const allProjects = [...currentProjects, ...readyToMoveProjects, ...completedProjects];

  const filteredProjects = filter === "all" 
    ? allProjects 
    : filter === "current" 
    ? currentProjects 
    : filter === "ready"
    ? readyToMoveProjects
    : completedProjects;
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const scrollOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <Head>
          <title>
            {language === "en"
              ? "Projects | Dange Associates"
              : "प्रकल्प | डांगे असोसिएट्स"}
          </title>
        </Head>

        {/* Full-Screen Hero Section with Parallax */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src="/hero-legacy.png" 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40"></div>
          </motion.div>
          
          <motion.div 
            style={{ opacity: scrollOpacity }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container mx-auto px-6 relative z-10 text-center"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight"
            >
              {language === "en" ? "Our Projects" : "आमचे प्रकल्प"}
            </motion.h1>
            <motion.div 
              variants={itemVariants}
              className="inline-block px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
            >
              <p className="text-white/90 text-lg md:text-xl font-medium italic">
                {language === "en" 
                  ? "Helping families build their dream homes and vibrant communities since 2007." 
                  : "२००७ पासून कुटुंबांना त्यांची स्वप्नातील घरे आणि व्हायब्रंट समुदाय निर्माण करण्यात मदत करत आहोत."}
              </p>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>
        </section>

        {/* Ambient Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 50, 0], 
              y: [0, 100, 0],
              rotate: [0, 180, 360] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -50, 0], 
              y: [0, -100, 0],
              rotate: [360, 180, 0] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-100/20 rounded-full blur-[150px]"
          />
        </div>

        <main className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
          
          {/* Section Navigation / Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-20 border-b border-slate-100 pb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {language === "en" ? "All Projects" : "सर्व प्रकल्प"}
            </button>
            <button
              onClick={() => setFilter("current")}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                filter === "current"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {language === "en" ? "Current Projects" : "सध्याचे प्रकल्प"}
            </button>
            <button
              onClick={() => setFilter("ready")}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                filter === "ready"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {language === "en" ? "Ready to Move" : "तयार घरे"}
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                filter === "completed"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {language === "en" ? "Completed" : "पूर्ण"}
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
                <motion.div 
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full"
                >
                  {/* Project Image with Status Badge */}
                  <div className="relative">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-4 py-2 rounded-full text-xs font-black text-white shadow-xl backdrop-blur-md flex items-center gap-2 ${
                        project.statusType === "current" 
                          ? "bg-blue-600/90" 
                          : project.statusType === "ready"
                          ? "bg-green-600/90"
                          : "bg-slate-900/80"
                      }`}>
                        {project.statusType === "current" && <Rocket className="w-3 h-3 animate-pulse" />}
                        {project.statusType === "completed" && <CheckCircle2 className="w-3 h-3" />}
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                      {project.name}
                    </h3>
                    
                    <p className="text-slate-500 mb-8 line-clamp-2 leading-relaxed font-medium">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 group/address"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="p-2.5 rounded-xl bg-orange-50 group-hover/address:bg-blue-50 transition-colors duration-300"
                        >
                          <MapPin className="w-5 h-5 text-[#ea580c] group-hover/address:text-blue-600 transition-colors duration-300" />
                        </motion.div>
                        <span className="text-slate-600 font-bold uppercase tracking-wider text-[11px] transition-colors">
                          {project.location}
                        </span>
                      </a>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

        </main>
      </div>
      <SiteVisitEnquiry />
      <Footer />
    </>
  );
}
