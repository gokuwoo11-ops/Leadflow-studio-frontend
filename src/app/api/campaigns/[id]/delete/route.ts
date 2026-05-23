import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing campaign ID",
        },
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
        {
          success: false,
          error: "You must be logged in to archive a campaign.",
        },
        { status: 401 }
      );
    }

    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id,user_id,status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (campaignError) {
      return NextResponse.json(
        {
          success: false,
          error: campaignError.message,
        },
        { status: 500 }
      );
    }

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found or you do not have access.",
        },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("campaigns")
      .update({
        status: "archived",
        archived_at: now,
        deleted_at: now,
        updated_at: now,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Campaign archived successfully.",
      campaign_id: id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to archive campaign.",
      },
      { status: 500 }
    );
  }
}