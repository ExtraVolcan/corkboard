import { useEffect, useRef, useState } from "react";
import {
  catastropheCellStrength,
  catastropheCycleAlpha,
  catastropheCycleProgress,
  catastropheIsDensePhase,
  computeCatastropheCellMetrics,
  vignetteHoleAxes,
  type CatastropheCellMetrics,
} from "./catastropheAscii";

/** Draw at reduced resolution, scale up with CSS. */
const RENDER_SCALE = 0.62;

type Props = {
  active: boolean;
  loop?: boolean;
  paused?: boolean;
  intensity?: number;
};

export function VnCatastropheOverlay({
  active,
  loop = true,
  paused = false,
  intensity = 1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cycleStartRef = useRef(0);
  const metricsRef = useRef<CatastropheCellMetrics | null>(null);
  const sizeRef = useRef({ displayW: 1, displayH: 1, renderW: 1, renderH: 1 });
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const cycleDoneRef = useRef(false);
  const [cycleDone, setCycleDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    cycleStartRef.current = performance.now();
    cycleDoneRef.current = false;
    setCycleDone(false);
  }, [active]);

  useEffect(() => {
    if (!active) return;
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
      if (paused) return;

      const metrics = metricsRef.current;
      if (!metrics) return;

      const intens = Math.max(0, Math.min(1, intensity));
      if (intens <= 0) return;

      const elapsed = now - cycleStartRef.current;
      if (
        !loop &&
        !paused &&
        !reducedMotion &&
        catastropheCycleProgress(elapsed, false) >= 1
      ) {
        if (!cycleDoneRef.current) {
          cycleDoneRef.current = true;
          setCycleDone(true);
        }
        return;
      }

      if (paused) return;

      const { renderW, renderH } = sizeRef.current;
      const cycleProgress = reducedMotion
        ? 0.3
        : catastropheCycleProgress(elapsed, loop);
      const hole = vignetteHoleAxes(cycleProgress);
      const globalAlpha =
        catastropheCycleAlpha(cycleProgress) *
        intens *
        (reducedMotion ? 0.65 : 1);

      if (
        !reducedMotion &&
        catastropheIsDensePhase(hole) &&
        frameRef.current++ % 2 === 1
      ) {
        return;
      }

      const wobble = reducedMotion ? 0 : elapsed * 0.001;

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

          context.globalAlpha = Math.min(1, strength * globalAlpha * 0.88);
          context.fillText(chars[row * cols + col]!, x, y);
        }
      }

      context.globalAlpha = 1;
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      metricsRef.current = null;
      frameRef.current = 0;
    };
  }, [active, loop, paused, intensity]);

  if (!active || (!loop && cycleDone)) return null;

  return (
    <div
      className="vn-screen-effect vn-screen-effect--catastrophe"
      ref={wrapRef}
      aria-hidden
    >
      <canvas ref={canvasRef} className="vn-screen-effect-canvas" />
    </div>
  );
}
