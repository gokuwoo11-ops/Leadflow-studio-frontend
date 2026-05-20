// ============================================================
// FILE 2: src/app/campaigns/new/page.tsx
// Create these folders if needed:
// src → app → campaigns → new → page.tsx
// ============================================================

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateCampaignResponse | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const inputClasses =
    "w-full rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 transition-shadow shadow-sm shadow-slate-950/20";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      client_business_name: String(formData.get("client_business_name") || ""),
      sender_name: String(formData.get("sender_name") || ""),
      sender_email: String(formData.get("sender_email") || ""),
      service_offer: String(formData.get("service_offer") || ""),
      ideal_target_customer: String(
        formData.get("ideal_target_customer") || ""
      ),
      target_location: String(formData.get("target_location") || ""),
      outreach_tone: String(formData.get("outreach_tone") || ""),
      lead_search_keyword: String(
        formData.get("lead_search_keyword") || ""
      ),
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-[0_25px_80px_-50px_rgba(14,165,233,0.65)] backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
              Campaign Setup
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create a premium outbound campaign
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Fill in your audience, offer, and outreach tone. The system will save this campaign, then you can run it to discover leads and generate reports.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex w-fit rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Back to Home
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.65fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
            <div className="mb-7 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Campaign details
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Build your next prospecting campaign with confidence.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                This form captures the inputs that power lead discovery, outreach generation, and audit reporting. All fields remain unchanged so campaign creation works exactly as before.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Client business name">
                  <input
                    name="client_business_name"
                    required
                    placeholder="GrowthSpark Media"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Sender name">
                  <input
                    name="sender_name"
                    required
                    placeholder="Arjun"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Sender email">
                  <input
                    name="sender_email"
                    type="email"
                    placeholder="arjun@example.com"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Target location">
                  <input
                    name="target_location"
                    required
                    placeholder="Chennai"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Lead search keyword">
                  <input
                    name="lead_search_keyword"
                    required
                    placeholder="gyms, dental clinics, restaurants..."
                    className={inputClasses}
                  />
                </Field>

                <Field label="How many leads?">
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
                <Field label="What service or offer do you sell?">
                  <textarea
                    name="service_offer"
                    required
                    rows={4}
                    placeholder="Short-form video content, Instagram growth strategy, and lead capture campaigns."
                    className={`${inputClasses} min-h-[140px] resize-none`}
                  />
                </Field>

                <Field label="Who is your ideal target customer?">
                  <textarea
                    name="ideal_target_customer"
                    required
                    rows={3}
                    placeholder="Local gyms and fitness studios that need better online visibility and more membership enquiries."
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
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating campaign..." : "Create Campaign"}
              </button>
            </form>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20">
            <div className="rounded-3xl bg-slate-950/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Campaign workflow
              </p>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Steps to launch and scale
              </h3>
              <div className="mt-6 space-y-4">
                <WorkflowStep
                  number="1"
                  title="Enter campaign details"
                  description="Describe the business, ideal customer, location, offer, and tone."
                />
                <WorkflowStep
                  number="2"
                  title="Create campaign"
                  description="Save the campaign so it is ready to run from your dashboard."
                />
                <WorkflowStep
                  number="3"
                  title="Run campaign"
                  description="Discover leads, generate outreach, and create PDF audit reports."
                />
              </div>
            </div>

            {result && (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  {result.success ? "Success" : "Error"}
                </p>
                <div className={`mt-4 rounded-3xl border px-5 py-4 ${result.success ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-rose-300/20 bg-rose-300/10 text-rose-100"}`}>
                  {result.success ? (
                    <>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100/90">
                        Campaign created successfully
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        Campaign ID: <span className="font-semibold text-white">{result.campaign?.id}</span>
                      </p>
                      <p className="mt-2 text-slate-200">
                        Your campaign is ready. Click below to start lead discovery and report generation instantly.
                      </p>

                      {campaignId && (
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={async () => {
                              setRunLoading(true);
                              setRunError(null);

                              try {
                                const response = await fetch(
                                  `/api/campaigns/${campaignId}/run`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                  }
                                );
                                const data = await response.json();

                                if (!response.ok || !data.success) {
                                  throw new Error(
                                    data.error || "Failed to start campaign."
                                  );
                                }

                                router.push(`/campaigns/${campaignId}/results`);
                              } catch (error) {
                                setRunError(
                                  error instanceof Error
                                    ? error.message
                                    : "Unable to start campaign."
                                );
                              } finally {
                                setRunLoading(false);
                              }
                            }}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={runLoading}
                          >
                            {runLoading ? "Starting campaign..." : "Run Campaign Now"}
                          </button>
                          {runError && (
                            <p className="mt-3 text-sm text-rose-100">
                              {runError}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-white">Unable to create campaign.</p>
                      <p className="mt-2 text-slate-300">{result.error}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-300/10 text-sm font-semibold text-cyan-200">
          {number}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}
