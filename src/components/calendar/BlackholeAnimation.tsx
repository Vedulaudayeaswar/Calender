import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface BlackholeAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function BlackholeAnimation({
  show,
  onComplete,
}: BlackholeAnimationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="blackhole"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          {/* Outer spinning ring */}
          <motion.div
            className="absolute w-96 h-96 border-4 border-transparent border-t-cyan-400 border-r-cyan-300 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Middle spinning ring */}
          <motion.div
            className="absolute w-72 h-72 border-4 border-transparent border-b-purple-500 border-l-purple-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner spinning ring */}
          <motion.div
            className="absolute w-48 h-48 border-4 border-transparent border-t-blue-400 border-r-blue-300 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Center glow */}
          <motion.div
            className="absolute w-12 h-12 bg-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 20px rgba(34, 211, 238, 0.8)",
                "0 0 60px rgba(34, 211, 238, 1)",
                "0 0 20px rgba(34, 211, 238, 0.8)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Radial gradient overlay pulling inward */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.95) 100%)",
            }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
