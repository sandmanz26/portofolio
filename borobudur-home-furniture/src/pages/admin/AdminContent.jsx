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
import SaveCancelBar from "../../components/admin/SaveCancelBar.jsx";

export default function AdminContent() {
  const [content, setContent] = useState(null);
  const [drafts, setDrafts] = useState({}); // { [sectionKey]: sectionDraft }
  const [activeTab, setActiveTab] = useState(CONTENT_TABS[0]);
  const [error, setError] = useState("");

  async function refresh() {
    setContent(await fetchAllContent());
  }

  useEffect(() => {
    refresh();
  }, []);

  function fieldValue(sectionKey, fieldKey) {
    return (drafts[sectionKey] ?? content[sectionKey])[fieldKey];
  }

  function setField(sectionKey, fieldKey, value) {
    setDrafts((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] ?? content[sectionKey]), [fieldKey]: value },
    }));
  }

  function isDirty(sectionKey) {
    return sectionKey in drafts && JSON.stringify(drafts[sectionKey]) !== JSON.stringify(content[sectionKey]);
  }

  function clearDraft(sectionKey) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[sectionKey];
      return next;
    });
  }

  async function handleSaveSection(sectionKey) {
    const patch = drafts[sectionKey];
    if (!patch) return true;
    try {
      const updated = await updateContentSection(sectionKey, patch);
      setContent((prev) => ({ ...prev, [sectionKey]: updated }));
      clearDraft(sectionKey);
      setError("");
      return true;
    } catch (e) {
      setError(e.message || "Couldn't save that change.");
      return false;
    }
  }

  async function handleResetSection(sectionKey, label) {
    if (!window.confirm(`Reset "${label}" back to the default copy? This section's edits will be lost.`)) return;
    try {
      const updated = await resetContentSection(sectionKey);
      setContent((prev) => ({ ...prev, [sectionKey]: updated }));
      clearDraft(sectionKey);
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
          <p>Edit the copy on Home, Catalog and Contact. Edit a section, then Save or Cancel.</p>
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
        const dirty = isDirty(section.key);
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
                      value={fieldValue(section.key, field.key)}
                      onChange={(v) => setField(section.key, field.key, v)}
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
                    items={fieldValue(section.key, field.key)}
                    itemPlaceholder={field.itemPlaceholder}
                    onChange={(next) => setField(section.key, field.key, next)}
                  />
                </div>
              ))}

            {section.fields
              .filter((f) => f.type === "objectList")
              .map((field) => (
                <div className="admin-field-block admin-field-block--wide" key={field.key}>
                  <p className="admin-field-block__label">{field.label}</p>
                  <ArrayFieldEditor
                    items={fieldValue(section.key, field.key)}
                    itemFields={field.itemFields}
                    addLabel={field.addLabel}
                    emptyItem={field.emptyItem}
                    onChange={(next) => setField(section.key, field.key, next)}
                  />
                </div>
              ))}

            <SaveCancelBar
              dirty={dirty}
              onSave={() => handleSaveSection(section.key)}
              onCancel={() => clearDraft(section.key)}
            />
          </section>
        );
      })}
    </div>
  );
}
