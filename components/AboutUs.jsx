"use client";

import React from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Users,
  Target,
  Eye,
  TrendingUp,
  Home,
  Calendar,
  Award,
  ArrowRight,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

const CountUp = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value);
  const nodeRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const totalDuration = duration * 1000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Easing function: easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easedProgress * (end - start) + start);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

const AboutUs = () => {
  const { language } = useLanguage();


  const stats = [
    { 
      label: language === "en" ? "Years of Experience" : "वर्षांचा अनुभव", 
      value: "18+", 
      icon: <Calendar className="w-6 h-6 text-orange-500" /> 
    },
    { 
      label: language === "en" ? "Completed Layouts" : "पूर्ण लेआउट्स", 
      value: "12+", 
      icon: <Home className="w-6 h-6 text-blue-600" /> 
    },
    { 
      label: language === "en" ? "Happy Families" : "आनंदी कुटुंबे", 
      value: "1200+", 
      icon: <Users className="w-6 h-6 text-green-500" /> 
    },
  ];

  const team = [
    {
      name: language === "en" ? "Pramod Dange" : "प्रमोद डांगे",
      role: language === "en" ? "Founder & CEO" : "संस्थापक आणि सीईओ",
      image: "/pramod.jpeg",
      bio: language === "en"
        ? "With over 18 years of expertise, Pramod Dange is the visionary force behind our success, committed to creating sustainable and legally compliant communities."
        : "१८ वर्षांहून अधिक अनुभवासह, प्रमोद डांगे हे आमच्या यशामागील दूरदर्शी शक्ती आहेत, जे शाश्वत आणि कायदेशीररित्या सुसंगत समुदाय तयार करण्यासाठी वचनबद्ध आहेत."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-poppins">
      
      {/* 1. Hero Section: SINCE 2007 & Legacy */}
      <section className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden py-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-400 text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
              {language === "en" ? "Established 2007" : "२००७ पासून स्थापित"}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-white mb-8 leading-[1.2] tracking-tight"
          >
            {language === "en" ? "Foundations for" : "भावी पिढ्यांसाठी"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-orange-400">
              {language === "en" ? "Future Generations." : "पाया रचणे."}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light italic"
          >
            {language === "en"
              ? '"We don\'t just develop land; we build the stage for your family\'s greatest stories."'
              : '"आम्ही फक्त जमिनीचा विकास करत नाही; आम्ही तुमच्या कुटुंबाच्या महान कथांसाठी व्यासपीठ तयार करतो."'}
          </motion.p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-transparent opacity-50"></div>
        </div>
      </section>

      {/* 2. Founder & CEO: Leadership */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            {/* Left Column: Portrait */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                {/* Soft Background Accent */}
                <div className="absolute -inset-8 bg-gradient-to-br from-blue-50 to-orange-50 rounded-[3rem] opacity-40"></div>
                
                {/* Portrait Card */}
                <div className="relative bg-white rounded-[2rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
                  <img 
                    src={team[0].image} 
                    alt={team[0].name} 
                    className="w-full h-[600px] object-cover rounded-[1.5rem]"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Right Column: Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-1 lg:order-2 space-y-8"
            >
              {/* Label */}
              <div className="inline-block">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
                  {language === "en" ? "Leadership" : "नेतृत्व"}
                </span>
              </div>
              
              {/* Name */}
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {team[0].name}
              </h2>
              
              {/* Title */}
              <p className="text-3xl text-blue-700 font-serif italic">
                {team[0].role}
              </p>
              
              {/* Divider */}
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full"></div>
              
              {/* Story */}
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed max-w-xl">
                <p className="font-medium">
                  {language === "en"
                    ? "Building trust through transparency. For 18 years, I've been committed to creating land legacies that Nagpur families can depend on—legally secure, ethically developed, and built to last generations."
                    : "पारदर्शकतेद्वारे विश्वास निर्माण करणे. १८ वर्षांपासून, मी नागपूरच्या कुटुंबांसाठी कायदेशीररित्या सुरक्षित, नैतिकरित्या विकसित आणि पिढ्यान्पिढ्या टिकणारे जमिनीचे वारसे तयार करण्यासाठी वचनबद्ध आहे."}
                </p>
                <p className="text-slate-500 italic">
                  {language === "en"
                    ? "Real estate isn't just about land—it's about the foundation of your family's future."
                    : "रिअल इस्टेट म्हणजे फक्त जमीन नाही—ते तुमच्या कुटुंबाच्या भविष्याचा पाया आहे."}
                </p>
              </div>
              
              {/* Signature Element */}
              <div className="pt-6">
                <div className="inline-flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-12 h-px bg-slate-300"></div>
                  <span className="font-medium">{language === "en" ? "Since 2007" : "२००७ पासून"}</span>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 3. Our Journey: Community Impact */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                {language === "en" ? "My Journey in" : "माझा प्रवास"}<br />
                <span className="text-blue-700 italic font-serif">Nagpur Real Estate</span>
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-blue-700 to-orange-500 rounded-full mb-10"></div>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-700 font-bold text-xl uppercase tracking-tighter">07</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{language === "en" ? "The Beginning" : "सुरुवात"}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {language === "en" 
                        ? "Starting in 2007, I envisioned a company built on absolute transparency and legal clarity."
                        : "२००७ मध्ये सुरुवात करताना, मी पूर्ण पारदर्शकता आणि कायदेशीर स्पष्टतेवर आधारित कंपनीची कल्पना केली."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-700 font-bold text-xl uppercase tracking-tighter">12</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{language === "en" ? "The Milestone" : "एक टप्पा"}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {language === "en" 
                        ? "Successfully delivered 12+ premier layouts that have now become thriving residential communities."
                        : "१२+ प्रीमियम लेआउट यशस्वीरित्या पूर्ण केले जे आता भरभराट होणारे निवासी समुदाय बनले आहेत."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-700 font-bold text-xl uppercase tracking-tighter">24</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{language === "en" ? "The Future" : "भविष्य"}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {language === "en" 
                        ? "Today, we continue to lead with innovation, ensuring every plot we sell is a gold standard for investment."
                        : "आज, आम्ही नावीन्यपूर्ण नेतृत्व करत आहोत, हे सुनिश्चित करत आहोत की आम्ही विकलेला प्रत्येक प्लॉट गुंतवणुकीसाठी सुवर्ण मानक आहे."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-4 bg-orange-500/10 rounded-[3rem] blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
                alt="Our Projects" 
                className="relative rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 & 5. Combined Mission & Vision: The Core Values */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group relative p-10 md:p-14 rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/20 transition-all duration-500"></div>
              
              <div>
                <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-10 border border-blue-500/30 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
                  {language === "en" ? "Our Mission" : "आमचे ध्येय"}
                </h3>
                <p className="text-xl text-slate-300 leading-relaxed font-light italic relative z-10">
                  {language === "en"
                    ? "\"To provide high-quality, legally clear, and affordable residential plots that empower families to build their dream homes without compromise.\""
                    : "\"उच्च-गुणवत्तेचे, कायदेशीररित्या स्पष्ट आणि परवडणारे निवासी प्लॉट प्रदान करणे जे कुटुंबांना तडजोड न करता त्यांची स्वप्नातील घरे बांधण्यास सक्षम करतात.\""}
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                <span className="text-blue-500/50 font-bold text-xs uppercase tracking-[0.3em]">Integrity</span>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="group relative p-10 md:p-14 rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 hover:border-orange-500/50 transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-600/10 rounded-full -ml-16 -mt-16 blur-2xl group-hover:bg-orange-600/20 transition-all duration-500"></div>
              
              <div>
                <div className="w-16 h-16 bg-orange-600/20 text-orange-400 rounded-2xl flex items-center justify-center mb-10 border border-orange-500/30 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
                  {language === "en" ? "Our Vision" : "आमची दृष्टी"}
                </h3>
                <p className="text-xl text-slate-300 leading-relaxed font-light italic relative z-10">
                  {language === "en"
                    ? "\"To be the most trusted name in real estate development in Central India, known for integrity, innovation, and customer satisfaction.\""
                    : "\"मध्य भारतातील रिअल इस्टेट विकासामध्ये सर्वात विश्वासार्ह नाव बनणे, जे अखंडता, नावीन्य आणि ग्राहकांच्या समाधानासाठी ओळखले जाते.\""}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 to-transparent"></div>
                <span className="text-orange-500/50 font-bold text-xs uppercase tracking-[0.3em]">Innovation</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us: Strategic Advantage */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="text-orange-600 font-black tracking-widest uppercase text-xs mb-4 block">
              {language === "en" ? "The Dange Advantage" : "डांगे असोसिएटचे फायदे"}
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900">
              {language === "en" ? "Why Nagpur Trusts My Vision" : "नागपूर माझ्या दृष्टीवर का विश्वास ठेवते"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: language === "en" ? "100% Legal Titles" : "१००% कायदेशीर टायटल",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: language === "en" ? "Prime Locations" : "प्रमुख ठिकाणे",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: language === "en" ? "Affordable Pricing" : "परवडणाऱ्या किंमती",
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: language === "en" ? "Transparent Deals" : "पारदर्शक व्यवहार",
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:bg-white group"
              >
                <div className="text-slate-900 mb-6 flex justify-center group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <div className="w-12 h-1 bg-slate-200 group-hover:bg-orange-500 transition-all duration-300 mx-auto rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 center-0 w-full h-full bg-gradient-to-b from-blue-600/10 to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
            {language === "en" ? "Ready to Build Your Dream?" : "तुमचे स्वप्न पूर्ण करण्यास तयार आहात?"}
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            {language === "en" 
              ? "Contact us today to explore our latest projects and find the perfect plot for your future."
              : "आमचे नवीनतम प्रकल्प एक्सप्लोर करण्यासाठी आणि तुमच्या भविष्यासाठी योग्य प्लॉट शोधण्यासाठी आजच आमच्याशी संपर्क साधा."}
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-black py-5 px-12 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:-translate-y-1 text-lg"
          >
            {language === "en" ? "Get in Touch" : "संपर्क साधा"}
            <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
