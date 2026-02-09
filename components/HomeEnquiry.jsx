"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const HomeEnquiry = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    project: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        const { error } = await supabase.from("contact_form").insert([formData]);
        if (error) throw error;
        setStatus("success");
        setFormData({ name: "", phone: "", project: "" });
    } catch (error) {
        console.error("Error:", error);
        setStatus("error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-24 bg-blue-50 relative overflow-hidden border-t border-blue-100">
      {/* Background Decor - Pragmatic Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <span className="text-blue-700 font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 italic">
               {language === "en" ? "Direct Communication" : "थेट संवाद"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 leading-tight tracking-tight">
              {language === "en" ? "Have Questions? Get Authentic Advice." : "प्रश्न आहेत? अस्सल सल्ला मिळवा."}
            </h2>
            <p className="text-slate-600 text-lg md:text-xl mt-8 leading-relaxed font-medium">
              {language === "en" 
                ? "Speak directly with our technical team. No sales pitch—just clear information about project sanctions, legal papers, and plot availability."
                : "आमच्या तांत्रिक टीमशी थेट बोला. कोणतीही विक्री पिच नाही—फक्त प्रोजेक्ट मंजुरी, कायदेशीर कागदपत्रे आणि प्लॉटच्या उपलब्धतेबद्दल स्पष्ट माहिती."}
            </p>
            
            <div className="mt-12 space-y-6">
              <a 
                href="https://wa.me/917774882844" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl shadow-emerald-900/10 group text-lg"
              >
                <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                {language === "en" ? "Connect on WhatsApp" : "व्हॉट्सॲपवर संपर्क साधा"}
              </a>
              
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-white shadow-md bg-blue-${i * 100 + 400}`}></div>
                  ))}
                </div>
                <p className="text-slate-700 font-bold text-sm">
                  {language === "en" ? "Over 1200+ families helped" : "१२००+ कुटुंबांना मदत केली"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative group overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150 duration-700"></div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                {language === "en" ? "Schedule a Call Back" : "कॉल बॅक विनंती"}
              </h3>
              
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                      {language === "en" ? "Full Name" : "पूर्ण नाव"}
                    </label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                      placeholder="e.g. Rahul Patil"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                      {language === "en" ? "Mobile Number" : "मोबाईल नंबर"}
                    </label>
                    <input 
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900"
                      placeholder="+91" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                      {language === "en" ? "Preferred Location" : "पसंतीचे ठिकाण"}
                    </label>
                    <select 
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                    >
                      <option value="">{language === "en" ? "Select Location" : "ठिकाण निवडा"}</option>
                      <option value="Kalmeshwar">Kalmeshwar</option>
                      <option value="Wardha Road">Wardha Road</option>
                      <option value="Hingna">Hingna</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-10 bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-700/10 group text-lg"
                >
                  {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                      <>
                          {language === "en" ? "Request Instant Callback" : "त्वरित कॉल बॅक विनंती"}
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                  )}
                </button>

                {status === "success" && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-bold text-center animate-in fade-in duration-500">
                      {language === "en" ? "✓ Success! Our team will contact you in 30 minutes." : "✓ यश! आमची टीम ३० मिनिटांत तुमच्याशी संपर्क साधेल."}
                  </div>
                )}
                {status === "error" && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-bold text-center animate-in shake duration-500">
                      {language === "en" ? "× Error. Please check your network and try again." : "× त्रुटी. कृपया तुमचे नेटवर्क तपासा आणि पुन्हा प्रयत्न करा."}
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeEnquiry;
