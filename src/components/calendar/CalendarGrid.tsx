import React, { memo } from "react";
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
  isSameDay,
} from "@/lib/calendar-utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  notedDateKeys: Set<string>;
  direction: number;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date) => void;
  selectedDayRef: React.RefObject<HTMLButtonElement>;
}

const gridVariants = {
  enter: (dir: number) => ({
    rotateX: dir > 0 ? 30 : -30,
    rotateY: dir > 0 ? 10 : -10,
    y: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    rotateX: 0,
    rotateY: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.015,
      delayChildren: 0.1,
    },
  },
  exit: (dir: number) => ({
    rotateX: dir > 0 ? -30 : 30,
    rotateY: dir > 0 ? -10 : 10,
    y: dir > 0 ? -50 : 50,
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.4 },
  }),
};

const dayVariants = {
  enter: { opacity: 0, scale: 0.5, rotateY: 120, z: -100 },
  center: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotateY: -120,
    transition: { duration: 0.2 },
  },
};

interface CalendarDayProps {
  day: Date;
  inMonth: boolean;
  today: boolean;
  inRange: boolean;
  isStart: boolean;
  isEnd: boolean;
  hasNote: boolean;
  holiday: string | undefined;
  onClick: (day: Date) => void;
  onHover: (day: Date) => void;
  isTarget: boolean;
  targetRef: React.RefObject<HTMLButtonElement>;
}

const CalendarDay = memo(
  ({
    day,
    inMonth,
    today,
    inRange,
    isStart,
    isEnd,
    hasNote,
    holiday,
    onClick,
    onHover,
    isTarget,
    targetRef,
  }: CalendarDayProps) => {
    return (
      <motion.button
        ref={isTarget ? targetRef : null}
        variants={dayVariants}
        onClick={() => onClick(day)}
        onMouseEnter={() => onHover(day)}
        whileHover={{
          scale: 1.1,
          z: 40,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.95, z: 10 }}
        className={cn(
          "group relative flex aspect-square w-full items-center justify-center rounded-2xl font-body text-sm transition-all duration-300",
          !inMonth && "text-white/22",
          inMonth && "text-white/90",
          today &&
            !isStart &&
            !isEnd &&
            "font-black text-white bg-white/35 shadow-[0_0_20px_rgba(255,255,255,0.35)]",
          inRange &&
            !isStart &&
            !isEnd &&
            "rounded-none bg-white/12 backdrop-blur-sm",
          isStart &&
            "rounded-l-2xl rounded-r-none bg-white text-primary shadow-2xl z-10",
          isEnd &&
            "rounded-l-none rounded-r-2xl bg-white text-primary shadow-2xl z-10",
          isStart && isEnd && "rounded-2xl",
          holiday &&
            inMonth &&
            "font-bold text-white underline decoration-white/40 underline-offset-4",
        )}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
        title={holiday || format(day, "EEEE, MMMM d, yyyy")}
      >
        <span
          style={{ transform: "translateZ(20px)" }}
          className="relative z-20 pointer-events-none"
        >
          {format(day, "d")}
        </span>

        {/* Glass Background */}
        <div className="absolute inset-0 rounded-2xl bg-white/8 border border-white/12 group-hover:border-white/30 transition-all duration-300 shadow-inner" />

        {holiday && inMonth && (
          <motion.span
            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transform: "translateZ(25px)" }}
          />
        )}

        {hasNote && inMonth && (
          <motion.span
            className="absolute bottom-2 right-2 text-[14px] leading-none text-red-300 drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]"
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ transform: "translateZ(24px)" }}
            title="Note attached"
          >
            🎯
          </motion.span>
        )}
      </motion.button>
    );
  },
  (prev, next) => {
    return (
      prev.day.getTime() === next.day.getTime() &&
      prev.inMonth === next.inMonth &&
      prev.today === next.today &&
      prev.inRange === next.inRange &&
      prev.isStart === next.isStart &&
      prev.isEnd === next.isEnd &&
      prev.hasNote === next.hasNote &&
      prev.holiday === next.holiday
    );
  },
);

CalendarDay.displayName = "CalendarDay";

export function CalendarGrid({
  currentDate,
  rangeStart,
  rangeEnd,
  notedDateKeys,
  direction,
  onDayClick,
  onDayHover,
  selectedDayRef,
}: CalendarGridProps) {
  const days = getCalendarDays(currentDate);
  const key = format(currentDate, "yyyy-MM");

  return (
    <div className="p-4 lg:p-6" style={{ perspective: "1000px" }}>
      {/* Weekday headers */}
      <div className="mb-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, idx) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="py-2 text-center font-body text-[10px] font-bold uppercase tracking-widest text-white/55"
          >
            {day}
          </motion.div>
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
          className="grid grid-cols-7 gap-1.5"
          style={{ transformStyle: "preserve-3d" }}
        >
          {days.map((day) => {
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const inRange = isInRange(day, rangeStart, rangeEnd);
            const isStart = isRangeStart(day, rangeStart, rangeEnd);
            const isEnd = isRangeEnd(day, rangeStart, rangeEnd);
            const hasNote = notedDateKeys.has(format(day, "yyyy-MM-dd"));
            const holiday = getHoliday(day);
            const isTarget =
              isStart || (rangeStart && isSameDay(day, rangeStart));

            return (
              <CalendarDay
                key={day.toISOString()}
                day={day}
                inMonth={inMonth}
                today={today}
                inRange={inRange}
                isStart={isStart}
                isEnd={isEnd}
                hasNote={hasNote}
                holiday={holiday}
                onClick={onDayClick}
                onHover={onDayHover}
                isTarget={!!isTarget}
                targetRef={selectedDayRef}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
