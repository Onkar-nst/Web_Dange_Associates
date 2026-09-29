"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "./LanguageContext";
import { MapPin, ArrowRight } from "lucide-react";
import SiteVisitEnquiry from "./SiteVisitEnquiry";
import TiltCard from "./motion/TiltCard";
import Spotlight from "./fx/Spotlight";
import { projects, t } from "@/lib/projects";

const STATUS_DOT = {
  current: "bg-blue-600",
  ready: "bg-blue-700",
  completed: "bg-slate-400",
  upcoming: "bg-blue-700",
};

// Ready-to-move projects are listed under "Current".
const tabOf = (p) => (p.statusType === "ready" ? "current" : p.statusType);

export default function ProjectsPage() {
  const { language } = useLanguage();
  const en = language === "en";
  const [filter, setFilter] = useState("all");

  const tabs = [
    { id: "all", label: en ? "All" : "सर्व" },
    { id: "current", label: en ? "Current" : "सध्याचे" },
    { id: "upcoming", label: en ? "Upcoming" : "आगामी" },
    { id: "completed", label: en ? "Completed" : "पूर्ण" },
  ].map((tab) => ({
    ...tab,
    count: tab.id === "all" ? projects.length : projects.filter((p) => tabOf(p) === tab.id).length,
  }));

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => tabOf(p) === filter);

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Page header: full-bleed banner like the About page */}
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-900 pt-24">
          <img src="/hero-legacy.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="container relative z-10 mx-auto px-6 text-center">
            <h1 className="mb-6 text-5xl font-semibold tracking-tight text-white md:text-8xl">
              {en ? "Our Projects" : "आमचे प्रकल्प"}
            </h1>
            <div className="inline-block rounded-2xl border border-white/10 bg-white/5 px-8 py-4 shadow-2xl backdrop-blur-md">
              <p className="text-lg font-medium italic text-white/90 md:text-xl">
                {en
                  ? "Helping families build their dream homes and vibrant communities since 2007."
                  : "२००७ पासून कुटुंबांना त्यांची स्वप्नातील घरे आणि व्हायब्रंट समुदाय निर्माण करण्यात मदत करत आहोत."}
              </p>
            </div>
          </div>
          <a href="#projects" aria-label="Scroll to projects" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <span className="block h-12 w-1 rounded-full opacity-60 bg-white/40" />
          </a>
        </section>

        <section id="projects" className="scroll-mt-24 container mx-auto max-w-7xl px-6 py-6 md:py-8">
          {/* Filter */}
          <div className="mb-10 flex gap-8 overflow-x-auto border-b border-slate-200">
            {tabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
                    active ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-slate-400">{tab.count}</span>
                </button>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 px-6 py-16 text-center">
              <p className="text-lg font-medium text-slate-900">
                {en ? "New projects coming soon" : "नवीन प्रकल्प लवकरच"}
              </p>
              <p className="mt-2 text-slate-600">
                {en
                  ? "Call us to hear about upcoming layouts before they are announced."
                  : "आगामी लेआउटबद्दल आधी माहिती मिळवण्यासाठी आम्हाला कॉल करा."}
              </p>
              <a href="tel:+917774882844" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
                +91 77748 82844 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <TiltCard key={project.slug} max={5} className="group h-full rounded-[2rem]">
              <Spotlight
                as="article"
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl"
              >
                <Link href={`/projects/${project.slug}`} className="relative block h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={t(project.name, language)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {project.has3D && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-widest text-blue-800 shadow">
                      {en ? "3D Tour" : "3D सफर"}
                    </span>
                  )}
                  <span className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs font-medium text-white shadow backdrop-blur-md">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.statusType]}`} />
                    {t(project.status, language)}
                  </span>
                </Link>

                <div className="flex flex-grow flex-col p-8">
                  <h2 className="mb-3 text-2xl font-medium tracking-tight text-slate-900 transition-colors group-hover:text-blue-800">
                    <Link href={`/projects/${project.slug}`}>{t(project.name, language)}</Link>
                  </h2>
                  <p className="mb-8 line-clamp-2 leading-relaxed text-slate-500">{t(project.description, language)}</p>

                  <div className="mt-auto space-y-6">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3"
                    >
                      <span className="rounded-xl bg-slate-100 p-2.5">
                        <MapPin className="h-5 w-5 text-blue-800" />
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-600">{t(project.location, language)}</span>
                    </a>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-800"
                    >
                      {en ? "Explore Project" : "प्रकल्प पहा"}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Spotlight>
              </TiltCard>
            ))}
          </div>
        </section>
      </main>
      <SiteVisitEnquiry />
      <Footer />
    </>
  );
}
