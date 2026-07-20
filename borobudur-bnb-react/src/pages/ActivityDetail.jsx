import { useParams } from 'react-router-dom';
import { activities, findActivity } from '../data/activities';
import DetailPage from '../components/DetailPage';
import MobileCta from '../components/MobileCta';
import { waBookLink, waLink } from '../utils/whatsapp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import NotFound from './NotFound';

export default function ActivityDetail() {
  const { slug } = useParams();
  const activity = findActivity(slug);
  useDocumentTitle(activity ? `${activity.name} — Activities at Borobudur BnB` : 'Activity not found — Borobudur BnB');
  if (!activity) return <NotFound />;

  const index = activities.findIndex((a) => a.slug === slug);
  const prevA = activities[index - 1];
  const nextA = activities[index + 1];
  const prev = prevA ? { href: `/activity/${prevA.slug}`, label: prevA.name } : { href: '/activity', label: 'All activities' };
  const next = nextA ? { href: `/activity/${nextA.slug}`, label: nextA.name } : { href: '/activity', label: 'All activities' };

  return (
    <>
      <DetailPage item={activity} parentLabel="Activity" parentHref="/activity" prev={prev} next={next} />
      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB') }}
        right={{ label: 'Book now', href: waBookLink(activity.name) }}
      />
    </>
  );
}
