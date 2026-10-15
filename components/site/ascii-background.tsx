"use client";

import { useEffect, useRef } from "react";

/**
 * The page's background: a field of tiny monospace characters that moves like
 * the surface of still water, and a glowing blue ripple, drawn in the same
 * characters, wherever the reader clicks.
 *
 * One fixed 2D canvas behind everything. Each frame samples a height for every
 * character cell and picks a glyph from a ramp by it, so the texture is the
 * wave itself, not a picture of one. The water is two slow, far-off sources
 * whose rings cross; a click adds a ring that runs out at RING_SPEED, trails
 * a few smaller rings behind its front, and fades over RING_LIFE.
 */

const FONT_SIZE = 11;
const CELL_W = 9;
const CELL_H = 14;

/* Glyphs from calm to crest. The water uses the quiet end only. */
const WATER = " ..·:;+";
const RING = " .·:;+*o#";

/* Strongest the water gets, as an alpha of the ink. Kept low so body text
   over it reads as if the background were plain. */
const WATER_ALPHA = 0.16;
const RING_SPEED = 380;
const RING_LIFE = 2.8;
const MAX_RINGS = 6;
/* Frame interval for the water alone; ripples run at the display's rate. */
const IDLE_MS = 1000 / 24;

type Ring = { x: number; y: number; born: number };

export function AsciiBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const glow = document.createElement("canvas");
    const glowCtx = glow.getContext("2d");
    /* A quarter-size copy of the ring: scaling it down and back up blurs it
       for free, which is the bloom. Far cheaper than a filter at full size. */
    const bloom = document.createElement("canvas");
    const bloomCtx = bloom.getContext("2d");
    if (!glowCtx || !bloomCtx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rings: Ring[] = [];
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let ink = "#888";
    let blue = "#2563eb";
    let dark = false;
    let font = `${FONT_SIZE}px monospace`;
    let frame = 0;
    let last = 0;

    function readTheme() {
      const css = getComputedStyle(document.documentElement);
      ink = css.getPropertyValue("--viz-ink").trim() || ink;
      blue = css.getPropertyValue("--viz-glow").trim() || blue;
      dark = document.documentElement.classList.contains("dark");
      const family = css.getPropertyValue("--font-geist-mono").trim();
      font = `${FONT_SIZE}px ${family ? `${family}, ` : ""}ui-monospace, monospace`;
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      cols = Math.ceil(width / CELL_W) + 1;
      rows = Math.ceil(height / CELL_H) + 1;
      for (const target of [canvas!, glow]) {
        target.width = Math.round(width * ratio);
        target.height = Math.round(height * ratio);
      }
      bloom.width = Math.max(1, Math.round(width / 4));
      bloom.height = Math.max(1, Math.round(height / 4));
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      for (const context of [ctx!, glowCtx!]) {
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
    }

    /** Height of a click ring at distance `d` from its centre, 0 to about 1. */
    function ringAt(d: number, ring: Ring, now: number) {
      const age = (now - ring.born) / 1000;
      if (age < 0 || age > RING_LIFE) return 0;
      const behind = age * RING_SPEED - d;
      /* Ahead of the front: nothing but a thin leading edge. */
      if (behind < -12) return 0;
      const front = behind < 0 ? Math.exp(-((behind / 8) ** 2)) : 1;
      /* Behind it: rings every ~50px, dying away over ~140px. */
      const trail = Math.exp(-Math.max(0, behind) / 140);
      const crest = 0.5 + 0.5 * Math.cos(behind * 0.125);
      const fade = (1 - age / RING_LIFE) ** 2;
      const spread = 1 / (1 + d / 900);
      return front * trail * crest * fade * spread;
    }

    function draw(now: number) {
      const t = now / 1000;
      const live = rings.filter((ring) => now - ring.born < RING_LIFE * 1000);
      rings.splice(0, rings.length, ...live);

      ctx!.clearRect(0, 0, width, height);
      glowCtx!.clearRect(0, 0, width, height);
      ctx!.font = font;
      glowCtx!.font = font;
      ctx!.textBaseline = "top";
      glowCtx!.textBaseline = "top";

      /* Bucket glyphs by level so each pass sets its style once. */
      const water: number[][] = Array.from({ length: WATER.length }, () => []);
      const wave: number[][] = Array.from({ length: RING.length }, () => []);

      const sources = [
        [width * 0.15, height * 1.25, 0.034, 0.8],
        [width * 1.1, -height * 0.3, 0.028, 0.62],
      ] as const;

      for (let row = 0; row < rows; row++) {
        const y = row * CELL_H;
        const cy = y + CELL_H / 2;
        for (let col = 0; col < cols; col++) {
          const x = col * CELL_W;
          const cx = x + CELL_W / 2;

          let lift = 0;
          for (const ring of rings) {
            lift += ringAt(Math.hypot(cx - ring.x, cy - ring.y), ring, now);
          }
          if (lift > 0.06) {
            const level = Math.min(RING.length - 1, 1 + Math.floor(lift * 1.3 * (RING.length - 1)));
            wave[level]!.push(x, y);
            continue;
          }

          let h = 0;
          for (const [sx, sy, k, w] of sources) {
            h += Math.sin(Math.hypot(cx - sx, cy - sy) * k - t * w);
          }
          /* -2..2 to 0..1, then keep only the crests so the field is sparse. */
          const level = Math.floor(((h + 2) / 4) ** 2.2 * WATER.length);
          if (level > 0) water[Math.min(WATER.length - 1, level)]!.push(x, y);
        }
      }

      ctx!.fillStyle = ink;
      water.forEach((cells, level) => {
        if (!cells.length) return;
        ctx!.globalAlpha = (WATER_ALPHA * level) / (WATER.length - 1);
        const glyph = WATER[level]!;
        for (let i = 0; i < cells.length; i += 2) ctx!.fillText(glyph, cells[i]!, cells[i + 1]!);
      });
      ctx!.globalAlpha = 1;

      if (!rings.length) return;

      glowCtx!.fillStyle = blue;
      wave.forEach((cells, level) => {
        if (!cells.length) return;
        glowCtx!.globalAlpha = Math.min(1, 0.45 + level / (RING.length - 1));
        const glyph = RING[level]!;
        for (let i = 0; i < cells.length; i += 2) glowCtx!.fillText(glyph, cells[i]!, cells[i + 1]!);
      });
      glowCtx!.globalAlpha = 1;

      /* The glow: the ring shrunk to a quarter, softened, and stretched back
         under itself, twice, so it reads as light around each glyph. Added as
         light on a dark page, laid on as a blue haze on a light one. */
      bloomCtx!.clearRect(0, 0, bloom.width, bloom.height);
      bloomCtx!.filter = "blur(2px)";
      bloomCtx!.drawImage(glow, 0, 0, bloom.width, bloom.height);
      bloomCtx!.filter = "none";
      ctx!.save();
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.imageSmoothingEnabled = true;
      ctx!.globalCompositeOperation = dark ? "lighter" : "source-over";
      ctx!.globalAlpha = 1;
      ctx!.drawImage(bloom, 0, 0, canvas!.width, canvas!.height);
      ctx!.drawImage(bloom, 0, 0, canvas!.width, canvas!.height);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.globalAlpha = 1;
      ctx!.drawImage(glow, 0, 0);
      ctx!.restore();
    }

    function tick(now: number) {
      frame = 0;
      if (document.hidden) return;
      if (rings.length || now - last >= IDLE_MS) {
        last = now;
        draw(now);
      }
      if (!still.matches) frame = requestAnimationFrame(tick);
    }

    function start() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (still.matches) draw(0);
      else frame = requestAnimationFrame(tick);
    }

    function onClick(event: MouseEvent) {
      if (still.matches) return;
      rings.push({ x: event.clientX, y: event.clientY, born: performance.now() });
      if (rings.length > MAX_RINGS) rings.shift();
      if (!frame) start();
    }

    function onResize() {
      resize();
      if (still.matches) draw(0);
    }

    readTheme();
    resize();
    start();

    const theme = new MutationObserver(() => {
      readTheme();
      if (still.matches) draw(0);
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", onResize);
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", start);
    still.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      theme.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", start);
      still.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 select-none"
    />
  );
}
