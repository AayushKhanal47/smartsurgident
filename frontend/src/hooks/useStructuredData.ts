import { useEffect } from "react";

// Injects/updates a <script type="application/ld+json"> tag identified by
// `id`. `data` is null while the page's own data hasn't loaded yet (avoids
// ever emitting a schema block with placeholder/undefined fields) — no
// script is written until real data exists, and the tag is removed on
// unmount so a page that doesn't use a given id doesn't inherit a stale
// block left behind by the previous route.
export function useStructuredData(id: string, data: object | null) {
  useEffect(() => {
    if (!data) return;

    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      document.getElementById(id)?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, JSON.stringify(data)]);
}
