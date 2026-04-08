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
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  }),
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
    <div className="p-4 lg:p-6">
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

      {/* Day grid */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={key}
          custom={direction}
          variants={gridVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="grid grid-cols-7 gap-1"
        >
          {days.map((day, i) => {
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const inRange = isInRange(day, rangeStart, rangeEnd);
            const isStart = isRangeStart(day, rangeStart, rangeEnd);
            const isEnd = isRangeEnd(day, rangeStart, rangeEnd);
            const holiday = getHoliday(day);

            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.008, duration: 0.2 }}
                onClick={() => onDayClick(day)}
                onMouseEnter={() => onDayHover(day)}
                className={cn(
                  "group relative flex h-10 w-full items-center justify-center rounded-lg font-body text-sm transition-all duration-150 lg:h-12",
                  !inMonth && "text-calendar-outside",
                  inMonth && "text-foreground hover:bg-secondary",
                  today &&
                    !isStart &&
                    !isEnd &&
                    "font-bold text-calendar-today ring-1 ring-calendar-today/30",
                  inRange &&
                    !isStart &&
                    !isEnd &&
                    "rounded-none bg-calendar-range-bg",
                  isStart && "rounded-l-lg rounded-r-none bg-primary text-primary-foreground",
                  isEnd && "rounded-l-none rounded-r-lg bg-primary text-primary-foreground",
                  isStart && isEnd && "rounded-lg",
                  holiday && inMonth && "font-medium"
                )}
                title={holiday || format(day, "EEEE, MMMM d, yyyy")}
              >
                {format(day, "d")}
                {holiday && inMonth && (
                  <span className="absolute -top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-calendar-holiday" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
