"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { MapPin, Phone, MessageSquare, ArrowRight, Check } from "lucide-react";

const SiteVisitEnquiry = () => {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { id: "SRN1", name: language === "en" ? "Shree Ram Nagri-1" : "श्री राम नगरी-१" },
    { id: "RTM", name: language === "en" ? "Ready to Move Homes" : "तयार घरे" },
    { id: "DL1", name: language === "en" ? "Dange Layout 1" : "डांगे लेआउट १" },
    { id: "DL2", name: language === "en" ? "Dange Layout 2" : "डांगे लेआउट २" },
    { id: "DL3", name: language === "en" ? "Dange Layout 3" : "डांगे लेआउट ३" },
    { id: "DL4", name: language === "en" ? "Dange Layout 4" : "डांगे लेआउट ४" },
    { id: "OSRN1", name: language === "en" ? "Om Sai Ram Nagar 1" : "ओम साई राम नगर १" },
    { id: "OSRN2", name: language === "en" ? "Om Sai Ram Nagar 2" : "ओम साई राम नगर २" },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_2px,transparent_2px)] [background-size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full px-4 md:px-12">
        <div className="w-full flex flex-col md:flex-row items-center gap-12 bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
          
          <div className="flex-1 space-y-8">
            <div>
              <span className="text-blue-700 font-extrabold tracking-widest uppercase text-xs bg-blue-50 px-4 py-2 rounded-full border border-blue-100 italic">
                {language === "en" ? "Experience the Reality" : "प्रत्यक्ष अनुभव"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 leading-tight tracking-tight">
                {language === "en" ? "Plan your site visit now" : "तुमच्या साईट व्हिजिटचे नियोजन करा"}
              </h2>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
              {language === "en"
                ? "Call or visit our executive to book your site visit. Explore our developed layouts and pick the perfect spot for your family."
                : "तुमची साईट व्हिजिट बुक करण्यासाठी आमच्या एक्झिक्युटिव्हला कॉल करा किंवा भेट द्या. आमचे विकसित लेआउट एक्सप्लोर करा आणि तुमच्या कुटुंबासाठी योग्य जागा निवडा."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:+917774882844"
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-2xl font-black transition-all shadow-xl shadow-blue-600/10 group text-lg"
              >
                <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                {language === "en" ? "Call Executive" : "एक्झिक्युटिव्हला कॉल करा"}
              </a>
              <a
                href="https://wa.me/917774882844"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/10 group text-lg"
              >
                <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {language === "en" ? "WhatsApp Us" : "व्हॉट्सॲप करा"}
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapPin className="text-blue-600 w-6 h-6" />
                {language === "en" ? "Select a Project" : "प्रकल्प निवडा"}
              </h3>
              
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all font-bold flex justify-between items-center group/item ${
                      selectedProject === project.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:shadow-md hover:text-blue-700"
                    }`}
                  >
                    {project.name}
                    {selectedProject === project.id ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default SiteVisitEnquiry;
