import { useRef, useState } from 'react';
import { IconPlus } from './Icons';
import Reveal from './Reveal';

export default function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const refs = useRef([]);

  return (
    <Reveal className="faq">
      {items.map((it, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={it.q}>
            <button className="faq__q" onClick={() => setOpenIndex(isOpen ? -1 : i)}>
              {it.q}
              <IconPlus />
            </button>
            <div
              className="faq__a"
              ref={(el) => (refs.current[i] = el)}
              style={{ maxHeight: isOpen ? refs.current[i]?.scrollHeight ?? 200 : 0 }}
            >
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
