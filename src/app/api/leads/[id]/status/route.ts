import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const allowedStatuses = [
  "New",
  "Contacted",
  "Replied",
  "Interested",
  "Proposal Sent",
  "Closed",
  "Not Interested",
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const leadId = String(id || "").trim();

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: "Missing lead ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = String(body.status || "").trim();

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, campaign_id")
      .eq("id", leadId)
      .maybeSingle();

    if (leadError) {
      return NextResponse.json(
        { success: false, error: leadError.message },
        { status: 500 }
      );
    }

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("id", lead.campaign_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (campaignError) {
      return NextResponse.json(
        { success: false, error: campaignError.message },
        { status: 500 }
      );
    }

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Not allowed to update this lead" },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update status",
      },
      { status: 500 }
    );
  }
}