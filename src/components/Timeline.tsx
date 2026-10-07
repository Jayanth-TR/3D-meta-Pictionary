import React, { useState } from 'react';
import type { TimelineEvent } from '../types/game';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  currentElapsedSeconds: number;
  totalSeconds?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  currentElapsedSeconds,
  totalSeconds = 120,
}) => {
  const [activeHoverEvent, setActiveHoverEvent] = useState<TimelineEvent | null>(null);

  // Calculate current playhead percentage
  const currentProgressPercent = Math.min(100, Math.max(0, (currentElapsedSeconds / totalSeconds) * 100));

  return (
    <div className="w-full bg-[#292D3A]/90 backdrop-blur-xl border border-[#3E4550] rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-1 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#01A982]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            2m Timeline
          </h3>
        </div>

        <div className="flex items-center gap-2.5 text-[10px] font-semibold text-[#B1B9BE]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            <span>WRONG</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#01A982] inline-block"></span>
            <span>CORRECT</span>
          </div>
        </div>
      </div>

      {/* Main Track Container */}
      <div className="relative pt-3 pb-3 px-2 sm:px-3">
        
        {/* Top Seconds Indicators */}
        <div className="flex justify-between text-[9px] font-extrabold text-[#7D8A92] uppercase tracking-wider mb-1">
          <span>START (120s)</span>
          <span>60s</span>
          <span>END (0s)</span>
        </div>

        {/* The Base Rail */}
        <div className="relative w-full h-2.5 sm:h-3 bg-[#151821] rounded-full border border-[#3E4550] overflow-hidden shadow-inner">
          {/* Animated Elapsed Progress Bar */}
          <div
            className="h-full bg-gradient-to-r from-[#01A982] via-[#05CC93] to-[#00E0AF] transition-all duration-300 ease-linear rounded-full opacity-90"
            style={{ width: `${currentProgressPercent}%` }}
          />
        </div>

        {/* Current Time Playhead Pin */}
        <div
          className="absolute top-4.5 sm:top-5 transform -translate-x-1/2 transition-all duration-300 ease-linear flex flex-col items-center pointer-events-none z-10"
          style={{ left: `calc(${currentProgressPercent}% + 8px - ${(currentProgressPercent / 100) * 16}px)` }}
        >
          <div className="w-2 h-2 bg-white rounded-full shadow-md ring-2 ring-[#01A982]/60"></div>
          <span className="text-[8px] font-black text-[#00E0AF] bg-[#151821] px-1 py-0.2 rounded border border-[#01A982]/40 mt-0.5">
            {currentElapsedSeconds}s
          </span>
        </div>

        {/* Event Markers Overlay */}
        {events.map((evt, idx) => {
          const markerPercent = Math.min(100, Math.max(0, (evt.elapsedSeconds / totalSeconds) * 100));
          const isCorrect = evt.type === 'CORRECT';
          const isHovered = activeHoverEvent?.id === evt.id;

          return (
            <div
              key={evt.id}
              className="absolute top-3.5 sm:top-4 transform -translate-x-1/2 cursor-pointer group z-20"
              style={{ left: `calc(${markerPercent}% + 8px - ${(markerPercent / 100) * 16}px)` }}
              onMouseEnter={() => setActiveHoverEvent(evt)}
              onMouseLeave={() => setActiveHoverEvent(null)}
              onClick={() => setActiveHoverEvent(evt)}
            >
              {/* Marker Pin */}
              <div
                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-md transition-transform group-hover:scale-125 ${
                  isCorrect
                    ? 'bg-gradient-to-tr from-[#01A982] to-[#05CC93] shadow-[#01A982]/60 ring-2 ring-[#00E0AF]'
                    : 'bg-gradient-to-tr from-rose-600 to-red-400 shadow-red-500/50 ring-2 ring-red-400'
                }`}
              >
                {isCorrect ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
              </div>

              {/* Marker Label under pin */}
              <span
                className={`block text-[8px] font-bold text-center mt-0.5 px-0.5 rounded ${
                  isCorrect ? 'text-[#00E0AF] bg-[#01A982]/20' : 'text-red-300 bg-red-950/80'
                }`}
              >
                {evt.elapsedSeconds}s
              </span>

              {/* Tooltip Box */}
              {(isHovered || isCorrect) && (
                <div className="absolute bottom-full mb-1.5 left-1/2 transform -translate-x-1/2 w-40 bg-[#151821] border border-[#3E4550] p-2 rounded-xl shadow-2xl z-30 pointer-events-none animate-fade-in text-left">
                  <div className="flex items-center gap-1 mb-0.5">
                    {isCorrect ? (
                      <CheckCircle className="w-3 h-3 text-[#00E0AF]" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-[10px] font-extrabold uppercase ${isCorrect ? 'text-[#00E0AF]' : 'text-red-400'}`}>
                      {isCorrect ? 'Correct Answer' : 'Wrong Answer'}
                    </span>
                  </div>
                  <div className="text-[9px] text-[#D4D8DB] space-y-0.5 border-t border-[#3E4550] pt-0.5">
                    <div><span className="text-[#7D8A92]">Elapsed:</span> <strong className="text-white">{evt.elapsedSeconds}s</strong></div>
                    <div><span className="text-[#7D8A92]">Attempt:</span> <strong className="text-white">#{idx + 1}</strong></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>

    </div>
  );
};
