import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Alert } from "@/components/alerts-table";

let io: SocketIOServer | null = null;

export function initializeSocketIO(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io/",
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  console.log("Socket.IO server initialized");
  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function emitNewAlert(alert: Alert) {
  if (io) {
    io.emit("new-alert", alert);
    console.log("Emitted new alert:", alert.id);
  } else {
    console.warn("Socket.IO server not initialized");
  }
}

export function emitAlertUpdate(alert: Alert) {
  if (io) {
    io.emit("alert-update", alert);
    console.log("Emitted alert update:", alert.id);
  } else {
    console.warn("Socket.IO server not initialized");
  }
}

