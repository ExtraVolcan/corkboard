/**
 * Serves the Vite build + campaign API.
 * Storage: PostgreSQL when DATABASE_URL is set, else JSON file (local dev).
 */
import "dotenv/config";
import express from "express";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import pg from "pg";
import {
  getCampaignRelational,
  initRelationalCampaign,
  replaceCampaignRelational,
} from "./campaign-persist.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const seedPath = path.join(root, "src", "data", "seed.json");
const defaultFileDb = path.join(__dirname, "data", "campaign.json");

const { Pool } = pg;
const app = express();
app.use(express.json({ limit: "4mb" }));

const PORT = Number(process.env.PORT) || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-change-me";
const DATABASE_URL = process.env.DATABASE_URL;
const CAMPAIGN_FILE = process.env.CAMPAIGN_FILE || defaultFileDb;

let pool = null;
if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl:
      process.env.PGSSLMODE === "disable"
        ? false
        : { rejectUnauthorized: false },
  });
}

async function readSeed() {
  const raw = await fs.readFile(seedPath, "utf8");
  return JSON.parse(raw);
}

async function initDb() {
  if (pool) {
    await initRelationalCampaign(pool, readSeed);
    return;
  }

  await fs.mkdir(path.dirname(CAMPAIGN_FILE), { recursive: true });
  try {
    await fs.access(CAMPAIGN_FILE);
  } catch {
    const seed = await readSeed();
    await fs.writeFile(CAMPAIGN_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function getCampaignFromDb() {
  const data = await getCampaignRelational(pool);
  if (data.profiles.length === 0) {
    const seed = await readSeed();
    await replaceCampaignRelational(pool, seed);
    return seed;
  }
  return data;
}

async function setCampaignInDb(data) {
  await replaceCampaignRelational(pool, data);
}

async function getCampaignFromFile() {
  const raw = await fs.readFile(CAMPAIGN_FILE, "utf8");
  return JSON.parse(raw);
}

async function setCampaignInFile(data) {
  const tmp = `${CAMPAIGN_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, CAMPAIGN_FILE);
}

async function getCampaign() {
  if (pool) return getCampaignFromDb();
  return getCampaignFromFile();
}

async function setCampaign(data) {
  if (!isValidCampaign(data)) {
    const err = new Error("Invalid campaign shape");
    err.statusCode = 400;
    throw err;
  }
  if (pool) await setCampaignInDb(data);
  else await setCampaignInFile(data);
}

function isValidCampaign(data) {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.profiles) &&
    data.profiles.every(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        Array.isArray(p.entries)
    )
  );
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    jwt.verify(h.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body ?? {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
});

app.get("/api/auth/me", (req, res) => {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return res.json({ admin: false });
  }
  try {
    jwt.verify(h.slice(7), JWT_SECRET);
    return res.json({ admin: true });
  } catch {
    return res.json({ admin: false });
  }
});

app.get("/api/campaign", async (req, res) => {
  try {
    const data = await getCampaign();
    res.set("Cache-Control", "private, no-store, must-revalidate");
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load campaign" });
  }
});

app.put("/api/campaign", authMiddleware, async (req, res) => {
  try {
    await setCampaign(req.body);
    res.json({ ok: true });
  } catch (e) {
    if (e.statusCode === 400) {
      return res.status(400).json({ error: e.message });
    }
    console.error(e);
    res.status(500).json({ error: "Failed to save" });
  }
});

app.post("/api/campaign/reset", authMiddleware, async (req, res) => {
  try {
    const seed = await readSeed();
    await setCampaign(seed);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to reset" });
  }
});

app.use(express.static(dist, { index: "index.html", fallthrough: true }));

/**
 * SPA fallback: send index.html for client routes (React Router).
 * Must run AFTER express.static so /assets/* is never replaced with HTML
 * (which would break CSS/JS and look like "no styling").
 * Avoid app.get('*', …) — path-to-regexp can treat '*' oddly in Express 4.21+.
 */
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api")) return next();
  if (req.path.startsWith("/assets/")) return next();
  const indexHtml = path.join(dist, "index.html");
  res.sendFile(indexHtml, (err) => {
    if (err) next(err);
  });
});

const indexHtmlPath = path.join(dist, "index.html");
if (!existsSync(indexHtmlPath)) {
  console.error(
    `[corkboard] FATAL: ${indexHtmlPath} not found. Run "npm run build" before "npm start", and set Render Root Directory to the corkboard folder.`
  );
  process.exit(1);
}

await initDb();

app.listen(PORT, () => {
  console.log(
    `Corkboard server on port ${PORT} (${pool ? "PostgreSQL" : `file ${CAMPAIGN_FILE}`})`
  );
  console.log(`[corkboard] Serving static from ${dist}`);
});
