import { useEffect, useRef } from "react";

interface SeasonalAudioProps {
  month: number;
}

export function SeasonalAudio({ month }: SeasonalAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const getAudioSrc = (m: number) => {
    // Summer (March–June): 2, 3, 4, 5
    if (m >= 2 && m <= 5) return "/audio/summer-ocean.mp3";
    // Winter (Nov–Feb): 10, 11, 0, 1
    if (m >= 10 || m <= 1) return "/audio/winter-wind.mp3";
    // Rainy/Monsoon (July–Sept): 6, 7, 8
    if (m >= 6 && m <= 8) return "/audio/rain.mp3";
    // Spring (Oct): 9
    return "/audio/spring-birds.mp3";
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = getAudioSrc(month);
      audioRef.current.load();
      // Auto-play might be blocked by browser until user interaction
      audioRef.current.play().catch(() => {
        // This is expected and fine
      });
    }
  }, [month]);

  return (
    <audio ref={audioRef} loop className="hidden" />
  );
}
