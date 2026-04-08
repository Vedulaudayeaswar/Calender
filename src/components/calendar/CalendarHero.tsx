import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { MONTH_IMAGES } from "@/lib/calendar-utils";
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
    rotateY: dir > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
    z: -100,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    z: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.95,
    z: -100,
    transition: {
      duration: 0.5,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

const textVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 60 : -60,
    opacity: 0,
    rotateX: dir > 0 ? -15 : 15,
  }),
  center: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      delay: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -40 : 40,
    opacity: 0,
    rotateX: dir > 0 ? 15 : -15,
    transition: { duration: 0.3 },
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
  const imageSrc = MONTH_IMAGES[monthIndex];
  const key = format(currentDate, "yyyy-MM");

  return (
    <div
      className="relative overflow-hidden rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none"
      style={{ perspective: "1200px" }}
    >
      <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[520px]">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={key}
            src={imageSrc}
            alt={format(currentDate, "MMMM yyyy")}
            className="absolute inset-0 h-full w-full object-cover"
            custom={direction}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          />
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/25 to-transparent" />

        {/* Spiral binding holes */}
        <div className="absolute left-0 right-0 top-0 flex justify-center gap-8 py-2 lg:flex-col lg:items-start lg:gap-6 lg:px-2 lg:py-0 lg:top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:w-6 lg:justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-foreground/15 shadow-inner backdrop-blur-sm ring-1 ring-foreground/10"
            />
          ))}
        </div>

        {/* Month & Year text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={key}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.p
                className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground/70"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {format(currentDate, "yyyy")}
              </motion.p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground lg:text-5xl xl:text-6xl">
                {format(currentDate, "MMMM")}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <motion.div
            className="mt-4 flex items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={onPrev}
              whileHover={{ scale: 1.15, rotateZ: -5 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-md transition-colors hover:bg-primary-foreground/30"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={onToday}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-primary-foreground/15 px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-md transition-colors hover:bg-primary-foreground/30"
            >
              Today
            </motion.button>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.15, rotateZ: 5 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-md transition-colors hover:bg-primary-foreground/30"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
