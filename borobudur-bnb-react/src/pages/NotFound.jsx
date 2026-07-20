import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page Not Found — Borobudur BnB');
  return (
    <section className="section" style={{ paddingTop: 'clamp(160px, 20vw, 220px)', textAlign: 'center' }}>
      <div className="container">
        <p className="label" style={{ justifyContent: 'center' }}>404</p>
        <h1>This page wandered off the path</h1>
        <p className="lede" style={{ margin: '20px auto 40px' }}>
          The page you're looking for doesn't exist — but the temple is still that way.
        </p>
        <Link to="/" className="btn btn--solid">
          Back to home
        </Link>
      </div>
    </section>
  );
}
