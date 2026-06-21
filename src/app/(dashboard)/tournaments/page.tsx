"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, ChevronRight, Trash2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function TournamentsPage() {
  const {
    events,
    handleDeleteEvent,
    searchQuery,
    setSelectedEventForTeams,
    setIsTeamsModalOpen,
    setIsCreateModalOpen,
    setNewEventFormat
  } = useDashboard();

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
      key="tournaments"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Tournaments</h1>
          <p className="text-zinc-500 text-sm mt-1">Brackets and tournament registration pipelines.</p>
        </div>
        <button
          onClick={() => {
            setNewEventFormat("Single Elimination");
            setIsCreateModalOpen(true);
          }}
          className="px-3 py-1.5 bg-[#7C3AED] text-xs font-semibold rounded-lg hover:bg-[#6D28D9] flex items-center gap-1 transition-colors border-0 cursor-pointer text-white"
        >
          <Plus className="w-3.5 h-3.5" /> Initialize Cup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events
          .filter((evt) =>
            evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evt.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evt.logo.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((evt) => (
            <div key={evt.id} className="bg-[#0b0b0c] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GameLogo type={evt.logo} />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{evt.title}</span>
                    <span className="text-xs text-zinc-500">{evt.format} • {evt.teams}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {evt.status === "Live" ? (
                    <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Live
                    </span>
                  ) : (
                    <span className="bg-zinc-800 text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      Pending
                    </span>
                  )}
                  
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-1.5 rounded-lg bg-zinc-900/50 hover:bg-red-500/10 border border-zinc-900 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-all active:scale-90 cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Brackets simulation info */}
              <div className="bg-[#050505] p-3 rounded-lg border border-zinc-900 text-xs flex justify-between items-center text-zinc-400">
                <span>Lobby: <strong className="text-zinc-200">#Match-Pool-{evt.id.substring(0, 3)}</strong></span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-zinc-500">{evt.date} • {evt.time}</span>
                <button
                  onClick={() => {
                    setSelectedEventForTeams(evt);
                    setIsTeamsModalOpen(true);
                  }}
                  className="text-xs text-[#7C3AED] hover:underline font-semibold flex items-center gap-0.5 bg-transparent border-0 cursor-pointer"
                >
                  View Teams <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
