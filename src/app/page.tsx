import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <nav className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/70 px-6 py-5 shadow-2xl shadow-cyan-950/15 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-300">
              AI Prospecting SaaS
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              LeadFlow Studio
            </h1>
          </div>

          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <span>Campaigns</span>
            <span>Leads</span>
            <span>Reports</span>
            <span>Outreach</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/campaigns/new"
              className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Create New Campaign
            </Link>
            <Link
              href="/campaigns"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              View Campaign Results
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Login
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-start gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Prospecting → Analysis → Audit reports → Outreach
            </div>

            <h2 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn outbound prospecting into a predictable growth engine.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Create a campaign, define your ideal target, and let AI discover leads, draft outreach, and generate PDF audit reports—all from one polished interface.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/campaigns/new"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Start New Campaign
              </Link>
              <Link
                href="/campaigns"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                View Campaign Results
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-2xl font-bold text-white">Automated</p>
                <p className="mt-2 text-sm text-slate-400">Lead discovery powered by AI</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-2xl font-bold text-white">Personalized</p>
                <p className="mt-2 text-sm text-slate-400">Outreach and messaging for every prospect</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-2xl font-bold text-white">Insightful</p>
                <p className="mt-2 text-sm text-slate-400">Audit reports and campaign analysis</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
            <div className="rounded-[1.75rem] bg-slate-950/70 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                How it works
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                A simple workflow for consistent results
              </h3>
              <div className="mt-8 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm font-semibold text-cyan-200">1. Create a campaign</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Define the business, location, customer profile, offer, and outreach tone.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm font-semibold text-cyan-200">2. System finds leads</p>
                  <p className="mt-2 text-sm text-slate-300">
                    The platform searches for qualified prospects and organizes discovery data.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm font-semibold text-cyan-200">3. Generate analysis & reports</p>
                  <p className="mt-2 text-sm text-slate-300">
                    AI drafts outreach messages and creates PDF audit reports for every campaign.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
