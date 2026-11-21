import { type BookmarkCategory, BOOKMARK_CATEGORIES } from './types';

/**
 * BookmarksToolbar — search input + category filter pills.
 *
 * The "All" pill is a triggered state: when the user clicks it, we clear the
 * current category so the full unfiltered list is shown (rather than the
 * "collections" use of `all`). This keeps the UX consistent with the
 * "nothing selected = everything visible" mental model.
 */
export function BookmarksToolbar({
  searchQuery,
  activeCategory,
  totalCount,
  visibleCount,
  onSearchChange,
  onCategoryChange,
  hasFilters,
}: {
  searchQuery: string;
  activeCategory: BookmarkCategory;
  totalCount: number;
  visibleCount: number;
  onSearchChange: (q: string) => void;
  onCategoryChange: (c: BookmarkCategory) => void;
  hasFilters: boolean;
}) {
  return (
    <div className="bookmarks-toolbar">
      <div className="bookmark-search-wrap">
        <span className="bookmark-search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="bookmark-search-input"
          type="search"
          placeholder="Search saved videos, notes, quizzes…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search saved resources"
        />
        {searchQuery && (
          <button
            className="bookmark-search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="bookmark-filter-options">
        <div className="bookmark-filter-pills">
          {BOOKMARK_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`bookmark-filter-pill ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.value)}
              title={`Filter: ${cat.label}`}
            >
              {activeCategory === cat.value ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{cat.label}</span>
                  <span className="bookmark-filter-count">{visibleCount}</span>
                </>
              ) : (
                <>
                  <span>{cat.label}</span>
                  <span className="bookmark-filter-count">{totalCount}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button className="bookmark-reset-btn" onClick={() => onCategoryChange('all')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset filters
          </button>
        )}
      </div>

      <div className="bookmark-toolbar-stats">
        <span>
          <strong className="bookmark-stat-main">{visibleCount}</strong>
          <span className="bookmark-stat-soft">{visibleCount === 1 ? 'item' : 'items'} saved</span>
        </span>
        {visibleCount < totalCount && (
          <span className="bookmark-stat-soft">{totalCount - visibleCount} more hidden by filters</span>
        )}
      </div>
    </div>
  );
}

export default BookmarksToolbar;
