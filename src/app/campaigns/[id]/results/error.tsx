"use client";

import Link from "next/link";

export default function ResultsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-rose-300/20 bg-rose-300/10 p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-200">
          Results page error
        </p>

        <h1 className="mt-4 text-4xl font-black text-white">
          Results could not load.
        </h1>

        <p className="mt-4 text-sm leading-7 text-rose-100">
          The backend may be waking up or the live app URL may still be updating.
          Try again in a few seconds.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
          >
            Try Again
          </button>

          <Link
            href="/campaigns"
            className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}