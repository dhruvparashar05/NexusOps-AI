"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDashboard } from "@/context/DashboardContext";

export default function ParticipantsPage() {
  const { events, getEventStats } = useDashboard();

  const GameLogo = ({ type }: { type: string }) => {
    if (type === "valorant") {
      return (
        <div className="w-12 h-12 bg-red-950/40 rounded-lg flex items-center justify-center border border-red-500/20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-6 h-6 text-red-500 fill-current">
            <path d="M10 15 L45 15 L75 75 L40 75 Z" />
            <path d="M60 15 L85 15 L90 28 L65 28 Z" />
          </svg>
        </div>
      );
    }
    if (type === "bgmi") {
      return (
        <div className="w-12 h-12 bg-amber-950/30 rounded-lg flex items-center justify-center border border-amber-500/20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-6 h-6 text-amber-500 fill-current">
            <path d="M50 10 C30 10 15 25 15 45 C15 52 17 58 20 63 L30 85 L70 85 L80 63 C83 58 85 52 85 45 C85 25 70 10 50 10 Z M50 25 C58 25 65 32 65 40 C65 48 58 55 50 55 C42 55 35 48 35 40 C35 32 42 25 50 25 Z" />
          </svg>
        </div>
      );
    }
    if (type === "clash") {
      return (
        <div className="w-12 h-12 bg-indigo-950/40 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-6 h-6 text-indigo-400 fill-current">
            <path d="M50 10 L15 25 L15 55 C15 75 50 90 50 90 C50 90 85 75 85 55 L85 25 Z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-orange-950/40 rounded-lg flex items-center justify-center border border-orange-500/20 shrink-0">
        <svg viewBox="0 0 100 100" className="w-6 h-6 text-orange-500 fill-current">
          <path d="M75 10 L30 50 L55 50 L25 90 L70 50 L45 50 Z" />
        </svg>
      </div>
    );
  };

  return (
    <motion.div
      key="participants"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Participants Overview</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Detailed statistics of participants registered across events, including YouTube subscriptions and Discord server membership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => {
          const { total, ytSubscribed, discordJoined } = getEventStats(evt);
          return (
            <div key={evt.id} className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden group hover:border-[#7C3AED]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                <div className="flex items-center gap-3">
                  <GameLogo type={evt.logo} />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-zinc-100 group-hover:text-[#7C3AED] transition-colors">{evt.title}</span>
                    <span className="text-xs text-zinc-500">{evt.format} • {evt.teams}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${evt.status === "Live" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"}`}>
                  {evt.status === "Live" ? "Active Live" : "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#050505] border border-zinc-900 rounded-xl p-3.5 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">Total Players</span>
                  <span className="text-xl font-bold tracking-tight text-zinc-200 mt-1">{total.toLocaleString()}</span>
                  <span className="text-[9px] text-zinc-600 mt-0.5">Registered</span>
                </div>

                <div className="bg-[#050505] border border-zinc-900 rounded-xl p-3.5 flex flex-col gap-1 relative overflow-hidden">
                  <span className="text-[10px] text-red-400 font-semibold uppercase flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-500 text-red-500 shrink-0">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YT Subs
                  </span>
                  <span className="text-xl font-bold tracking-tight text-zinc-200 mt-1">{ytSubscribed.toLocaleString()}</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5 font-medium">({Math.round((ytSubscribed / total) * 100)}%) Verified</span>
                </div>

                <div className="bg-[#050505] border border-zinc-900 rounded-xl p-3.5 flex flex-col gap-1 relative overflow-hidden">
                  <span className="text-[10px] text-blue-400 font-semibold uppercase flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#5865F2] text-[#5865F2] shrink-0">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                    </svg>
                    Discord
                  </span>
                  <span className="text-xl font-bold tracking-tight text-zinc-200 mt-1">{discordJoined.toLocaleString()}</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5 font-medium">({Math.round((discordJoined / total) * 100)}%) Joined</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Integration Verification Progress</span>
                  <span className="font-bold text-zinc-300">
                    {Math.round(((ytSubscribed + discordJoined) / (total * 2)) * 100)}% Verified
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#050505] border border-zinc-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-red-500" style={{ width: `${(ytSubscribed / (total * 2)) * 100}%` }} />
                  <div className="h-full bg-[#5865F2]" style={{ width: `${(discordJoined / (total * 2)) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
