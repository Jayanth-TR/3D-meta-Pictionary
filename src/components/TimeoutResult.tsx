import React from 'react';
import { Flag, RotateCcw, ArrowRight, RefreshCw, Users, User, Clock } from 'lucide-react';
import type { RoundConfig, TimelineEvent } from '../types/game';

interface TimeoutResultProps {
  config: RoundConfig;
  events?: TimelineEvent[];
  elapsedSeconds?: number;
  onTryAgain: () => void;
  onNextRound: () => void;
  onBackToSetup: () => void;
}

export const TimeoutResult: React.FC<TimeoutResultProps> = ({
  config,
  elapsedSeconds = 0,
  onTryAgain,
  onNextRound,
  onBackToSetup,
}) => {
  return (
    <div className="w-full h-full max-h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in">
      
      {/* Container Card */}
      <div className="w-full max-w-2xl bg-[#292D3A]/95 backdrop-blur-2xl border border-rose-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-rose-950/50 space-y-3 sm:space-y-4 text-center relative overflow-hidden">
        
        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-rose-500/20 blur-3xl rounded-full pointer-events-none"></div>

        {/* Gave Up / Time's Up Icon & Header */}
        <div className="space-y-1 relative z-10">
          <div className="inline-flex p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-lg mb-0.5">
            {elapsedSeconds >= 120 ? <Clock className="w-6 h-6 sm:w-8 sm:h-8" /> : <Flag className="w-6 h-6 sm:w-8 sm:h-8" />}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            {elapsedSeconds >= 120 ? "⏰ TIME'S UP!" : '🏳️ GAVE UP'}
          </h2>
          <p className="text-rose-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
            {elapsedSeconds >= 120 ? '2 Minutes Expired • Ready for the Next Challenge!' : 'Round Forfeited • Ready for the Next Challenge!'}
          </p>
        </div>

        {/* Participant & Time Card */}
        <div className="bg-[#151821] border border-[#3E4550] rounded-2xl p-3 sm:p-4 shadow-xl relative z-10 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-[#3E4550]">
            <div className="bg-[#292D3A] p-2 sm:p-2.5 rounded-xl border border-[#3E4550]">
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Team Name</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#05CC93] flex items-center justify-center gap-1 truncate">
                <Users className="w-3.5 h-3.5 text-[#05CC93]" /> {config.teamName}
              </span>
            </div>
            <div className="bg-[#292D3A] p-2 sm:p-2.5 rounded-xl border border-[#3E4550]">
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">
                {config.players && config.players.length > 1 ? `Players (${config.players.length})` : 'Player Name'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#62E5F6] flex items-center justify-center gap-1 truncate" title={config.playerName}>
                <User className="w-3.5 h-3.5 text-[#62E5F6]" /> {config.playerName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-0.5 text-center">
            <div className="bg-[#292D3A]/60 p-2 rounded-xl border border-[#3E4550]/60">
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Time Elapsed</span>
              <span className="text-xs sm:text-sm font-black text-white flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" /> {elapsedSeconds}s
              </span>
            </div>

            <div className="bg-[#292D3A]/60 p-2 rounded-xl border border-[#3E4550]/60">
              <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Result</span>
              <span className="text-xs sm:text-sm font-black text-rose-400">
                {elapsedSeconds >= 120 ? 'Timed Out (2:00)' : 'Gave Up'}
              </span>
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
            className="py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-[#01A982] to-[#05CC93] hover:brightness-110 text-[#151821] font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
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
