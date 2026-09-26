"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "./LanguageContext";
import { MapPin, Rocket, CheckCircle2, Home, ArrowRight, Rotate3d } from "lucide-react";
import SiteVisitEnquiry from "./SiteVisitEnquiry";
import TiltCard from "./motion/TiltCard";
import Spotlight from "./fx/Spotlight";
import { projects, t } from "@/lib/projects";

const EASE = [0.22, 1, 0.36, 1];

export default function ProjectsPage() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState("all");

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.statusType === filter);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const scrollOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: EASE,
      },
    },
  };

  const tabs = [
    { id: "all", label: language === "en" ? "All Projects" : "सर्व प्रकल्प" },
    { id: "current", label: language === "en" ? "Current Projects" : "सध्याचे प्रकल्प" },
    { id: "ready", label: language === "en" ? "Ready to Move" : "तयार घरे" },
    { id: "completed", label: language === "en" ? "Completed" : "पूर्ण" },
  ];

  const title = language === "en" ? "Our Projects" : "आमचे प्रकल्प";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Full-Screen Hero Section with Parallax */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
            <motion.img
              src="/hero-legacy.webp"
              alt="Hero"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: EASE }}
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
            <h1 className="text-5xl md:text-8xl font-medium text-white mb-6 tracking-tight">
              {title.split(" ").map((w, i) => (
                <span key={`${language}-${i}`} className="inline-block overflow-hidden align-bottom pb-2 mr-[0.25em] last:mr-0">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
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

        <main className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
          {/* Section Navigation / Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-20 border-b border-slate-100 pb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative px-8 py-4 rounded-2xl font-semibold text-sm uppercase tracking-widest transition-all ${
                  filter === tab.id
                    ? "text-white scale-105"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {filter === tab.id && (
                  <motion.span
                    layoutId="project-tab"
                    className="absolute inset-0 rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  layout
                  key={project.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: "easeOut" }}
                  className="h-full"
                >
                  <TiltCard max={5} className="group h-full rounded-[2rem]">
                    <Spotlight className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 border border-slate-100 flex flex-col h-full">
                      {/* Project Image with Status Badge */}
                      <Link href={`/projects/${project.slug}`} className="relative block overflow-hidden">
                        <img
                          src={project.image}
                          alt={t(project.name, language)}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {project.has3D && (
                          <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-blue-700 shadow-xl">
                            <Rotate3d className="h-3.5 w-3.5 animate-[spin_6s_linear_infinite]" />
                            {language === "en" ? "3D Tour" : "3D सफर"}
                          </span>
                        )}
                        <div className="absolute top-4 right-4 z-10">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xl backdrop-blur-md flex items-center gap-2 ${
                              project.statusType === "current"
                                ? "bg-blue-600/90"
                                : project.statusType === "ready"
                                ? "bg-green-600/90"
                                : "bg-slate-900/80"
                            }`}
                          >
                            {project.statusType === "current" && <Rocket className="w-3 h-3 animate-pulse" />}
                            {project.statusType === "ready" && <Home className="w-3 h-3" />}
                            {project.statusType === "completed" && <CheckCircle2 className="w-3 h-3" />}
                            {t(project.status, language)}
                          </span>
                        </div>
                      </Link>

                      <div className="p-8 flex flex-col flex-grow">
                        <Link href={`/projects/${project.slug}`}>
                          <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight group-hover:text-blue-700 transition-colors">
                            {t(project.name, language)}
                          </h3>
                        </Link>

                        <p className="text-slate-500 mb-8 line-clamp-2 leading-relaxed">{t(project.description, language)}</p>

                        <div className="mt-auto space-y-6">
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
                            <span className="text-slate-600 font-medium uppercase tracking-wider text-[11px] transition-colors">
                              {t(project.location, language)}
                            </span>
                          </a>

                          <Link
                            href={`/projects/${project.slug}`}
                            className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700 group/btn"
                          >
                            <span className="relative">{language === "en" ? "Explore Project" : "प्रकल्प पहा"}</span>
                            <ArrowRight className="relative h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover/btn:animate-shimmer" />
                          </Link>
                        </div>
                      </div>
                    </Spotlight>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
      <SiteVisitEnquiry />
      <Footer />
    </>
  );
}
