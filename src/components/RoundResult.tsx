import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw, Clock, User, Users } from 'lucide-react';
import type { RoundConfig, TimelineEvent } from '../types/game';

interface RoundResultProps {
  config: RoundConfig;
  elapsedSeconds: number;
  events?: TimelineEvent[];
  onNextRound: () => void;
  onBackToSetup: () => void;
}

export const RoundResult: React.FC<RoundResultProps> = ({
  config,
  elapsedSeconds,
  onNextRound,
  onBackToSetup,
}) => {

  useEffect(() => {
    // Launch celebratory confetti burst using HPE Green, Jade, Mint & White!
    const count = 180;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#01A982', '#05CC93', '#00E0AF', '#62E5F6', '#FFFFFF'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 50,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
  }, []);

  return (
    <div className="w-full h-full max-h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in">

      {/* Container Card */}
      <div className="w-full max-w-2xl bg-[#292D3A]/95 backdrop-blur-2xl border border-[#01A982]/50 rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl shadow-[#01A982]/20 space-y-2.5 sm:space-y-3.5 text-center relative overflow-hidden">

        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#01A982]/25 blur-3xl rounded-full pointer-events-none"></div>

        {/* Victory Icon & Title */}
        <div className="space-y-1 relative z-10">
          <div className="inline-flex p-2 rounded-2xl bg-[#01A982]/20 border border-[#01A982]/40 text-[#00E0AF] shadow-lg mb-0.5 animate-bounce">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            🎉 GOAL ACHIEVED!
          </h2>
          <p className="text-[#00E0AF] font-extrabold text-xs sm:text-sm tracking-wider uppercase">
            Together, We Move Forward • Prompt Solved
          </p>
        </div>

        {/* Big Prominent Solve Time Box */}
        <div className="bg-gradient-to-r from-[#01A982]/20 via-[#151821] to-[#01A982]/20 border-2 border-[#01A982]/60 rounded-2xl p-3 sm:p-5 shadow-xl relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#00E0AF] block mb-1">
            SOLVE TIME RECORDED
          </span>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg leading-none flex items-center justify-center gap-2">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-[#00E0AF]" />
            <span>{elapsedSeconds} <span className="text-2xl sm:text-3xl text-[#00E0AF] font-bold">SEC</span></span>
          </div>
          <span className="text-[11px] sm:text-xs text-[#B1B9BE] font-medium mt-1.5 block">
            Faster solve ranks higher on the live leaderboard!
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 relative z-10">
          {/* Team Name */}
          <div className="bg-[#151821] border border-[#3E4550] p-2.5 sm:p-3 rounded-xl">
            <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Team Name</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#05CC93] truncate block flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#05CC93]" /> {config.teamName}
            </span>
          </div>

          {/* Player Names */}
          <div className="bg-[#151821] border border-[#3E4550] p-2.5 sm:p-3 rounded-xl">
            <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">
              {config.players && config.players.length > 1 ? `Players (${config.players.length})` : 'Player'}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#62E5F6] truncate block flex items-center justify-center gap-1" title={config.playerName}>
              <User className="w-3.5 h-3.5 text-[#62E5F6]" /> {config.playerName}
            </span>
          </div>

          {/* Time Solved */}
          <div className="bg-[#151821] border border-[#3E4550] p-2.5 sm:p-3 rounded-xl">
            <span className="text-[9px] font-bold text-[#7D8A92] uppercase tracking-wider block mb-0.5">Status</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#00E0AF] truncate block flex items-center justify-center gap-1">
              ✓ Solved ({elapsedSeconds}s)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 relative z-10">
          <button
            type="button"
            onClick={onNextRound}
            className="py-2.5 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#01A982] via-[#05CC93] to-[#00E0AF] hover:brightness-110 text-[#151821] font-black text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-[#01A982]/35 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <span>NEXT ROUND</span>
            <ArrowRight className="w-4 h-4 text-[#151821]" />
          </button>

          <button
            type="button"
            onClick={onBackToSetup}
            className="py-2.5 sm:py-3.5 px-4 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#D4D8DB] border border-[#3E4550] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7D8A92]" />
            <span>BACK TO SETUP</span>
          </button>
        </div>

      </div>

    </div>
  );
};
