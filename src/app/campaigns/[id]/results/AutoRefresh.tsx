"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({
  enabled,
  intervalMs = 12000,
}: {
  enabled: boolean;
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [enabled, intervalMs, router]);

  if (!enabled) return null;

  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100">
      Auto-refresh is active while this campaign is still processing...
    </div>
  );
}