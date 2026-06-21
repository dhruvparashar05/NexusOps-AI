"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";

export default function CommunitiesPage() {
  const { addToast } = useDashboard();

  return (
    <motion.div
      key="communities"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrated Communities</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage active gaming server integrations and referee setups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Alpha Gaming Syndicate", players: 4200, status: "Connected", code: "discord", color: "from-indigo-600/20" },
          { name: "BGMI Arena Elite", players: 2800, status: "Connected", code: "telegram", color: "from-cyan-600/20" },
          { name: "Apex Legends Campus Guild", players: 1950, status: "Offline", code: "discord", color: "from-red-600/20" }
        ].map((comm, idx) => (
          <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-sm">{comm.name}</span>
                <span className="text-xs text-zinc-500 mt-1">{comm.players.toLocaleString()} Members</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${comm.status === "Connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500"}`}>
                {comm.status}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
              <span className="text-xs text-zinc-400 capitalize">{comm.code} Sync enabled</span>
              <button
                onClick={() => addToast(`🔄 Resyncing: ${comm.name}`)}
                className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
