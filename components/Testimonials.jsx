"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { Quote, Star } from "lucide-react";
import Reveal from "./motion/Reveal";
import Spotlight from "./fx/Spotlight";
import SectionLabel from "./ui/SectionLabel";

const MAPS_URL = "https://maps.app.goo.gl/rY8LgCF5mFvbzYpRA";

const Testimonials = () => {
  const { language } = useLanguage();
  const [data, setData] = useState(null);

  // Live reviews from Google (see app/api/google-reviews/route.js).
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/google-reviews?lang=${language}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setData(null));
    return () => {
      cancelled = true;
    };
  }, [language]);

  const reviews = data?.reviews ?? [];
  const rating = data?.rating;

  // Duplicate for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-12 bg-white overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <Reveal className="max-w-2xl">
            <SectionLabel>{language === "en" ? "Our Reputation" : "आमची प्रतिष्ठा"}</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 mt-4 tracking-tight">
               {language === "en" ? "Real Stories from Plot Owners" : "प्लॉट मालकांच्या खऱ्या कथा"}
            </h2>
          </Reveal>
          
          <a 
            href={data?.mapsUrl ?? MAPS_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282015-2020%29.svg" alt="Google Maps" className="w-6 h-6" />
            <div className="text-left">
              {rating != null && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-semibold text-slate-900">{rating.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? "text-blue-700 fill-current" : "text-slate-300"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">({data.total})</span>
                </div>
              )}
              <p className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
                {language === "en" ? "Review us on Google" : "गुगलवर आमचे पुनरावलोकन करा"}
              </p>
            </div>
          </a>
        </div>
      </div>

      {reviews.length > 0 && (
      <div className="relative">
        {/* Gradients to fade out edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 hidden md:block"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 hidden md:block"></div>

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-8 py-4">
          {duplicatedReviews.map((review, index) => (
            <Spotlight
              key={index} 
              color="rgba(31,63,115,0.08)"
              className="w-[350px] md:w-[450px] shrink-0 bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(31,63,115,0.14)] transition-all duration-500 group flex flex-col justify-between hover:[transform:perspective(900px)_rotateX(4deg)_rotateY(-5deg)_translateY(-6px)]"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(Math.round(review.rating))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-blue-700 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-500 group-hover:text-blue-700 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500" />
                </div>
                
                <p className="text-slate-700 leading-relaxed text-lg italic mb-8">
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                {review.photo ? (
                  <img src={review.photo} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xl">
                    {review.author.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {review.authorUrl ? (
                      <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{review.author}</a>
                    ) : review.author}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    {review.when}{review.when && " · "}{language === "en" ? "Google review" : "गुगल पुनरावलोकन"}
                  </p>
                </div>
              </div>
            </Spotlight>
          ))}
          {/* Spacer to make the 50% split perfectly seamless with the gap */}
          <div className="w-8 shrink-0"></div>
        </div>
      </div>
      )}

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
