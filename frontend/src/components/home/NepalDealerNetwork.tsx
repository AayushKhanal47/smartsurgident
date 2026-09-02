import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { toSvgPaths } from "nepali-geo-pro-max/geo";
import { NEPAL_PROVINCES_GEO } from "nepali-geo-pro-max/geo/provinces";
import { servingCities } from "../../data/homepage";

// Palette literals mirror index.css brand tokens (SVG paint can't read CSS vars).
const MAP_FILL = "#E1ECF3"; // --color-brand-tint
const ACCENT = "#4588B1"; // --color-brand-steel
const INK = "#1F2C41"; // --color-brand-navy

const MAP = toSvgPaths(NEPAL_PROVINCES_GEO, { width: 1100, padding: 26, fill: MAP_FILL });
const [minLongitude, , maxLongitude, maxLatitude] = MAP.bbox;
const mapScale = (MAP.width - 52) / (maxLongitude - minLongitude);

const projectCity = (name: string, latitude: number, longitude: number) => ({
  name,
  x: (longitude - minLongitude) * mapScale + 26,
  y: (maxLatitude - latitude) * mapScale + 26,
});

const CITY_COORDS: Record<string, [number, number]> = {
  Kathmandu: [27.7172, 85.324],
  Pokhara: [28.2096, 83.9856],
  Chitwan: [27.5291, 84.3542],
  Butwal: [27.7006, 83.4484],
  Biratnagar: [26.4525, 87.2718],
};
const CITIES = servingCities
  .filter((c) => CITY_COORDS[c])
  .map((c) => projectCity(c, CITY_COORDS[c][0], CITY_COORDS[c][1]));

export default function NepalDealerNetwork() {
  const reduceMotion = useReducedMotion();
  const [activeCity, setActiveCity] = useState<string | null>(null);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-brand-bg p-4 sm:p-8"
        >
          <svg viewBox={MAP.viewBox} className="w-full h-auto" role="img" aria-label="Map of Nepal showing Smart Surgident dealer cities">
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
            {CITIES.map((city, index) => (
              <motion.g
                key={city.name}
                tabIndex={0}
                role="button"
                aria-label={city.name}
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onMouseEnter={() => setActiveCity(city.name)}
                onMouseLeave={() => setActiveCity((c) => (c === city.name ? null : c))}
                onFocus={() => setActiveCity(city.name)}
                onBlur={() => setActiveCity((c) => (c === city.name ? null : c))}
                onClick={() => setActiveCity((c) => (c === city.name ? null : city.name))}
                className="cursor-pointer outline-none"
              >
                <motion.circle
                  cx={city.x}
                  cy={city.y}
                  r="20"
                  fill={ACCENT}
                  opacity="0.16"
                  animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.16, 0.03, 0.16] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.14 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <circle cx={city.x} cy={city.y} r="9" fill={ACCENT} stroke="#FFFFFF" strokeWidth="4" />
                {activeCity === city.name && (
                  <>
                    <rect x={city.x - 60} y={city.y - 48} rx="10" width="120" height="28" fill="#FFFFFF" stroke={ACCENT} strokeWidth="1.5" />
                    <text x={city.x} y={city.y - 29} textAnchor="middle" fill={INK} style={{ fontSize: "13px", fontWeight: 700 }}>{city.name}</text>
                  </>
                )}
              </motion.g>
            ))}
          </svg>
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
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {servingCities.map((c) => (
              <li key={c} className="text-sm font-medium text-brand-navy">{c}</li>
            ))}
          </ul>
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
