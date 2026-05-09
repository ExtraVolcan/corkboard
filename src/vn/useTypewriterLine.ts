import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Milliseconds between characters for `speed` 0–99 (100 = instant elsewhere).
 * Uses (1 - u)^k so low speeds stay leisurely while high speeds bend sharply toward almost-instant.
 */
function msPerCharacter(speed: number): number {
  const clamped = Math.max(0, Math.min(99, speed));
  const u = clamped / 99;
  const slowest = 72;
  const fastest = 5;
  const k = 3.1;
  const curve = Math.pow(1 - u, k);
  return Math.round(fastest + (slowest - fastest) * curve);
}

/**
 * Typewriter reveal for dialogue lines. At textSpeed >= 100, full text is shown immediately.
 * Call `skipToEnd()` on click while incomplete to snap to full text without advancing.
 */
export function useTypewriterLine(
  text: string,
  enabled: boolean,
  textSpeed: number
): {
  visibleText: string;
  isRevealComplete: boolean;
  skipToEnd: () => void;
} {
  const instant = textSpeed >= 100;
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    clearTimer();
    if (!enabled) {
      setRevealed(0);
      return;
    }
    if (!text.length) {
      setRevealed(0);
      return;
    }
    if (instant) {
      setRevealed(text.length);
      return;
    }
    setRevealed(1);
    if (text.length <= 1) return;
    const ms = msPerCharacter(textSpeed);
    timerRef.current = window.setInterval(() => {
      setRevealed((prev) => {
        if (prev >= text.length) return prev;
        const next = prev + 1;
        if (next >= text.length && timerRef.current != null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return next;
      });
    }, ms);
    return clearTimer;
  }, [enabled, text, textSpeed, instant, clearTimer]);

  const skipToEnd = useCallback(() => {
    clearTimer();
    setRevealed(text.length);
  }, [text.length, clearTimer]);

  const visibleText = instant ? text : text.slice(0, revealed);
  const isRevealComplete = instant || revealed >= text.length;

  return { visibleText, isRevealComplete, skipToEnd };
}
