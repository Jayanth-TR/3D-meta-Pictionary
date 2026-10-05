import React from 'react';

interface TimerProps {
  remainingSeconds: number;
  totalSeconds?: number;
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds = 60,
}) => {
  // Ensure value stays between 0 and totalSeconds
  const clampedSeconds = Math.max(0, Math.min(totalSeconds, remainingSeconds));
  const progressRatio = clampedSeconds / totalSeconds;
  
  // SVG Ring Math with 300x300 viewBox
  const radius = 125;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Dynamic Theme state based on timer range:
  let stateTheme = {
    ringColor: 'stroke-[#01A982]',
    textColor: 'text-[#00E0AF]',
    glowColor: 'shadow-[#01A982]/30',
    bgGradient: 'from-[#292D3A] via-[#151821] to-[#292D3A]',
    badgeText: '60s ROUND TIMER',
    badgeBg: 'bg-[#01A982]/20 text-[#00E0AF] border-[#01A982]/40',
    isUrgent: false,
  };

  if (clampedSeconds <= 10) {
    stateTheme = {
      ringColor: 'stroke-red-500',
      textColor: 'text-red-400',
      glowColor: 'shadow-red-500/60',
      bgGradient: 'from-red-950/60 via-[#151821] to-red-950/40',
      badgeText: 'URGENT - TIME RUNNING OUT!',
      badgeBg: 'bg-red-500/30 text-red-200 border-red-500/50 animate-pulse',
      isUrgent: true,
    };
  } else if (clampedSeconds <= 20) {
    stateTheme = {
      ringColor: 'stroke-amber-400',
      textColor: 'text-amber-300',
      glowColor: 'shadow-amber-500/40',
      bgGradient: 'from-amber-950/40 via-[#151821] to-[#292D3A]',
      badgeText: 'FINAL 20 SECONDS',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      isUrgent: false,
    };
  }

  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center my-0.5 sm:my-1 select-none">
      
      {/* State Badge */}
      <div className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border mb-1 transition-all ${stateTheme.badgeBg}`}>
        {stateTheme.badgeText}
      </div>

      {/* SVG Ring & Countdown Container - scaled proportionally for 100vh fit */}
      <div className={`relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full bg-gradient-to-b ${stateTheme.bgGradient} border border-[#3E4550] shadow-xl ${stateTheme.glowColor} ${stateTheme.isUrgent ? 'animate-pulse-glow' : ''}`}>
        
        {/* SVG Circular Ring with viewBox */}
        <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90 p-1.5 sm:p-2.5">
          {/* Background Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-[#3E4550] fill-none"
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
            className={`fill-none transition-all duration-1000 ease-linear ${stateTheme.ringColor}`}
          />
        </svg>

        {/* Inner Text Block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-black tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl transition-all leading-none ${stateTheme.textColor} ${stateTheme.isUrgent ? 'animate-timer-pulse' : ''}`}>
            {clampedSeconds}
          </span>
          <span className="text-[8px] sm:text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-[#B1B9BE] mt-0.5">
            SECONDS
          </span>
        </div>

      </div>

    </div>
  );
};
