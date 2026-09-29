"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { MapPin, MousePointerClick, FileSearch, PenTool, Key, Check, ArrowLeft, ArrowRight } from "lucide-react";
import SectionLabel from "./ui/SectionLabel";

const ProcessTimeline = () => {
  const { language } = useLanguage();

  const en = language === "en";
  const [active, setActive] = useState(0);

  const steps = [
    {
      id: 1,
      icon: MapPin,
      image: "/steps/step-1-site-visit.webp",
      title: en ? "Site Visit" : "साइट भेट",
      summary: en ? "Pick-up & drop facility available. See the location yourself." : "पिक-अप आणि ड्रॉप सुविधा उपलब्ध. स्वतः जागा पहा.",
      details: en
        ? ["Call or WhatsApp us to fix a time that suits you.", "We pick you up and drop you back, free of charge.", "Walk the layout, roads and surroundings with our team."]
        : ["तुमच्या सोयीची वेळ ठरवण्यासाठी कॉल किंवा व्हॉट्सॲप करा.", "आम्ही तुम्हाला मोफत घेऊन जातो आणि परत सोडतो.", "आमच्या टीमसोबत लेआउट, रस्ते आणि परिसर पहा."],
    },
    {
      id: 2,
      icon: MousePointerClick,
      image: "/steps/step-2-plot-selection.webp",
      title: en ? "Plot Selection" : "प्लॉट निवड",
      summary: en ? "Choose your preferred plot based on Vastu or budget." : "वास्तु किंवा बजेटनुसार तुमचा आवडता प्लॉट निवडा.",
      details: en
        ? ["See available plot numbers on the layout map.", "Compare size, facing and Vastu for each plot.", "Get a clear price quote before you decide."]
        : ["लेआउट नकाशावर उपलब्ध प्लॉट क्रमांक पहा.", "प्रत्येक प्लॉटचा आकार, दिशा आणि वास्तु तुलना करा.", "निर्णय घेण्यापूर्वी स्पष्ट किंमत मिळवा."],
    },
    {
      id: 3,
      icon: FileSearch,
      image: "/steps/step-3-legal-verification.webp",
      title: en ? "Legal Verification" : "कायदेशीर पडताळणी",
      summary: en ? "Take our file to your lawyer. Verify everything." : "आमची फाईल तुमच्या वकिलाकडे न्या. सर्वकाही तपासा.",
      details: en
        ? ["We hand you copies of the 7/12, sanction letter and title search.", "We explain every document in plain language.", "Take the file to your own lawyer before you pay."]
        : ["आम्ही ७/१२, मंजुरी पत्र आणि टायटल सर्चच्या प्रती देतो.", "प्रत्येक कागदपत्र सोप्या भाषेत समजावून सांगतो.", "पैसे देण्यापूर्वी फाईल तुमच्या वकिलाकडे न्या."],
    },
    {
      id: 4,
      icon: PenTool,
      image: "/steps/step-4-registry.webp",
      title: en ? "Agreement & Registry" : "करार आणि नोंदणी",
      summary: en ? "Transparent paperwork and government formalities." : "पारदर्शक कागदपत्रे आणि सरकारी औपचारिकता.",
      details: en
        ? ["Sign a clear sale agreement with every term written down.", "We handle the stamp duty and registration appointment.", "The sale deed is registered in your name at the Sub-Registrar office."]
        : ["सर्व अटी लिहिलेला स्पष्ट विक्री करार करा.", "मुद्रांक शुल्क आणि नोंदणीची वेळ आम्ही सांभाळतो.", "दुय्यम निबंधक कार्यालयात विक्रीखत तुमच्या नावावर नोंदवले जाते."],
    },
    {
      id: 5,
      icon: Key,
      image: "/steps/step-5-possession.webp",
      title: en ? "Possession" : "ताबा",
      summary: en ? "Handover of your plot with demarcated boundaries." : "सीमांकन केलेल्या सीमांसह तुमच्या प्लॉटचा ताबा.",
      details: en
        ? ["We show you the boundary stones of your plot on site.", "You receive the possession letter and all original papers.", "Start planning your home, and call us any time for support."]
        : ["जागेवर तुमच्या प्लॉटचे सीमा दगड दाखवतो.", "ताबा पत्र आणि सर्व मूळ कागदपत्रे मिळतात.", "घराचे नियोजन सुरू करा, मदतीसाठी कधीही कॉल करा."],
    },
  ];

  const step = steps[active];
  const go = (d) => setActive((i) => Math.min(steps.length - 1, Math.max(0, i + d)));

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-slate-50 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-14 text-center">
          <SectionLabel>{en ? "How It Works" : "प्रक्रिया कशी आहे"}</SectionLabel>
          <h2 className="mt-6 text-3xl font-medium tracking-tight text-slate-900 md:text-5xl">
            {en ? "Your 5-Step Path to Land Ownership" : "जमीन मालकीचा तुमचा ५-टप्प्यांचा प्रवास"}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {en
              ? "We believe in a transparent and structured buying journey with no surprises."
              : "आम्ही पारदर्शक आणि संरचित खरेदी प्रवासावर विश्वास ठेवतो."}
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Stepper */}
          <div className="relative mb-10">
            <div className="absolute left-[10%] right-[10%] top-6 h-0.5 bg-slate-200" />
            <motion.div
              className="absolute left-[10%] top-6 h-0.5 origin-left bg-blue-700"
              style={{ width: "80%" }}
              animate={{ scaleX: active / (steps.length - 1) }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="relative grid grid-cols-5">
              {steps.map((st, i) => {
                const done = i < active;
                const current = i === active;
                return (
                  <button key={st.id} onClick={() => setActive(i)} className="group flex flex-col items-center gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                        current
                          ? "scale-110 border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-700/25"
                          : done
                          ? "border-blue-700 bg-white text-blue-700"
                          : "border-slate-200 bg-white text-slate-400 group-hover:border-blue-300"
                      }`}
                    >
                      {done ? <Check className="h-5 w-5" /> : `0${st.id}`}
                    </span>
                    <span
                      className={`hidden text-center text-sm font-medium transition-colors sm:block ${
                        current ? "text-slate-900" : "text-slate-500 group-hover:text-slate-800"
                      }`}
                    >
                      {st.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail card: fixed size. Every step's text is laid out in the same grid cell
              (inactive ones invisible), so the card always takes the tallest step's height. */}
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[420px]">
              {steps.map((st, i) => (
                <motion.img
                  key={st.id}
                  src={st.image}
                  alt={i === active ? st.title : ""}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.03 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ))}
              <span className="absolute bottom-4 left-4 select-none text-7xl font-semibold leading-none text-white/90 drop-shadow-lg md:text-8xl">
                0{step.id}
              </span>
            </div>

            <div className="flex flex-col p-8 md:p-12">
              <div className="grid">
                {steps.map((st, i) => {
                  const on = i === active;
                  return (
                    <motion.div
                      key={st.id}
                      aria-hidden={!on}
                      initial={false}
                      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={`[grid-area:1/1] ${on ? "" : "pointer-events-none"}`}
                      style={{ visibility: on ? "visible" : "hidden" }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <st.icon className="h-6 w-6" />
                      </div>
                      <p className="mt-6 text-sm font-medium text-blue-700">
                        {en ? "Step" : "टप्पा"} {st.id} {en ? "of" : "/"} {steps.length}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-slate-900 md:text-3xl">{st.title}</h3>
                      <p className="mt-3 text-slate-600">{st.summary}</p>
                      <ul className="mt-6 space-y-3">
                        {st.details.map((d) => (
                          <li key={d} className="flex gap-3 text-slate-700">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white">
                              <Check className="h-3 w-3" />
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto flex items-center justify-between pt-8">
                <button
                  onClick={() => go(-1)}
                  disabled={active === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {en ? "Back" : "मागे"}
                </button>
                {active < steps.length - 1 ? (
                  <button
                    onClick={() => go(1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {en ? "Next step" : "पुढील टप्पा"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href="tel:+917774882844"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800"
                  >
                    {en ? "Book a site visit" : "साइट भेट बुक करा"}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
