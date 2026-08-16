import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineViewGrid,
  HiOutlineUserGroup,
} from "react-icons/hi";
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
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-12 pb-16 md:pt-16 md:pb-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8F1FA] flex items-center justify-center shrink-0">
                  <stat.icon className="text-[#17699A] text-[15px]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0D2947] leading-tight">{stat.value}</p>
                  <p className="text-[11px] text-[#64748B] leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden bg-[#E8F1FA] shadow-[0_20px_50px_-15px_rgba(13,41,71,0.25)]">
            <img
              src={heroImage}
              alt="Dental chair and equipment"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="absolute top-5 right-5 bg-white rounded-full shadow-md px-4 py-2.5 hidden sm:block">
            <div className="flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-wide text-[#0D2947]">
              <span>Quality</span>
              <span className="w-px h-3 bg-[#DCE6EF]" />
              <span>Trust</span>
              <span className="w-px h-3 bg-[#DCE6EF]" />
              <span>Service</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
