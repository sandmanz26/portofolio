import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { IconArrow } from './Icons';
import EditableImage from '../admin/EditableImage';

// A single numbered row in a `.room-index` list — used for both the room
// and activity listings (and the homepage teasers of each).
export default function IndexRow({ no, title, meta, desc, price, pricePer, detailHref, bookHref, image, imageAlt, editImagePath, imageRules }) {
  return (
    <Reveal as="article" className="room-row">
      <span className="room-row__no">{no}</span>
      <div className="room-row__body">
        <h3>{title}</h3>
        <div className="room-row__meta">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <p className="room-row__desc">{desc}</p>
        <div className="room-row__foot">
          <span className="room-row__price">
            {price} <small>/ {pricePer}</small>
          </span>
          <Link className="tlink" to={detailHref}>
            View details <IconArrow />
          </Link>
          <a className="tlink" href={bookHref} target="_blank" rel="noopener">
            Book <IconArrow />
          </a>
        </div>
      </div>
      <div className="room-row__media">
        {editImagePath ? (
          <EditableImage path={editImagePath} fallbackSrc={image} alt={imageAlt} rules={imageRules} loading="lazy" />
        ) : (
          <img src={image} alt={imageAlt} loading="lazy" />
        )}
      </div>
    </Reveal>
  );
}
