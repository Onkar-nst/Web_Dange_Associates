"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Rotate3d, Mouse, Check } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { heroPlot } from "./layoutPlan";

// Chapter ranges must line up with the camera keyframes / TIMELINE in LayoutScene.js
const CHAPTERS = [
  {
    range: [0, 0.1],
    eyebrow: { en: "The Master Plan", mr: "मास्टर प्लॅन" },
    title: { en: "Shree Ram Nagri-1, from above", mr: "वरून दिसणारी श्री राम नगरी-१" },
    body: {
      en: "A fully planned residential layout on State Highway 250 near Kalmeshwar, with wide roads, green open spaces and more than 140 demarcated plots.",
      mr: "कळमेश्वरजवळ राज्य महामार्ग २५० वरील पूर्ण नियोजित निवासी लेआउट: रुंद रस्ते, हिरव्या मोकळ्या जागा आणि १४० पेक्षा जास्त सीमांकित प्लॉट.",
    },
    chips: [{ en: "140+ plots", mr: "१४०+ प्लॉट" }, { en: "SH-250 frontage", mr: "SH-250 लगत" }, { en: "Clear title", mr: "स्पष्ट शीर्षक" }],
  },
  {
    range: [0.1, 0.22],
    eyebrow: { en: "Highway Frontage", mr: "महामार्गालगत" },
    title: { en: "Right on State Highway 250", mr: "थेट राज्य महामार्ग २५० वर" },
    body: {
      en: "Direct highway access keeps Kalmeshwar town, the MIDC and Nagpur city within easy reach.",
      mr: "थेट महामार्ग प्रवेशामुळे कळमेश्वर शहर, एमआयडीसी आणि नागपूर शहर सहज आवाक्यात.",
    },
  },
  {
    range: [0.22, 0.36],
    eyebrow: { en: "Grand Entrance", mr: "भव्य प्रवेशद्वार" },
    title: { en: "Drive in through the gate", mr: "प्रवेशद्वारातून आत या" },
    body: {
      en: "A palm-lined boulevard leads into wide internal roads with footpaths, street lights and avenue trees.",
      mr: "पाम वृक्षांनी सजलेला प्रवेश मार्ग पदपथ, पथदिवे आणि झाडांसह रुंद अंतर्गत रस्त्यांकडे घेऊन जातो.",
    },
  },
  {
    range: [0.36, 0.5],
    eyebrow: { en: "Demarcated Plots", mr: "सीमांकित प्लॉट" },
    title: { en: "Every plot, clearly marked", mr: "प्रत्येक प्लॉट स्पष्टपणे चिन्हांकित" },
    body: {
      en: "Numbered plots with boundary stones at every corner. Choose by Vastu, size or budget, with a clear title and immediate registry.",
      mr: "प्रत्येक कोपऱ्यावर सीमा दगडांसह क्रमांकित प्लॉट. वास्तु, आकार किंवा बजेटनुसार निवडा — स्पष्ट शीर्षक आणि तात्काळ नोंदणीसह.",
    },
  },
  {
    range: [0.5, 0.61],
    eyebrow: { en: "Lifestyle Amenities", mr: "जीवनशैली सुविधा" },
    title: { en: "Room to play, relax and grow", mr: "खेळ, विश्रांती आणि प्रगतीसाठी जागा" },
    body: {
      en: "A central garden with a walking track, a kids' play area, and a clubhouse with a swimming pool and sports courts.",
      mr: "चालण्याच्या ट्रॅकसह मध्यवर्ती उद्यान, मुलांचे खेळाचे मैदान आणि जलतरण तलाव व क्रीडा कोर्टसह क्लबहाऊस.",
    },
  },
  {
    range: [0.61, 0.69],
    eyebrow: { en: "Your Plot", mr: "तुमचा प्लॉट" },
    title: { en: `Plot No. ${heroPlot.n} could be yours`, mr: `प्लॉट क्र. ${heroPlot.n} तुमचा होऊ शकतो` },
    body: {
      en: "Stand on your own piece of land and picture the home your family will build on it.",
      mr: "तुमच्या स्वतःच्या जमिनीवर उभे राहा आणि तुमचे कुटुंब त्यावर बांधणार असलेल्या घराची कल्पना करा.",
    },
  },
  {
    range: [0.69, 0.87],
    eyebrow: { en: "Your Home", mr: "तुमचे घर" },
    title: { en: "Watch your home take shape", mr: "तुमचे घर आकार घेताना पाहा" },
    body: {
      en: "From foundation to finishing, a clear-title plot is the right start for the home you've always wanted.",
      mr: "पायापासून पूर्णत्वापर्यंत — स्पष्ट शीर्षक असलेला प्लॉट हीच तुमच्या स्वप्नातील घराची योग्य सुरुवात.",
    },
    stages: true,
  },
  {
    range: [0.87, 1.0001],
    eyebrow: { en: "A Living Society", mr: "जिवंत वसाहत" },
    title: { en: "A whole neighbourhood, ready for you", mr: "संपूर्ण वसाहत, तुमच्यासाठी तयार" },
    body: {
      en: "As families settle in, Shree Ram Nagri-1 grows into a community of homes, gardens and friendly streets. Book a free site visit to pick your plot.",
      mr: "कुटुंबे स्थायिक होत असताना श्री राम नगरी-१ घरे, बागा आणि आपुलकीच्या रस्त्यांचा समुदाय बनते. तुमचा प्लॉट निवडण्यासाठी मोफत साइट भेट बुक करा.",
    },
    cta: true,
  },
];

const RAIL = [
  { en: "Master plan", mr: "मास्टर प्लॅन" },
  { en: "Highway", mr: "महामार्ग" },
  { en: "Entrance", mr: "प्रवेशद्वार" },
  { en: "Plots", mr: "प्लॉट" },
  { en: "Amenities", mr: "सुविधा" },
  { en: "Your plot", mr: "तुमचा प्लॉट" },
  { en: "Your home", mr: "तुमचे घर" },
  { en: "Society", mr: "वसाहत" },
];

// Build stages shown while the home is being built (progress within the build chapter)
const STAGES = [
  { at: 0, label: { en: "Foundation", mr: "पाया" } },
  { at: 0.14, label: { en: "Structure", mr: "रचना" } },
  { at: 0.36, label: { en: "Walls & roof", mr: "भिंती व छत" } },
  { at: 0.64, label: { en: "Finishing", mr: "फिनिशिंग" } },
  { at: 0.8, label: { en: "Move in", mr: "गृहप्रवेश" } },
];

const hx = heroPlot.cx;
const hz = heroPlot.cz;
const LABELS = [
  { text: { en: "State Highway 250", mr: "राज्य महामार्ग २५०" }, pos: [154, 4, 55], from: 0.08, to: 0.26 },
  { text: { en: "Main Gate", mr: "मुख्य प्रवेशद्वार" }, pos: [132, 12.5, -20], from: 0.12, to: 0.3 },
  { text: { en: "Wide internal roads", mr: "रुंद अंतर्गत रस्ते" }, pos: [0, 1, -40], from: 0.37, to: 0.46 },
  { text: { en: "Central Garden", mr: "मध्यवर्ती उद्यान" }, pos: [102, 3, 64], from: 0.5, to: 0.6 },
  { text: { en: "Kids' Play Area", mr: "खेळाचे मैदान" }, pos: [98, 4, 4], from: 0.5, to: 0.6 },
  { text: { en: "Clubhouse", mr: "क्लबहाऊस" }, pos: [89, 11, -48], from: 0.52, to: 0.63 },
  { text: { en: "Swimming Pool", mr: "जलतरण तलाव" }, pos: [113, 1.5, -48], from: 0.53, to: 0.63 },
  { text: { en: "Sports Courts", mr: "क्रीडा कोर्ट" }, pos: [103, 4, -86], from: 0.55, to: 0.63 },
  { text: { en: `Plot No. ${heroPlot.n}`, mr: `प्लॉट क्र. ${heroPlot.n}` }, pos: [hx, 11.5, hz], from: 0.61, to: 0.71, accent: true },
  { text: { en: "Your Home", mr: "तुमचे घर" }, pos: [hx, 10.8, hz - 0.8], from: 0.84, to: 0.91, accent: true },
];

const chapterAt = (p) => {
  const i = CHAPTERS.findIndex((c) => p >= c.range[0] && p < c.range[1]);
  return i < 0 ? CHAPTERS.length - 1 : i;
};
const stageAt = (p) => {
  const b = (p - 0.69) / 0.18;
  let s = 0;
  STAGES.forEach((st, i) => {
    if (b >= st.at) s = i;
  });
  return s;
};

export default function LayoutFlythrough() {
  const { language } = useLanguage();
  const L = (f) => f[language] ?? f.en;
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const barRef = useRef(null);
  const hintRef = useRef(null);
  const labelRefs = useRef([]);
  const sceneRef = useRef(null);
  const visibleRef = useRef(false);
  const chapterRef = useRef(0);
  const stageIdxRef = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [stage, setStage] = useState(0);
  const [loadP, setLoadP] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const syncUi = (p) => {
    const c = chapterAt(p);
    if (c !== chapterRef.current) {
      chapterRef.current = c;
      setChapter(c);
    }
    const s = stageAt(p);
    if (s !== stageIdxRef.current) {
      stageIdxRef.current = s;
      setStage(s);
    }
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p * 60));
  };

  // Scroll → progress
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      sceneRef.current?.setProgress(p);
      if (!sceneRef.current?.running) syncUi(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scene lifecycle
  useEffect(() => {
    let disposed = false;
    let scene;
    const isMobile = window.matchMedia("(max-width: 768px)").matches || /Mobi|Android/i.test(navigator.userAgent);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) {
      setFailed(true);
      return;
    }

    // Don't compete with the page's first paint: only start preparing the 3D scene
    // once the visitor scrolls within ~1.5 screens of the fly-through.
    let started = false;
    const boot = async () => {
      if (started || disposed) return;
      started = true;
      nearIo.disconnect();
      try {
        const { default: LayoutScene } = await import("./LayoutScene");
        if (disposed) return;
        scene = new LayoutScene(canvasRef.current, {
          isMobile,
          reducedMotion,
          onProgress: (v) => !disposed && setLoadP(v),
          onFrame: syncUi,
        });
        sceneRef.current = scene;
        scene.setLabels(LABELS.map((l, i) => ({ el: labelRefs.current[i], pos: l.pos, from: l.from, to: l.to })));
        await scene.init();
        if (disposed) return;
        const el = sectionRef.current;
        const rect = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
        scene.setProgress(p);
        scene.progress = p;
        setReady(true);
        if (visibleRef.current) scene.start();
      } catch (err) {
        console.error("3D layout failed to start", err);
        scene?.dispose();
        sceneRef.current = null;
        if (!disposed) setFailed(true);
      }
    };
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && boot(), { rootMargin: "35% 0px 35% 0px" });
    nearIo.observe(sectionRef.current);
    // Warm the HTTP cache with the tour's textures while the visitor reads the page (network only, no main-thread work).
    const prefetch = () => {
      if (started || disposed) return;
      const files = [
        "sky/day.jpg", "sky/dusk.jpg", "sky/day.hdr", "sky/dusk.hdr", "trees/jacaranda.webp", "trees/searsia.webp", "trees/trees.json",
        ...["grass", "lawn", "dirt", "dirt_nor", "asphalt", "paver", "soil", "plaster", "concrete", "brick", "wood", "stone", "pooltile", "deck", "wall"].map((n) => `tex/${n}.webp`),
      ];
      files.forEach((f) => fetch(`/flythrough/${f}`, { priority: "low" }).catch(() => {}));
    };
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    const prefetchTimer = setTimeout(() => idle(prefetch, { timeout: 4000 }), 1500);

    return () => {
      disposed = true;
      nearIo.disconnect();
      clearTimeout(prefetchTimer);
      scene?.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only render while on screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) sceneRef.current?.start();
        else sceneRef.current?.stop();
      },
      { rootMargin: "100px" },
    );
    io.observe(sectionRef.current);
    const ro = new ResizeObserver(() => sceneRef.current?.resize());
    ro.observe(stageRef.current);
    const onVis = () => {
      if (document.hidden) sceneRef.current?.stop();
      else if (visibleRef.current) sceneRef.current?.start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const onPointerMove = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  };

  const jumpTo = (i) => {
    const el = sectionRef.current;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const [a, b] = CHAPTERS[i].range;
    const y = top + total * Math.min(0.999, a + (Math.min(b, 1) - a) * 0.35);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 2.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const ch = CHAPTERS[chapter];

  if (failed) {
    return (
      <section className="relative py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <img src="/project-imgg.webp" alt="Shree Ram Nagri-1 master layout" className="w-full rounded-[2rem] shadow-2xl border-8 border-white" />
          <p className="mt-6 text-slate-500 font-medium">
            {language === "en"
              ? "Your browser can't show the 3D fly-through, so here is the master layout instead."
              : "तुमचा ब्राउझर 3D दृश्य दाखवू शकत नाही, म्हणून हा मास्टर लेआउट पहा."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-slate-900" style={{ height: "900vh" }} aria-label="3D fly-through of the layout">
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden" onPointerMove={onPointerMove}>
        <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full block transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />

        {/* soft vignettes for legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950/45 to-transparent" />

        {/* 3D-anchored labels (positioned every frame by the scene) */}
        <div className="pointer-events-none absolute inset-0">
          {LABELS.map((l, i) => (
            <div key={i} ref={(el) => (labelRefs.current[i] = el)} className="absolute left-0 top-0" style={{ opacity: 0, willChange: "transform, opacity" }}>
              <div className="flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <div
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] shadow-xl ${
                    l.accent ? "bg-orange-600 text-white" : "bg-white/95 text-slate-900 border border-white"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${l.accent ? "bg-white" : "bg-orange-500"} animate-pulse`} />
                  {L(l.text)}
                </div>
                <div className={`h-7 w-px ${l.accent ? "bg-orange-500" : "bg-white/90"}`} />
                <div className={`h-2 w-2 rounded-full ${l.accent ? "bg-orange-500 ring-4 ring-orange-500/30" : "bg-white ring-4 ring-white/30"}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Top badge */}
        <div className="absolute left-4 md:left-10 top-28 md:top-32 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-lg border border-white">
            <Rotate3d className="h-4 w-4 text-blue-700" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
              {language === "en" ? "3D Fly-through" : "3D सफर"}
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="pointer-events-none absolute left-1/2 top-28 md:top-auto md:bottom-32 -translate-x-1/2 flex flex-col items-center gap-2 text-white drop-shadow-lg transition-opacity">
          <Mouse className="h-6 w-6 animate-bounce" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{language === "en" ? "Scroll to fly in" : "स्क्रोल करा"}</span>
        </div>

        {/* Chapter rail */}
        <nav className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block" aria-label="Fly-through chapters">
          <ol className="flex flex-col gap-1 rounded-3xl bg-white/85 p-3 shadow-2xl backdrop-blur-md border border-white">
            {RAIL.map((r, i) => (
              <li key={i}>
                <button onClick={() => jumpTo(i)} className="group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-blue-50">
                  <span className={`relative flex h-2.5 w-2.5 items-center justify-center rounded-full transition-all duration-500 ${i === chapter ? "bg-orange-500 scale-125" : i < chapter ? "bg-blue-700" : "bg-slate-300"}`}>
                    {i === chapter && <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping" />}
                  </span>
                  <span className={`text-[11px] font-medium uppercase tracking-wider transition-colors ${i === chapter ? "text-slate-900" : "text-slate-400 group-hover:text-blue-700"}`}>
                    {L(r)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Chapter card */}
        <div className="absolute inset-x-4 bottom-8 md:inset-x-auto md:left-10 md:bottom-14 md:w-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.75rem] bg-white/90 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)] border border-white"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-medium italic text-orange-600 leading-none">0{chapter + 1}</span>
                <span className="text-xs font-semibold text-slate-300">/ 0{CHAPTERS.length}</span>
                <span className="ml-auto text-blue-700 font-semibold tracking-widest uppercase text-[10px] bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 italic">
                  {L(ch.eyebrow)}
                </span>
              </div>
              <h3 className="text-2xl md:text-[2rem] font-semibold leading-tight tracking-tight text-slate-900">{L(ch.title)}</h3>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">{L(ch.body)}</p>

              {ch.chips && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {ch.chips.map((c, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className="rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white"
                    >
                      {L(c)}
                    </motion.span>
                  ))}
                </div>
              )}

              {ch.stages && (
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-1">
                    {STAGES.map((s, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex w-full items-center">
                          <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i <= stage ? "bg-orange-500" : "bg-slate-200"} transition-colors duration-500`} />
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-all duration-500 ${
                              i < stage ? "border-blue-700 bg-blue-700 text-white" : i === stage ? "border-orange-500 bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30" : "border-slate-200 bg-white text-slate-400"
                            }`}
                          >
                            {i < stage ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <div className={`h-0.5 flex-1 ${i === STAGES.length - 1 ? "opacity-0" : i < stage ? "bg-orange-500" : "bg-slate-200"} transition-colors duration-500`} />
                        </div>
                        <span className={`text-center text-[9px] md:text-[10px] font-medium uppercase tracking-wider leading-tight ${i === stage ? "text-slate-900" : "text-slate-400"}`}>
                          {L(s.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ch.cta && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a href="tel:+917774882844" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5">
                    <Phone className="h-4 w-4" />
                    {language === "en" ? "Book Site Visit" : "साइट भेट बुक करा"}
                  </a>
                  <a href="https://wa.me/917774882844" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar + disclaimer */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
          <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-blue-700 via-orange-500 to-blue-700" style={{ transform: "scaleX(0)" }} />
        </div>
        <p className="pointer-events-none absolute bottom-3 right-4 hidden md:block text-[10px] font-semibold uppercase tracking-widest text-white/80 drop-shadow">
          {language === "en" ? "Illustrative 3D visualisation · refer to the sanctioned layout" : "प्रातिनिधिक 3D दृश्य · मंजूर लेआउट पहा"}
        </p>

        {/* Loader */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50"
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="relative grid grid-cols-4 gap-1.5 mb-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-6 w-8 rounded-sm border-2 border-blue-700/70"
                    animate={{ backgroundColor: ["rgba(249,115,22,0)", "rgba(249,115,22,0.9)", "rgba(249,115,22,0)"] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-slate-900">
                {language === "en" ? "Laying out the plots" : "प्लॉटची आखणी सुरू आहे"}
              </p>
              <div className="relative mt-4 h-1 w-48 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-gradient-to-r from-blue-700 to-orange-500 transition-all duration-300" style={{ width: `${Math.round(loadP * 100)}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
