/**
 * Saved Resources / Bookmarks feature — types
 *
 * This module defines the public surface that the Bookmarks page consumes.
 * It ONLY touches the presentation layer — it never writes to the global
 * `Store` and never touches the localStorage schema. The `SavedResource`
 * type below is re-exported from `src/videoRank.ts` (the project's
 * existing, shared saved-resource structure); we do not redefine it.
 *
 * The integration agent connects this component to the existing EduBuddy
 * store by passing in:
 *   - savedResources: SavedResource[]  (existing `store.savedResources`)
 *   - savedVisualIds: string[]         (existing `store.savedVisuals`)
 *   - onRemove(id): void               (existing `removeResource`)
 *   - onAddBookmark(item): void        (wire to the store's save logic)
 *
 * Nothing in this file is stored anywhere — all state is derived from the
 * props and callbacks the integration agent supplies.
 */

/** Existing, shared saved-resource shape (defined in src/videoRank.ts).
 *  The Bookmarks page consumes this directly rather than duplicating it. */
export type { SavedResource, PlaylistItem } from '../../videoRank';

import type { SavedResource, PlaylistItem } from '../../videoRank';

/** Canonical categories for the bookmark toolbar / empty states. */
export const BOOKMARK_CATEGORIES = [
  { value: 'video',   label: 'Videos' },
  { value: 'playlist', label: 'Playlists' },
  { value: 'search',  label: 'Search links' },
  { value: 'visual',  label: 'Visual Studio' },
  { value: 'note',    label: 'Notes' },
  { value: 'quiz',    label: 'Quizzes & study materials' },
] as const;

export type BookmarkCategory = typeof BOOKMARK_CATEGORIES[number]['value'] | 'all';

/** The item types this page understands. `kind` maps 1:1 to the existing
 *  `SavedResource.kind` ('video' | 'playlist' | 'search') so the component
 *  can consume the existing store data without conversion. */
export type BookmarkItem =
  | { kind: 'video'; subtype: 'video'; id: string; title: string; url: string; thumb?: string; channel?: string; topic: string; subject: string; grade: string; date: string }
  | { kind: 'playlist'; subtype: 'playlist'; id: string; title: string; url: string; thumb?: string; channel?: string; topic: string; subject: string; grade: string; date: string }
  | { kind: 'search';  subtype: 'search';  id: string; title: string; url: string; topic: string; subject: string; grade: string; date: string }
  | { kind: 'visual';  subtype: 'visual';  id: string; title: string; topic: string; subject: string; grade: string; date: string; visId: string }
  | { kind: 'note';    subtype: 'note';    id: string; title: string; url?: string; topic: string; subject: string; grade: string; date: string; material?: string }
  | { kind: 'quiz';    subtype: 'quiz';    id: string; title: string; topic: string; subject: string; grade: string; date: string; difficulty?: string };

/** `SavedResource` from videoRank.ts → our canonical `BookmarkItem` rows.
 *  1:1 mapping — the component consumes the existing store data directly. */
export function toBookmarkItem(r: SavedResource): BookmarkItem {
  switch (r.kind) {
    case 'video':
      return { kind: 'video', subtype: 'video', id: r.id, title: r.title, url: r.url, thumb: r.thumb, channel: r.channel, topic: r.topic, subject: r.subject, grade: r.grade, date: r.date };
    case 'playlist':
      return { kind: 'playlist', subtype: 'playlist', id: r.id, title: r.title, url: r.url, thumb: r.thumb, channel: r.channel, topic: r.topic, subject: r.subject, grade: r.grade, date: r.date };
    case 'search':
      return { kind: 'search', subtype: 'search', id: r.id, title: r.title, url: r.url, topic: r.topic, subject: r.subject, grade: r.grade, date: r.date };
    default:
      return { kind: r.kind as 'video', subtype: r.kind, id: r.id, title: r.title, url: r.url, topic: r.topic, subject: r.subject, grade: r.grade, date: r.date };
  }
}

export type BookmarkRow = BookmarkItem;

export type SortOrder = 'recent' | 'title' | 'topic';
