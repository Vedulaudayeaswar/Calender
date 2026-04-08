import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { SEASONAL_MONTH_IMAGES } from "@/lib/calendar-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeroProps {
  currentDate: Date;
  direction: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const flipVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 110 : -110,
    rotateX: dir > 0 ? 15 : -15,
    opacity: 0,
    scale: 0.85,
    z: -200,
  }),
  center: {
    rotateY: 0,
    rotateX: 0,
    opacity: 1,
    scale: 1,
    z: 0,
    transition: {
      duration: 0.9,
      type: "spring",
      stiffness: 80,
      damping: 18,
    },
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -110 : 110,
    rotateX: dir > 0 ? -15 : 15,
    opacity: 0,
    scale: 0.85,
    z: -200,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  }),
};

const textVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 80 : -80,
    x: dir > 0 ? 20 : -20,
    opacity: 0,
    rotateX: dir > 0 ? -30 : 30,
    z: 50,
  }),
  center: {
    y: 0,
    x: 0,
    opacity: 1,
    rotateX: 0,
    z: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -60 : 60,
    opacity: 0,
    rotateX: dir > 0 ? 30 : -30,
    z: -50,
    transition: { duration: 0.4 },
  }),
};

export function CalendarHero({
  currentDate,
  direction,
  onPrev,
  onNext,
  onToday,
}: CalendarHeroProps) {
  const monthIndex = currentDate.getMonth();
  const imageSrc = SEASONAL_MONTH_IMAGES[monthIndex];
  const key = format(currentDate, "yyyy-MM");

  return (
    <div
      className="relative overflow-hidden h-full min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-center text-center p-12"
      style={{ perspective: "1500px" }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={key}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={imageSrc}
            alt={format(currentDate, "MMMM")}
            className="w-full h-full object-cover"
            style={{
              transform: "translateZ(-50px) scale(1.1)",
              opacity: 0.68,
              filter: "blur(1px) brightness(0.85)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/18" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={key}
          custom={direction}
          variants={textVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ transformStyle: "preserve-3d" }}
          className="relative z-20"
        >
          <motion.div
            className="font-body text-lg font-bold uppercase tracking-[0.8em] text-white/55 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ transform: "translateZ(50px)" }}
          >
            {format(currentDate, "yyyy")}
          </motion.div>
          <h1
            className="font-display text-8xl lg:text-[10rem] font-black tracking-tighter text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] leading-none"
            style={{ transform: "translateZ(150px)" }}
          >
            {format(currentDate, "MMMM")}
          </h1>

          {/* Sketchy Pencil Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-14 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Glassy Navigation Controls */}
      <motion.div
        className="mt-20 flex items-center gap-6 relative z-20"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{ transform: "translateZ(100px)" }}
      >
        <motion.button
          onClick={onPrev}
          whileHover={{
            scale: 1.2,
            rotateZ: -10,
            z: 50,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
          whileTap={{ scale: 0.9 }}
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 text-white backdrop-blur-3xl border border-white/10 transition-all shadow-2xl"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-8 w-8" />
        </motion.button>
        <motion.button
          onClick={onToday}
          whileHover={{
            scale: 1.1,
            z: 50,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          className="rounded-3xl bg-white/5 px-12 py-5 font-body text-sm font-black uppercase tracking-[0.4em] text-white backdrop-blur-3xl border border-white/10 transition-all shadow-2xl"
        >
          Today
        </motion.button>
        <motion.button
          onClick={onNext}
          whileHover={{
            scale: 1.2,
            rotateZ: 10,
            z: 50,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
          whileTap={{ scale: 0.9 }}
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 text-white backdrop-blur-3xl border border-white/10 transition-all shadow-2xl"
          aria-label="Next month"
        >
          <ChevronRight className="h-8 w-8" />
        </motion.button>
      </motion.div>
    </div>
  );
}
