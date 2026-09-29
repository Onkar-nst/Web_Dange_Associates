"use client";

import React from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Users,
  Target,
  Eye,
  TrendingUp,
  Home,
  Calendar,
  Award,
  ArrowRight,
  MapPin,
  Quote,
  Phone,
  ClipboardCheck,
  Handshake,
  FileSearch
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import Diorama from "./fx/Diorama";
import PlotWave from "./fx/PlotWave";
import Magnetic from "./fx/Magnetic";
import TiltCard from "./motion/TiltCard";
import SectionLabel from "./ui/SectionLabel";

const CountUp = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value);
  const nodeRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const totalDuration = duration * 1000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Easing function: easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easedProgress * (end - start) + start);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

// Three-column story shown on the Our Story page. Years and project order: confirm with the team.
const STORY_COLUMNS = [
  {
    "lead": {
      "en": "The journey began in 2006 with Dange Layout 1, behind the Panchayat Samiti in Kalmeshwar — every plot sold with a clear title and every paper explained.",
      "mr": "प्रवासाची सुरुवात २००६ मध्ये कळमेश्वरमधील पंचायत समितीमागील डांगे लेआउट १ ने झाली — प्रत्येक प्लॉट स्पष्ट मालकीसह आणि प्रत्येक कागदपत्र समजावून."
    },
    "text": {
      "en": "The years that followed saw layouts opposite Regent High School and behind PWS College, giving families plots close to schools, colleges and the town centre.",
      "mr": "पुढील वर्षांत रेजेंट हायस्कूलसमोर आणि पीडब्ल्यूएस कॉलेजमागे लेआउट उभे राहिले, ज्यामुळे कुटुंबांना शाळा, महाविद्यालये आणि शहराजवळ प्लॉट मिळाले."
    }
  },
  {
    "lead": {
      "en": "Growth along the highways brought a new scale. Dange Layout 4 and Om Sai Ram Nagar 1 & 2 opened up Kohli and the NH-353J corridor.",
      "mr": "महामार्गालगतच्या वाढीमुळे नवा विस्तार झाला. डांगे लेआउट ४ आणि ओम साई राम नगर १ व २ मुळे कोहली आणि NH-353J पट्टा खुला झाला."
    },
    "text": {
      "en": "With direct road connectivity to Nagpur, these layouts have grown into settled neighbourhoods where families have built their homes.",
      "mr": "नागपूरला थेट रस्ता जोडणीमुळे हे लेआउट आता स्थिर वसाहती बनले आहेत, जिथे कुटुंबांनी आपली घरे बांधली आहेत."
    }
  },
  {
    "lead": {
      "en": "The years since have been defined by complete, well-planned neighbourhoods.",
      "mr": "त्यानंतरची वर्षे संपूर्ण, सुनियोजित वसाहतींची ठरली."
    },
    "text": {
      "en": "From Shree Ram Nagri-1 on State Highway 250, with wide roads, a garden and a clubhouse, to ready-to-move homes beside the Tahsil Office and Maati Farms at Katol, each project reflects what Kalmeshwar families need today.",
      "mr": "राज्य महामार्ग २५० वरील रुंद रस्ते, उद्यान आणि क्लबहाऊस असलेल्या श्री राम नगरी-१ पासून तहसील कार्यालयाजवळील तयार घरे आणि काटोल येथील माती फार्म्सपर्यंत, प्रत्येक प्रकल्प आजच्या कळमेश्वरच्या कुटुंबांच्या गरजा पूर्ण करतो."
    }
  }
];

const AboutUs = () => {
  const { language } = useLanguage();


  const stats = [
    { 
      label: language === "en" ? "Years of Experience" : "वर्षांचा अनुभव", 
      value: "18+", 
      icon: <Calendar className="w-6 h-6 text-blue-700" /> 
    },
    { 
      label: language === "en" ? "Completed Layouts" : "पूर्ण लेआउट्स", 
      value: "12+", 
      icon: <Home className="w-6 h-6 text-blue-600" /> 
    },
    { 
      label: language === "en" ? "Happy Families" : "आनंदी कुटुंबे", 
      value: "1200+", 
      icon: <Users className="w-6 h-6 text-blue-700" /> 
    },
  ];

  const team = [
    {
      name: language === "en" ? "Pramod Dange" : "प्रमोद डांगे",
      role: language === "en" ? "Founder & CEO" : "संस्थापक आणि सीईओ",
      image: "/pramod-dange.webp",
      bio: language === "en"
        ? "With over 18 years of expertise, Pramod Dange is the visionary force behind our success, committed to creating sustainable and legally compliant communities."
        : "१८ वर्षांहून अधिक अनुभवासह, प्रमोद डांगे हे आमच्या यशामागील दूरदर्शी शक्ती आहेत, जे शाश्वत आणि कायदेशीररित्या सुसंगत समुदाय तयार करण्यासाठी वचनबद्ध आहेत."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-poppins">
      
      {/* 1. Hero Section: SINCE 2007 & Legacy */}
      <section className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden py-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <PlotWave className="opacity-60 [mask-image:linear-gradient(to_top,black_30%,transparent_85%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <SectionLabel dark>{language === "en" ? "Established 2007" : "२००७ पासून स्थापित"}</SectionLabel>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-medium text-white mb-8 leading-[1.2] tracking-tight"
          >
            {language === "en" ? "Foundations for" : "भावी पिढ्यांसाठी"}{" "}
            <span className="text-blue-200">
              {language === "en" ? "Future Generations." : "पाया रचणे."}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light italic"
          >
            {language === "en"
              ? '"We don\'t just develop land; we build the stage for your family\'s greatest stories."'
              : '"आम्ही फक्त जमिनीचा विकास करत नाही; आम्ही तुमच्या कुटुंबाच्या महान कथांसाठी व्यासपीठ तयार करतो."'}
          </motion.p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-12 rounded-full opacity-50 bg-white/40"></div>
        </div>
      </section>

      {/* 2. Founder & CEO: Leadership */}
      <section className="relative overflow-hidden bg-slate-50 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border border-blue-100 bg-blue-50" />
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/10">
                <img src={team[0].image} alt={team[0].name} className="aspect-[4/5] w-full object-cover object-top" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent p-6 pt-20 text-white">
                  <p className="text-2xl font-medium">{team[0].name}</p>
                  <p className="mt-1 text-sm text-white/80">{team[0].role} · Dange Associates</p>
                </div>
              </div>
              <div className="absolute -right-3 top-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg md:-right-6">
                <p className="text-3xl font-semibold leading-none text-blue-700">18+</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{language === "en" ? "Years in real estate" : "वर्षांचा अनुभव"}</p>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <SectionLabel>{language === "en" ? "Leadership" : "नेतृत्व"}</SectionLabel>
              <h2 className="mt-6 text-3xl font-medium tracking-tight text-slate-900 md:text-4xl">
                {language === "en" ? "A message from our founder" : "आमच्या संस्थापकांचा संदेश"}
              </h2>

              <blockquote className="relative mt-8 border-l-4 border-blue-700 pl-6">
                <Quote className="absolute -left-1 -top-6 h-10 w-10 -translate-x-full text-blue-100" />
                <p className="text-2xl font-medium leading-snug text-slate-900 md:text-3xl">
                  {language === "en"
                    ? "Real estate isn't just about land — it's about the foundation of your family's future."
                    : "रिअल इस्टेट म्हणजे फक्त जमीन नाही — ते तुमच्या कुटुंबाच्या भविष्याचा पाया आहे."}
                </p>
              </blockquote>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600">
                {language === "en"
                  ? "Building trust through transparency. For 18 years, I've been committed to creating land legacies that Nagpur families can depend on — legally secure, ethically developed, and built to last generations."
                  : "पारदर्शकतेद्वारे विश्वास निर्माण करणे. १८ वर्षांपासून, मी नागपूरच्या कुटुंबांसाठी कायदेशीररित्या सुरक्षित, नैतिकरित्या विकसित आणि पिढ्यान्पिढ्या टिकणारे जमिनीचे वारसे तयार करण्यासाठी वचनबद्ध आहे."}
              </p>

              <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-5">
                {[
                  { v: "2007", l: language === "en" ? "Founded" : "स्थापना" },
                  { v: "12+", l: language === "en" ? "Layouts delivered" : "पूर्ण लेआउट" },
                  { v: "1200+", l: language === "en" ? "Families served" : "कुटुंबे" },
                ].map((x) => (
                  <div key={x.l} className="px-4 first:pl-0">
                    <dd className="text-2xl font-semibold text-slate-900">{x.v}</dd>
                    <dt className="mt-1 text-sm text-slate-500">{x.l}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="font-serif text-3xl italic text-slate-800">Pramod Dange</p>
                  <p className="text-sm text-slate-500">{team[0].role}</p>
                </div>
                <a
                  href="tel:+917774882844"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Phone className="h-4 w-4" />
                  {language === "en" ? "Talk to our team" : "आमच्या टीमशी बोला"}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 & 5. Mission & Vision: two framed columns */}
      <section className="bg-slate-50 py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid overflow-hidden rounded-3xl border border-slate-900 md:grid-cols-2"
          >
            {[
              {
                label: language === "en" ? "Our Mission" : "आमचे ध्येय",
                statement:
                  language === "en"
                    ? "To give every Nagpur family a plot they can build on with complete confidence."
                    : "नागपूरच्या प्रत्येक कुटुंबाला पूर्ण विश्वासाने घर बांधता येईल असा प्लॉट देणे.",
                body:
                  language === "en"
                    ? "Since 2006, we have delivered high-quality, legally clear and affordable residential plots, with every document explained before you pay, so families can build their dream homes without compromise."
                    : "२००६ पासून आम्ही उच्च-गुणवत्तेचे, कायदेशीररित्या स्पष्ट आणि परवडणारे निवासी प्लॉट देत आहोत. पैसे देण्यापूर्वी प्रत्येक कागदपत्र समजावून सांगतो, जेणेकरून कुटुंबे तडजोड न करता स्वप्नातील घर बांधू शकतील.",
              },
              {
                label: language === "en" ? "Our Vision" : "आमची दृष्टी",
                statement:
                  language === "en"
                    ? "To be the most trusted name in land development in Central India."
                    : "मध्य भारतातील जमीन विकासातील सर्वात विश्वासार्ह नाव बनणे.",
                body:
                  language === "en"
                    ? "Known for integrity, well-planned layouts and customer satisfaction, we aim to build neighbourhoods around Kalmeshwar and Nagpur that families are proud to call home for generations."
                    : "प्रामाणिकपणा, सुनियोजित लेआउट आणि ग्राहकांच्या समाधानासाठी ओळखले जाणारे, कळमेश्वर आणि नागपूर परिसरात पिढ्यान्पिढ्या अभिमानाने घर म्हणता येतील अशा वसाहती उभारणे हे आमचे ध्येय आहे.",
              },
            ].map((c, i) => (
              <div key={c.label} className={`p-8 md:p-14 ${i === 1 ? "border-t border-slate-900 md:border-l md:border-t-0" : ""}`}>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-700">{c.label}</p>
                <h3 className="mt-6 text-2xl font-normal leading-snug tracking-tight text-slate-900 md:text-3xl">{c.statement}</h3>
                <p className="mt-6 text-base leading-relaxed text-slate-500 md:text-lg">{c.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Our Story: three-column narrative */}
      <section className="bg-slate-50 py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>{language === "en" ? "Our Story" : "आमची कथा"}</SectionLabel>
            <h2 className="mt-8 text-4xl font-medium leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
              {language === "en" ? "From Kalmeshwar town" : "कळमेश्वर शहरापासून"}
              <br />
              <span className="text-blue-700">{language === "en" ? "to the highways of Nagpur" : "नागपूरच्या महामार्गांपर्यंत"}</span>
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-12">
            {STORY_COLUMNS.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-lg leading-relaxed text-slate-900">{c.lead[language] ?? c.lead.en}</p>
                <p className="mt-6 text-lg leading-relaxed text-slate-500">{c.text[language] ?? c.text.en}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 text-center"
          >
            <p className="text-2xl font-medium uppercase tracking-tight text-blue-700 md:text-4xl">
              {language === "en" ? "18+ Years · 12+ Layouts · Kalmeshwar & Nagpur" : "१८+ वर्षे · १२+ लेआउट · कळमेश्वर आणि नागपूर"}
            </p>
            <p className="mt-4 text-lg text-slate-500">
              {language === "en"
                ? "From our first layout behind the Panchayat Samiti to our next generation of neighbourhoods."
                : "पंचायत समितीमागील पहिल्या लेआउटपासून आमच्या पुढच्या पिढीच्या वसाहतींपर्यंत."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6. Values: dark band, four framed columns */}
      <section id="values" className="bg-blue-950 py-10 text-white md:py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel dark>{language === "en" ? "Why Dange Associates?" : "डांगे असोसिएट्स का?"}</SectionLabel>
            <h2 className="mt-6 text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">
              {language === "en" ? "The values we" : "आमची"}
              <br />
              <span className="text-blue-300">{language === "en" ? "build on" : "मूल्ये"}</span>
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {[
              {
                Icon: ClipboardCheck,
                kicker: language === "en" ? "Developed with care" : "काळजीपूर्वक विकास",
                title: language === "en" ? "Quality" : "गुणवत्ता",
                body: language === "en"
                  ? "Fully developed layouts with proper roads, drainage, water and electricity lines, built to last for generations."
                  : "योग्य रस्ते, ड्रेनेज, पाणी आणि वीज जोडणीसह पूर्ण विकसित लेआउट, पिढ्यान्पिढ्या टिकणारे.",
              },
              {
                Icon: Handshake,
                kicker: language === "en" ? "Ethical foundation" : "नैतिक पाया",
                title: language === "en" ? "Integrity" : "प्रामाणिकपणा",
                body: language === "en"
                  ? "Honest dealing and clear commitments since 2006. What we promise at the site visit is what we deliver at possession."
                  : "२००६ पासून प्रामाणिक व्यवहार आणि स्पष्ट वचने. साइट भेटीत जे सांगतो तेच ताब्याच्या वेळी देतो.",
              },
              {
                Icon: FileSearch,
                kicker: language === "en" ? "Papers first" : "आधी कागदपत्रे",
                title: language === "en" ? "Transparency" : "पारदर्शकता",
                body: language === "en"
                  ? "Every document — 7/12, sanction letter, title search — shared and explained before you pay, so you can verify with your own lawyer."
                  : "प्रत्येक कागदपत्र — ७/१२, मंजुरी पत्र, टायटल सर्च — पैसे देण्यापूर्वी दाखवून समजावून सांगतो, जेणेकरून तुम्ही वकिलाकडून तपासू शकता.",
              },
              {
                Icon: Users,
                kicker: language === "en" ? "Local roots" : "स्थानिक नाळ",
                title: language === "en" ? "Community" : "समुदाय",
                body: language === "en"
                  ? "Based in Kalmeshwar, we build neighbourhoods for our own neighbours and stay available long after the registry is done."
                  : "कळमेश्वरमध्येच असल्याने आम्ही आपल्याच शेजाऱ्यांसाठी वसाहती उभारतो आणि नोंदणीनंतरही सदैव उपलब्ध असतो.",
              },
            ].map(({ Icon, kicker, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-blue-950 px-7 pb-9 pt-8 transition-colors duration-500 hover:bg-blue-900/60"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-blue-300 transition-transform duration-500 group-hover:scale-x-100" />
                <Icon className="h-8 w-8 text-blue-300" strokeWidth={1.25} />
                <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">{kicker}</p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>{language === "en" ? "Get in Touch" : "संपर्क साधा"}</SectionLabel>
            <h2 className="mt-6 text-4xl font-medium leading-[1.08] tracking-tight text-slate-900 md:text-5xl">
              {language === "en" ? "Ready to build" : "तुमचे स्वप्नातील घर"}
              <br />
              <span className="text-blue-700">{language === "en" ? "your dream home?" : "उभारायला तयार आहात?"}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              {language === "en"
                ? "Visit our layouts, see every document, and find the right plot for your family. Pick-up and drop is on us."
                : "आमचे लेआउट पहा, प्रत्येक कागदपत्र तपासा आणि तुमच्या कुटुंबासाठी योग्य प्लॉट निवडा. पिक-अप आणि ड्रॉप आमच्याकडून."}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-800"
              >
                {language === "en" ? "Book a site visit" : "साइट भेट बुक करा"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-medium text-slate-800 transition-colors hover:border-slate-900"
              >
                {language === "en" ? "View projects" : "प्रकल्प पहा"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default AboutUs;
