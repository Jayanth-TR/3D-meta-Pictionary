import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Cloud, RotateCcw, Trash2, AlertTriangle, FileSpreadsheet, FileJson } from 'lucide-react';
import { Leaderboard } from '../components/Leaderboard';
import { getSessionHistory, syncSessionHistory, clearSessionHistory, isSupabaseConfigured } from '../utils/storage';
import { exportToExcel, exportToJson } from '../utils/exportData';
import type { SessionRecord } from '../types/game';

export const LeaderboardPage: React.FC = () => {
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() => getSessionHistory());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  useEffect(() => {
    document.title = 'Leaderboard — HPE Beyond The Goal';

    const loadData = () => {
      if (isSupabaseConfigured) {
        setIsSyncing(true);
        syncSessionHistory()
          .then((synced) => {
            if (synced && synced.length > 0) {
              setSessionHistory(synced);
            }
          })
          .catch((e) => {
            console.warn('LeaderboardPage: Supabase sync error:', e);
          })
          .finally(() => setIsSyncing(false));
      }
    };

    loadData();

    // Auto-refresh every 5 seconds so live game sessions on tablets/phones appear immediately
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearHistory = () => {
    clearSessionHistory();
    setSessionHistory([]);
    setIsConfirmingReset(false);
  };

  return (
    <div className="min-h-screen bg-[#151821] text-[#F7F7F7] font-['Outfit',sans-serif] flex flex-col">

      {/* ── Page Header ── */}
      <header className="w-full bg-[#292D3A]/95 backdrop-blur-md border-b border-[#3E4550] px-4 sm:px-8 py-3 sticky top-0 z-40 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          {/* Left: Back + Title */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#B1B9BE] hover:text-white text-xs font-semibold border border-[#3E4550] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Game</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#01A982]/20 to-[#05CC93]/20 border border-[#01A982]/40">
                <Trophy className="w-5 h-5 text-[#00E0AF]" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                  Event Leaderboard
                </h1>
                <p className="text-[10px] text-[#B1B9BE] font-medium mt-0.5 hidden sm:block">
                  HPE Beyond The Goal — Live Rankings
                </p>
              </div>
            </div>
          </div>

          {/* Right: Cloud badge + actions */}
          <div className="flex items-center gap-2">
            {isSupabaseConfigured && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#01A982]/15 border border-[#01A982]/40 text-[#00E0AF] text-[10px] font-bold tracking-wider uppercase">
                <Cloud className="w-3 h-3" />
                <span className={`w-1.5 h-1.5 rounded-full bg-[#00E0AF] ${isSyncing ? 'animate-ping' : 'animate-pulse'}`} />
                {isSyncing ? 'Syncing…' : 'Cloud Synced'}
              </span>
            )}

            <button
              type="button"
              onClick={() => exportToExcel(sessionHistory)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#01A982]/15 hover:bg-[#01A982]/25 text-[#05CC93] text-xs font-semibold border border-[#01A982]/30 transition-all cursor-pointer disabled:opacity-40"
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              type="button"
              onClick={() => exportToJson(sessionHistory)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#62E5F6] text-xs font-semibold border border-[#3E4550] transition-all cursor-pointer disabled:opacity-40"
              title="Export to JSON"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmingReset(true)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-semibold border border-red-500/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="Reset Leaderboard"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Reset Confirmation Banner ── */}
      {isConfirmingReset && (
        <div className="w-full bg-red-500/10 border-b border-red-500/30 px-4 sm:px-8 py-3 animate-fade-in">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Reset entire leaderboard?</h4>
                <p className="text-[11px] text-red-300">This permanently clears all scores from local storage and the cloud database.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsConfirmingReset(false)}
                className="px-4 py-1.5 rounded-xl bg-[#292D3A] hover:bg-[#3E4550] text-[#D4D8DB] text-xs font-bold border border-[#3E4550] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <Leaderboard
          sessionHistory={sessionHistory}
          onClearHistory={handleClearHistory}
          showTitle={true}
          title="Event Session Leaderboard"
          subtitle={`Live rankings of top teams and players by points and speed · ${sessionHistory.length} record${sessionHistory.length !== 1 ? 's' : ''}`}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#3E4550] px-4 sm:px-8 py-4 text-center">
        <p className="text-[11px] text-[#535C66] font-medium">
          HPE Beyond The Goal — 3D Meta Pictionary &nbsp;·&nbsp;
          <Link to="/" className="text-[#01A982] hover:text-[#00E0AF] transition-colors">
            Return to Game
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default LeaderboardPage;
