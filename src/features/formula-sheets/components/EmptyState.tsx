import React from 'react';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  onlyFavorites?: boolean;
  onReset: () => void;
  onSuggestionClick: (query: string) => void;
}

export function EmptyState({
  searchQuery,
  onlyFavorites,
  onReset,
  onSuggestionClick
}: EmptyStateProps) {
  const suggestions = ['Quadratic', 'Newton', 'Mole', 'Ohm', 'Kinematics', 'Optics', 'Gas equation'];

  return (
    <div className="formula-empty-state">
      <div className="empty-icon-bubble">
        <SearchX size={34} />
      </div>

      <h3 className="empty-title">
        {onlyFavorites
          ? 'No pinned formulas yet'
          : searchQuery
            ? `No formulas matching "${searchQuery}"`
            : 'No formulas match the current filters'}
      </h3>

      <p className="empty-description">
        {onlyFavorites
          ? 'Tap the bookmark icon on any formula card to pin it here for rapid revision before tests.'
          : 'Try searching with a broader topic name, formula keyword, or clearing the active filters.'}
      </p>

      {!onlyFavorites && (
        <div className="empty-suggestions-row">
          <span className="suggestions-prefix">
            <Sparkles size={13} />
            <span>Popular searches:</span>
          </span>
          <div className="suggestions-chips">
            {suggestions.map(s => (
              <button
                key={s}
                type="button"
                className="suggestion-chip"
                onClick={() => onSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="empty-action-row">
        <button type="button" className="btn-empty-reset" onClick={onReset}>
          <RotateCcw size={15} />
          <span>{onlyFavorites ? 'View All Formulas' : 'Reset All Filters'}</span>
        </button>
      </div>
    </div>
  );
}
