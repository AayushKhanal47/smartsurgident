import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineBeaker,
  HiOutlineSparkles,
  HiOutlineScissors,
} from "react-icons/hi2";
import { HiOutlineCog } from "react-icons/hi";

const CATEGORIES = [
  {
    name: "Dental Equipment",
    description: "Chairs, lights, compressors and more",
    icon: HiOutlineWrenchScrewdriver,
    slug: "dental-equipment",
  },
  {
    name: "Dental Instruments",
    description: "Precision instruments for every procedure",
    icon: HiOutlineScissors,
    slug: "dental-instruments",
  },
  {
    name: "Endodontics",
    description: "Files, burs, obturation and accessories",
    icon: HiOutlineCog,
    slug: "endodontics",
  },
  {
    name: "Orthodontics",
    description: "Professional orthodontic solutions",
    icon: HiOutlineSparkles,
    slug: "orthodontics",
  },
  {
    name: "Surgical",
    description: "Surgical instruments and medical supplies",
    icon: HiOutlineBeaker,
    slug: "surgical",
  },
  {
    name: "Infection Control",
    description: "Sterilization and infection control products",
    icon: HiOutlineSparkles,
    slug: "infection-control",
  },
];

export default function SolutionAreas() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">
              What We Supply
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mt-2">
              Solution areas
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-blue hover:text-brand-navy transition-colors flex items-center gap-1"
          >
            View all categories <HiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="group block bg-white border border-brand-border rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-tint flex items-center justify-center mb-4 group-hover:bg-brand-blue transition-colors">
                  <cat.icon className="text-lg text-brand-blue group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <p className="font-semibold text-brand-navy mb-1">{cat.name}</p>
                <p className="text-sm text-brand-slate mb-3">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
                  Explore
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
