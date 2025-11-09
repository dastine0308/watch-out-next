import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let apiBaseUrl =
      process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      console.error("API_BASE_URL environment variable is not set");
      return NextResponse.json(
        { error: "API base URL is not configured" },
        { status: 500 },
      );
    }

    apiBaseUrl = apiBaseUrl.replace(/\/$/, "");

    const apiUrl = `${apiBaseUrl}/user/register`;
    console.log(`Attempting to connect to: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      return NextResponse.json(data, { status: response.status });
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

        if (
          fetchError.message.includes("ECONNREFUSED") ||
          fetchError.message.includes("Connect Timeout")
        ) {
          console.error(`Connection failed to ${apiUrl}:`, fetchError.message);
          return NextResponse.json(
            {
              error: "Connection failed",
              message:
                "Cannot connect to the backend server. Please check if the server is running and the IP address and port are correct",
            },
            { status: 503 },
          );
        }

        throw fetchError;
      }

      throw fetchError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
