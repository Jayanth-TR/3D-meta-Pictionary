import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Cloud, RotateCcw, Trash2, AlertTriangle, FileSpreadsheet, FileJson, Sparkles, Users, CheckCircle2 } from 'lucide-react';
import { Leaderboard } from '../components/Leaderboard';
import { getSessionHistory, syncSessionHistory, clearSessionHistory, isSupabaseConfigured } from '../utils/storage';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { exportToExcel, exportToJson } from '../utils/exportData';
import type { SessionRecord } from '../types/game';

export const LeaderboardPage: React.FC = () => {
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() => getSessionHistory());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  useEffect(() => {
    document.title = 'Leaderboard — HPE Beyond The Goal';
    let isMounted = true;

    const loadData = async () => {
      if (isSupabaseConfigured) {
        setIsSyncing(true);
        try {
          const synced = await syncSessionHistory();
          if (isMounted) {
            setSessionHistory(synced);
          }
        } catch (e) {
          console.warn('LeaderboardPage: Supabase sync error:', e);
        } finally {
          if (isMounted) {
            setIsSyncing(false);
          }
        }
      }
    };

    // Initial load
    loadData();

    // 1. Supabase Realtime WebSocket subscription for instant updates across devices
    let channel: RealtimeChannel | null = null;
    if (supabase) {
      channel = supabase
        .channel('realtime_leaderboard_page')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'session_records' },
          () => {
            loadData();
          }
        )
        .subscribe();
    }

    // 2. High-frequency 3-second polling fallback so all devices stay in sync
    const interval = setInterval(loadData, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleClearHistory = async () => {
    await clearSessionHistory();
    setSessionHistory([]);
    setIsConfirmingReset(false);
  };

  // Sorted history for leader calculation: solved first (fastest elapsed time)
  const sortedHistory = [...sessionHistory].sort((a, b) => {
    const aSolved = a.result === 'CORRECT';
    const bSolved = b.result === 'CORRECT';
    if (aSolved && !bSolved) return -1;
    if (!aSolved && bSolved) return 1;
    return a.elapsedSeconds - b.elapsedSeconds;
  });

  const topRecord = sortedHistory.find((r) => r.result === 'CORRECT');
  const solvedCount = sessionHistory.filter((r) => r.result === 'CORRECT').length;
  const totalRounds = sessionHistory.length;

  return (
    <div className="min-h-screen bg-[#151821] text-[#F7F7F7] font-['Outfit',sans-serif] flex flex-col">

      {/* ── Page Header ── */}
      <header className="w-full bg-[#292D3A]/95 backdrop-blur-md border-b border-[#3E4550] px-4 sm:px-8 py-3 sticky top-0 z-40 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          {/* Left: Back + HPE Branding */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151821] hover:bg-[#3E4550] text-[#B1B9BE] hover:text-white text-xs font-semibold border border-[#3E4550] transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Game</span>
            </Link>

            {/* HPE Brand Logo & Slogan */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 px-2.5 rounded-lg bg-[#151821] border border-[#01A982]/60 flex items-center justify-center shadow-md">
                <span className="font-black text-lg tracking-wider text-white flex items-center">
                  HP
                  <span className="relative text-[#01A982] font-black">
                    E
                    <span className="absolute -bottom-0.5 left-0 right-0 h-1 bg-[#01A982] rounded-xs shadow-[0_0_8px_#01A982]" />
                  </span>
                </span>
              </div>

              <div className="h-6 w-px bg-[#3E4550] hidden xs:block" />

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs sm:text-sm tracking-wide text-white uppercase">
                    BEYOND <span className="text-[#01A982]">THE GOAL</span>
                  </span>
                  <span className="hidden md:inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#01A982]/20 text-[#00E0AF] border border-[#01A982]/40">
                    Leaderboard
                  </span>
                </div>
                <span className="text-[10px] text-[#B1B9BE] font-medium hidden xs:block">Together, We Move Forward</span>
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
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

        {/* ── Executive Branded Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl border border-[#01A982]/40 bg-gradient-to-br from-[#1E2533]/95 via-[#161D2A]/95 to-[#1A2330]/95 shadow-2xl p-5 sm:p-7 backdrop-blur-xl mb-8 group">
          
          {/* Ambient background glow matching HPE Green */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#01A982]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-[#00E0AF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left: Event Info & Live Tournament Stats */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Top Category Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#01A982]/20 border border-[#01A982]/50 text-[#00E0AF] text-xs font-black uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E0AF]" />
                  Official Tournament Rankings
                </span>
                <span className="text-xs text-[#B1B9BE] font-semibold hidden sm:inline">
                  HPE Beyond The Goal 2025
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  BEYOND <span className="text-[#01A982]">THE GOAL</span>
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-[#00E0AF] tracking-wide mt-1">
                  Together, We Move Forward.
                </p>
                <p className="text-xs text-[#B1B9BE] font-normal leading-relaxed mt-1.5 max-w-xl">
                  Live rankings for the 3D Meta Pictionary Challenge. Teams and players compete in virtual space with stopwatch timing — fastest prompt solve claims first place!
                </p>
              </div>

              {/* Quick Live Stats Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                
                {/* Leader Card */}
                <div className="p-3 rounded-2xl bg-[#151821]/80 border border-[#3E4550] flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#B1B9BE] uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Leader</span>
                  </div>
                  <div className="mt-1">
                    {topRecord ? (
                      <>
                        <div className="text-xs sm:text-sm font-black text-white truncate" title={topRecord.teamName}>
                          {topRecord.teamName}
                        </div>
                        <div className="text-[11px] font-extrabold text-[#00E0AF]">
                          {topRecord.elapsedSeconds}s
                        </div>
                      </>
                    ) : (
                      <div className="text-xs font-semibold text-[#7D8A92] italic">
                        None yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Teams Card */}
                <div className="p-3 rounded-2xl bg-[#151821]/80 border border-[#3E4550] flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#B1B9BE] uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-[#62E5F6]" />
                    <span>Entries</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-base sm:text-lg font-black text-white">
                      {totalRounds}
                    </div>
                    <div className="text-[10px] text-[#B1B9BE]">
                      {totalRounds === 1 ? 'Round played' : 'Rounds played'}
                    </div>
                  </div>
                </div>

                {/* Solved Card */}
                <div className="p-3 rounded-2xl bg-[#151821]/80 border border-[#3E4550] flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#B1B9BE] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E0AF]" />
                    <span>Solved</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-base sm:text-lg font-black text-[#00E0AF]">
                      {solvedCount}
                    </div>
                    <div className="text-[10px] text-[#B1B9BE]">
                      {totalRounds > 0 ? `${Math.round((solvedCount / totalRounds) * 100)}% solve rate` : '0% solve rate'}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Framed Key Artwork */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#01A982]/50 shadow-2xl shadow-[#01A982]/20 bg-[#151821] group-hover:border-[#00E0AF] transition-all">
                <img
                  src="/hpe-beyond-the-goal.png"
                  alt="HPE Beyond The Goal - Together, We Move Forward"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

        </div>

        {/* ── Table Section Header ── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00E0AF]" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Live Standings
            </h3>
            <span className="text-xs text-[#B1B9BE] font-semibold">
              ({sessionHistory.length} {sessionHistory.length === 1 ? 'entry' : 'entries'})
            </span>
          </div>
          <div className="text-xs text-[#7D8A92] font-medium hidden sm:block">
            Ranked by fastest solve time
          </div>
        </div>

        {/* ── Rankings Table ── */}
        <Leaderboard
          sessionHistory={sessionHistory}
          onClearHistory={handleClearHistory}
          showTitle={false}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#3E4550] px-4 sm:px-8 py-5 text-center bg-[#151821]/80 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7D8A92]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#00E0AF]">HPE Beyond The Goal</span>
            <span>·</span>
            <span>3D Meta Pictionary Challenge</span>
          </div>
          <p className="font-medium">
            Together, We Move Forward &nbsp;·&nbsp;
            <Link to="/" className="text-[#01A982] hover:text-[#00E0AF] font-semibold transition-colors">
              Return to Game
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LeaderboardPage;
