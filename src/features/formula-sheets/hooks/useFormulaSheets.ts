import { useState, useMemo, useEffect, useCallback } from 'react';
import { Formula, SubjectId, GradeLevel } from '../types';
import { ALL_FORMULAS, getCategoriesForSubject } from '../data';

const FAVORITES_STORAGE_KEY = 'edubuddy_formula_favorites_v1';

export function useFormulaSheets(initialGrade?: GradeLevel, initialSubject?: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>(
    (initialSubject?.toLowerCase() as SubjectId) || 'all'
  );
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>(
    initialGrade || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeFormulaId, setActiveFormulaId] = useState<string | null>(null);

  // Isolated feature-level persistence for pinned favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage unavailable or full
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  // Dynamically compute available categories for selected subject
  const availableCategories = useMemo(() => {
    return getCategoriesForSubject(selectedSubject);
  }, [selectedSubject]);

  // Main filter engine
  const filteredFormulas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ALL_FORMULAS.filter(formula => {
      // Subject filter
      if (selectedSubject !== 'all' && formula.subject !== selectedSubject) {
        return false;
      }

      // Grade filter
      if (selectedGrade !== 'all' && !formula.grades.includes(selectedGrade)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && formula.category !== selectedCategory) {
        return false;
      }

      // Only favorites filter
      if (onlyFavorites && !favorites.includes(formula.id)) {
        return false;
      }

      // Search query filter
      if (q) {
        const matchesTitle = formula.title.toLowerCase().includes(q);
        const matchesChapter = formula.chapter.toLowerCase().includes(q);
        const matchesCategory = formula.category.toLowerCase().includes(q);
        const matchesExpression = (
          formula.expression.text.toLowerCase().includes(q) ||
          formula.expression.latex.toLowerCase().includes(q)
        );
        const matchesKeywords = formula.keywords.some(k => k.toLowerCase().includes(q));
        const matchesVariables = formula.variables.some(v =>
          v.name.toLowerCase().includes(q) ||
          v.symbol.toLowerCase().includes(q) ||
          (v.unit && v.unit.toLowerCase().includes(q))
        );

        if (!matchesTitle && !matchesChapter && !matchesCategory && !matchesExpression && !matchesKeywords && !matchesVariables) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedSubject, selectedGrade, selectedCategory, onlyFavorites, favorites]);

  const activeFormula = useMemo(() => {
    if (!activeFormulaId) return null;
    return ALL_FORMULAS.find(f => f.id === activeFormulaId) || null;
  }, [activeFormulaId]);

  const isFiltered = useMemo(() => {
    return Boolean(
      searchQuery.trim() ||
      selectedSubject !== 'all' ||
      selectedGrade !== 'all' ||
      selectedCategory !== 'all' ||
      onlyFavorites
    );
  }, [searchQuery, selectedSubject, selectedGrade, selectedCategory, onlyFavorites]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedGrade('all');
    setSelectedCategory('all');
    setOnlyFavorites(false);
  }, []);

  return {
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
    activeFormulaId,
    setActiveFormulaId,
    activeFormula,
    favorites,
    toggleFavorite,
    isFavorite,
    availableCategories,
    filteredFormulas,
    totalFormulasCount: ALL_FORMULAS.length,
    isFiltered,
    resetFilters
  };
}
