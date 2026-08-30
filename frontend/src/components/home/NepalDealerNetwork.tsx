import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HiArrowRight, HiOutlineClock, HiOutlineGlobeAlt, HiOutlineMap, HiOutlineUserGroup } from "react-icons/hi";
import { toSvgPaths } from "nepali-geo-pro-max/geo";
import { NEPAL_PROVINCES_GEO } from "nepali-geo-pro-max/geo/provinces";

const MAP = toSvgPaths(NEPAL_PROVINCES_GEO, { width: 1100, padding: 26, fill: "#E8F1FA" });
const [minLongitude, , maxLongitude, maxLatitude] = MAP.bbox;
const mapScale = (MAP.width - 52) / (maxLongitude - minLongitude);

const projectCity = (name: string, latitude: number, longitude: number) => ({
  name,
  x: (longitude - minLongitude) * mapScale + 26,
  y: (maxLatitude - latitude) * mapScale + 26,
});

// Real city coordinates are projected through the same map projection as the boundary.
const CITIES = [
  projectCity("Kathmandu", 27.7172, 85.324),
  projectCity("Pokhara", 28.2096, 83.9856),
  projectCity("Chitwan", 27.5291, 84.3542),
  projectCity("Butwal", 27.7006, 83.4484),
  projectCity("Biratnagar", 26.4525, 87.2718),
];

const INFO = [
  { icon: HiOutlineMap, label: "Multiple Regions" },
  { icon: HiOutlineUserGroup, label: "Growing Dealer Network" },
  { icon: HiOutlineGlobeAlt, label: "Nationwide Coverage" },
  { icon: HiOutlineClock, label: "Dedicated Support" },
];

export default function NepalDealerNetwork() {
  const reduceMotion = useReducedMotion();
  const [activeCity, setActiveCity] = useState<string | null>(null);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-[#17699A] text-xs font-bold uppercase tracking-wider">Nationwide Presence</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0D2947] mt-2">Our dealer network across Nepal</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 rounded-2xl border border-[#DCE6EF] bg-[#F7FAFD] p-2 sm:p-4 overflow-hidden">
            <svg viewBox={MAP.viewBox} className="w-full h-auto" role="img" aria-label="Outline map of Nepal showing dealer cities">
              <defs>
                <filter id="nepal-outline" x="-3%" y="-8%" width="106%" height="116%">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="expanded" />
                  <feFlood floodColor="#17699A" result="outlineColor" />
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
                  onMouseLeave={() => setActiveCity((current) => (current === city.name ? null : current))}
                  onFocus={() => setActiveCity(city.name)}
                  onBlur={() => setActiveCity((current) => (current === city.name ? null : current))}
                  onClick={() => setActiveCity((current) => (current === city.name ? null : city.name))}
                  className="cursor-pointer outline-none"
                >
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r="20"
                    fill="#17699A"
                    opacity="0.22"
                    animate={reduceMotion ? undefined : { scale: [1, 1.3, 1], opacity: [0.22, 0.05, 0.22] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  <circle cx={city.x} cy={city.y} r="10" fill="#17699A" stroke="#FFFFFF" strokeWidth="4" />
                  {activeCity === city.name && (
                    <>
                      <rect x={city.x - 62} y={city.y - 50} rx="12" width="124" height="30" fill="#FFFFFF" stroke="#17699A" strokeWidth="2" />
                      <text x={city.x} y={city.y - 30} textAnchor="middle" className="fill-[#0D2947]" style={{ fontSize: "14px", fontWeight: 700 }}>{city.name}</text>
                    </>
                  )}
                </motion.g>
              ))}
            </svg>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {INFO.map((item) => (
                <div key={item.label} className="bg-[#F7FAFD] rounded-xl p-4">
                  <item.icon className="text-[#17699A] text-lg mb-2" aria-hidden="true" />
                  <p className="text-xs font-semibold text-[#0D2947] leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-[#64748B]">Outline includes the north-western Limpiyadhura–Lipulekh–Kalapani region.</p>
            <Link to="/dealers" className="text-sm font-semibold text-[#17699A] hover:text-[#0D2947] transition-colors flex items-center gap-1">
              View all dealers <HiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
