import React from 'react';
import { Search, X, BookmarkCheck, RotateCcw } from 'lucide-react';
import { SubjectId, GradeLevel } from '../types';
import { SUBJECTS_META, GRADE_LEVELS } from '../data';

interface FormulaFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSubject: SubjectId | 'all';
  onSubjectChange: (s: SubjectId | 'all') => void;
  selectedGrade: GradeLevel | 'all';
  onGradeChange: (g: GradeLevel | 'all') => void;
  selectedCategory: string | 'all';
  onCategoryChange: (c: string | 'all') => void;
  categories: string[];
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  favoritesCount: number;
  totalFilteredCount: number;
  totalFormulasCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export function FormulaFilters({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedGrade,
  onGradeChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
  totalFilteredCount,
  totalFormulasCount,
  onResetFilters,
  isFiltered
}: FormulaFiltersProps) {
  return (
    <div className="formula-filters-container">
      {/* Top Search & Primary Filters Bar */}
      <div className="formula-search-bar-row">
        <div className="formula-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="formula-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search formulas (e.g. quadratic, v = u + at, mole, snell, kinetic)..."
            aria-label="Search formulas"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Grade / Class Selector */}
        <div className="formula-grade-selector">
          <label htmlFor="formula-grade-select" className="grade-selector-label">Class:</label>
          <select
            id="formula-grade-select"
            className="formula-select-dropdown"
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value as GradeLevel | 'all')}
          >
            <option value="all">All Classes (9–12)</option>
            {GRADE_LEVELS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Pinned Favorites Toggle Button */}
        <button
          type="button"
          className={`formula-filter-pill-btn ${onlyFavorites ? 'active' : ''}`}
          onClick={onToggleOnlyFavorites}
          title="Show only your pinned formulas"
          aria-pressed={onlyFavorites}
        >
          <BookmarkCheck size={16} />
          <span>Pinned</span>
          <span className="pill-count">{favoritesCount}</span>
        </button>

        {/* Reset button when active */}
        {isFiltered && (
          <button
            type="button"
            className="formula-reset-filters-btn"
            onClick={onResetFilters}
            title="Reset all filters to defaults"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Subject Filter Tabs */}
      <div className="formula-subjects-row" role="tablist" aria-label="Subjects">
        <button
          type="button"
          role="tab"
          aria-selected={selectedSubject === 'all'}
          className={`subject-tab-btn ${selectedSubject === 'all' ? 'active' : ''}`}
          onClick={() => {
            onSubjectChange('all');
            onCategoryChange('all');
          }}
        >
          <span className="subject-tab-icon">✦</span>
          <span>All Subjects</span>
          <span className="subject-tab-count">{totalFormulasCount}</span>
        </button>

        {SUBJECTS_META.map(sub => (
          <button
            key={sub.id}
            type="button"
            role="tab"
            aria-selected={selectedSubject === sub.id}
            className={`subject-tab-btn tab-${sub.id} ${selectedSubject === sub.id ? 'active' : ''}`}
            onClick={() => {
              onSubjectChange(sub.id);
              onCategoryChange('all');
            }}
          >
            <span className="subject-tab-icon">{sub.icon}</span>
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      {/* Category / Topic Chips */}
      {categories.length > 1 && (
        <div className="formula-categories-scroll">
          <span className="categories-label">Topics:</span>
          <div className="formula-category-chips">
            <button
              type="button"
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => onCategoryChange('all')}
            >
              All Topics
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Active Results Summary */}
      <div className="formula-results-summary">
        <span>
          Showing <strong>{totalFilteredCount}</strong> {totalFilteredCount === 1 ? 'formula' : 'formulas'}
          {selectedSubject !== 'all' && ` in ${selectedSubject}`}
          {selectedGrade !== 'all' && ` for ${selectedGrade}`}
          {selectedCategory !== 'all' && ` · ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
          {onlyFavorites && ' (Pinned)'}
        </span>
      </div>
    </div>
  );
}
