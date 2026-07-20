import { Link } from 'react-router-dom';
import { img } from '../utils/img';
import Reveal from './Reveal';

export default function PageHero({ image, alt, crumb, title, sub, short = false }) {
  return (
    <section className={`pagehero${short ? ' pagehero--short' : ''}`}>
      <div className="pagehero__media">
        <img src={img(image, 2200)} alt={alt} />
      </div>
      <div className="container pagehero__content">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>—</span>
          <span>{crumb}</span>
        </div>
        <Reveal as="h1">{title}</Reveal>
        <Reveal as="p" className="pagehero__sub">
          {sub}
        </Reveal>
      </div>
    </section>
  );
}
