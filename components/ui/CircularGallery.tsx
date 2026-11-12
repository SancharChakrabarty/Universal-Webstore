"use client";

import { useEffect, useRef } from "react";
import "./CircularGallery.css";

interface GalleryItem {
  image: string;
  text: string;
}

interface CircularGalleryProps {
  items: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollEase?: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "transparent",
  borderRadius = 0.05,
  scrollEase = 0.02,
}: CircularGalleryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    scroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    images: [] as HTMLImageElement[],
    loaded: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;
    state.scroll = 0;
    state.targetScroll = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Load images
    state.images = [];
    state.loaded = 0;
    items.forEach((item, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { state.loaded++; };
      img.onerror = () => { state.loaded++; };
      img.src = item.image;
      state.images[i] = img;
    });

    function drawRoundedImage(
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.clip();
      if (img.complete && img.naturalWidth > 0) {
        // Fit image (contain) in the card
        const iW = img.naturalWidth;
        const iH = img.naturalHeight;
        const scale = Math.min(w / iW, h / iH);
        const dw = iW * scale;
        const dh = iH * scale;
        const dx = x + (w - dw) / 2;
        const dy = y + (h - dh) / 2;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(x, y, w, h);
      }
      ctx.restore();
    }

    function draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const count = items.length;
      if (count === 0) return;

      // Card dimensions
      const cardW = Math.min(W * 0.22, 220 * dpr);
      const cardH = cardW * 1.1;
      const gap = cardW * 0.18;
      const totalW = (cardW + gap) * count;
      const r = Math.max(cardW * borderRadius * 10, 8 * dpr);

      // Perspective bend: cards arc along a curve
      const bendAmount = bend * dpr * 0.5;

      for (let i = 0; i < count; i++) {
        // Raw x position with infinite scroll
        let rawX = i * (cardW + gap) - state.scroll * dpr;
        // Wrap
        rawX = ((rawX % totalW) + totalW) % totalW;
        if (rawX > W + cardW) rawX -= totalW;

        // Normalized position -1 to 1 across screen
        const norm = (rawX + cardW / 2 - W / 2) / (W / 2);

        // Arc y offset
        const arcY = bendAmount * (norm * norm);

        const x = rawX;
        const y = H / 2 - cardH / 2 + arcY;

        // Slight scale falloff toward edges
        const scale = 1 - Math.abs(norm) * 0.12;
        const scaledW = cardW * scale;
        const scaledH = cardH * scale;
        const cx = x + cardW / 2;
        const cy = y + cardH / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        drawRoundedImage(ctx, state.images[i], -cardW / 2, -cardH / 2, cardW, cardH, r);
        ctx.restore();
      }
    }

    function tick() {
      state.scroll = lerp(state.scroll, state.targetScroll, scrollEase + 0.03);
      // Auto-scroll
      if (!state.isDragging) {
        state.targetScroll += 0.4;
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    // Pointer events
    function onPointerDown(e: PointerEvent) {
      state.isDragging = true;
      state.lastX = e.clientX;
      state.velocity = 0;
      canvas?.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!state.isDragging) return;
      const dx = e.clientX - state.lastX;
      state.targetScroll -= dx * 1.5;
      state.velocity = -dx * 1.5;
      state.lastX = e.clientX;
    }
    function onPointerUp() {
      state.isDragging = false;
      state.targetScroll += state.velocity * 8;
    }

    // Wheel
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      state.targetScroll += e.deltaY * 0.5;
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resize);
    };
  }, [items, bend, borderRadius, scrollEase, textColor]);

  return (
    <div className="circular-gallery-wrapper">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
    </div>
  );
}
