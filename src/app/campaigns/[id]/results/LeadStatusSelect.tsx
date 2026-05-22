"use client";

import { useState } from "react";

const statuses = [
  "New",
  "Contacted",
  "Replied",
  "Interested",
  "Proposal Sent",
  "Closed",
  "Not Interested",
];

export default function LeadStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus?: string | null;
}) {
  const [status, setStatus] = useState(currentStatus || "New");
  const [saving, setSaving] = useState(false);

  async function updateStatus(nextStatus: string) {
    setStatus(nextStatus);
    setSaving(true);

    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update status");
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        onChange={(event) => updateStatus(event.target.value)}
        disabled={saving}
        className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold text-white outline-none transition focus:border-cyan-300 disabled:opacity-60"
      >
        {statuses.map((item) => (
          <option key={item} value={item} className="bg-slate-950 text-white">
            {item}
          </option>
        ))}
      </select>

      {saving ? <p className="text-xs text-slate-400">Saving...</p> : null}
    </div>
  );
}