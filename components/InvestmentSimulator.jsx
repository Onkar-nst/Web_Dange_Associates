"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calculator, TrendingUp, IndianRupee } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";

const InvestmentSimulator = () => {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(5);

  const data = useMemo(() => {
    const chartData = [];
    let currentAmount = amount;
    const rate = 0.15; // 15% CAGR assumption for land

    for (let i = 0; i <= years; i++) {
      chartData.push({
        year: `Year ${i}`,
        value: Math.round(currentAmount),
      });
      currentAmount = currentAmount * (1 + rate);
    }
    return chartData;
  }, [amount, years]);

  const finalAmount = data[data.length - 1].value;
  const growth = finalAmount - amount;
  const growthPercentage = Math.round((growth / amount) * 100);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-orange-50">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-300 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-300 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-4"
          >
            <Calculator className="w-4 h-4" />
            Smart Investment Tool
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-orange-500 mb-6"
          >
            Calculate Your Future Wealth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            See how your investment in land grows over time with our projected Returns Calculator based on historical market trends.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
          >
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-700 font-semibold flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Investment Amount
                  </label>
                  <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">
                    ₹{(amount / 100000).toFixed(1)} Lakh
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[amount]}
                  max={5000000}
                  min={100000}
                  step={50000}
                  onValueChange={(value) => setAmount(value[0])}
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-[6px] overflow-hidden">
                    <Slider.Range className="absolute bg-gradient-to-r from-orange-400 to-orange-600 h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-6 h-6 bg-white border-2 border-orange-500 shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all cursor-grab active:cursor-grabbing"
                    aria-label="Investment Amount"
                  />
                </Slider.Root>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-700 font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Investment Period
                  </label>
                  <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">
                    {years} Years
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[years]}
                  max={20}
                  min={1}
                  step={1}
                  onValueChange={(value) => setYears(value[0])}
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-[6px] overflow-hidden">
                    <Slider.Range className="absolute bg-gradient-to-r from-blue-400 to-blue-600 h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-6 h-6 bg-white border-2 border-blue-500 shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all cursor-grab active:cursor-grabbing"
                    aria-label="Years"
                  />
                </Slider.Root>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>1 Yr</span>
                  <span>20 Yrs</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Projected Value</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">
                    +{growthPercentage}% Growth
                  </span>
                </div>
                <div className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                  ₹{(finalAmount / 100000).toFixed(2)} Lakh
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  *Based on estimated 15% annual market appreciation.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-white/50 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg border border-white/40 h-[400px] md:h-[500px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value) => [`₹${(value / 100000).toFixed(2)} Lakh`, 'Value']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F97316"
                  strokeWidth={4}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSimulator;
