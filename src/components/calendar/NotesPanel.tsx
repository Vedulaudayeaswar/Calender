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
          "MMM d",
        )} – ${format(rangeStart < rangeEnd ? rangeEnd : rangeStart, "MMM d")}`
      : rangeStart
        ? format(rangeStart, "MMM d")
        : null;

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm p-8 h-full flex flex-col border-t border-white/15"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      style={{ perspective: "1000px" }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <motion.div
          animate={{
            rotateY: [0, 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <StickyNote className="h-6 w-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </motion.div>
        <h2 className="font-display text-2xl font-black tracking-tight text-white">
          Notes
        </h2>
        <motion.span
          key={notes.length}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-auto rounded-xl bg-white/20 px-4 py-1.5 font-body text-xs font-black text-white border border-white/30"
        >
          {notes.length}
        </motion.span>
      </div>

      {/* Selected range indicator */}
      <AnimatePresence>
        {rangeLabel && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="flex items-center gap-4 rounded-2xl bg-white/15 border border-white/20 px-5 py-4 shadow-2xl backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-xl">
                <CalendarDays className="h-5 w-5" />
              </div>
              <span className="font-body text-sm font-black text-white">
                {rangeLabel}
              </span>
              <motion.button
                onClick={onClearRange}
                whileHover={{
                  scale: 1.2,
                  rotate: 180,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl text-white/60 transition-all hover:text-white"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              rangeLabel ? `Note for ${rangeLabel}...` : "Add a note..."
            }
            className="w-full rounded-2xl border border-white/12 bg-white/10 px-5 py-4 font-body text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all group-hover:border-white/20"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!input.trim()}
          whileHover={{ scale: 1.1, rotateZ: 90 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-2xl transition-all",
            !input.trim() && "opacity-20 grayscale pointer-events-none",
          )}
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </form>

      {/* Notes list */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center opacity-40"
            >
              <StickyNote className="h-12 w-12 text-white mb-4" />
              <p className="font-body text-sm font-bold text-white tracking-widest uppercase">
                Empty Space
              </p>
            </motion.div>
          )}
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              className="group flex items-start gap-5 rounded-2xl border border-white/8 bg-white/8 p-5 transition-all hover:border-white/20"
            >
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm font-medium leading-relaxed text-white">
                  {note.text}
                </p>
                <div className="mt-3 flex items-center gap-2 text-white/40">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <p className="font-body text-[10px] font-black uppercase tracking-[0.2em]">
                    {note.rangeLabel}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => onDelete(note.id)}
                whileHover={{ scale: 1.3, color: "#ff4444" }}
                className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl text-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
