"use client";

import { useState } from "react";

export default function CopyAllOutreachButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text.trim()) {
      alert("No outreach messages available to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Unable to copy all outreach messages.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
    >
      {copied ? "Copied All Outreach!" : "Copy All Outreach"}
    </button>
  );
}