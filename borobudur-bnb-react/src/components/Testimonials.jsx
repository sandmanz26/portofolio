import { useEffect, useRef, useState } from 'react';
import { IconPrev, IconNext, IconStar } from './Icons';
import Reveal from './Reveal';
import Editable from '../admin/Editable';

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

export default function Testimonials({ items }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  function go(i) {
    setIndex((i + items.length) % items.length);
  }

  function reset() {
    clearInterval(timer.current);
    if (!reduceMotion) {
      timer.current = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    }
  }

  useEffect(() => {
    reset();
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Reveal className="testi" data-testi>
      <div className="testi__track">
        {items.map((t, i) => (
          <div className={`testi__slide${i === index ? ' is-active' : ''}`} key={t.name}>
            <div className="testi__stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <IconStar key={s} />
              ))}
            </div>
            <p className="testi__quote">
              &ldquo;
              <Editable path={`testimonials.${i}.quote`} fallback={t.quote} multiline rules={{ label: 'Quote', maxLength: 260 }} />
              &rdquo;
            </p>
            <div className="testi__author">
              <strong>
                <Editable path={`testimonials.${i}.name`} fallback={t.name} rules={{ label: 'Guest name', maxLength: 40 }} />
              </strong>
              <span>
                <Editable path={`testimonials.${i}.place`} fallback={t.place} rules={{ label: 'Guest location', maxLength: 40 }} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="testi__nav">
        {items.map((t, i) => (
          <button
            key={t.name}
            className={`testi__dot${i === index ? ' is-active' : ''}`}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => {
              go(i);
              reset();
            }}
          />
        ))}
      </div>
      <div className="testi__arrows">
        <button
          className="testi__arrow testi__arrow--prev"
          aria-label="Previous"
          onClick={() => {
            go(index - 1);
            reset();
          }}
        >
          <IconPrev />
        </button>
        <button
          className="testi__arrow testi__arrow--next"
          aria-label="Next"
          onClick={() => {
            go(index + 1);
            reset();
          }}
        >
          <IconNext />
        </button>
      </div>
    </Reveal>
  );
}
