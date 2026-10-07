import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  remainingSeconds: number;
  elapsedSeconds: number;
  totalSeconds?: number;
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  elapsedSeconds,
  totalSeconds = 120,
}) => {
  const clampedRemaining = Math.max(0, Math.min(totalSeconds, remainingSeconds));
  const minutes = Math.floor(clampedRemaining / 60);
  const seconds = clampedRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // SVG Ring Math with 300x300 viewBox
  const radius = 125;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Progress ratio smoothly decreases from 1 (at 120s) down to 0 (at 0s)
  const progressRatio = clampedRemaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Dynamic Theme state based on timer range:
  let stateTheme = {
    ringColor: 'stroke-[#01A982]',
    textColor: 'text-white',
    badgeText: '2:00 ROUND TIMER',
    badgeBg: 'bg-[#01A982]/20 text-[#00E0AF] border-[#01A982]/40',
    glowColor: 'shadow-[#01A982]/25',
    isUrgent: false,
  };

  if (clampedRemaining <= 10) {
    stateTheme = {
      ringColor: 'stroke-red-500',
      textColor: 'text-red-400',
      badgeText: 'URGENT • TIME RUNNING OUT!',
      badgeBg: 'bg-red-500/25 text-red-300 border-red-500/50 animate-pulse',
      glowColor: 'shadow-red-500/40',
      isUrgent: true,
    };
  } else if (clampedRemaining <= 30) {
    stateTheme = {
      ringColor: 'stroke-amber-400',
      textColor: 'text-amber-300',
      badgeText: 'FINAL 30 SECONDS',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glowColor: 'shadow-amber-500/30',
      isUrgent: false,
    };
  }

  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center my-0.5 sm:my-1 select-none">
      
      {/* State Badge */}
      <div className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border mb-1.5 transition-all flex items-center gap-1.5 ${stateTheme.badgeBg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${stateTheme.isUrgent ? 'bg-red-400 animate-ping' : 'bg-[#00E0AF] animate-ping'}`} />
        <Clock className="w-3 h-3" />
        <span>{stateTheme.badgeText}</span>
      </div>

      {/* SVG Ring & Countdown Container */}
      <div className={`relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-gradient-to-b from-[#292D3A] via-[#151821] to-[#292D3A] border-2 border-[#3E4550] shadow-2xl ${stateTheme.glowColor}`}>
        
        {/* SVG Circular Ring */}
        <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90 p-2 sm:p-3">
          {/* Background Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-[#3E4550]/60 fill-none"
          />
          {/* Animated Progress Indicator */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`fill-none ${stateTheme.ringColor} transition-all duration-1000 ease-linear shadow-[0_0_12px_#01A982]`}
          />
        </svg>

        {/* Inner Text Block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-black tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl transition-all leading-none drop-shadow-md ${stateTheme.textColor}`}>
            {formattedTime}
          </span>
          <span className="text-[9px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest text-[#00E0AF] mt-1">
            {elapsedSeconds}s ELAPSED
          </span>
        </div>

      </div>

    </div>
  );
};

