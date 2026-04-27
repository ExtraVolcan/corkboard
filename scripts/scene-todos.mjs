import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const scenesDir = path.join(root, "src", "vn", "scenes");
const assetsFile = path.join(root, "src", "vn", "assets.ts");
const seedFile = path.join(root, "src", "data", "seed.json");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function unique(list) {
  return [...new Set(list)].sort();
}

function allSceneFiles() {
  if (!fs.existsSync(scenesDir)) return [];
  const out = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (
        name.endsWith(".ts") &&
        name !== "index.ts" &&
        !full.endsWith(path.join("scenes", "characters.ts"))
      ) {
        out.push(full);
      }
    }
  };
  walk(scenesDir);
  return out;
}

function collectMatches(text, regex, group = 1) {
  const out = [];
  for (const m of text.matchAll(regex)) out.push(m[group]);
  return out;
}

function parseRegistryIds(text, constName) {
  const block = new RegExp(
    `export\\s+const\\s+${constName}(?:\\s*:\\s*[^=]+)?\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`,
    "m"
  ).exec(text)?.[1];
  if (!block) return [];
  return unique(collectMatches(block, /["']([^"']+)["']\s*:/g));
}

function loadCampaignTargets() {
  const seed = JSON.parse(read(seedFile));
  const profileIds = new Set();
  const entryByProfile = new Map();
  for (const p of seed.profiles ?? []) {
    profileIds.add(p.id);
    entryByProfile.set(
      p.id,
      new Set((p.entries ?? []).map((e) => e.id))
    );
  }
  return { profileIds, entryByProfile };
}

/** Mirrors `canonicalSpeakerId` in speakerLabel.ts */
function canonicalSpeakerId(speakerId) {
  return speakerId.replace(/-\?\?\?$/, "");
}

/**
 * Objects containing `speakerId:` (brace-balanced), with optional `emotion` / `portraitId`.
 * Skips nested `{` … `}` inside the same walk by matching depth from `{` before `speakerId`.
 */
function extractSpeakerLineBlocks(text) {
  const blocks = [];
  const re = /\bspeakerId\s*:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const speakerId = m[1];
    const idx = m.index;
    const blockStart = text.lastIndexOf("{", idx);
    if (blockStart === -1) continue;
    let depth = 0;
    let j = blockStart;
    for (; j < text.length; j++) {
      const c = text[j];
      if (c === "{") depth += 1;
      else if (c === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const block = text.slice(blockStart, j + 1);
    const emotion = /\bemotion\s*:\s*["']([^"']+)["']/.exec(block)?.[1];
    const portraitId = /\bportraitId\s*:\s*["'](?:portrait:)?([^"']+)["']/.exec(
      block
    )?.[1];
    blocks.push({ speakerId, emotion, portraitId });
  }
  return blocks;
}

/**
 * If neither explicit portrait nor emotion keys resolve in VN_PORTRAITS, return a hint
 * string (aligned with resolvePortraitForSnapshot + narrator → detective inner monologue).
 */
function describeMissingEmotionPortrait(line, knownPortraits) {
  const pid = line.portraitId?.replace(/^portrait:/, "") ?? "";
  if (pid && knownPortraits.has(pid)) return null;

  const em = line.emotion?.trim();
  if (!em) return null;

  const base = canonicalSpeakerId(line.speakerId);
  const portraitSpeak =
    base === "narrator" ? "detective" : base;

  const composite = `${portraitSpeak}-${em}`;
  if (knownPortraits.has(composite)) return null;
  if (knownPortraits.has(em)) return null;

  return composite !== em ? `${composite} · or "${em}"` : composite;
}

function run() {
  const sceneFiles = allSceneFiles();
  const sceneText = sceneFiles.map((f) => read(f)).join("\n");
  const assetsText = read(assetsFile);
  const { profileIds, entryByProfile } = loadCampaignTargets();

  const knownBackgrounds = new Set(parseRegistryIds(assetsText, "VN_BACKGROUNDS"));
  const knownPortraits = new Set(parseRegistryIds(assetsText, "VN_PORTRAITS"));

  const usedBackgrounds = unique(collectMatches(sceneText, /["'`]bg:([\w-]+)["'`]/g));
  const usedPortraits = unique(
    collectMatches(sceneText, /portraitId\s*:\s*["'`](?:portrait:)?([\w-]+)["'`]/g)
  );
  const usedUnlockProfiles = unique(
    collectMatches(sceneText, /profileId\s*:\s*["'`]([\w-]+)["'`]/g)
  );

  const missingBackgrounds = usedBackgrounds.filter((id) => !knownBackgrounds.has(id));
  const missingPortraits = usedPortraits.filter((id) => !knownPortraits.has(id));
  const missingUnlockProfiles = usedUnlockProfiles.filter((id) => !profileIds.has(id));

  const missingEmotionPortraitHints = unique(
    extractSpeakerLineBlocks(sceneText)
      .map((line) => describeMissingEmotionPortrait(line, knownPortraits))
      .filter(Boolean)
  );

  const missingUnlockEntries = [];
  for (const m of sceneText.matchAll(
    /type\s*:\s*["'`]revealEntry["'`][\s\S]*?profileId\s*:\s*["'`]([\w-]+)["'`][\s\S]*?entryId\s*:\s*["'`]([\w-]+)["'`]/g
  )) {
    const profileId = m[1];
    const entryId = m[2];
    const entries = entryByProfile.get(profileId);
    if (!entries || !entries.has(entryId)) {
      missingUnlockEntries.push(`${profileId}.${entryId}`);
    }
  }

  console.log("Scene TODO report");
  console.log("=================");
  console.log(`Scene files scanned: ${sceneFiles.length}`);
  console.log("");

  const sections = [
    ["Missing backgrounds (bg:<id>)", missingBackgrounds],
    ["Missing portraits (portrait:<id>)", missingPortraits],
    [
      "Missing portrait emotion registry keys (VN_PORTRAITS composite or bare emotion)",
      missingEmotionPortraitHints,
    ],
    ["Missing unlock profile targets", missingUnlockProfiles],
    ["Missing unlock entry targets (profile.entry)", unique(missingUnlockEntries)],
  ];

  let totalMissing = 0;
  for (const [title, items] of sections) {
    console.log(title);
    if (!items.length) {
      console.log("  - none");
    } else {
      totalMissing += items.length;
      for (const item of items) console.log(`  - ${item}`);
    }
    console.log("");
  }

  if (totalMissing > 0) {
    process.exitCode = 1;
    console.log(`Found ${totalMissing} missing scene dependency item(s).`);
  } else {
    console.log("No missing dependencies found.");
  }
}

run();

