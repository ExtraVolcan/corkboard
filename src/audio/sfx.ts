const SFX_PREFS_KEY = "mystery-vn-sfx-v1";

export type SfxKind =
  | "advance"
  | "select"
  | "submit"
  | "success"
  | "error"
  | "panel";

export type SfxPrefs = {
  enabled: boolean;
  volume: number; // 0..1
};

const DEFAULT_PREFS: SfxPrefs = { enabled: true, volume: 0.55 };
let audioContext: AudioContext | null = null;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function loadSfxPrefs(): SfxPrefs {
  try {
    const raw = localStorage.getItem(SFX_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<SfxPrefs>;
    return {
      enabled: parsed.enabled ?? DEFAULT_PREFS.enabled,
      volume: clamp01(parsed.volume ?? DEFAULT_PREFS.volume),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveSfxPrefs(prefs: SfxPrefs): SfxPrefs {
  const safe = { enabled: prefs.enabled, volume: clamp01(prefs.volume) };
  try {
    localStorage.setItem(SFX_PREFS_KEY, JSON.stringify(safe));
  } catch {
    // ignore storage issues
  }
  return safe;
}

function ensureAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioContext) return audioContext;
  try {
    audioContext = new window.AudioContext();
  } catch {
    return null;
  }
  return audioContext;
}

function tone(
  ctx: AudioContext,
  opts: {
    at: number;
    hz: number;
    gain: number;
    attackMs?: number;
    decayMs?: number;
    waveform?: OscillatorType;
  }
): void {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const attack = (opts.attackMs ?? 6) / 1000;
  const decay = (opts.decayMs ?? 80) / 1000;
  osc.type = opts.waveform ?? "triangle";
  osc.frequency.setValueAtTime(opts.hz, opts.at);
  g.gain.setValueAtTime(0.0001, opts.at);
  g.gain.exponentialRampToValueAtTime(
    Math.max(0.0002, opts.gain),
    opts.at + attack
  );
  g.gain.exponentialRampToValueAtTime(0.0001, opts.at + attack + decay);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(opts.at);
  osc.stop(opts.at + attack + decay + 0.03);
}

export function playSfx(kind: SfxKind, prefs: SfxPrefs): void {
  if (!prefs.enabled || prefs.volume <= 0.001) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  const v = prefs.volume;
  const now = ctx.currentTime;
  switch (kind) {
    case "advance":
      tone(ctx, { at: now, hz: 360, gain: 0.06 * v, decayMs: 55 });
      break;
    case "select":
      tone(ctx, { at: now, hz: 540, gain: 0.07 * v, decayMs: 60 });
      break;
    case "submit":
      tone(ctx, { at: now, hz: 420, gain: 0.07 * v, decayMs: 65 });
      tone(ctx, { at: now + 0.05, hz: 610, gain: 0.05 * v, decayMs: 70 });
      break;
    case "success":
      tone(ctx, { at: now, hz: 520, gain: 0.06 * v, decayMs: 80 });
      tone(ctx, { at: now + 0.06, hz: 660, gain: 0.06 * v, decayMs: 85 });
      break;
    case "error":
      tone(ctx, {
        at: now,
        hz: 210,
        gain: 0.08 * v,
        decayMs: 95,
        waveform: "sawtooth",
      });
      break;
    case "panel":
      tone(ctx, { at: now, hz: 460, gain: 0.05 * v, decayMs: 45 });
      break;
  }
}
