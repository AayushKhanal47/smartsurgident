import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampaignBySlug } from "../api/endpoints";
import type { Campaign } from "../api/endpoints";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/ui/Reveal";
import PagePlaceholder from "../components/PagePlaceholder";
import { usePageMeta } from "../hooks/usePageMeta";

export default function CampaignLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loaded, setLoaded] = useState(false);

  usePageMeta(
    campaign ? campaign.title : "",
    campaign?.description || (campaign ? `${campaign.title} — promotional offer from Smart Surgident.` : undefined)
  );

  useEffect(() => {
    if (!slug) return;
    setLoaded(false);
    setNotFound(false);
    getCampaignBySlug(slug)
      .then(setCampaign)
      .catch(() => setNotFound(true))
      .finally(() => setLoaded(true));
  }, [slug]);

  if (notFound) {
    return (
      <PagePlaceholder
        title="Campaign not found"
        description="This campaign doesn't exist, isn't active, or has ended."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: "Campaign" }]}
        note="Check the Campaigns list in the admin panel for the correct link, or browse all products instead."
      />
    );
  }

  if (!loaded || !campaign) {
    return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: campaign.title }]}
      />

      <Reveal className="px-6 md:px-10 py-12">
        {campaign.bannerImage && (
          <div className="h-48 md:h-64 bg-brand-tint rounded-3xl overflow-hidden mb-8">
            <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">{campaign.title}</h1>
        {campaign.description && <p className="text-brand-slate text-sm mb-8 max-w-2xl">{campaign.description}</p>}

        {campaign.products.length === 0 ? (
          <p className="text-sm text-brand-muted">No products linked to this campaign yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {campaign.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
