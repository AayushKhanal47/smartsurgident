import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBrands, getProducts, getResources } from "../api/endpoints";
import type { Brand, Product, Resource } from "../api/endpoints";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/ui/Reveal";
import { getPdfThumbnail } from "../utils/pdfThumbnail";
import { getTrimmedLogoUrl } from "../utils/brandLogo";
import { usePageMeta } from "../hooks/usePageMeta";
import { HiOutlineDocumentText, HiOutlineExternalLink } from "react-icons/hi";

export default function BrandDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<Resource[]>([]);

  usePageMeta(
    brand ? brand.name : "",
    brand ? `${brand.name} dental and surgical equipment, distributed across Nepal by Smart Surgident.` : undefined
  );

  useEffect(() => {
    getBrands().then((brands) => {
      const found = brands.find((b) => b.slug === slug) || null;
      setBrand(found);
      if (found) {
        getProducts({ brand: found._id }).then(setProducts).catch(() => setProducts([]));
        getResources({ brand: found._id }).then(setDocuments).catch(() => setDocuments([]));
      }
    });
  }, [slug]);

  if (!brand) return <p className="px-10 py-16 text-sm text-brand-muted">Loading...</p>;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Brands", to: "/brands" }, { label: brand.name }]} />

      <Reveal className="px-6 md:px-10 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-tint flex items-center justify-center overflow-hidden shrink-0">
            {brand.logoUrl ? (
              <img src={getTrimmedLogoUrl(brand.logoUrl)} alt={brand.name} className="w-full h-full object-contain p-2.5" />
            ) : (
              <span className="text-brand-blue font-semibold text-xl">{brand.name[0]}</span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy">{brand.name}</h1>
        </div>

        <p className="font-semibold text-brand-navy mb-4">Products from {brand.name}</p>
        {products.length === 0 ? (
          <p className="text-sm text-brand-muted">No products listed for this brand yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {documents.length > 0 && (
          <div className="mt-12 pt-10 border-t border-brand-border">
            <p className="font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <HiOutlineDocumentText className="text-brand-primary" aria-hidden="true" />
              Documents &amp; catalogues from {brand.name}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {documents.map((doc) => (
                <a
                  key={doc._id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-lg overflow-hidden border border-slate-300 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all"
                >
                  <div className="aspect-[3/4] bg-brand-tint flex items-center justify-center overflow-hidden border-b border-slate-200">
                    {doc.coverImage || getPdfThumbnail(doc.fileUrl) ? (
                      <img
                        src={doc.coverImage || getPdfThumbnail(doc.fileUrl)!}
                        alt={doc.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-brand-light text-2xl">📄</span>
                    )}
                  </div>
                  <div className="p-2.5 text-center">
                    <p className="font-medium text-brand-navy text-xs truncate">{doc.title}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-brand-blue group-hover:text-brand-navy transition-colors">
                      Open PDF
                      <HiOutlineExternalLink aria-hidden="true" />
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </div>
  );
}
