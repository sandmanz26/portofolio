/* ============================================================
   BHF — Site-wide business info
   Single place to change contact details, hours and copy used
   across the header, footer and contact pages.
   ============================================================ */

export const SITE = {
  brand: "BHF",
  name: "Borobudur Home Furniture",
  tagline:
    "Borobudur Home Furniture — solid wood furniture manufacturer in Yogyakarta since 2016.",
  whatsappNumber: "6281227160160",
  whatsappDisplay: "+62 812-2716-0160",
  email: "hello@borobudurhomefurniture.com",
  address: {
    street: "Jl. Parangtritis Km 6.5, Sewon",
    city: "Bantul, Yogyakarta 55188",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Parangtritis+Km+6.5+Sewon+Bantul+Yogyakarta",
  },
  hours: ["Monday – Saturday, 9am – 5pm", "Sunday, 10am – 3pm"],
};

export function whatsappLink(message) {
  const base = "https://wa.me/" + SITE.whatsappNumber;
  return message ? base + "?text=" + encodeURIComponent(message) : base;
}
