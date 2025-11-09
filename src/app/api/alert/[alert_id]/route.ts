import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alert_id: string }> },
) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiBaseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: "API base URL is not configured" },
      { status: 500 },
    );
  }

  const { alert_id } = await params;
  const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/alert/${alert_id}`;

  console.log(`Attempting to connect to: ${apiUrl}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.status !== 200) {
      return NextResponse.json(
        { error: data.error || "Failed to get alert detail" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (fetchError: unknown) {
    clearTimeout(timeoutId);
    if (fetchError instanceof Error) {
      if (fetchError.name === "AbortError") {
        console.error("Request timeout after 30 seconds");
        return NextResponse.json(
          {
            error: "Connection timeout",
            message:
              "Cannot connect to the backend server. Please check if the server is running and the IP address and port are correct",
          },
          { status: 504 },
        );
      }
    }
    return NextResponse.json(
      {
        error: "Connection failed",
        message:
          "Cannot connect to the backend server. Please check if the server is running and the IP address and port are correct",
      },
      { status: 503 },
    );
  }
}
