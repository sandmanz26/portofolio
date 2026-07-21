import { useContent } from './ContentContext';

// Wraps a single piece of text content so it can be clicked in edit mode
// to open the edit panel. Outside edit mode it renders as a plain Tag
// with no extra markup, so the public site is unaffected.
export default function Editable({ path, fallback, as: Tag = 'span', className, rules = {}, multiline = false }) {
  const { overrides, isEditMode, openEditor } = useContent();
  const value = overrides[path] ?? fallback ?? '';

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      className={`${className ? className + ' ' : ''}admin-editable`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openEditor({
          path,
          value,
          fallback,
          rules: { label: rules.label || path, ...rules },
          type: multiline ? 'textarea' : 'text',
        });
      }}
    >
      {value}
      <span className="admin-editable__badge" aria-hidden="true">✎</span>
    </Tag>
  );
}
