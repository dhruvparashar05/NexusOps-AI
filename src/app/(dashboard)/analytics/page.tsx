"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const areaData = [
  { name: "May 1", participants: 400 },
  { name: "May 4", participants: 480 },
  { name: "May 7", participants: 520 },
  { name: "May 10", participants: 680 },
  { name: "May 13", participants: 750 },
  { name: "May 16", participants: 920 },
  { name: "May 19", participants: 1100 },
  { name: "May 20", participants: 1248 },
  { name: "May 22", participants: 1280 },
  { name: "May 25", participants: 1350 },
  { name: "May 28", participants: 1450 },
  { name: "May 31", participants: 1600 }
];

export default function AnalyticsPage() {
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics Console</h1>
        <p className="text-zinc-500 text-sm mt-1">Player registrations, engagement coefficients, and toxic indices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Players Peak", val: "4,200", change: "+14.2%" },
          { label: "Average Session", val: "48m 10s", change: "+2.4%" },
          { label: "Dispute Auto-Resolves", val: "94%", change: "99.8% accurate" }
        ].map((ana, idx) => (
          <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-xl p-5 flex flex-col gap-1">
            <span className="text-xs text-zinc-500">{ana.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold">{ana.val}</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{ana.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0b0b0c] border border-zinc-900 rounded-xl p-6 h-96 flex flex-col gap-4">
        <span className="text-sm font-semibold">Live Traffic Trend</span>
        <div className="flex-1 w-full">
          {isClientMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="purpleTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0b0b0c", borderColor: "#27272a" }} />
                <Area type="monotone" dataKey="participants" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#purpleTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-500">Loading metrics...</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
