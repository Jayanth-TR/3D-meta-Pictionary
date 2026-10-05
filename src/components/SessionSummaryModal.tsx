import React, { useState } from 'react';
import type { SessionRecord } from '../types/game';
import { X, Trophy, FileSpreadsheet, FileJson, Trash2, AlertTriangle, RotateCcw, Cloud } from 'lucide-react';
import { Leaderboard } from './Leaderboard';
import { exportToExcel, exportToJson } from '../utils/exportData';
import { isSupabaseConfigured } from '../lib/supabase';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionHistory: SessionRecord[];
  onClearHistory: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  sessionHistory,
  onClearHistory,
}) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleResetLeaderboard = () => {
    onClearHistory();
    setIsConfirmingReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#151821]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none overflow-y-auto">
      <div className="bg-[#292D3A] border border-[#3E4550] w-full max-w-4xl rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col my-auto text-[#F7F7F7]">
        
        {/* Header with HPE Branding & Reset Status */}
        <div className="flex items-center justify-between border-b border-[#3E4550] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#01A982]/15 text-[#00E0AF] border border-[#01A982]/30">
              <Trophy className="w-5 h-5 text-[#00E0AF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-bold text-white">Event Session Leaderboard</h3>
                <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#01A982]/20 text-[#00E0AF] border border-[#01A982]/40">
                  HPE Beyond The Goal
                </span>
                {isSupabaseConfigured && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-bold text-[#62E5F6] bg-[#151821] px-2 py-0.5 rounded-full border border-[#3E4550]">
                    <Cloud className="w-2.5 h-2.5 text-[#62E5F6]" />
                    Cloud Synced
                  </span>
                )}
              </div>
              <p className="text-xs text-[#B1B9BE]">
                Live rankings of completed game rounds ({sessionHistory.length} {sessionHistory.length === 1 ? 'record' : 'records'})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#B1B9BE] hover:text-white transition-all cursor-pointer border border-[#3E4550]"
            title="Close Leaderboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inline Reset Confirmation Banner */}
        {isConfirmingReset && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Reset Entire Leaderboard?</h4>
                <p className="text-[11px] text-red-300">
                  This will permanently clear all team scores and rankings from both this browser and cloud database.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsConfirmingReset(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#D4D8DB] text-xs font-bold transition-all cursor-pointer border border-[#3E4550]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetLeaderboard}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Reset Leaderboard</span>
              </button>
            </div>
          </div>
        )}

        {/* Responsive Leaderboard Component */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-[220px]">
          <Leaderboard
            sessionHistory={sessionHistory}
            onClearHistory={onClearHistory}
            showTitle={false}
          />
        </div>

        {/* Footer Actions: Exporting, Resetting & Closing */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#3E4550] pt-3">
          
          {/* Left: Export Buttons + Reset Leaderboard Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => exportToExcel(sessionHistory)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#01A982]/15 hover:bg-[#01A982]/25 text-[#05CC93] text-xs font-semibold border border-[#01A982]/30 transition-all cursor-pointer disabled:opacity-40"
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#05CC93]" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={() => exportToJson(sessionHistory)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#62E5F6] text-xs font-semibold border border-[#3E4550] transition-all cursor-pointer disabled:opacity-40"
              title="Export to JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-[#62E5F6]" />
              <span>Export JSON</span>
            </button>

            {/* DEDICATED RESET LEADERBOARD BUTTON */}
            <button
              type="button"
              onClick={() => setIsConfirmingReset(true)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 text-xs font-semibold border border-red-500/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ml-1"
              title="Reset Leaderboard (Clear all scores)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Reset Leaderboard</span>
            </button>
          </div>

          {/* Right: Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#D4D8DB] border border-[#3E4550] text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
