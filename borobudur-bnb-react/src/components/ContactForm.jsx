import { useState } from 'react';
import { waLink } from '../utils/whatsapp';
import { IconShield, IconCheckCircle } from './Icons';

const ROOM_OPTIONS = [
  'Not sure yet',
  'Joglo Heritage Suite',
  'Garden View Room',
  'Family Cottage',
  'Rooftop Sunrise Room',
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    checkin: '',
    checkout: '',
    guests: '2 guests',
    roomType: 'Not sure yet',
    message: '',
  });
  const [nameError, setNameError] = useState('');
  const [success, setSuccess] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError('This field is required.');
      return;
    }
    setNameError('');

    let msg = `Halo Borobudur BnB, saya ${form.name.trim()}.`;
    if (form.checkin) msg += `\nCheck-in: ${form.checkin}`;
    if (form.checkout) msg += `\nCheck-out: ${form.checkout}`;
    if (form.guests) msg += `\nTamu: ${form.guests}`;
    if (form.roomType) msg += `\nTipe kamar: ${form.roomType}`;
    if (form.message.trim()) msg += `\nPesan: ${form.message.trim()}`;

    setSuccess(true);
    window.open(waLink(msg), '_blank', 'noopener');
    setForm({ name: '', email: '', checkin: '', checkout: '', guests: '2 guests', roomType: 'Not sure yet', message: '' });
  }

  return (
    <div className="form-card">
      <p className="label">
        <span className="label__no">( 02 )</span> Booking Enquiry
      </p>
      <h3>Check availability</h3>
      <p className="form-intro">Fill this in and we'll open WhatsApp with your details ready to send — no account needed.</p>

      <form id="contact-form" noValidate onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">Full name *</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              style={nameError ? { borderColor: '#b5602f' } : undefined}
            />
            <span className="field-error">{nameError}</span>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@email.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
            <span className="field-error" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="checkin">Check-in</label>
            <input type="date" id="checkin" value={form.checkin} onChange={(e) => update('checkin', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="checkout">Check-out</label>
            <input type="date" id="checkout" value={form.checkout} onChange={(e) => update('checkout', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="guests">Guests</label>
            <select id="guests" value={form.guests} onChange={(e) => update('guests', e.target.value)}>
              <option>1 guest</option>
              <option>2 guests</option>
              <option>3 guests</option>
              <option>4+ guests</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="room-type">Preferred room</label>
            <select id="room-type" value={form.roomType} onChange={(e) => update('roomType', e.target.value)}>
              {ROOM_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Anything else we should know? (e.g. airport pickup, dietary needs)"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--solid btn--block">
          Send via WhatsApp
        </button>

        <div className="form-note">
          <IconShield />
          No payment is taken here — this opens WhatsApp so you can confirm details directly with our host family.
        </div>

        <div className={`form-success${success ? ' is-visible' : ''}`}>
          <IconCheckCircle />
          Opening WhatsApp with your message — see you soon in Borobudur!
        </div>
      </form>
    </div>
  );
}
