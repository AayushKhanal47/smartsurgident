import { useEffect, useState } from "react";
import { getSiteSettings } from "../api/endpoints";
import type { SiteSettings } from "../api/endpoints";

// Module-level cached promise — same pattern as client.ts's csrf-token
// cache. Footer, OrganizationSchema, and the Contact page all previously
// called getSiteSettings() independently on the same page load (Contact
// specifically: all three at once, since it renders inside SiteLayout
// too), firing 2-3 identical requests for data that only needs fetching
// once per page (perf audit, P0). Every consumer sharing this hook means
// only the first caller on a given page actually hits the network.
let cachedPromise: Promise<SiteSettings | null> | null = null;

function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!cachedPromise) {
    cachedPromise = getSiteSettings().catch(() => null);
  }
  return cachedPromise;
}

export function useSiteSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((data) => {
      if (!cancelled) setSettings(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
