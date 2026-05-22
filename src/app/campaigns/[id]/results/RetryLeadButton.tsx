"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RetryLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function retryLead() {
    setLoading(true);

    try {
     const res = await fetch(
  `https://pdf-api-bw6a.onrender.com/leads/${leadId}/retry`,
  {
    method: "POST",
  }
);

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Retry failed");
        return;
      }

      router.refresh();
    } catch {
      alert("Retry failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={retryLead}
      disabled={loading}
      className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20 disabled:opacity-60"
    >
      {loading ? "Retrying..." : "Retry Lead"}
    </button>
  );
}