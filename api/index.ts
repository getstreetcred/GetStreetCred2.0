import fs from "node:fs";
import path from "node:path";
import express from "express";
import { registerRoutes } from "../server/routes";

// Create Express app
const app = express();

// Middleware - must be set up BEFORE routes
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
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log("[express]", logLine);
    }
  });

  next();
});

// Flag to track if routes are initialized
let routesInitialized = false;
let initPromise: Promise<void> | null = null;

async function initializeRoutes() {
  if (routesInitialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await registerRoutes(app);
        routesInitialized = true;
      } catch (error) {
        console.error("[express] Failed to register routes:", error);
        throw error;
      }
    })();
  }
  await initPromise;
}

// Middleware to ensure routes are initialized before handling requests
app.use(async (req, res, next) => {
  if (!routesInitialized) {
    try {
      await initializeRoutes();
    } catch (error) {
      return res.status(500).json({ error: "Failed to initialize server" });
    }
  }
  next();
});

// After routes are set up, add static file serving and error handler
// These will be added after the first request initializes routes
app.use((req, res, next) => {
  // This runs after routes, so static files won't interfere
  const distPath = path.resolve(import.meta.dirname, "public");
  if (fs.existsSync(distPath)) {
    express.static(distPath)(req, res, next);
  } else {
    next();
  }
});

// Catch-all for index.html
app.get("*", (req, res) => {
  const distPath = path.resolve(import.meta.dirname, "public");
  const indexPath = path.resolve(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Error handler (final)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[express] Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Initialize routes immediately for best performance
initializeRoutes().catch(err => {
  console.error("[express] Failed to initialize routes on startup:", err);
});

export default app;
