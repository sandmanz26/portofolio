import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal.js";
import { SITE, whatsappLink } from "../data/site.js";

const SUBJECTS = [
  "A ready-stock piece",
  "Custom furniture",
  "A project / partnership",
  "Something else",
];

export default function Contact() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    document.title = `Contact Us — ${SITE.name}`;
  }, []);

  useReveal();

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const lines = [
      `Hello ${SITE.brand}, my name is ${data.get("name")}.`,
      `Regarding: ${data.get("subject")}`,
      "",
      data.get("message"),
      "",
      `Contact: ${data.get("email")}${data.get("phone") ? " / " + data.get("phone") : ""}`,
    ];
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setStatus(
      `Thank you, ${data.get("name")}. Your message is opening in WhatsApp — ` +
        "our team usually replies within one working day."
    );
    form.reset();
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact Us</p>
          <h1 className="page-hero__title">Let's talk.</h1>
          <p className="lead">
            Ask about availability, book a showroom visit, or start a custom
            furniture consultation. We usually reply within one working day.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div className="contact-grid">
            <div className="reveal">
              <div className="contact-block">
                <h3>Showroom &amp; Workshop</h3>
                <p>
                  {SITE.address.street},<br />
                  {SITE.address.city}<br />
                  <a
                    className="link-arrow"
                    style={{ marginTop: "0.9rem" }}
                    href={SITE.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps &rarr;
                  </a>
                </p>
              </div>
              <div className="contact-block">
                <h3>Opening Hours</h3>
                <p>
                  {SITE.hours[0]}<br />
                  {SITE.hours[1]}
                </p>
              </div>
              <div className="contact-block">
                <h3>Phone &amp; WhatsApp</h3>
                <p>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    {SITE.whatsappDisplay}
                  </a>
                </p>
              </div>
              <div className="contact-block">
                <h3>Email</h3>
                <p>
                  <a href={"mailto:" + SITE.email}>{SITE.email}</a>
                </p>
              </div>
            </div>

            <div className="reveal">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cf-name">Name</label>
                    <input id="cf-name" name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-email">Email</label>
                    <input id="cf-email" name="email" type="email" required autoComplete="email" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cf-phone">Phone / WhatsApp (optional)</label>
                    <input id="cf-phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-subject">I'm interested in</label>
                    <select id="cf-subject" name="subject" required defaultValue={SUBJECTS[0]}>
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    required
                    placeholder="Tell us about your space or the piece you have in mind..."
                  ></textarea>
                </div>
                {status && (
                  <p className="form-status is-visible" role="status">{status}</p>
                )}
                <div>
                  <button className="btn btn--solid" type="submit">Send via WhatsApp</button>
                </div>
                <p className="product-detail__note">
                  This form opens WhatsApp with your message already written —
                  nothing is stored on this website.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container cta-band reveal">
          <p className="eyebrow">Since 2016</p>
          <h2 className="section-title">Ten years, one standard: honest handwork.</h2>
          <p className="lead">Visit the showroom and judge the quality with your own hands.</p>
          <Link className="btn btn--inverse" to="/catalog">View the Collection</Link>
        </div>
      </section>
    </>
  );
}
