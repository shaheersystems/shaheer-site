"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  buildGrid,
  CAMERA,
  DEPTH,
  HEIGHT_GLSL,
  START_TIME,
} from "./geometry";
import { FieldFallback } from "./field-fallback";

/* The surface is computed entirely on the GPU: `position` is a flat grid and
   the vertex shader lifts every dot by the same height function the fallback
   uses. Per frame the CPU writes four uniforms — time, and a spring-smoothed
   pointer — and issues one draw call. */

const VERTEX_SHADER = /* glsl */ `
  ${HEIGHT_GLSL}

  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uPull;

  varying float vAlpha;
  varying float vCrest;

  void main() {
    vec3 p = position;
    float h = heightAt(p.x, p.z, uTime);

    // The pointer raises a soft swell with a faint ring running off it, like a
    // hand held just above water. Both scale with uPull, which is sprung, so
    // the swell settles in and drains away rather than switching.
    float d = distance(p.xz, uPointer);
    float swell = exp(-d * d * 0.26) * 0.75;
    float ring = sin(d * 2.6 - uTime * 3.2) * exp(-d * 0.5) * 0.08;
    h += uPull * (swell + ring);
    p.y = h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Perspective-correct dot size: near dots read as grains, far ones as dust.
    gl_PointSize = 2.5 * uPixelRatio * (7.0 / -mv.z);

    // Far rows dissolve into the page instead of stopping on a hard line.
    float horizon = smoothstep(-${(DEPTH / 2).toFixed(1)}, -${(DEPTH / 2 - 4).toFixed(1)}, p.z);
    vCrest = smoothstep(0.12, 0.55, h);
    vAlpha = horizon * (0.32 + 0.55 * vCrest);
  }
`;

/* Round, antialiased dots; crests lean toward the accent. */
const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uBrand;

  varying float vAlpha;
  varying float vCrest;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float edge = 1.0 - smoothstep(0.32, 0.5, r);
    if (edge <= 0.0) discard;
    vec3 color = mix(uInk, uBrand, vCrest * 0.85);
    gl_FragColor = vec4(color, vAlpha * edge);
  }
`;

/** Capped rather than uncapped: a 120Hz display gains nothing visible on a
 *  surface this slow, and would double the GPU time. */
const FRAME_MS = 1000 / 60 - 1;

/** Spring constants for the pointer. Critically damped (c = 2√k): it follows
 *  with weight and never overshoots, which on water would read as a wobble. */
const FOLLOW_K = 55;
const FOLLOW_C = 2 * Math.sqrt(FOLLOW_K);
const PULL_K = 18;
const PULL_C = 2 * Math.sqrt(PULL_K);

type FieldCanvasProps = {
  /**
   * Render the no-WebGL branch on a healthy GPU. Exists so the fallback is
   * reachable without disabling hardware acceleration — the branch nobody can
   * see is the branch that rots.
   */
  forceFallback?: boolean;
};

/**
 * The still field is what the DOM holds; WebGL is an upgrade layered over it
 * when a context is actually available. If the context never arrives, or is
 * lost later, the still frame is simply uncovered.
 */
export default function FieldCanvas({
  forceFallback = false,
}: FieldCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceFallback) return;
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        // A software rasterizer would technically succeed and then stutter.
        // The still SVG is strictly the better graphic there.
        failIfMajorPerformanceCaveat: true,
        powerPreference: "low-power",
      });
    } catch {
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
    host.dataset.gl = "on";

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(pixelRatio);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buildGrid(), 3),
    );

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uPull: { value: 0 },
        // Replaced from the --viz-* tokens before the first paint.
        uInk: { value: new THREE.Color("#211f1b") },
        uBrand: { value: new THREE.Color("#32669a") },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const scene = new THREE.Scene();
    scene.add(new THREE.Points(geometry, material));

    const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 60);
    camera.position.set(...CAMERA.position);
    camera.lookAt(...CAMERA.target);

    const fit = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const syncColor = () => {
      const style = getComputedStyle(host);
      const ink = style.getPropertyValue("--viz-ink").trim();
      const brand = style.getPropertyValue("--viz-brand").trim();
      if (ink) material.uniforms.uInk.value.set(ink);
      if (brand) material.uniforms.uBrand.value.set(brand);
    };

    /* --- pointer --------------------------------------------------------- */

    // Decorative mouse-tracking only: touch has no hover, and a swell that
    // jumps to wherever a thumb lands while scrolling would read as a glitch.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const raycaster = new THREE.Raycaster();
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();

    const target = { x: 0, z: 0, pull: 0 };
    const spring = { x: 0, z: 0, vx: 0, vz: 0, pull: 0, vp: 0 };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      // A little vertical slack so the swell doesn't cut out the instant the
      // cursor crosses into the text above or below.
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top - 48 &&
        event.clientY <= rect.bottom + 48;
      if (!inside) {
        target.pull = 0;
        return;
      }
      ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(ground, hit)) return;
      // First contact places the swell under the cursor rather than sliding
      // it in from wherever it last drained away.
      if (spring.pull < 0.02) {
        spring.x = hit.x;
        spring.z = hit.z;
      }
      target.x = hit.x;
      target.z = hit.z;
      target.pull = 1;
    };

    const onPointerLeave = () => {
      target.pull = 0;
    };

    const stepSprings = (dt: number) => {
      spring.vx += ((target.x - spring.x) * FOLLOW_K - spring.vx * FOLLOW_C) * dt;
      spring.vz += ((target.z - spring.z) * FOLLOW_K - spring.vz * FOLLOW_C) * dt;
      spring.vp += ((target.pull - spring.pull) * PULL_K - spring.vp * PULL_C) * dt;
      spring.x += spring.vx * dt;
      spring.z += spring.vz * dt;
      spring.pull += spring.vp * dt;
      material.uniforms.uPointer.value.set(spring.x, spring.z);
      material.uniforms.uPull.value = Math.max(0, spring.pull);
    };

    const draw = (time: number) => {
      material.uniforms.uTime.value = time;
      renderer.render(scene, camera);
    };

    /* --- frame loop ------------------------------------------------------ */

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    let onScreen = false;
    let elapsed = START_TIME;
    let lastFrame = 0;
    let lastTick = 0;
    let raf = 0;

    const loop = (now: number): void => {
      raf = requestAnimationFrame(loop);
      if (now - lastFrame < FRAME_MS) return;
      // Clamped so a backgrounded tab resumes where it left off instead of
      // jumping forward, and so the springs never take an unstable step.
      const dt = Math.min((now - lastTick) / 1000, 1 / 30);
      lastTick = now;
      lastFrame = now;
      elapsed += dt;
      stepSprings(dt);
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

    // Reduced motion means reduced *motion*, not reduced appearance: the field
    // is still drawn, in full, held on one frame.
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

    // The dots are painted in the page's ink, and the theme toggle rewrites
    // that ink by swapping a class on <html>.
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

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      canvas.remove();
      delete host.dataset.gl;
    };

    document.addEventListener("visibilitychange", onVisibility);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);
    canvas.addEventListener("webglcontextlost", onContextLost);

    paintStill();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      window.removeEventListener("pointermove", onPointerMove);
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
    /* `relative` is load-bearing: the canvas is positioned absolutely into
       this box, and `overflow-hidden` only clips a positioned descendant when
       the clipping element is itself the containing block. */
    <div
      ref={hostRef}
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden [&[data-gl]>svg]:hidden"
    >
      <FieldFallback />
    </div>
  );
}
