import { useState, useCallback, useEffect } from "react";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  addDays,
  format,
  setMonth,
} from "date-fns";

export type CalendarView = "month" | "year";

export interface Note {
  id: string;
  text: string;
  rangeLabel: string;
  dateKeys?: string[];
  createdAt: string;
}

const NOTES_KEY = "calendar-notes";

function loadNotes(): Record<string, Note[]> {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, Note[]>) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [allNotes, setAllNotes] = useState<Record<string, Note[]>>(loadNotes);
  const [direction, setDirection] = useState(0);
  const [view, setView] = useState<CalendarView>("month");
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [showYearTransition, setShowYearTransition] = useState(false);

  const monthKey = format(currentDate, "yyyy-MM");

  const notes = allNotes[monthKey] || [];

  useEffect(() => {
    saveNotes(allNotes);
  }, [allNotes]);

  const goNext = useCallback(() => {
    setDirection(1);
    if (view === "month") {
      setTransitionProgress(1);
      setTimeout(() => {
        setCurrentDate((d) => addMonths(d, 1));
        setTransitionProgress(0);
      }, 500);
    } else {
      setShowYearTransition(true);
      setTimeout(() => {
        setCurrentDate((d) => addYears(d, 1));
        setShowYearTransition(false);
      }, 8000);
    }
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
  }, [view]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    if (view === "month") {
      setTransitionProgress(1);
      setTimeout(() => {
        setCurrentDate((d) => subMonths(d, 1));
        setTransitionProgress(0);
      }, 500);
    } else {
      setShowYearTransition(true);
      setTimeout(() => {
        setCurrentDate((d) => subYears(d, 1));
        setShowYearTransition(false);
      }, 8000);
    }
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
  }, [view]);

  const goToday = useCallback(() => {
    setDirection(0);
    setCurrentDate(new Date());
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
  }, []);

  const selectMonth = useCallback((monthIndex: number) => {
    setDirection(0);
    setCurrentDate((d) => setMonth(d, monthIndex));
    setView("month");
  }, []);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (!isSelecting) {
        setRangeStart(day);
        setRangeEnd(null);
        setIsSelecting(true);
      } else {
        setRangeEnd(day);
        setIsSelecting(false);
      }
    },
    [isSelecting],
  );

  const handleDayHover = useCallback(
    (day: Date) => {
      if (isSelecting && rangeStart) {
        // Only update if the day has actually changed to prevent excessive re-renders
        if (!rangeEnd || day.getTime() !== rangeEnd.getTime()) {
          setRangeEnd(day);
        }
      }
    },
    [isSelecting, rangeStart, rangeEnd],
  );

  const addNote = useCallback(
    (text: string) => {
      const rangeLabel =
        rangeStart && rangeEnd
          ? `${format(
              rangeStart < rangeEnd ? rangeStart : rangeEnd,
              "MMM d",
            )} – ${format(
              rangeStart < rangeEnd ? rangeEnd : rangeStart,
              "MMM d",
            )}`
          : rangeStart
            ? format(rangeStart, "MMM d")
            : "General";

      const dateKeys: string[] = [];
      if (rangeStart && rangeEnd) {
        const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
        const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
        const days = Math.min(
          366,
          Math.floor((end.getTime() - start.getTime()) / 86400000) + 1,
        );

        for (let i = 0; i < days; i++) {
          dateKeys.push(format(addDays(start, i), "yyyy-MM-dd"));
        }
      } else if (rangeStart) {
        dateKeys.push(format(rangeStart, "yyyy-MM-dd"));
      }

      const note: Note = {
        id: crypto.randomUUID(),
        text,
        rangeLabel,
        dateKeys,
        createdAt: new Date().toISOString(),
      };

      setAllNotes((prev) => ({
        ...prev,
        [monthKey]: [...(prev[monthKey] || []), note],
      }));
    },
    [monthKey, rangeStart, rangeEnd],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setAllNotes((prev) => ({
        ...prev,
        [monthKey]: (prev[monthKey] || []).filter((n) => n.id !== id),
      }));
    },
    [monthKey],
  );

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
  }, []);

  return {
    currentDate,
    rangeStart,
    rangeEnd,
    isSelecting,
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
  };
}
