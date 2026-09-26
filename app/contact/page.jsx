"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/Contactform";
import { Building, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import Diorama from "@/components/fx/Diorama";
import Spotlight from "@/components/fx/Spotlight";
import Reveal from "@/components/motion/Reveal";

const EASE = [0.22, 1, 0.36, 1];

export default function ContactSection() {
  const { language } = useLanguage();

  const contactItems = [
    {
      icon: Building,
      tone: "text-blue-700 bg-blue-50 border-blue-100",
      title: language === "en" ? "Visit Us" : "आमच्याकडे या",
      content:
        language === "en"
          ? "Dange Associates office, beside ICICI Bank, Kalmeshwar - 441501"
          : "डांगे असोसिएट्स कार्यालय, आयसीआयसीआय बँकेजवळ, कळमेश्वर - ४४१५०१",
      href: "https://www.google.com/maps?q=Dange+Associates,+Kalmeshwar",
    },
    {
      icon: Phone,
      tone: "text-emerald-700 bg-emerald-50 border-emerald-100",
      title: language === "en" ? "Call Us" : "आम्हाला कॉल करा",
      content: "+91 7774882844",
      href: "tel:+917774882844",
    },
    {
      icon: Mail,
      tone: "text-orange-600 bg-orange-50 border-orange-100",
      title: language === "en" ? "Email Us" : "आम्हाला ईमेल करा",
      content: "vedantdange18@gmail.com",
      href: "mailto:vedantdange18@gmail.com",
    },
  ];

  const title = language === "en" ? "Let's talk about your plot" : "तुमच्या प्लॉटबद्दल बोलूया";

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-orange-50">

        {/* Hero: copy + live 3D office pin */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-32 md:px-6 lg:grid-cols-2 lg:px-8 lg:pt-36">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium uppercase italic tracking-widest text-blue-700"
            >
              {language === "en" ? "Contact" : "संपर्क"}
            </motion.span>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
              {title.split(" ").map((w, i) => (
                <span key={`${language}-${i}`} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: EASE }}>
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              {language === "en"
                ? "We're just a message or call away. Visit our Kalmeshwar office, call our executive, or send us your details and we'll get back to you."
                : "आम्ही फक्त एक संदेश किंवा कॉल दूर आहोत. आमच्या कळमेश्वर कार्यालयात या, कॉल करा किंवा तुमचे तपशील पाठवा — आम्ही तुमच्याशी संपर्क साधू."}
            </motion.p>

            <div className="mt-10 grid gap-4">
              {contactItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 + index * 0.12, ease: EASE }}
                >
                  <Spotlight
                    as="a"
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="[perspective:600px]">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(360deg)] ${item.tone}`}>
                        <item.icon className="h-5 w-5" />
                      </span>
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium uppercase tracking-widest text-slate-400">{item.title}</span>
                      <span className="mt-1 block text-base text-slate-800">{item.content}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange-500" />
                  </Spotlight>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            className="relative h-[380px] md:h-[520px]"
          >
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18),rgba(59,130,246,0.12)_50%,transparent_72%)] blur-2xl" />
            <Diorama variant="pin" className="absolute inset-0" />
          </motion.div>
        </section>

        {/* Form + map */}
        <section className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-24 md:px-6 lg:grid-cols-5 lg:px-8">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl">
              <iframe
                title="Dange Associates office map"
                src="https://maps.google.com/maps?q=Khadi%20Gram%20Sankul%2C%20Kalmeshwar%2C%20Maharashtra%20441501&z=15&output=embed"
                className="min-h-[320px] w-full flex-1"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex items-center gap-3 px-5 py-4 text-sm text-slate-600">
                <Clock className="h-4 w-4 animate-pulse text-amber-500" />
                <span>
                  <span className="font-medium text-slate-900">{language === "en" ? "Mon – Sat" : "सोम – शनि"}</span> · 09:00 AM – 06:00 PM
                </span>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
