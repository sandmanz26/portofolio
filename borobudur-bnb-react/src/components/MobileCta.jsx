import { Link } from 'react-router-dom';

// Generic two-button sticky mobile bar. Each side accepts either an
// internal `to` (React Router Link) or an external `href`.
export default function MobileCta({ left, right }) {
  function renderButton(cfg, extraClass) {
    const cls = `btn${extraClass ? ' ' + extraClass : ''}`;
    if (cfg.to) {
      return (
        <Link to={cfg.to} className={cls}>
          {cfg.label}
        </Link>
      );
    }
    return (
      <a href={cfg.href} target={cfg.external === false ? undefined : '_blank'} rel="noopener" className={cls}>
        {cfg.label}
      </a>
    );
  }

  return (
    <div className="mobile-cta">
      {renderButton(left)}
      {renderButton(right, 'btn--solid')}
    </div>
  );
}
