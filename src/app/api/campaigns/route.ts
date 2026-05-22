import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pdf-api-bw6a.onrender.com";

function inferTargetBusiness(searchKeyword: string) {
  const keyword = String(searchKeyword || "").trim();
  if (!keyword) return "";
  const match = keyword.match(/^(.*?)\s+(?:in|near|around)\s+/i);
  return match ? match[1].trim() : keyword;
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/campaigns`, {
      method: "GET",
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load campaigns",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to create a campaign",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const leadSearchKeyword = String(body.lead_search_keyword ?? body.search_keyword ?? "");
    const targetBusiness =
      String(body.target_business ?? body.targetBusiness ?? "").trim() ||
      inferTargetBusiness(leadSearchKeyword);

    const requestBody = {
      ...body,
      user_id: user.id,
      location: body.target_location ?? body.location,
      service_offered: body.service_offer ?? body.service_offered,
      serviceOffered: body.service_offer ?? body.service_offered,
      search_keyword: leadSearchKeyword || body.search_keyword,
      leadSearchKeyword: leadSearchKeyword || body.leadSearchKeyword,
      idealTargetCustomer:
        body.ideal_target_customer ?? body.idealTargetCustomer,
      niche: body.ideal_target_customer ?? body.niche,
      target_business: targetBusiness || body.target_business,
      targetBusiness: targetBusiness || body.targetBusiness,
    };

    console.log("[Create Campaign Proxy] outgoing request body", requestBody);

    const response = await fetch(`${BACKEND_URL}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    const responseText = await response.clone().text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { success: false, error: responseText };
    }

    console.log("[Create Campaign Proxy] backend response", {
      status: response.status,
      body: data,
    });

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create campaign",
      },
      { status: 500 }
    );
  }
}