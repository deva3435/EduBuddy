import React from 'react';
import { Sparkles, BookmarkCheck, BookOpen, Layers } from 'lucide-react';
import { FormulaSheetsProps, Formula } from './types';
import { useFormulaSheets } from './hooks/useFormulaSheets';
import { FormulaFilters } from './components/FormulaFilters';
import { FormulaCard } from './components/FormulaCard';
import { FormulaDetailModal } from './components/FormulaDetailModal';
import { EmptyState } from './components/EmptyState';
import './FormulaSheets.css';

/**
 * FormulaSheetsPage — Self-contained, curriculum-aligned Formula Reference Library for EduBuddy.
 *
 * Implements Feature 09:
 * - Structured, searchable formula database for Mathematics, Physics, and Chemistry.
 * - Scalable data architecture organized by Class, Subject, Chapter, and Category.
 * - Accessible mathematical typography with LaTeX and plain-text copy support.
 * - Comprehensive detail modal with variable units table, assumptions, and step-by-step worked examples.
 * - Isolated localStorage favorites persistence (zero modification to global Store).
 * - Fully responsive with dark mode support.
 */
export function FormulaSheetsPage({
  initialGrade,
  initialSubject,
  onNavigateTopic,
  onNavigateQuiz,
  title = 'Formula Sheets & Reference Library',
  subtitle = 'Master key formulas across Mathematics, Physics, and Chemistry with variable definitions, units, and worked curriculum examples.'
}: FormulaSheetsProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedGrade,
    setSelectedGrade,
    selectedCategory,
    setSelectedCategory,
    onlyFavorites,
    setOnlyFavorites,
    activeFormula,
    setActiveFormulaId,
    favorites,
    toggleFavorite,
    isFavorite,
    availableCategories,
    filteredFormulas,
    totalFormulasCount,
    isFiltered,
    resetFilters
  } = useFormulaSheets(initialGrade, initialSubject);

  return (
    <div className="formula-sheets-page">
      {/* Top Header Section */}
      <header className="formula-sheets-header">
        <div className="formula-header-text">
          <span className="eyebrow">
            <Sparkles size={14} />
            <span>EXAM REVISION READY · CLASSES 9–12</span>
          </span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="formula-header-stats-badge">
          <div className="stat-pill">
            <strong>{totalFormulasCount}</strong>
            <span>Formulas</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <strong>{favorites.length}</strong>
            <span>Pinned</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <strong>3</strong>
            <span>Subjects</span>
          </div>
        </div>
      </header>

      {/* Interactive Filters & Search Toolbar */}
      <FormulaFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={availableCategories}
        onlyFavorites={onlyFavorites}
        onToggleOnlyFavorites={() => setOnlyFavorites(v => !v)}
        favoritesCount={favorites.length}
        totalFilteredCount={filteredFormulas.length}
        totalFormulasCount={totalFormulasCount}
        onResetFilters={resetFilters}
        isFiltered={isFiltered}
      />

      {/* Formulas Content Grid or Empty State */}
      {filteredFormulas.length > 0 ? (
        <section className="formulas-cards-grid" aria-label="Formula library list">
          {filteredFormulas.map((formula) => (
            <FormulaCard
              key={formula.id}
              formula={formula}
              isFavorite={isFavorite(formula.id)}
              onToggleFavorite={toggleFavorite}
              onSelect={(f: Formula) => setActiveFormulaId(f.id)}
              onNavigateTopic={onNavigateTopic}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          searchQuery={searchQuery}
          onlyFavorites={onlyFavorites}
          onReset={resetFilters}
          onSuggestionClick={(q) => {
            resetFilters();
            setSearchQuery(q);
          }}
        />
      )}

      {/* Formula Detail Modal / Deep Dive View */}
      {activeFormula && (
        <FormulaDetailModal
          formula={activeFormula}
          onClose={() => setActiveFormulaId(null)}
          isFavorite={isFavorite(activeFormula.id)}
          onToggleFavorite={toggleFavorite}
          onSelectRelatedFormula={(id) => setActiveFormulaId(id)}
          onNavigateTopic={onNavigateTopic}
          onNavigateQuiz={onNavigateQuiz}
        />
      )}
    </div>
  );
}

export default FormulaSheetsPage;
