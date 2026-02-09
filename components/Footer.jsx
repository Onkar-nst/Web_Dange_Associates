"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  const currentYear = new Date().getFullYear();
  


  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 border-t border-slate-900 overflow-hidden relative">
      {/* Subtle Background Detail */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute top-0 left-0 w-1/4 h-1/3 bg-orange-600/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/4"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20 items-start">
          
          {/* Brand Column */}
          <div className="space-y-10">
            <Link href="/" className="inline-block group">
              <h3 className="text-4xl font-black text-white tracking-tighter italic">
                Dange<span className="text-orange-500 group-hover:text-blue-500 transition-colors">Associates</span>
              </h3>
              <div className="h-1 w-12 bg-orange-500 mt-2 rounded-full transition-all group-hover:w-24 group-hover:bg-blue-500"></div>
            </Link>
            
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
              Nagpur's Trusted Partner <br/> in Land Development
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-10">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-blue-600"></span>
              {language === "en" ? "Direct Contact" : "थेट संपर्क"}
            </h4>
            
            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-600/20 flex items-center justify-center text-orange-500 mr-5 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{language === "en" ? "Call Us" : "कॉल करा"}</p>
                  <div className="flex flex-col space-y-2">
                    <a href="tel:+919112379641" className="text-white font-black text-lg hover:text-orange-500 transition-colors leading-none">
                      +91 9112379641
                    </a>
                    <a href="tel:+917774882844" className="text-white font-black text-lg hover:text-orange-500 transition-colors leading-none">
                      +91 7774882844
                    </a>
                  </div>
                </div>
              </div>

              <a href="mailto:vedantdange18@gmail.com" className="flex items-center group">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 mr-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{language === "en" ? "Email Us" : "ईमेल करा"}</p>
                  <span className="text-white font-black text-sm group-hover:text-blue-500 transition-colors">info@dangedevelopers.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* Location & Hours Column */}
          <div className="space-y-10">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-emerald-600"></span>
              {language === "en" ? "Find Us" : "आम्हाला शोधा"}
            </h4>

            <div className="space-y-8">
              <a 
                href="https://maps.app.goo.gl/rY8LgCF5mFvbzYpRA" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-500 mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{language === "en" ? "Office Location" : "कार्यालयाचे ठिकाण"}</p>
                  <span className="text-slate-300 text-sm font-bold leading-relaxed group-hover:text-emerald-500 transition-colors">
                    Block No. 7, Khadi Gram Sankul, <br/> beside ICICI Bank, Kalmeshwar, <br/> Maharashtra 441501
                  </span>
                </div>
              </a>

              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mr-5 group-hover:bg-amber-500 group-hover:text-amber-950 transition-all duration-500 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    {language === "en" ? "Working Hours" : "कामाची वेळ"}
                  </p>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-base uppercase tracking-tight leading-tight">Mon - Sat</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">09:00 AM - 06:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-10 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
          <p className="mb-6 md:mb-0">
            © {currentYear} Dange Associates Nagpur. All rights reserved.
          </p>
          <div className="flex space-x-10">
            <Link href="/privacy-policy" className="hover:text-blue-500 transition-colors">Legal</Link>
            <Link href="/terms" className="hover:text-blue-500 transition-colors">Term of Use</Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
