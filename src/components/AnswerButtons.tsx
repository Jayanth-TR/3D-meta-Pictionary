import React, { useState, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AnswerButtonsProps {
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
}

export const AnswerButtons: React.FC<AnswerButtonsProps> = ({
  onCorrect,
  onWrong,
  disabled = false,
}) => {
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const handleCorrectClick = () => {
    if (disabled) return;
    soundFx.playCorrect();
    setLastFeedback('🎉 GOAL! CORRECT ANSWER!');
    onCorrect();
  };

  const handleWrongClick = () => {
    if (disabled) return;
    
    // Prevent double tap within 250ms
    if (debounceTimerRef.current) return;
    
    soundFx.playWrong();
    setLastFeedback('✕ WRONG GUESS RECORDED');
    onWrong();

    debounceTimerRef.current = window.setTimeout(() => {
      debounceTimerRef.current = null;
    }, 250);

    // Fade out mini feedback toast
    setTimeout(() => {
      setLastFeedback(null);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-1 flex-shrink-0">
      
      {/* Dynamic Toast Feedback Banner */}
      {lastFeedback && (
        <div className="text-center animate-fade-in -mt-1">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md ${
            lastFeedback.includes('CORRECT') 
              ? 'bg-[#01A982]/25 text-[#00E0AF] border border-[#01A982]/50 shadow-[#01A982]/20'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}>
            {lastFeedback}
          </span>
        </div>
      )}

      {/* Side-by-Side Controls for all screen sizes */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-5">
        
        {/* CORRECT BUTTON (HPE Green / Jade) */}
        <button
          type="button"
          onClick={handleCorrectClick}
          disabled={disabled}
          className="group relative overflow-hidden py-2.5 sm:py-3.5 md:py-4 px-3 sm:px-6 rounded-2xl bg-gradient-to-br from-[#01A982] via-[#05CC93] to-[#01A982] hover:from-[#05CC93] hover:to-[#00E0AF] active:scale-[0.98] text-white font-black text-sm sm:text-xl md:text-2xl uppercase tracking-wider shadow-lg shadow-[#01A982]/35 hover:shadow-[#01A982]/50 border border-[#00E0AF]/40 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer select-none"
        >
          <div className="p-1 sm:p-1.5 rounded-lg bg-white/15 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow" />
          </div>
          <span className="drop-shadow-md">CORRECT</span>
        </button>

        {/* WRONG BUTTON (Red) */}
        <button
          type="button"
          onClick={handleWrongClick}
          disabled={disabled}
          className="group relative overflow-hidden py-2.5 sm:py-3.5 md:py-4 px-3 sm:px-6 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:via-red-500 hover:to-rose-600 active:scale-[0.98] text-white font-black text-sm sm:text-xl md:text-2xl uppercase tracking-wider shadow-lg shadow-red-600/35 hover:shadow-red-600/50 border border-rose-400/40 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer select-none"
        >
          <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
            <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-rose-100" />
          </div>
          <span className="drop-shadow-md">WRONG</span>
        </button>

      </div>
    </div>
  );
};
