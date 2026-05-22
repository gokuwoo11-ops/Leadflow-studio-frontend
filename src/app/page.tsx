import Link from "next/link";

const workflow = [
  {
    title: "Create campaign",
    text: "Define your target industry, location, offer, tone, and lead search keyword.",
  },
  {
    title: "AI finds prospects",
    text: "The system discovers local businesses and organizes them into a clean campaign pipeline.",
  },
  {
    title: "Generate assets",
    text: "Every qualified lead gets analysis, outreach messaging, and a professional PDF audit report.",
  },
  {
    title: "Track and close",
    text: "Copy outreach, open PDFs, update lead status, and manage follow-up from one dashboard.",
  },
];


const features = [
  "Lead discovery",
  "AI lead scoring",
  "Personalized outreach",
  "PDF audit reports",
  "Campaign dashboard",
  "Lead status tracking",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-12rem] top-[6rem] h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <nav className="mb-10 flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-lg font-black text-slate-950 shadow-lg shadow-cyan-300/20">
              LF
            </div>
            <div>
              <p className="text-sm font-semibold text-white">LeadFlow Studio</p>
              <p className="text-xs text-slate-400">AI Client Acquisition</p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <span>Leads</span>
            <span>Reports</span>
            <span>Outreach</span>
            <span>CRM</span>
          </div>

          <Link
            href="/login"
            className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Login
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
              AI prospecting • outreach • PDF audits • lead tracking
            </div>

            <h1 className="max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn local leads into ready-to-contact clients.
            </h1>

           <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
  LeadFlow Studio helps freelancers and agencies find local business leads,
  generate personalized audit PDFs, write outreach, and track follow-ups from
  one clean dashboard.
</p>
<div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <p className="text-sm font-bold text-white">Find leads</p>
    <p className="mt-1 text-xs leading-5 text-slate-400">
      Discover local businesses by niche and location.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <p className="text-sm font-bold text-white">Generate proof</p>
    <p className="mt-1 text-xs leading-5 text-slate-400">
      Create audit PDFs and AI lead analysis.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <p className="text-sm font-bold text-white">Close clients</p>
    <p className="mt-1 text-xs leading-5 text-slate-400">
      Copy outreach and track lead status.
    </p>
  </div>
</div>



            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/campaigns/new"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-300/20 transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Start New Campaign →
              </Link>

              <Link
                href="/campaigns"
                className="group inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-300/25 transition hover:-translate-y-1 hover:bg-cyan-200 hover:shadow-cyan-300/40"
              >
                View Campaigns
              </Link>
            </div>

            <div className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-white/[0.08]">
              <StatCard value="10+" label="lead results per campaign" />
              <StatCard value="PDF" label="audit reports generated" />
              <StatCard value="CRM" label="status tracking included" />
            </div>
          </div>

          <div className="relative">
          
            <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-r from-cyan-300/40 via-blue-500/20 to-cyan-300/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
              <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                      Live workflow
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Client acquisition engine
                    </h2>
                  </div>
                  <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Ready
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {workflow.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-5">
                  <p className="text-sm font-semibold text-cyan-100">
                    Output generated for every processed lead:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="pb-10">
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="For agencies"
              text="Create campaign pipelines for different niches and locations, then generate audit reports at scale."
            />
            <FeatureCard
              title="For freelancers"
              text="Find businesses that need your service and approach them with personalized proof, not generic messages."
            />
            <FeatureCard
              title="For local selling"
              text="Use maps, lead scoring, PDFs, and follow-up status to turn cold discovery into a real sales workflow."
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{label}</p>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-cyan-950/10 backdrop-blur-xl">
      <p className="text-lg font-bold text-white">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
    </div>
  );
}