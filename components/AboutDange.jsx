"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import SectionLabel from "./ui/SectionLabel";
import Reveal from "./motion/Reveal";

export default function AboutDange() {
  const { language } = useLanguage();
  const en = language === "en";

  return (
    <section id="about" className="bg-slate-50 py-8 md:py-10">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionLabel>{en ? "About Dange Associates & Developers" : "डांगे असोसिएट्स अँड डेव्हलपर्सबद्दल"}</SectionLabel>
            </Reveal>
            <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              {en ? "18+ Years." : "१८+ वर्षे."}
              <br />
              <span className="text-blue-700">{en ? "Still Building." : "अजूनही उभारत आहोत."}</span>
            </h2>
          </div>
          <Reveal delay={0.12}>
            <div className="space-y-5 text-lg leading-relaxed text-slate-600 lg:pt-10">
              <p>
                {en
                  ? "18 years have taught us that good land development is not about selling more plots. It is about clear titles, honest paperwork and layouts families can build their lives on."
                  : "१८ वर्षांनी आम्हाला शिकवले की चांगला जमीन विकास म्हणजे जास्त प्लॉट विकणे नव्हे. तर स्पष्ट मालकी, प्रामाणिक कागदपत्रे आणि कुटुंबे ज्यावर आयुष्य उभारू शकतील असे लेआउट."}
              </p>
              <p>
                {en
                  ? "From our first layout behind the Panchayat Samiti to the neighbourhoods we build today, every chapter has been shaped by trust and a commitment to Kalmeshwar."
                  : "पंचायत समितीमागील पहिल्या लेआउटपासून आजच्या वसाहतींपर्यंत, प्रत्येक टप्पा विश्वास आणि कळमेश्वरप्रती बांधिलकीने घडला आहे."}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-10 flex lg:justify-end">
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              {en ? "Our Story" : "आमची कथा"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
