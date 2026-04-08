import React, { memo } from "react";
import { motion } from "framer-motion";
import { format, setMonth, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { SEASONAL_MONTH_IMAGES, getCalendarDays } from "@/lib/calendar-utils";

interface YearlyCalendarViewProps {
  currentDate: Date;
  direction: number;
  onMonthSelect: (monthIndex: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    rotateX: -10, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    }
  },
  hover: {
    scale: 1.05,
    rotateY: 8,
    rotateX: -4,
    z: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: { scale: 0.98 },
};

interface YearlyMonthCardProps {
  monthIndex: number;
  currentYear: number;
  onSelect: (index: number) => void;
}

const YearlyMonthCard = memo(({ 
  monthIndex, 
  currentYear, 
  onSelect 
}: YearlyMonthCardProps) => {
  const monthDate = setMonth(startOfMonth(new Date(currentYear, 0, 1)), monthIndex);
  const monthName = format(monthDate, "MMMM");
  const days = getCalendarDays(monthDate).slice(0, 42);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => onSelect(monthIndex)}
      className="group cursor-pointer relative aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/30"
      style={{ 
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden"
      }}
    >
      <div className="p-6 flex flex-col h-full relative z-10">
        <h3 className="text-white font-black text-2xl mb-4 tracking-tighter group-hover:scale-110 transition-transform origin-left drop-shadow-lg">
          {monthName}
        </h3>

        {/* Mini Calendar Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1 text-[8px] font-black text-white/40 mb-2 uppercase tracking-widest">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === monthIndex;
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition-all duration-300",
                    !isCurrentMonth && "opacity-0",
                    isToday && "bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-110",
                    isCurrentMonth && !isToday && "text-white/70 group-hover:text-white"
                  )}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sketchy Texture Overlay for Yearly Cards */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* 3D Reflection & Glare Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
});

YearlyMonthCard.displayName = "YearlyMonthCard";

export function YearlyCalendarView({
  currentDate,
  onMonthSelect,
}: YearlyCalendarViewProps) {
  const currentYear = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="p-8 lg:p-12 overflow-hidden" style={{ perspective: "1500px" }}>
      <div className="mb-12 px-4">
        <motion.h2 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-6xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl"
        >
          {currentYear}
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
        style={{ transformStyle: "preserve-3d" }}
      >
        {months.map((monthIndex) => (
          <YearlyMonthCard
            key={monthIndex}
            monthIndex={monthIndex}
            currentYear={currentYear}
            onSelect={onMonthSelect}
          />
        ))}
      </motion.div>
    </div>
  );
}
