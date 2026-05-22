import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import CopyButton from "./CopyButton";
import RetryLeadButton from "./RetryLeadButton";
import AutoRefresh from "./AutoRefresh";
import LeadStatusSelect from "./LeadStatusSelect";
import CopyAllOutreachButton from "./CopyAllOutreachButton";
import ExportCsvButton from "./ExportCsvButton";
import PageReveal from "@/components/PageReveal";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Row = Record<string, any>;

function normalizeUrl(value?: string | null) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getBestChannel(analysis: Row | null, lead: Row) {
  if (
    analysis?.best_outreach_channel &&
    analysis.best_outreach_channel !== "Unknown"
  ) {
    return analysis.best_outreach_channel;
  }

  if (lead.phone) return "Phone / WhatsApp";
  if (lead.email) return "Email";
  if (lead.instagram_url) return "Instagram DM";

  return "Manual research";
}

export default async function ResultsPage({ params }: PageProps) {
  const { id: campaignId } = await params;

  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

 const backendUrl =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pdf-api-bw6a.onrender.com";

let data: Row = {};

try {
  const response = await fetch(
    `${backendUrl}/campaigns/${encodeURIComponent(campaignId)}/results`,
    { cache: "no-store" }
  );

  const text = await response.text();

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      success: false,
      error: "Backend returned an invalid response. Please try again.",
    };
  }

  if (!response.ok || !data.success) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">
          {data.error || `Failed to load campaign results. Status: ${response.status}`}
        </div>
      </main>
    );
  }
} catch (error) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">
        {error instanceof Error
          ? error.message
          : "Failed to connect to backend results API."}
      </div>
    </main>
  );
}

  const campaign: Row = data.campaign || {};
  const summary: Row = data.summary || {};
  const results: Row[] = Array.isArray(data.results) ? data.results : [];

  const hasProcessingLeads =
    Number(summary.processing_leads || 0) > 0 ||
    results.some((item) => item?.lead?.processing_status === "processing");

  const shouldAutoRefresh =
    hasProcessingLeads ||
    campaign.status === "running" ||
    campaign.status === "processing";

  const allOutreachText = results
    .map((item, index) => {
      const lead = item.lead || {};
      const outreach = item.outreach || {};
      const report = item.report || {};

      const parts = [
        `#${index + 1} - ${lead.business_name || "Unnamed lead"}`,
        outreach.subject ? `Subject: ${outreach.subject}` : "",
        outreach.opening_line || "",
        outreach.email_body || "",
        outreach.call_to_action || "",
        report.pdf_url ? `PDF Audit: ${report.pdf_url}` : "",
      ].filter(Boolean);

      return parts.join("\n\n");
    })
    .filter(Boolean)
    .join("\n\n-----------------------------\n\n");

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

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Campaign results
              </p>

              <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                {campaign.client_business_name || "Campaign"}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Review leads, AI scores, outreach messages, PDF audit reports,
                and follow-up status from one premium workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/campaigns"
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                Back to Dashboard
              </Link>

              <CopyAllOutreachButton text={allOutreachText} />

              <ExportCsvButton results={results} />
            </div>
          </div>
        </header>

        <AutoRefresh enabled={shouldAutoRefresh} />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            label="Total leads"
            value={String(summary.total_leads ?? results.length)}
          />
          <MetricCard
            label="Processed"
            value={String(summary.processed_leads ?? 0)}
          />
          <MetricCard label="Failed" value={String(summary.failed_leads ?? 0)} />
          <MetricCard label="Service" value={campaign.service_offer || "—"} />
          <MetricCard label="Location" value={campaign.target_location || "—"} />
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
                Leads overview
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                {results.length} result{results.length === 1 ? "" : "s"}
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              Open PDFs, copy outreach, export leads, and track follow-up status.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <h3 className="text-xl font-black text-white">No results yet</h3>
              <p className="mt-2 text-sm text-slate-400">
                Run the campaign or wait for processing to finish.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {results.map((item, index) => {
                const lead = item.lead || {};
                const analysis = item.analysis || null;
                const outreach = item.outreach || null;
                const report = item.report || null;

                const pdfUrl = normalizeUrl(report?.pdf_url);
                const websiteUrl = normalizeUrl(lead.website);
                const mapsUrl = normalizeUrl(lead.google_maps_url);

                const fullOutreach = [
                  outreach?.subject ? `Subject: ${outreach.subject}` : "",
                  outreach?.opening_line || "",
                  outreach?.email_body || "",
                  outreach?.call_to_action || "",
                  pdfUrl ? `PDF Audit: ${pdfUrl}` : "",
                ]
                  .filter(Boolean)
                  .join("\n\n");

                const bestChannel = getBestChannel(analysis, lead);

                return (
                  <article
                    key={lead.id || index}
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.06]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
                            #{index + 1}
                          </span>

                          <h3 className="text-xl font-black text-white">
                            {lead.business_name || "Unnamed lead"}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {lead.notes || "No notes available."}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-2 lg:items-end">
                        <span
                          className={`h-fit rounded-full border px-3 py-2 text-xs font-black capitalize ${
                            lead.processing_status === "failed"
                              ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
                              : lead.processing_status === "processed"
                              ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                              : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                          }`}
                        >
                          {lead.processing_status || "new"}
                        </span>

                        <LeadStatusSelect
                          leadId={lead.id}
                          currentStatus={lead.status || "New"}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <SmallInfo
                        label="Score"
                        value={String(analysis?.lead_score ?? "—")}
                      />
                      <SmallInfo
                        label="Quality"
                        value={analysis?.lead_quality || "—"}
                      />
                      <SmallInfo label="Best channel" value={bestChannel} />
                      <SmallInfo label="Phone" value={lead.phone || "—"} />
                      <SmallInfo label="Email" value={lead.email || "—"} />
                    </div>

                    {analysis?.personalization_angle ? (
                      <div className="mt-5 rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                          Personalization angle
                        </p>

                        <p className="mt-3 text-sm leading-7 text-slate-200">
                          {analysis.personalization_angle}
                        </p>
                      </div>
                    ) : null}

                    {Array.isArray(analysis?.problems_found) &&
                    analysis.problems_found.length > 0 ? (
                      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                          Problems found
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {analysis.problems_found
                            .slice(0, 4)
                            .map((problem: Row, problemIndex: number) => (
                              <div
                                key={`${lead.id}-problem-${problemIndex}`}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                              >
                                <p className="text-sm font-black text-white">
                                  {problem.title || "Opportunity"}
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                  {problem.detail || problem.severity || "—"}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}

                    {outreach ? (
                      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                          Outreach message
                        </p>

                        <h4 className="mt-3 text-lg font-black text-white">
                          {outreach.subject || "No subject"}
                        </h4>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                          {[outreach.opening_line, outreach.email_body, outreach.call_to_action]
                            .filter(Boolean)
                            .join("\n\n")}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                        Outreach not generated yet.
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {pdfUrl ? (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 shadow-xl shadow-cyan-300/10 transition hover:bg-cyan-200"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-black text-slate-400">
                          No PDF yet
                        </span>
                      )}

                      {fullOutreach ? <CopyButton text={fullOutreach} /> : null}

                      {websiteUrl ? (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-white transition hover:bg-white/[0.08]"
                        >
                          Website
                        </a>
                      ) : null}

                      {mapsUrl ? (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-white transition hover:bg-white/[0.08]"
                        >
                          Maps
                        </a>
                      ) : null}

                      {lead.processing_status === "failed" ? (
                        <RetryLeadButton leadId={lead.id} />
                      ) : null}
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

      <p className="mt-3 break-words text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function SmallInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-black text-slate-200">
        {value}
      </p>
    </div>
  );
}