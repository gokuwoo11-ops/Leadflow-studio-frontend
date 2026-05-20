import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pdf-api-bw6a.onrender.com";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const requestBody = await request.text();
    const response = await fetch(`${BACKEND_URL}/campaigns/${id}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody.length ? requestBody : undefined,
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to start campaign",
      },
      { status: 500 }
    );
  }
}
