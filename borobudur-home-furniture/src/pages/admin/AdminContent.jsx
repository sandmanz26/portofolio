import { useEffect, useState } from "react";
import {
  fetchAllContent,
  isContentPersistenceAvailable,
  resetContentSection,
  updateContentSection,
} from "../../data/content.js";
import { CONTENT_SECTIONS, CONTENT_TABS } from "../../data/contentSchema.js";
import InlineText from "../../components/admin/InlineText.jsx";
import ArrayFieldEditor from "../../components/admin/ArrayFieldEditor.jsx";
import StringListEditor from "../../components/admin/StringListEditor.jsx";

export default function AdminContent() {
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState(CONTENT_TABS[0]);
  const [error, setError] = useState("");

  async function refresh() {
    setContent(await fetchAllContent());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function save(sectionKey, patch) {
    try {
      const updated = await updateContentSection(sectionKey, patch);
      setContent((prev) => ({ ...prev, [sectionKey]: updated }));
      setError("");
    } catch (e) {
      setError(e.message || "Couldn't save that change.");
    }
  }

  async function handleResetSection(sectionKey, label) {
    if (!window.confirm(`Reset "${label}" back to the default copy? This section's edits will be lost.`)) return;
    try {
      const updated = await resetContentSection(sectionKey);
      setContent((prev) => ({ ...prev, [sectionKey]: updated }));
      setError("");
    } catch (e) {
      setError(e.message || "Couldn't reset that section.");
    }
  }

  if (!content) return <p className="admin-loading">Loading…</p>;

  const sectionsForTab = CONTENT_SECTIONS.filter((s) => s.tab === activeTab);

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Site Content</h1>
          <p>Edit the copy on Home, Catalog and Contact. Changes save automatically as you type.</p>
        </div>
      </div>

      {!isContentPersistenceAvailable() && (
        <p className="admin-banner admin-banner--warn">
          Local storage isn't available in this browser — your changes will be lost on reload.
        </p>
      )}
      {error && <p className="admin-banner admin-banner--error">{error}</p>}

      <div className="admin-tabs" role="tablist">
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === activeTab}
            className={"admin-tabs__btn" + (tab === activeTab ? " is-active" : "")}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {sectionsForTab.map((section) => {
        const values = content[section.key];
        return (
          <section className="admin-content-section" key={section.key}>
            <div className="admin-content-section__head">
              <h2>{section.label}</h2>
              <button type="button" onClick={() => handleResetSection(section.key, section.label)}>
                Reset to default
              </button>
            </div>
            {section.note && <p className="admin-content-section__note">{section.note}</p>}

            <div className="admin-fieldset__row">
              {section.fields
                .filter((f) => f.type === "text" || f.type === "textarea")
                .map((field) => (
                  <label key={field.key}>
                    {field.label}
                    <InlineText
                      textarea={field.type === "textarea"}
                      rows={3}
                      value={values[field.key]}
                      onSave={(v) => save(section.key, { [field.key]: v })}
                    />
                  </label>
                ))}
            </div>

            {section.fields
              .filter((f) => f.type === "stringList")
              .map((field) => (
                <div className="admin-field-block admin-field-block--wide" key={field.key}>
                  <p className="admin-field-block__label">{field.label}</p>
                  <StringListEditor
                    items={values[field.key]}
                    itemPlaceholder={field.itemPlaceholder}
                    onChange={(next) => save(section.key, { [field.key]: next })}
                  />
                </div>
              ))}

            {section.fields
              .filter((f) => f.type === "objectList")
              .map((field) => (
                <div className="admin-field-block admin-field-block--wide" key={field.key}>
                  <p className="admin-field-block__label">{field.label}</p>
                  <ArrayFieldEditor
                    items={values[field.key]}
                    itemFields={field.itemFields}
                    addLabel={field.addLabel}
                    emptyItem={field.emptyItem}
                    onChange={(next) => save(section.key, { [field.key]: next })}
                  />
                </div>
              ))}
          </section>
        );
      })}
    </div>
  );
}
