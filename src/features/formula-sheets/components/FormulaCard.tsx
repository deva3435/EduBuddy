import React from 'react';
import { Bookmark, BookmarkCheck, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Formula } from '../types';
import { MathRenderer } from './MathRenderer';

interface FormulaCardProps {
  formula: Formula;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (formula: Formula) => void;
  onNavigateTopic?: (topic: string, subject?: string) => void;
}

export function FormulaCard({
  formula,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onNavigateTopic
}: FormulaCardProps) {
  const subjectClass = `subject-${formula.subject}`;

  return (
    <article
      className={`formula-card ${subjectClass} ${isFavorite ? 'is-favorite' : ''}`}
      onClick={() => onSelect(formula)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(formula);
        }
      }}
      aria-label={`View formula details for ${formula.title}`}
    >
      <div className="formula-card-header">
        <div className="formula-card-badges">
          <span className={`formula-subject-badge badge-${formula.subject}`}>
            {formula.subject.charAt(0).toUpperCase() + formula.subject.slice(1)}
          </span>
          <span className="formula-chapter-badge" title={formula.chapter}>
            <BookOpen size={11} />
            <span>{formula.chapter}</span>
          </span>
        </div>

        <button
          type="button"
          className={`formula-favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => onToggleFavorite(formula.id, e)}
          title={isFavorite ? 'Remove from pinned formulas' : 'Pin to favorites'}
          aria-label={isFavorite ? 'Remove from pinned' : 'Pin to favorites'}
        >
          {isFavorite ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <div className="formula-card-body">
        <h3 className="formula-card-title">{formula.title}</h3>
        <p className="formula-card-explanation">{formula.explanation}</p>

        <div className="formula-math-preview">
          <MathRenderer expression={formula.expression} size="medium" allowCopy={true} />
        </div>

        {formula.variables && formula.variables.length > 0 && (
          <div className="formula-card-variables">
            <span className="variables-label">Variables:</span>
            <div className="variables-chips">
              {formula.variables.slice(0, 4).map((v) => (
                <span key={v.symbol} className="var-chip" title={`${v.name}${v.unit ? ` (${v.unit})` : ''}`}>
                  <strong>{v.symbol}</strong>
                  <span className="var-name">{v.name}</span>
                </span>
              ))}
              {formula.variables.length > 4 && (
                <span className="var-more-chip" title={`${formula.variables.length - 4} more variables`}>
                  +{formula.variables.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="formula-card-footer">
        <div className="formula-grades-list">
          {formula.grades.map(g => (
            <span key={g} className="grade-tag">{g}</span>
          ))}
        </div>

        <div className="formula-card-actions">
          {onNavigateTopic && (
            <button
              type="button"
              className="card-action-subtle"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateTopic(formula.chapter, formula.subject);
              }}
              title={`Study ${formula.chapter} in Learn mode`}
            >
              <Layers size={12} />
              <span>Study</span>
            </button>
          )}

          <span className="view-details-indicator">
            <span>Details</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}
