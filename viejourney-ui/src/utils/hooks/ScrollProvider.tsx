import React, { useEffect, useRef, useCallback } from "react";
import { animate } from "motion";

interface ScrollProviderProps {
  children: React.ReactNode;
  scrollSpeed?: number;
  smoothness?: number;
  maxScrollDelta?: number;
}

const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  scrollSpeed = 1.6,
  smoothness = 0.6,
  maxScrollDelta = 300,
}) => {
  const scrollYRef = useRef(window.scrollY); // Track scroll position
  const isScrollingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);

  const performSmoothScroll = useCallback(
    (deltaY: number) => {
      if (isScrollingRef.current) return;

      const currentTime = Date.now();
      if (currentTime - lastScrollTimeRef.current < 20) return;

      lastScrollTimeRef.current = currentTime;
      isScrollingRef.current = true;

      const normalizedDelta = Math.max(
        -maxScrollDelta,
        Math.min(maxScrollDelta, deltaY * scrollSpeed)
      );

      const targetScrollY = scrollYRef.current + normalizedDelta;

      animate(scrollYRef.current, targetScrollY, {
        duration: smoothness,
        ease: "easeInOut",
        onUpdate: (latest) => {
          window.scrollTo(0, latest);
          scrollYRef.current = latest;
        },
        onComplete: () => {
          isScrollingRef.current = false;
        },
      });
    },
    [scrollSpeed, smoothness, maxScrollDelta]
  );

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      performSmoothScroll(event.deltaY);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [performSmoothScroll]);

  return <div style={{ overflow: "hidden" }}>{children}</div>;
};

export default ScrollProvider;
