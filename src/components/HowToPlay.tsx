import React from 'react';
import { 
  Sparkles, 
  Trophy, 
  Clock, 
  ArrowRight,
  Headphones,
  Zap,
  HelpCircle
} from 'lucide-react';

interface HowToPlayProps {
  onStartSetup: () => void;
  onOpenLeaderboard?: () => void;
  onOpenInstructionsModal: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({
  onStartSetup,
  onOpenLeaderboard,
  onOpenInstructionsModal,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col justify-center my-auto text-[#F7F7F7] select-none animate-fade-in space-y-4 sm:space-y-6">

      {/* 1. Executive Branded Event Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#3E4550] shadow-2xl bg-gradient-to-r from-[#292D3A]/95 via-[#1E222D]/90 to-[#292D3A]/95 p-5 sm:p-7 backdrop-blur-xl group">
        
        {/* Top Challenge Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01A982]/20 border border-[#01A982]/50 text-[#00E0AF] text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00E0AF]" />
            Official 3D Meta Pictionary Challenge
          </div>
          <span className="text-xs text-[#B1B9BE] font-semibold hidden sm:inline">
            HPE Beyond The Goal 2025
          </span>
        </div>

        {/* 2-Column Split: Typography Left + Artwork Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Left: Titles & Mission */}
          <div className="md:col-span-7 space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Score Points For Your Team
            </h1>
            <p className="text-xs sm:text-sm text-[#D4D8DB] font-medium leading-relaxed">
              Together, We Move Forward. Put on the VR headset, sketch the secret prompt in full 3D space within 60 seconds, and lead the live event leaderboard!
            </p>

            {/* Quick Spec Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151821] border border-[#3E4550] text-xs font-semibold text-[#E6E8E9]">
                <Clock className="w-3.5 h-3.5 text-[#00E0AF]" />
                <span>60s Speed Clock</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151821] border border-[#3E4550] text-xs font-semibold text-[#62E5F6]">
                <Headphones className="w-3.5 h-3.5 text-[#62E5F6]" />
                <span>Meta Quest 3D</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151821] border border-[#01A982]/40 text-xs font-semibold text-[#00E0AF]">
                <Zap className="w-3.5 h-3.5 text-[#00E0AF]" />
                <span>Up to 1,000 Pts</span>
              </div>
            </div>
          </div>

          {/* Right: Framed Key Artwork */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#01A982]/40 shadow-xl shadow-[#01A982]/10 bg-[#151821]">
              <img 
                src="/hpe-beyond-the-goal.png" 
                alt="HPE Beyond The Goal - Together, We Move Forward" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

        </div>

      </div>

      {/* 2. Interactive Action Bar: Instructions Popup Button + Next Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#292D3A]/80 border border-[#3E4550] shadow-lg">
        
        {/* Left Side: Instructions Popup Trigger & Leaderboard */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* THE BUTTON TO OPEN INSTRUCTIONS POP-UP */}
          <button
            type="button"
            onClick={onOpenInstructionsModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#151821] hover:bg-[#3E4550] border border-[#01A982]/60 hover:border-[#01A982] text-xs font-bold text-[#00E0AF] hover:text-white transition-all shadow-md cursor-pointer group active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-[#00E0AF] group-hover:scale-110 transition-transform" />
            <span>View Instructions & Rules</span>
          </button>

          {/* Leaderboard Trigger */}
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#151821] hover:bg-[#3E4550] border border-[#3E4550] hover:border-[#01A982]/40 text-xs font-bold text-[#B1B9BE] hover:text-white transition-all shadow-md cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#00E0AF]" />
              <span>Leaderboard</span>
            </button>
          )}
        </div>

        {/* Right Side: Primary NEXT Button */}
        <button
          type="button"
          onClick={onStartSetup}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#01A982] via-[#05CC93] to-[#00E0AF] hover:brightness-110 text-[#151821] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#01A982]/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
        >
          <span>Next: Enter Players & Team</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
