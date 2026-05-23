import Link from "next/link";

const WHATSAPP_NUMBER = "9842036745"; // replace with your WhatsApp number
const WHATSAPP_MESSAGE =
  "Hi, I want to upgrade my LeadFlow Studio account.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "For testing LeadFlow Studio and generating your first leads.",
    badge: "Current starter plan",
    features: [
      "3 campaigns per month",
      "30 leads per month",
      "10 leads per campaign",
      "AI outreach messages",
      "PDF audit reports",
      "CSV export",
    ],
    cta: "Start free",
    href: "/campaigns",
    highlighted: false,
  },
  {
    name: "Early Access",
    price: "₹499",
    description:
      "Best for freelancers and small agencies who want to test with real clients.",
    badge: "Best for first users",
    features: [
      "25 campaigns per month",
      "500 leads per month",
      "50 leads per campaign",
      "AI lead analysis",
      "Personalized outreach",
      "PDF audit reports",
      "CSV export",
      "Manual account upgrade after payment",
    ],
    cta: "Upgrade on WhatsApp",
    href: whatsappUrl,
    highlighted: true,
  },
  {
    name: "Agency",
    price: "Custom",
    description:
      "For agencies that want higher limits and client prospecting at scale.",
    badge: "For teams",
    features: [
      "Custom campaign limits",
      "Custom lead limits",
      "Priority support",
      "Agency workflow support",
      "Bulk prospecting support",
      "Manual onboarding",
    ],
    cta: "Talk to us",
    href: whatsappUrl,
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-16rem] top-[8rem] h-[32rem] w-[32rem] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/30 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Pricing
            </p>

            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
              Start free. Upgrade when you need more leads.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              LeadFlow Studio helps freelancers and agencies find local leads,
              generate personalized outreach, and create PDF audit reports.
              Early access upgrades are handled manually for now.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaigns"
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              Back to Dashboard
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-300/10 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Contact for upgrade
            </a>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-[2.5rem] border p-6 shadow-2xl transition hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-cyan-300/30 bg-cyan-300/10 shadow-cyan-950/40"
                  : "border-white/10 bg-slate-900/80 shadow-cyan-950/20"
              }`}
            >
              {plan.highlighted ? (
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
              ) : null}

              <div className="relative">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black ${
                    plan.highlighted
                      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-slate-300"
                  }`}
                >
                  {plan.badge}
                </span>

                <h2 className="mt-6 text-3xl font-black tracking-[-0.03em] text-white">
                  {plan.name}
                </h2>

                <div className="mt-4 flex items-end gap-2">
                  <p className="text-5xl font-black tracking-[-0.05em] text-white">
                    {plan.price}
                  </p>

                  {plan.price !== "Custom" ? (
                    <p className="pb-2 text-sm font-bold text-slate-400">
                      / month
                    </p>
                  ) : null}
                </div>

                <p className="mt-4 min-h-[72px] text-sm leading-7 text-slate-300">
                  {plan.description}
                </p>

                <a
                  href={plan.href}
                  target={plan.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    plan.href.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-black transition ${
                    plan.highlighted
                      ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                      : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                </a>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-xs font-black text-cyan-200">
                        ✓
                      </span>

                      <p className="text-sm leading-6 text-slate-300">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                Manual upgrade process
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                How paid access works right now
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Payments are handled manually during early access. After payment,
                your account limits are upgraded by our team. This keeps the MVP
                simple while we improve the product with real user feedback.
              </p>
            </div>

            <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <ol className="space-y-4 text-sm text-slate-200">
                <li>
                  <strong className="text-white">1.</strong> Create a free
                  account and test the product.
                </li>
                <li>
                  <strong className="text-white">2.</strong> Message us on
                  WhatsApp for upgrade.
                </li>
                <li>
                  <strong className="text-white">3.</strong> Pay manually using
                  UPI or agreed payment method.
                </li>
                <li>
                  <strong className="text-white">4.</strong> Your account is
                  upgraded with higher limits.
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}