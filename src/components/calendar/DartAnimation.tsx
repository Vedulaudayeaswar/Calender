import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface DartAnimationProps {
  show: boolean;
  onComplete: () => void;
  targetRef: React.RefObject<HTMLElement>;
}

export function DartAnimation({ show, onComplete, targetRef }: DartAnimationProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (show && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, targetRef, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ 
            position: 'fixed',
            top: -100,
            left: '50%',
            x: '-50%',
            rotate: 45,
            scale: 2,
            opacity: 0,
            z: 1000
          }}
          animate={{ 
            top: coords.y,
            left: coords.x,
            x: '-50%',
            y: '-50%',
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15,
            duration: 0.5 
          }}
          className="pointer-events-none z-[9999]"
        >
          {/* Dart SVG */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3L14.5 9.5M21 3L17.5 4M21 3L20 6.5M14.5 9.5L10 14L3 21L10 14L14.5 9.5ZM14.5 9.5L13 11M10 14L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 11L11 13" stroke="red" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="14.5" cy="9.5" r="1" fill="white"/>
          </svg>
          
          {/* Impact Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute inset-0 bg-white rounded-full blur-xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
