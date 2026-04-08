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

const imageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
    <div className="relative overflow-hidden rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none">
      <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[500px]">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={key}
            src={imageSrc}
            alt={format(currentDate, "MMMM yyyy")}
            className="absolute inset-0 h-full w-full object-cover"
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

        {/* Month & Year */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground/70">
                {format(currentDate, "yyyy")}
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground lg:text-5xl">
                {format(currentDate, "MMMM")}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/30"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onToday}
              className="rounded-full bg-primary-foreground/15 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-wider text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/30"
            >
              Today
            </button>
            <button
              onClick={onNext}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/30"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
