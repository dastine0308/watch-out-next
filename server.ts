import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initializeSocketIO } from "./src/lib/socket-server";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  initializeSocketIO(httpServer);

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

process.on("SIGTERM", () => {
  console.log(">> SIGTERM received, shutting down server.");
  process.exit(0);
});
