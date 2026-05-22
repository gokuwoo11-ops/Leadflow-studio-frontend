"use client";

import React, { useState } from "react";

const normalizeWebsiteUrl = (url?: string) => {
  if (!url) return undefined;
  const trimmed = String(url).trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export default function LeadActions({ lead, pdfUrl, outreachText }: any) {
  const [copied, setCopied] = useState(false);

  const copyOutreach = async () => {
    if (!outreachText) {
      alert("Outreach not found in leads table.");
      return;
    }

    try {
      await navigator.clipboard.writeText(String(outreachText));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      alert("Unable to copy outreach. Try again.");
    }
  };

  const websiteHref = normalizeWebsiteUrl(lead?.website);
  const safePdfUrl = normalizeWebsiteUrl(pdfUrl);

  return (
        <div className="relative z-30 flex flex-wrap gap-2 pointer-events-auto">
      {outreachText ? (
        <button
          type="button"
          onClick={copyOutreach}
          className="inline-flex cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          {copied ? "Copied" : "Copy outreach"}
        </button>
      ) : null}

      {websiteHref ? (
        <a
          href={websiteHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          Open website
        </a>
      ) : null}
    </div>
  );
}