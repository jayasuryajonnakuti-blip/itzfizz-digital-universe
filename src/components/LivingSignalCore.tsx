import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LivingSignalCore({ progress = 0 }: { progress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Idle animation
      gsap.to(coreRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
        rotation: (i) => (i + 1) * 120,
        transformOrigin: "center",
        duration: (i) => 10 + i * 5,
        repeat: -1,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Update based on scroll progress
  useLayoutEffect(() => {
    if (!coreRef.current) return;

    gsap.to(coreRef.current, {
      scale: 1 + progress * 2,
      rotation: progress * 360,
      opacity: 1 - progress * 0.5,
      filter: `blur(${progress * 4}px)`,
      overwrite: true,
      duration: 0.1,
    });

    gsap.to(ring1Ref.current, { strokeDashoffset: 1000 - progress * 1000, duration: 0.1 });
    gsap.to(ring2Ref.current, { strokeDashoffset: 800 - progress * 800, duration: 0.1 });
    gsap.to(ring3Ref.current, { strokeDashoffset: 600 - progress * 600, duration: 0.1 });
  }, [progress]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* Background Glow */}
      <div className="absolute w-[40vw] h-[40vw] bg-violet/20 blur-[120px] rounded-full animate-pulse" />
      
      {/* The Core */}
      <div 
        ref={coreRef}
        className="relative w-48 h-48 md:w-64 md:h-64 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-acid via-cyan to-violet rounded-full opacity-80 blur-[2px]" />
        <div className="absolute inset-4 border border-white/30 rounded-full" />
        <div className="absolute inset-8 border border-white/20 rounded-full" />
        
        {/* Internal Geometry */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-[1px] bg-white/40 rotate-45" />
          <div className="w-1/2 h-[1px] bg-white/40 -rotate-45" />
          <div className="w-[1px] h-1/2 bg-white/40" />
          <div className="w-1/2 h-[1px] bg-white/40" />
        </div>
      </div>

      {/* Orbital Rings */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 1000 1000">
        <circle 
          ref={ring1Ref}
          cx="500" cy="500" r="150" 
          fill="none" stroke="rgba(215, 255, 0, 0.3)" strokeWidth="1" 
          strokeDasharray="1000" strokeDashoffset="1000"
        />
        <circle 
          ref={ring2Ref}
          cx="500" cy="500" r="220" 
          fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1"
          strokeDasharray="800" strokeDashoffset="800"
        />
        <circle 
          ref={ring3Ref}
          cx="500" cy="500" r="300" 
          fill="none" stroke="rgba(123, 44, 255, 0.15)" strokeWidth="1"
          strokeDasharray="600" strokeDashoffset="600"
        />
      </svg>
    </div>
  );
}
