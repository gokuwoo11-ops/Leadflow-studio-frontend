import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkCampaignUsageLimit } from "@/lib/supabase/usage-limits";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pdf-api-bw6a.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to create a campaign.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const leadsRequested = Math.max(Number(body.leads_requested || 10) || 10, 1);

    const usage = await checkCampaignUsageLimit({
      supabase,
      userId: user.id,
      requestedLeads: leadsRequested,
    });

    if (!usage.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: usage.error || "Usage limit reached.",
          usage,
        },
        { status: 403 }
      );
    }

    const payload = {
      ...body,
      user_id: user.id,
      leads_requested: leadsRequested,
      status: body.status || "ready",
    };

    const response = await fetch(`${BACKEND_URL}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || `Backend campaign create failed: ${response.status}`,
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: data.campaign,
      usage,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create campaign.",
      },
      { status: 500 }
    );
  }
}