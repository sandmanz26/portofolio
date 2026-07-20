import { useEffect, useState } from 'react';
import { waLink } from '../utils/whatsapp';
import { IconUp, IconWhatsApp } from './Icons';

export default function FloatStack() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 700);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="float-stack">
      <button
        className={`fab fab--top${visible ? ' is-visible' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IconUp />
      </button>
      <a
        className="fab fab--wa"
        href={waLink('Halo Borobudur BnB, saya ingin tanya ketersediaan kamar.')}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
      >
        <IconWhatsApp />
      </a>
    </div>
  );
}
