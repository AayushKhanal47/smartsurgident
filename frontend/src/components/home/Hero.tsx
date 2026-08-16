import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "../ui/Button";
import {
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineViewGrid,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import heroImage from "../../assets/hero.png";

const STATS = [
  {
    icon: HiOutlineCube,
    label: "Products",
    value: "500+",
  },
  {
    icon: HiOutlineTag,
    label: "Brands",
    value: "50+",
  },
  {
    icon: HiOutlineViewGrid,
    label: "Categories",
    value: "20+",
  },
  {
    icon: HiOutlineLocationMarker,
    label: "Dealer Network",
    value: "Nationwide",
  },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="
        relative
        isolate
        h-[650px]
        overflow-hidden
        bg-white

        sm:h-[650px]

        md:h-[610px]

        lg:h-[600px]

        xl:h-[610px]
      "
    >
      {/* =========================================================
          DENTAL IMAGE
          ========================================================= */}
      <div
        className="
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        <img
          src={heroImage}
          alt="Dental chair and equipment"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover

            object-[66%_center]

            sm:object-[68%_center]

            md:object-[70%_center]

            lg:object-[72%_center]
          "
        />

        {/* Desktop white fade into text area */}
        <div
          className="
            absolute
            inset-y-0
            left-0
            z-10
            w-[64%]
            bg-gradient-to-r
            from-white
            via-white/95
            via-[45%]
            to-transparent

            md:w-[61%]

            lg:w-[58%]
          "
        />

        {/* Additional soft lower fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            z-10
            h-[32%]
            bg-gradient-to-t
            from-white/55
            via-white/10
            to-transparent
          "
        />

        {/* Mobile readability layer */}
        <div
          className="
            absolute
            inset-0
            z-10
            bg-gradient-to-b
            from-white/95
            via-white/75
            via-[52%]
            to-white/20

            md:hidden
          "
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <div
        className="
          relative
          z-20
          mx-auto
          h-full
          max-w-[1440px]
          px-6

          sm:px-8

          md:px-10

          lg:px-12

          xl:px-14
        "
      >
        <div
          className="
            flex
            h-full
            items-start
          "
        >
          <div
            className="
              flex
              h-full
              w-full
              flex-col
              justify-center

              md:w-[57%]

              lg:w-[54%]

              xl:w-[53%]
            "
          >
            {/* =====================================================
                BADGE
                ===================================================== */}
            <motion.div
              initial={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: 10 }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="
                mb-5

                sm:mb-6

                md:mb-5
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-[#E8F3FA]
                  px-4
                  py-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.09em]
                  text-[#17699A]

                  sm:text-[11px]
                "
              >
                Nationwide Dealer Network
              </span>
            </motion.div>

            {/* =====================================================
                HEADING
                ===================================================== */}
            <motion.h1
              initial={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: 14 }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.55,
                delay: 0.06,
                ease: "easeOut",
              }}
              className="
                max-w-[680px]
                font-display
                text-[2.35rem]
                font-extrabold
                leading-[1.04]
                tracking-[-0.045em]
                text-[#0D2947]

                sm:text-[2.7rem]
                sm:leading-[1.04]

                md:text-[3rem]

                lg:text-[3.2rem]

                xl:text-[3.35rem]
              "
            >
              Advancing dentistry through{" "}
              <span className="text-[#17699A]">
                trusted products
              </span>{" "}
              &amp; distribution
            </motion.h1>

            {/* =====================================================
                DESCRIPTION
                ===================================================== */}
            <motion.p
              initial={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: 12 }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.5,
                delay: 0.13,
                ease: "easeOut",
              }}
              className="
                mt-5
                max-w-[600px]
                text-[14px]
                font-medium
                leading-[1.65]
                text-[#5D7189]

                sm:mt-5
                sm:text-[15px]

                md:mt-5
                md:text-[15px]

                lg:text-[16px]
                lg:leading-[1.65]
              "
            >
              Genuine dental and surgical instruments imported from China,
              India and beyond — verified, stocked, and delivered by dealers
              across Nepal.
            </motion.p>

            {/* =====================================================
                BUTTONS
                ===================================================== */}
            <motion.div
              initial={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: 10 }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.45,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-3

                sm:mt-6

                md:mt-6
              "
            >
              <ButtonLink
                to="/products"
                className="
                  !rounded-full
                  !px-6
                  !py-3
                  !text-sm
                  !font-semibold
                "
              >
                Browse Catalog
              </ButtonLink>

              <ButtonLink
                to="/support/quote"
                variant="secondary"
                className="
                  !rounded-full
                  !border-[#D4E2ED]
                  !bg-white/90
                  !px-6
                  !py-3
                  !text-sm
                  !font-semibold
                  !text-[#17699A]
                "
              >
                Request a Quote
              </ButtonLink>
            </motion.div>

            {/* =====================================================
                STATS
                ===================================================== */}
            <motion.div
              initial={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: 10 }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.45,
                delay: 0.27,
                ease: "easeOut",
              }}
              className="
                mt-7
                max-w-[700px]
                border-t
                border-[#DCE6EF]
                pt-5

                sm:mt-7

                md:mt-7
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-5
                  gap-y-4

                  sm:grid-cols-4
                  sm:gap-x-4
                  sm:gap-y-0
                "
              >
                {STATS.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                      "
                    >
                      <Icon
                        className="
                          shrink-0
                          text-[19px]
                          text-[#17699A]

                          sm:text-[18px]
                        "
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <p
                          className="
                            text-[15px]
                            font-bold
                            leading-tight
                            text-[#0D2947]

                            sm:text-[14px]

                            lg:text-[15px]
                          "
                        >
                          {stat.value}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            font-medium
                            leading-tight
                            text-[#5D7189]

                            sm:text-[9px]

                            lg:text-[10px]
                          "
                        >
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* =========================================================
          QUALITY / TRUST / SERVICE
          ========================================================= */}
      <motion.div
        initial={
          reduceMotion
            ? undefined
            : { opacity: 0, y: -6 }
        }
        animate={
          reduceMotion
            ? undefined
            : { opacity: 1, y: 0 }
        }
        transition={{
          duration: 0.45,
          delay: 0.3,
        }}
        className="
          absolute
          right-6
          top-8
          z-30
          hidden
          rounded-full
          bg-white
          px-5
          py-3
          shadow-[0_8px_25px_rgba(15,23,42,0.12)]

          sm:flex

          md:right-8
          md:top-8

          lg:right-10
          lg:top-9

          xl:right-12
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-[9px]
            font-bold
            uppercase
            tracking-[0.04em]
            text-[#0D2947]
          "
        >
          <span>Quality</span>

          <span className="h-4 w-px bg-[#DCE6EF]" />

          <span>Trust</span>

          <span className="h-4 w-px bg-[#DCE6EF]" />

          <span>Service</span>
        </div>
      </motion.div>

      {/* =========================================================
          CURVED WHITE BOTTOM
          ========================================================= */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-[-1px]
          left-1/2
          z-30
          h-[62px]
          w-[120%]
          -translate-x-1/2
          rounded-[50%_50%_0_0/100%_100%_0_0]
          bg-white

          sm:h-[65px]

          md:h-[62px]

          lg:h-[64px]
        "
      />
    </section>
  );
}