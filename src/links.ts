const LINK_RE = /\[\[([a-zA-Z0-9_-]+)\]\]/g;

/** Profile ids mentioned in text (for graph edges). */
export function parseMentionedProfileIds(text: string): string[] {
  const ids: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(LINK_RE.source, "g");
  while ((m = re.exec(text)) !== null) ids.push(m[1]);
  return ids;
}

export type TextSegment =
  | { type: "text"; value: string }
  | { type: "link"; profileId: string; label: string };

export function parseEntryText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(LINK_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: "text", value: text.slice(last, m.index) });
    segments.push({ type: "link", profileId: m[1], label: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: "text", value: text.slice(last) });
  return segments;
}
