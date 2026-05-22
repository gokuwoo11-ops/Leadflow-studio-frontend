import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import DeleteCampaignButton from "./DeleteCampaignButton";
import PageReveal from "@/components/PageReveal";
type Row = Record<string, any>;

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pdf-api-bw6a.onrender.com";

function normalizeStatus(value?: string | null) {
  return String(value || "").toLowerCase();
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

async function getCampaignResults(campaignId: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/campaigns/${campaignId}/results`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data?.success) return null;

    return data;
  } catch {
    return null;
  }
}

export default async function CampaignsPage() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: campaignsRaw, error: campaignsError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (campaignsError) {
    throw campaignsError;
  }

  const campaigns: Row[] = Array.isArray(campaignsRaw) ? campaignsRaw : [];

  const campaignResults = await Promise.all(
    campaigns.map(async (campaign) => {
      const resultsData = await getCampaignResults(String(campaign.id));
      return {
        campaign,
        resultsData,
      };
    })
  );

  const totalLeads = campaignResults.reduce(
    (sum, item) => sum + Number(item.resultsData?.summary?.total_leads || 0),
    0
  );

  const totalProcessed = campaignResults.reduce(
    (sum, item) =>
      sum + Number(item.resultsData?.summary?.processed_leads || 0),
    0
  );

  const totalFailed = campaignResults.reduce(
    (sum, item) => sum + Number(item.resultsData?.summary?.failed_leads || 0),
    0
  );

  const totalReports = campaignResults.reduce((sum, item) => {
    const results = Array.isArray(item.resultsData?.results)
      ? item.resultsData.results
      : [];

    return sum + results.filter((result: Row) => result.report?.pdf_url).length;
  }, 0);

  const totalAnalyses = campaignResults.reduce((sum, item) => {
    const results = Array.isArray(item.resultsData?.results)
      ? item.resultsData.results
      : [];

    return sum + results.filter((result: Row) => result.analysis).length;
  }, 0);

  const totalOutreach = campaignResults.reduce((sum, item) => {
    const results = Array.isArray(item.resultsData?.results)
      ? item.resultsData.results
      : [];

    return sum + results.filter((result: Row) => result.outreach).length;
  }, 0);

  const completedCampaigns = campaigns.filter(
    (campaign) => normalizeStatus(campaign.status) === "completed"
  ).length;

  const runningCampaigns = campaigns.filter((campaign) =>
    ["running", "processing", "active"].includes(normalizeStatus(campaign.status))
  ).length;

  const failedCampaigns = campaigns.filter(
    (campaign) => normalizeStatus(campaign.status) === "failed"
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-[8rem] h-[32rem] w-[32rem] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
      </div>

     <PageReveal>
        <div className="relative mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/30">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                LeadFlow Studio
              </p>

              <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                Campaign Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Monitor every campaign, generated lead, AI analysis, outreach
                message, and PDF audit report from one command center.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                Back to Home
              </Link>

              <Link
                href="/campaigns/new"
                className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-300/20 transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Create New Campaign →
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Campaigns" value={String(campaigns.length)} />
          <MetricCard label="Completed" value={String(completedCampaigns)} />
          <MetricCard label="Running" value={String(runningCampaigns)} />
          <MetricCard label="Failed" value={String(failedCampaigns)} />
          <MetricCard label="Total Leads" value={String(totalLeads)} />
          <MetricCard label="Processed" value={String(totalProcessed)} />
          <MetricCard label="Failed Leads" value={String(totalFailed)} />
          <MetricCard label="PDF Reports" value={String(totalReports)} />
          <MetricCard label="AI Analyses" value={String(totalAnalyses)} />
          <MetricCard label="Outreach" value={String(totalOutreach)} />
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
                Campaigns
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Open a campaign to review leads, PDF reports, outreach messages,
              CSV export, and follow-up status.
            </p>
          </div>

          {campaignResults.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
              <h3 className="text-xl font-black text-white">
                No campaigns yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Create your first campaign to generate leads, outreach, and
                audit PDFs.
              </p>

              <Link
                href="/campaigns/new"
                className="mt-5 inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Create Campaign →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {campaignResults.map(({ campaign, resultsData }) => {
                const summary = resultsData?.summary || {};
                const results = Array.isArray(resultsData?.results)
                  ? resultsData.results
                  : [];

                const reportsCount = results.filter(
                  (result: Row) => result.report?.pdf_url
                ).length;

                const analysesCount = results.filter(
                  (result: Row) => result.analysis
                ).length;

                const outreachCount = results.filter(
                  (result: Row) => result.outreach
                ).length;

                const status = normalizeStatus(campaign.status);

                return (
                  <article
                    key={campaign.id}
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.06]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black tracking-[-0.03em] text-white">
                            {campaign.client_business_name ||
                              campaign.name ||
                              "Untitled Campaign"}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black capitalize ${
                              status === "completed"
                                ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                                : status === "failed"
                                ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
                                : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                            }`}
                          >
                            {campaign.status || "draft"}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-400 md:grid-cols-3">
                          <InfoLine
                            label="Target"
                            value={
                              campaign.ideal_target_customer ||
                              campaign.lead_search_keyword ||
                              "—"
                            }
                          />

                          <InfoLine
                            label="Service"
                            value={campaign.service_offer || "—"}
                          />

                          <InfoLine
                            label="Location"
                            value={campaign.target_location || "—"}
                          />
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          Created: {formatDate(campaign.created_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/campaigns/${campaign.id}/results`}
                          className="inline-flex w-fit rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-300/10 transition hover:bg-cyan-200"
                        >
                          View Results
                        </Link>

                        <DeleteCampaignButton
                          campaignId={campaign.id}
                          campaignName={
                            campaign.client_business_name ||
                            campaign.name ||
                            "Untitled Campaign"
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                      <SmallStat
                        label="Leads"
                        value={String(summary.total_leads || 0)}
                      />

                      <SmallStat
                        label="Processed"
                        value={String(summary.processed_leads || 0)}
                      />

                      <SmallStat
                        label="Failed"
                        value={String(summary.failed_leads || 0)}
                      />

                      <SmallStat label="PDFs" value={String(reportsCount)} />

                      <SmallStat
                        label="Analyses"
                        value={String(analysesCount)}
                      />

                      <SmallStat
                        label="Outreach"
                        value={String(outreachCount)}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
      </PageReveal>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-cyan-950/10">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}