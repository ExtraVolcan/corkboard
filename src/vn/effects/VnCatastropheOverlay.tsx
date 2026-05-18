import { useEffect, useRef } from "react";
import {
  applyVignetteBase,
  buildCatastropheGlyphLookup,
  CATASTROPHE_GRID,
  clearCatastrophePaletteCache,
  createCatastropheParticles,
  createFieldStamp,
  splatFieldStamp,
  type CatastropheGlyph,
  type CatastropheParticle,
  type FieldStamp,
} from "./catastropheAscii";

type Props = {
  active: boolean;
  paused?: boolean;
  /** 0–1 vignette / motion strength */
  intensity?: number;
};

export function VnCatastropheOverlay({
  active,
  paused = false,
  intensity = 1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    particles: CatastropheParticle[];
    field: Float32Array;
    fieldCols: number;
    fieldRows: number;
    fieldScaleX: number;
    fieldScaleY: number;
    cols: number;
    rows: number;
    glyphLookup: CatastropheGlyph[];
    targetCellW: number;
    particleStamp: FieldStamp;
    attractorStamp: FieldStamp;
    width: number;
    height: number;
  } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const container = wrap;
    const surface = canvas;
    const context = ctx;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function layoutGrid(w: number, h: number) {
      const cols = Math.max(
        24,
        Math.min(72, Math.floor(w / CATASTROPHE_GRID.lineHeight))
      );
      const rows = Math.max(
        16,
        Math.min(42, Math.floor(h / CATASTROPHE_GRID.lineHeight))
      );
      const targetRowW = w;
      const targetCellW = targetRowW / cols;
      const fieldOversample = CATASTROPHE_GRID.fieldOversample;
      const fieldCols = cols * fieldOversample;
      const fieldRows = rows * fieldOversample;
      const fieldScaleX = fieldCols / w;
      const fieldScaleY = fieldRows / h;
      return {
        cols,
        rows,
        targetCellW,
        fieldCols,
        fieldRows,
        fieldScaleX,
        fieldScaleY,
        glyphLookup: buildCatastropheGlyphLookup(targetCellW),
        field: new Float32Array(fieldCols * fieldRows),
        particles: createCatastropheParticles(
          reducedMotion ? 12 : CATASTROPHE_GRID.particleCount,
          w,
          h
        ),
        particleStamp: createFieldStamp(
          CATASTROPHE_GRID.spriteRadius,
          fieldScaleX,
          fieldScaleY
        ),
        attractorStamp: createFieldStamp(22, fieldScaleX, fieldScaleY),
        width: w,
        height: h,
      };
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current = layoutGrid(w, h);
    }

    const startLoop = () => {
      resize();
      rafRef.current = requestAnimationFrame(render);
    };

    void document.fonts.ready.then(() => {
      clearCatastrophePaletteCache();
      startLoop();
    });

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let lastFrame = 0;
    const frameSkipMs = reducedMotion ? 80 : 0;

    function render(now: number) {
      rafRef.current = requestAnimationFrame(render);
      if (paused) return;
      if (frameSkipMs > 0 && now - lastFrame < frameSkipMs) return;
      lastFrame = now;

      const st = stateRef.current;
      if (!st) return;
      const {
        cols,
        rows,
        field,
        fieldCols,
        fieldRows,
        fieldScaleX,
        fieldScaleY,
        glyphLookup,
        particles,
        particleStamp,
        attractorStamp,
        width,
        height,
      } = st;
      const fieldOversample = CATASTROPHE_GRID.fieldOversample;
      const intens = Math.max(0, Math.min(1, intensity));

      for (let i = 0; i < field.length; i++) field[i] = 0;

      applyVignetteBase(field, fieldCols, fieldRows, intens, now);

      if (!reducedMotion && intens > 0.05) {
        const ax = width / 2 + Math.cos(now * 0.0007) * width * 0.22;
        const ay = height / 2 + Math.sin(now * 0.001) * height * 0.2;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]!;
          const dx = ax - p.x;
          const dy = ay - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          p.vx += (dx / dist) * 0.14;
          p.vy += (dy / dist) * 0.14;
          p.vx += (Math.random() - 0.5) * 0.18;
          p.vy += (Math.random() - 0.5) * 0.18;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x += width;
          if (p.x > width) p.x -= width;
          if (p.y < 0) p.y += height;
          if (p.y > height) p.y -= height;
        }
        for (let i = 0; i < field.length; i++) {
          field[i] = field[i]! * CATASTROPHE_GRID.fieldDecay;
        }
        for (const p of particles) {
          splatFieldStamp(
            field,
            fieldCols,
            fieldRows,
            p.x,
            p.y,
            fieldScaleX,
            fieldScaleY,
            particleStamp
          );
        }
        splatFieldStamp(
          field,
          fieldCols,
          fieldRows,
          ax,
          ay,
          fieldScaleX,
          fieldScaleY,
          attractorStamp
        );
      }

      context.clearRect(0, 0, width, height);
      context.textBaseline = "top";
      context.fillStyle = "rgba(180, 40, 32, 0.82)";

      for (let row = 0; row < rows; row++) {
        const y = row * CATASTROPHE_GRID.lineHeight;
        const fieldRowStart = row * fieldOversample * fieldCols;
        for (let col = 0; col < cols; col++) {
          const fieldColStart = col * fieldOversample;
          let brightness = 0;
          for (let sy = 0; sy < fieldOversample; sy++) {
            const sampleRowOffset = fieldRowStart + sy * fieldCols + fieldColStart;
            for (let sx = 0; sx < fieldOversample; sx++) {
              brightness += field[sampleRowOffset + sx]!;
            }
          }
          const samples = fieldOversample * fieldOversample;
          const byte = Math.min(
            255,
            ((brightness / samples) * 255 * intens) | 0
          );
          const glyph = glyphLookup[byte]!;
          if (glyph.char === " ") continue;
          context.font = glyph.font;
          context.fillText(glyph.char, col * st.targetCellW, y);
        }
      }
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      stateRef.current = null;
    };
  }, [active, paused, intensity]);

  if (!active) return null;

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
