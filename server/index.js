/**
 * Serves the Vite build + campaign API.
 * Storage: PostgreSQL when DATABASE_URL is set, else JSON file (local dev).
 */
import "dotenv/config";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import pg from "pg";

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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaign_state (
        id smallint PRIMARY KEY CHECK (id = 1),
        data jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    const { rowCount } = await pool.query(
      "SELECT 1 FROM campaign_state WHERE id = 1"
    );
    if (rowCount === 0) {
      const seed = await readSeed();
      await pool.query(
        "INSERT INTO campaign_state (id, data) VALUES (1, $1::jsonb)",
        [JSON.stringify(seed)]
      );
    }
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
  const { rows } = await pool.query(
    "SELECT data FROM campaign_state WHERE id = 1"
  );
  if (!rows[0]) {
    const seed = await readSeed();
    await pool.query(
      "INSERT INTO campaign_state (id, data) VALUES (1, $1::jsonb)",
      [JSON.stringify(seed)]
    );
    return seed;
  }
  return rows[0].data;
}

async function setCampaignInDb(data) {
  await pool.query(
    `UPDATE campaign_state SET data = $1::jsonb, updated_at = now() WHERE id = 1`,
    [JSON.stringify(data)]
  );
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

app.use(express.static(dist));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) next(err);
  });
});

await initDb();

app.listen(PORT, () => {
  console.log(
    `Corkboard server on port ${PORT} (${pool ? "PostgreSQL" : `file ${CAMPAIGN_FILE}`})`
  );
});
