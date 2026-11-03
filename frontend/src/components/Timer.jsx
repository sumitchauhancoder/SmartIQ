import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ duration = 45, onTimeUp, questionKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, questionKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp, questionKey]);

  // Color state based on urgency
  let colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
  let strokeColor = '#34d399';
  let isUrgent = false;

  if (timeLeft <= 10) {
    colorClass = 'text-rose-400 border-rose-500/40 bg-rose-950/50 animate-pulse';
    strokeColor = '#f43f5e';
    isUrgent = true;
  } else if (timeLeft <= 20) {
    colorClass = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    strokeColor = '#fbbf24';
  }

  // Circular progress calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-300 shadow-sm ${colorClass}`}>
      <div className="relative w-7 h-7 flex items-center justify-center">
        <svg className="w-7 h-7 -rotate-90">
          <circle
            cx="14"
            cy="14"
            r={radius}
            stroke="#1e293b"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="14"
            cy="14"
            r={radius}
            stroke={strokeColor}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <Clock className={`w-3.5 h-3.5 absolute ${isUrgent ? 'animate-bounce' : ''}`} />
      </div>
      <div className="font-mono text-sm font-bold tracking-wider">
        {String(timeLeft).padStart(2, '0')}s
      </div>
    </div>
  );
}
