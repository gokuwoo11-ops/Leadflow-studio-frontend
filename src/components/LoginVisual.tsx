
"use client";

import { motion } from "framer-motion";

export default function LoginVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-[560px] overflow-hidden rounded-[2.5rem] border border-cyan-300/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_48%)]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />
        <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </div>

      <svg
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-70"
        viewBox="0 0 520 520"
        fill="none"
      >
        <motion.path
          d="M260 110 L260 165"
          stroke="rgba(34,211,238,0.55)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M260 165 L260 290"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
        />
        <motion.path
          d="M260 195 L205 245"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        />
        <motion.path
          d="M260 195 L315 245"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        />
        <motion.path
          d="M260 290 L225 395"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d="M260 290 L295 395"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        />

        <motion.path
          d="M205 245 L150 200"
          stroke="rgba(34,211,238,0.28)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        />
        <motion.path
          d="M315 245 L375 205"
          stroke="rgba(34,211,238,0.28)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        />
        <motion.path
          d="M260 165 L180 130"
          stroke="rgba(34,211,238,0.25)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
        />
        <motion.path
          d="M260 165 L340 130"
          stroke="rgba(34,211,238,0.25)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        <motion.path
          d="M225 395 L180 445"
          stroke="rgba(34,211,238,0.2)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        />
        <motion.path
          d="M295 395 L340 445"
          stroke="rgba(34,211,238,0.2)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
        />

        <motion.circle
          cx="260"
          cy="92"
          r="20"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(34,211,238,0.7)"
          strokeWidth="2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </svg>

      <div className="absolute left-[28%] top-[34%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.85)] animate-pulse" />
      <div className="absolute right-[26%] top-[35%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.85)] animate-pulse" />
      <div className="absolute left-[35%] top-[22%] h-2.5 w-2.5 rounded-full bg-sky-200 shadow-[0_0_20px_rgba(125,211,252,0.8)] animate-pulse" />
      <div className="absolute right-[35%] top-[22%] h-2.5 w-2.5 rounded-full bg-sky-200 shadow-[0_0_20px_rgba(125,211,252,0.8)] animate-pulse" />
      <div className="absolute left-[35%] bottom-[18%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" />
      <div className="absolute right-[35%] bottom-[18%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" />

      <div className="absolute inset-x-16 top-0 h-32 bg-gradient-to-b from-cyan-300/10 to-transparent animate-scan-move" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7 }}
        className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl"
      >
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          Secure access
        </p>
        <h3 className="mt-3 text-2xl font-black text-white">
          Enter your prospecting workspace
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Sign in to manage campaigns, generate outreach, review PDF audits,
          and control your lead pipeline from one AI command center.
        </p>
      </motion.div>
    </motion.div>
  );
}