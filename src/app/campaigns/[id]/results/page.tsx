import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import CopyButton from "./CopyButton";
import RetryLeadButton from "./RetryLeadButton";
import AutoRefresh from "./AutoRefresh";
import LeadStatusSelect from "./LeadStatusSelect";
import CopyAllOutreachButton from "./CopyAllOutreachButton";

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

export default async function ResultsPage({ params }: PageProps) {
  const { id: campaignId } = await params;

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/campaigns/${campaignId}/results`,
    { cache: "no-store" }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">
          {data.error || "Failed to load campaign results."}
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
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
            Campaign results
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {campaign.client_business_name || "Campaign"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Review generated leads, scores, outreach messages, and PDF audit reports.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
           <Link
  href="/campaigns"
  className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
>
  Back to campaigns
</Link>
 <CopyAllOutreachButton text={allOutreachText} />

            
          </div>
        </header>
        <AutoRefresh enabled={shouldAutoRefresh} />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Total leads" value={String(summary.total_leads ?? 0)} />
          <MetricCard label="Processed" value={String(summary.processed_leads ?? 0)} />
          <MetricCard label="Failed" value={String(summary.failed_leads ?? 0)} />
          <MetricCard label="Service" value={campaign.service_offer || "—"} />
          <MetricCard label="Location" value={campaign.target_location || "—"} />
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-2xl font-semibold text-white">
            {results.length} result{results.length === 1 ? "" : "s"}
          </h2>

          <div className="mt-6 space-y-5">
            {results.map((item) => {
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

              return (
                <article
                  key={lead.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {lead.business_name || "Unnamed lead"}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {lead.notes || "No notes available."}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
  <span className="h-fit rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold capitalize text-emerald-200">
    {lead.processing_status || "new"}
  </span>

  <LeadStatusSelect leadId={lead.id} currentStatus={lead.status || "New"} />
</div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <SmallInfo label="Score" value={String(analysis?.lead_score ?? "—")} />
                    <SmallInfo label="Quality" value={analysis?.lead_quality || "—"} />
                    <SmallInfo
  label="Best channel"
  value={
    analysis?.best_outreach_channel &&
    analysis.best_outreach_channel !== "Unknown"
      ? analysis.best_outreach_channel
      : lead.phone
      ? "Phone / WhatsApp"
      : lead.email
      ? "Email"
      : lead.instagram_url
      ? "Instagram DM"
      : "Manual research"
  }
/>
                    <SmallInfo label="Phone" value={lead.phone || "—"} />
                    <SmallInfo label="Email" value={lead.email || "—"} />
                  </div>

                  {analysis?.personalization_angle ? (
                    <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                        Personalization angle
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">
                        {analysis.personalization_angle}
                      </p>
                    </div>
                  ) : null}

                  {outreach ? (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Outreach message
                      </p>
                      <h4 className="mt-2 font-semibold text-white">
                        {outreach.subject || "No subject"}
                      </h4>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {[outreach.opening_line, outreach.email_body, outreach.call_to_action]
                          .filter(Boolean)
                          .join("\n\n")}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {pdfUrl ? (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-400">
                        No PDF yet
                      </span>
                    )}

                    {fullOutreach ? <CopyButton text={fullOutreach} /> : null}

                    {websiteUrl ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Website
                      </a>
                    ) : null}

                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white"
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
      <p className="mt-3 break-words text-lg font-semibold text-white">
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
      <p className="mt-2 break-words text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}