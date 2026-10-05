import React from 'react';
import { TimerOff, RotateCcw, ArrowRight, RefreshCw, XCircle, Users, User } from 'lucide-react';
import type { RoundConfig, TimelineEvent } from '../types/game';

interface TimeoutResultProps {
  config: RoundConfig;
  events: TimelineEvent[];
  onTryAgain: () => void;
  onNextRound: () => void;
  onBackToSetup: () => void;
}

export const TimeoutResult: React.FC<TimeoutResultProps> = ({
  config,
  events,
  onTryAgain,
  onNextRound,
  onBackToSetup,
}) => {
  return (
    <div className="w-full h-full max-h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in">
      
      {/* Container Card */}
      <div className="w-full max-w-2xl bg-[#292D3A]/95 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl shadow-red-950/50 space-y-2.5 sm:space-y-3.5 text-center relative overflow-hidden">
        
        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-red-500/20 blur-3xl rounded-full pointer-events-none"></div>

        {/* Time's Up Icon & Header */}
        <div className="space-y-1 relative z-10">
          <div className="inline-flex p-2 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 shadow-lg mb-0.5 animate-pulse">
            <TimerOff className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            ⏰ TIME'S UP!
          </h2>
          <p className="text-red-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
            60 Seconds Expired • Keep Moving Forward!
          </p>
        </div>

        {/* Score & Participant Card */}
        <div className="bg-[#151821] border border-[#3E4550] rounded-2xl p-2.5 sm:p-3.5 shadow-xl relative z-10 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#3E4550]">
            <div className="bg-[#292D3A] p-2 sm:p-2.5 rounded-xl border border-[#3E4550]">
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Team Name</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#05CC93] flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-[#05CC93]" /> {config.teamName}
              </span>
            </div>
            <div className="bg-[#292D3A] p-2 sm:p-2.5 rounded-xl border border-[#3E4550]">
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">
                {config.players && config.players.length > 1 ? `Players (${config.players.length})` : 'Player Name'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#62E5F6] flex items-center justify-center gap-1" title={config.playerName}>
                <User className="w-3 h-3 text-[#62E5F6]" /> {config.playerName}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around pt-0.5">
            <div>
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Result</span>
              <span className="text-xs sm:text-sm font-extrabold text-red-400 flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Timeout
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Attempts</span>
              <span className="text-xs sm:text-sm font-extrabold text-white">{events.length}</span>
            </div>

            <div>
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Points</span>
              <span className="text-base sm:text-xl font-black text-[#7D8A92]">0 PTS</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: TRY AGAIN, NEXT ROUND, BACK TO SETUP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 relative z-10">
          
          {/* TRY AGAIN */}
          <button
            type="button"
            onClick={onTryAgain}
            className="py-2.5 sm:py-3 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>TRY AGAIN</span>
          </button>

          {/* NEXT ROUND */}
          <button
            type="button"
            onClick={onNextRound}
            className="py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-[#01A982] to-[#05CC93] hover:brightness-110 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <span>NEXT ROUND</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* BACK TO SETUP */}
          <button
            type="button"
            onClick={onBackToSetup}
            className="py-2.5 sm:py-3 px-3 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#D4D8DB] border border-[#3E4550] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#7D8A92]" />
            <span>SETUP</span>
          </button>

        </div>

      </div>

    </div>
  );
};
