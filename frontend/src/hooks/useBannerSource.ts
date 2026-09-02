import { useEffect, useState } from "react";
import { getProductBySlug, getResourceBySlug } from "../api/endpoints";
import { getPdfThumbnail } from "../utils/pdfThumbnail";
import type { BannerSource } from "../data/homepage";

export interface ResolvedBanner {
  image: string | null;
  title: string;
  brandName?: string;
  price?: number;
  href: string;
}

interface State {
  data: ResolvedBanner | null;
  loading: boolean;
}

// Resolves a banner's {type, slug} against live catalogue data. Returns
// data:null when the slug doesn't exist — callers render nothing in that case,
// which keeps the homepage correct while the catalogue is still being filled.
export function useBannerSource(source: BannerSource): State {
  const [state, setState] = useState<State>({ data: null, loading: true });

  useEffect(() => {
    let active = true;

    if (!source.slug || !source.slug.trim()) {
      setState({ data: null, loading: false });
      return;
    }

    setState({ data: null, loading: true });

    const run = async () => {
      try {
        if (source.type === "product") {
          const p = await getProductBySlug(source.slug);
          if (!active) return;
          setState({
            loading: false,
            data: {
              image: p.images?.[0] ?? null,
              title: p.name,
              brandName: p.brand?.name,
              price: p.price > 0 ? p.price : undefined,
              href: `/products/${p.slug}`,
            },
          });
        } else {
          const r = await getResourceBySlug(source.slug);
          if (!active) return;
          setState({
            loading: false,
            data: {
              image: getPdfThumbnail(r.fileUrl),
              title: r.title,
              href: `/resources/${r.slug}`,
            },
          });
        }
      } catch {
        if (active) setState({ data: null, loading: false });
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [source.type, source.slug]);

  return state;
}
