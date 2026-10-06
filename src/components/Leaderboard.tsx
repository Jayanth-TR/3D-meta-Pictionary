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
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${rankIndex === 0 ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : rankIndex === 1 ? 'bg-[#D4D8DB] text-slate-950' : rankIndex === 2 ? 'bg-[#7D8A92] text-white' : 'bg-[#151821] text-[#B1B9BE]'
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
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${rankIndex === 0 ? 'bg-amber-400 text-slate-950' : rankIndex === 1 ? 'bg-[#D4D8DB] text-slate-950' : rankIndex === 2 ? 'bg-[#7D8A92] text-white' : 'bg-[#151821] text-[#B1B9BE]'
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
