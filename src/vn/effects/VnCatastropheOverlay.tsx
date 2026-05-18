import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  catastropheCellStrength,
  catastropheCycleAlpha,
  catastropheCycleProgress,
  catastropheIsDensePhase,
  catastropheTintEnvelope,
  catastropheTintExitComplete,
  computeCatastropheCellMetrics,
  vignetteHoleAxes,
  type CatastropheCellMetrics,
} from "./catastropheAscii";

/** Draw at reduced resolution, scale up with CSS. */
const RENDER_SCALE = 0.62;

type Props = {
  /** Scene still has the catastrophe screen effect active. */
  visible: boolean;
  loop?: boolean;
  paused?: boolean;
  intensity?: number;
  onDismiss?: () => void;
};

export function VnCatastropheOverlay({
  visible,
  loop = true,
  paused = false,
  intensity = 1,
  onDismiss,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountStartRef = useRef(0);
  const exitStartRef = useRef<number | null>(null);
  const metricsRef = useRef<CatastropheCellMetrics | null>(null);
  const sizeRef = useRef({ displayW: 1, displayH: 1, renderW: 1, renderH: 1 });
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const [exiting, setExiting] = useState(false);

  const beginExit = () => {
    if (exitStartRef.current != null) return;
    exitStartRef.current = performance.now();
    setExiting(true);
  };

  useLayoutEffect(() => {
    if (visible) {
      mountStartRef.current = performance.now();
      exitStartRef.current = null;
      setExiting(false);
      return;
    }
    beginExit();
  }, [visible]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    } as CanvasRenderingContext2DSettings);
    if (!ctx) return;

    const container = wrap;
    const surface = canvas;
    const context = ctx;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      const rect = container.getBoundingClientRect();
      const displayW = Math.max(1, Math.floor(rect.width));
      const displayH = Math.max(1, Math.floor(rect.height));
      const renderW = Math.max(1, Math.floor(displayW * RENDER_SCALE));
      const renderH = Math.max(1, Math.floor(displayH * RENDER_SCALE));
      sizeRef.current = { displayW, displayH, renderW, renderH };
      surface.width = renderW;
      surface.height = renderH;
      surface.style.width = `${displayW}px`;
      surface.style.height = `${displayH}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      metricsRef.current = computeCatastropheCellMetrics(renderW, renderH);
    }

    const startLoop = () => {
      resize();
      rafRef.current = requestAnimationFrame(render);
    };

    void document.fonts.ready.then(startLoop);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function render(now: number) {
      rafRef.current = requestAnimationFrame(render);

      const metrics = metricsRef.current;
      if (!metrics) return;

      const intens = Math.max(0, Math.min(1, intensity));
      if (intens <= 0) return;

      const mountElapsed = now - mountStartRef.current;
      const exitElapsed =
        exitStartRef.current == null ? null : now - exitStartRef.current;

      if (
        exitElapsed != null &&
        catastropheTintExitComplete(exitElapsed)
      ) {
        onDismiss?.();
        return;
      }

      if (paused) return;

      const cycleProgress = exiting
        ? 1
        : reducedMotion
          ? 0.3
          : catastropheCycleProgress(mountElapsed, loop);

      if (
        !loop &&
        !exiting &&
        !reducedMotion &&
        catastropheCycleProgress(mountElapsed, false) >= 1
      ) {
        beginExit();
        return;
      }

      const tintAlpha =
        catastropheTintEnvelope(mountElapsed, exitElapsed) *
        intens *
        (reducedMotion ? 0.65 : 1);

      if (tintAlpha <= 0.001 && exitElapsed != null) {
        onDismiss?.();
        return;
      }

      const hole = vignetteHoleAxes(cycleProgress);
      const letterAlpha =
        tintAlpha * catastropheCycleAlpha(cycleProgress);

      if (
        !reducedMotion &&
        !exiting &&
        catastropheIsDensePhase(hole) &&
        frameRef.current++ % 2 === 1
      ) {
        return;
      }

      const wobble = reducedMotion ? 0 : mountElapsed * 0.001;

      const { renderW, renderH } = sizeRef.current;
      context.clearRect(0, 0, renderW, renderH);
      context.font = metrics.primaryFont;
      context.textBaseline = "top";
      context.fillStyle = "rgb(190, 48, 40)";

      const { cols, rows, cellW, lineH, offsetX, offsetY, chars } = metrics;
      const strengthThreshold = 0.06;

      for (let row = 0; row < rows; row++) {
        const ny = (row + 0.5) / rows;
        for (let col = 0; col < cols; col++) {
          const nx = (col + 0.5) / cols;
          const strength = catastropheCellStrength(nx, ny, hole, wobble);
          if (strength < strengthThreshold) continue;

          const driftX =
            Math.sin(wobble * 1.5 + col * 0.48 + row * 0.27) * 0.75;
          const driftY =
            Math.cos(wobble * 1.25 + col * 0.22 + row * 0.4) * 0.65;
          const x = offsetX + col * cellW + driftX;
          const y = offsetY + row * lineH + driftY;

          context.globalAlpha = Math.min(1, strength * letterAlpha * 0.88);
          context.fillText(chars[row * cols + col]!, x, y);
        }
      }

      context.globalAlpha = 1;

      const root = wrapRef.current;
      if (root) root.style.opacity = String(tintAlpha);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      metricsRef.current = null;
      frameRef.current = 0;
    };
  }, [loop, paused, intensity, exiting, onDismiss]);

  return (
    <div
      className="vn-screen-effect vn-screen-effect--catastrophe"
      ref={wrapRef}
      aria-hidden
      style={{ opacity: 0 }}
    >
      <canvas ref={canvasRef} className="vn-screen-effect-canvas" />
    </div>
  );
}
