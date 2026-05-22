"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AccountMenu({
  email,
}: {
  email?: string | null;
}) {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const initial = email?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300 text-sm font-black text-slate-950">
        {initial}
      </div>

      <div className="hidden max-w-[180px] sm:block">
        <p className="truncate text-xs font-bold text-white">
          {email || "Signed in"}
        </p>
        <p className="text-[11px] text-slate-500">Workspace account</p>
      </div>

      <button
        type="button"
        onClick={signOut}
        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
      >
        Switch
      </button>
    </div>
  );
}