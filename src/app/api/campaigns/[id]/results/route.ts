import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pdf-api-bw6a.onrender.com";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const response = await fetch(`${BACKEND_URL}/campaigns/${id}/results`, {
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
            : "Failed to fetch campaign results",
      },
      { status: 500 }
    );
  }
}
