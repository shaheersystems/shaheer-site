/**
 * The shape behind the ambient graphic: a stepped isometric field of cubes —
 * a thing under construction, drawn as edges only.
 *
 * Lives apart from both renderers because the WebGL canvas and the no-GPU SVG
 * fallback must draw the *same* object. A fallback that invents its own
 * arrangement is a different graphic wearing the same slot.
 *
 * Nothing here touches a browser API, so it is safe to import on the server.
 */

/** Edge length of one cube, in lattice units. */
export const CUBE = 1;
/** Air between neighbours. Small enough to read as a stack, wide enough that
 *  the hairlines never merge into a solid. */
const GAP = 0.09;
const STEP = CUBE + GAP;

/**
 * Where the camera sits, as a direction from the origin. Exported because the
 * still fallback projects through the same basis — the two renderers must
 * agree on the viewpoint, not just on the shape.
 *
 * The textbook isometric elevation, 30° above the ground plane. Worth stating
 * because the horizontal spread does not depend on it at all — the screen-right
 * vector is (1, 0, −1)/√2 for any elevation — while the depth separation
 * between rows depends on it entirely. Flatten it and the three rows collapse
 * onto each other into a single dense band.
 */
export const CAMERA_DIR: readonly [number, number, number] = [1, 0.82, 1];

/**
 * Column heights, back row to front. Authored rather than generated: a random
 * skyline reads as noise, and this one has a deliberate silhouette — peaks
 * off-center, never two towers adjacent, never a flat run wider than two.
 */
const HEIGHTS: number[][] = [
  [2, 1, 3, 1, 2, 1, 3, 1, 2],
  [3, 1, 4, 2, 1, 3, 1, 4, 2],
];

const COLS = HEIGHTS[0].length;
const ROWS = HEIGHTS.length;
const MAX_LEVEL = Math.max(...HEIGHTS.flat()) - 1;

export type Cube = {
  /** Center of the cube in lattice space, y measured from the ground plane. */
  x: number;
  y: number;
  z: number;
  /** Stable [0,1) offset into the placement cycle. */
  phase: number;
  /** 0 at ground level, 1 at the tallest cube. Drives how far a cube fades. */
  depth: number;
};

/**
 * Knuth multiplicative hash, avalanched. Used instead of sequential offsets so
 * neighbouring cubes land far apart in the cycle — with `i / count` the pops
 * sweep the lattice like a wiper, which reads mechanical rather than alive.
 *
 * `Math.random()` is never called anywhere in this file: the graphic is an
 * identity mark, and it has to look identical across sessions, across reloads,
 * and across the WebGL-to-fallback boundary.
 */
function hash01(n: number): number {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/**
 * Every cube in the lattice, centered on the origin in x and z.
 *
 * The grid is laid along the *screen* diagonals, not along the world axes:
 * a column step moves +x and −z together, a row step moves +x and +z together.
 * This is the usual isometric tiling trick, and it is the difference between a
 * band that runs across the strip and one that runs off the corner of it.
 * Under a camera sitting diagonally to the world axes, a run along +x alone
 * travels down the frame as fast as across it — which is exactly the ribbon
 * this arrangement avoids.
 *
 * The cubes themselves stay axis-aligned, so each still shows the three faces
 * that make it read as a cube.
 */
export function buildCubes(): Cube[] {
  const cubes: Cube[] = [];
  const colCenter = (COLS - 1) / 2;
  const rowCenter = (ROWS - 1) / 2;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // The half-step is what makes the depth visible. A row step moves purely
      // *up* the frame — screen-x depends only on `a` — so without it the back
      // row would draw directly on top of the front one, adding lines and no
      // information. Offset by half a column, the rows interleave and read as
      // two ranks receding.
      const a = (col - colCenter + row * 0.5) * STEP; // across the frame
      const b = (row - rowCenter) * STEP; // into the frame
      const height = HEIGHTS[row][col];

      for (let level = 0; level < height; level++) {
        cubes.push({
          x: a + b,
          y: level * STEP + CUBE / 2,
          z: -a + b,
          phase: hash01(cubes.length * 2654435761),
          depth: MAX_LEVEL === 0 ? 0 : level / MAX_LEVEL,
        });
      }
    }
  }
  return cubes;
}

/**
 * The 12 edges of a unit cube as corner-index pairs, against the corner table
 * built in `cubeEdgeVertices`.
 */
const EDGES: readonly [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0], // bottom face
  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4], // top face
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7], // verticals
];

/**
 * Flat vertex buffers for a `THREE.LineSegments`: every cube merged into one
 * geometry, so the whole graphic is a single draw call and the per-frame
 * animation is a uniform update rather than 68 matrix writes.
 */
export function buildLineBuffers(cubes: Cube[]) {
  const vertsPerCube = EDGES.length * 2;
  const total = cubes.length * vertsPerCube;

  const positions = new Float32Array(total * 3);
  const phases = new Float32Array(total);
  const depths = new Float32Array(total);

  const h = CUBE / 2;
  let v = 0;

  for (const cube of cubes) {
    // Corner i is addressed by its bits: x from bit 0, z from bit 1, y from
    // bit 2. That ordering is what the EDGES table above indexes into.
    const corners: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      corners.push([
        cube.x + (i & 1 ? h : -h),
        cube.y + (i & 4 ? h : -h),
        cube.z + (i & 2 ? h : -h),
      ]);
    }

    for (const [a, b] of EDGES) {
      for (const corner of [corners[a], corners[b]]) {
        positions[v * 3] = corner[0];
        positions[v * 3 + 1] = corner[1];
        positions[v * 3 + 2] = corner[2];
        phases[v] = cube.phase;
        depths[v] = cube.depth;
        v++;
      }
    }
  }

  return { positions, phases, depths };
}

/* ---------------------------------------------------------------------------
   Fallback projection

   The still SVG is a frame of the same lattice from the same viewpoint, so it
   projects through the camera's own basis rather than through a textbook
   isometric one — at this elevation the two differ visibly.

   It draws the full wireframe, all twelve edges. That is a ~7KB `d` string,
   which would be hard to justify in the HTML payload and costs nothing here:
   the fallback is built on the client, after mount, only on machines that
   failed to get a context, and lands as one attribute on one node.
--------------------------------------------------------------------------- */

/**
 * Screen-space right and up vectors for a camera at `CAMERA_DIR` looking at
 * the origin — the same basis three.js derives internally from `lookAt`.
 */
function viewBasis() {
  const length = Math.hypot(...CAMERA_DIR);
  const f = CAMERA_DIR.map((v) => v / length) as [number, number, number];

  // right = normalize(worldUp × forward), with worldUp = (0, 1, 0)
  const right: [number, number, number] = [f[2], 0, -f[0]];
  const rightLength = Math.hypot(...right);
  const r = right.map((v) => v / rightLength) as [number, number, number];

  // up = forward × right
  const u: [number, number, number] = [
    f[1] * r[2] - f[2] * r[1],
    f[2] * r[0] - f[0] * r[2],
    f[0] * r[1] - f[1] * r[0],
  ];

  return { r, u };
}

const { r: VIEW_RIGHT, u: VIEW_UP } = viewBasis();

function project(x: number, y: number, z: number): [number, number] {
  return [
    x * VIEW_RIGHT[0] + y * VIEW_RIGHT[1] + z * VIEW_RIGHT[2],
    // SVG's y axis points down, the camera's points up.
    -(x * VIEW_UP[0] + y * VIEW_UP[1] + z * VIEW_UP[2]),
  ];
}

/**
 * One `d` string covering every edge of every cube, plus the viewBox that
 * frames it. A single path element rather than 900 lines: same pixels, one
 * node.
 */
export function buildFallbackPath(cubes: Cube[]) {
  const h = CUBE / 2;
  const parts: string[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const move = ([px, py]: [number, number]) => `M${round(px)} ${round(py)}`;
  const line = ([px, py]: [number, number]) => `L${round(px)} ${round(py)}`;

  for (const cube of cubes) {
    // Same corner addressing as buildLineBuffers: x from bit 0, z from bit 1,
    // y from bit 2.
    const c: [number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const point = project(
        cube.x + (i & 1 ? h : -h),
        cube.y + (i & 4 ? h : -h),
        cube.z + (i & 2 ? h : -h),
      );
      if (point[0] < minX) minX = point[0];
      if (point[0] > maxX) maxX = point[0];
      if (point[1] < minY) minY = point[1];
      if (point[1] > maxY) maxY = point[1];
      c.push(point);
    }

    parts.push(
      // bottom face, top face, then the four verticals between them
      move(c[0]) + line(c[1]) + line(c[3]) + line(c[2]) + "Z",
      move(c[4]) + line(c[5]) + line(c[7]) + line(c[6]) + "Z",
      move(c[0]) + line(c[4]),
      move(c[1]) + line(c[5]),
      move(c[2]) + line(c[6]),
      move(c[3]) + line(c[7]),
    );
  }

  const pad = 0.2;
  return {
    d: parts.join(""),
    viewBox: [
      round(minX - pad),
      round(minY - pad),
      round(maxX - minX + pad * 2),
      round(maxY - minY + pad * 2),
    ].join(" "),
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
