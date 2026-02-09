"use client";

import { useLanguage } from "./LanguageContext";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const { language } = useLanguage();

  const reviews = [
    {
      name: "Rajesh Kulkarni",
      role: language === "en" ? "Teacher" : "शिक्षक",
      content: language === "en" 
        ? "I was worried about legal papers, but Vedant Sir explained the 7/12 process clearly. Got my registry done in 10 days." 
        : "मला कायदेशीर कागदपत्रांची काळजी वाटत होती, पण वेदांत सरांनी ७/१२ प्रक्रिया स्पष्टपणे समजावून सांगितली. १० दिवसांत माझी नोंदणी झाली.",
      rating: 5,
    },
    {
      name: "Amit Deshmukh",
      role: language === "en" ? "Businessman" : "व्यापारी",
      content: language === "en" 
        ? "Invested in Phase 1 in 2018. The rates have doubled, and the development is exactly as promised." 
        : "२०१८ मध्ये फेज १ मध्ये गुंतवणूक केली. दर दुप्पट झाले आहेत आणि विकास वचनाप्रमाणेच आहे.",
      rating: 5,
    },
    {
      name: "Sunita Patil",
      role: language === "en" ? "Homemaker" : "गृहिणी",
      content: language === "en" 
        ? "The team is very transparent. They showed me the NATP sanction letter before I even booked the plot." 
        : "टीम खूप पारदर्शक आहे. मी प्लॉट बुक करण्यापूर्वीच त्यांनी मला NATP मंजूरी पत्र दाखवले.",
      rating: 5,
    },
    {
      name: "Sanjay Gadkari",
      role: language === "en" ? "Govt Employee" : "शासकीय कर्मचारी",
      content: language === "en" 
        ? "Clear title plots are hard to find in Nagpur. Dange Associates is one of the few you can trust blindly." 
        : "नागपुरात स्पष्ट शीर्षक असलेले प्लॉट मिळणे कठीण आहे. डांगे असोसिएट्स अशा मोजक्या लोकांपैकी एक आहेत ज्यांच्यावर तुम्ही आंधळेपणाने विश्वास ठेवू शकता.",
      rating: 5,
    },
    {
      name: "Dr. Priya Sharma",
      role: language === "en" ? "Doctor" : "डॉक्टर",
      content: language === "en" 
        ? "Great location and community. The amenities like water and electricity are already in place." 
        : "उत्तम लोकेशन आणि कम्युनिटी. पाणी आणि वीज यांसारख्या सुविधा आधीच उपलब्ध आहेत.",
      rating: 5,
    },
    {
      name: "Rahul Mehra",
      role: language === "en" ? "IT Professional" : "आयटी प्रोफेशनल",
      content: language === "en" 
        ? "Professionalism at its best. They handle all the paperwork and coordination, making it stress-free." 
        : "व्यावसायिकतेचा उत्तम नमुना. ते सर्व कागदपत्रे आणि समन्वय हाताळतात, ज्यामुळे खरेदीदाराला कोणताही ताण येत नाही.",
      rating: 5,
    },
  ];

  // Duplicate for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="text-amber-700 font-extrabold tracking-widest uppercase text-xs bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100 italic">
               {language === "en" ? "Our Reputation" : "आमची प्रतिष्ठा"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 tracking-tight">
               {language === "en" ? "Real Stories from Plot Owners" : "प्लॉट मालकांच्या खऱ्या कथा"}
            </h2>
          </div>
          
          <a 
            href="https://maps.app.goo.gl/rY8LgCF5mFvbzYpRA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282015-2020%29.svg" alt="Google Maps" className="w-6 h-6" />
            <div className="text-left">
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                {language === "en" ? "Review us on Google" : "गुगलवर आमचे पुनरावलोकन करा"}
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="relative">
        {/* Gradients to fade out edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 hidden md:block"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 hidden md:block"></div>

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-8 py-4">
          {duplicatedReviews.map((review, index) => (
            <div 
              key={index} 
              className="w-[350px] md:w-[450px] shrink-0 bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_50px_rgba(59,130,246,0.1)] transition-all duration-500 group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-amber-50 group-hover:text-amber-100 transition-colors" />
                </div>
                
                <p className="text-slate-700 leading-relaxed font-medium text-lg italic mb-8">
                  "{review.content}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-black text-xl">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{review.name}</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Spacer to make the 50% split perfectly seamless with the gap */}
          <div className="w-8 shrink-0"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
