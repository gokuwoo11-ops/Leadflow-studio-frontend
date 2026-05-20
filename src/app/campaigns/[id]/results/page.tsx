"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type LeadRecord = {
  id?: string;
  business_name?: string;
  company_name?: string;
  name?: string;
  status?: string;
  quality?: string;
  score?: number;
  report_url?: string;
  pdf_report_url?: string;
  outreach?: {
    subject?: string;
  };
  analysis?: {
    quality?: string;
    score?: number;
  };
  report?: {
    url?: string;
  };
  subject?: string;
  email_subject?: string;
};

type CampaignResults = {
  id?: string;
  client_business_name?: string;
  status?: string;
  total_leads?: number;
  new_leads?: number;
  processing_leads?: number;
  processed_leads?: number;
  failed_leads?: number;
  leads?: LeadRecord[];
};

type BackendResultsResponse = {
  success: boolean;
  error?: string;
  campaign?: {
    id?: string;
    client_business_name?: string;
    status?: string;
  };
  summary?: {
    total_leads?: number;
    new_leads?: number;
    processing_leads?: number;
    processed_leads?: number;
    failed_leads?: number;
  };
  results?: LeadRecord[];
};

const formatNumber = (value: number | undefined | null) =>
  typeof value === "number" ? value : 0;

export default function CampaignResultsPage() {
  const params = useParams();
  const campaignId = params?.id ?? "";
  const [data, setData] = useState<CampaignResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    if (!campaignId) return;
    setError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/results`, {
        cache: "no-store",
      });
      const json = (await response.json()) as BackendResultsResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to load campaign results.");
      }

      setData({
        id: String(json.campaign?.id ?? campaignId),
        client_business_name: String(json.campaign?.client_business_name ?? ""),
        status: String(json.campaign?.status ?? ""),
        total_leads: json.summary?.total_leads,
        new_leads: json.summary?.new_leads,
        processing_leads: json.summary?.processing_leads,
        processed_leads: json.summary?.processed_leads,
        failed_leads: json.summary?.failed_leads,
        leads: Array.isArray(json.results) ? json.results : [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchResults();
  }, [campaignId]);

  const status = data?.status?.toLowerCase() ?? "unknown";
  const isRunning = status === "running" || status === "processing";

  useEffect(() => {
    if (!campaignId || !isRunning) return;
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, [campaignId, isRunning]);

  const leads = Array.isArray(data?.leads) ? data.leads : [];

  const counts = useMemo(() => {
    return leads.reduce(
      (
        acc,
        lead: LeadRecord
      ) => {
        const statusValue = (lead.status ?? "").toLowerCase();
        if (statusValue.includes("new")) {
          acc.new += 1;
        } else if (statusValue.includes("processing")) {
          acc.processing += 1;
        } else if (statusValue.includes("fail") || statusValue.includes("error")) {
          acc.failed += 1;
        } else if (
          statusValue.includes("processed") ||
          statusValue.includes("complete") ||
          statusValue.includes("done")
        ) {
          acc.processed += 1;
        }
        return acc;
      },
      { new: 0, processing: 0, processed: 0, failed: 0 }
    );
  }, [leads]);

  const totalLeads =
    data?.total_leads ??
    (leads.length > 0 ? leads.length : undefined) ??
    0;
  const newLeads = data?.new_leads ?? counts.new;
  const processingLeads = data?.processing_leads ?? counts.processing;
  const processedLeads = data?.processed_leads ?? counts.processed;
  const failedLeads = data?.failed_leads ?? counts.failed;

  const getLeadName = (lead: LeadRecord) =>
    lead.business_name || lead.company_name || lead.name || "Unnamed lead";

  const getLeadQuality = (lead: LeadRecord) =>
    lead.analysis?.quality || lead.quality || "—";

  const getLeadScore = (lead: LeadRecord) =>
    lead.analysis?.score ?? lead.score ?? "—";

  const getReportUrl = (lead: LeadRecord) =>
    lead.report_url || lead.pdf_report_url || lead.report?.url;

  const getSubject = (lead: LeadRecord) =>
    lead.outreach?.subject || lead.subject || lead.email_subject || "N/A";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
              Campaign results
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              {data?.client_business_name ?? "Campaign"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Monitor the latest lead progress, status, and campaign performance from your AI prospecting workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/campaigns/new"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Create another campaign
            </Link>
            <Link
              href="/"
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Back to home
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_0.55fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/15">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Campaign ID
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {campaignId}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white">
                Status: {data?.status ?? "Loading..."}
              </div>
            </div>

            {loading ? (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-300">
                Loading campaign results...
              </div>
            ) : error ? (
              <div className="mt-8 rounded-3xl border border-rose-300/20 bg-rose-300/10 p-6 text-sm text-rose-100">
                {error}
              </div>
            ) : (
              <>
                {isRunning && (
                  <div className="mb-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-sm text-cyan-100">
                    Your campaign is running. Results will appear here as they are completed.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard label="Total leads" value={String(totalLeads)} />
                  <MetricCard label="New leads" value={String(newLeads)} />
                  <MetricCard label="Processing leads" value={String(processingLeads)} />
                  <MetricCard label="Processed leads" value={String(processedLeads)} />
                  <MetricCard label="Failed leads" value={String(failedLeads)} />
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
                        Leads overview
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-white">
                        {leads.length} lead{leads.length === 1 ? "" : "s"} found
                      </h2>
                    </div>
                    <p className="text-sm text-slate-400">
                      Updated automatically while the campaign runs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {leads.length === 0 ? (
                      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-300">
                        No leads are available yet. Check back once the campaign starts processing.
                      </div>
                    ) : (
                      leads.map((lead, index) => {
                        const reportUrl = getReportUrl(lead);
                        return (
                          <div
                            key={lead.id ?? `${lead.business_name ?? lead.name}-${index}`}
                            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm text-slate-400">{getLeadName(lead)}</p>
                                <p className="mt-2 text-lg font-semibold text-white">
                                  {lead.status ?? "Status unknown"}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <span className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-300">
                                  Quality: {getLeadQuality(lead)}
                                </span>
                                <span className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-300">
                                  Score: {getLeadScore(lead)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                  Outreach subject
                                </p>
                                <p className="mt-2 text-sm text-slate-200">
                                  {getSubject(lead)}
                                </p>
                              </div>
                              <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                  Report
                                </p>
                                {reportUrl ? (
                                  <a
                                    href={reportUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex rounded-2xl bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                                  >
                                    Open PDF report
                                  </a>
                                ) : (
                                  <p className="mt-2 text-sm text-slate-500">
                                    Report is not available yet.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/15">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
              Campaign summary
            </p>
            <div className="mt-4 space-y-4">
              <StatCard label="Campaign name" value={data?.client_business_name ?? "N/A"} />
              <StatCard label="Status" value={data?.status ?? "N/A"} />
              <StatCard label="Total leads" value={String(totalLeads)} />
            </div>
            {isRunning && (
              <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-sm text-cyan-100">
                Refreshing every 10 seconds while this campaign is running.
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
