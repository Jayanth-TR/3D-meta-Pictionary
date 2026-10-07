import React from 'react';
import type { RoundConfig } from '../types/game';
import { Timer } from './Timer';
import { AnswerButtons } from './AnswerButtons';
import { Users, User, Clock, Sparkles } from 'lucide-react';

interface GameRoundProps {
  config: RoundConfig;
  remainingSeconds: number;
  elapsedSeconds: number;
  onCorrect: () => void;
  onGaveUp: () => void;
}

export const GameRound: React.FC<GameRoundProps> = ({
  config,
  remainingSeconds,
  elapsedSeconds,
  onCorrect,
  onGaveUp,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-4 h-full max-h-full flex flex-col justify-between overflow-hidden gap-3 sm:gap-5 animate-fade-in my-auto">
      
      {/* Top Header Card — Participant Banner & Live Session Status */}
      <div className="bg-[#292D3A]/90 backdrop-blur-xl border border-[#3E4550] rounded-2xl p-2.5 sm:p-4 shadow-xl flex items-center justify-between gap-3 flex-shrink-0">
        
        {/* Left: Team & Player Info */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#01A982]/15 text-[#01A982] border border-[#01A982]/30">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#01A982]" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#B1B9BE] block">
                Team
              </span>
              <span className="text-sm sm:text-base font-black text-white truncate max-w-[120px] sm:max-w-none block">
                {config.teamName}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#3E4550]"></div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#05CC93]/15 text-[#05CC93] border border-[#05CC93]/30">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#05CC93]" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#B1B9BE] block">
                {config.players && config.players.length > 1 ? `Players (${config.players.length})` : 'Player'}
              </span>
              <span className="text-sm sm:text-base font-black text-[#62E5F6] truncate max-w-[150px] sm:max-w-xs block" title={config.playerName}>
                {config.playerName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Round Status Badge */}
        <div className="bg-gradient-to-r from-[#01A982]/20 via-[#151821] to-[#01A982]/20 border border-[#01A982]/40 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 shadow-lg">
          <Clock className="w-4 h-4 text-[#00E0AF] animate-pulse flex-shrink-0" />
          <div className="text-right">
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#00E0AF] block">
              STATUS
            </span>
            <span className="text-xs sm:text-sm font-black text-white tracking-wider block">
              ROUND ACTIVE
            </span>
          </div>
        </div>

      </div>

      {/* Main Live 2-Minute Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <Timer remainingSeconds={remainingSeconds} elapsedSeconds={elapsedSeconds} totalSeconds={120} />
        
        {/* Live Tips Banner */}
        <div className="mt-3 sm:mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151821]/80 border border-[#3E4550] text-[#B1B9BE] text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#00E0AF]" />
            <span>Faster solves earn a top rank on the leaderboard • 2 minutes to solve!</span>
          </div>
        </div>
      </div>

      {/* Answer Controls: GIANT CORRECT & GAVE UP Buttons */}
      <div className="pb-1 sm:pb-2">
        <AnswerButtons onCorrect={onCorrect} onGaveUp={onGaveUp} />
      </div>

    </div>
  );
};
