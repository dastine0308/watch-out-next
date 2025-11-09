import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const { uid, device_name, location } = body;

    if (!uid || !device_name || !location) {
      return NextResponse.json(
        { error: "Missing required fields: uid, device_name, location" },
        { status: 400 },
      );
    }

    const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/device/register`;

    console.log(`Attempting to register device: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, device_name, location }),
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.status !== 200 && response.status !== 201) {
        return NextResponse.json(
          { error: data.error || "Failed to register device" },
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
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
