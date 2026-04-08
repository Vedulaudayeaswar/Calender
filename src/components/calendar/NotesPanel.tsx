import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, CalendarDays, StickyNote } from "lucide-react";
import type { Note } from "@/hooks/useCalendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  notes: Note[];
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onClearRange: () => void;
}

export function NotesPanel({
  notes,
  rangeStart,
  rangeEnd,
  onAdd,
  onDelete,
  onClearRange,
}: NotesPanelProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

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
      : null;

  return (
    <div className="border-t border-border bg-calendar-paper p-4 lg:border-l lg:border-t-0 lg:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"
        >
          <StickyNote className="h-4 w-4 text-primary" />
          Notes
          <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 font-body text-xs text-muted-foreground">
            {notes.length}
          </span>
        </button>
      </div>

      {/* Selected range indicator */}
      <AnimatePresence>
        {rangeLabel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-lg bg-calendar-range-bg px-3 py-2">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span className="font-body text-sm font-medium text-foreground">
                {rangeLabel}
              </span>
              <button
                onClick={onClearRange}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={rangeLabel ? `Note for ${rangeLabel}...` : "Add a note..."}
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity",
            !input.trim() && "opacity-40"
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {/* Notes list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {notes.length === 0 && (
              <p className="py-6 text-center font-body text-sm text-muted-foreground">
                No notes yet. Select a date range and add one!
              </p>
            )}
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 transition-colors hover:border-border"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-foreground">{note.text}</p>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    {note.rangeLabel}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(note.id)}
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
