import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getCalendarDays,
  isSameMonth,
  isToday,
  isInRange,
  isRangeStart,
  isRangeEnd,
  getHoliday,
  format,
} from "@/lib/calendar-utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  direction: number;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date) => void;
}

const gridVariants = {
  enter: (dir: number) => ({
    rotateX: dir > 0 ? 15 : -15,
    y: dir > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateX: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.012,
      delayChildren: 0.1,
    },
  },
  exit: (dir: number) => ({
    rotateX: dir > 0 ? -15 : 15,
    y: dir > 0 ? -30 : 30,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  }),
};

const dayVariants = {
  enter: { opacity: 0, scale: 0.6, rotateY: 90, z: -50 },
  center: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.15 } },
};

export function CalendarGrid({
  currentDate,
  rangeStart,
  rangeEnd,
  direction,
  onDayClick,
  onDayHover,
}: CalendarGridProps) {
  const days = getCalendarDays(currentDate);
  const key = format(currentDate, "yyyy-MM");

  return (
    <div className="p-4 lg:p-6" style={{ perspective: "800px" }}>
      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid with 3D entrance */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={key}
          custom={direction}
          variants={gridVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="grid grid-cols-7 gap-1"
          style={{ transformStyle: "preserve-3d" }}
        >
          {days.map((day) => {
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const inRange = isInRange(day, rangeStart, rangeEnd);
            const isStart = isRangeStart(day, rangeStart, rangeEnd);
            const isEnd = isRangeEnd(day, rangeStart, rangeEnd);
            const holiday = getHoliday(day);

            return (
              <motion.button
                key={day.toISOString()}
                variants={dayVariants}
                onClick={() => onDayClick(day)}
                onMouseEnter={() => onDayHover(day)}
                whileHover={{
                  scale: 1.2,
                  z: 30,
                  rotateX: -5,
                  boxShadow: "0 8px 25px -5px rgba(0,0,0,0.15)",
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "group relative flex h-10 w-full items-center justify-center rounded-lg font-body text-sm transition-colors duration-150 lg:h-12",
                  !inMonth && "text-calendar-outside",
                  inMonth && "text-foreground",
                  today &&
                    !isStart &&
                    !isEnd &&
                    "font-bold text-calendar-today ring-2 ring-calendar-today/30",
                  inRange &&
                    !isStart &&
                    !isEnd &&
                    "rounded-none bg-calendar-range-bg",
                  isStart &&
                    "rounded-l-lg rounded-r-none bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                  isEnd &&
                    "rounded-l-none rounded-r-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                  isStart && isEnd && "rounded-lg",
                  holiday && inMonth && "font-medium"
                )}
                style={{ transformStyle: "preserve-3d" }}
                title={holiday || format(day, "EEEE, MMMM d, yyyy")}
              >
                <span style={{ transform: "translateZ(2px)" }}>
                  {format(day, "d")}
                </span>
                {holiday && inMonth && (
                  <motion.span
                    className="absolute -top-0.5 right-0.5 h-2 w-2 rounded-full bg-calendar-holiday"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  />
                )}
                {today && !isStart && !isEnd && (
                  <motion.span
                    className="absolute inset-0 rounded-lg ring-2 ring-calendar-today/20"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
