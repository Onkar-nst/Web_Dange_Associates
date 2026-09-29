"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import SectionLabel from "../ui/SectionLabel";
import Reveal from "../motion/Reveal";

// Leaflet touches `window`, so the map is client-only.
const FootprintMap = dynamic(() => import("./FootprintMap"), {
  ssr: false,
  loading: () => <div className="fp__map" />,
});

const EASE = [0.22, 1, 0.36, 1];

// NOTE: coordinates are approximate, placed from each project's landmark.
// Replace them with the exact lat/lng from Google Maps before going live.
const REGIONS = [
  {
    id: "town",
    name: { en: "Kalmeshwar Town", mr: "कळमेश्वर शहर" },
    pins: [
      { slug: "ready-to-move-homes", name: { en: "Ready to Move Homes", mr: "तयार घरे" }, location: { en: "Beside Tahsil Office", mr: "तहसील कार्यालयाजवळ" }, status: "current", coords: [21.2335, 78.9168] },
      { slug: "dange-layout-1", name: { en: "Dange Layout 1", mr: "डांगे लेआउट १" }, location: { en: "Behind Panchayat Samiti", mr: "पंचायत समितीमागे" }, status: "completed", coords: [21.2352, 78.9128] },
      { slug: "dange-layout-2", name: { en: "Dange Layout 2", mr: "डांगे लेआउट २" }, location: { en: "Opp. Regent High School", mr: "रेजेंट हायस्कूलसमोर" }, status: "completed", coords: [21.2296, 78.9102] },
    ],
  },
  {
    id: "bypass",
    name: { en: "Kalmeshwar Bypass Road", mr: "कळमेश्वर बायपास रोड" },
    pins: [
      { slug: "dange-layout-3", name: { en: "Dange Layout 3", mr: "डांगे लेआउट ३" }, location: { en: "Behind PWS College", mr: "पीडब्ल्यूएस कॉलेजमागे" }, status: "completed", coords: [21.2418, 78.9236] },
      { slug: "om-sai-ram-nagar-2", name: { en: "Om Sai Ram Nagar 2", mr: "ओम साई राम नगर २" }, location: { en: "Behind PWS College", mr: "पीडब्ल्यूएस कॉलेजमागे" }, status: "completed", coords: [21.2432, 78.9258] },
    ],
  },
  {
    id: "kohli",
    name: { en: "Kohli & NH-353J", mr: "कोहली आणि NH-353J" },
    pins: [
      { slug: "dange-layout-4", name: { en: "Dange Layout 4", mr: "डांगे लेआउट ४" }, location: { en: "Kohli Market, Mouza Kohli", mr: "कोहली मार्केट, मौजा कोहली" }, status: "completed", coords: [21.2168, 78.9712] },
      { slug: "om-sai-ram-nagar-1", name: { en: "Om Sai Ram Nagar 1", mr: "ओम साई राम नगर १" }, location: { en: "NH-353J, Kohli", mr: "NH-353J, कोहली" }, status: "completed", coords: [21.2192, 78.9768] },
    ],
  },
  {
    id: "sh250",
    name: { en: "State Highway 250 · Bramni", mr: "राज्य महामार्ग २५० · ब्रामणी" },
    pins: [
      { slug: "shree-ram-nagri-1", name: { en: "Shree Ram Nagri-1", mr: "श्री राम नगरी-१" }, location: { en: "SH-250, Bramni", mr: "SH-250, ब्रामणी" }, status: "current", coords: [21.2535, 78.8842] },
    ],
  },
  {
    id: "katol",
    name: { en: "Katol", mr: "काटोल" },
    pins: [
      { slug: null, name: { en: "Maati Farms", mr: "माती फार्म्स" }, location: { en: "Katol · Farm plots", mr: "काटोल · फार्म प्लॉट" }, status: "upcoming", coords: [21.2711, 78.5857] },
    ],
  },
];

const LEGEND = ["completed", "current", "upcoming"];
const STATUS = {
  completed: { en: "Completed", mr: "पूर्ण" },
  current: { en: "Ongoing", mr: "सुरू" },
  upcoming: { en: "Upcoming", mr: "आगामी" },
};

export default function Footprint() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = (f) => f[language] ?? f.en;
  const router = useRouter();
  const [open, setOpen] = useState(null);
  const [hidden, setHidden] = useState([]);

  const allPins = useMemo(
    () =>
      REGIONS.flatMap((r) =>
        r.pins.map((p) => ({ ...p, region: r.id, name: L(p.name), location: L(p.location) })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );
  const pins = useMemo(() => allPins.filter((p) => !hidden.includes(p.status)), [allPins, hidden]);
  const statusLabel = useMemo(() => (s) => L(STATUS[s]), [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleStatus = (s) => setHidden((h) => (h.includes(s) ? h.filter((x) => x !== s) : [...h, s]));
  const onSelect = (p) => {
    if (p.slug) router.push(`/projects/${p.slug}`);
    else window.open(`https://wa.me/917774882844?text=${encodeURIComponent(`Hi, I want to know more about ${p.name}.`)}`, "_blank");
  };

  return (
    <section className="relative overflow-clip bg-[#0b1426] py-12 text-white md:py-16">
      {/* Background: soft glows + faint plot grid */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="container relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-10">
          <div>
            <Reveal>
              <SectionLabel dark>{en ? "Geographical Network" : "आमचे प्रकल्प नकाशावर"}</SectionLabel>
            </Reveal>
            <h2 className="mt-6 text-4xl font-medium leading-[1.1] tracking-tight text-white md:text-6xl">
              {en ? "Our Footprint Across" : "आमचा विस्तार"}
              <br />
              <span className="text-blue-300">{en ? "Kalmeshwar & Nagpur" : "कळमेश्वर आणि नागपूर"}</span>
            </h2>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Region list */}
          <Reveal className="order-2 lg:order-1">

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              {REGIONS.map((r) => {
                const isOpen = open === r.id;
                return (
                  <div key={r.id} className={`border-b border-white/10 last:border-b-0 transition-colors ${isOpen ? "bg-white/[0.04]" : ""}`}>
                    <button
                      onClick={() => setOpen(isOpen ? null : r.id)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:text-blue-300 ${
                        isOpen ? "text-blue-300" : "text-slate-100"
                      }`}
                    >
                      <span className="truncate text-base md:text-lg">{L(r.name)}</span>
                      <span className="flex shrink-0 items-center gap-4">
                        <span className="font-mono text-xs text-slate-500">
                          ({r.pins.length} {en ? (r.pins.length === 1 ? "Project" : "Projects") : "प्रकल्प"})
                        </span>
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 ${
                            isOpen ? "rotate-180 border-blue-400/40 bg-blue-500/15" : "border-white/15"
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <ul className="px-5 pb-5">
                            {r.pins.map((p) => (
                              <li key={L(p.name)} className="flex items-center gap-3 border-b border-dashed border-white/10 py-2.5 text-[15px] text-slate-300 last:border-b-0">
                                <i className={`dot dot--${p.status}`} />
                                {p.slug ? (
                                  <Link href={`/projects/${p.slug}`} className="hover:text-white">{L(p.name)}</Link>
                                ) : (
                                  L(p.name)
                                )}
                                <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.11em] text-slate-500">
                                  {L(STATUS[p.status])}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.1} className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="relative">
              <FootprintMap pins={pins} allPins={allPins} focus={open} onSelect={onSelect} statusLabel={statusLabel} />

              {/* Status filter, overlaid on the map's top-right corner */}
              <div className="absolute right-3 top-3 z-[500] flex flex-wrap justify-end gap-2">
                {LEGEND.map((s) => {
                  const on = !hidden.includes(s);
                  return (
                    <button
                      key={s}
                      aria-pressed={on}
                      onClick={() => toggleStatus(s)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] backdrop-blur-md transition-all ${
                        on ? "border-white/20 bg-slate-950/70 text-white" : "border-white/10 bg-slate-950/50 text-slate-500"
                      }`}
                    >
                      <i className={`dot ${on ? `dot--${s}` : "bg-slate-600"}`} />
                      {L(STATUS[s])}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
