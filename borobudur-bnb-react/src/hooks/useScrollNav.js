import { useEffect, useState, useRef } from 'react';

// Replicates the vanilla-JS nav behaviour: condensed background past 40px,
// hidden while scrolling down past 260px, revealed again when scrolling up.
export function useScrollNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      if (y > 260 && y > lastY.current) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastY.current = y;
      ticking.current = false;
    }
    function handle() {
      if (!ticking.current) {
        window.requestAnimationFrame(onScroll);
        ticking.current = true;
      }
    }
    onScroll();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return { isScrolled, isHidden };
}
