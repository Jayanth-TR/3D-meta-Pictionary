import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Trophy, HelpCircle } from 'lucide-react';
import type { GameState } from '../types/game';

interface HeaderProps {
  gameState: GameState;
  teamName?: string;
  playerName?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetToSetup: () => void;
  onOpenHowToPlay?: () => void;
  isHowToPlayActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  teamName,
  playerName,
  isMuted,
  onToggleMute,
  onResetToSetup,
  onOpenHowToPlay,
  isHowToPlayActive,
}) => {
  return (
    <header className="w-full bg-[#292D3A]/95 backdrop-blur-md border-b border-[#3E4550] px-3 sm:px-6 py-2.5 sticky top-0 z-40 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Logo: HPE + Beyond The Goal */}
        <div 
          onClick={onResetToSetup}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* HPE Brand Icon */}
          <div className="flex items-center gap-2">
            <div className="h-8 px-2.5 rounded-lg bg-[#151821] border border-[#01A982]/60 flex items-center justify-center shadow-md group-hover:border-[#01A982] transition-colors">
              <span className="font-black text-lg tracking-wider text-white flex items-center">
                HP
                <span className="relative text-[#01A982] font-black">
                  E
                  <span className="absolute -bottom-0.5 left-0 right-0 h-1 bg-[#01A982] rounded-xs shadow-[0_0_8px_#01A982]"></span>
                </span>
              </span>
            </div>
            
            <div className="h-6 w-px bg-[#3E4550] hidden xs:block"></div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm tracking-wide text-white uppercase group-hover:text-[#00E0AF] transition-colors">
                  BEYOND <span className="text-[#01A982]">THE GOAL</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#01A982]/20 text-[#00E0AF] border border-[#01A982]/40">
                  3D Pictionary
                </span>
              </div>
              <span className="text-[10px] text-[#B1B9BE] font-medium hidden xs:block">Together, We Move Forward</span>
            </div>
          </div>
        </div>

        {/* Live Active Context (When Playing/Ready/Results) */}
        {gameState !== 'SETUP' && (teamName || playerName) && (
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-[#151821]/80 border border-[#3E4550]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#B1B9BE] uppercase tracking-wider">Team:</span>
              <span className="text-sm font-bold text-[#05CC93]">{teamName || 'N/A'}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#535C66]"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#B1B9BE] uppercase tracking-wider">
                {playerName?.includes(',') ? 'Players:' : 'Player:'}
              </span>
              <span className="text-sm font-bold text-[#62E5F6] max-w-[240px] truncate" title={playerName}>
                {playerName || 'N/A'}
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* How to Play / Instructions Button */}
          {onOpenHowToPlay && (
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isHowToPlayActive
                  ? 'bg-[#01A982]/25 text-[#00E0AF] border-[#01A982]'
                  : 'bg-[#151821] text-[#E6E8E9] border-[#3E4550] hover:bg-[#3E4550]/50 hover:text-white'
              }`}
              title="How to Play & Rules"
            >
              <HelpCircle className="w-4 h-4 text-[#00E0AF]" />
              <span className="hidden sm:inline">How To Play</span>
            </button>
          )}

          {/* Sound Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isMuted
                ? 'bg-[#151821] text-[#7D8A92] border-[#3E4550] hover:bg-[#3E4550]/40'
                : 'bg-[#01A982]/15 text-[#05CC93] border-[#01A982]/40 hover:bg-[#01A982]/25'
            }`}
            title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#7D8A92]" /> : <Volume2 className="w-4 h-4 text-[#05CC93]" />}
            <span className="hidden md:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* Leaderboard Page Link */}
          <Link
            to="/leaderboard"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#01A982] to-[#05CC93] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#01A982]/25 transition-all active:scale-95"
          >
            <Trophy className="w-4 h-4 text-[#151821] fill-[#151821]" />
            <span>Leaderboard</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
