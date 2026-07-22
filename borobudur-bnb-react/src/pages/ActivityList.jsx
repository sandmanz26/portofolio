import { Link } from 'react-router-dom';
import { waLink } from '../utils/whatsapp';
import IndexRow from '../components/IndexRow';
import ExpCard from '../components/ExpCard';
import Reveal from '../components/Reveal';
import { img } from '../utils/img';
import { waBookLink } from '../utils/whatsapp';
import MobileCta from '../components/MobileCta';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { IconArrow } from '../components/Icons';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';

const ACTIVITY_IMAGE_RULES = { aspect: '4:3', minWidth: 1200, minHeight: 900 };
const WORKSHOP_IMAGE_RULES = { aspect: '1:1', minWidth: 1000, minHeight: 1000 };

export default function ActivityList() {
  useDocumentTitle('Activities — Borobudur BnB, Magelang');
  const { overrides, rows } = useContent();
  const { activities, workshops } = rows;

  return (
    <>
      <section className="pagehero">
        <div className="pagehero__media">
          <img src={img('photo-1599443380179-33737c17ca81', 2200)} alt="Rafting crew paddling the Elo River rapids" />
        </div>
        <div className="container pagehero__content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>—</span>
            <span>Activity</span>
          </div>
          <Reveal as="h1">Days worth waking up for</Reveal>
          <Reveal as="p" className="pagehero__sub">
            The temple is only the beginning. Saddle up, ride a horse-cart through the paddies, drop the top of a
            classic VW, or let the Elo River carry you — all arranged at the front desk, minutes from the house.
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="statement">
            <p className="label">
              <span className="label__no">( 01 )</span> How It Works
            </p>
            <p>
              Every activity is run with <em>neighbours we trust</em> — book tonight at the front desk or on
              WhatsApp, and tomorrow is arranged before you finish dinner.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container">
          <Reveal className="section-head">
            <p className="label">
              <span className="label__no">( 02 )</span> In-House &amp; Local Experiences
            </p>
            <h2>Five ways to spend a day</h2>
          </Reveal>
          <div className="room-index">
            {activities.map((a) => (
              <IndexRow
                key={a.slug}
                no={a.no}
                title={<Editable path={`activities.${a.slug}.name`} fallback={a.name} rules={{ label: 'Activity name', maxLength: 60 }} />}
                meta={a.listMeta}
                desc={<Editable path={`activities.${a.slug}.listDesc`} fallback={a.listDesc} multiline rules={{ label: 'Short description', maxLength: 220 }} />}
                price={<Editable path={`activities.${a.slug}.listPrice`} fallback={a.listPrice} rules={{ label: 'Price', maxLength: 24 }} />}
                pricePer={<Editable path={`activities.${a.slug}.listPricePer`} fallback={a.listPricePer} rules={{ label: 'Price unit', maxLength: 20 }} />}
                detailHref={`/activity/${a.slug}`}
                bookHref={waBookLink(overrides[`activities.${a.slug}.name`] ?? a.name)}
                image={a.hero.image}
                imageAlt={a.hero.alt}
                editImagePath={`activities.${a.slug}.hero.image`}
                imageRules={ACTIVITY_IMAGE_RULES}
              />
            ))}
          </div>
          <Reveal className="mt-lg">
            <p className="note-line">Guests get priority slots — book activities together with your room</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--band">
        <div className="container">
          <Reveal className="section-head">
            <p className="label">
              <span className="label__no">( 03 )</span> Workshop Experience
            </p>
            <h2>Take a craft home with you</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Half-day classes with village artisans — batik, pottery, silverwork and gamelan — booked directly
              through the house, no separate tour operator needed.
            </p>
          </Reveal>
          <Reveal group className="exp-grid exp-grid--quad">
            {workshops.map((w) => {
              const title = overrides[`workshops.${w.id}.title`] ?? w.title;
              return (
                <ExpCard
                  key={w.id}
                  media={w.media}
                  meta={<Editable path={`workshops.${w.id}.meta`} fallback={w.meta} rules={{ label: 'Meta (duration)', maxLength: 40 }} />}
                  title={<Editable path={`workshops.${w.id}.title`} fallback={w.title} rules={{ label: 'Title', maxLength: 50 }} />}
                  text={<Editable path={`workshops.${w.id}.text`} fallback={w.text} multiline rules={{ label: 'Description', maxLength: 220 }} />}
                  editImagePath={`workshops.${w.id}.image`}
                  imageRules={WORKSHOP_IMAGE_RULES}
                  footer={
                    <a
                      className="tlink"
                      href={waLink(`Halo Borobudur BnB, saya ingin tanya kelas ${title}.`)}
                      target="_blank"
                      rel="noopener"
                    >
                      Ask to book <IconArrow />
                    </a>
                  }
                />
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="cta-band">
        <img src={img('photo-1620549146396-9024d914cd99', 1800)} alt="Golden hour at Borobudur Temple" loading="lazy" />
        <Reveal as="div" className="container">
          <p className="label">Plan the days, keep the mornings</p>
          <h2>Tell us what you love, we'll build the days</h2>
          <p>Message us your dates and pace — slow mornings, big adventures, or both — and we'll sketch an itinerary before you land.</p>
          <div className="cta-band__row">
            <a href={waLink('Halo Borobudur BnB, saya ingin tanya aktivitas.')} target="_blank" rel="noopener" className="btn btn--solid-light">
              Chat on WhatsApp
            </a>
            <Link to="/room" className="btn btn--light">
              See the rooms
            </Link>
          </div>
        </Reveal>
      </section>

      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB, saya ingin tanya aktivitas.') }}
        right={{ label: 'See activities', href: '#main', external: false }}
      />
    </>
  );
}
