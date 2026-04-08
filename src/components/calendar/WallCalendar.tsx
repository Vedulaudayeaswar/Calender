import { useCalendar } from "@/hooks/useCalendar";
import { CalendarHero } from "./CalendarHero";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { TiltCard } from "./TiltCard";
import { YearlyCalendarView } from "./YearlyCalendarView";
import { ThreeBackground } from "./three/ThreeBackground";
import { DartAnimation } from "./DartAnimation";
import { BlackholeAnimation } from "./BlackholeAnimation";
import { SeasonalAudio } from "./SeasonalAudio";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Grid3X3 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export function WallCalendar() {
  const {
    currentDate,
    rangeStart,
    rangeEnd,
    notes,
    direction,
    view,
    setView,
    transitionProgress,
    showYearTransition,
    goNext,
    goPrev,
    goToday,
    selectMonth,
    handleDayClick,
    handleDayHover,
    addNote,
    deleteNote,
    clearRange,
  } = useCalendar();

  const [showDart, setShowDart] = useState(false);
  const [showBlackhole, setShowBlackhole] = useState(false);
  const selectedDayRef = useRef<HTMLButtonElement>(null);

  const isMonthly = view === "month";

  const handleAddNote = (text: string) => {
    addNote(text);
    if (isMonthly && rangeStart) {
      setShowDart(true);
    }
  };

  // Sync year transition from hook to local state
  useEffect(() => {
    setShowBlackhole(showYearTransition);
  }, [showYearTransition]);

  return (
    <div className="relative mx-auto w-full max-w-7xl min-h-screen flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      {/* 3D Background */}
      <ThreeBackground
        month={currentDate.getMonth()}
        transitionProgress={transitionProgress}
      />

      {/* Seasonal Audio */}
      <SeasonalAudio month={currentDate.getMonth()} />

      {/* Dart Animation */}
      <DartAnimation
        show={showDart}
        onComplete={() => setShowDart(false)}
        targetRef={selectedDayRef}
      />

      {/* Blackhole Animation for Year Transitions */}
      <BlackholeAnimation
        show={showBlackhole}
        onComplete={() => setShowBlackhole(false)}
      />

      <div className="relative z-30 w-full max-w-6xl space-y-6">
        <div className="flex justify-end gap-3 px-6">
          <Button
            variant={isMonthly ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
            className="gap-2 shadow-xl backdrop-blur-sm bg-white/28 border-white/30 text-white hover:bg-white/42"
          >
            <CalendarIcon className="h-4 w-4" />
            Monthly View
          </Button>
          <Button
            variant={!isMonthly ? "default" : "outline"}
            size="sm"
            onClick={() => setView("year")}
            className="gap-2 shadow-xl backdrop-blur-sm bg-white/28 border-white/30 text-white hover:bg-white/42"
          >
            <Grid3X3 className="h-4 w-4" />
            Yearly View
          </Button>
        </div>

        <TiltCard
          className="relative overflow-hidden rounded-[2.5rem] bg-white/18 backdrop-blur-sm border border-white/20 shadow-2xl"
          tiltAmount={isMonthly ? 3 : 1}
          glareEnabled={true}
        >
          {/* Transition Overlay */}
          <AnimatePresence>
            {transitionProgress > 0 && (
              <motion.div
                key="transition-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none"
              >
                {/* Paper Tear Animation */}
                <motion.div
                  initial={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                  animate={{
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 100% 0%, 50% 10%, 0% 0%)",
                    opacity: 0,
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white z-[101]"
                />
                <motion.div
                  initial={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                  animate={{
                    clipPath:
                      "polygon(0% 100%, 100% 100%, 100% 100%, 50% 90%, 0% 100%)",
                    opacity: 0,
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white z-[101]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isMonthly ? (
              <motion.div
                key="monthly"
                initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]"
                style={{
                  perspective: "1500px",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Hero image panel */}
                <CalendarHero
                  currentDate={currentDate}
                  direction={direction}
                  onPrev={goPrev}
                  onNext={goNext}
                  onToday={goToday}
                />

                {/* Right panel: grid + notes */}
                <div className="flex flex-col bg-white/8 backdrop-blur-sm">
                  <CalendarGrid
                    currentDate={currentDate}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    direction={direction}
                    onDayClick={handleDayClick}
                    onDayHover={handleDayHover}
                    selectedDayRef={selectedDayRef}
                  />
                  <NotesPanel
                    notes={notes}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    onAdd={handleAddNote}
                    onDelete={deleteNote}
                    onClearRange={clearRange}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="yearly"
                initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 bg-white/8 backdrop-blur-sm"
                style={{
                  perspective: "1500px",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <YearlyCalendarView
                  currentDate={currentDate}
                  direction={direction}
                  onMonthSelect={selectMonth}
                />
                <div className="flex justify-center p-8 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goPrev}
                    className="mx-3 text-white hover:bg-white/20"
                  >
                    Prev Year
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToday}
                    className="mx-3 text-white hover:bg-white/20"
                  >
                    Current Year
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goNext}
                    className="mx-3 text-white hover:bg-white/20"
                  >
                    Next Year
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TiltCard>
      </div>
    </div>
  );
}
