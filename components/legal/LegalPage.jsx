"use client";

import Navbar from "../Navbar";
import Footer from "../Footer";
import Reveal from "../motion/Reveal";
import { useLanguage } from "../LanguageContext";

export default function LegalPage({ title, updated, sections }) {
  const { language } = useLanguage();
  const L = (f) => (typeof f === "string" ? f : f[language] ?? f.en);
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pb-24 pt-36">
        <div className="container relative mx-auto max-w-3xl px-6">
          <Reveal>
            <span className="inline-block rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium uppercase italic tracking-widest text-blue-700">
              Dange Associates
            </span>
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
