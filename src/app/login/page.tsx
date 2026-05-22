"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type StatusMessage = {
  type: "success" | "error";
  text: string;
} | null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<StatusMessage>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/campaigns");
      }
    };

    checkSession();
  }, [router]);
const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);
  setStatus(null);

  const normalizedEmail = email.trim().toLowerCase();

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  setLoading(false);

  if (error) {
    setStatus({ type: "error", text: error.message });
    return;
  }

  router.push("/campaigns");
};

const handleSignUp = async () => {
  setLoading(true);
  setStatus(null);

  const normalizedEmail = email.trim().toLowerCase();

  const { error, data } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  setLoading(false);

  if (error) {
    setStatus({ type: "error", text: error.message });
    return;
  }

  if (data?.user && !data.session) {
    setStatus({
      type: "success",
      text: "Account created. Now try signing in.",
    });
    return;
  }

  setStatus({
    type: "success",
    text: "Signed up successfully. Redirecting to your dashboard...",
  });

  router.push("/campaigns");
};
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Secure access
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Login to LeadFlow Studio
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Access your campaigns and results with Supabase authentication. If you are new, sign up below to get started.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_0.65fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/20">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Account login</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Sign in or create a new account</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Use your email and password to unlock campaign access, protected routes, and your saved results.
                </p>
              </div>

              {status ? (
                <div
                  className={`rounded-3xl border px-5 py-4 text-sm ${
                    status.type === "success"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                      : "border-rose-400/20 bg-rose-400/10 text-rose-100"
                  }`}
                >
                  {status.text}
                </div>
              ) : null}

              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Email</span>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                      required
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Password</span>
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                      required
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={loading}
                    className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Please wait..." : "Sign Up"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
            <div className="rounded-[1.75rem] bg-slate-950/70 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Why login?</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Secure access to your campaigns</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                A Supabase-backed login gives you a secure session to manage campaigns, view results, and keep your SaaS workflow private.
              </p>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
              <div>
                <p className="text-sm font-semibold text-white">Protected routes</p>
                <p className="mt-2 text-sm text-slate-400">/campaigns, /campaigns/new, and campaign results are only available after login.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Email + password</p>
                <p className="mt-2 text-sm text-slate-400">Sign in with credentials or create a new account instantly.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
