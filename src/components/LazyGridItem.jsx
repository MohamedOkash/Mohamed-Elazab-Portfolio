import { useState, useEffect, useRef } from 'react';

/**
 * LazyGridItem - Defers mounting of children until it scrolls near the viewport.
 * Uses IntersectionObserver to prevent mobile memory spikes and layout shifts.
 */
export default function LazyGridItem({ children, className = "", span = "" }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Keep mounted once scrolled into view
        }
      },
      { rootMargin: '250px' } // Pre-load slightly before scrolling in
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`${span} ${className} relative overflow-hidden h-[350px] md:h-[450px] bg-zinc-950/20`}
    >
      {isIntersecting ? (
        children
      ) : (
        <div className="w-full h-full bg-zinc-900/10 animate-pulse" />
      )}
    </div>
  );
}
