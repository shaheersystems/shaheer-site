/**
 * The shape behind the ambient graphic: a wide plane of dots, seen low and in
 * perspective, whose surface rolls like slow water. Three sine swells at
 * unrelated angles and speeds — never repeating in a way the eye can catch,
 * but deterministic, so every visit sees the same sea.
 *
 * Lives apart from both renderers because the WebGL canvas and the no-GPU SVG
 * fallback must draw the *same* object from the *same* camera. The height
 * function below is written twice — once here in JS, once in the vertex shader
 * — and the two are kept term-for-term identical.
 *
 * Nothing here touches a browser API, so it is safe to import on the server.
 */

/** Grid resolution. ~4.6k points: one draw call, trivial for any GPU. */
export const COLS = 128;
export const ROWS = 36;

/** World size of the plane. Wide enough that its far edge still overfills a
 *  3.5:1 strip, so the sides never show where the sea ends. */
export const WIDTH = 30;
export const DEPTH = 11;

export const CAMERA = {
  fov: 30,
  position: [0, 2.2, 7.2] as const,
  target: [0, 0, 0.9] as const,
};

/**
 * Where the clock starts. Not zero: at t=0 the three swells line up and the
 * surface is at its flattest. Shared so the fallback holds the same frame the
 * canvas opens on.
 */
export const START_TIME = 12;

/**
 * Surface height at a point and time. Mirrored exactly by `heightAt` in the
 * vertex shader — change one, change both.
 */
export function heightAt(x: number, z: number, t: number): number {
  return (
    0.34 * Math.sin(x * 0.42 + t * 0.32) * Math.cos(z * 0.55 - t * 0.21) +
    0.17 * Math.sin((x + z) * 0.78 - t * 0.47) +
    0.07 * Math.sin(x * 1.63 - z * 1.21 + t * 0.73)
  );
}

/** The GLSL twin of `heightAt`. */
export const HEIGHT_GLSL = /* glsl */ `
  float heightAt(float x, float z, float t) {
    return 0.34 * sin(x * 0.42 + t * 0.32) * cos(z * 0.55 - t * 0.21)
         + 0.17 * sin((x + z) * 0.78 - t * 0.47)
         + 0.07 * sin(x * 1.63 - z * 1.21 + t * 0.73);
  }
`;

/** Flat (x, 0, z) positions for every dot, row-major, back row first. */
export function buildGrid(): Float32Array {
  const positions = new Float32Array(COLS * ROWS * 3);
  let i = 0;
  for (let row = 0; row < ROWS; row++) {
    const z = (row / (ROWS - 1) - 0.5) * DEPTH;
    for (let col = 0; col < COLS; col++) {
      positions[i++] = (col / (COLS - 1) - 0.5) * WIDTH;
      positions[i++] = 0;
      positions[i++] = z;
    }
  }
  return positions;
}

/* ---------------------------------------------------------------------------
   Fallback projection

   The still SVG is one frame of the same field, projected through the same
   pinhole camera three.js uses. Each dot is a zero-length segment with a round
   cap — `M x y h0` — so thousands of dots land as a single path per depth
   band instead of thousands of <circle> nodes.
--------------------------------------------------------------------------- */

type Vec3 = [number, number, number];

const sub = (a: readonly number[], b: readonly number[]): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Aspect the fallback is authored at; `slice` crops it to the real box. */
const FALLBACK_ASPECT = 3.6;
/** Depth bands, far to near, and the opacity each one carries. */
const BANDS = [0.25, 0.45, 0.7] as const;

export function buildFallbackPaths() {
  const eye = CAMERA.position;
  const forward = norm(sub(CAMERA.target, eye));
  const right = norm(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const f = 1 / Math.tan((CAMERA.fov * Math.PI) / 360);

  // Normalized device space scaled into a 360×100 box.
  const W = 100 * FALLBACK_ASPECT;
  const H = 100;
  const parts: string[][] = BANDS.map(() => []);

  for (let row = 0; row < ROWS; row++) {
    const z = (row / (ROWS - 1) - 0.5) * DEPTH;
    const band = Math.min(
      BANDS.length - 1,
      Math.floor((row / ROWS) * BANDS.length),
    );
    for (let col = 0; col < COLS; col++) {
      const x = (col / (COLS - 1) - 0.5) * WIDTH;
      const rel = sub([x, heightAt(x, z, START_TIME), z], eye);
      const depth = dot(rel, forward);
      const ndcX = (dot(rel, right) * f) / (depth * FALLBACK_ASPECT);
      const ndcY = (dot(rel, up) * f) / depth;
      if (Math.abs(ndcX) > 1.05 || Math.abs(ndcY) > 1.05) continue;
      const px = round(((ndcX + 1) / 2) * W);
      const py = round(((1 - ndcY) / 2) * H);
      parts[band].push(`M${px} ${py}h0`);
    }
  }

  return {
    viewBox: `0 0 ${W} ${H}`,
    bands: BANDS.map((opacity, i) => ({ opacity, d: parts[i].join("") })),
  };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
