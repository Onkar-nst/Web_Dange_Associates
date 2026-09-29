"use client";

import Navbar from "../Navbar";
import Footer from "../Footer";
import Reveal from "../motion/Reveal";
import { useLanguage } from "../LanguageContext";
import SectionLabel from "../ui/SectionLabel";

export default function LegalPage({ title, updated, sections }) {
  const { language } = useLanguage();
  const L = (f) => (typeof f === "string" ? f : f[language] ?? f.en);
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden pb-24 pt-36 bg-white">
        <div className="container relative mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionLabel>Dange Associates</SectionLabel>
            <h1 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 md:text-5xl">{L(title)}</h1>
            <p className="mt-3 text-sm text-slate-500">{L(updated)}</p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {sections.map((sec, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <h2 className="text-xl font-medium text-slate-900">{L(sec.h)}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{L(sec.p)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
