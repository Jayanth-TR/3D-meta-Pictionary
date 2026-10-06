import { createClient } from '@supabase/supabase-js';
import type { SessionRecord } from '../types/game';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://nkzrjkzuhpwadvsbfuea.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5renJqa3p1aHB3YWR2c2JmdWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNjM0NzMsImV4cCI6MjEwNjczOTQ3M30.Cxc_P92UNzhsH1BIxF9fZgoXV4pyNtvuna8Xp9Lde-Y';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SupabaseSessionRow {
  id: string;
  team_name: string;
  player_name: string;
  result: 'CORRECT' | 'TIMEOUT';
  elapsed_seconds: number;
  attempts: number;
  score: number;
  timestamp: string;
  created_at?: string;
}

export const mapRowToSessionRecord = (row: SupabaseSessionRow): SessionRecord => ({
  id: row.id,
  teamName: row.team_name,
  playerName: row.player_name,
  players: row.player_name ? row.player_name.split(',').map((s) => s.trim()).filter(Boolean) : [],
  result: row.result,
  elapsedSeconds: row.elapsed_seconds,
  attempts: row.attempts,
  score: row.score,
  timestamp: row.timestamp,
});

export const mapSessionRecordToRow = (record: SessionRecord): SupabaseSessionRow => ({
  id: record.id,
  team_name: record.teamName,
  player_name: record.playerName,
  result: record.result,
  elapsed_seconds: record.elapsedSeconds,
  attempts: record.attempts,
  score: record.score,
  timestamp: record.timestamp,
});

/**
 * Fetch all session records from Supabase
 */
export async function fetchRemoteSessions(): Promise<SessionRecord[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('session_records')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.warn('Supabase fetch session records error:', error.message);
      return null;
    }

    return (data as SupabaseSessionRow[]).map(mapRowToSessionRecord);
  } catch (err) {
    console.warn('Failed to fetch from Supabase:', err);
    return null;
  }
}

/**
 * Save a session record to Supabase
 */
export async function insertRemoteSession(record: SessionRecord): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapSessionRecordToRow(record);
    const { error } = await supabase.from('session_records').insert([row]);

    if (error) {
      console.warn('Supabase insert session record error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert session record to Supabase:', err);
    return false;
  }
}

/**
 * Delete all session records from Supabase
 */
export async function clearRemoteSessions(): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Delete all records where id is not empty
    const { error } = await supabase
      .from('session_records')
      .delete()
      .neq('id', '');

    if (error) {
      console.warn('Supabase clear session records error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to clear sessions in Supabase:', err);
    return false;
  }
}
