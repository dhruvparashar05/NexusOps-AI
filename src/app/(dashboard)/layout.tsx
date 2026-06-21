"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Calendar, Trophy, BarChart3, Search, Bell, Plus,
  ChevronDown, Sparkles, Share2, Settings, Bot, Video, BookOpen, ShieldAlert,
  Shield, Award, Volume2, LogOut, CalendarDays, CheckCircle2, Trash2, X, Send, ChevronRight
} from "lucide-react";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const {
    isMounted,
    userProfile,
    logout,
    toasts,
    addToast,
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    sidebarTab,
    setSidebarTab,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isTeamsModalOpen,
    setIsTeamsModalOpen,
    selectedEventForTeams,
    setSelectedEventForTeams,
    newTeamName,
    setNewTeamName,
    newTeamNumber,
    setNewTeamNumber,
    eventTeams,
    handleAddTeam,
    handleDeleteTeam,
    newEventTitle,
    setNewEventTitle,
    newEventGame,
    setNewEventGame,
    newEventDate,
    setNewEventDate,
    newEventTime,
    setNewEventTime,
    newEventTeams,
    setNewEventTeams,
    newEventFormat,
    setNewEventFormat,
    handleCreateEvent,
    chatMessages,
    chatInput,
    setChatInput,
    isAiTyping,
    chatBottomRef,
    handleSendMessage,
    triggerPresetPrompt
  } = useDashboard();

  const [pointsTableExpanded, setPointsTableExpanded] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "New Team Registration", text: "Team Hydra registered for BGMI Campus Clash", time: "2 min ago", unread: true },
    { id: "n2", title: "Announcements Update", text: "Valorant Arena Cup starts tomorrow!", time: "15 min ago", unread: true },
    { id: "n3", title: "Referees Assigned", text: "Match lobby setup complete by AI Copilot", time: "1 hour ago", unread: true }
  ]);
  const [selectedGameForPoints, setSelectedGameForPoints] = useState("valorant");

  const pointsTableData: Record<string, { rank: number; name: string; played: number; points: number }[]> = {
    valorant: [
      { rank: 1, name: "Sentinels", played: 3, points: 90 },
      { rank: 2, name: "Fnatic", played: 3, points: 75 },
      { rank: 3, name: "Paper Rex", played: 3, points: 60 },
      { rank: 4, name: "Team Heretics", played: 3, points: 45 },
    ],
    bgmi: [
      { rank: 1, name: "Team Soul", played: 5, points: 120 },
      { rank: 2, name: "GodLike Esports", played: 5, points: 95 },
      { rank: 3, name: "Global Esports", played: 5, points: 80 },
      { rank: 4, name: "Reckoning", played: 5, points: 55 },
    ],
    clash: [
      { rank: 1, name: "Indian Clashers", played: 2, points: 50 },
      { rank: 2, name: "Alpha Stars", played: 2, points: 40 },
      { rank: 3, name: "Delta Squad", played: 2, points: 30 },
      { rank: 4, name: "Vanguard", played: 2, points: 15 },
    ],
    freefire: [
      { rank: 1, name: "Total Gaming", played: 4, points: 110 },
      { rank: 2, name: "Orangutan Elite", played: 4, points: 85 },
      { rank: 3, name: "God Nation", played: 4, points: 70 },
      { rank: 4, name: "Nigma Galaxy", played: 4, points: 50 },
    ]
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, Math.min(2, name.length)).toUpperCase();
  };

  const getActiveTab = () => {
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/communities")) return "communities";
    if (pathname.startsWith("/events")) return "participants";
    if (pathname.startsWith("/tournaments")) return "tournaments";
    if (pathname.startsWith("/analytics")) return "analytics";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  if (!isMounted) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl border-2 border-purple-500/10 border-t-purple-500 animate-spin" />
          <span className="text-xs">Mounting NEXUSOPS Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-[#f4f4f5] flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* Global Dashboard Toasts container */}
      <div className="fixed top-20 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f11] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg shadow-xl shadow-black/80 flex items-center gap-2 pointer-events-auto font-medium text-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* -------------------- TOP NAVBAR -------------------- */}
      <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-md border-b border-zinc-900 px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg viewBox="0 0 100 100" className="w-4 h-4 text-white fill-current">
              <path d="M50 15 L85 35 L85 75 L50 90 L15 75 L15 35 Z M50 30 L30 42 L30 68 L50 78 L70 68 L70 42 Z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            NEXUSOPS
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#09090b]/80 border border-zinc-900/60 p-0.5 rounded-xl">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
            { id: "communities", label: "Communities", icon: Users, route: "/communities" },
            { id: "participants", label: "Participants", icon: Users, route: "/events" },
            { id: "tournaments", label: "Tournaments", icon: Trophy, route: "/tournaments" },
            { id: "analytics", label: "Analytics", icon: BarChart3, route: "/analytics" }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.route);
                  if (item.id === "dashboard") {
                    setSidebarTab("overview");
                  }
                }}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                    ? "text-[#7C3AED] shadow-sm shadow-[#7C3AED]/5"
                    : "text-zinc-400 hover:text-zinc-200"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side: Search, Notifications, User Profile Dropdown */}
        <div className="flex items-center gap-4">
          
          {/* Search bar */}
          <div className="relative hidden md:block">
            <Search className={`absolute left-3 top-2.5 w-4 h-4 transition-colors ${isSearchFocused ? "text-[#7C3AED]" : "text-zinc-500"}`} />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#09090b] border border-zinc-900 rounded-xl pl-9 pr-10 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#7C3AED]/30 w-52 transition-all duration-300"
            />
            <kbd className="absolute right-3 top-2.5 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[8px] text-zinc-500 select-none pointer-events-none">
              ⌘ K
            </kbd>
          </div>

          {/* Notification Icon & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`w-10 h-10 rounded-xl bg-[#09090b] border flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
                notificationsOpen ? "border-[#7C3AED]/60 text-[#7C3AED]" : "border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
              }`}
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[9px] flex items-center justify-center font-bold">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-4 shadow-2xl z-45 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                      <span className="text-xs font-bold text-zinc-200">Notifications</span>
                      {notifications.some(n => n.unread) && (
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                            addToast("✅ Marked all notifications as read");
                          }}
                          className="text-[10px] text-[#7C3AED] hover:underline bg-transparent border-0 cursor-pointer font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-xs text-zinc-500 italic py-4 text-center">
                          No notifications.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-left ${
                              notif.unread
                                ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                                : "bg-transparent border-transparent hover:bg-zinc-900/10"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-xs font-semibold ${notif.unread ? "text-zinc-100" : "text-zinc-400"}`}>
                                {notif.title}
                              </span>
                              {notif.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal">
                              {notif.text}
                            </p>
                            <span className="text-[9px] text-zinc-600 font-medium self-end">
                              {notif.time}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Create Event CTA */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>



        </div>

      </header>

      {/* -------------------- MAIN SPLIT BODY -------------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* -------------------- LEFT SIDEBAR -------------------- */}
        <aside className="w-64 border-r border-zinc-900 flex flex-col justify-between shrink-0 bg-[#050505] p-4 hidden md:flex overflow-hidden">
          
          <div className="flex flex-col gap-6">
            
            {/* Group 1: General */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                Navigation
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { id: "overview", label: "Overview", icon: LayoutDashboard },
                  { id: "announcements", label: "Announcements", icon: Volume2 }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === "/dashboard" && sidebarTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push("/dashboard");
                        setSidebarTab(item.id);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between ${isActive
                          ? "bg-zinc-900/60 text-[#7C3AED] border-l-2 border-[#7C3AED]"
                          : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-zinc-500"}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 2: AI Tools */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                AI Tools
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { id: "copilot", label: "AI Copilot", icon: Bot, badge: "New", route: "/ai-copilot" },
                  { id: "meeting", label: "Meeting Assistant", icon: Video, route: "/dashboard" },
                  { id: "knowledge", label: "Knowledge Base", icon: BookOpen, route: "/dashboard" },
                  { id: "search", label: "Smart Search", icon: Search, route: "/dashboard" },
                  { id: "dispute", label: "Dispute Assistant", icon: ShieldAlert, route: "/dashboard" },
                  { id: "points-table", label: "Points Table", icon: Trophy, route: "/dashboard" },
                  { id: "sponsor", label: "Sponsor Assistant", icon: Award, route: "/dashboard" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = item.route === "/ai-copilot"
                    ? pathname === "/ai-copilot"
                    : pathname === "/dashboard" && sidebarTab === item.id;

                  if (item.id === "points-table") {
                    return (
                      <div key={item.id} className="flex flex-col gap-1 w-full">
                        <button
                          onClick={() => {
                            router.push(item.route);
                            setSidebarTab(item.id);
                            setPointsTableExpanded(!pointsTableExpanded);
                            addToast(pointsTableExpanded ? "📁 Collapsed Points Table" : "🏆 Expanded Points Table");
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${isActive
                              ? "bg-zinc-900/60 text-[#7C3AED] border-l-2 border-[#7C3AED]"
                              : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-zinc-500"}`} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${pointsTableExpanded ? "rotate-180 text-[#7C3AED]" : ""}`} />
                        </button>

                        <AnimatePresence initial={false}>
                          {pointsTableExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden bg-zinc-950/65 border border-zinc-900/60 rounded-xl p-2.5 mt-0.5 flex flex-col gap-2.5"
                            >
                              {/* Game Selector Tab Select */}
                              <div className="flex bg-[#050505] p-0.5 rounded-lg border border-zinc-900/50">
                                {[
                                  { code: "valorant", label: "VAL" },
                                  { code: "bgmi", label: "BGMI" },
                                  { code: "clash", label: "COC" },
                                  { code: "freefire", label: "FF" }
                                ].map((game) => (
                                  <button
                                    key={game.code}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedGameForPoints(game.code);
                                    }}
                                    className={`flex-1 text-[9px] py-1 font-bold rounded-md transition-all cursor-pointer ${
                                      selectedGameForPoints === game.code
                                        ? "bg-zinc-900 text-[#7C3AED] shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    {game.label}
                                  </button>
                                ))}
                              </div>

                              {/* Points Table List */}
                              <div className="flex flex-col gap-1.5 select-text">
                                <div className="grid grid-cols-12 text-[8px] font-bold text-zinc-600 uppercase px-1 pb-1 border-b border-zinc-900/60">
                                  <span className="col-span-2">Pos</span>
                                  <span className="col-span-7">Team</span>
                                  <span className="col-span-3 text-right">Pts</span>
                                </div>
                                {pointsTableData[selectedGameForPoints]?.map((team) => {
                                  // Highlight styles for top 3
                                  let rowStyle = "text-zinc-400 hover:text-zinc-200";
                                  let rankStyle = "bg-zinc-900 text-zinc-500";
                                  let teamStyle = "font-medium";
                                  
                                  if (team.rank === 1) {
                                    rowStyle = "bg-yellow-500/5 text-yellow-400/90 border border-yellow-500/10 rounded-lg";
                                    rankStyle = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/25";
                                    teamStyle = "font-bold text-yellow-300";
                                  } else if (team.rank === 2) {
                                    rowStyle = "bg-zinc-100/5 text-zinc-300 border border-zinc-800 rounded-lg";
                                    rankStyle = "bg-zinc-800 text-zinc-300 border border-zinc-700/50";
                                    teamStyle = "font-semibold text-zinc-200";
                                  } else if (team.rank === 3) {
                                    rowStyle = "bg-amber-600/5 text-amber-500 border border-amber-600/10 rounded-lg";
                                    rankStyle = "bg-amber-700/10 text-amber-500 border border-amber-600/20";
                                    teamStyle = "font-semibold text-amber-400";
                                  }

                                  return (
                                    <div
                                      key={team.rank}
                                      className={`grid grid-cols-12 items-center text-[10px] py-1 px-1.5 transition-all ${rowStyle}`}
                                    >
                                      <span className="col-span-2 flex">
                                        <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-bold ${rankStyle}`}>
                                          {team.rank}
                                        </span>
                                      </span>
                                      <span className={`col-span-7 truncate pr-1 ${teamStyle}`}>
                                        {team.name}
                                      </span>
                                      <span className={`col-span-3 text-right font-mono ${team.rank <= 3 ? "font-bold" : ""}`}>
                                        {team.points}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push(item.route);
                        setSidebarTab(item.id);
                        if (item.id === "copilot") {
                          addToast("🤖 AI Copilot Workspace loaded.");
                        } else {
                          addToast(`🤖 Loaded simulated AI module: ${item.label}`);
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${isActive
                          ? "bg-zinc-900/60 text-[#7C3AED] border-l-2 border-[#7C3AED]"
                          : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-zinc-500"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-[#7C3AED]/20 text-[#7C3AED] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90 border border-[#7C3AED]/30 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 3: Configuration */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                Configuration
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { id: "integrations", label: "Integrations", icon: Share2 },
                  { id: "settings", label: "Settings", icon: Settings }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === "/dashboard" && sidebarTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push("/dashboard");
                        setSidebarTab(item.id);
                        addToast(`⚙️ Config module loaded: ${item.label}`);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2.5 ${isActive
                          ? "bg-zinc-900/60 text-[#7C3AED] border-l-2 border-[#7C3AED]"
                          : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#7C3AED]" : "text-zinc-500"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar Footer: User Widget */}
          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-black">
                <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-800">
                  {getInitials(userProfile?.name || "Admin")}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 max-w-[110px] truncate">{userProfile?.name || "Admin"}</span>
                <span className="text-[10px] text-zinc-500 max-w-[110px] truncate">{userProfile?.organization_name || "NexusOps Hub"}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-zinc-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </aside>

        {/* -------------------- SCROLLABLE CONTENT CANVAS -------------------- */}
        <main className="flex-1 overflow-y-auto bg-[#050505] p-6 lg:p-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>

      </div>

      {/* -------------------- CREATE EVENT DIALOG MODAL -------------------- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card Content Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0b0b0c] border border-zinc-900/90 rounded-2xl w-full max-w-lg shadow-2xl shadow-black overflow-hidden relative p-6 flex flex-col gap-6"
            >
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#7C3AED]" />
                  <h2 className="text-base font-bold tracking-tight">Create Gaming Event</h2>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tournament Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Legends Showdown"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="bg-[#050505] border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Game Title</label>
                    <select
                      value={newEventGame}
                      onChange={(e) => setNewEventGame(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED] transition-all cursor-pointer"
                    >
                      <option>Valorant</option>
                      <option>BGMI</option>
                      <option>Clash of Clans</option>
                      <option>Free Fire</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bracket Format</label>
                    <select
                      value={newEventFormat}
                      onChange={(e) => setNewEventFormat(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED] transition-all cursor-pointer"
                    >
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Squad Mode</option>
                      <option>5v5 Match</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Launch Date</label>
                    <input
                      type="date"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Start Time</label>
                    <input
                      type="time"
                      required
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Seeded Teams</label>
                    <select
                      value={newEventTeams}
                      onChange={(e) => setNewEventTeams(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED] transition-all cursor-pointer"
                    >
                      <option>16</option>
                      <option>32</option>
                      <option>64</option>
                      <option>128</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    Initialize Bracket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- VIEW TEAMS DIALOG MODAL -------------------- */}
      <AnimatePresence>
        {isTeamsModalOpen && selectedEventForTeams && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsTeamsModalOpen(false);
                setSelectedEventForTeams(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card Content Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0b0b0c] border border-zinc-900/90 rounded-2xl w-full max-w-lg shadow-2xl shadow-black overflow-hidden relative p-6 flex flex-col gap-5"
            >
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-[#7C3AED]" />
                  <div className="flex flex-col">
                    <h2 className="text-sm font-bold tracking-tight text-zinc-100">
                      {selectedEventForTeams.title}
                    </h2>
                    <span className="text-[10px] text-zinc-500">
                      {selectedEventForTeams.format} • Registered Teams
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsTeamsModalOpen(false);
                    setSelectedEventForTeams(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Teams List */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Registered Teams ({(eventTeams[selectedEventForTeams.id] || []).length})
                </div>

                {(eventTeams[selectedEventForTeams.id] || []).length === 0 ? (
                  <div className="text-xs text-zinc-500 italic py-4 text-center bg-[#050505] rounded-xl border border-zinc-900">
                    No teams registered yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {(eventTeams[selectedEventForTeams.id] || []).map((team) => (
                      <div
                        key={team.id}
                        className="bg-[#050505] border border-zinc-900 rounded-xl px-3 py-2 flex items-center justify-between hover:border-zinc-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-md bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[10px] font-bold text-[#7C3AED]">
                            #{team.number}
                          </div>
                          <span className="text-xs font-semibold text-zinc-200">
                            {team.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="p-1 rounded-lg bg-zinc-900/50 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 text-zinc-500 hover:text-red-400 transition-all active:scale-90"
                          title="Remove Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Team Form */}
              <div className="border-t border-zinc-900 pt-4 flex flex-col gap-3">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Register Remaining Team
                </div>

                <form onSubmit={handleAddTeam} className="flex gap-2.5 items-end">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-semibold text-zinc-500 uppercase">Team Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Team Liquid"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all w-full"
                    />
                  </div>

                  <div className="w-28 flex flex-col gap-1.5">
                    <label className="text-[9px] font-semibold text-zinc-500 uppercase">Team #</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5"
                      value={newTeamNumber}
                      onChange={(e) => setNewTeamNumber(e.target.value)}
                      className="bg-[#050505] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-[38px] px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end pt-2 border-t border-zinc-900 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTeamsModalOpen(false);
                    setSelectedEventForTeams(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </DashboardProvider>
  );
}
