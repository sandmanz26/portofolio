import { useEffect } from "react";

/**
 * Fades in every `.reveal` element as it enters the viewport.
 * Pass the data your page renders from as deps so newly rendered
 * cards (after an async fetch) get observed too.
 */
export default function useReveal(deps = []) {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
