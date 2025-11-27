import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";
import express, { type Express } from "express";

import runApp from "./app";

export async function setupProduction(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use("*", (req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      res.sendFile(indexPath);
    });
  }
}

// Start the server immediately in production
(async () => {
  await runApp(setupProduction);
})();
