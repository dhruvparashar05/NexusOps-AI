"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, RefreshCw, Send, ChevronRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function AiCopilotPage() {
  const {
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isAiTyping,
    chatBottomRef,
    handleSendMessage,
    triggerPresetPrompt,
    addToast
  } = useDashboard();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    handleSendMessage(undefined, chatInput);
  };

  return (
    <motion.div
      key="copilot-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col gap-6 h-full min-h-0"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#7C3AED]" /> AI Copilot Workspace
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Chat, query data, schedule events, and moderate your community with native NLP commands.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left 8 cols: Big Chat Panel */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 gap-4 h-[60vh] min-h-0">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <span className="text-xs font-semibold text-zinc-400">SESSION: ACTIVE DIRECT SYNC</span>
            <button
              onClick={() => {
                setChatMessages([
                  {
                    id: "init",
                    sender: "ai",
                    text: "Hi Admin! 👋\nHow can I assist with your community today?",
                    timestamp: "10:30 AM"
                  }
                ]);
                addToast("🤖 Copilot session reset successfully.");
              }}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Chat
            </button>
          </div>

          {/* Immersive Scrollable Chat Feed */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-2 custom-scrollbar bg-[#050505]/40 rounded-xl border border-zinc-900/60 p-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-[75%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-[#7C3AED] text-white rounded-tr-none font-medium"
                      : "bg-[#0b0b0c] border border-zinc-800 text-zinc-300 rounded-tl-none shadow-md"
                  }`}
                >
                  {msg.text}

                  {msg.isSchedule && (
                    <div className="mt-2.5 p-2.5 bg-[#050505] rounded-xl border border-zinc-800 font-mono text-[9px] text-zinc-400 flex flex-col gap-1.5 leading-normal">
                      <div className="font-semibold text-zinc-200 text-[10px] border-b border-zinc-800 pb-1 flex justify-between">
                        <span>⚙️ GENERATED BRACKETS</span>
                        <span className="text-emerald-400">SUCCESS</span>
                      </div>
                      <div>Round 1 (08:00 PM): Match-01 (M1 vs M2)</div>
                      <div>Round 1 (08:20 PM): Match-02 (M3 vs M4)</div>
                      <div>Semis (09:00 PM): Winner M1 vs Winner M2</div>
                      <div>Finals (09:40 PM): Championship match</div>
                    </div>
                  )}

                  {msg.isModerator && (
                    <div className="mt-2.5 p-2.5 bg-[#050505] rounded-xl border border-zinc-800 text-[9px] text-zinc-400 flex flex-col gap-1 leading-normal">
                      <div className="text-emerald-400 font-bold border-b border-zinc-800 pb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SCAN COMPLETE
                      </div>
                      <div>Servers Audited: Discord, Telegram</div>
                      <div>Spam Filter Efficiency: <strong className="text-zinc-200">100%</strong></div>
                      <div>Violating word flags: <strong className="text-zinc-200">0 detected</strong></div>
                    </div>
                  )}

                  {msg.isRuleCheck && (
                    <div className="mt-2.5 p-2.5 bg-[#050505] rounded-xl border border-zinc-800 text-[9px] text-zinc-400 flex flex-col gap-1 leading-normal">
                      <div className="text-amber-500 font-bold border-b border-zinc-800 pb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> DOCS VERIFIED
                      </div>
                      <div>File: VAL_COMMUNITY_RULEBOOK_V4.pdf</div>
                      <div>OT Rules: SUDDEN DEATH (MR3)</div>
                      <div>Substitutes Limit: 2 Max per squad</div>
                    </div>
                  )}

                  {msg.isReport && (
                    <div className="mt-2.5 p-2.5 bg-[#050505] rounded-xl border border-zinc-800 text-[9px] text-zinc-400 flex flex-col gap-1.5 leading-normal">
                      <div className="text-indigo-400 font-bold border-b border-zinc-800 pb-1 flex justify-between">
                        <span>📊 PEAK METRICS</span>
                        <span>WEEKLY</span>
                      </div>
                      <div>Active Engagement: <strong className="text-emerald-400">+24.5%</strong></div>
                      <div>Sentiment Score: <strong className="text-zinc-200">98% Positive</strong></div>
                    </div>
                  )}
                </div>
                <span className="text-[8px] text-zinc-600 font-semibold px-1.5">{msg.timestamp}</span>
              </div>
            ))}
            {isAiTyping && (
              <div className="self-start flex flex-col gap-1 max-w-[80%]">
                <div className="bg-[#0b0b0c] border border-zinc-800 text-zinc-500 px-3 py-2 rounded-xl rounded-tl-none text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce shrink-0" />
                  <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce delay-100 shrink-0" />
                  <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce delay-200 shrink-0" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleFormSubmit} className="flex gap-2 border-t border-zinc-900/60 pt-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Copilot to search, switch tabs, create event or post announcements..."
              className="bg-[#050505] border border-zinc-900 focus:border-[#7C3AED]/40 rounded-xl px-4 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none flex-1 focus:ring-1 focus:ring-[#7C3AED]/20 transition-all font-sans"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/10 active:scale-95 transition-all cursor-pointer font-semibold text-xs gap-1.5 border-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Command</span>
            </button>
          </form>
        </div>

        {/* Right 4 cols: Command Reference Quickcards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#0b0b0c] border border-zinc-900 rounded-2xl p-5 flex flex-col gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quick Commands Reference</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed">NEXUSOPS Copilot listens to specific keyword structures to execute actions on the dashboard:</p>

            <div className="flex flex-col gap-2.5 mt-2">
              {[
                { text: 'Search events', cmd: 'search Valorant', desc: 'Filters active event dashboard card views.' },
                { text: 'Create event', cmd: 'create event BGMI Pro with 32 teams', desc: 'Dynamically schedules and logs a new tournament.' },
                { text: 'Cancel event', cmd: 'cancel BGMI Campus Clash', desc: 'Deletes and cleans event schedules.' },
                { text: 'Switch screen', cmd: 'go to analytics', desc: 'Navigates user interface to targeted view.' },
                { text: 'Post Announcement', cmd: 'post announcement: Registration is open!', desc: 'Publishes announcements to communities.' }
              ].map((qcmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatInput(qcmd.cmd);
                    addToast("📋 Command loaded into input box");
                  }}
                  className="bg-[#050505] border border-zinc-900 p-2.5 rounded-xl text-left hover:border-zinc-800 transition-colors flex flex-col gap-1 active:scale-[0.98] cursor-pointer w-full"
                >
                  <span className="text-[10px] font-bold text-zinc-200 flex justify-between w-full">
                    <span>{qcmd.text}</span>
                    <span className="text-[#7C3AED] font-mono text-[8px] bg-[#7C3AED]/10 px-1 rounded">Preset</span>
                  </span>
                  <code className="text-[9px] text-[#7C3AED] font-mono select-all bg-black/40 px-1 py-0.5 rounded">{qcmd.cmd}</code>
                  <span className="text-[9px] text-zinc-500">{qcmd.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
