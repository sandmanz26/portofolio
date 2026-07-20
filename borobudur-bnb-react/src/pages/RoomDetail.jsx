import { useParams } from 'react-router-dom';
import { rooms, findRoom } from '../data/rooms';
import DetailPage from '../components/DetailPage';
import MobileCta from '../components/MobileCta';
import { waBookLink, waLink } from '../utils/whatsapp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import NotFound from './NotFound';

export default function RoomDetail() {
  const { slug } = useParams();
  const room = findRoom(slug);
  useDocumentTitle(room ? `${room.name} — Rooms at Borobudur BnB` : 'Room not found — Borobudur BnB');
  if (!room) return <NotFound />;

  const index = rooms.findIndex((r) => r.slug === slug);
  const prevRoom = rooms[index - 1];
  const nextRoom = rooms[index + 1];
  const prev = prevRoom ? { href: `/room/${prevRoom.slug}`, label: prevRoom.name } : { href: '/room', label: 'All rooms' };
  const next = nextRoom ? { href: `/room/${nextRoom.slug}`, label: nextRoom.name } : { href: '/room', label: 'All rooms' };

  return (
    <>
      <DetailPage item={room} parentLabel="Room" parentHref="/room" prev={prev} next={next} />
      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB') }}
        right={{ label: 'Book now', href: waBookLink(room.name) }}
      />
    </>
  );
}
