import { NextRequest, NextResponse } from "next/server";
import { getIO, emitNewAlert } from "@/lib/socket-server";
import { Alert } from "@/components/alerts-table";

export async function POST(request: NextRequest) {
  try {
    // Webhook certification
    const apiKey = request.headers.get("x-api-key");
    const token = request.cookies.get("auth-token")?.value;

    const allowedApiKey = process.env.WEBHOOK_API_KEY;

    if (!apiKey && !token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing API key or token" },
        { status: 401 },
      );
    }

    if (apiKey && allowedApiKey && apiKey !== allowedApiKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 401 },
      );
    }

    const io = getIO();
    if (!io) {
      return NextResponse.json(
        { error: "Socket.IO server not initialized" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const alert: Alert = {
      id: body.id || `alert-${Date.now()}`,
      title: body.title || "New Alert",
      status: body.status || "unhandled",
      description: body.description || "",
      timeAgo: body.timeAgo || "just now",
      location: body.location || "",
    };

    emitNewAlert(alert);

    return NextResponse.json({
      success: true,
      message: "Alert notified to all clients",
      alert,
    });
  } catch (error) {
    console.error("Error notifying alert:", error);
    return NextResponse.json(
      { error: "Failed to notify alert" },
      { status: 500 },
    );
  }
}
