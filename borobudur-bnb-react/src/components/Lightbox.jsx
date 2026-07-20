import { useLightbox } from '../hooks/useLightbox.jsx';
import { IconClose, IconNext, IconPrev } from './Icons';

export default function Lightbox() {
  const { isOpen, images, index, close, next, prev } = useLightbox();
  const current = images[index];

  return (
    <div className={`lightbox${isOpen ? ' is-open' : ''}`} onClick={(e) => e.target === e.currentTarget && close()}>
      {images.length > 1 && (
        <button className="lightbox__nav lightbox__nav--prev" aria-label="Previous photo" onClick={prev}>
          <IconPrev />
        </button>
      )}
      {current && <img src={current.src} alt={current.alt || ''} />}
      {images.length > 1 && (
        <button className="lightbox__nav lightbox__nav--next" aria-label="Next photo" onClick={next}>
          <IconNext />
        </button>
      )}
      <button className="lightbox__close" aria-label="Close" onClick={close}>
        <IconClose />
      </button>
    </div>
  );
}
