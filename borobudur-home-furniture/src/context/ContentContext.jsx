import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONTENT, fetchAllContent } from "../data/content.js";

const ContentContext = createContext(DEFAULT_CONTENT);

/**
 * Loads all editorial content once and makes it available to every
 * public page via useContent(). Renders with DEFAULT_CONTENT
 * immediately (so there's never an empty/loading flash) and swaps
 * in the real content — from localStorage or Supabase — once it
 * resolves, which for both backends is fast enough not to be
 * noticeable.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    let active = true;
    fetchAllContent().then((data) => {
      if (active) setContent(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
