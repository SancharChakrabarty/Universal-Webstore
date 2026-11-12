"use client";

import { useEffect, useRef } from "react";
import "./CurvedLoop.css";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
}

export default function CurvedLoop({
  marqueeText = "Curved Loop ✦",
  speed = 2,
  curveAmount = 80,
  direction = "left",
  interactive = false,
}: CurvedLoopProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Build repeated text string wide enough to tile seamlessly
    const repeated = (marqueeText + "   ").repeat(10);

    // SVG dimensions
    const W = 1440;
    const H = 120;
    const curveY = curveAmount;

    // Path: a gentle arc across the width
    const pathId = "curved-loop-path";
    let pathEl = svg.querySelector<SVGPathElement>(`#${pathId}`);
    if (!pathEl) {
      pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("id", pathId);
      pathEl.setAttribute("fill", "none");
      svg.insertBefore(pathEl, svg.firstChild);
    }
    pathEl.setAttribute(
      "d",
      `M0,${H / 2 + curveY} Q${W / 2},${H / 2 - curveY} ${W},${H / 2 + curveY}`
    );

    // Text on path
    let textEl = svg.querySelector<SVGTextElement>(".cl-text");
    if (!textEl) {
      textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textEl.setAttribute("class", "cl-text");
      const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
      textPath.setAttribute("href", `#${pathId}`);
      textPath.setAttribute("class", "cl-textpath");
      textEl.appendChild(textPath);
      svg.appendChild(textEl);
    }

    const textPathEl = textEl.querySelector<SVGTextPathElement>(".cl-textpath");
    if (textPathEl) {
      textPathEl.textContent = repeated;
    }

    const dir = direction === "left" ? 1 : -1;

    function tick() {
      if (!isDragging.current || !interactive) {
        offsetRef.current += speed * dir * 0.04;
      }
      // wrap offset 0-100
      offsetRef.current = ((offsetRef.current % 100) + 100) % 100;

      if (textPathEl) {
        textPathEl.setAttribute("startOffset", `${-offsetRef.current}%`);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    function onPointerDown(e: PointerEvent) {
      if (!interactive) return;
      isDragging.current = true;
      lastX.current = e.clientX;
      velocityRef.current = 0;
    }
    function onPointerMove(e: PointerEvent) {
      if (!isDragging.current || !interactive) return;
      const dx = e.clientX - lastX.current;
      velocityRef.current = dx;
      offsetRef.current -= dx * 0.05 * dir;
      lastX.current = e.clientX;
    }
    function onPointerUp() {
      isDragging.current = false;
    }

    if (interactive) {
      svg.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (interactive) {
        svg.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      }
    };
  }, [marqueeText, speed, curveAmount, direction, interactive]);

  return (
    <div className="curved-loop-outer">
      <svg
        ref={svgRef}
        className="curved-loop-svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      />
    </div>
  );
}
