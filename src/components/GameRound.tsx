import React from 'react';
import type { RoundConfig, TimelineEvent } from '../types/game';
import { Timer } from './Timer';
import { AnswerButtons } from './AnswerButtons';
import { Timeline } from './Timeline';
import { AnswerHistory } from './AnswerHistory';
import { Users, User, Zap } from 'lucide-react';

interface GameRoundProps {
  config: RoundConfig;
  remainingSeconds: number;
  elapsedSeconds: number;
  events: TimelineEvent[];
  onCorrect: () => void;
  onWrong: () => void;
}

export const GameRound: React.FC<GameRoundProps> = ({
  config,
  remainingSeconds,
  elapsedSeconds,
  events,
  onCorrect,
  onWrong,
}) => {
  // Current live potential score if solved right now
  const potentialPoints = Math.max(100, 1000 - elapsedSeconds * 10);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2.5 h-full max-h-full flex flex-col justify-between overflow-hidden gap-1.5 sm:gap-2 animate-fade-in">
      
      {/* Top Header Card — Participant & Live Score Control Banner */}
      <div className="bg-[#292D3A]/90 backdrop-blur-xl border border-[#3E4550] rounded-2xl p-2 sm:p-3 shadow-xl flex items-center justify-between gap-2 flex-shrink-0">
        
        {/* Left: Team & Player Info */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#01A982]/15 text-[#01A982] border border-[#01A982]/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#B1B9BE] block">
                Team
              </span>
              <span className="text-xs sm:text-sm font-black text-white truncate max-w-[90px] sm:max-w-none block">
                {config.teamName}
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-[#3E4550]"></div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#05CC93]/15 text-[#05CC93] border border-[#05CC93]/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#B1B9BE] block">
                {config.players && config.players.length > 1 ? `Players (${config.players.length})` : 'Player'}
              </span>
              <span className="text-xs sm:text-sm font-black text-[#62E5F6] truncate max-w-[140px] sm:max-w-xs block" title={config.playerName}>
                {config.playerName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Potential Points Box */}
        <div className="bg-gradient-to-r from-[#01A982]/25 via-[#151821] to-[#01A982]/25 border border-[#01A982]/40 rounded-xl px-2.5 sm:px-4 py-1 sm:py-1.5 flex items-center gap-2 shadow-lg">
          <Zap className="w-4 h-4 text-[#00E0AF] animate-pulse flex-shrink-0" />
          <div>
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#00E0AF] block">
              POTENTIAL POINTS
            </span>
            <span className="text-xs sm:text-base font-black text-white tracking-wider block">
              {potentialPoints} <span className="text-[9px] font-bold text-[#00E0AF]">PTS</span>
            </span>
          </div>
        </div>

      </div>

      {/* Main Timer Display */}
      <Timer remainingSeconds={remainingSeconds} totalSeconds={config.durationSeconds} />

      {/* Answer Controls: GIANT CORRECT & WRONG Buttons */}
      <AnswerButtons onCorrect={onCorrect} onWrong={onWrong} />

      {/* Bottom Grid: Timeline and Answer History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5 sm:gap-3 flex-shrink-0 min-h-0">
        <div className="lg:col-span-2">
          <Timeline events={events} currentElapsedSeconds={elapsedSeconds} totalSeconds={config.durationSeconds} />
        </div>
        <div className="lg:col-span-1 hidden lg:block">
          <AnswerHistory events={events} />
        </div>
      </div>

    </div>
  );
};
