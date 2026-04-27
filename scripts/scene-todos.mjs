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

