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
    <motion.div
      className="border-t border-border bg-calendar-paper p-4 lg:border-l lg:border-t-0 lg:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StickyNote className="h-4 w-4 text-primary" />
        </motion.div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Notes
        </h2>
        <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 font-body text-xs text-muted-foreground">
          {notes.length}
        </span>
      </div>

      {/* Selected range indicator */}
      <AnimatePresence>
        {rangeLabel && (
          <motion.div
            initial={{ height: 0, opacity: 0, rotateX: -30 }}
            animate={{ height: "auto", opacity: 1, rotateX: 0 }}
            exit={{ height: 0, opacity: 0, rotateX: 30 }}
            transition={{ duration: 0.3 }}
            className="mb-3 overflow-hidden"
            style={{ perspective: "600px" }}
          >
            <div className="flex items-center gap-2 rounded-lg bg-calendar-range-bg px-3 py-2">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span className="font-body text-sm font-medium text-foreground">
                {rangeLabel}
              </span>
              <motion.button
                onClick={onClearRange}
                whileHover={{ scale: 1.2, rotate: 90 }}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
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
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
        />
        <motion.button
          type="submit"
          disabled={!input.trim()}
          whileHover={{ scale: 1.1, rotateZ: 90 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity",
            !input.trim() && "opacity-40"
          )}
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </form>

      {/* Notes list */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-6 text-center font-body text-sm text-muted-foreground"
            >
              No notes yet. Select a date range and add one!
            </motion.p>
          )}
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, x: -30, rotateY: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, rotateY: 20, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{
                scale: 1.02,
                x: 4,
                boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
              }}
              className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 transition-colors hover:border-border cursor-default"
              style={{ perspective: "600px", transformStyle: "preserve-3d" }}
            >
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-foreground">{note.text}</p>
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {note.rangeLabel}
                </p>
              </div>
              <motion.button
                onClick={() => onDelete(note.id)}
                whileHover={{ scale: 1.3, rotate: -10 }}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
