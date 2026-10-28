import { GeneratedResult } from '../types';

const STORAGE_KEY = 'writemate_ai_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function getSavedHistory(): GeneratedResult[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Could not read history from localStorage:', err);
    return [];
  }
}

export function saveResultToHistory(result: GeneratedResult): GeneratedResult[] {
  try {
    const existing = getSavedHistory();
    // Prepend new item and filter out duplicate ids
    const updated = [result, ...existing.filter((item) => item.id !== result.id)].slice(
      0,
      MAX_HISTORY_ITEMS
    );
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (err) {
    console.warn('Could not save history to localStorage:', err);
    return [];
  }
}

export function deleteHistoryItem(id: string): GeneratedResult[] {
  try {
    const existing = getSavedHistory();
    const updated = existing.filter((item) => item.id !== id);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (err) {
    console.warn('Could not delete item from localStorage:', err);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not clear history in localStorage:', err);
  }
}
