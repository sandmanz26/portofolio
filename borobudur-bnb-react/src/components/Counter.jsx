import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

// Animated count-up, triggered once the number scrolls into view.
export default function Counter({ value, decimals = 0, suffix = '' }) {
  const [ref, isVisible] = useReveal(0.6);
  const [display, setDisplay] = useState((0).toFixed(decimals));
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    if (reduceMotion) {
      setDisplay(value.toFixed(decimals));
      return;
    }
    const duration = 1600;
    let startTime;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((value * eased).toFixed(decimals));
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }, [isVisible, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
