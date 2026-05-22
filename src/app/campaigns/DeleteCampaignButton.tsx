"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCampaignButton({
  campaignId,
  campaignName,
}: {
  campaignId: string;
  campaignName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteCampaign() {
    const confirmed = window.confirm(
      `Delete "${campaignName}"?\n\nThis will remove the campaign from your dashboard. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.error || "Failed to delete campaign");
        return;
      }

      router.refresh();
    } catch {
      alert("Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteCampaign}
      disabled={deleting}
      className="inline-flex w-fit rounded-2xl border border-rose-300/20 bg-rose-300/10 px-5 py-3 text-sm font-bold text-rose-100 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}