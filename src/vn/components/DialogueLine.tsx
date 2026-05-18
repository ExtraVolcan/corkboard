import { useMemo, type CSSProperties } from "react";
import type { VnTextEffect } from "../effects/types";

function segmentGraphemes(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...seg.segment(text)].map((s) => s.segment);
  }
  return [...text];
}

type Props = {
  text: string;
  className?: string;
  textEffect?: VnTextEffect;
};

export function DialogueLine({ text, className, textEffect }: Props) {
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const graphemes = useMemo(() => segmentGraphemes(text), [text]);

  if (textEffect !== "jitter" || reduceMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={`${className ?? ""} vn-line--jitter`.trim()}>
      {graphemes.map((g, i) => (
        <span
          key={`${i}-${g}`}
          className="vn-line-jitter-char"
          style={{ "--vn-j-i": i } as CSSProperties}
        >
          {g === " " ? "\u00a0" : g}
        </span>
      ))}
    </p>
  );
}
