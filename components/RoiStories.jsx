"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ArrowUpRight, BadgeCheck } from "lucide-react";

const stories = [
  {
    id: 1,
    name: "Rajesh Kulkarni",
    location: "Chakan Phase 2",
    purchaseYear: 2018,
    purchasePrice: "₹5 Lakh",
    currentYear: 2024,
    currentValue: "₹18 Lakh",
    growth: "260%",
    quote: "I bought this for my daughter's future. The appreciation has been beyond my expectations.",
    image: "/avatars/user1.jpg" // Placeholder, will rely on letters or generic avatar if missing
  },
  {
    id: 2,
    name: "Amit Deshmukh",
    location: "Hinjewadi Annexe",
    purchaseYear: 2020,
    purchasePrice: "₹8 Lakh",
    currentYear: 2024,
    currentValue: "₹22 Lakh",
    growth: "175%",
    quote: "Dange Developers suggested this plot when no one was looking there. Best financial decision.",
    image: "/avatars/user2.jpg"
  },
  {
    id: 3,
    name: "Sunita Patil",
    location: "Talegaon MIDC",
    purchaseYear: 2015,
    purchasePrice: "₹2.5 Lakh",
    currentYear: 2024,
    currentValue: "₹15 Lakh",
    growth: "500%",
    quote: "From a small investment to a major asset. The clear title process made it stress-free.",
    image: "/avatars/user3.jpg"
  },
  {
    id: 4,
    name: "Vikas More",
    location: "Moshi Area",
    purchaseYear: 2019,
    purchasePrice: "₹12 Lakh",
    currentYear: 2024,
    currentValue: "₹28 Lakh",
    growth: "133%",
    quote: "Liquidity and safety were my concerns. They delivered on both promises.",
    image: "/avatars/user4.jpg"
  }
];

const RoiStories = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (emblaApi) {
      // Auto-play functionality
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);
      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <BadgeCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real People. <span className="text-blue-600">Real Returns.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See how our early investors have multiplied their wealth.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto" ref={emblaRef}>
          <div className="flex touch-pan-y gap-8 py-8 pl-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 relative"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <Quote className="w-10 h-10 text-orange-200 fill-orange-100" />
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                        {story.growth}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">
                      "{story.quote}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-2xl">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Bought {story.purchaseYear}</p>
                        <p className="text-lg font-bold text-gray-900">{story.purchasePrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Value {story.currentYear}</p>
                        <p className="text-lg font-bold text-blue-600">{story.currentValue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{story.name}</h4>
                      <p className="text-sm text-gray-500">{story.location}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiStories;
