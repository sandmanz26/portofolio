import { useEffect, useRef } from "react";

/**
 * A minimal WYSIWYG editor for product descriptions: bold, italic,
 * bullet and numbered lists. Built on contentEditable + execCommand
 * rather than a library — execCommand is deprecated but every major
 * browser still supports exactly these four commands, and pulling in
 * a rich-text dependency (Quill, Tiptap, ...) felt disproportionate
 * for "bold/italic/lists" on a furniture description. Revisit with a
 * real library if richer formatting (links, images, tables) is ever
 * needed.
 *
 * Stores/returns an HTML string. The public product page renders it
 * with dangerouslySetInnerHTML (see ProductDetail.jsx) — safe here
 * because the only path that writes it is this authenticated admin
 * editor, not user input.
 */
export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);

  // Keep the DOM in sync with external value changes (e.g. Cancel
  // reverting the draft) without stomping on the cursor mid-typing —
  // this only touches the DOM when the two actually differ, which is
  // false on every keystroke (onInput already updated both).
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  // insertUnorderedList/insertOrderedList do not reliably leave the
  // caret where you'd expect after they restructure the DOM around a
  // collapsed cursor — observed landing at the START of the new list
  // item instead of where the cursor was, so the next character typed
  // inserted itself before the existing text. Forcing the selection to
  // the end of the editor's content right after fixes that. Bold/italic
  // must NOT get this treatment: toggled at a collapsed cursor (not a
  // selection), they rely on the browser's own "apply to whatever's
  // typed next" state, which replacing the selection object throws away.
  const CARET_FIX_COMMANDS = new Set(["insertUnorderedList", "insertOrderedList"]);

  function exec(command) {
    // No ref.current.focus() here: each toolbar button already has
    // onMouseDown -> preventDefault, which is what keeps the
    // contentEditable focused (and its selection/caret position
    // intact) through the click.
    document.execCommand(command, false, null);
    if (CARET_FIX_COMMANDS.has(command)) {
      const el = ref.current;
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    onChange(ref.current.innerHTML);
  }

  const isEmpty = !value || value === "<br>";

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <button type="button" title="Bold" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")}>
          <strong>B</strong>
        </button>
        <button type="button" title="Italic" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")}>
          <em>I</em>
        </button>
        <button
          type="button"
          title="Bullet list"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("insertUnorderedList")}
        >
          &#8226; List
        </button>
        <button
          type="button"
          title="Numbered list"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("insertOrderedList")}
        >
          1. List
        </button>
      </div>
      <div className="rich-editor__body-wrap">
        {isEmpty && placeholder && <span className="rich-editor__placeholder">{placeholder}</span>}
        <div
          ref={ref}
          className="rich-editor__body"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}
