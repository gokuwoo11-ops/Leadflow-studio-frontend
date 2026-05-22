import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

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
    const response = await fetch(`${BACKEND_URL}/campaigns/${campaignId}/results`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data?.success) {
      return null;
    }

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
    (sum, item) => sum + Number(item.resultsData?.summary?.processed_leads || 0),
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
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
      LeadFlow Studio
    </p>

    <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
      Campaign Dashboard
    </h1>

    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
      Track real campaign results, generated leads, AI analysis, outreach messages, and PDF audit reports.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <Link
      href="/"
      className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
    >
      Back to Home
    </Link>

    <Link
      href="/campaigns/new"
      className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
    >
      Create New Campaign
    </Link>
  </div>
</header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Campaigns" value={String(campaigns.length)} />
          <MetricCard label="Completed" value={String(completedCampaigns)} />
          <MetricCard label="Running" value={String(runningCampaigns)} />
          <MetricCard label="Failed Campaigns" value={String(failedCampaigns)} />
          <MetricCard label="Total Leads" value={String(totalLeads)} />
          <MetricCard label="Processed Leads" value={String(totalProcessed)} />
          <MetricCard label="Failed Leads" value={String(totalFailed)} />
          <MetricCard label="PDF Reports" value={String(totalReports)} />
          <MetricCard label="AI Analyses" value={String(totalAnalyses)} />
          <MetricCard label="Outreach Messages" value={String(totalOutreach)} />
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/15">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
              Campaigns
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
            </h2>
          </div>

          {campaignResults.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <h3 className="text-xl font-semibold text-white">
                No campaigns yet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Create your first campaign to generate leads, outreach, and audit PDFs.
              </p>
              <Link
                href="/campaigns/new"
                className="mt-5 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Create Campaign
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

                return (
                  <article
                    key={campaign.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold text-white">
                            {campaign.client_business_name ||
                              campaign.name ||
                              "Untitled Campaign"}
                          </h3>

                          <span className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold capitalize text-cyan-200">
                            {campaign.status || "draft"}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          Target:{" "}
                          <span className="text-slate-200">
                            {campaign.ideal_target_customer ||
                              campaign.lead_search_keyword ||
                              "—"}
                          </span>
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Service:{" "}
                          <span className="text-slate-200">
                            {campaign.service_offer || "—"}
                          </span>
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Location:{" "}
                          <span className="text-slate-200">
                            {campaign.target_location || "—"}
                          </span>
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Created: {formatDate(campaign.created_at)}
                        </p>
                      </div>

                      <Link
                        href={`/campaigns/${campaign.id}/results`}
                        className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                      >
                        View Results
                      </Link>
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
                      <SmallStat label="Analyses" value={String(analysesCount)} />
                      <SmallStat label="Outreach" value={String(outreachCount)} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}