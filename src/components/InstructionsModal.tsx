import React from 'react';
import { 
  X, 
  HelpCircle, 
  Clock, 
  Flame, 
  ShieldAlert, 
  Eye, 
  Headphones, 
  Trophy, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#1A1D27] border border-[#3E4550] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 z-10 text-[#F7F7F7]">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#3E4550] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#01A982]/20 text-[#00E0AF] border border-[#01A982]/40">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  How To Play & Event Guidelines
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#01A982]/20 border border-[#01A982]/40 text-[#00E0AF] text-[10px] font-bold uppercase tracking-wider">
                  HPE Beyond The Goal
                </span>
              </div>
              <p className="text-xs text-[#B1B9BE]">
                Master the 3D VR Meta Pictionary arena in 4 simple steps
              </p>
            </div>
          </div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#292D3A] hover:bg-[#3E4550] text-[#B1B9BE] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#3E4550]"
            title="Close instructions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CHALLENGE WORKFLOW (4 Cards) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#01A982]"></span>
              Challenge Workflow
            </span>
            <span className="text-[11px] text-[#B1B9BE]">4 simple steps from headset to podium</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Step 1 */}
            <div className="bg-[#292D3A] border border-[#3E4550] rounded-2xl p-3 flex flex-col justify-between gap-2 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#01A982]/25 border border-[#01A982]/50 text-[#00E0AF] font-black text-xs flex items-center justify-center">
                    01
                  </span>
                  <Headphones className="w-4 h-4 text-[#62E5F6]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Enter & Gear Up</h3>
                <p className="text-[11px] text-[#B1B9BE] leading-relaxed">
                  Register team & player names. VR drawer wears headset to see secret prompt.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#00E0AF] bg-[#151821] px-2 py-1 rounded-lg border border-[#3E4550] truncate">
                💡 Secret prompt for drawer only
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#292D3A] border border-[#3E4550] rounded-2xl p-3 flex flex-col justify-between gap-2 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#01A982]/25 border border-[#01A982]/50 text-[#00E0AF] font-black text-xs flex items-center justify-center">
                    02
                  </span>
                  <Clock className="w-4 h-4 text-[#00E0AF]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">2-Minute Timer</h3>
                <p className="text-[11px] text-[#B1B9BE] leading-relaxed">
                  3-2-1 countdown begins. You have 2 minutes (120s) to sketch and solve the prompt!
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#00E0AF] bg-[#151821] px-2 py-1 rounded-lg border border-[#3E4550] truncate">
                ⏱️ 2-minute limit — fastest solve ranks #1
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#292D3A] border border-[#3E4550] rounded-2xl p-3 flex flex-col justify-between gap-2 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#01A982]/25 border border-[#01A982]/50 text-[#00E0AF] font-black text-xs flex items-center justify-center">
                    03
                  </span>
                  <Eye className="w-4 h-4 text-[#62E5F6]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Live Guessing</h3>
                <p className="text-[11px] text-[#B1B9BE] leading-relaxed">
                  Teammates watch live screen and shout guesses. Unlimited guesses allowed.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#62E5F6] bg-[#151821] px-2 py-1 rounded-lg border border-[#3E4550] truncate">
                🗣️ Unlimited guesses permitted
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#292D3A] border border-[#3E4550] rounded-2xl p-3 flex flex-col justify-between gap-2 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#01A982]/25 border border-[#01A982]/50 text-[#00E0AF] font-black text-xs flex items-center justify-center">
                    04
                  </span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Correct or Give Up</h3>
                <p className="text-[11px] text-[#B1B9BE] leading-relaxed">
                  Hit CORRECT to lock your solve time, or GAVE UP if you forfeit.
                </p>
              </div>
              <div className="text-[10px] font-bold text-amber-300 bg-[#151821] px-2 py-1 rounded-lg border border-[#3E4550] truncate">
                🏆 Fastest solve times lead the podium
              </div>
            </div>

          </div>
        </div>

        {/* 2. TIMING & RANKING RULES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          
          {/* Timing & Ranking Matrix (7 Cols) */}
          <div className="md:col-span-7 bg-[#292D3A] border border-[#3E4550] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#00E0AF]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Timing & Ranking</h4>
              </div>
              <span className="text-[10px] text-[#B1B9BE]">Ranked by Fastest Solve</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#151821] p-2 rounded-xl border border-[#01A982]/40">
                <span className="text-[10px] text-[#B1B9BE] block font-medium">⚡ Lightning</span>
                <span className="text-sm font-black text-[#00E0AF]">&lt; 30s Solve</span>
              </div>
              <div className="bg-[#151821] p-2 rounded-xl border border-[#3E4550]">
                <span className="text-[10px] text-[#B1B9BE] block font-medium">🎯 Solid</span>
                <span className="text-sm font-black text-[#05CC93]">30–90s Solve</span>
              </div>
              <div className="bg-[#151821] p-2 rounded-xl border border-rose-500/30">
                <span className="text-[10px] text-[#B1B9BE] block font-medium">🏳️ Gave Up</span>
                <span className="text-sm font-black text-rose-400">Forfeited</span>
              </div>
            </div>
          </div>

          {/* Golden Rules (5 Cols) */}
          <div className="md:col-span-5 bg-[#292D3A] border border-[#3E4550] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-white">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Golden Rules</h4>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] bg-[#151821] px-2.5 py-1.5 rounded-lg border border-[#3E4550]">
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-[#D4D8DB] font-medium">No writing letters, digits, or words</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] bg-[#151821] px-2.5 py-1.5 rounded-lg border border-[#3E4550]">
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-[#D4D8DB] font-medium">No verbal hints or mouthing answers</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] bg-[#151821] px-2.5 py-1.5 rounded-lg border border-[#01A982]/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E0AF] flex-shrink-0" />
                <span className="text-[#00E0AF] font-medium">360° spatial drawing & rotation encouraged</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-[#3E4550] flex items-center justify-between">
          <span className="text-xs text-[#B1B9BE]">
            Together, We Move Forward &bull; HPE Live Event Arena
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#01A982] to-[#05CC93] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#01A982]/25 transition-all cursor-pointer"
          >
            Got It, Let's Play!
          </button>
        </div>

      </div>

    </div>
  );
};
