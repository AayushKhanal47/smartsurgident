import { useEffect } from "react";

// Sets this page's <title> and meta description. No cleanup-on-unmount by
// design — the next page's own usePageMeta call (or the static default in
// index.html) naturally overwrites it; resetting on unmount would just cause
// a flash of the wrong title during route transitions.
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    if (!title) return;
    document.title = title.includes("Smart Surgident") ? title : `${title} | Smart Surgident`;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
