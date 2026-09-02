import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight, HiOutlineDocumentText } from "react-icons/hi";
import { getResources } from "../../api/endpoints";
import type { Resource } from "../../api/endpoints";
import { getPdfThumbnail } from "../../utils/pdfThumbnail";

// E-LIBRARY. Real published resources, using the Cloudinary page-1 render of
// each PDF as the cover. Renders nothing if there are none.
export default function ELibraryResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    getResources().then((r) => setResources(r.slice(0, 4))).catch(() => setResources([]));
  }, []);

  if (resources.length === 0) return null;

  return (
    <section className="bg-brand-bg py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div className="max-w-xl">
            <span className="eyebrow">E-Library</span>
            <h2 className="display-2 mt-3 text-brand-navy">Catalogues &amp; product guides</h2>
            <p className="mt-4 text-[15px] md:text-base text-brand-slate leading-relaxed">
              Specifications, manuals and reference material for the equipment we distribute.
            </p>
          </div>
          <Link
            to="/resources"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary"
          >
            Open the E-Library
            <HiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {resources.map((r, i) => {
            const thumb = getPdfThumbnail(r.fileUrl);
            return (
              <motion.div
                key={r._id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/resources/${r.slug}`} className="group block">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white border border-brand-border">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={r.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiOutlineDocumentText className="text-3xl text-brand-muted" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-brand-navy leading-snug group-hover:text-brand-primary transition-colors">
                    {r.title}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
