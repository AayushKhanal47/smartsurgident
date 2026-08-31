import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import { HiOutlineCube, HiOutlineTag, HiOutlineViewGrid, HiOutlineUserGroup } from "react-icons/hi";
import heroImage from "../../assets/hero.png";

const STATS = [
  { icon: HiOutlineCube, label: "Products", value: "500+" },
  { icon: HiOutlineTag, label: "Brands", value: "50+" },
  { icon: HiOutlineViewGrid, label: "Categories", value: "20+" },
  { icon: HiOutlineUserGroup, label: "Dealer Network", value: "Nationwide" },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden min-h-[560px] md:min-h-[640px] flex items-center">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Dental chair and equipment"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay so white text/badges stay readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2947]/90 via-[#0D2947]/60 to-[#0D2947]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2947]/50 via-transparent to-transparent md:hidden" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-0 w-full">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="inline-block bg-white/15 backdrop-blur text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-5 border border-white/20">
            Nationwide Dealer Network
          </span>

          <h1 className="text-[2.1rem] sm:text-[2.5rem] lg:text-[2.75rem] font-display font-extrabold text-white leading-[1.12] mb-4 tracking-tight">
            Advancing dentistry through{" "}
            <span className="text-[#4FA8D8]">trusted products</span> &amp; distribution all over Nepal
          </h1>

          <p className="text-white/80 text-[15px] leading-relaxed mb-7 max-w-md">
            Genuine dental and surgical instruments. Delivered all over Nepal.
          </p>

          <div className="flex gap-3 flex-wrap mb-9">
            <ButtonLink to="/products">Browse Catalog</ButtonLink>
            <ButtonLink to="/support/quote" variant="secondary" className="!bg-white/90">
              Request a Quote
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="text-[#4FA8D8] text-lg shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{stat.value}</p>
                  <p className="text-[11px] text-white/70 leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 bg-white rounded-full shadow-md px-5 py-3 hidden md:block">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-[#0D2947]">
          <span>Quality</span>
          <span className="w-px h-3 bg-[#DCE6EF]" />
          <span>Trust</span>
          <span className="w-px h-3 bg-[#DCE6EF]" />
          <span>Service</span>
        </div>
      </div>
    </section>
  );
}
