import { useParams } from 'react-router-dom';
import { rooms, findRoom } from '../data/rooms';
import DetailPage from '../components/DetailPage';
import MobileCta from '../components/MobileCta';
import { waBookLink, waLink } from '../utils/whatsapp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useContent } from '../admin/ContentContext';
import NotFound from './NotFound';

export default function RoomDetail() {
  const { slug } = useParams();
  const room = findRoom(slug);
  const { overrides } = useContent();
  useDocumentTitle(room ? `${room.name} — Rooms at Borobudur BnB` : 'Room not found — Borobudur BnB');
  if (!room) return <NotFound />;

  const index = rooms.findIndex((r) => r.slug === slug);
  const prevRoom = rooms[index - 1];
  const nextRoom = rooms[index + 1];
  const prev = prevRoom ? { href: `/room/${prevRoom.slug}`, label: prevRoom.name } : { href: '/room', label: 'All rooms' };
  const next = nextRoom ? { href: `/room/${nextRoom.slug}`, label: nextRoom.name } : { href: '/room', label: 'All rooms' };
  const effectiveName = overrides[`rooms.${room.slug}.name`] ?? room.name;

  return (
    <>
      <DetailPage item={room} parentLabel="Room" parentHref="/room" prev={prev} next={next} pathPrefix={`rooms.${room.slug}`} />
      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB') }}
        right={{ label: 'Book now', href: waBookLink(effectiveName) }}
      />
    </>
  );
}
