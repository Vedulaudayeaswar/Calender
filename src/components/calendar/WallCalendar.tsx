import { useCalendar } from "@/hooks/useCalendar";
import { CalendarHero } from "./CalendarHero";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";

export function WallCalendar() {
  const {
    currentDate,
    rangeStart,
    rangeEnd,
    notes,
    direction,
    goNext,
    goPrev,
    goToday,
    handleDayClick,
    handleDayHover,
    addNote,
    deleteNote,
    clearRange,
  } = useCalendar();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-xl bg-card shadow-calendar">
        {/* Desktop: side-by-side. Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
          {/* Hero image panel */}
          <CalendarHero
            currentDate={currentDate}
            direction={direction}
            onPrev={goPrev}
            onNext={goNext}
            onToday={goToday}
          />

          {/* Right panel: grid + notes */}
          <div className="flex flex-col">
            <CalendarGrid
              currentDate={currentDate}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              direction={direction}
              onDayClick={handleDayClick}
              onDayHover={handleDayHover}
            />
            <NotesPanel
              notes={notes}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onAdd={addNote}
              onDelete={deleteNote}
              onClearRange={clearRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
