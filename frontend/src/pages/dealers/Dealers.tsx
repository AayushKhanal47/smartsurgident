import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { getPublicDealers } from "../../api/endpoints";
import type { Dealer } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import SectionHeader from "../../components/ui/SectionHeader";
import Reveal from "../../components/ui/Reveal";

export default function Dealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPublicDealers()
      .then(setDealers)
      .catch(() => setDealers([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Dealer Network" }]} />

      <div className="px-6 md:px-10 py-12">
        <SectionHeader
          eyebrow="Nationwide network"
          title="Find a dealer near you"
          description="Every authorized dealer is verified and stocked directly from Smart Surgident."
        />

        {!loaded ? (
          <p className="text-sm text-brand-muted">Loading...</p>
        ) : dealers.length === 0 ? (
          <div className="bg-brand-tint rounded-2xl px-5 py-4 text-sm text-brand-blue max-w-lg">
            No dealers are published yet — once dealer profiles are added from the admin panel,
            they'll appear here with photos, contact details, and location.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dealers.map((dealer, i) => (
              <Reveal key={dealer._id} delay={i * 0.06}>
                <Link
                  to={`/dealers/${dealer.slug}`}
                  className="bg-white rounded-2xl overflow-hidden block hover:shadow-md transition-shadow"
                >
                  <div className="h-32 bg-brand-tint flex items-center justify-center">
                    {dealer.profilePhoto ? (
                      <img
                        src={dealer.profilePhoto}
                        alt={dealer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-brand-light text-3xl">🏬</span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-medium text-brand-navy">{dealer.name}</p>
                    <p className="text-xs text-brand-muted flex items-center gap-1 mt-1">
                      <HiOutlineLocationMarker aria-hidden="true" />
                      {dealer.city?.name}
                      {dealer.province ? `, ${dealer.province}` : ""}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
