import { useMemo, useState, useCallback } from 'react';
import type {
  BookRecommendation,
  FilterState,
  QuestionBank,
  ClassGrade,
  Board,
  Budget,
  FreeResource,
} from '../types';
import { defaultFilterState } from '../types';
import { BOOK_RECOMMENDATIONS } from '../data/recommendations';
import { QUESTION_BANKS } from '../data/questionBanks';
import { FREE_RESOURCES } from '../data/freeResources';
import { SUBJECTS, SUBJECTS_BY_CLASS } from '../types';

export type FreeResourceType = FreeResource;


export function useReferenceBooks(initialFilter: Partial<FilterState> = {}) {
  const [filter, setFilter] = useState<FilterState>({ ...defaultFilterState, ...initialFilter });
  const [savedView, setSavedView] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filter.search);

  const setFilterField = useCallback((key: keyof FilterState, value: string | Budget) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilter(defaultFilterState);
    setSearchQuery('');
  }, []);

  const setSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setFilter((prev) => ({ ...prev, search: value }));
  }, []);

  const matches = useCallback(
    (item: { classes: readonly string[] | string[]; boards: readonly string[] | string[]; subject: string | null; title: string; author?: string; publisher?: string; description?: string }) => {
      const { class: cls, board, subject, search } = filter;
      const q = (search || '').toLowerCase();
      const haystack = [
        item.title,
        item.author || '',
        item.publisher || '',
        item.description || '',
        item.subject || '',
      ].join(' ').toLowerCase();

      if (cls !== 'all' && !item.classes.includes(cls)) return false;
      if (board !== 'all' && !item.boards.includes(board)) return false;
      if (subject !== 'all') {
        const s = item.subject || '';
        if (s === 'All' || s === 'Science/Mathematics') {
          if (s === 'Science/Mathematics' && !['Science','Mathematics','Physics','Chemistry','Biology'].includes(subject)) return false;
        } else if (s !== subject) return false;
      }
      if (q && !haystack.includes(q)) return false;
      return true;
    },
    [filter]
  );

  const books = useMemo(() => BOOK_RECOMMENDATIONS.filter(matches), [matches]);
  const questionBanks = useMemo(() => QUESTION_BANKS.filter(matches), [matches]);
  const freeResources = useMemo(() => FREE_RESOURCES.filter(matches), [matches]);

  const subjectsForClass = (cls: ClassGrade | 'all') => {
    if (cls === 'all') return SUBJECTS;
    return SUBJECTS_BY_CLASS[cls] || SUBJECTS;
  };

  const budgetLabel = (value: Budget) => {
    const map: Record<Budget, string> = {
      free: 'Free resources only',
      low: 'Low budget',
      moderate: 'Moderate budget',
      none: 'No budget preference',
    };
    return map[value];
  };

  return {
    filter,
    setFilterField,
    resetFilters,
    setSearch,
    searchQuery,
    savedView,
    setSavedView,
    books,
    questionBanks,
    freeResources,
    subjectsForClass,
    budgetLabel,
  };
}
