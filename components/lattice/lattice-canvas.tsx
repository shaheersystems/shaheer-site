"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildCubes, buildLineBuffers, CAMERA_DIR } from "./geometry";
import { LatticeFallback } from "./lattice-fallback";

/* The whole animation is two lines of vertex math on a uniform clock: no
   per-frame CPU work, no matrix writes, one draw call. `position` already
   carries each cube's place in the lattice (the geometry is pre-merged), so
   the only per-vertex inputs are the cube's slot in the cycle and how high it
   sits. */

const VERTEX_SHADER = /* glsl */ `
  attribute float aPhase;
  attribute float aDepth;

  uniform float uTime;
  uniform float uCycle;

  varying float vAlpha;

  void main() {
    // Each cube gets one turn per cycle: lifted out of the stack, then set
    // back down. Phases are hashed, so at any instant a few are in the air and
    // the rest are still — a site under construction, not a wave.
    //
    // The 0.115 is the tuning knob: it is the fraction of the cycle a cube
    // spends moving, and therefore the fraction of the lattice in motion at
    // once. Here that averages three cubes out of thirty-seven. Widen it and
    // the graphic reads as churn rather than as work.
    float c = fract(uTime / uCycle + aPhase);
    float rise = smoothstep(0.0, 0.035, c) * (1.0 - smoothstep(0.035, 0.115, c));
    rise = rise * rise * (3.0 - 2.0 * rise);

    vec3 p = position;
    p.y += rise * 0.62;
    // Everything else breathes, barely. Amplitude is under a fiftieth of a
    // cube: readable as life, not as motion.
    p.y += sin(uTime * 0.6 + aPhase * 6.2831853) * 0.015;

    // Higher cubes sit lighter so the lattice has a floor, and the one being
    // placed comes forward while it moves.
    vAlpha = mix(0.34, 0.13, aDepth) + rise * 0.6;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

/* One interpolated varying and a uniform — about as cheap as a fragment
   shader gets, which is what earns the full device pixel ratio below. */
const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha);
  }
`;

/** Seconds for one full placement cycle across the lattice. */
const CYCLE = 15;
/** Ambient drift gains nothing above 30fps, and an uncapped loop pins a core
 *  for as long as the graphic is on screen — twice over on a 120Hz display. */
const FRAME_MS = 1000 / 30;

type LatticeCanvasProps = {
  /**
   * Render the no-WebGL branch on a healthy GPU. Exists so the fallback is
   * reachable without disabling hardware acceleration — the branch nobody can
   * see is the branch that rots.
   */
  forceFallback?: boolean;
};

/**
 * The still lattice is what the DOM holds; WebGL is an upgrade layered over it
 * when a context is actually available. Written this way round on purpose —
 * the alternative (render the canvas, fall back on failure) needs a setState
 * in the effect body to report the failure, which costs a cascading render and
 * leaves the fallback as a branch that only ever runs on someone else's
 * machine. Here it is the default, so it cannot rot unnoticed.
 */
export default function LatticeCanvas({
  forceFallback = false,
}: LatticeCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  // Depends on the flag so flipping it tears the context down rather than
  // leaving a stale instance behind a hidden canvas.
  useEffect(() => {
    if (forceFallback) return;
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        // Where the GPU is blocklisted or acceleration is off, a software
        // rasterizer would technically succeed and then stutter. The flat SVG
        // is strictly the better graphic there.
        failIfMajorPerformanceCaveat: true,
        powerPreference: "low-power",
      });
    } catch {
      // No context, nothing to clean up: the SVG below is already on screen.
      return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);
    // Hides the still fallback underneath. One attribute rather than a state
    // update, so the swap never re-renders React.
    host.dataset.gl = "on";

    renderer.setClearAlpha(0);
    // The fragment shader is one interpolated varying — about as cheap as a
    // shader gets. Capping density below the display's own would just upscale
    // and soften the hairlines, which are the entire graphic.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const cubes = buildCubes();
    const { positions, phases, depths } = buildLineBuffers(cubes);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uCycle: { value: CYCLE },
        // Replaced from the --viz-ink token before the first paint; this is
        // only the value the uniform is born with.
        uColor: { value: new THREE.Color("#211f1b") },
      },
      transparent: true,
      depthWrite: false,
      // Blueprint, not solid: every edge stays visible through the ones in
      // front of it, and the overlaps are what give the field its density.
      depthTest: false,
    });

    const group = new THREE.Group();
    group.add(new THREE.LineSegments(geometry, material));

    const scene = new THREE.Scene();
    scene.add(group);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -50, 50);
    camera.position.set(...CAMERA_DIR).normalize().multiplyScalar(10);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    // Fit the frustum to the lattice's real silhouette in view space rather
    // than to its bounding sphere: the shape is wide and flat, and a sphere
    // fit would leave most of the strip empty.
    const bounds = viewBounds(positions, camera);

    /* Every closure below is an arrow assigned to a const, not a `function`
       declaration: TypeScript keeps the `host` null-check narrowed across an
       arrow, but discards it across a hoisted declaration, which could in
       principle run before the guard. */

    const fit = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);

      const boxW = bounds.maxX - bounds.minX;
      // Headroom for a cube mid-placement, so a pop is never clipped.
      const boxH = bounds.maxY - bounds.minY + 0.7;
      // Slack for the yaw drift below, which swings the silhouette slightly
      // wider than the measured box. Small: a ±0.12rad turn on a lattice this
      // shallow in z moves the outline by about a percent.
      const pad = 1.08;

      let halfW = (boxW * pad) / 2;
      let halfH = (boxH * pad) / 2;
      const aspect = width / height;
      if (halfW / halfH < aspect) halfW = halfH * aspect;
      else halfH = halfW / aspect;

      const cx = (bounds.maxX + bounds.minX) / 2;
      const cy = (bounds.maxY + bounds.minY) / 2;
      camera.left = cx - halfW;
      camera.right = cx + halfW;
      camera.top = cy + halfH;
      camera.bottom = cy - halfH;
      camera.updateProjectionMatrix();
    };

    const syncColor = () => {
      const value = getComputedStyle(host)
        .getPropertyValue("--viz-ink")
        .trim();
      if (value) material.uniforms.uColor.value.set(value);
    };

    const draw = (time: number) => {
      material.uniforms.uTime.value = time;
      group.rotation.y = Math.sin(time * 0.09) * 0.12;
      renderer.render(scene, camera);
    };

    /* --- frame loop ------------------------------------------------------ */

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    let onScreen = false;
    let elapsed = 0;
    let lastFrame = 0;
    let lastTick = 0;
    let raf = 0;

    const loop = (now: number): void => {
      raf = requestAnimationFrame(loop);
      // Clamped so a backgrounded tab returning to focus resumes where it
      // left off instead of jumping a minute forward through the cycle.
      elapsed += Math.min((now - lastTick) / 1000, 0.1);
      lastTick = now;
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      draw(elapsed);
    };

    const start = () => {
      if (raf || reduced || !onScreen) return;
      if (document.visibilityState !== "visible") return;
      lastTick = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Reduced motion means reduced *motion*, not reduced appearance: the
    // lattice is still drawn, in full, held on one frame.
    const paintStill = () => {
      fit();
      syncColor();
      draw(elapsed);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    observer.observe(host);

    const resizeObserver = new ResizeObserver(() => {
      fit();
      if (!raf) draw(elapsed);
    });
    resizeObserver.observe(host);

    // The lattice is painted in the same ink as the text, and the theme
    // toggle rewrites that ink by swapping a class on <html>.
    const themeObserver = new MutationObserver(() => {
      syncColor();
      if (!raf) draw(elapsed);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      if (reduced) {
        stop();
        paintStill();
      } else {
        start();
      }
    };

    // Context loss is routine under GPU resets and tab pressure, not exotic.
    // Dropping the canvas uncovers the still lattice already sitting behind
    // it, so the slot never goes blank.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      canvas.remove();
      delete host.dataset.gl;
    };

    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);
    canvas.addEventListener("webglcontextlost", onContextLost);

    paintStill();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      delete host.dataset.gl;
    };
  }, [forceFallback]);

  return (
    /* `relative` is load-bearing, not decorative: the canvas is positioned
       absolutely into this box, and `overflow-hidden` only clips a positioned
       descendant when the clipping element is itself the containing block. */
    <div
      ref={hostRef}
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden [&[data-gl]>svg]:hidden"
    >
      <LatticeFallback />
    </div>
  );
}

/** Silhouette of the geometry in the camera's view space. */
function viewBounds(positions: Float32Array, camera: THREE.Camera) {
  const point = new THREE.Vector3();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < positions.length; i += 3) {
    point
      .set(positions[i], positions[i + 1], positions[i + 2])
      .applyMatrix4(camera.matrixWorldInverse);
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  return { minX, minY, maxX, maxY };
}
