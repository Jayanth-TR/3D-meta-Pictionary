import React, { useState } from 'react';
import { CheckCircle2, Flag } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AnswerButtonsProps {
  onCorrect: () => void;
  onGaveUp: () => void;
  disabled?: boolean;
}

export const AnswerButtons: React.FC<AnswerButtonsProps> = ({
  onCorrect,
  onGaveUp,
  disabled = false,
}) => {
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const handleCorrectClick = () => {
    if (disabled) return;
    soundFx.playCorrect();
    setLastFeedback('🎉 SOLVED! PROMPT CORRECT!');
    onCorrect();
  };

  const handleGaveUpClick = () => {
    if (disabled) return;
    soundFx.playTimeout();
    setLastFeedback('🏳️ GAVE UP RECORDED');
    onGaveUp();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-1.5 flex-shrink-0">
      
      {/* Dynamic Toast Feedback Banner */}
      {lastFeedback && (
        <div className="text-center animate-fade-in -mt-1">
          <span className={`inline-block px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md ${
            lastFeedback.includes('SOLVED') 
              ? 'bg-[#01A982]/25 text-[#00E0AF] border border-[#01A982]/50 shadow-[#01A982]/20'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}>
            {lastFeedback}
          </span>
        </div>
      )}

      {/* Side-by-Side Controls: CORRECT vs GAVE UP */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        
        {/* CORRECT BUTTON (HPE Green / Jade) */}
        <button
          type="button"
          onClick={handleCorrectClick}
          disabled={disabled}
          className="group relative overflow-hidden py-3 sm:py-4 md:py-5 px-3 sm:px-6 rounded-2xl bg-gradient-to-br from-[#01A982] via-[#05CC93] to-[#01A982] hover:from-[#05CC93] hover:to-[#00E0AF] active:scale-[0.98] text-[#151821] font-black text-base sm:text-2xl md:text-3xl uppercase tracking-wider shadow-xl shadow-[#01A982]/35 hover:shadow-[#01A982]/50 border border-[#00E0AF]/50 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer select-none"
        >
          <div className="p-1 sm:p-1.5 rounded-xl bg-white/20 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-[#151821] drop-shadow" />
          </div>
          <span className="drop-shadow-sm">CORRECT</span>
        </button>

        {/* GAVE UP BUTTON (Rose/Red) */}
        <button
          type="button"
          onClick={handleGaveUpClick}
          disabled={disabled}
          className="group relative overflow-hidden py-3 sm:py-4 md:py-5 px-3 sm:px-6 rounded-2xl bg-gradient-to-br from-rose-700 via-red-600 to-rose-800 hover:from-rose-600 hover:via-red-500 hover:to-rose-700 active:scale-[0.98] text-white font-black text-base sm:text-2xl md:text-3xl uppercase tracking-wider shadow-xl shadow-red-600/35 hover:shadow-red-600/50 border border-rose-400/40 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer select-none"
        >
          <div className="p-1 sm:p-1.5 rounded-xl bg-white/15 group-hover:scale-110 transition-transform">
            <Flag className="w-5 h-5 sm:w-7 sm:h-7 text-rose-100" />
          </div>
          <span className="drop-shadow-md">GAVE UP</span>
        </button>

      </div>
    </div>
  );
};
