import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pdf-api-bw6a.onrender.com";

export async function POST(
  _request: Request,
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

    const response = await fetch(
      `${BACKEND_URL}/leads/${encodeURIComponent(leadId)}/retry`,
      {
        method: "POST",
        cache: "no-store",
      }
    );

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();

      return NextResponse.json(
        {
          success: false,
          error: "Backend returned non-JSON response",
          status: response.status,
          preview: text.slice(0, 400),
        },
        { status: response.status || 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Retry failed",
      },
      { status: 500 }
    );
  }
}