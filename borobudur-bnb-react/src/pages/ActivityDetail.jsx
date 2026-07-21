import { useParams } from 'react-router-dom';
import { activities, findActivity } from '../data/activities';
import DetailPage from '../components/DetailPage';
import MobileCta from '../components/MobileCta';
import { waBookLink, waLink } from '../utils/whatsapp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useContent } from '../admin/ContentContext';
import NotFound from './NotFound';

export default function ActivityDetail() {
  const { slug } = useParams();
  const activity = findActivity(slug);
  const { overrides } = useContent();
  useDocumentTitle(activity ? `${activity.name} — Activities at Borobudur BnB` : 'Activity not found — Borobudur BnB');
  if (!activity) return <NotFound />;

  const index = activities.findIndex((a) => a.slug === slug);
  const prevA = activities[index - 1];
  const nextA = activities[index + 1];
  const prev = prevA ? { href: `/activity/${prevA.slug}`, label: prevA.name } : { href: '/activity', label: 'All activities' };
  const next = nextA ? { href: `/activity/${nextA.slug}`, label: nextA.name } : { href: '/activity', label: 'All activities' };
  const effectiveName = overrides[`activities.${activity.slug}.name`] ?? activity.name;

  return (
    <>
      <DetailPage item={activity} parentLabel="Activity" parentHref="/activity" prev={prev} next={next} pathPrefix={`activities.${activity.slug}`} />
      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB') }}
        right={{ label: 'Book now', href: waBookLink(effectiveName) }}
      />
    </>
  );
}
