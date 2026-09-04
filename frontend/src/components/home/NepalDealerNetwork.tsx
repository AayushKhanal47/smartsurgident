import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiArrowRight, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { toSvgPaths } from "nepali-geo-pro-max/geo";
import { NEPAL_PROVINCES_GEO } from "nepali-geo-pro-max/geo/provinces";
import { servingCities } from "../../data/homepage";
import { getPublicDealers } from "../../api/endpoints";
import type { Dealer } from "../../api/endpoints";

// Palette literals mirror index.css brand tokens (SVG paint can't read CSS vars).
const MAP_FILL = "#E1ECF3"; // --color-brand-tint
const ACCENT = "#4588B1"; // --color-brand-steel

const MAP = toSvgPaths(NEPAL_PROVINCES_GEO, { width: 1100, padding: 26, fill: MAP_FILL });
const [minLongitude, , maxLongitude, maxLatitude] = MAP.bbox;
const mapScale = (MAP.width - 52) / (maxLongitude - minLongitude);

const projectCity = (name: string, latitude: number, longitude: number) => ({
  name,
  // Percent-of-container coordinates — HTML labels stay a fixed, readable
  // font size on every screen instead of scaling (and shrinking) with the
  // SVG viewBox the way in-SVG <text> would on narrow phones.
  xPct: ((longitude - minLongitude) * mapScale + 26) / MAP.width * 100,
  yPct: ((maxLatitude - latitude) * mapScale + 26) / MAP.height * 100,
});

const CITY_COORDS: Record<string, [number, number]> = {
  Kathmandu: [27.7172, 85.324],
  Pokhara: [28.2096, 83.9856],
  Chitwan: [27.5291, 84.3542],
  Butwal: [27.7006, 83.4484],
  // Nudged ~0.15° north of Biratnagar's real coordinate — the city sits so
  // close to the actual India border that the raw coordinate renders right
  // on (sometimes just outside) this map's simplified southern boundary.
  Biratnagar: [26.75, 87.25],
};

// Chitwan and Butwal project close together — drop Chitwan's label below its
// dot (instead of the default above) so the two never overlap.
const LABEL_BELOW = new Set(["Chitwan"]);

const CITIES = servingCities
  .filter((c) => CITY_COORDS[c])
  .map((c) => projectCity(c, CITY_COORDS[c][0], CITY_COORDS[c][1]));

export default function NepalDealerNetwork() {
  const reduceMotion = useReducedMotion();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [dealers, setDealers] = useState<Dealer[]>([]);

  useEffect(() => {
    getPublicDealers().then(setDealers).catch(() => setDealers([]));
  }, []);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid xl:grid-cols-[2fr_1fr] gap-10 xl:gap-16 items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-brand-bg p-3 sm:p-5 md:p-6"
        >
          {/* This wrapper's box exactly matches the SVG's rendered box (no
              padding of its own) — city markers below are positioned with
              percentages against IT, not the padded card, so they land
              exactly on the map instead of drifting into the padding. */}
          <div className="relative">
            <svg viewBox={MAP.viewBox} className="w-full h-auto block" role="img" aria-label="Map of Nepal showing Smart Surgident dealer cities">
              <defs>
                <filter id="nepal-outline" x="-3%" y="-8%" width="106%" height="116%">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="expanded" />
                  <feFlood floodColor={ACCENT} result="outlineColor" />
                  <feComposite in="outlineColor" in2="expanded" operator="in" result="outline" />
                  <feMerge><feMergeNode in="outline" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g filter="url(#nepal-outline)">
                {MAP.paths.map((path) => <path key={path.id} d={path.d} fill={path.fill} />)}
              </g>
            </svg>

            {/* City markers + always-visible labels, positioned in HTML over
                the SVG (percent coordinates) so text stays crisp and legible
                at any viewport width instead of scaling down with the map. */}
            {CITIES.map((city, index) => {
              const isActive = activeCity === city.name;
              const below = LABEL_BELOW.has(city.name);
              return (
                <div
                  key={city.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${city.xPct}%`, top: `${city.yPct}%` }}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`Smart Surgident dealer in ${city.name}`}
                    onMouseEnter={() => setActiveCity(city.name)}
                    onMouseLeave={() => setActiveCity((c) => (c === city.name ? null : c))}
                    onFocus={() => setActiveCity(city.name)}
                    onBlur={() => setActiveCity((c) => (c === city.name ? null : c))}
                    onClick={() => setActiveCity((c) => (c === city.name ? null : city.name))}
                    className={`group flex items-center gap-1.5 outline-none ${below ? "flex-col-reverse" : "flex-col"}`}
                  >
                    <span
                      className={`whitespace-nowrap rounded-full border bg-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] md:text-xs font-semibold shadow-sm transition-colors duration-200 ${
                        isActive
                          ? "border-brand-primary text-brand-primary shadow-md"
                          : "border-brand-border text-brand-navy"
                      }`}
                    >
                      {city.name}
                    </span>

                    <span className="relative flex items-center justify-center shrink-0 w-4 h-4 sm:w-6 sm:h-6">
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full"
                        style={{ background: ACCENT, opacity: 0.16 }}
                        animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [0.16, 0.02, 0.16] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.16 }}
                      />
                      <span
                        aria-hidden="true"
                        className="block rounded-full ring-2 sm:ring-4 ring-white transition-transform duration-200 group-hover:scale-110 w-2 h-2 sm:w-3 sm:h-3"
                        style={{
                          background: isActive ? "#2d6285" : ACCENT,
                          boxShadow: "0 1px 3px rgba(31,44,65,0.35)",
                        }}
                      />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Nationwide presence</span>
          <h2 className="display-2 mt-3 text-brand-navy">Close to your clinic</h2>
          <p className="mt-5 text-[15px] md:text-base leading-relaxed text-brand-slate max-w-md">
            A growing dealer network keeps genuine equipment, parts and support within
            reach across the country.
          </p>
          {dealers.length > 0 ? (
            <ul className="mt-7 flex flex-col gap-4 max-h-80 overflow-y-auto pr-2">
              {dealers.map((d) => (
                <li key={d._id}>
                  <Link to={`/dealers/${d.slug}`} className="group block">
                    <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-primary transition-colors">
                      {d.name}
                      <span className="ml-2 font-normal text-brand-muted">· {d.city?.name}</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-slate">
                      <HiOutlinePhone className="shrink-0" aria-hidden="true" />
                      {d.phone}
                    </p>
                    {d.address && (
                      <p className="mt-0.5 flex items-start gap-1.5 text-xs text-brand-slate">
                        <HiOutlineLocationMarker className="shrink-0 mt-0.5" aria-hidden="true" />
                        {d.address}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {servingCities.map((c) => (
                <li key={c} className="text-sm font-medium text-brand-navy">{c}</li>
              ))}
            </ul>
          )}
          <Link
            to="/dealers"
            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary"
          >
            View all dealers
            <HiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
