import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  elapsedSeconds: number;
}

export const Timer: React.FC<TimerProps> = ({ elapsedSeconds }) => {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // SVG Ring Math with 300x300 viewBox
  const radius = 125;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Progress animates smoothly every minute cycle (0-60s)
  const minuteProgress = (seconds / 60);
  const strokeDashoffset = circumference * (1 - (minuteProgress === 0 && elapsedSeconds > 0 ? 1 : minuteProgress));

  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center my-0.5 sm:my-1 select-none">
      
      {/* State Badge */}
      <div className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border mb-1.5 transition-all bg-[#01A982]/20 text-[#00E0AF] border-[#01A982]/40 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E0AF] animate-ping" />
        <Clock className="w-3 h-3 text-[#00E0AF]" />
        <span>LIVE STOPWATCH • UNLIMITED TIME</span>
      </div>

      {/* SVG Ring & Stopwatch Container */}
      <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-gradient-to-b from-[#292D3A] via-[#151821] to-[#292D3A] border-2 border-[#3E4550] shadow-2xl shadow-[#01A982]/25">
        
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
            className="fill-none stroke-[#01A982] transition-all duration-1000 ease-linear shadow-[0_0_12px_#01A982]"
          />
        </svg>

        {/* Inner Text Block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono font-black tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl transition-all leading-none text-white drop-shadow-md">
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
