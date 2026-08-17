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
    <section className="relative bg-white overflow-hidden">
      {/* Desktop: image bleeds to the right edge, blended into white via gradient */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[55%] lg:w-[52%]">
        <img
          src={heroImage}
          alt="Dental chair and equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white via-white/70 to-transparent" />

        <div className="absolute top-8 right-8 bg-white rounded-full shadow-md px-5 py-3">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-[#0D2947]">
            <span>Quality</span>
            <span className="w-px h-3 bg-[#DCE6EF]" />
            <span>Trust</span>
            <span className="w-px h-3 bg-[#DCE6EF]" />
            <span>Service</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pt-12 pb-10 md:py-24">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:max-w-[52%] lg:max-w-[48%]"
        >
          <span className="inline-block bg-[#E8F1FA] text-[#17699A] text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-5">
            Nationwide Dealer Network
          </span>

          <h1 className="text-[2.1rem] sm:text-[2.5rem] lg:text-[2.75rem] font-display font-extrabold text-[#0D2947] leading-[1.12] mb-4 tracking-tight">
            Advancing dentistry through{" "}
            <span className="text-[#17699A]">trusted products</span> &amp; distribution
          </h1>

          <p className="text-[#64748B] text-[15px] leading-relaxed mb-7 max-w-md">
            Genuine dental and surgical instruments imported from China, India and beyond —
            verified, stocked, and delivered by dealers across Nepal.
          </p>

          <div className="flex gap-3 flex-wrap mb-9">
            <ButtonLink to="/products">Browse Catalog</ButtonLink>
            <ButtonLink to="/support/quote" variant="secondary">
              Request a Quote
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="text-[#17699A] text-lg shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-[#0D2947] leading-tight">{stat.value}</p>
                  <p className="text-[11px] text-[#64748B] leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile: image shown below content as a contained rounded block */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="md:hidden relative mt-8 rounded-2xl overflow-hidden bg-[#E8F1FA]"
        >
          <img
            src={heroImage}
            alt="Dental chair and equipment"
            className="w-full h-56 sm:h-72 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full shadow-md px-3.5 py-2">
            <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wide text-[#0D2947]">
              <span>Quality</span>
              <span className="w-px h-2.5 bg-[#DCE6EF]" />
              <span>Trust</span>
              <span className="w-px h-2.5 bg-[#DCE6EF]" />
              <span>Service</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
