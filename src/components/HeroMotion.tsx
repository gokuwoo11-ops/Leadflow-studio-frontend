"use client";

import { motion } from "framer-motion";

export default function HeroMotion() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative min-h-[540px] overflow-hidden rounded-[2.5rem] border border-cyan-300/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_46%)]" />

      <div className="absolute inset-0 opacity-25">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 animate-orbit-slow">
        <Node className="left-1/2 top-0 -translate-x-1/2" />
        <Node className="right-8 top-24" />
        <Node className="bottom-16 right-14" />
        <Node className="bottom-8 left-20" />
        <Node className="left-8 top-28" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[315px] w-[315px] -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse">
        <SmallNode className="right-0 top-1/2 -translate-y-1/2" />
        <SmallNode className="bottom-8 left-12" />
        <SmallNode className="left-5 top-12" />
      </div>

      <svg
        className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 opacity-60"
        viewBox="0 0 470 470"
        fill="none"
      >
        <motion.path
          d="M235 60 L360 150 L330 310 L235 395 L120 315 L100 150 Z"
          stroke="rgba(34,211,238,0.28)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M235 60 L235 395 M100 150 L360 150 M120 315 L330 310"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.25, ease: "easeInOut" }}
        />
        <motion.path
          d="M100 150 L235 235 L360 150 M120 315 L235 235 L330 310"
          stroke="rgba(14,165,233,0.24)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.4, delay: 0.45, ease: "easeInOut" }}
        />
      </svg>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 flex h-[185px] w-[185px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/35 bg-slate-950/95 shadow-[0_0_110px_rgba(34,211,238,0.28)] animate-pulse-glow"
      >
        <div className="absolute inset-5 rounded-full border border-white/10" />
        <div className="absolute inset-10 rounded-full border border-cyan-300/20" />

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">
            Neural
          </p>
          <p className="mt-2 text-4xl font-black tracking-[-0.08em] text-white">
            AI
          </p>
        </div>
      </motion.div>

      <div className="absolute left-1/2 top-1/2 h-[1px] w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[82%] w-[1px] -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent" />

      <div className="absolute inset-x-16 top-0 h-32 bg-gradient-to-b from-cyan-300/10 to-transparent animate-scan-move" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.7 }}
        className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl"
      >
        <div className="grid grid-cols-3 gap-3">
          <MiniMetric label="Signals" value="128" />
          <MiniMetric label="Reports" value="PDF" />
          <MiniMetric label="Outreach" value="AI" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Node({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.85)] ${className}`}
    />
  );
}

function SmallNode({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-2.5 w-2.5 rounded-full bg-sky-200 shadow-[0_0_22px_rgba(125,211,252,0.7)] ${className}`}
    />
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-cyan-200">{value}</p>
    </div>
  );
}