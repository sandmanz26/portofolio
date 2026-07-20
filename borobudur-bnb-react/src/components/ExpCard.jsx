import { Link } from 'react-router-dom';
import { img } from '../utils/img';

// Flexible experience/workshop card. Pass `to` for an internal link (whole
// card clickable) or omit it to render a plain div with a custom footer
// link (used for workshops, which book via WhatsApp instead of a page).
export default function ExpCard({ to, media, meta, title, text, footer }) {
  const Tag = to ? Link : 'div';
  const tagProps = to ? { to } : {};
  return (
    <Tag className="exp-card" {...tagProps}>
      <div className="exp-card__media">
        <img src={img(media.id, 1000)} alt={media.alt} loading="lazy" />
      </div>
      <div className="exp-card__meta">
        {(Array.isArray(meta) ? meta : [meta]).map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {footer}
    </Tag>
  );
}
