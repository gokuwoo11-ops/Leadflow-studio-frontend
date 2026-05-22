"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import PageReveal from "@/components/PageReveal";

type CreateCampaignResponse = {
  success: boolean;
  campaign?: {
    id: string;
    client_business_name: string;
    sender_name: string;
    sender_email: string | null;
    service_offer: string;
    ideal_target_customer: string;
    target_location: string;
    outreach_tone: string;
    lead_search_keyword: string;
    leads_requested: number;
    status: string;
  };
  error?: string;
};

function inferTargetBusiness(searchKeyword: string) {
  const keyword = String(searchKeyword || "").trim();
  if (!keyword) return "";
  const match = keyword.match(/^(.*?)\s+(?:in|near|around)\s+/i);
  return match ? match[1].trim() : keyword;
}

export default function NewCampaignPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateCampaignResponse | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const inputClasses =
    "w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setRunError(null);
    setCampaignId(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const leadSearchKeyword = String(formData.get("lead_search_keyword") || "");
    const serviceOffer = String(formData.get("service_offer") || "");
    const idealTargetCustomer = String(
      formData.get("ideal_target_customer") || ""
    );
    const targetLocation = String(formData.get("target_location") || "");
    const inferredTargetBusiness = inferTargetBusiness(leadSearchKeyword);

    const payload = {
      client_business_name: String(formData.get("client_business_name") || ""),
      sender_name: String(formData.get("sender_name") || ""),
      sender_email: String(formData.get("sender_email") || ""),
      service_offer: serviceOffer,
      service_offered: serviceOffer,
      serviceOffered: serviceOffer,
      ideal_target_customer: idealTargetCustomer,
      idealTargetCustomer,
      niche: idealTargetCustomer,
      target_location: targetLocation,
      location: targetLocation,
      outreach_tone: String(formData.get("outreach_tone") || ""),
      lead_search_keyword: leadSearchKeyword,
      search_keyword: leadSearchKeyword,
      leadSearchKeyword,
      target_business: inferredTargetBusiness,
      targetBusiness: inferredTargetBusiness,
      leads_requested: Number(formData.get("leads_requested") || 10),
    };

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as CreateCampaignResponse;
      setResult(data);

      if (data.success) {
        form.reset();
        setCampaignId(data.campaign?.id || null);
      }
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the campaign.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function runCampaignNow() {
    if (!campaignId || !result?.campaign) return;

    setRunLoading(true);
    setRunError(null);

    try {
      const runPayload = {
        campaign_id: campaignId,
        campaignId,
        campaign_name: result.campaign.client_business_name || "",
        client_business_name: result.campaign.client_business_name || "",
        ideal_target_customer: result.campaign.ideal_target_customer || "",
        idealTargetCustomer: result.campaign.ideal_target_customer || "",
        niche: result.campaign.ideal_target_customer || "",
        lead_search_keyword: result.campaign.lead_search_keyword || "",
        search_keyword: result.campaign.lead_search_keyword || "",
        leadSearchKeyword: result.campaign.lead_search_keyword || "",
        target_location: result.campaign.target_location || "",
        location: result.campaign.target_location || "",
        service_offer: result.campaign.service_offer || "",
        service_offered: result.campaign.service_offer || "",
        serviceOffered: result.campaign.service_offer || "",
        target_business: inferTargetBusiness(
          result.campaign.lead_search_keyword || ""
        ),
        targetBusiness: inferTargetBusiness(
          result.campaign.lead_search_keyword || ""
        ),
        leads_requested: result.campaign.leads_requested ?? 10,
      };

      const response = await fetch(`/api/campaigns/${campaignId}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(runPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to start campaign.");
      }

      router.push(`/campaigns/${campaignId}/results`);
    } catch (error) {
      setRunError(
        error instanceof Error ? error.message : "Unable to start campaign."
      );
    } finally {
      setRunLoading(false);
    }
  }

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

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Campaign setup
              </p>

              <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                Build your next AI prospecting campaign.
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Give LeadFlow the right context: who you help, where they are,
                what you sell, and how you want to approach them.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/campaigns"
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                Back to Dashboard
              </Link>

              <Link
                href="/"
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
              >
                Home
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.75fr]">
          <section className="rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                Campaign inputs
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Precise inputs create stronger leads, audits, and outreach.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Keep your niche specific. A focused campaign will produce better
                lead scoring, better personalization, and better client-ready reports.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Your business / agency name">
                  <input
                    name="client_business_name"
                    required
                    placeholder="Heisenberg Agency"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Sender name">
                  <input
                    name="sender_name"
                    required
                    placeholder="Walter"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Sender email">
                  <input
                    name="sender_email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Target location">
                  <input
                    name="target_location"
                    required
                    placeholder="Madurai"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Lead search keyword">
                  <input
                    name="lead_search_keyword"
                    required
                    placeholder="restaurants, salons, gyms..."
                    className={inputClasses}
                  />
                </Field>

                <Field label="Leads requested">
                  <select
                    name="leads_requested"
                    defaultValue="10"
                    className={inputClasses}
                  >
                    <option value="10">10 leads</option>
                    <option value="20">20 leads</option>
                    <option value="25">25 leads</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-5">
                <Field label="Service offer">
                  <textarea
                    name="service_offer"
                    required
                    rows={4}
                    placeholder="Website design and Instagram marketing for local restaurants."
                    className={`${inputClasses} min-h-[140px] resize-none`}
                  />
                </Field>

                <Field label="Ideal target customer">
                  <textarea
                    name="ideal_target_customer"
                    required
                    rows={3}
                    placeholder="Restaurant owners with weak or no digital presence."
                    className={`${inputClasses} min-h-[120px] resize-none`}
                  />
                </Field>

                <Field label="Outreach tone">
                  <select
                    name="outreach_tone"
                    defaultValue="Professional and concise"
                    className={inputClasses}
                  >
                    <option>Professional and concise</option>
                    <option>Friendly and conversational</option>
                    <option>Premium and consultative</option>
                    <option>Direct and persuasive</option>
                  </select>
                </Field>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-300/20 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating campaign..." : "Create Campaign →"}
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                Workflow
              </p>

              <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-white">
                From campaign idea to client-ready assets.
              </h3>

              <div className="relative mt-6 space-y-4">
                <div className="absolute left-5 top-8 h-[calc(100%-4rem)] w-px bg-gradient-to-b from-cyan-300/50 via-cyan-300/20 to-transparent" />

                <WorkflowStep
                  number="1"
                  title="Create"
                  description="Enter target market, location, offer, and tone."
                />
                <WorkflowStep
                  number="2"
                  title="Run"
                  description="The system discovers and processes each lead."
                />
                <WorkflowStep
                  number="3"
                  title="Use"
                  description="Open PDFs, copy outreach, export CSV, and track status."
                />
              </div>
            </section>

            {result ? (
              <section className="rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  {result.success ? "Campaign ready" : "Campaign error"}
                </p>

                <div
                  className={`mt-4 rounded-3xl border p-5 ${
                    result.success
                      ? "border-emerald-300/20 bg-emerald-300/10"
                      : "border-rose-300/20 bg-rose-300/10"
                  }`}
                >
                  {result.success ? (
                    <>
                      <p className="text-lg font-black text-white">
                        Campaign created successfully.
                      </p>

                      <p className="mt-3 break-all text-sm leading-6 text-slate-300">
                        ID: {result.campaign?.id}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        Run now to generate leads, outreach, analysis, and PDF
                        audit reports.
                      </p>

                      {campaignId ? (
                        <button
                          type="button"
                          onClick={runCampaignNow}
                          disabled={runLoading}
                          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-300/20 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {runLoading
                            ? "Starting campaign..."
                            : "Run Campaign Now →"}
                        </button>
                      ) : null}

                      {runError ? (
                        <p className="mt-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">
                          {runError}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-black text-white">
                        Unable to create campaign.
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {result.error}
                      </p>
                    </>
                  )}
                </div>
              </section>
            ) : (
              <section className="rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                  Output preview
                </p>

                <div className="mt-5 grid gap-3">
                  <PreviewItem
                    label="Lead list"
                    value="Business name, maps, website, contact data."
                  />
                  <PreviewItem
                    label="AI analysis"
                    value="Score, quality, problems, opportunity angle."
                  />
                  <PreviewItem
                    label="Sales assets"
                    value="PDF audit report and personalized outreach."
                  />
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
      </PageReveal>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex gap-3">
        <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-sm font-black text-slate-950">
          {number}
        </span>

        <div>
          <p className="text-sm font-black text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-sm font-black text-white">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-400">{value}</p>
    </div>
  );
}