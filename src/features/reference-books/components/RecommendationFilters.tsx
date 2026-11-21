import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import type { BookCategory, Budget, FilterState, Goal } from '../types';
import { BUDGETS, CATEGORIES, GOALS } from '../types';

interface Props {
  filter: FilterState;
  subjects: string[];
  searchQuery: string;
  selectedGoals: Goal[];
  onSubjectChange: (v: string | 'all') => void;
  onCategoryChange: (v: BookCategory | 'all') => void;
  onBudgetChange: (v: Budget) => void;
  onSearchChange: (v: string) => void;
  onToggleGoal: (g: Goal) => void;
  onReset: () => void;
}

export function RecommendationFilters({ filter, subjects, searchQuery, selectedGoals, onSubjectChange, onCategoryChange, onBudgetChange, onSearchChange, onToggleGoal, onReset }: Props) {
  const hasActive = filter.subject !== 'all' || filter.category !== 'all' || filter.budget !== 'none' || searchQuery.length > 0 || selectedGoals.length > 0;
  return (
    <section className="rb-filter-panel" aria-label="Resource filters">
      <div className="rb-filter-heading">
        <div className="rb-filter-heading-copy">
          <span className="rb-kicker">Find your next resource</span>
          <h2>Refine recommendations</h2>
          <p>Filter by subject, type, budget, or goal. Your class and board are already applied above.</p>
        </div>
        <div className="rb-filter-heading-icon" aria-hidden="true"><SlidersHorizontal size={18} /></div>
      </div>

      <div className="rb-filter-grid">
        <label className="rb-field">
          <span className="rb-field-label">Subject</span>
          <select className="rb-control" value={filter.subject} onChange={(e) => onSubjectChange(e.target.value as string | 'all')}>
            <option value="all">All subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="rb-field">
          <span className="rb-field-label">Category</span>
          <select className="rb-control" value={filter.category} onChange={(e) => onCategoryChange(e.target.value as BookCategory | 'all')}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>

        <label className="rb-field">
          <span className="rb-field-label">Budget</span>
          <select className="rb-control" value={filter.budget} onChange={(e) => onBudgetChange(e.target.value as Budget)}>
            {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </label>

        <label className="rb-field rb-field--search">
          <span className="rb-field-label">Search</span>
          <div className="rb-search-wrap">
            <Search size={16} className="rb-search-icon" aria-hidden="true" />
            <input className="rb-search-input" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Book title, author, publisher..." aria-label="Search books, authors or publishers" />
            {searchQuery && <button type="button" className="rb-icon-btn" onClick={() => onSearchChange('')} aria-label="Clear search"><X size={15} /></button>}
          </div>
        </label>
      </div>

      <div className="rb-goal-block">
        <div className="rb-goal-head">
          <span className="rb-field-label">Learning goal</span>
          <span className="rb-goal-help">Pick what you need right now.</span>
        </div>
        <div className="rb-goal-pills" role="group" aria-label="Learning goals">
          {GOALS.map((g) => {
            const active = selectedGoals.includes(g.value);
            return (
              <button key={g.value} type="button" className={`rb-goal-pill ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => onToggleGoal(g.value)}>
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasActive && (
        <div className="rb-active-filters" aria-label="Active filters">
          <span className="rb-active-label">Active</span>
          <div className="rb-pill-list">
            {filter.subject !== 'all' && <button type="button" className="rb-active-chip" onClick={() => onSubjectChange('all')}>{filter.subject} <X size={13} /></button>}
            {filter.category !== 'all' && <button type="button" className="rb-active-chip" onClick={() => onCategoryChange('all')}>{CATEGORIES.find((c) => c.value === filter.category)?.label} <X size={13} /></button>}
            {filter.budget !== 'none' && <button type="button" className="rb-active-chip" onClick={() => onBudgetChange('none')}>{BUDGETS.find((b) => b.value === filter.budget)?.label} <X size={13} /></button>}
            {selectedGoals.map((g) => <button key={g} type="button" className="rb-active-chip" onClick={() => onToggleGoal(g)}>{GOALS.find((x) => x.value === g)?.label} <X size={13} /></button>)}
            {searchQuery && <button type="button" className="rb-active-chip" onClick={() => onSearchChange('')}>"{searchQuery}" <X size={13} /></button>}
          </div>
          <button type="button" className="rb-reset-btn" onClick={onReset}><RotateCcw size={14} /> Reset</button>
        </div>
      )}
    </section>
  );
}
