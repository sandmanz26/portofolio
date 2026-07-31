/* ============================================================
   BHF — Admin content-editor schema

   Describes how AdminContent.jsx should render the fields of each
   content.js section: which tab it belongs to, a human label, and
   a field list with a type per field (text / textarea / stringList
   / objectList). Purely a UI concern — content.js and the database
   don't know this file exists.
   ============================================================ */

export const CONTENT_TABS = ["Home", "Catalog", "Contact", "Site Settings"];

export const CONTENT_SECTIONS = [
  {
    key: "home_hero",
    tab: "Home",
    label: "Hero",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title (plain part)", type: "text" },
      { key: "titleEmphasis", label: "Title (italic part)", type: "text" },
      { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "backgroundImage", label: "Background image URL", type: "text" },
      { key: "metaItems", label: "Meta strip", type: "stringList", itemPlaceholder: "e.g. Grade-A Teak" },
    ],
  },
  {
    key: "home_about",
    tab: "Home",
    label: "About",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph1", label: "Paragraph 1", type: "textarea" },
      { key: "paragraph2", label: "Paragraph 2", type: "textarea" },
      { key: "image", label: "Image URL", type: "text" },
      {
        key: "facts",
        label: "Facts",
        type: "objectList",
        addLabel: "+ Add fact",
        emptyItem: { number: "", label: "" },
        itemFields: [
          { key: "number", label: "Number" },
          { key: "label", label: "Label" },
        ],
      },
    ],
  },
  {
    key: "home_values",
    tab: "Home",
    label: "Values",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      {
        key: "items",
        label: "Value cards",
        type: "objectList",
        addLabel: "+ Add value",
        emptyItem: { title: "", desc: "" },
        itemFields: [
          { key: "title", label: "Title" },
          { key: "desc", label: "Description", textarea: true },
        ],
      },
    ],
  },
  {
    key: "home_range",
    tab: "Home",
    label: "Product range",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      {
        key: "items",
        label: "Range lines",
        type: "objectList",
        addLabel: "+ Add line",
        emptyItem: { category: "", desc: "" },
        itemFields: [
          { key: "category", label: "Category (must match a real category to link correctly)" },
          { key: "desc", label: "Description", textarea: true },
        ],
      },
    ],
  },
  {
    key: "home_featured",
    tab: "Home",
    label: "Featured section heading",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  {
    key: "home_cta",
    tab: "Home",
    label: "Custom furniture band",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
      { key: "buttonLabel", label: "Button label", type: "text" },
    ],
  },
  {
    key: "home_contact",
    tab: "Home",
    label: "Contact strip",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
      { key: "buttonLabel", label: "Button label", type: "text" },
    ],
  },
  {
    key: "catalog_hero",
    tab: "Catalog",
    label: "Page hero",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
    ],
  },
  {
    key: "catalog_cta",
    tab: "Catalog",
    label: "Custom furniture band",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
      { key: "buttonLabel", label: "Button label", type: "text" },
    ],
  },
  {
    key: "contact_hero",
    tab: "Contact",
    label: "Page hero",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
    ],
  },
  {
    key: "contact_cta",
    tab: "Contact",
    label: "Closing band",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
      { key: "buttonLabel", label: "Button label", type: "text" },
    ],
  },
  {
    key: "site_settings",
    tab: "Site Settings",
    label: "Contact details",
    note: "Used on the Contact page and the homepage contact strip.",
    fields: [
      { key: "tagline", label: "Tagline (footer)", type: "textarea" },
      { key: "whatsappNumber", label: "WhatsApp number (digits only, e.g. 6281227160160)", type: "text" },
      { key: "whatsappDisplay", label: "WhatsApp number (displayed)", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "addressStreet", label: "Address line 1", type: "text" },
      { key: "addressCity", label: "Address line 2", type: "text" },
      { key: "addressMapsUrl", label: "Google Maps URL", type: "text" },
      { key: "hours", label: "Opening hours", type: "stringList", itemPlaceholder: "e.g. Monday – Saturday, 9am – 5pm" },
    ],
  },
  {
    key: "site_branding",
    tab: "Site Settings",
    label: "Branding",
    note: "Used in the header and footer on every page. Upload a logo to replace the text mark, or leave it empty to keep using text.",
    fields: [
      { key: "logoImage", label: "Logo image (optional)", type: "image", placeholder: "Drag a logo here, or click to browse" },
      { key: "brandMark", label: "Brand mark (short, e.g. \"BHF\") — shown if no logo image", type: "text" },
      { key: "brandName", label: "Brand name (full company name)", type: "text" },
      { key: "footerNote", label: "Footer closing line", type: "text" },
    ],
  },
];
