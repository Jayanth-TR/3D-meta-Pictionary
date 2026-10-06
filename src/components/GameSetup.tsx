import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, User, Play, Zap, Trophy, Plus, X, UserPlus, ArrowLeft } from 'lucide-react';
import type { SessionRecord } from '../types/game';

interface GameSetupProps {
  onStartRound: (teamName: string, playerName: string, players?: string[]) => void;
  onOpenLeaderboard?: () => void;
  onOpenInstructions?: () => void;
  sessionHistory?: SessionRecord[];
  onClearHistory?: () => void;
  initialTeamName?: string;
  initialPlayerName?: string;
  initialPlayers?: string[];
}

export const GameSetup: React.FC<GameSetupProps> = ({
  onStartRound,
  onOpenLeaderboard,
  onOpenInstructions,
  initialTeamName = '',
  initialPlayerName = '',
  initialPlayers,
}) => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState(initialTeamName || '');
  
  // Multiple player names list - defaults to empty
  const [players, setPlayers] = useState<string[]>(() => {
    if (initialPlayers && initialPlayers.length > 0) return initialPlayers;
    if (initialPlayerName) {
      return initialPlayerName.split(',').map((p) => p.trim()).filter(Boolean);
    }
    return [];
  });

  // Sync state when props change
  React.useEffect(() => {
    setTeamName(initialTeamName || '');
    setPlayers(initialPlayers && initialPlayers.length > 0 ? initialPlayers : []);
  }, [initialTeamName, initialPlayers]);

  const [playerInput, setPlayerInput] = useState('');
  const [validationError, setValidationError] = useState('');

  // Add one or multiple players (handles comma-separated input as well)
  const handleAddPlayer = (rawName?: string) => {
    const text = (rawName ?? playerInput).trim();
    if (!text) return;

    // Support comma or newline separated names
    const newNames = text
      .split(/[,;\n]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (newNames.length === 0) return;

    setPlayers((prev) => {
      const merged = [...prev];
      for (const name of newNames) {
        if (!merged.includes(name)) {
          merged.push(name);
        }
      }
      return merged;
    });

    setPlayerInput('');
    setValidationError('');
  };

  // Remove player by index
  const handleRemovePlayer = (indexToRemove: number) => {
    setPlayers((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle keyboard submission on player input (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTeam = teamName.trim();

    // If user has text in input field that hasn't been added yet, include it
    let currentPlayers = [...players];
    if (playerInput.trim()) {
      const extraNames = playerInput
        .split(/[,;\n]+/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      
      for (const name of extraNames) {
        if (!currentPlayers.includes(name)) {
          currentPlayers.push(name);
        }
      }
    }

    if (!finalTeam) {
      setValidationError('Please enter a Team Name.');
      return;
    }

    if (currentPlayers.length === 0) {
      setValidationError('Please add at least one Player Name.');
      return;
    }

    setValidationError('');
    const formattedPlayerNames = currentPlayers.join(', ');
    onStartRound(finalTeam, formattedPlayerNames, currentPlayers);
  };

  const handleLeaderboardClick = () => {
    if (onOpenLeaderboard) {
      onOpenLeaderboard();
    }
    navigate('/leaderboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex flex-col justify-center my-auto text-[#F7F7F7] select-none animate-fade-in space-y-3 sm:space-y-4">

      {/* Top Welcome Header with Back to Instructions button */}
      <div className="flex items-center justify-between gap-3 bg-[#292D3A]/90 border border-[#3E4550] rounded-xl px-4 sm:px-5 py-2.5 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#01A982]/30 to-[#05CC93]/20 border border-[#01A982]/50 text-[#00E0AF] flex items-center justify-center font-black shadow-sm">
            <Sparkles className="w-4 h-4 text-[#00E0AF]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight">
              HPE Beyond The Goal — Round Setup
            </h2>
            <p className="text-[11px] text-[#B1B9BE] leading-tight">Configure team & player names to begin the 3D VR challenge</p>
          </div>
        </div>

        {onOpenInstructions && (
          <button
            type="button"
            onClick={onOpenInstructions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151821] hover:bg-[#3E4550] border border-[#3E4550] hover:border-[#01A982]/60 text-xs font-bold text-[#00E0AF] transition-all cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>How to Play</span>
          </button>
        )}
      </div>

      {/* Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

        {/* Main Card: Team & Multi-Player Details - Balanced size & padding */}
        <div className="bg-[#292D3A]/95 backdrop-blur-xl border border-[#3E4550] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-[#3E4550] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#01A982]/15 text-[#01A982] border border-[#01A982]/30">
                <Users className="w-5 h-5 text-[#01A982]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Participant & Team Setup</h3>
                <p className="text-xs text-[#B1B9BE]">Specify your Team Name and add participating players</p>
              </div>
            </div>

            {players.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#01A982]/20 border border-[#01A982]/40 text-[#00E0AF] text-xs font-bold shadow-sm">
                <User className="w-3.5 h-3.5 text-[#00E0AF]" />
                {players.length} {players.length === 1 ? 'Player' : 'Players'} Ready
              </span>
            )}
          </div>

          {/* Form Content: 2-column Grid with medium inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">

            {/* Step 1: Team Name Field */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#E6E8E9] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#05CC93]" />
                1. Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name (e.g. Green Strikers)"
                className="w-full px-4 py-3 rounded-xl bg-[#151821] border border-[#3E4550] text-white placeholder-[#7D8A92] focus:outline-none focus:ring-2 focus:ring-[#01A982] focus:border-[#01A982] text-sm sm:text-base font-semibold transition-all shadow-inner"
              />

              {/* Scoring Info Note */}
              <div className="bg-[#151821]/90 border border-[#01A982]/30 rounded-xl p-3 flex items-center gap-3 shadow-xs">
                <div className="p-1.5 rounded-lg bg-[#01A982]/20 text-[#00E0AF] flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs leading-snug">
                  <span className="font-bold text-white block">Together, We Move Forward</span>
                  <span className="text-[#B1B9BE]">Faster solve earns up to 1,000 pts per round</span>
                </div>
              </div>
            </div>

            {/* Step 2: Multiple Player Names Field */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#E6E8E9] uppercase tracking-wider">
                  <UserPlus className="w-3.5 h-3.5 text-[#00E0AF]" />
                  2. Player Names
                </label>
                <span className="text-xs text-[#B1B9BE] font-medium">
                  {players.length} {players.length === 1 ? 'player' : 'players'} added
                </span>
              </div>

              {/* Player Input + Add Button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter player name (press Enter or comma)"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#151821] border border-[#3E4550] text-white placeholder-[#7D8A92] focus:outline-none focus:ring-2 focus:ring-[#01A982] focus:border-[#01A982] text-sm sm:text-base font-semibold transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => handleAddPlayer()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#01A982] to-[#05CC93] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#01A982]/25 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Active Player Chips List */}
              {players.length > 0 ? (
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs text-[#B1B9BE]">
                    <span>Assigned Players:</span>
                    {players.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPlayers([])}
                        className="hover:text-red-400 transition-colors cursor-pointer font-semibold underline decoration-[#535C66]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-[#151821] border border-[#3E4550] min-h-[72px] max-h-28 sm:max-h-32 overflow-y-auto">
                    {players.map((name, idx) => (
                      <span
                        key={`${name}_${idx}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#01A982]/20 border border-[#01A982]/40 text-[#E6E8E9] text-xs font-semibold shadow-xs animate-fade-in group hover:border-[#05CC93] transition-all"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#01A982] text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white max-w-[130px] truncate">{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePlayer(idx)}
                          className="w-4 h-4 rounded hover:bg-red-500/20 text-[#B1B9BE] hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                          title={`Remove ${name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#151821]/60 border border-dashed border-[#3E4550] text-center flex flex-col items-center justify-center gap-1">
                  <p className="text-xs text-[#7D8A92] font-medium">
                    No players added yet. Enter player name and click Add.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Validation Error Notice */}
        {validationError && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold p-2.5 rounded-xl text-center animate-shake">
            {validationError}
          </div>
        )}

        {/* Action Buttons: START ROUND + VIEW LEADERBOARD + RULES */}
        <div className="flex items-center gap-2.5 pt-0.5">
          {onOpenInstructions && (
            <button
              type="button"
              onClick={onOpenInstructions}
              className="py-3 px-4 rounded-xl bg-[#292D3A] hover:bg-[#3E4550] text-[#B1B9BE] hover:text-white border border-[#3E4550] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 shadow-sm"
              title="Return to Instructions"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Rules</span>
            </button>
          )}

          <button
            type="submit"
            className="flex-1 py-3 sm:py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#01A982] via-[#05CC93] to-[#00E0AF] hover:brightness-110 text-[#151821] text-base sm:text-lg font-black uppercase tracking-wider shadow-xl shadow-[#01A982]/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-5 h-5 text-[#151821] fill-[#151821] group-hover:scale-110 transition-transform" />
            <span>START ROUND {players.length > 0 ? `(${players.length} ${players.length === 1 ? 'PLAYER' : 'PLAYERS'})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={handleLeaderboardClick}
            className="py-3 px-4 rounded-xl bg-[#292D3A] hover:bg-[#3E4550] text-[#00E0AF] hover:text-white border border-[#01A982]/40 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <Trophy className="w-3.5 h-3.5 text-[#00E0AF]" />
            <span>Leaderboard</span>
          </button>
        </div>

      </form>

    </div>
  );
};

