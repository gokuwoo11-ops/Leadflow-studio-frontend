"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RetryLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRetry() {
    setLoading(true);
    setMessage("Starting retry...");

    try {
      const response = await fetch(`/api/leads/${leadId}/retry`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Retry failed");
      }

      setMessage("Retry started. Processing in background...");
      router.refresh();

      window.setTimeout(() => {
        router.refresh();
      }, 5000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Retry failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleRetry}
        disabled={loading}
        className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Starting..." : "Retry"}
      </button>

      {message ? (
        <p className="text-xs text-slate-400">{message}</p>
      ) : null}
    </div>
  );
}