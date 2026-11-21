import { useMemo, useState } from 'react';
import { BOOKMARK_CATEGORIES, type BookmarkItem, type BookmarkCategory, type SortOrder, type SavedResource } from './types';

/**
 * `SavedResource` from videoRank.ts → our internal `BookmarkItem` rows.
 * This is the canonical one-to-one mapping: it reuses the existing store
 * data without defining a new schema.
 */
function toBookmarkItem(r: SavedResource): BookmarkItem {
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

function isSavedVisualId(visId: string, savedVisualIds: string[]): boolean {
  return savedVisualIds != null && savedVisualIds.includes(visId);
}

/**
 * Hook that derives everything the UI needs from the integrating shell's props.
 * All filtering, sorting, and search are pure computations over the props — no
 * localStorage reads, no global Store access.
 */
export function useBookmarks(props: {
  savedResources: SavedResource[];
  savedVisualIds?: string[];
  searchQuery: string;
  activeCategory: BookmarkCategory;
  sortOrder: SortOrder;
}): {
  allItems: BookmarkItem[];
  filteredItems: BookmarkItem[];
  visibleCount: number;
  totalCount: number;
  searchQuery: string;
  activeCategory: BookmarkCategory;
  sortOrder: SortOrder;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (c: BookmarkCategory) => void;
  setSortOrder: (s: SortOrder) => void;
  resetFilters: () => void;
} {
  const { savedResources, savedVisualIds = [], searchQuery, activeCategory, sortOrder } = props;

  const allItems: BookmarkItem[] = useMemo(() => {
    const rows = savedResources.map(toBookmarkItem);
    // Each Visual Studio experience produces one bookmark row.
    const visualIds = new Set(savedVisualIds);
    // If a visId collides with an existing id it's a harmless no-op.
    const visualIdsOnly = savedVisualIds.filter(id => !savedResources.some(r => r.id === id));
    return [
      ...rows,
      ...visualIdsOnly.map((visId) => ({
        kind: 'visual' as const,
        subtype: 'visual' as const,
        id: visId,
        title: `Visual Studio experience`,
        topic: 'General',
        subject: 'General',
        grade: '—',
        date: '',
        visId,
      })),
    ];
  }, [savedResources, savedVisualIds]);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState<BookmarkCategory>(activeCategory);
  const [localSort, setLocalSort] = useState<SortOrder>(sortOrder);

  const filteredItems = useMemo(() => {
    let list = allItems;

    // Category filter
    if (localCategory !== 'all') {
      list = list.filter((item) => {
        if (localCategory === 'video') return item.kind === 'video';
        if (localCategory === 'playlist') return item.kind === 'playlist';
        if (localCategory === 'search') return item.kind === 'search';
        if (localCategory === 'visual') return item.kind === 'visual';
        if (localCategory === 'note') return item.kind === 'note';
        if (localCategory === 'quiz') return item.kind === 'quiz';
        return true;
      });
    }

    // Search across title, topic, subject, grade
    const q = localSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => {
        const haystack = [item.title, item.topic, item.subject, item.grade].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }

    // Sorting
    switch (localSort) {
      case 'title':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
        break;
      case 'topic':
        list = [...list].sort((a, b) => a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base' }));
        break;
      case 'recent':
      default:
        // Already in insertion order (newest first)
        break;
    }

    return list;
  }, [allItems, localSearch, localCategory, localSort]);

  const visibleCount = filteredItems.length;
  const totalCount = allItems.length;
  const hasFilters = localSearch.trim().length > 0 || localCategory !== 'all';

  return {
    allItems,
    filteredItems,
    visibleCount,
    totalCount,
    searchQuery: localSearch,
    activeCategory: localCategory,
    sortOrder: localSort,
    setSearchQuery: setLocalSearch,
    setActiveCategory: setLocalCategory,
    setSortOrder: setLocalSort,
    resetFilters: () => {
      setLocalSearch('');
      setLocalCategory('all');
      setLocalSort('recent');
    },
  };
}
