import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> },
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

  const { user_id } = await params;

  let apiUrl: string;
  if (user_id) {
    apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/user/${user_id}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      return NextResponse.json(
        { error: "Failed to get user data" },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "User ID is required" }, { status: 400 });
}
