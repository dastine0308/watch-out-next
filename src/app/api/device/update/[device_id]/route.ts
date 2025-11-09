import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ device_id: string }> },
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

  const { device_id } = await params;

  if (!device_id) {
    return NextResponse.json(
      { error: "Device ID is required" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { device_name, location } = body;

    if (!device_name && !location) {
      return NextResponse.json(
        { error: "At least one field (device_name or location) is required" },
        { status: 400 },
      );
    }

    const updateData: { device_name?: string; location?: string } = {};
    if (device_name) updateData.device_name = device_name;
    if (location) updateData.location = location;

    const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/device/update/${device_id}`;

    console.log(`Attempting to update device: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch {
        // If response is not JSON, return error
        return NextResponse.json(
          { error: "Invalid response from server" },
          { status: 500 },
        );
      }

      if (response.status !== 200) {
        return NextResponse.json(
          { error: data.error || "Failed to update device" },
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
