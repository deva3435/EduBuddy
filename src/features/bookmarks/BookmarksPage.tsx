import { useMemo } from 'react';
import { BookOpen, Compass, Clock3, GraduationCap, Layers3, ListMusic, Play, Search, Target, TrendingUp, X, BookmarkCheck, Plus } from 'lucide-react';
import { BOOKMARK_CATEGORIES, type BookmarkItem, type SavedResource } from './types';
import { useBookmarks } from './useBookmarks';
import { BookmarkCard } from './BookmarkCard';
import { BookmarksToolbar } from './BookmarksToolbar';

/**
 * BookmarksPage — dedicated, polished Saved Resources / Bookmarks experience.
 *
 * Connection contract (the integration agent wires this to the existing store):
 *   props:
 *     - savedResources:  SavedResource[]   → existing `store.savedResources`
 *     - savedVisualIds:  string[]          → existing `store.savedVisuals`
 *     - onRemove:        (id: string) => void → existing `removeResource`
 *     - onOpen:          (url, title, kind) => void
 *     - onAdd:           (item) => void     → wire to the store's save logic
 *   All state (search, filters, sort) is derived from props through the
 *   `useBookmarks` hook — the component never touches localStorage or the
 *   global Store directly.
 */
export function BookmarksPage({
  savedResources = [],
  savedVisualIds = [],
  onRemove,
  onOpen,
  onAdd,
  subtitle = 'Everything you saved — videos, playlists, and search links — all in one place.',
  instruction = 'Save videos, search links, and more here so you can pick up where you left off.',
}: {
  savedResources?: SavedResource[];
  savedVisualIds?: string[];
  onRemove: (id: string) => void;
  onOpen: (url: string, title: string, kind: BookmarkItem['kind']) => void;
  onAdd?: (item: Omit<BookmarkItem, 'id' | 'date'>) => void;
  subtitle?: string;
  instruction?: string;
}) {
  const {
    filteredItems,
    allItems,
    visibleCount,
    totalCount,
    searchQuery,
    activeCategory,
    sortOrder,
    setSearchQuery,
    setActiveCategory,
    setSortOrder,
    resetFilters,
  } = useBookmarks({ savedResources, savedVisualIds, searchQuery: '', activeCategory: 'all' as const, sortOrder: 'recent' as const });

  // For the "add" flow we could eventually grow an "Add resource" button.
  // The onAdd callback is optional — integrations that don't support a UI
  // add path simply leave it undefined.

  // Empty state helpers
  const noResults =
    totalCount === 0 ||
    (searchQuery.trim() !== '' && filteredItems.length === 0);

  // Categorize for the "collections" view (category counts strip at top)
  const collections = useMemo(() => {
    const map: Record<typeof BOOKMARK_CATEGORIES[number]['value'], { label: string; count: number; icon: React.ReactNode; active: boolean }> = {
      video: { label: 'Videos', count: 0, icon: <Play size={13} />, active: false },
      playlist: { label: 'Playlists', count: 0, icon: <ListMusic size={13} />, active: false },
      search: { label: 'Search links', count: 0, icon: <Search size={13} />, active: false },
      visual: { label: 'Visual Studio', count: 0, icon: <Compass size={13} />, active: false },
      note: { label: 'Notes', count: 0, icon: <BookOpen size={13} />, active: false },
      quiz: { label: 'Quizzes & study materials', count: 0, icon: <Target size={13} />, active: false },
    };
    for (const item of allItems) {
      const cat = item.kind as typeof BOOKMARK_CATEGORIES[number]['value'];
      if (map[cat]) map[cat].count += 1;
    }
    return map;
  }, [allItems]);

  return (
    <section className="bookmarks-page">
      {/* Page heading */}
      <div className="page-heading">
        <span className="eyebrow">{subtitle ? 'SAVED RESOURCES' : 'SAVED RESOURCES'}</span>
        <h1>Saved resources</h1>
        <p>{subtitle}</p>
      </div>

      {instruction && (
        <p className="bookmarks-instruction">{instruction}</p>
      )}

      {/* Toolbar: search + category filters */}
      <BookmarksToolbar
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        totalCount={totalCount}
        visibleCount={visibleCount}
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
        hasFilters={searchQuery.trim().length > 0 || activeCategory !== 'all'}
      />

      {/* Collections strip (category counts) */}
      {totalCount > 0 && (
        <div className="bookmarks-collections">
          {BOOKMARK_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`bookmark-collection-chip ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              <span className="bookmark-collection-icon">{collections[cat.value].icon}</span>
              <span className="bookmark-collection-label">{cat.label}</span>
              <span className="bookmark-collection-count">{collections[cat.value].count}</span>
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {noResults ? (
        <div className="bookmarks-empty">
          {/* Icon */}
          <div className="bookmarks-empty-illustration">
            {activeCategory === 'all' && searchQuery.trim() === '' ? (
              <BookmarkCheck size={36} />
            ) : searchQuery.trim() !== '' ? (
              <Search size={36} />
            ) : (
              <Clock3 size={36} />
            )}
          </div>

          {/* Heading + message */}
          <h3 className="bookmarks-empty-title">
            {activeCategory === 'all' && searchQuery.trim() === '' ? 'Nothing saved yet' : activeCategory === 'all' ? 'Clear your search' : 'No resources here'}
          </h3>
          <p className="bookmarks-empty-text">
            {activeCategory === 'all' && searchQuery.trim() === ''
              ? 'Tap Save on any video or playlist to keep it here for later.'
              : searchQuery.trim() !== '' && activeCategory === 'all'
              ? `Nothing matches “${searchQuery}”. Try a different keyword or clear the search.`
              : `No ${activeCategory === 'all' ? 'saved' : activeCategory} resources match those filters.`}
          </p>

          {/* Actions */}
          {searchQuery.trim() !== '' && activeCategory === 'all' && (
            <button className="btn btn-primary" onClick={resetFilters}>
              <X size={15} /> Clear search
            </button>
          )}
          {activeCategory !== 'all' && (
            <button className="btn btn-soft" onClick={() => setActiveCategory('all')}>
              <Plus size={15} /> View all
            </button>
          )}
        </div>
      ) : (
        <div className="bookmarks-list">
          {filteredItems.map((item) => (
            <BookmarkCard
              key={item.id}
              item={item}
              onOpen={onOpen}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      {/* End-of-list hint */}
      {visibleCount > 0 && (
        <div className="bookmarks-end-info">
          <span>{visibleCount} resource{visibleCount === 1 ? '' : 's'}</span>
          <button className="btn btn-quiet btn-sm" onClick={resetFilters}>
            <X size={13} /> Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

export default BookmarksPage;
