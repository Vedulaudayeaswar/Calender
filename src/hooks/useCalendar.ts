import { useState, useCallback, useEffect } from "react";
import { addMonths, subMonths, format } from "date-fns";

export interface Note {
  id: string;
  text: string;
  rangeLabel: string;
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

  const monthKey = format(currentDate, "yyyy-MM");

  const notes = allNotes[monthKey] || [];

  useEffect(() => {
    saveNotes(allNotes);
  }, [allNotes]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentDate((d) => addMonths(d, 1));
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentDate((d) => subMonths(d, 1));
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
  }, []);

  const goToday = useCallback(() => {
    setDirection(0);
    setCurrentDate(new Date());
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelecting(false);
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
    [isSelecting]
  );

  const handleDayHover = useCallback(
    (day: Date) => {
      if (isSelecting && rangeStart) {
        setRangeEnd(day);
      }
    },
    [isSelecting, rangeStart]
  );

  const addNote = useCallback(
    (text: string) => {
      const rangeLabel =
        rangeStart && rangeEnd
          ? `${format(
              rangeStart < rangeEnd ? rangeStart : rangeEnd,
              "MMM d"
            )} – ${format(
              rangeStart < rangeEnd ? rangeEnd : rangeStart,
              "MMM d"
            )}`
          : rangeStart
          ? format(rangeStart, "MMM d")
          : "General";

      const note: Note = {
        id: crypto.randomUUID(),
        text,
        rangeLabel,
        createdAt: new Date().toISOString(),
      };

      setAllNotes((prev) => ({
        ...prev,
        [monthKey]: [...(prev[monthKey] || []), note],
      }));
    },
    [monthKey, rangeStart, rangeEnd]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setAllNotes((prev) => ({
        ...prev,
        [monthKey]: (prev[monthKey] || []).filter((n) => n.id !== id),
      }));
    },
    [monthKey]
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
    goNext,
    goPrev,
    goToday,
    handleDayClick,
    handleDayHover,
    addNote,
    deleteNote,
    clearRange,
  };
}
