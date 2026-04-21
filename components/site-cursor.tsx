"use client";

import { useEffect, useRef } from "react";

export function SiteCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return;

    document.documentElement.classList.add("cursor-active");

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let targetScale = 1;
    let currentScale = 1;
    let visible = false;
    let frameId = 0;

    const syncHoverState = (el: EventTarget | null) => {
      const interactive =
        el instanceof Element
          ? el.closest(
              "a, button, input, select, textarea, label, [role='button'], [data-cursor='interactive']"
            )
          : null;
      const isHover = !!interactive;
      targetScale = isHover ? 1.5 : 1;
      dot.classList.toggle("is-hover", isHover);
      ring.classList.toggle("is-hover", isHover);
    };

    const render = () => {
      current.x += (target.x - current.x) * 0.11;
      current.y += (target.y - current.y) * 0.11;
      currentScale += (targetScale - currentScale) * 0.1;

      dot.style.transform = `translate3d(${current.x - 5}px, ${current.y - 5}px, 0)`;
      dot.style.opacity = visible ? "1" : "0";

      ring.style.transform = `translate3d(${current.x - 16}px, ${current.y - 16}px, 0) scale(${currentScale})`;
      ring.style.opacity = visible ? "1" : "0";

      frameId = requestAnimationFrame(render);
    };

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      visible = true;
      syncHoverState(e.target);
    };

    const onPointerDown = () => {
      targetScale = 0.84;
    };

    const onPointerUp = (e: PointerEvent) => {
      syncHoverState(e.target);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) visible = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mouseout", onMouseOut);
    frameId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("cursor-active");
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
