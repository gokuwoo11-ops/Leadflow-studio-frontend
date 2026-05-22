"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import LoginVisual from "@/components/LoginVisual";

type StatusState =
  | { type: "success"; text: string }
  | { type: "error"; text: string }
  | null;

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);
async function handleGoogleSignIn() {
  setLoading(true);
  setStatus({
    type: "success",
    text: "Opening Google sign in...",
  });

  const origin = window.location.origin;

  const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${origin}/campaigns`,
    queryParams: {
      prompt: "select_account",
    },
  },
});
  if (error) {
    setLoading(false);
    setStatus({ type: "error", text: error.message });
  }
}
  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setStatus({
      type: "success",
      text: "Signing in... opening your dashboard.",
    });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setStatus({ type: "error", text: error.message });
      return;
    }

    router.replace("/campaigns");
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setStatus({
      type: "success",
      text: "Creating account...",
    });

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setStatus({ type: "error", text: error.message });
      return;
    }

    setLoading(false);
    setStatus({
      type: "success",
      text: "Account created! Check your email to confirm your address.",
    });
  };
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-[8rem] h-[32rem] w-[32rem] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <div className="mb-8 flex items-center justify-between">
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

            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-black text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              Back Home
            </Link>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Secure access
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Access your AI prospecting workspace.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Sign in to create campaigns, generate leads, review PDF audit
            reports, and manage outreach from one place.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-slate-950/70 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setStatus(null);
              }}
              className={`rounded-full px-5 py-2 text-sm font-black transition ${
                mode === "signin"
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setStatus(null);
              }}
              className={`rounded-full px-5 py-2 text-sm font-black transition ${
                mode === "signup"
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>
          <div className="mt-8">
  <button
    type="button"
    onClick={handleGoogleSignIn}
    disabled={loading}
    className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs font-black">
      G
    </span>
    Continue with Google
  </button>

  <div className="my-6 flex items-center gap-3">
    <div className="h-px flex-1 bg-white/10" />
    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
      or
    </span>
    <div className="h-px flex-1 bg-white/10" />
  </div>
</div>

          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="mt-8 space-y-5">
            <Field label="Email address">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
              />
            </Field>

            {status ? (
              <div
                className={`rounded-2xl border p-4 text-sm ${
                  status.type === "success"
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                    : "border-rose-300/20 bg-rose-300/10 text-rose-100"
                }`}
              >
                {status.text}
              </div>
            ) : null}

            {mode === "signin" ? (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-300/20 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Opening dashboard..." : "Sign In →"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-300/20 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            )}
          </form>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm font-black text-white">Inside your workspace</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniCard title="Campaigns" text="Launch targeted prospecting campaigns." />
              <MiniCard title="Reports" text="Generate AI audit PDFs instantly." />
              <MiniCard title="Outreach" text="Copy personalized sales messages." />
            </div>
          </div>
        </section>

        <div className="hidden lg:block">
          <LoginVisual />
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}

function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-400">{text}</p>
    </div>
  );
}