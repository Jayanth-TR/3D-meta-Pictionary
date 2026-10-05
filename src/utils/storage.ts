import type { ActiveRoundState, SessionRecord } from '../types/game';
import {
  fetchRemoteSessions,
  insertRemoteSession,
  clearRemoteSessions,
  isSupabaseConfigured,
} from '../lib/supabase';

const ACTIVE_ROUND_KEY = '3d_meta_pictionary_active_round_v1';
const SESSION_HISTORY_KEY = '3d_meta_pictionary_session_history_v1';

export { isSupabaseConfigured };

export const saveActiveRound = (state: ActiveRoundState | null): void => {
  try {
    if (state) {
      localStorage.setItem(ACTIVE_ROUND_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(ACTIVE_ROUND_KEY);
    }
  } catch (e) {
    console.warn('Failed to save active round state to localStorage', e);
  }
};

export const loadActiveRound = (): ActiveRoundState | null => {
  try {
    const data = localStorage.getItem(ACTIVE_ROUND_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to load active round state from localStorage', e);
    return null;
  }
};

/**
 * Save session record to both localStorage and Supabase.
 * Returns the immediate optimistic local history array.
 */
export const saveSessionRecord = (record: SessionRecord): SessionRecord[] => {
  let updated: SessionRecord[] = [];
  try {
    const history = getSessionHistory();
    // Prevent duplicate entries by ID
    const filtered = history.filter((r) => r.id !== record.id);
    updated = [record, ...filtered];
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save session record to localStorage', e);
  }

  // Asynchronously sync to Supabase database
  if (isSupabaseConfigured) {
    insertRemoteSession(record).catch((err) => {
      console.warn('Background Supabase sync failed:', err);
    });
  }

  return updated;
};

/**
 * Get current session history from local storage.
 */
export const getSessionHistory = (): SessionRecord[] => {
  try {
    const data = localStorage.getItem(SESSION_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to get session history from localStorage', e);
    return [];
  }
};

/**
 * Sync session history from Supabase with local storage fallback.
 * Fetches latest records from Supabase and reconciles with local storage.
 */
export const syncSessionHistory = async (): Promise<SessionRecord[]> => {
  const localHistory = getSessionHistory();

  if (!isSupabaseConfigured) {
    return localHistory;
  }

  try {
    const remoteRecords = await fetchRemoteSessions();
    if (!remoteRecords) {
      return localHistory;
    }

    // Merge remote and local (avoiding duplicates)
    const map = new Map<string, SessionRecord>();
    // First populate remote records
    remoteRecords.forEach((item) => map.set(item.id, item));
    // If any local record wasn't synced yet, retain and sync it
    for (const localItem of localHistory) {
      if (!map.has(localItem.id)) {
        map.set(localItem.id, localItem);
        // Sync missing local record to Supabase
        insertRemoteSession(localItem).catch(() => {});
      }
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    try {
      localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to persist merged history locally', e);
    }

    return merged;
  } catch (e) {
    console.warn('Error during Supabase session sync:', e);
    return localHistory;
  }
};

/**
 * Clear session history in both localStorage and Supabase.
 */
export const clearSessionHistory = (): void => {
  try {
    localStorage.removeItem(SESSION_HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear session history locally', e);
  }

  if (isSupabaseConfigured) {
    clearRemoteSessions().catch((err) => {
      console.warn('Background Supabase clear failed:', err);
    });
  }
};
