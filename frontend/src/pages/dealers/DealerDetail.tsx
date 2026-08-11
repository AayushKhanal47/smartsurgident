import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiOutlinePhone, HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { getPublicDealerBySlug } from "../../api/endpoints";
import type { Dealer } from "../../api/endpoints";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";

export default function DealerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getPublicDealerBySlug(slug)
      .then(setDealer)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Dealer not found.</p>;
  }
  if (!dealer) {
    return <p className="px-6 md:px-10 py-16 text-sm text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Dealer Network", to: "/dealers" },
          { label: dealer.name },
        ]}
      />

      <Reveal className="px-6 md:px-10 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="h-56 bg-brand-tint rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
            {dealer.profilePhoto ? (
              <img src={dealer.profilePhoto} alt={dealer.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl">🏬</span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-2">
            {dealer.name}
          </h1>
          <p className="text-sm text-brand-muted flex items-center gap-1 mb-6">
            <HiOutlineLocationMarker aria-hidden="true" />
            {dealer.city?.name}
            {dealer.province ? `, ${dealer.province}` : ""}
          </p>

          {dealer.description && (
            <p className="text-sm text-brand-slate mb-6">{dealer.description}</p>
          )}

          {dealer.storePhotos.length > 0 && (
            <div>
              <p className="font-medium text-brand-navy mb-3 text-sm">Store gallery</p>
              <div className="grid grid-cols-3 gap-3">
                {dealer.storePhotos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`${dealer.name} store photo ${i + 1}`}
                    className="rounded-xl h-24 w-full object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {dealer.brandsCarried.length > 0 && (
            <div className="mt-8">
              <p className="font-medium text-brand-navy mb-3 text-sm">Brands carried</p>
              <div className="flex flex-wrap gap-2">
                {dealer.brandsCarried.map((b) => (
                  <span key={b._id} className="bg-brand-tint text-brand-blue text-xs px-3 py-1.5 rounded-full">
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dealer.services.length > 0 && (
            <div className="mt-8">
              <p className="font-medium text-brand-navy mb-3 text-sm">Services</p>
              <div className="flex flex-wrap gap-2">
                {dealer.services.map((s) => (
                  <span key={s} className="bg-white border border-slate-200 text-brand-navy text-xs px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 h-fit">
          <p className="font-medium text-brand-navy mb-4 text-sm">Contact</p>
          <div className="flex flex-col gap-3 text-sm">
            {dealer.address && (
              <span className="flex items-start gap-2 text-brand-slate">
                <HiOutlineLocationMarker className="mt-0.5 shrink-0" aria-hidden="true" />
                {dealer.address}
              </span>
            )}
            <span className="flex items-center gap-2 text-brand-slate">
              <HiOutlinePhone className="shrink-0" aria-hidden="true" />
              {dealer.phone}
            </span>
            {dealer.whatsapp && (
              <span className="flex items-center gap-2 text-brand-slate">
                <FaWhatsapp className="shrink-0" aria-hidden="true" />
                {dealer.whatsapp}
              </span>
            )}
            {dealer.openingHours && (
              <span className="flex items-center gap-2 text-brand-slate">
                <HiOutlineClock className="shrink-0" aria-hidden="true" />
                {dealer.openingHours}
              </span>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
