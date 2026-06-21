"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  Video,
  Search,
  BarChart3,
  Shield,
  Megaphone,
  Clock,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Activity,
  Terminal
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  const features = [
    {
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      title: "AI Copilot",
      description: "Chat assistant that executes workspace shortcuts, schedule commands, and community workflows instantly."
    },
    {
      icon: <Calendar className="w-5 h-5 text-indigo-400" />,
      title: "Tournament Scheduler",
      description: "Auto-generate tournament brackets, match fixtures, and rule configuration templates via natural language."
    },
    {
      icon: <Video className="w-5 h-5 text-purple-400" />,
      title: "Meeting Assistant",
      description: "Record, transcribe, and extract actionable summaries and tasks from sync calls automatically."
    },
    {
      icon: <Search className="w-5 h-5 text-indigo-400" />,
      title: "Knowledge Base Search",
      description: "Index games documentation, rule books, and community guides for rapid, semantic search lookup."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
      title: "Community Analytics",
      description: "Track integrations health, player metrics, growth rates, and community activity indices."
    },
    {
      icon: <Shield className="w-5 h-5 text-indigo-400" />,
      title: "AI Moderator",
      description: "Keep chats clean with toxicity filters, discord webhook filters, and automated dispute resolution logs."
    },
    {
      icon: <Megaphone className="w-5 h-5 text-purple-400" />,
      title: "Announcement Generator",
      description: "Instantly draft community announcements, tweets, and discord updates using custom tone presets."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Sync Community",
      description: "Connect your Discord guild, game directory, or team database in one click."
    },
    {
      number: "02",
      title: "Define Actions",
      description: "Create tournaments, sync calendars, or trigger community activities using chat commands."
    },
    {
      number: "03",
      title: "Upload Knowledge Base",
      description: "Add game manuals, schedules, or briefs to train the operational AI model."
    },
    {
      number: "04",
      title: "Deploy Copilot Automation",
      description: "Your copilot automatically monitors events, drafts announcements, and moderates channels."
    }
  ];

  const benefits = [
    {
      title: "Save Organizer Time",
      description: "Automate up to 80% of repetitive tournament operations, moderation tasks, and support inquiries."
    },
    {
      title: "Centralized Operations",
      description: "Manage games, players, documents, statistics, and messaging tools inside a unified dark-theme interface."
    },
    {
      title: "Faster Event Execution",
      description: "Instantly generate matching brackets, update standings, and notify teams without manual delays."
    },
    {
      title: "Better Community Engagement",
      description: "Ensure your players are updated 24/7 with automated status notifications and AI-assisted responses."
    }
  ];

  return (
    <div className="bg-[#050505] text-[#f4f4f5] font-sans min-h-screen relative overflow-hidden select-none scroll-smooth">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 bg-[#050505]/60 border-b border-zinc-900/60 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg viewBox="0 0 100 100" className="w-4.5 h-4.5 text-white fill-current">
                <path d="M50 15 L85 35 L85 75 L50 90 L15 75 L15 35 Z M50 30 L30 42 L30 68 L50 78 L70 68 L70 42 Z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-widest uppercase bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              NEXUSOPS <span className="text-purple-500 font-extrabold font-sans">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-xs text-zinc-400 hover:text-white transition-colors">Workflow</Link>
            <Link href="#benefits" className="text-xs text-zinc-400 hover:text-white transition-colors">Benefits</Link>
            <Link href="#preview" className="text-xs text-zinc-400 hover:text-white transition-colors">Preview</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-purple-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/15 active:scale-[0.98] transition-all"
            >
              Go To Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-900 bg-[#050505] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors py-1"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors py-1"
                >
                  Workflow
                </Link>
                <Link
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors py-1"
                >
                  Benefits
                </Link>
                <Link
                  href="#preview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors py-1"
                >
                  Preview
                </Link>
                <div className="h-px bg-zinc-900 my-2" />
                <div className="flex flex-col gap-3">
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center border border-zinc-850 bg-zinc-900/30 text-zinc-300 text-xs font-semibold rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center bg-gradient-to-r from-purple-600 to-[#7C3AED] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    Go To Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full px-3.5 py-1.5 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>NEXUSOPS AI Operations Copilot</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight"
        >
          AI Operations Copilot for{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Gaming Communities
          </span>{" "}
          & Event Teams
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-6 leading-relaxed"
        >
          Streamline brackets, coordinate discord guilds, summarize team logs, and resolve user issues automatically. NexusOps is the decentralized terminal for community moderators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
        >
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-purple-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all duration-200"
          >
            Go To Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 text-zinc-300 hover:text-white text-xs font-bold rounded-xl transition-all duration-200"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-zinc-900 bg-[#070708]/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] text-purple-500 uppercase tracking-widest font-extrabold mb-2.5">Features</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Supercharge Your Operational Workflow</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3 max-w-lg">Everything you need to orchestrate events, moderate members, and query data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#0b0b0c]/60 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4 hover:border-purple-600/30 transition-all duration-300 hover:translate-y-[-2px] group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-purple-500/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{feature.title}</h3>
                  <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] text-purple-500 uppercase tracking-widest font-extrabold mb-2.5">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">How NexusOps Orchestrates Events</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3 max-w-lg">Four steps to absolute operations automation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-12 left-12 right-12 h-px bg-gradient-to-r from-purple-500/10 via-indigo-500/15 to-purple-500/10 -z-10" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#0b0b0c] border border-zinc-800 flex items-center justify-center text-purple-400 text-xs font-bold shadow-lg shadow-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
                  {step.number}
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-zinc-200">{step.title}</h3>
                  <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 border-t border-zinc-900 bg-[#070708]/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] text-purple-500 uppercase tracking-widest font-extrabold mb-2.5">Benefits</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Engineered For Team Coordinators</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3 max-w-lg">Free up time, scale operations, and deliver seamless tournament coordination.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#0b0b0c]/50 border border-zinc-900 rounded-2xl p-6 flex gap-4 hover:border-zinc-800 transition-all duration-300"
              >
                <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">{benefit.title}</h3>
                  <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="preview" className="py-24 border-t border-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] text-purple-500 uppercase tracking-widest font-extrabold mb-2.5">Interface Preview</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Built for High-Scale Operations</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3 max-w-lg">Get complete insight over integrated communities, active bracket states, and automation logs.</p>
          </div>

          {/* Browser frame mockup wrapping the dashboard screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#0b0b0c] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/5 relative"
          >
            {/* Window title bar */}
            <div className="bg-[#050505] border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/20" />
              </div>
              <div className="flex items-center gap-1.5 bg-[#0b0b0c] px-4 py-1.5 rounded-lg border border-zinc-900/60 text-[10px] text-zinc-500 font-medium tracking-wide">
                <Terminal className="w-3 h-3 text-purple-500" />
                <span>nexusops.ai/dashboard</span>
              </div>
              <div className="w-12" />
            </div>

            {/* Preview image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full bg-[#050505] flex items-center justify-center overflow-hidden">
              <img
                src="/dashboard-preview.png"
                alt="NexusOps Premium Dashboard Workspace Preview"
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 border-t border-zinc-900 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-tr from-[#0b0b0c] to-[#070708] border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl flex flex-col items-center gap-6"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-3xl blur-3xl pointer-events-none" />

            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-purple-400">
              <Zap className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Start Managing Communities Smarter</h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
                Connect your workspace channels, upload guidelines, and deploy AI coordinator agents in under five minutes.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-purple-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all"
            >
              Go To Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900/60 bg-[#050505] text-zinc-600 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 text-white fill-current">
                  <path d="M50 15 L85 35 L85 75 L50 90 L15 75 L15 35 Z M50 30 L30 42 L30 68 L50 78 L70 68 L70 42 Z" />
                </svg>
              </div>
              <span className="font-bold text-xs tracking-wider uppercase text-zinc-300">
                NEXUSOPS <span className="text-purple-500 font-extrabold font-sans">AI</span>
              </span>
            </Link>
            <p className="max-w-sm text-zinc-500 leading-relaxed text-[11px]">
              Next-generation AI operations copilot system for digital gaming networks, guilds, leagues, and event production managers.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Product</span>
            <Link href="#features" className="hover:text-zinc-300 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-zinc-300 transition-colors">Workflow</Link>
            <Link href="#preview" className="hover:text-zinc-300 transition-colors">Interface Preview</Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Contact & Support</span>
            <span className="text-zinc-500">operations@nexusops.ai</span>
            <span className="text-zinc-500">Guild HQ Terminal #201</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500">
          <span>&copy; {new Date().getFullYear()} NEXUSOPS AI. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-zinc-300 transition-colors">Console Access</Link>
            <Link href="/signup" className="hover:text-zinc-300 transition-colors">Register Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
