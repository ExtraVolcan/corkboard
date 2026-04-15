/**
 * Normalized campaign storage (PostgreSQL): profiles + entries tables.
 * One-time migration from legacy campaign_state JSON row when profiles is empty.
 */

/** @param {import('pg').Pool} pool */
export async function ensureCampaignTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaign_state (
      id smallint PRIMARY KEY CHECK (id = 1),
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id text PRIMARY KEY,
      name text NOT NULL DEFAULT '',
      image text NOT NULL DEFAULT '',
      name_revealed boolean NOT NULL DEFAULT false,
      image_revealed boolean NOT NULL DEFAULT false,
      profile_revealed boolean NOT NULL DEFAULT false,
      sort_order int NOT NULL DEFAULT 0
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      profile_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      id text NOT NULL,
      text text NOT NULL DEFAULT '',
      revealed boolean NOT NULL DEFAULT false,
      sort_order int NOT NULL DEFAULT 0,
      PRIMARY KEY (profile_id, id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS uploaded_images (
      id uuid PRIMARY KEY,
      data bytea NOT NULL,
      mime_type text NOT NULL DEFAULT 'application/octet-stream',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

/**
 * @param {import('pg').Pool} pool
 * @param {string} id uuid
 * @param {Buffer} buffer
 * @param {string} mimeType
 */
export async function saveUploadedImage(pool, id, buffer, mimeType) {
  await pool.query(
    `INSERT INTO uploaded_images (id, data, mime_type) VALUES ($1, $2, $3)`,
    [id, buffer, mimeType || "application/octet-stream"]
  );
}

/**
 * @param {import('pg').Pool} pool
 * @param {string} id uuid
 * @returns {Promise<{ data: Buffer; mimeType: string } | null>}
 */
export async function getUploadedImage(pool, id) {
  const { rows } = await pool.query(
    `SELECT data, mime_type FROM uploaded_images WHERE id = $1`,
    [id]
  );
  if (!rows[0]) return null;
  return { data: rows[0].data, mimeType: rows[0].mime_type };
}

/** @param {import('pg').Pool} pool */
export async function countProfiles(pool) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS c FROM profiles"
  );
  return rows[0].c;
}

/** @param {import('pg').Pool} pool */
export async function loadLegacyJsonBlob(pool) {
  const { rows } = await pool.query(
    "SELECT data FROM campaign_state WHERE id = 1"
  );
  const raw = rows[0]?.data;
  if (raw == null) return null;
  if (typeof raw === "string") return JSON.parse(raw);
  return raw;
}

/**
 * @param {import('pg').Pool} pool
 * @param {{ profiles: unknown[] }} data
 */
export async function replaceCampaignRelational(pool, data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM entries");
    await client.query("DELETE FROM profiles");
    let pOrder = 0;
    for (const p of data.profiles) {
      await client.query(
        `INSERT INTO profiles (
          id, name, image, name_revealed, image_revealed, profile_revealed, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          String(p.id),
          String(p.name ?? ""),
          String(p.image ?? ""),
          Boolean(p.nameRevealed),
          Boolean(p.imageRevealed),
          Boolean(p.profileRevealed),
          pOrder++,
        ]
      );
      let eOrder = 0;
      for (const e of p.entries || []) {
        await client.query(
          `INSERT INTO entries (profile_id, id, text, revealed, sort_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            String(p.id),
            String(e.id),
            String(e.text ?? ""),
            e.revealed === true,
            eOrder++,
          ]
        );
      }
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/** @param {import('pg').Pool} pool */
export async function getCampaignRelational(pool) {
  const { rows: profiles } = await pool.query(
    `SELECT id, name, image, name_revealed, image_revealed, profile_revealed
     FROM profiles ORDER BY sort_order, id`
  );
  if (profiles.length === 0) {
    return { profiles: [] };
  }
  const ids = profiles.map((p) => p.id);
  const { rows: entries } = await pool.query(
    `SELECT profile_id, id, text, revealed FROM entries
     WHERE profile_id = ANY($1::text[])
     ORDER BY profile_id, sort_order, id`,
    [ids]
  );
  const byId = new Map();
  for (const p of profiles) {
    byId.set(p.id, {
      id: p.id,
      name: p.name,
      image: p.image,
      nameRevealed: p.name_revealed,
      imageRevealed: p.image_revealed,
      profileRevealed: p.profile_revealed,
      entries: [],
    });
  }
  for (const e of entries) {
    const prof = byId.get(e.profile_id);
    if (prof) {
      prof.entries.push({
        id: e.id,
        text: e.text,
        revealed: e.revealed,
      });
    }
  }
  return { profiles: [...byId.values()] };
}

/**
 * Create tables; if profiles empty, migrate legacy JSON or seed.
 * @param {import('pg').Pool} pool
 * @param {() => Promise<{ profiles: unknown[] }>} readSeed
 */
export async function initRelationalCampaign(pool, readSeed) {
  await ensureCampaignTables(pool);
  const n = await countProfiles(pool);
  if (n > 0) return;

  const legacy = await loadLegacyJsonBlob(pool);
  if (legacy?.profiles?.length) {
    await replaceCampaignRelational(pool, legacy);
    console.log(
      "[corkboard] Migrated campaign from campaign_state into profiles + entries"
    );
    return;
  }

  const seed = await readSeed();
  await replaceCampaignRelational(pool, seed);
  console.log("[corkboard] Seeded profiles + entries from seed.json");
}
