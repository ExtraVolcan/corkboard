import { prepareWithSegments } from "@chenglou/pretext";

const WORD = "CATASTROPHE";
const CHARSET = [...new Set(WORD.split(""))].filter((c) => c !== " ").join("");
const WEIGHTS = [400, 600, 800] as const;
const FONT_SIZE = 11;
const FONT_FAMILY = '"Special Elite", Georgia, "Times New Roman", serif';

export type CatastrophePaletteEntry = {
  char: string;
  font: string;
  width: number;
  brightness: number;
};

export type CatastropheGlyph = {
  char: string;
  font: string;
};

const brightnessCanvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;
if (brightnessCanvas) {
  brightnessCanvas.width = 24;
  brightnessCanvas.height = 24;
}
const brightnessCtx = brightnessCanvas?.getContext("2d", {
  willReadFrequently: true,
});

function estimateBrightness(ch: string, font: string): number {
  if (!brightnessCtx || !brightnessCanvas) return 0.5;
  const size = 24;
  brightnessCtx.clearRect(0, 0, size, size);
  brightnessCtx.font = font;
  brightnessCtx.fillStyle = "#fff";
  brightnessCtx.textBaseline = "middle";
  brightnessCtx.fillText(ch, 1, size / 2);
  const data = brightnessCtx.getImageData(0, 0, size, size).data;
  let sum = 0;
  for (let i = 3; i < data.length; i += 4) sum += data[i]!;
  return sum / (255 * size * size);
}

function measureWidth(ch: string, font: string): number {
  const prepared = prepareWithSegments(ch, font);
  return prepared.widths.length > 0 ? prepared.widths[0]! : 0;
}

let paletteCache: CatastrophePaletteEntry[] | null = null;

export function clearCatastrophePaletteCache(): void {
  paletteCache = null;
}

export function getCatastrophePalette(): CatastrophePaletteEntry[] {
  if (paletteCache) return paletteCache;
  const palette: CatastrophePaletteEntry[] = [];
  for (const weight of WEIGHTS) {
    const font = `${weight} ${FONT_SIZE}px ${FONT_FAMILY}`;
    for (const ch of CHARSET) {
      const width = measureWidth(ch, font);
      if (width <= 0) continue;
      palette.push({
        char: ch,
        font,
        width,
        brightness: estimateBrightness(ch, font),
      });
    }
  }
  const maxB = Math.max(...palette.map((e) => e.brightness), 1e-6);
  for (const entry of palette) entry.brightness /= maxB;
  palette.sort((a, b) => a.brightness - b.brightness);
  paletteCache = palette;
  return palette;
}

export function buildCatastropheGlyphLookup(
  targetCellW: number
): CatastropheGlyph[] {
  const palette = getCatastrophePalette();
  const lookup: CatastropheGlyph[] = new Array(256);

  function findBest(targetBrightness: number): CatastrophePaletteEntry {
    let lo = 0;
    let hi = palette.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (palette[mid]!.brightness < targetBrightness) lo = mid + 1;
      else hi = mid;
    }
    let bestScore = Infinity;
    let best = palette[lo]!;
    const start = Math.max(0, lo - 12);
    const end = Math.min(palette.length, lo + 12);
    for (let i = start; i < end; i++) {
      const entry = palette[i]!;
      const brightnessError = Math.abs(entry.brightness - targetBrightness) * 2.5;
      const widthError = Math.abs(entry.width - targetCellW) / targetCellW;
      const score = brightnessError + widthError;
      if (score < bestScore) {
        bestScore = score;
        best = entry;
      }
    }
    return best;
  }

  for (let byte = 0; byte < 256; byte++) {
    const brightness = byte / 255;
    if (brightness < 0.04) {
      lookup[byte] = { char: " ", font: `400 ${FONT_SIZE}px ${FONT_FAMILY}` };
      continue;
    }
    const match = findBest(brightness);
    lookup[byte] = { char: match.char, font: match.font };
  }
  return lookup;
}

export type CatastropheParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function createCatastropheParticles(
  count: number,
  width: number,
  height: number
): CatastropheParticle[] {
  const particles: CatastropheParticle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(width, height) * 0.35;
    particles.push({
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    });
  }
  return particles;
}

export type FieldStamp = {
  radiusX: number;
  radiusY: number;
  sizeX: number;
  sizeY: number;
  values: Float32Array;
};

function spriteAlphaAt(normalizedDistance: number): number {
  if (normalizedDistance >= 1) return 0;
  if (normalizedDistance <= 0.35) {
    return 0.45 + (0.15 - 0.45) * (normalizedDistance / 0.35);
  }
  return 0.15 * (1 - (normalizedDistance - 0.35) / 0.65);
}

export function createFieldStamp(
  radiusPx: number,
  fieldScaleX: number,
  fieldScaleY: number
): FieldStamp {
  const fieldRadiusX = radiusPx * fieldScaleX;
  const fieldRadiusY = radiusPx * fieldScaleY;
  const radiusX = Math.ceil(fieldRadiusX);
  const radiusY = Math.ceil(fieldRadiusY);
  const sizeX = radiusX * 2 + 1;
  const sizeY = radiusY * 2 + 1;
  const values = new Float32Array(sizeX * sizeY);
  for (let y = -radiusY; y <= radiusY; y++) {
    for (let x = -radiusX; x <= radiusX; x++) {
      const normalizedDistance = Math.sqrt(
        (x / fieldRadiusX) ** 2 + (y / fieldRadiusY) ** 2
      );
      values[(y + radiusY) * sizeX + x + radiusX] =
        spriteAlphaAt(normalizedDistance);
    }
  }
  return { radiusX, radiusY, sizeX, sizeY, values };
}

export function splatFieldStamp(
  field: Float32Array,
  fieldCols: number,
  fieldRows: number,
  centerX: number,
  centerY: number,
  fieldScaleX: number,
  fieldScaleY: number,
  stamp: FieldStamp
): void {
  const gridCenterX = Math.round(centerX * fieldScaleX);
  const gridCenterY = Math.round(centerY * fieldScaleY);
  for (let y = -stamp.radiusY; y <= stamp.radiusY; y++) {
    const gridY = gridCenterY + y;
    if (gridY < 0 || gridY >= fieldRows) continue;
    const fieldRowOffset = gridY * fieldCols;
    const stampRowOffset = (y + stamp.radiusY) * stamp.sizeX;
    for (let x = -stamp.radiusX; x <= stamp.radiusX; x++) {
      const gridX = gridCenterX + x;
      if (gridX < 0 || gridX >= fieldCols) continue;
      const stampValue = stamp.values[stampRowOffset + x + stamp.radiusX]!;
      if (stampValue === 0) continue;
      const fieldIndex = fieldRowOffset + gridX;
      field[fieldIndex] = Math.min(1, field[fieldIndex]! + stampValue);
    }
  }
}

export function applyVignetteBase(
  field: Float32Array,
  fieldCols: number,
  fieldRows: number,
  intensity: number,
  timeMs: number
): void {
  const cx = fieldCols * 0.5;
  const cy = fieldRows * 0.42;
  for (let row = 0; row < fieldRows; row++) {
    for (let col = 0; col < fieldCols; col++) {
      const dx = (col - cx) / (fieldCols * 0.48);
      const dy = (row - cy) / (fieldRows * 0.48);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pulse = 0.9 + 0.1 * Math.sin(timeMs * 0.0009 + dist * 3.2);
      const edge = Math.min(1, Math.max(0, (dist - 0.28) * 1.45));
      const v = edge * intensity * pulse;
      const idx = row * fieldCols + col;
      field[idx] = Math.max(field[idx]!, v);
    }
  }
}

export const CATASTROPHE_GRID = {
  fontSize: FONT_SIZE,
  lineHeight: 13,
  fieldOversample: 2,
  particleCount: 48,
  spriteRadius: 12,
  fieldDecay: 0.86,
} as const;
