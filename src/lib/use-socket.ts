"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Alert } from "@/components/alerts-table";

interface UseSocketOptions {
  onNewAlert?: (alert: Alert) => void;
  onAlertUpdate?: (alert: Alert) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<UseSocketOptions>({});

  // Update callback function references, but not trigger re-connection
  useEffect(() => {
    callbacksRef.current = options;
  }, [options.onNewAlert, options.onAlertUpdate]);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") {
      return;
    }

    // Get socket URL, if not set use current host
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;

    console.log("Connecting to Socket.IO server:", socketUrl);

    // Initialize socket connection
    const socket = io(socketUrl, {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection successful
    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
    });

    // Connection failed
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    // Listen for new alerts (using ref to get the latest callback function)
    socket.on("new-alert", (alert: Alert) => {
      console.log("Received new alert:", alert);
      callbacksRef.current.onNewAlert?.(alert);
    });

    // Listen for alert updates (using ref to get the latest callback function)
    socket.on("alert-update", (alert: Alert) => {
      console.log("Received alert update:", alert);
      callbacksRef.current.onAlertUpdate?.(alert);
    });

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Only connect once when the component is mounted

  return socketRef.current;
}
