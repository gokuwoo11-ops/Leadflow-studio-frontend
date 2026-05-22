"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroMotion from "@/components/HeroMotion";

const workflow = [
  {
    label: "01",
    title: "Create campaign",
    text: "Define your target niche, location, offer, keyword, and outreach tone.",
  },
  {
    label: "02",
    title: "Generate intelligence",
    text: "The system finds leads, analyzes business gaps, scores opportunities, and prepares audit insights.",
  },
  {
    label: "03",
    title: "Launch outreach",
    text: "Copy personalized messages, open PDF audit reports, export CSV, and track lead status.",
  },
];

const features = [
  "AI lead scoring",
  "PDF audit reports",
  "Personalized outreach",
  "Campaign dashboard",
  "CSV export",
  "Lead status CRM",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-7 lg:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute right-[-16rem] top-[8rem] h-[32rem] w-[32rem] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute bottom-[-16rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
        </div>

        <nav className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-black text-cyan-200 shadow-lg shadow-cyan-950/30">
              LF
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                LeadFlow Studio
              </p>
              <p className="text-xs text-slate-400">AI Prospecting System</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <span>Campaigns</span>
            <span>Reports</span>
            <span>Outreach</span>
            <span>CRM</span>
          </div>

          <Link
            href="/login"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
          >
            Login
          </Link>
        </nav>

        <div className="relative z-10 grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-8 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              AI prospecting for agencies, freelancers, and local client acquisition
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              Turn cold leads into warm client opportunities.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              LeadFlow Studio finds local business leads, generates AI audit
              reports, writes personalized outreach, and helps you track every
              follow-up from one premium acquisition workspace.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/campaigns/new"
                className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-7 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-300/20 transition hover:-translate-y-1 hover:bg-cyan-200"
              >
                Start New Campaign →
              </Link>

              <Link
                href="/campaigns"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                View Dashboard
              </Link>
            </div>

            <div className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
              <MiniCard title="Find" text="Discover leads by niche and location." />
              <MiniCard title="Prove" text="Generate PDF audits and AI insights." />
              <MiniCard title="Close" text="Copy outreach and track follow-ups." />
            </div>
          </motion.div>

          <HeroMotion />
        </div>

        <section className="relative z-10 border-t border-white/10 py-14">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
              Connected workflow
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              A clean system from lead discovery to follow-up.
            </h2>
          </div>

          <div className="relative grid gap-5 md:grid-cols-3">
            <div className="pointer-events-none absolute left-0 top-1/2 hidden h-[1px] w-full -translate-y-1/2 bg-gradient-to-r from-cyan-300/0 via-cyan-300/35 to-cyan-300/0 md:block" />

            {workflow.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                className="relative rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-cyan-950/10"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-sm font-black text-cyan-200">
                  {item.label}
                </div>
                <p className="text-xl font-black text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative z-10 border-t border-white/10 py-14">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
                Built for selling
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                Everything needed to turn a lead list into action.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 text-sm font-bold text-slate-200"
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
      <p className="text-lg font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}