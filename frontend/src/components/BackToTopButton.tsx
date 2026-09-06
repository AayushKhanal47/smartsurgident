import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiOutlineArrowUp } from "react-icons/hi";

const SHOW_AFTER_PX = 400;

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.9 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.9 }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-50 left-4 sm:left-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-6 flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary shadow-[0_10px_28px_rgba(31,44,65,0.28)] text-white hover:bg-brand-primary-hover transition-colors hover:shadow-[0_14px_34px_rgba(31,44,65,0.34)]"
        >
          <HiOutlineArrowUp className="text-xl" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
