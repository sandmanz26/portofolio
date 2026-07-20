import { img } from '../utils/img';
import { useLightbox } from '../hooks/useLightbox.jsx';
import Reveal from './Reveal';

const SLOTS = ['a', 'b', 'c', 'd', 'e'];

// Bento gallery grid — expects exactly 5 {id, alt, w} image descriptors.
export default function Gallery({ items }) {
  const { open } = useLightbox();
  const images = items.map((it) => ({ src: img(it.id, 1600), alt: it.alt }));

  return (
    <Reveal className="gallery">
      {items.map((it, i) => (
        <div className={`gallery__item gallery__item--${SLOTS[i]}`} key={it.id} onClick={() => open(images, i)}>
          <img src={img(it.id, it.thumbW || 900)} alt={it.alt} loading="lazy" />
        </div>
      ))}
    </Reveal>
  );
}
