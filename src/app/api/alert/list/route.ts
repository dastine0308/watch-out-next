import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

  const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/alert/list`;
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
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.status !== 200) {
      return NextResponse.json(
        { error: data.error || "Failed to get alerts list" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error parsing alerts list:", error);
    throw new Error("Failed to parse alerts list");
  }
}
