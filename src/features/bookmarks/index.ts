/**
 * Bookmarks feature — public module export.
 *
 * Self-contained, styled, TypeScript-clean Saved Resources / Bookmarks
 * component for EduBuddy.
 *
 * What this module ships (all under src/features/bookmarks/):
 *   - types.ts                    Canonical types + category enum + sort order
 *   - useBookmarks.ts             Hook deriving filtered/sorted rows from props
 *   - BookmarkCard.tsx            Singular card: thumbnail, title, meta, actions
 *   - BookmarksToolbar.tsx        Search + category filter pills
 *   - BookmarksPage.tsx           Page shell: heading, toolbar, collections strip,
 *                                  empty state, card grid, end-of-list hint
 *   - BookmarksPage.css           Design-system-consistent styles (responsive,
 *                                  dark mode, mobile breakpoints)
 *   - index.ts                    Documented barrel export (below)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CONNECTION INSTRUCTIONS (for the integration agent)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This component NEVER touches the global Store or localStorage directly. It
 * consumes the existing saved-resource data through props, and it reuses the
 * existing `SavedResource` type from `src/videoRank.ts` so there is no new
 * storage schema and no duplicate save logic.
 *
 * 1. Import  : `import { BookmarksPage } from './features/bookmarks';`
 *
 * 2. Pass in (all from the existing store):
 *     - savedResources:  The existing `store.savedResources` array.
 *                        Its shape is the existing `SavedResource` union — no
 *                        conversion needed: the component maps it 1:1 to
 *                        internal `BookmarkItem` rows.
 *     - savedVisualIds:  The existing `store.savedVisuals` array (IDs of Visual
 *                        Studio experiences the learner bookmarked). Each ID is
 *                        rendered as a category-3 bookmark card.
 *     - onRemove:        The existing `removeResource` callback. Wire it:
 *                           onRemove={removeResource}
 *     - onOpen:          A no-op to start; wire to your router/open-layer:
 *                           (url, title, kind) => window.open(url, '_blank')
 *     - onAdd:           Optional. If your integration supports a UI "Add
 *                        resource" control, wire it to the store's
 *                        `saveResource` logic (see src/App.tsx line ~312).
 *
 * 3. The component exposes:
 *     - Search across title / topic / subject / grade
 *     - Category filter pills: All, Videos, Playlists, Search links, Visual
 *       Studio, Notes, Quizzes & study materials
 *     - Sort: Recent | Title A-Z | Topic A-Z
 *     - Empty states (nothing saved, no results for a query, no results for a
 *       category filter)
 *     - Responsive grid (3-column desktop, single column mobile)
 *     - Dark mode (follows the `html[data-theme="dark"]` contract)
 *
 * 4. What is deliberately NOT included (to keep this isolated and reviewable):
 *     - No localStorage reads / writes (delegated to the integration agent)
 *     - No global `Store` mutation (all state flows through props + callbacks)
 *     - No new dependencies (only existing: lucide-react, react)
 *     - No edits to src/App.tsx, src/styles.css, or server.ts
 *
 * 5. Validation:
 *     - Run `npm run typecheck` (tsc --noEmit) - all types compile clean.
 *     - The exported `BookmarksPage` function is the integration entry point.
 */

// - Components - ---------------------------------------------------------
export { BookmarksPage } from './BookmarksPage';
export { useBookmarks } from './useBookmarks';
export { default as BookmarkCard } from './BookmarkCard';
export { default as BookmarksToolbar } from './BookmarksToolbar';

// - Types (canonical, consumed by the components) - -----------------------
export {
  BOOKMARK_CATEGORIES,
  type BookmarkCategory,
  type BookmarkItem,
  type BookmarkRow,
  type SortOrder,
} from './types';

// - Re-export existing videoRank helpers for convenience - ----------------
export {
  fmtDate,
  fmtViews,
  fmtDuration,
  type VideoItem,
  type RankedVideo,
  type SavedResource,
  type PlaylistItem,
} from '../../videoRank';
