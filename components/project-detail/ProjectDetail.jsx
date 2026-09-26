"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin, Rocket, CheckCircle2, Phone, MessageCircle, ArrowRight, ChevronRight, Rotate3d, ZoomIn, X,
  Landmark, Route, Trees, Lightbulb, TreePine, Footprints, Baby, Building2, Waves, Trophy, Fence,
  Droplets, Home, FileCheck2, School, ShoppingBag, Navigation, Building, Factory, MapPinned, Check,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import SiteVisitEnquiry from "../SiteVisitEnquiry";
import { useLanguage } from "../LanguageContext";
import Reveal, { stagger, rise } from "../motion/Reveal";
import CountUp from "../motion/CountUp";
import TiltCard from "../motion/TiltCard";
import Spotlight from "../fx/Spotlight";
import Magnetic from "../fx/Magnetic";
import { projects, getProject, t } from "@/lib/projects";

const LayoutFlythrough = dynamic(() => import("../project3d/LayoutFlythrough"), {
  ssr: false,
  loading: () => <div className="h-screen bg-slate-50" />,
});

const EASE = [0.22, 1, 0.36, 1];

const ICONS = {
  entrance: Landmark, road: Route, trees: Trees, light: Lightbulb, garden: TreePine, walk: Footprints,
  kids: Baby, club: Building2, pool: Waves, sports: Trophy, fence: Fence, water: Droplets, home: Home,
  docs: FileCheck2, school: School, shop: ShoppingBag, highway: Navigation, town: Building, industry: Factory,
  city: MapPinned,
};

const STATUS_STYLE = {
  current: { cls: "bg-blue-600/90", Icon: Rocket },
  ready: { cls: "bg-green-600/90", Icon: Home },
  completed: { cls: "bg-slate-900/80", Icon: CheckCircle2 },
};

function Eyebrow({ children, light }) {
  return (
    <span
      className={`inline-block font-semibold tracking-widest uppercase text-xs px-3 py-1.5 rounded-md border italic ${
        light ? "text-white bg-white/10 border-white/20 backdrop-blur" : "text-blue-700 bg-blue-50 border-blue-100"
      }`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
function Hero({ project, language }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const name = t(project.name, language);
  const status = STATUS_STYLE[project.statusType] ?? STATUS_STYLE.completed;

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-slate-900 md:h-[100svh] md:min-h-[640px]">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <motion.img
          src={project.heroImage}
          alt={name}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 2.6, ease: EASE }}
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/45 to-slate-900/30" />
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

      <motion.div style={{ y: contentY, opacity: fade }} className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:h-full md:min-h-0 md:pb-24">
        <div className="container mx-auto px-6">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/60"
          >
            <Link href="/" className="hover:text-white transition-colors">{language === "en" ? "Home" : "मुखपृष्ठ"}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/projects" className="hover:text-white transition-colors">{language === "en" ? "Projects" : "प्रकल्प"}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-orange-400">{name}</span>
          </motion.nav>

          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md ${status.cls}`}
          >
            <status.Icon className={`h-3.5 w-3.5 ${project.statusType === "current" ? "animate-pulse" : ""}`} />
            {t(project.status, language)}
          </motion.span>

          <h1 className="max-w-5xl text-5xl font-medium leading-[0.98] tracking-tight text-white md:text-7xl lg:text-8xl">
            {name.split(" ").map((w, i) => (
              <span key={`${language}-${i}`} className="mr-[0.22em] inline-block overflow-hidden pb-2 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.09, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-2xl"
          >
            {t(project.tagline, language)}
          </motion.p>

          <motion.a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="group mt-6 inline-flex items-center gap-3 text-white/80 hover:text-white"
          >
            <span className="rounded-xl bg-orange-500/20 p-2.5 border border-orange-400/30 group-hover:bg-orange-500 transition-colors">
              <MapPin className="h-5 w-5 text-orange-300 group-hover:text-white" />
            </span>
            <span className="text-xs font-medium uppercase tracking-widest md:text-sm">{t(project.location, language)}</span>
          </motion.a>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              variants={stagger(0.1, 1.1)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"
            >
              {project.stats.map((s, i) => (
                <motion.div
                  key={i}
                  variants={rise}
                  className="rounded-2xl border border-white/15 bg-slate-900/40 px-5 py-4 transition-colors hover:bg-slate-900/55 sm:min-w-[150px]"
                >
                  <div className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    {/^\d+[+%]?$/.test(s.value) ? <CountUp value={s.value} /> : s.value}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-white/60">{t(s.label, language)}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              {project.has3D && (
                <a
                  href="#flythrough"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-medium text-slate-900 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Rotate3d className="h-5 w-5 text-blue-700 transition-transform duration-700 group-hover:rotate-180" />
                  {language === "en" ? "Take the 3D Tour" : "3D सफर करा"}
                </a>
              )}
              <Magnetic className="block">
              <a
                href="tel:+917774882844"
                className="group flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-4 font-medium text-white shadow-xl shadow-orange-900/30 transition-all hover:-translate-y-0.5 hover:bg-orange-700"
              >
                <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
                {language === "en" ? "Book Free Site Visit" : "मोफत साइट भेट बुक करा"}
              </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2">
          <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="h-2 w-1 rounded-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function FlythroughIntro({ project, language }) {
  return (
    <section id="flythrough" className="relative scroll-mt-24 overflow-hidden bg-white py-24">
      <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <Eyebrow>{language === "en" ? "Interactive 3D Experience" : "इंटरॅक्टिव्ह 3D अनुभव"}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 md:text-6xl">
            {language === "en" ? (
              <>
                Fly through <span className="text-blue-700 italic font-serif font-semibold">{t(project.name, language)}</span>
              </>
            ) : (
              <>
                <span className="text-blue-700 italic font-serif font-semibold">{t(project.name, language)}</span> ची हवाई सफर
              </>
            )}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {language === "en"
              ? "Keep scrolling to fly over the layout, glide through the entrance, land on a plot and watch a home, then a whole society, come to life."
              : "स्क्रोल करत राहा: लेआउटवरून उड्डाण करा, प्रवेशद्वारातून आत या, एका प्लॉटवर उतरा आणि घर व संपूर्ण वसाहत साकार होताना पाहा."}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mx-auto mt-10 h-1 w-24 rounded-full bg-gradient-to-r from-blue-700 via-orange-500 to-blue-700" />
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Overview({ project, language }) {
  return (
    <section className="relative bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{language === "en" ? "Project Overview" : "प्रकल्पाचा आढावा"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 text-4xl font-medium leading-tight tracking-tight text-slate-900 md:text-5xl">
                {language === "en" ? "About " : ""}
                <span className="text-blue-700">{t(project.name, language)}</span>
                {language === "en" ? "" : " विषयी"}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-6">
              {t(project.longDescription, language).map((para, i) => (
                <Reveal key={i} delay={0.15 + i * 0.1}>
                  <p className="text-lg leading-relaxed text-slate-600">{para}</p>
                </Reveal>
              ))}
            </div>

            <motion.ul
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-12 grid gap-4 sm:grid-cols-2"
            >
              {project.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  variants={rise}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-700/20 transition-colors group-hover:bg-orange-500">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="font-medium leading-snug text-slate-800">{t(h, language)}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="lg:col-span-5">
            <Reveal x={30} y={0} className="lg:sticky lg:top-32">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-500/10" />
                <h3 className="relative text-xl font-semibold tracking-tight text-slate-900">
                  {language === "en" ? "Project at a glance" : "प्रकल्प एका दृष्टीक्षेपात"}
                </h3>
                <dl className="relative mt-6 divide-y divide-slate-100">
                  {project.facts.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: EASE }}
                      className="flex items-center justify-between gap-6 py-4"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{t(f.label, language)}</dt>
                      <dd className="text-right text-sm font-medium text-slate-900">{t(f.value, language)}</dd>
                    </motion.div>
                  ))}
                </dl>
                <div className="relative mt-8 grid gap-3">
                  <a href="tel:+917774882844" className="group flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-xl shadow-blue-600/15 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                    <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    {language === "en" ? "Call Executive" : "एक्झिक्युटिव्हला कॉल करा"}
                  </a>
                  <a href="https://wa.me/917774882844" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 font-semibold text-white shadow-xl shadow-emerald-600/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-700">
                    <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                    {language === "en" ? "WhatsApp Us" : "व्हॉट्सॲप करा"}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Amenities({ project, language }) {
  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-slate-50 py-24 md:py-32">
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#3B82F6_2px,transparent_2px)] [background-size:40px_40px]" />
      <div className="container relative mx-auto px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <Eyebrow>{language === "en" ? "Amenities" : "सुविधा"}</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 md:text-5xl">
              {language === "en" ? "Everything your family needs" : "तुमच्या कुटुंबाला हवे ते सर्व"}
            </h2>
          </Reveal>
        </div>
        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
        >
          {project.amenities.map((a, i) => {
            const Icon = ICONS[a.icon] ?? CheckCircle2;
            return (
              <motion.div
                key={i}
                variants={rise}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/5 transition-transform duration-700 group-hover:scale-[3]" />
                <Spotlight className="h-full p-6 md:p-8" color="rgba(249,115,22,0.1)">
                <div className="relative mb-6 [perspective:600px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 transition-colors duration-300 group-hover:bg-blue-700 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="relative text-base font-medium leading-snug text-slate-900 md:text-lg">{t(a.label, language)}</h3>
                </Spotlight>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Gallery({ project, language }) {
  const [open, setOpen] = useState(null);
  if (!project.gallery?.length) return null;
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>{language === "en" ? "Layout Plan" : "लेआउट प्लॅन"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 md:text-5xl">
                {language === "en" ? "See the full layout" : "संपूर्ण लेआउट पहा"}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-md font-medium text-slate-500">
              {language === "en" ? "Tap the plan to open it full screen and find your plot number." : "प्लॅन पूर्ण स्क्रीनवर उघडण्यासाठी टॅप करा आणि तुमचा प्लॉट क्रमांक शोधा."}
            </p>
          </Reveal>
        </div>
        {project.gallery.map((g, i) => (
          <Reveal key={i}>
            <button
              onClick={() => setOpen(g)}
              className="group relative block w-full overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl"
            >
              <motion.img
                src={g.src}
                alt={t(g.caption, language)}
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: EASE }}
                className="w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-900 shadow-lg">{t(g.caption, language)}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl transition-transform group-hover:scale-110">
                  <ZoomIn className="h-5 w-5" />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur"
            onClick={() => setOpen(null)}
            data-lenis-prevent
          >
            <motion.img
              src={open.src}
              alt={t(open.caption, language)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Location({ project, language }) {
  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal x={-30} y={0}>
            <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
              <iframe
                title={`${t(project.name, "en")} map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&z=14&output=embed`}
                className="h-[420px] w-full md:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <Eyebrow>{language === "en" ? "Location & Connectivity" : "ठिकाण आणि कनेक्टिव्हिटी"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 text-4xl font-medium leading-tight tracking-tight text-slate-900 md:text-5xl">
                {language === "en" ? "Well connected, peacefully placed" : "उत्तम कनेक्टिव्हिटी, शांत परिसर"}
              </h2>
            </Reveal>
            <div className="relative mt-10">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, ease: EASE }}
                className="absolute bottom-6 left-6 top-6 w-0.5 origin-top bg-gradient-to-b from-blue-700 via-orange-500 to-blue-700"
              />
              <motion.ul variants={stagger(0.12, 0.2)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="space-y-4">
                {project.connectivity.map((c, i) => {
                  const Icon = ICONS[c.icon] ?? MapPin;
                  return (
                    <motion.li key={i} variants={rise} className="group relative flex items-center gap-5">
                      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-blue-50 text-blue-700 shadow-md transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 transition-all duration-300 group-hover:translate-x-1 group-hover:border-blue-100 group-hover:bg-white group-hover:shadow-lg">
                        <p className="font-semibold text-slate-900">{t(c.label, language)}</p>
                        <p className="text-sm font-medium text-slate-500">{t(c.note, language)}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
            <Reveal delay={0.3}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(project.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-medium text-white shadow-lg transition-all hover:bg-slate-800"
              >
                <Navigation className="h-4 w-4" />
                {language === "en" ? "Get Directions" : "दिशा मिळवा"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function OtherProjects({ current, language }) {
  const others = projects.filter((p) => p.slug !== current.slug);
  return (
    <section className="overflow-hidden border-t border-slate-100 bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>{language === "en" ? "Explore More" : "आणखी पहा"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 text-3xl font-medium tracking-tight text-slate-900 md:text-5xl">
                {language === "en" ? "Other projects" : "इतर प्रकल्प"}
              </h2>
            </Reveal>
          </div>
          <Link href="/projects" className="hidden items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-slate-800 md:flex">
            {language === "en" ? "All Projects" : "सर्व प्रकल्प"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-8 [scrollbar-width:none]" data-lenis-prevent-wheel>
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 4) * 0.08} className="w-[300px] shrink-0 snap-start md:w-[360px]">
              <TiltCard className="group h-full rounded-[2rem]">
                <Link href={`/projects/${p.slug}`} className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl">
                  <div className="relative h-52 overflow-hidden">
                    <img src={p.image} alt={t(p.name, language)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    {p.has3D && (
                      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-blue-700 shadow">
                        <Rotate3d className="h-3.5 w-3.5" /> 3D
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-600">{t(p.status, language)}</span>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">{t(p.name, language)}</h3>
                    <p className="mt-2 line-clamp-1 text-sm font-medium text-slate-500">{t(p.location, language)}</p>
                    <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-slate-900">
                      {language === "en" ? "View project" : "प्रकल्प पहा"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export default function ProjectDetail({ slug }) {
  const { language } = useLanguage();
  const project = getProject(slug);
  if (!project) return null;

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <Hero project={project} language={language} />
        {project.has3D && (
          <>
            <FlythroughIntro project={project} language={language} />
            <LayoutFlythrough />
          </>
        )}
        <Overview project={project} language={language} />
        <Amenities project={project} language={language} />
        <Gallery project={project} language={language} />
        <Location project={project} language={language} />
        <OtherProjects current={project} language={language} />
      </main>
      <SiteVisitEnquiry />
      <Footer />
    </>
  );
}
