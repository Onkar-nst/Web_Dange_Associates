"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "./LanguageContext";
import Magnetic from "./fx/Magnetic";

function Field({ id, label, textarea, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="group relative">
      <Tag
        id={id}
        placeholder=" "
        className={`peer w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-5 pb-3 pt-6 text-slate-900 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.35)] ${textarea ? "min-h-[140px] resize-none" : ""}`}
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-5 top-4 origin-left text-sm text-slate-400 transition-all duration-300 peer-focus:top-2 peer-focus:scale-[0.8] peer-focus:text-blue-700 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-[0.8]"
      >
        {label}
      </label>
    </div>
  );
}

export default function ContactForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [state, setState] = useState("idle"); // idle | sending | success | error | invalid

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setState("invalid");
      return;
    }
    setState("sending");
    const { error } = await supabase.from("contact_form").insert([formData]);
    if (error) {
      console.error("Supabase Error:", error.message);
      setState("error");
    } else {
      setState("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  const messages = {
    success: language === "en" ? "Submitted successfully! We'll get back to you soon." : "यशस्वीरित्या सबमिट केले! आम्ही लवकरच संपर्क साधू.",
    error: language === "en" ? "Failed to submit. Please try again." : "सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    invalid: language === "en" ? "Name and Email are required." : "नाव आणि ईमेल आवश्यक आहेत.",
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-16 -top-16 h-48 w-48 rounded-[2.5rem] bg-gradient-to-br from-orange-200/40 to-blue-200/30 blur-xl"
      />
      <h2 className="relative text-2xl font-medium text-slate-900 md:text-3xl">{language === "en" ? "Enquire Us" : "आमच्याशी चौकशी करा"}</h2>
      <p className="relative mb-8 mt-2 text-slate-600">
        {language === "en"
          ? "Ready to start a conversation? Drop your details below and we'll get back to you with the solutions you need."
          : "संवाद सुरू करण्यास तयार आहात? खाली आपले तपशील द्या आणि आम्ही तुम्हाला आवश्यक असलेल्या उपायांसह परत येऊ."}
      </p>

      <form onSubmit={handleSubmit} className="relative grid gap-4 md:grid-cols-2">
        <Field id="cf-name" name="name" label={language === "en" ? "Name" : "नाव"} value={formData.name} onChange={handleChange} required />
        <Field id="cf-phone" name="phone" type="tel" label={language === "en" ? "Phone number" : "फोन नंबर"} value={formData.phone} onChange={handleChange} />
        <div className="md:col-span-2">
          <Field id="cf-email" name="email" type="email" label={language === "en" ? "Your email" : "तुमचा ईमेल"} value={formData.email} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2">
          <Field id="cf-message" name="message" textarea label={language === "en" ? "How can we help?" : "आम्ही कशी मदत करू शकतो?"} value={formData.message} onChange={handleChange} />
        </div>
        <div className="flex flex-col items-start gap-4 md:col-span-2 md:flex-row md:items-center">
          <Magnetic>
            <button
              type="submit"
              disabled={state === "sending"}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-blue-700 px-8 py-4 font-medium text-white shadow-xl shadow-blue-700/20 transition-all hover:bg-blue-800 disabled:opacity-70"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
              {state === "sending" ? <Loader2 className="relative h-5 w-5 animate-spin" /> : <Send className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />}
              <span className="relative">{language === "en" ? "Submit" : "सबमिट करा"}</span>
            </button>
          </Magnetic>
          <AnimatePresence mode="wait">
            {messages[state] && (
              <motion.p
                key={state}
                role="status"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`flex items-center gap-2 text-sm ${state === "success" ? "text-emerald-700" : "text-red-600"}`}
              >
                {state === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {messages[state]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
