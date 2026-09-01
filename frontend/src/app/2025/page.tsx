"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

export default function Home() {
  const router = useRouter();

  // Track page-level scroll for a normalized 0→1 progress
  const { scrollYProgress } = useScroll();

  // Keep the stage visible throughout the sequence (no fade at the end)
  const contentOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  // Move text from above and Earth from below into center, then hold
  const titleY = useTransform(scrollYProgress, [0.1, 1], ["-50vh", "0vh"]);
  const earthY = useTransform(scrollYProgress, [0.1, 1], ["50vh", "0vh"]);

  // Blur to clear
  const titleBlurCSS = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    ["blur(12px)", "blur(0px)"]
  );
  const earthBlurCSS = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    ["blur(12px)", "blur(0px)"]
  );

  // Bottom affordance handoff
  const hintOpacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [1, 1, 0]);
  const hintDisplay = useTransform(scrollYProgress, (v) =>
    v < 0.95 ? "block" : "none"
  );
  const enterOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const enterDisplay = useTransform(scrollYProgress, (v) =>
    v >= 0.95 ? "block" : "none"
  );

  return (
    <div className="relative h-[200vh] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background stars */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="stars"></div>
      </div>

      {/* Fixed, full-viewport stage */}
      <motion.div className="fixed inset-0" style={{ opacity: contentOpacity }}>
        {/* Mobile-first grid: 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-screen min-h-screen place-items-center px-4 md:px-8 gap-8 md:gap-16">
          {/* Left: Title (4 lines) */}
          <motion.div
            className="text-white text-center"
            style={{ y: titleY, filter: titleBlurCSS }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-none">
              2025
            </div>
            <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-none mt-2">
              NASA
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-none mt-2">
              Space Apps
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-none mt-2">
              Seoul
            </div>
          </motion.div>

          {/* Right: Earth */}
          <motion.div
            className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] xl:w-[560px] xl:h-[560px]"
            style={{ y: earthY, filter: earthBlurCSS, willChange: "filter" }}
          >
            <Image
              src="/images/landing/earth.png"
              alt="Earth"
              width={1117}
              height={1136}
              priority
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom "Scroll Down" — centered wrapper, animated child */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 select-none">
        <motion.div
          style={{ opacity: hintOpacity, display: hintDisplay }}
          animate={{ y: [0, -8, 0], opacity: [0.9, 1, 0.9] }} // gentle bounce + subtle pulse
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center text-white/80 space-y-3">
            <span className="text-sm tracking-widest uppercase">
              Scroll Down
            </span>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/80"
            >
              <path
                d="M12 5V19M12 19L18 13M12 19L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom ENTER — centered wrapper, animated child */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.button
          style={{ opacity: enterOpacity, display: enterDisplay }}
          className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-full shadow-lg"
          onClick={() => router.push('/2025/ko/index')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ENTER
        </motion.button>
      </div>

      <style jsx>{`
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(
              2px 2px at 20px 30px,
              #eee,
              transparent
            ),
            radial-gradient(
              2px 2px at 40px 70px,
              rgba(255, 255, 255, 0.8),
              transparent
            ),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(
              1px 1px at 130px 80px,
              rgba(255, 255, 255, 0.6),
              transparent
            ),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: twinkle 4s ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
