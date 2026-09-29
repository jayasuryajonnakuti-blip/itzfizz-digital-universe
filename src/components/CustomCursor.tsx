import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Mouse movement
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power3.out"
      });
    };

    // Hover detection
    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    if (isHovering) {
      gsap.to(cursor, {
        scale: 4,
        backgroundColor: '#d7ff00',
        mixBlendMode: 'difference',
        duration: 0.3
      });
      gsap.to(follower, {
        scale: 1.5,
        borderWidth: '1px',
        borderColor: '#d7ff00',
        opacity: 0.5,
        duration: 0.3
      });
    } else {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: '#ffffff',
        mixBlendMode: 'normal',
        duration: 0.3
      });
      gsap.to(follower, {
        scale: 1,
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        opacity: 1,
        duration: 0.3
      });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <div className={`absolute inset-0 bg-acid/20 blur-md rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`} />
        <div className={`absolute inset-[-4px] border border-acid/50 rounded-full animate-ping transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </>
  );
}
