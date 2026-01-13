"use client";

import { useEffect, useRef } from "react";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      // Dynamically import Vanta and Three.js only on client side
      import("vanta/dist/vanta.net.min").then((VANTA) => {
        import("three").then((THREE) => {
          vantaEffect.current = VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xb91c1c, // Red color matching your primary theme
            backgroundColor: 0x000000,
            points: 8.0,
            maxDistance: 20.0,
            spacing: 15.0,
          });
        });
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 -z-10 opacity-30"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
