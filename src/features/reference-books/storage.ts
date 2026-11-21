import type { SavedBook } from './types';

const STORAGE_KEY = 'edubuddy_reference_books_v1';

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeRaw(value: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
}

export function loadSavedBooks(): SavedBook[] {
  const raw = readRaw();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item: unknown): item is SavedBook =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as SavedBook).id === 'string' &&
          ['book', 'questionBank'].includes((item as SavedBook).type) &&
          typeof (item as SavedBook).savedAt === 'string'
      );
    }
  } catch {
    return [];
  }
  return [];
}

export function saveBook(id: string, type: 'book' | 'questionBank'): boolean {
  const existing = loadSavedBooks();
  if (existing.some((item) => item.id === id && item.type === type)) return true;
  const updated = [...existing, { id, type, savedAt: new Date().toISOString() }];
  return writeRaw(JSON.stringify(updated));
}

export function removeBook(id: string, type: 'book' | 'questionBank'): boolean {
  const existing = loadSavedBooks();
  const updated = existing.filter((item) => !(item.id === id && item.type === type));
  if (updated.length === existing.length) return false;
  return writeRaw(JSON.stringify(updated));
}

export function isSaved(id: string, type: 'book' | 'questionBank'): boolean {
  return loadSavedBooks().some((item) => item.id === id && item.type === type);
}

export function getSavedBooks(): SavedBook[] {
  return loadSavedBooks();
}
