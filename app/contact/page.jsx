"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/Contactform";
import { Building, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function ContactSection() {
  const { language } = useLanguage(); // Use the language context

  const contactItems = [
    {
      icon: (
        <Building className="h-6 w-6 text-blue-700 transition-transform duration-500 group-hover:rotate-12" />
      ),
      title: language === "en" ? "Visit Us" : "आमच्याकडे या",
      content:
        language === "en"
          ? "Dange Associates office, beside ICICI Bank, Kalmeshwar - 441501"
          : "डांगे असोसिएट्स कार्यालय, आयसीआयसीआय बँकेजवळ, कळमेश्वर - ४४१५०१",
      href: "https://www.google.com/maps?q=Dange+Associates,+Kalmeshwar",
    },
    {
      icon: (
        <Phone className="h-6 w-6 text-green-600 transition-transform duration-500 group-hover:rotate-12" />
      ),
      title: language === "en" ? "Call Us" : "आम्हाला कॉल करा",
      content: "+91 7774882844",
      href: "tel:+917774882844",
    },
    {
      icon: (
        <Mail className="h-6 w-6 text-red-600 transition-transform duration-500 group-hover:rotate-12" />
      ),
      title: language === "en" ? "Email Us" : "आम्हाला ईमेल करा",
      content: "vedantdange18@gmail.com",
      href: "mailto:vedantdange18@gmail.com",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-gradient-to-b from-sky-50 via-white to-orange-50 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 mt-20">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-3xl font-semibold text-blue-900">
              {language === "en" ? "Reach Us" : "आमच्याशी संपर्क साधा"}
            </h3>
            <p className="text-gray-700 mb-4">
              {language === "en"
                ? "We're just a message or call away. Reach out and let's connect!"
                : "आम्ही फक्त एक संदेश किंवा कॉल दूर आहोत. संपर्क साधा आणि कनेक्ट होऊया!"}
            </p>
            <div className="space-y-4">
              {contactItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-195 transition-all duration-300 border border-gray-200"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 group-hover:underline">
                      {item.title}
                    </h4>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
