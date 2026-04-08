import { useCalendar } from "@/hooks/useCalendar";
import { CalendarHero } from "./CalendarHero";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { TiltCard } from "./TiltCard";

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
      <TiltCard
        className="relative overflow-hidden rounded-xl bg-card shadow-calendar"
        tiltAmount={4}
        glareEnabled={true}
      >
        {/* Subtle paper texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Desktop: side-by-side. Mobile: stacked */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
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
      </TiltCard>
    </div>
  );
}
