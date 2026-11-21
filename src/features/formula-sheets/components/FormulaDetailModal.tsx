import React, { useEffect, useRef } from 'react';
import { X, Bookmark, BookmarkCheck, BookOpen, CheckCircle, Info, Target, Layers, ArrowRight, Lightbulb } from 'lucide-react';
import { Formula } from '../types';
import { MathRenderer } from './MathRenderer';

interface FormulaDetailModalProps {
  formula: Formula | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectRelatedFormula?: (formulaId: string) => void;
  onNavigateTopic?: (topic: string, subject?: string) => void;
  onNavigateQuiz?: (topic: string) => void;
}

export function FormulaDetailModal({
  formula,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectRelatedFormula,
  onNavigateTopic,
  onNavigateQuiz
}: FormulaDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (formula) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formula, onClose]);

  if (!formula) return null;

  return (
    <div className="formula-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="formula-modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="formula-modal-header">
          <div className="modal-header-meta">
            <span className={`formula-subject-badge badge-${formula.subject}`}>
              {formula.subject.toUpperCase()}
            </span>
            <span className="formula-chapter-badge">
              <BookOpen size={12} />
              <span>{formula.chapter}</span>
            </span>
            <span className="formula-category-pill">{formula.category}</span>
          </div>

          <div className="modal-header-actions">
            <button
              type="button"
              className={`modal-favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={(e) => onToggleFavorite(formula.id, e)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span>{isFavorite ? 'Pinned' : 'Pin'}</span>
            </button>

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close formula details"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="formula-modal-body">
          <div className="formula-title-section">
            <h2 className="modal-formula-title">{formula.title}</h2>
            <div className="modal-grades-row">
              <span className="grades-label">Applicable to:</span>
              {formula.grades.map(g => (
                <span key={g} className="grade-tag">{g}</span>
              ))}
            </div>
          </div>

          {/* Large Hero Math Expression Box */}
          <div className="modal-math-hero">
            <div className="math-hero-header">
              <span className="math-hero-badge">MATHEMATICAL FORMULA</span>
            </div>
            <MathRenderer
              expression={formula.expression}
              size="large"
              allowCopy={true}
              showToggle={true}
            />
          </div>

          {/* Explanation & Conceptual Meaning */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <Info size={16} />
              <span>Conceptual Overview</span>
            </h3>
            <p className="modal-explanation-text">{formula.explanation}</p>

            {formula.conditions && (
              <div className="modal-conditions-alert">
                <CheckCircle size={15} />
                <div>
                  <strong>Conditions & Assumptions:</strong>
                  <span>{formula.conditions}</span>
                </div>
              </div>
            )}
          </div>

          {/* Variable Breakdown Table */}
          {formula.variables && formula.variables.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <Layers size={16} />
                <span>Variables & Units</span>
              </h3>
              <div className="variables-table-wrap">
                <table className="variables-table">
                  <thead>
                    <tr>
                      <th style={{ width: '18%' }}>Symbol</th>
                      <th style={{ width: '32%' }}>Variable Name</th>
                      <th style={{ width: '20%' }}>Unit (SI)</th>
                      <th style={{ width: '30%' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formula.variables.map((v) => (
                      <tr key={v.symbol}>
                        <td className="var-symbol-cell">
                          <code>{v.symbol}</code>
                        </td>
                        <td className="var-name-cell">
                          <strong>{v.name}</strong>
                        </td>
                        <td className="var-unit-cell">
                          {v.unit ? <span className="unit-badge">{v.unit}</span> : <span className="text-muted">—</span>}
                        </td>
                        <td className="var-desc-cell">{v.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Practical Worked Example */}
          {formula.example && (
            <div className="modal-section example-section">
              <h3 className="modal-section-title">
                <Lightbulb size={16} />
                <span>Worked Curriculum Example</span>
              </h3>
              <div className="example-card">
                <div className="example-problem">
                  <strong>Problem:</strong>
                  <p>{formula.example.problem}</p>
                </div>

                {formula.example.given && Object.keys(formula.example.given).length > 0 && (
                  <div className="example-given">
                    <span className="given-label">Given:</span>
                    <div className="given-items">
                      {Object.entries(formula.example.given).map(([k, val]) => (
                        <span key={k} className="given-tag">
                          <code>{k}</code> = {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="example-steps">
                  <span className="steps-label">Step-by-Step Solution:</span>
                  <ol className="steps-list">
                    {formula.example.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ol>
                </div>

                <div className="example-result">
                  <span className="result-label">Calculated Answer:</span>
                  <strong className="result-value">{formula.example.result}</strong>
                </div>

                {formula.example.note && (
                  <p className="example-note">
                    <strong>Note:</strong> {formula.example.note}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Related Formulas */}
          {formula.relatedFormulaIds && formula.relatedFormulaIds.length > 0 && onSelectRelatedFormula && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <BookOpen size={16} />
                <span>Related Formulas</span>
              </h3>
              <div className="related-formulas-chips">
                {formula.relatedFormulaIds.map(relId => (
                  <button
                    key={relId}
                    type="button"
                    className="related-formula-btn"
                    onClick={() => onSelectRelatedFormula(relId)}
                  >
                    <span>Jump to related formula</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Hand-off */}
        <div className="formula-modal-footer">
          <div className="modal-footer-left">
            {onNavigateTopic && (
              <button
                type="button"
                className="btn-modal-action btn-soft"
                onClick={() => {
                  onClose();
                  onNavigateTopic(formula.chapter, formula.subject);
                }}
              >
                <Layers size={15} />
                <span>Study {formula.chapter}</span>
              </button>
            )}

            {onNavigateQuiz && (
              <button
                type="button"
                className="btn-modal-action btn-soft"
                onClick={() => {
                  onClose();
                  onNavigateQuiz(formula.chapter);
                }}
              >
                <Target size={15} />
                <span>Practice Questions</span>
              </button>
            )}
          </div>

          <button type="button" className="btn-modal-action btn-primary" onClick={onClose}>
            Done Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
