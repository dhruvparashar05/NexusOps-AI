"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Calendar, Trophy, Volume2, TrendingUp, CalendarDays, ChevronDown,
  Sparkles, Bot, ChevronRight, Activity, FileText, Upload, X, Play,
  MoreHorizontal, AlertTriangle, Search, ArrowRight, Clock, HelpCircle, Shield, Award,
  UserCheck, Gamepad2, Trash2, Check, RefreshCw, Send, CheckCircle2, ShieldAlert
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { useDashboard } from "@/context/DashboardContext";

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

export default function DashboardPage() {
  const {
    sidebarTab,
    setSidebarTab,
    userProfile,
    addToast,
    searchQuery,
    setSearchQuery,
    smartSearchInput,
    setSmartSearchInput,
    smartSearchResult,
    setSmartSearchResult,
    isSmartSearching,
    smartSearchQueryTitle,
    handleSmartSearch,
    selectedEventForTeams,
    setSelectedEventForTeams,
    setIsTeamsModalOpen,
    meetingInputType,
    setMeetingInputType,
    meetingText,
    setMeetingText,
    uploadedPdfFile,
    setUploadedPdfFile,
    isProcessingMeeting,
    meetingProcessingStep,
    isDragOver,
    setIsDragOver,
    activeResultTab,
    setActiveResultTab,
    meetingResult,
    setMeetingResult,
    processMeetingIntel,
    toggleActionItem,
    totalParticipants,
    upcomingEventsCount,
    activeTournamentsCount,
    announcementsCount,
    donutData,
    currentDate,
    events,
    setIsCreateModalOpen,
    triggerPresetPrompt,
    activity,
    announcements
  } = useDashboard();

  const [isClientMounted, setIsClientMounted] = useState(false);
  const [selectedMainGame, setSelectedMainGame] = useState("valorant");

  const detailedPointsData: Record<string, { rank: number; name: string; played: number; wins: number; losses: number; killPoints: number; placePoints: number; points: number; trend: "up" | "down" | "same" }[]> = {
    valorant: [
      { rank: 1, name: "Sentinels", played: 3, wins: 3, losses: 0, killPoints: 42, placePoints: 48, points: 90, trend: "up" },
      { rank: 2, name: "Fnatic", played: 3, wins: 2, losses: 1, killPoints: 35, placePoints: 40, points: 75, trend: "same" },
      { rank: 3, name: "Paper Rex", played: 3, wins: 2, losses: 1, killPoints: 30, placePoints: 30, points: 60, trend: "up" },
      { rank: 4, name: "Team Heretics", played: 3, wins: 1, losses: 2, killPoints: 25, placePoints: 20, points: 45, trend: "down" },
      { rank: 5, name: "T1 Esports", played: 3, wins: 1, losses: 2, killPoints: 20, placePoints: 15, points: 35, trend: "same" },
      { rank: 6, name: "Gen.G Esports", played: 3, wins: 0, losses: 3, killPoints: 15, placePoints: 10, points: 25, trend: "down" }
    ],
    bgmi: [
      { rank: 1, name: "Team Soul", played: 5, wins: 4, losses: 1, killPoints: 65, placePoints: 55, points: 120, trend: "up" },
      { rank: 2, name: "GodLike Esports", played: 5, wins: 3, losses: 2, killPoints: 50, placePoints: 45, points: 95, trend: "same" },
      { rank: 3, name: "Global Esports", played: 5, wins: 3, losses: 2, killPoints: 40, placePoints: 40, points: 80, trend: "up" },
      { rank: 4, name: "Reckoning", played: 5, wins: 2, losses: 3, killPoints: 30, placePoints: 25, points: 55, trend: "down" },
      { rank: 5, name: "Entity Gaming", played: 5, wins: 2, losses: 3, killPoints: 25, placePoints: 20, points: 45, trend: "up" },
      { rank: 6, name: "Medal Esports", played: 5, wins: 1, losses: 4, killPoints: 18, placePoints: 12, points: 30, trend: "down" }
    ],
    clash: [
      { rank: 1, name: "Indian Clashers", played: 2, wins: 2, losses: 0, killPoints: 20, placePoints: 30, points: 50, trend: "up" },
      { rank: 2, name: "Alpha Stars", played: 2, wins: 1, losses: 1, killPoints: 18, placePoints: 22, points: 40, trend: "same" },
      { rank: 3, name: "Delta Squad", played: 2, wins: 1, losses: 1, killPoints: 15, placePoints: 15, points: 30, trend: "up" },
      { rank: 4, name: "Vanguard", played: 2, wins: 0, losses: 2, killPoints: 8, placePoints: 7, points: 15, trend: "down" }
    ],
    freefire: [
      { rank: 1, name: "Total Gaming", played: 4, wins: 3, losses: 1, killPoints: 60, placePoints: 50, points: 110, trend: "up" },
      { rank: 2, name: "Orangutan Elite", played: 4, wins: 2, losses: 2, killPoints: 45, placePoints: 40, points: 85, trend: "same" },
      { rank: 3, name: "God Nation", played: 4, wins: 2, losses: 2, killPoints: 35, placePoints: 35, points: 70, trend: "up" },
      { rank: 4, name: "Nigma Galaxy", played: 4, wins: 1, losses: 3, killPoints: 25, placePoints: 25, points: 50, trend: "down" }
    ]
  };

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setUploadedPdfFile(file);
      } else {
        addToast("⚠️ Please upload a valid PDF document.");
      }
    }
  };

  const renderTranscriptLine = (line: string, idx: number) => {
    if (line.startsWith("[") || line.startsWith("Section") || line.startsWith("===")) {
      return <p key={idx} className="text-xs font-bold text-purple-400 mb-2 leading-relaxed mt-2">{line}</p>;
    }
    const match = line.match(/^([^:]+):(.*)$/);
    if (match) {
      const [, speaker, content] = match;
      return (
        <div key={idx} className="mb-2 text-xs leading-relaxed">
          <span className="text-purple-400 font-bold mr-1.5">{speaker.trim()}:</span>
          <span className="text-zinc-300">{content.trim()}</span>
        </div>
      );
    }
    return <p key={idx} className="text-xs text-zinc-300 mb-1 leading-relaxed">{line}</p>;
  };

  const adminFirstName = userProfile?.name ? userProfile.name.trim().split(/\s+/)[0] : "Admin";

  return (
    <>
      {/* 4. MAIN DASHBOARD OVERVIEW SCREEN */}
      {sidebarTab === "overview" && (
        <motion.div
          key="dashboard-overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-8"
        >
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Welcome back, {adminFirstName}! 👋
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Here's what's happening in {userProfile?.organization_name || "your organization"} today.
              </p>
            </div>

            {/* Calendar Widget selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => addToast(`📅 ${currentDate} selected. System records are up to date.`)}
                className="px-4 py-2 rounded-xl bg-[#0b0b0c] border border-zinc-900 text-xs font-semibold text-zinc-300 hover:border-zinc-800 transition-all flex items-center gap-2.5"
              >
                <CalendarDays className="w-4 h-4 text-[#7C3AED]" />
                <span>{currentDate}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Participants */}
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold">Total Participants</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold tracking-tight">
                  {totalParticipants.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-900/60">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ↑ 18% this month
                </span>
                <svg className="w-24 h-7 text-[#7C3AED]" viewBox="0 0 100 30" fill="none">
                  <path d="M0 25 Q15 28 30 15 T60 10 T90 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0 25 Q15 28 30 15 T60 10 T90 5 L90 30 L0 30 Z" fill="url(#purpleGlow)" opacity="0.1" />
                  <defs>
                    <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Card 2: Upcoming Events */}
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold">Upcoming Events</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold tracking-tight">
                  {upcomingEventsCount}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-900/60">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ↑ 4 this week
                </span>
                <svg className="w-24 h-7 text-blue-400" viewBox="0 0 100 30" fill="none">
                  <path d="M0 20 Q15 8 30 22 T60 12 T90 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0 20 Q15 8 30 22 T60 12 T90 8 L90 30 L0 30 Z" fill="url(#blueGlow)" opacity="0.1" />
                  <defs>
                    <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Card 3: Active Tournaments */}
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Trophy className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-semibold">Active Tournaments</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold tracking-tight">
                  {activeTournamentsCount}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-900/60">
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Live now
                </span>
                <svg className="w-24 h-7 text-red-400" viewBox="0 0 100 30" fill="none">
                  <path d="M0 10 Q20 28 40 8 T70 24 T90 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0 10 Q20 28 40 8 T70 24 T90 12 L90 30 L0 30 Z" fill="url(#redGlow)" opacity="0.1" />
                  <defs>
                    <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F87171" />
                      <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Card 4: Announcements */}
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Announcements</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold tracking-tight">
                  {announcementsCount}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-900/60">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ↑ 3 this week
                </span>
                <svg className="w-24 h-7 text-emerald-400" viewBox="0 0 100 30" fill="none">
                  <path d="M0 25 Q15 15 30 20 T60 5 T90 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0 25 Q15 15 30 20 T60 5 T90 15 L90 30 L0 30 Z" fill="url(#greenGlow)" opacity="0.1" />
                  <defs>
                    <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT GRID (3 COLUMNS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-sm font-semibold tracking-tight">Upcoming Events</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5">
                  <AnimatePresence>
                    {events
                      .filter((evt) =>
                        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        evt.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        evt.logo.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((evt) => (
                        <motion.div
                          key={evt.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="bg-[#050505] border border-zinc-900/60 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-zinc-800 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <GameLogo type={evt.logo} />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-200 group-hover:text-[#7C3AED] transition-colors">{evt.title}</span>
                                {evt.status === "Live" && (
                                  <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[8px] font-bold px-1.5 rounded uppercase animate-pulse">
                                    Live
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-500 mt-0.5">{evt.date} • {evt.time}</span>
                              <span className="text-[10px] text-zinc-600 font-medium">{evt.teams} • {evt.format}</span>
                            </div>
                          </div>
                          <div className="shrink-0 scale-75 opacity-60">
                            {evt.logo === "valorant" && <span className="text-red-500 font-mono text-[10px] uppercase font-extrabold tracking-tighter">VAL</span>}
                            {evt.logo === "bgmi" && <span className="text-amber-500 font-mono text-[10px] uppercase font-extrabold tracking-tighter">BGMI</span>}
                            {evt.logo === "clash" && <span className="text-indigo-400 font-mono text-[10px] uppercase font-extrabold tracking-tighter">CoC</span>}
                            {evt.logo === "freefire" && <span className="text-orange-500 font-mono text-[10px] uppercase font-extrabold tracking-tighter">FF</span>}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-sm font-semibold tracking-tight">AI Suggestions</span>
                  </div>
                  <span className="text-[9px] text-[#7C3AED] font-bold uppercase tracking-wider bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-2 py-0.5 rounded-full animate-pulse">
                    Copilot v1
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { title: "Generate tournament schedule", desc: "AI will create an optimized schedule for 16 teams.", action: "Generate", prompt: "Generate a tournament schedule for 16 teams", type: "schedule" },
                    { title: "Summarize last meeting", desc: "Get key takeaways from your meeting recordings.", action: "Summarize", prompt: "Summarize the last organizer sync meeting", type: "meeting" },
                    { title: "Create announcement", desc: "Let AI craft the perfect announcement for your community.", action: "Create", prompt: "Create an announcement for the Valorant Arena Cup kickoff", type: "announcement" }
                  ].map((sug, idx) => (
                    <div key={idx} className="bg-[#050505] border border-zinc-900/60 rounded-xl p-3 flex flex-col gap-2.5 justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-zinc-300">{sug.title}</span>
                        <span className="text-[10px] text-zinc-500 leading-normal">{sug.desc}</span>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            addToast(`🤖 Copilot initiating action: ${sug.action}`);
                            triggerPresetPrompt(sug.prompt, sug.type);
                          }}
                          className="px-3 py-1 bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-white hover:bg-[#7C3AED] hover:border-transparent text-[10px] font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
                        >
                          {sug.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER COLUMN */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Event Overview: Donut Chart */}
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold tracking-tight">Event Overview</span>
                  <select
                    className="bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-400 rounded-md px-2 py-1 cursor-pointer focus:outline-none"
                    onChange={() => addToast("📊 Event overview filter adjusted.")}
                  >
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>All Time</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="w-40 h-40 relative flex items-center justify-center shrink-0">
                    {isClientMounted ? (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {donutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-[10px] text-zinc-500">Loading Segment...</div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold tracking-tight">
                        {donutData.reduce((acc, curr) => acc + curr.value, 0)}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-medium">Total Events</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full">
                    {donutData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs border-b border-zinc-900/40 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-zinc-400 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-zinc-200">{item.value} Events</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area chart */}
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold tracking-tight">Participants Analytics</span>
                  <select
                    className="bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-400 rounded-md px-2 py-1 cursor-pointer focus:outline-none"
                    onChange={() => addToast("📈 Chart timeline updated.")}
                  >
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                  </select>
                </div>

                <div className="h-44 w-full">
                  {isClientMounted ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={areaData}>
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} domain={[200, 1800]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: "#0b0b0c", borderColor: "rgba(255,255,255,0.06)", borderRadius: "12px" }} labelStyle={{ color: "#a1a1aa", fontSize: "10px" }} itemStyle={{ color: "#7C3AED", fontSize: "11px", fontWeight: "bold" }} />
                        <Area
                          type="monotone"
                          dataKey="participants"
                          stroke="#7C3AED"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#purpleGradient)"
                          dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.name === "May 20") {
                              return (
                                <g key="active-dot">
                                  <circle cx={cx} cy={cy} r={7} fill="#7C3AED" fillOpacity={0.4} />
                                  <circle cx={cx} cy={cy} r={4} fill="#7C3AED" stroke="#fff" strokeWidth={1} />
                                </g>
                              );
                            }
                            return <circle key={cx} cx={cx} cy={cy} r={2} fill="#7C3AED" fillOpacity={0.6} stroke="none" />;
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-500">Loading graphs...</div>
                  )}
                </div>
              </div>

              {/* AI Dispute Resolution Desk */}
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-zinc-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs font-bold tracking-tight text-zinc-300">AI Dispute Resolution Desk</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                    Auto-Resolve Active
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { id: "#DISP-991", title: "Valorant Cup: Alpha vs Delta", desc: "Roster substitution timestamp dispute.", resolution: "Roster verified, sub recorded before cutoff.", status: "Resolved" },
                    { id: "#DISP-984", title: "BGMI Campus: Kings vs Shadow", desc: "Mobile client emulator warning trigger.", resolution: "Emulator confirmed. Disqualified by referee guidelines.", status: "Disqualified" }
                  ].map((disp, idx) => (
                    <div key={idx} className="bg-[#050505] border border-zinc-900/60 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-500 font-semibold font-mono">{disp.id}</span>
                          <span className="text-[11px] font-bold text-zinc-200 leading-normal">{disp.title}</span>
                        </div>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                          disp.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {disp.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">{disp.desc}</p>
                      <div className="bg-black/40 p-2 rounded-lg border border-zinc-900/40 text-[9px] text-zinc-500 font-medium leading-relaxed">
                        <span className="text-[#c084fc] font-bold">AI Rationale: </span>
                        {disp.resolution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-3 flex flex-col gap-6 h-full">
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-sm font-semibold tracking-tight">Recent Activity</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5">
                  <AnimatePresence>
                    {activity.map((act) => (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-3 border-b border-zinc-900/40 pb-2.5 last:border-b-0 last:pb-0"
                      >
                        <div className="w-6 h-6 rounded-md bg-[#050505] border border-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span className="text-[11px] text-zinc-300 font-medium leading-relaxed">{act.text}</span>
                          <span className="text-[9px] text-zinc-500 font-semibold">{act.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bot & Integrations Status */}
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-center border-b border-zinc-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs font-bold tracking-tight text-zinc-300">Active Integrations</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { name: "Discord Referee Bot", status: "Online", details: "Lobby monitoring active", color: "bg-emerald-500" },
                    { name: "YouTube Live Sync", status: "Online", details: "Viewership analytics tracking", color: "bg-emerald-500" },
                    { name: "Toxicity Filter Engine", status: "Active", details: "Real-time moderation audit", color: "bg-purple-500 animate-pulse" },
                    { name: "Match Seeding Engine", status: "Idle", details: "Waiting next lobby cycle", color: "bg-zinc-600" }
                  ].map((bot, idx) => (
                    <div key={idx} className="bg-[#050505] border border-zinc-900/60 rounded-xl p-2.5 flex items-center justify-between gap-3 hover:border-zinc-800 transition-colors font-sans">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[11px] font-bold text-zinc-300 truncate">{bot.name}</span>
                        <span className="text-[9px] text-zinc-500 font-medium truncate">{bot.details}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-black/40 border border-zinc-900/80 px-2 py-0.5 rounded-lg">
                        <span className={`w-1.5 h-1.5 rounded-full ${bot.color}`} />
                        <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">{bot.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. ANNOUNCEMENTS FULL VIEW SCREEN */}
      {sidebarTab === "announcements" && (
        <motion.div
          key="full-announcements"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Community Announcements</h1>
              <p className="text-zinc-500 text-sm mt-1">Broadcasts and rule updates published across your active gaming communities.</p>
            </div>
            <button
              onClick={() => {
                triggerPresetPrompt("Draft a major announcement post for our community", "announcement");
                addToast("🤖 Copilot drafted an announcement in the AI panel.");
              }}
              className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" /> Draft with AI
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {announcements.map((ann, idx) => (
              <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-sm text-zinc-200">{ann.title}</span>
                  <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{ann.code}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{ann.body}</p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 pt-2 border-t border-zinc-900/60 mt-1">
                  <span>By <strong>{ann.creator}</strong></span>
                  <span>•</span>
                  <span>{ann.date} at {ann.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. MEETING INTELLIGENCE ASSISTANT */}
      {sidebarTab === "meeting" && (
        <motion.div
          key="meeting-assistant-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#7C3AED]" /> Meeting & Document Intelligence Assistant
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Upload a PDF document or paste tournament briefings and notes to summarize, extract details, and track actions with Gemini AI.</p>
          </div>

          {!meetingResult && !isProcessingMeeting && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Analysis Input Source</span>
                  <div className="flex bg-[#050505] p-1 rounded-xl border border-zinc-900">
                    <button
                      onClick={() => setMeetingInputType("pdf")}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                        meetingInputType === "pdf"
                          ? "bg-[#7C3AED]/20 text-[#c084fc] border border-[#7C3AED]/30"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      PDF Document
                    </button>
                    <button
                      onClick={() => setMeetingInputType("text")}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                        meetingInputType === "text"
                          ? "bg-[#7C3AED]/20 text-[#c084fc] border border-[#7C3AED]/30"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Pasted Notes
                    </button>
                  </div>
                </div>

                {meetingInputType === "pdf" ? (
                  <div className="flex flex-col gap-4">
                    {!uploadedPdfFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("pdf-upload-input")?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                          isDragOver
                            ? "border-[#7C3AED] bg-[#7C3AED]/5"
                            : "border-zinc-800 hover:border-zinc-700 bg-black/20"
                        }`}
                      >
                        <input
                          type="file"
                          id="pdf-upload-input"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadedPdfFile(e.target.files[0]);
                            }
                          }}
                        />
                        <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                          <Upload className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-zinc-300">Drag and drop PDF file here, or click to browse</p>
                          <p className="text-xs text-zinc-600 mt-1">Supports PDF format up to 25MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#050505] border border-zinc-900 rounded-xl p-5 flex items-center justify-between relative">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                            PDF
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-zinc-200 truncate max-w-[200px] sm:max-w-md">{uploadedPdfFile.name}</p>
                            <p className="text-[11px] text-zinc-500">
                              {(uploadedPdfFile.size / 1024).toFixed(1)} KB • PDF Document
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedPdfFile(null);
                          }}
                          className="text-zinc-500 hover:text-zinc-300 p-1.5 hover:bg-zinc-900 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <textarea
                        placeholder="Paste a long paragraph or notes about your esports meeting, match dispute, schedule changes, or rule modifications here..."
                        value={meetingText}
                        onChange={(e) => setMeetingText(e.target.value)}
                        rows={6}
                        className="w-full bg-[#050505] border border-zinc-900 rounded-xl p-4 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#7C3AED]/30 resize-none font-sans"
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] text-zinc-600 font-mono">
                        {meetingText.length} chars • {meetingText.trim() ? meetingText.trim().split(/\s+/).length : 0} words
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-2 border-t border-zinc-900/60 pt-4">
                  {(uploadedPdfFile || meetingText) && (
                    <button
                      onClick={() => {
                        setUploadedPdfFile(null);
                        setMeetingText("");
                      }}
                      className="px-4 py-2 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950 text-xs font-semibold rounded-xl text-zinc-400 transition-all"
                    >
                      Clear Form
                    </button>
                  )}
                  <button
                    onClick={processMeetingIntel}
                    disabled={meetingInputType === "pdf" ? !uploadedPdfFile : !meetingText.trim()}
                    className={`px-5 py-2 bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-purple-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Analyze with Gemini AI
                  </button>
                </div>
              </div>

              {/* Right: Info Card */}
              <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Analysis Engine Guidelines</span>
                <div className="text-xs text-zinc-400 space-y-3">
                  <p>Upload a PDF document or paste a paragraph describing a tournament event. Gemini will:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-zinc-500 pl-1">
                    <li>Summarize core decision threads</li>
                    <li>Auto-extract structured Action Items</li>
                    <li>Identify dates, games & rule changes</li>
                    <li>Extract key tournament settings</li>
                  </ul>
                  <div className="border-t border-zinc-900/60 pt-3 mt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Preset Examples to try</span>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setMeetingInputType("text");
                          setMeetingText("We held our Valorant Spring Cup sync today. Aditya Verma and Referee Rohit checked brackets. Roster submissions are lagging; the deadline is strictly locked to 7:00 PM IST today for the 128 seeded teams. A rules dispute from last week was discussed: we agreed to enforce the MR3 overtime rules on all map pools (maps are Bind, Ascent, Haven). Rohit will ping Team Heretics to get their roster in before cutoff, and Aditya will update the discord rulebook.");
                        }}
                        className="w-full text-left bg-[#050505] hover:bg-zinc-950 border border-zinc-900 hover:border-zinc-800 p-2 rounded-lg text-[10px] text-[#c084fc] font-medium transition-colors"
                      >
                        📝 Valorant Meeting Notes Draft
                      </button>
                      <button
                        onClick={() => {
                          setMeetingInputType("text");
                          setMeetingText("BGMI Campus Clash organizer sync notes: Aditya Verma reported that slot list assignments are completed for Lobby A and Lobby B. There is a conflict on team placement for GodLike Esports. Aditya will move GodLike to Slot 12. Referee Aditya confirmed the points table spreadsheet must be published by tomorrow at 10 AM. We also agreed to add 1 referee observer per squad to monitor ping spikes and report logs.");
                        }}
                        className="w-full text-left bg-[#050505] hover:bg-zinc-950 border border-zinc-900 hover:border-zinc-800 p-2 rounded-lg text-[10px] text-[#c084fc] font-medium transition-colors"
                      >
                        📝 BGMI Organizer Sync Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing overlay */}
          {isProcessingMeeting && (
            <div className="w-full bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 min-h-[300px]">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
                <Bot className="w-6 h-6 text-purple-400 absolute" />
              </div>
              <div className="text-center flex flex-col gap-2">
                <p className="text-sm font-bold text-zinc-200">Processing Document Intelligence...</p>
                <p className="text-xs text-[#c084fc] font-mono animate-pulse">{meetingProcessingStep}</p>
              </div>
            </div>
          )}

          {/* Results display */}
          {meetingResult && !isProcessingMeeting && (
            <div className="bg-[#0b0b0c] border border-[#7C3AED]/20 shadow-2xl shadow-purple-950/5 rounded-2xl p-6 flex flex-col gap-5 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      Success
                    </span>
                    <h2 className="text-sm font-bold text-zinc-200">Gemini Intelligence Extraction Result</h2>
                  </div>
                </div>
                <div className="flex bg-[#050505] p-1 rounded-xl border border-zinc-900">
                  {["summary", "actions", "transcript"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveResultTab(tab as any)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                        activeResultTab === tab
                          ? "bg-[#7C3AED]/20 text-[#c084fc] border border-[#7C3AED]/30"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeResultTab === "summary" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="bg-[#050505] border border-zinc-900 rounded-xl p-5 flex flex-col gap-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Executive Summary</span>
                      <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-text pr-2">
                        {meetingResult.summary}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#050505] border border-zinc-900 rounded-xl p-5 flex flex-col gap-3.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Key Details Index</span>
                    <div className="flex flex-col gap-3">
                      {meetingResult.details.map((det: any, idx: number) => (
                        <div key={idx} className="flex flex-col border-b border-zinc-900/60 pb-2 last:border-0 last:pb-0">
                          <span className="text-[10px] text-zinc-500 font-semibold">{det.label}</span>
                          <span className="text-xs text-zinc-300 font-bold mt-0.5">{det.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeResultTab === "actions" && (
                <div className="bg-[#050505] border border-zinc-900 rounded-xl p-5 flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Extracted Action Items</span>
                  {meetingResult.actionItems.length === 0 ? (
                    <div className="text-xs text-zinc-500 italic py-2">No action items identified.</div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {meetingResult.actionItems.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between border-b border-zinc-900/40 pb-2.5 last:border-b-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleActionItem(item.id)}
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                item.completed
                                  ? "bg-[#7C3AED] border-transparent text-white"
                                  : "border-zinc-800 hover:border-zinc-700 bg-black/40"
                              }`}
                            >
                              {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                            <span className={`text-xs transition-all ${item.completed ? "text-zinc-600 line-through" : "text-zinc-300 font-medium"}`}>
                              {item.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {item.assignee && (
                              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-bold">
                                @{item.assignee}
                              </span>
                            )}
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                              item.priority === "High"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : item.priority === "Medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeResultTab === "transcript" && (
                <div className="bg-[#050505] border border-zinc-900 rounded-xl p-5 flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Parsed Document Text Outline</span>
                  <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1.5">
                    {meetingResult.transcript.split("\n").filter((line: string) => line.trim() !== "").map((line: string, idx: number) => 
                      renderTranscriptLine(line, idx)
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-zinc-900 pt-4 mt-1">
                <span className="text-[10px] text-zinc-500 font-mono">Powered by Google Gemini Generative Intelligence</span>
                <button
                  onClick={() => {
                    setMeetingResult(null);
                    setUploadedPdfFile(null);
                    setMeetingText("");
                  }}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold rounded-lg text-zinc-300 transition-colors"
                >
                  Reset & Analyze New Brief
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 7. KNOWLEDGE BASE */}
      {sidebarTab === "knowledge" && (
        <motion.div
          key="knowledge-base-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Knowledge Base Explorer</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage documents, PDFs, guides, and tournament rulebooks referenced by referee bots.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "valorant-official-rules-spring-2025.pdf", displayName: "Valorant Official Rules Spring 2025.pdf", size: "220 KB", type: "PDF Rulebook", count: "48 bot queries solved", fileUrl: "/valorant-official-rules-spring-2025.pdf" },
              { name: "BGMIrulebook.pdf", displayName: "BGMI Tournament Rulebook.pdf", size: "885 KB", type: "PDF Rulebook", count: "32 bot queries solved", fileUrl: "/BGMIrulebook.pdf" },
              { name: "CLASH_COLLEGES_FORMAT_V2.pdf", displayName: "Clash Colleges Format V2.pdf", size: "840 KB", type: "Lobby Setup Guide", count: "12 bot queries solved", fileUrl: null }
            ].map((doc, idx) => (
              <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-[#7C3AED]/20 transition-all duration-300">
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-xs text-zinc-200 line-clamp-1 group-hover:text-[#7C3AED] transition-colors" title={doc.displayName}>{doc.displayName}</span>
                  <span className="text-[10px] text-[#7C3AED] font-semibold">{doc.type} • {doc.size}</span>
                  <span className="text-[10px] text-zinc-500 italic mt-1">{doc.count}</span>
                </div>
                <button
                  onClick={() => {
                    if (doc.fileUrl) {
                      window.open(doc.fileUrl, "_blank");
                      addToast(`📖 Opening ${doc.displayName}...`);
                    } else {
                      triggerPresetPrompt(`Scan rulebook parameters for ${doc.name.substring(0, 10)}`, "faq");
                      addToast(`🔍 Scanning parameters for ${doc.displayName}...`);
                    }
                  }}
                  className="py-1.5 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 transition-colors cursor-pointer active:scale-95 transition-all"
                >
                  Verify Parameters
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 8. SMART SEARCH */}
      {sidebarTab === "search" && (
        <motion.div
          key="smart-search-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Search className="w-6 h-6 text-[#7C3AED]" /> Smart Search Engine
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Perform deep indexing queries across active tournaments, chats, and knowledge rulebooks.</p>
          </div>
          <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={smartSearchInput}
                onChange={(e) => setSmartSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSmartSearch();
                  }
                }}
                placeholder="Type query to scan e.g. Summarize Section 2 of the uploaded Valorant rules PDF..."
                className="bg-[#050505] border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none flex-1 focus:border-[#7C3AED]/40 focus:ring-1 focus:ring-[#7C3AED]/20 transition-all"
              />
              <button
                onClick={() => handleSmartSearch()}
                disabled={isSmartSearching}
                className="px-5 py-2.5 bg-[#7C3AED] text-white text-xs font-semibold rounded-xl hover:bg-[#6D28D9] disabled:bg-zinc-800 disabled:text-zinc-500 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 font-medium"
              >
                {isSmartSearching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Scan Database</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-zinc-900 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {isSmartSearching ? "Query Status: Scanning Lobbies..." : "Search Index Results"}
                </span>
                {smartSearchResult && (
                  <button
                    onClick={() => {
                      setSmartSearchResult(null);
                      setSmartSearchInput("");
                    }}
                    className="text-[9px] text-[#7C3AED] hover:underline font-semibold"
                  >
                    Clear Results
                  </button>
                )}
              </div>

              {isSmartSearching ? (
                <div className="bg-[#050505] p-5 rounded-xl border border-[#7C3AED]/10 flex flex-col gap-2 items-center justify-center py-8 text-center animate-pulse">
                  <Bot className="w-6 h-6 text-[#7C3AED] animate-bounce" />
                  <span className="text-xs font-semibold text-zinc-300">Searching and Reading PDFs...</span>
                  <span className="text-[10px] text-zinc-500 max-w-sm">RAG semantic parser is processing files inside `knowledge_base/` using Gemini 2.5 Flash. Please stand by.</span>
                </div>
              ) : smartSearchResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#050505] p-5 rounded-xl border border-zinc-800/80 shadow-inner flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 border-b border-zinc-900 pb-2">
                    <Bot className="w-4 h-4 text-[#7C3AED]" />
                    <span>Scan matching: </span>
                    <span className="text-[#7C3AED] font-mono select-all bg-[#7C3AED]/5 px-1.5 py-0.5 rounded border border-[#7C3AED]/20">"{smartSearchQueryTitle}"</span>
                  </div>

                  <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-text pr-2">
                    {smartSearchResult}
                  </div>

                  <div className="text-[9px] text-zinc-500 italic mt-1 border-t border-zinc-900/60 pt-2 flex items-center justify-between">
                    <span>Ground-truth Verified via Knowledge Base PDF Extraction</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Accuracy 100%</span>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-[#050505] p-4 rounded-xl border border-zinc-900 flex flex-col gap-2">
                  <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    Featured Reference: tiebreaker regulations from "VALORANT_COMMUNITY_RULEBOOK_V4.pdf"
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    "Section 12.4: If a match ends in a 12-12 tie during tournament stages, teams must play sudden death overtime rounds using the MR3 format. Substitutes restriction must limit to a max of 2 registered players."
                  </p>
                  <div className="pt-2 border-t border-zinc-900/60 mt-1 flex justify-between items-center">
                    <span className="text-[9px] text-zinc-600">Scan parameters or enter a custom prompt above to query PDFs in real-time.</span>
                    <button
                      onClick={() => {
                        setSmartSearchInput("Summarize Section 2 of the uploaded Valorant rules PDF");
                        handleSmartSearch("Summarize Section 2 of the uploaded Valorant rules PDF");
                      }}
                      className="text-[9px] text-[#7C3AED] hover:underline font-semibold flex items-center gap-0.5"
                    >
                      Load Demo Query <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* 9. DISPUTE ASSISTANT */}
      {sidebarTab === "dispute" && (
        <motion.div
          key="dispute-assistant-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Dispute Resolution Desk</h1>
            <p className="text-zinc-500 text-sm mt-1">Review active brackets dispute flags submitted by players in Discord match channels.</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { id: "#DISP-991", title: "Valorant Cup: Alpha Squad vs Team Delta", desc: "Alpha Squad claims roster substitutions were not recorded on time.", status: "Auto-Resolved", detail: "Roster scanned, substitution timestamps verified. Passed." },
              { id: "#DISP-984", title: "BGMI Campus: Kings Esports vs Shadow Hunter", desc: "Opponents claim player used an un-registered emulator client.", status: "Auto-Resolved", detail: "Discord logs analyzed. emulator filter flag matched. Disqualified." }
            ].map((disp, idx) => (
              <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-zinc-500">{disp.id}</span>
                    <span className="text-sm font-bold text-zinc-200">{disp.title}</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{disp.status}</span>
                </div>
                <p className="text-xs text-zinc-400">{disp.desc}</p>
                <div className="bg-[#050505] p-2.5 rounded-xl border border-zinc-900/60 text-[10px] text-zinc-400 flex flex-col gap-0.5 leading-normal">
                  <span className="font-semibold text-zinc-300">🤖 RESOLUTION RATIONALE:</span>
                  <span>{disp.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 10. POINTS TABLE */}
      {sidebarTab === "points-table" && (
        <motion.div
          key="points-table-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#7C3AED]" /> Brackets Standing & Points Tables
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Review standings, wins, losses, kill points, place points, and total score tracking across active gaming brackets.</p>
            </div>

            {/* Game Selector Tabs */}
            <div className="flex bg-[#0b0b0c] p-1 rounded-xl border border-zinc-900/60 self-start md:self-auto">
              {[
                { code: "valorant", label: "Valorant" },
                { code: "bgmi", label: "BGMI" },
                { code: "clash", label: "Clash" },
                { code: "freefire", label: "Free Fire" }
              ].map((g) => (
                <button
                  key={g.code}
                  onClick={() => setSelectedMainGame(g.code)}
                  className={`text-xs py-2 px-3.5 font-bold rounded-lg transition-all cursor-pointer ${
                    selectedMainGame === g.code
                      ? "bg-[#7C3AED]/20 text-[#c084fc] border border-[#7C3AED]/35 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Podium Visualization */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 bg-[#0b0b0c]/40 border border-zinc-900/50 rounded-3xl p-8 max-w-4xl mx-auto w-full relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* 2nd Place: Left side */}
            {detailedPointsData[selectedMainGame]?.[1] && (
              <div className="flex flex-col items-center gap-3 w-48 order-2 md:order-1 mt-6 md:mt-0">
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 font-bold text-xs uppercase">Runner Up</span>
                  <span className="text-[10px] text-zinc-500">Rank #2</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800/40 border border-zinc-700/60 flex items-center justify-center text-zinc-300 text-sm font-bold shadow-md shadow-black/40">
                  2
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm text-zinc-200">{detailedPointsData[selectedMainGame][1].name}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{detailedPointsData[selectedMainGame][1].points} PTS</p>
                </div>
                {/* Silver Pedestal */}
                <div className="w-full h-24 bg-gradient-to-t from-zinc-900 to-zinc-800/50 border-t border-zinc-850/30 rounded-t-xl flex items-end justify-center shadow-lg shadow-black/20 pb-4">
                  <span className="text-2xl font-black text-zinc-500/30 font-mono">2ND</span>
                </div>
              </div>
            )}

            {/* 1st Place: Center */}
            {detailedPointsData[selectedMainGame]?.[0] && (
              <div className="flex flex-col items-center gap-3 w-52 order-1 md:order-2">
                <div className="flex flex-col items-center relative">
                  <Trophy className="w-6 h-6 text-yellow-400 animate-bounce absolute -top-8" />
                  <span className="text-yellow-400 font-black text-sm uppercase tracking-wider mt-1">Champion</span>
                  <span className="text-[10px] text-yellow-500/70 font-semibold">Rank #1</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-lg font-black shadow-lg shadow-yellow-500/10">
                  1
                </div>
                <div className="text-center">
                  <h3 className="font-black text-base text-yellow-300 tracking-wide">{detailedPointsData[selectedMainGame][0].name}</h3>
                  <p className="text-xs text-yellow-400 font-mono font-bold mt-0.5">{detailedPointsData[selectedMainGame][0].points} PTS</p>
                </div>
                {/* Gold Pedestal */}
                <div className="w-full h-32 bg-gradient-to-t from-zinc-900 to-yellow-500/10 border-t-2 border-yellow-500/20 rounded-t-2xl flex items-end justify-center shadow-xl shadow-yellow-500/5 pb-4">
                  <span className="text-3xl font-black text-yellow-500/20 font-mono">1ST</span>
                </div>
              </div>
            )}

            {/* 3rd Place: Right side */}
            {detailedPointsData[selectedMainGame]?.[2] && (
              <div className="flex flex-col items-center gap-3 w-44 order-3 md:order-3 mt-6 md:mt-0">
                <div className="flex flex-col items-center">
                  <span className="text-amber-500 font-bold text-xs uppercase">3rd Place</span>
                  <span className="text-[10px] text-zinc-500">Rank #3</span>
                </div>
                <div className="w-11 h-11 rounded-lg bg-amber-900/20 border border-amber-800/40 flex items-center justify-center text-amber-500 text-xs font-bold shadow-md shadow-black/40">
                  3
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm text-zinc-300">{detailedPointsData[selectedMainGame][2].name}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{detailedPointsData[selectedMainGame][2].points} PTS</p>
                </div>
                {/* Bronze Pedestal */}
                <div className="w-full h-20 bg-gradient-to-t from-zinc-900 to-amber-950/20 border-t border-amber-900/30 rounded-t-lg flex items-end justify-center shadow-lg shadow-black/20 pb-3">
                  <span className="text-xl font-black text-amber-600/20 font-mono">3RD</span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Leaderboard Table */}
          <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
            <div className="px-6 py-4 border-b border-zinc-900/60 bg-zinc-950/20 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-200">Standing Leaderboard Audits</h2>
              <span className="text-[10px] font-bold bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#c084fc] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Brackets Syncing
              </span>
            </div>
            <div className="overflow-x-auto select-text">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950/40 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="px-6 py-3.5 text-center w-16">Rank</th>
                    <th className="px-6 py-3.5">Team Name</th>
                    <th className="px-6 py-3.5 text-center">Played</th>
                    <th className="px-6 py-3.5 text-center text-emerald-400">Wins</th>
                    <th className="px-6 py-3.5 text-center text-red-400">Losses</th>
                    <th className="px-6 py-3.5 text-center">Kill Pts</th>
                    <th className="px-6 py-3.5 text-center">Place Pts</th>
                    <th className="px-6 py-3.5 text-center text-[#7C3AED]">Total Pts</th>
                    <th className="px-6 py-3.5 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {detailedPointsData[selectedMainGame]?.map((team) => {
                    let rowBg = "hover:bg-zinc-900/10";
                    let rankBadge = "bg-zinc-900/80 text-zinc-400 border border-zinc-800";
                    let teamHighlight = "text-zinc-300 font-medium";

                    if (team.rank === 1) {
                      rowBg = "bg-yellow-500/5 hover:bg-yellow-500/10 border-l-4 border-l-yellow-500/60";
                      rankBadge = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-black";
                      teamHighlight = "text-yellow-400 font-bold";
                    } else if (team.rank === 2) {
                      rowBg = "bg-zinc-100/5 hover:bg-zinc-800/20 border-l-4 border-l-zinc-400/60";
                      rankBadge = "bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold";
                      teamHighlight = "text-zinc-200 font-bold";
                    } else if (team.rank === 3) {
                      rowBg = "bg-amber-600/5 hover:bg-amber-600/10 border-l-4 border-l-amber-600/60";
                      rankBadge = "bg-amber-900/30 text-amber-500 border border-amber-800 font-bold";
                      teamHighlight = "text-amber-500 font-bold";
                    }

                    return (
                      <tr key={team.rank} className={`transition-colors text-xs ${rowBg}`}>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] ${rankBadge}`}>
                            {team.rank}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${teamHighlight}`}>
                          {team.name}
                        </td>
                        <td className="px-6 py-4 text-center font-medium font-mono text-zinc-400">
                          {team.played}
                        </td>
                        <td className="px-6 py-4 text-center font-bold font-mono text-emerald-400/90">
                          {team.wins}
                        </td>
                        <td className="px-6 py-4 text-center font-bold font-mono text-red-400/90">
                          {team.losses}
                        </td>
                        <td className="px-6 py-4 text-center font-medium font-mono text-zinc-400">
                          {team.killPoints}
                        </td>
                        <td className="px-6 py-4 text-center font-medium font-mono text-zinc-400">
                          {team.placePoints}
                        </td>
                        <td className={`px-6 py-4 text-center font-black font-mono ${team.rank <= 3 ? "text-zinc-100" : "text-zinc-400"}`}>
                          {team.points}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            {team.trend === "up" && (
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[9px] font-bold">
                                ▲ UP
                              </span>
                            )}
                            {team.trend === "down" && (
                              <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-[9px] font-bold">
                                ▼ DOWN
                              </span>
                            )}
                            {team.trend === "same" && (
                              <span className="text-zinc-500 font-bold text-[10px]">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 11. SPONSOR */}
      {sidebarTab === "sponsor" && (
        <motion.div
          key="sponsor-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sponsor & Stream Analytics</h1>
              <p className="text-zinc-500 text-sm mt-1">Track overlay metrics, platform viewership, active memberships, and total broadcasting revenue.</p>
            </div>
            <button
              onClick={() => addToast("📊 Refreshed live stream API feeds")}
              className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Platform API</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { label: "Total Combined Revenue", val: "₹1,84,500", change: "↑ 14.8% this week", color: "text-[#7C3AED]" },
              { label: "Total Stream Views", val: "54.2K views", change: "↑ 8.2% vs last cup", color: "text-blue-400" },
              { label: "Total Active Memberships", val: "1,148 Members", change: "↑ 24 new today", color: "text-emerald-400" },
              { label: "Ad Impressions Peak", val: "128K impressions", change: "92% completion rate", color: "text-amber-400" }
            ].map((metric, idx) => (
              <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-2.5">
                <span className="text-xs text-zinc-500 font-medium">{metric.label}</span>
                <div className="flex flex-col">
                  <span className={`text-2xl font-bold tracking-tight ${metric.color}`}>{metric.val}</span>
                  <span className="text-[10px] font-semibold text-emerald-400 mt-1">{metric.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-red-500/25 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-red-500 text-red-500">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <span className="font-bold text-sm text-zinc-100">YouTube Gaming</span>
                </div>
                <span className="bg-red-500/10 text-red-500 text-[8px] font-bold px-2 py-0.5 rounded border border-red-500/20">Live Feed</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Current Live Watchers</span>
                  <span className="font-bold text-zinc-200">2,410 concurrent</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Total Stream Views</span>
                  <span className="font-bold text-zinc-200">38.5K views</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Active Channel Members</span>
                  <span className="font-bold text-red-400">684 Members</span>
                </div>
              </div>
            </div>

            {/* Twitch Platform Card */}
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#9146FF]/25 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9146FF]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#9146FF]/10 border border-[#9146FF]/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-[#9146FF] text-[#9146FF]">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                    </svg>
                  </div>
                  <span className="font-bold text-sm text-zinc-100">Twitch TV</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">Connected</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Current Live Watchers</span>
                  <span className="font-bold text-zinc-200">1,120 concurrent</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Total Stream Views</span>
                  <span className="font-bold text-zinc-200">12.4K views</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Subscribed Channels</span>
                  <span className="font-bold text-[#9146FF]">342 Subs</span>
                </div>
              </div>
            </div>

            {/* Kick Platform Card */}
            <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#53FC18]/25 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#53FC18]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#53FC18]/10 border border-[#53FC18]/20 flex items-center justify-center">
                    <span className="font-extrabold text-[#53FC18] text-sm">K</span>
                  </div>
                  <span className="font-bold text-sm text-zinc-100">Kick Stream</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">Connected</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Current Live Watchers</span>
                  <span className="font-bold text-zinc-200">480 concurrent</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Total Stream Views</span>
                  <span className="font-bold text-zinc-200">3.3K views</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Active Subscribers</span>
                  <span className="font-bold text-[#53FC18]">122 Subs</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 12. INTEGRATIONS */}
      {sidebarTab === "integrations" && (
        <motion.div
          key="integrations-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community Integrations Hub</h1>
            <p className="text-zinc-500 text-sm mt-1">Connect Discord bots, Telegram groups, and stream broadcast tools directly to the core dashboard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Discord Guild Guilds", status: "Connected", desc: "Lobby allocations & brackets sync." },
              { name: "Telegram Groups Feed", status: "Connected", desc: "Community broadcast triggers." },
              { name: "OBS Stream Live HUD", status: "Disconnected", desc: "Live match bracket overlay overlay." }
            ].map((integ, idx) => (
              <div key={idx} className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xs text-zinc-200">{integ.name}</span>
                  <span className="text-[10px] text-zinc-500 leading-relaxed mt-1">{integ.desc}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${integ.status === "Connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"}`}>{integ.status}</span>
                  <button
                    onClick={() => addToast(`🔌 Configured sync parameters for ${integ.name}`)}
                    className="text-[10px] text-[#7C3AED] hover:underline font-bold bg-transparent border-0 cursor-pointer"
                  >
                    Modify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 13. ADMINISTRATIVE SETTINGS */}
      {sidebarTab === "settings" && (
        <motion.div
          key="settings-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Administrative Configuration Panel</h1>
            <p className="text-zinc-500 text-sm mt-1">Configure spam safety, match auto-scoring, referee bot prefixes, and parameters.</p>
          </div>
          
          <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-6 flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-4">
              <h3 className="text-sm font-bold text-zinc-300">UserProfile Identity</h3>
              <p className="text-xs text-zinc-500 mt-1">Identity variables synchronized from your Supabase profiles table.</p>
              <div className="grid grid-cols-2 gap-4 mt-4 select-text">
                <div className="bg-[#050505] p-3 rounded-xl border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 block uppercase">Administrator Name</span>
                  <span className="text-xs text-zinc-200 font-bold mt-1 block">{userProfile?.name || "Admin Owner"}</span>
                </div>
                <div className="bg-[#050505] p-3 rounded-xl border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 block uppercase">Organization</span>
                  <span className="text-xs text-zinc-200 font-bold mt-1 block">{userProfile?.organization_name || "NexusOps Hub"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-zinc-300">Console Switches</h3>
              {[
                { label: "Spam Toxicity Threshold", desc: "Mute users if toxicity coefficient exceeds 0.7.", status: true },
                { label: "Auto bracket advancement", desc: "Move winning squads immediately upon match report receipt.", status: true },
                { label: "Overlay Sponsor Sync", desc: "Auto display sponsor cards on matches streamed online.", status: false }
              ].map((sett, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-900/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-zinc-200">{sett.label}</span>
                    <span className="text-[10px] text-zinc-500">{sett.desc}</span>
                  </div>
                  <button
                    onClick={() => addToast(`⚙️ Config status updated successfully!`)}
                    className={`text-[9px] font-bold px-3 py-1 rounded-lg uppercase ${sett.status ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"}`}
                  >
                    {sett.status ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
