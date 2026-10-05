import React, { useState } from 'react';
import type { SessionRecord } from '../types/game';
import { Trophy, Trash2, CheckCircle2, TimerOff, Users, User, Zap, Search, Crown, Flame, FileSpreadsheet, FileJson, Cloud } from 'lucide-react';
import { exportToExcel, exportToJson } from '../utils/exportData';
import { isSupabaseConfigured } from '../lib/supabase';

interface LeaderboardProps {
  sessionHistory: SessionRecord[];
  onClearHistory: () => void;
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  sessionHistory,
  onClearHistory,
  title = "Event Session Leaderboard",
  subtitle = "Live rankings of top teams and players by points and speed",
  showTitle = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CORRECT' | 'TIMEOUT'>('ALL');

  // Metrics
  const totalRounds = sessionHistory.length;
  const correctRounds = sessionHistory.filter((r) => r.result === 'CORRECT');
  const highestScore = correctRounds.length > 0 ? Math.max(...correctRounds.map((r) => r.score)) : 0;
  const fastestSolve = correctRounds.length > 0 ? Math.min(...correctRounds.map((r) => r.elapsedSeconds)) : 0;

  // Sorted history by score desc, then by solve speed asc
  const sortedHistory = [...sessionHistory].sort((a, b) => b.score - a.score || a.elapsedSeconds - b.elapsedSeconds);

  // Filtered list
  const filteredHistory = sortedHistory.filter((item) => {
    const matchesSearch =
      item.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.playerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'CORRECT') return matchesSearch && item.result === 'CORRECT';
    if (filterType === 'TIMEOUT') return matchesSearch && item.result === 'TIMEOUT';
    return matchesSearch;
  });

  const top3 = sortedHistory.slice(0, 3);

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Header (Optional) */}
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E4550] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#01A982]/20 to-[#05CC93]/20 text-[#00E0AF] border border-[#01A982]/40 shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  {title}
                </h3>
                {isSupabaseConfigured && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#01A982]/15 border border-[#01A982]/40 text-[#00E0AF] text-[10px] font-bold tracking-wider uppercase" title="Live synced with Supabase">
                    <Cloud className="w-3 h-3 text-[#00E0AF]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E0AF] animate-pulse"></span>
                    Supabase Synced
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#B1B9BE] font-medium">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => exportToExcel(sessionHistory)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#01A982]/15 hover:bg-[#01A982]/25 text-[#05CC93] text-xs font-semibold border border-[#01A982]/30 transition-all cursor-pointer disabled:opacity-40"
              title="Export user data to Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#05CC93]" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={() => exportToJson(sessionHistory)}
              disabled={sessionHistory.length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#292D3A] hover:bg-[#3E4550] text-[#62E5F6] text-xs font-semibold border border-[#3E4550] transition-all cursor-pointer disabled:opacity-40"
              title="Export user data to JSON (.json)"
            >
              <FileJson className="w-3.5 h-3.5 text-[#62E5F6]" />
              <span>Export JSON</span>
            </button>

            {sessionHistory.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#292D3A]/90 backdrop-blur-xl border border-[#3E4550] p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#01A982]/15 text-[#05CC93] border border-[#01A982]/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B1B9BE] block">Total Rounds</span>
            <span className="text-2xl font-black text-white">{totalRounds}</span>
          </div>
        </div>

        <div className="bg-[#292D3A]/90 backdrop-blur-xl border border-[#01A982]/40 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#01A982]/20 text-[#00E0AF] border border-[#01A982]/40">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B1B9BE] block">Top High Score</span>
            <span className="text-2xl font-black text-[#00E0AF]">{highestScore > 0 ? `${highestScore} PTS` : '0 PTS'}</span>
          </div>
        </div>

        <div className="bg-[#292D3A]/90 backdrop-blur-xl border border-[#3E4550] p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#62E5F6]/15 text-[#62E5F6] border border-[#62E5F6]/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B1B9BE] block">Fastest Solve</span>
            <span className="text-2xl font-black text-[#62E5F6]">{fastestSolve > 0 ? `${fastestSolve}s` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium (Visible when >= 1 entries) */}
      {top3.length > 0 && (
        <div className="bg-gradient-to-r from-[#292D3A] via-[#1E222D] to-[#292D3A] border border-[#01A982]/30 rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#00E0AF] flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            CURRENT PODIUM LEADERS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {top3.map((item, idx) => {
              const ranks = [
                { badge: '🥇 #1', border: 'border-amber-400/60', bg: 'bg-amber-400/10', text: 'text-amber-300' },
                { badge: '🥈 #2', border: 'border-[#B1B9BE]/60', bg: 'bg-[#B1B9BE]/10', text: 'text-[#D4D8DB]' },
                { badge: '🥉 #3', border: 'border-[#7D8A92]/60', bg: 'bg-[#7D8A92]/10', text: 'text-[#B1B9BE]' },
              ];
              const r = ranks[idx];
              return (
                <div key={item.id} className={`p-4 rounded-2xl bg-[#151821]/90 border ${r.border} space-y-2 relative overflow-hidden shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${r.bg} ${r.text} border ${r.border}`}>
                      {r.badge}
                    </span>
                    <span className="text-xs font-bold text-[#B1B9BE]">{item.elapsedSeconds}s</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white truncate">{item.teamName}</div>
                    <div className="text-xs font-semibold text-[#62E5F6] flex items-center gap-1 truncate" title={item.playerName}>
                      <User className="w-3 h-3 flex-shrink-0" /> {item.playerName}
                    </div>
                  </div>
                  <div className="text-lg font-black text-[#00E0AF] flex items-center justify-between pt-1 border-t border-[#3E4550]">
                    <span className="text-[10px] text-[#7D8A92] uppercase font-bold">Score</span>
                    <span>{item.score} PTS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7D8A92] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team or player name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151821] border border-[#3E4550] text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#01A982] placeholder-[#7D8A92]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto bg-[#151821] p-1 rounded-xl border border-[#3E4550]">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-[#01A982] text-white shadow-md' : 'text-[#B1B9BE] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('CORRECT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'CORRECT' ? 'bg-[#05CC93] text-[#151821] font-black shadow-md' : 'text-[#B1B9BE] hover:text-white'
            }`}
          >
            Solved
          </button>
          <button
            type="button"
            onClick={() => setFilterType('TIMEOUT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'TIMEOUT' ? 'bg-red-600 text-white shadow-md' : 'text-[#B1B9BE] hover:text-white'
            }`}
          >
            Timeout
          </button>
        </div>

      </div>

      {/* Leaderboard Table (Desktop & Tablet >=640px) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[#3E4550] bg-[#292D3A]/90 backdrop-blur-xl">
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-[#7D8A92] text-sm font-medium italic">
            No leaderboard records match your criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151821] text-[#B1B9BE] uppercase tracking-wider font-extrabold text-[10px] border-b border-[#3E4550]">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Team Name</th>
                <th className="p-3.5">Player(s)</th>
                <th className="p-3.5">Solve Time</th>
                <th className="p-3.5">Points</th>
                <th className="p-3.5">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3E4550]/60">
              {filteredHistory.map((item) => {
                const rankIndex = sortedHistory.findIndex((s) => s.id === item.id);
                return (
                  <tr key={item.id} className="hover:bg-[#3E4550]/40 transition-colors">
                    <td className="p-3.5 font-bold">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        rankIndex === 0 ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : rankIndex === 1 ? 'bg-[#D4D8DB] text-slate-950' : rankIndex === 2 ? 'bg-[#7D8A92] text-white' : 'bg-[#151821] text-[#B1B9BE]'
                      }`}>
                        {rankIndex + 1}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">
                      {item.result === 'CORRECT' ? (
                        <span className="inline-flex items-center gap-1 text-[#00E0AF] bg-[#01A982]/15 px-2 py-0.5 rounded-md border border-[#01A982]/30 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 text-[11px]">
                          <TimerOff className="w-3.5 h-3.5" /> Timeout
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#05CC93]" />
                      {item.teamName}
                    </td>
                    <td className="p-3.5 font-semibold text-[#62E5F6]">
                      <span className="inline-flex items-center gap-1 max-w-[200px] truncate" title={item.playerName}>
                        <User className="w-3.5 h-3.5 text-[#62E5F6] flex-shrink-0" />
                        {item.playerName}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-[#D4D8DB]">{item.elapsedSeconds}s</td>
                    <td className="p-3.5 font-black text-[#00E0AF] text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#00E0AF]" />
                        {item.score} PTS
                      </span>
                    </td>
                    <td className="p-3.5 text-[#7D8A92] text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card List (<640px) */}
      <div className="block sm:hidden space-y-2.5">
        {filteredHistory.length === 0 ? (
          <div className="py-8 text-center text-[#7D8A92] text-xs italic bg-[#292D3A]/60 rounded-2xl border border-[#3E4550] p-4">
            No records match your search.
          </div>
        ) : (
          filteredHistory.map((item) => {
            const rankIndex = sortedHistory.findIndex((s) => s.id === item.id);
            return (
              <div key={item.id} className="bg-[#292D3A]/90 border border-[#3E4550] p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      rankIndex === 0 ? 'bg-amber-400 text-slate-950' : rankIndex === 1 ? 'bg-[#D4D8DB] text-slate-950' : rankIndex === 2 ? 'bg-[#7D8A92] text-white' : 'bg-[#151821] text-[#B1B9BE]'
                    }`}>
                      #{rankIndex + 1}
                    </span>
                    {item.result === 'CORRECT' ? (
                      <span className="text-[10px] font-bold text-[#00E0AF] bg-[#01A982]/15 px-2 py-0.5 rounded-md border border-[#01A982]/30">
                        ✓ Solved ({item.elapsedSeconds}s)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        ✕ Timeout
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-[#00E0AF]">{item.score} PTS</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#3E4550]/80">
                  <div className="font-bold text-white flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#05CC93]" /> {item.teamName}
                  </div>
                  <div className="font-semibold text-[#62E5F6] flex items-center gap-1 max-w-[160px] truncate" title={item.playerName}>
                    <User className="w-3 h-3 text-[#62E5F6] flex-shrink-0" /> {item.playerName}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
