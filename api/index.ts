import fs from "node:fs";
import path from "node:path";
import express from "express";

// Create Express app immediately
const app = express();

// Middleware
app.use(express.json({
  limit: "10mb",
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 100)}`;
      }
      console.log("[express]", logLine);
    }
  });

  next();
});

// Lazy load and initialize routes
let routesInitialized = false;
let initError: Error | null = null;

app.use(async (req, res, next) => {
  if (!routesInitialized && !initError) {
    try {
      const { registerRoutes } = await import("../server/routes.js");
      await registerRoutes(app);
      routesInitialized = true;
    } catch (error) {
      console.error("[express] Failed to initialize routes:", error);
      initError = error as Error;
      return res.status(500).json({ error: "Failed to initialize server" });
    }
  }
  
  if (initError) {
    return res.status(500).json({ error: "Server initialization failed" });
  }
  
  next();
});

// Static file serving
const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    res.sendFile(indexPath);
  });
}

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[express] Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Try to initialize routes immediately on load
(async () => {
  try {
    const { registerRoutes } = await import("../server/routes.js");
    await registerRoutes(app);
    routesInitialized = true;
    console.log("[express] Routes initialized on startup");
  } catch (error) {
    console.error("[express] Failed to initialize routes on startup:", error);
  }
})();

export default app;
