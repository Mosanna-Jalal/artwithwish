"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroModel = dynamic(() => import("./HeroModel"), {
  ssr: false,
  loading: () => null,
});

export default function ModelLayer({
  modelUrl,
  opacity = 0.35,
  className = "",
}: {
  modelUrl: string;
  opacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Start TRUE so the canvas renders on first paint — observer pauses it off-screen
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <HeroModel modelUrl={modelUrl} active={inView} />
    </div>
  );
}
