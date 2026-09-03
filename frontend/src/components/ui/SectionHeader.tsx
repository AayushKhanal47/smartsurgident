import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeaderProps) {
  const reduceMotion = useReducedMotion();
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col gap-3 max-w-2xl ${alignClass} mb-10`}
    >
      {eyebrow && (
        <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">
          {eyebrow}
        </span>
      )}
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy">{title}</h1>
        {action && <div className="hidden md:block shrink-0">{action}</div>}
      </div>
      {description && <p className="text-brand-slate text-sm md:text-base">{description}</p>}
    </motion.div>
  );
}
