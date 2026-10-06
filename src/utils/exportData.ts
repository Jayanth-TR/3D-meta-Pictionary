import * as XLSX from 'xlsx';
import type { SessionRecord } from '../types/game';

/**
 * Exports user session records to an Excel (.xlsx) file
 */
export const exportToExcel = (records: SessionRecord[], filename = 'meta_pictionary_user_data.xlsx'): void => {
  if (records.length === 0) return;

  // Sort records: Solved rounds first by fastest elapsed time, followed by gave up rounds
  const sorted = [...records].sort((a, b) => {
    const aSolved = a.result === 'CORRECT';
    const bSolved = b.result === 'CORRECT';
    if (aSolved && !bSolved) return -1;
    if (!aSolved && bSolved) return 1;
    return a.elapsedSeconds - b.elapsedSeconds;
  });
  
  const worksheetData = sorted.map((item, index) => ({
    Rank: index + 1,
    'Team Name': item.teamName,
    'Player(s)': item.playerName,
    Result: item.result === 'CORRECT' ? 'Solved' : 'Gave Up',
    'Timing (Seconds)': item.elapsedSeconds,
    Attempts: item.attempts,
    Timestamp: new Date(item.timestamp).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Set column widths for readable spreadsheet presentation
  worksheet['!cols'] = [
    { wch: 8 },  // Rank
    { wch: 22 }, // Team Name
    { wch: 28 }, // Player(s)
    { wch: 14 }, // Result
    { wch: 18 }, // Timing
    { wch: 10 }, // Attempts
    { wch: 24 }, // Timestamp
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data & Leaderboard');
  XLSX.writeFile(workbook, filename);
};

/**
 * Exports user session records to a JSON (.json) file
 */
export const exportToJson = (records: SessionRecord[], filename = 'meta_pictionary_user_data.json'): void => {
  if (records.length === 0) return;

  const sorted = [...records].sort((a, b) => {
    const aSolved = a.result === 'CORRECT';
    const bSolved = b.result === 'CORRECT';
    if (aSolved && !bSolved) return -1;
    if (!aSolved && bSolved) return 1;
    return a.elapsedSeconds - b.elapsedSeconds;
  });
  const dataStr = JSON.stringify(sorted, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
