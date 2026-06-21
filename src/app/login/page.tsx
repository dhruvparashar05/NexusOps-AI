"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, Bot, Sparkles, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all credentials.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    if (isDemoMode) {
      const mockUser = {
        id: "demo-user-id",
        email: email.trim(),
        user_metadata: {
          name: email.trim().split("@")[0] || "Admin",
          organization_name: "NexusOps Hub"
        }
      };

      if (typeof window !== "undefined") {
        const signupName = localStorage.getItem("nexusops_demo_signup_name");
        const signupOrg = localStorage.getItem("nexusops_demo_signup_org");
        const signupEmail = localStorage.getItem("nexusops_demo_signup_email");
        if (signupEmail === email.trim() && signupName) {
          mockUser.user_metadata.name = signupName;
          if (signupOrg) mockUser.user_metadata.organization_name = signupOrg;
        }
      }

      document.cookie = `sb-demo-session=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=86400;`;
      
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Success, middleware will direct us or we redirect manually
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#f4f4f5] flex items-center justify-center font-sans select-none relative overflow-hidden">
      {/* Animated background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0b0b0c]/80 border border-zinc-900 rounded-3xl p-8 shadow-2xl shadow-black/80 max-w-sm w-full flex flex-col gap-6 backdrop-blur-md relative z-10 hover:border-zinc-800 transition-all duration-300"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
              <path d="M50 15 L85 35 L85 75 L50 90 L15 75 L15 35 Z M50 30 L30 42 L30 68 L50 78 L70 68 L70 42 Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase">
              NEXUSOPS LOGIN
            </h1>
            <p className="text-zinc-500 text-xs mt-1">Access your AI Operations control console</p>
          </div>
        </div>

        {isDemoMode && (
          <div className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-xl p-2.5 text-center font-medium leading-normal">
            ⚡ Offline Demo Mode Active. Enter any email and password to log in.
          </div>
        )}

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-400"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
                className="w-full bg-[#050505] border border-zinc-900 focus:border-[#7C3AED]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]/20 transition-all font-sans"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Password</label>
              <Link
                href="/login#"
                onClick={() => setErrorMsg("Please contact your administrator for password resets.")}
                className="text-[10px] text-[#7C3AED] hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050505] border border-zinc-900 focus:border-[#7C3AED]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]/20 transition-all font-sans"
                suppressHydrationWarning
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-purple-600 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/15 active:scale-[0.98] transition-all cursor-pointer font-sans"
            suppressHydrationWarning
          >
            {loading ? "Authenticating session..." : "Initialize Console"}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="border-t border-zinc-900 pt-4 text-center">
          <p className="text-zinc-500 text-xs">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#7C3AED] hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
