"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "./LanguageContext";

export default function ContactForm() {
  const { language } = useLanguage(); // Use the language context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(language === "en" ? "Submitting..." : "सबमिट करत आहे...");

    if (!formData.name || !formData.email) {
      setStatus(
        language === "en"
          ? "Name and Email are required."
          : "नाव आणि ईमेल आवश्यक आहेत."
      );
      return;
    }

    const { error } = await supabase.from("contact_form").insert([formData]);

    if (error) {
      console.error("Supabase Error:", error.message);
      setStatus(
        language === "en"
          ? "Failed to submit. Please try again."
          : "सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा."
      );
    } else {
      setStatus(
        language === "en"
          ? "Submitted successfully!"
          : "यशस्वीरित्या सबमिट केले!"
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-blue-100 opacity-30"></div>
      <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-orange-100 opacity-30"></div>

      <h2 className="text-2xl font-bold text-blue-900 mb-2">
        {language === "en" ? "Enquire Us" : "आमच्याशी चौकशी करा"}
      </h2>
      <p className="text-gray-700 mb-6">
        {language === "en"
          ? "Ready to start a conversation? Drop your details below and we'll get back to you with the solutions you need."
          : "संवाद सुरू करण्यास तयार आहात? खाली आपले तपशील द्या आणि आम्ही तुम्हाला आवश्यक असलेल्या उपायांसह परत येऊ."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <Input
          name="name"
          placeholder={language === "en" ? "Name" : "नाव"}
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />

        <Input
          name="email"
          type="email"
          placeholder={language === "en" ? "Your email" : "तुमचा ईमेल"}
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg p-3"
        />

        <Input
          name="phone"
          type="tel"
          placeholder={language === "en" ? "Phone number" : "फोन नंबर"}
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3"
        />

        <Textarea
          name="message"
          placeholder={
            language === "en" ? "How can we help?" : "आम्ही कशी मदत करू शकतो?"
          }
          value={formData.message}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px]"
        />

        <Button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
        >
          {language === "en" ? "Submit" : "सबमिट करा"}
        </Button>

        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
      </form>
    </div>
  );
}
