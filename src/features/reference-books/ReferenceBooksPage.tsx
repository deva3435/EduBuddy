import { BookOpen, Bookmark, GraduationCap, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import './reference-books.css';
import { BookCard, QuestionBankCard } from './components/BookCard';
import { EmptyState, SearchEmptyState } from './components/EmptyState';
import { FreeResources } from './components/FreeResources';
import { RecommendationFilters } from './components/RecommendationFilters';
import { SavedBooks } from './components/SavedBooks';
import { useReferenceBooks } from './hooks/useReferenceBooks';
import { loadSavedBooks, removeBook, saveBook } from './storage';
import type { Board, BookRecommendation, ClassGrade, Goal, QuestionBank } from './types';
import { ALL_CLASSES, BOARDS } from './types';

interface ReferenceBooksPageProps {
  initialGrade?: ClassGrade;
  initialBoard?: Board;
  initialSubject?: string;
}

const GOAL_MATCH: Record<Goal, string[]> = {
  concept: ['concept', 'textbook', 'foundation', 'theory', 'understand'],
  practice: ['practice', 'problem', 'exercise', 'worksheet', 'daily'],
  exam: ['exam', 'board', 'sample', 'previous year', 'revision'],
  questionBank: ['question bank', 'question', 'mcq', 'pyq', 'chapterwise'],
  olympiad: ['olympiad', 'ntse', 'competitive foundation'],
  competitive: ['jee', 'neet', 'competitive', 'advanced'],
  comprehensive: ['comprehensive', 'all-in-one', 'complete', 'detailed'],
};

function matchesGoals(item: { title: string; description: string; whyRecommended?: string; category?: string; type?: string }, goals: Goal[]) {
  if (goals.length === 0) return true;
  const hay = `${item.title} ${item.description} ${item.whyRecommended || ''} ${item.category || ''} ${item.type || ''}`.toLowerCase();
  return goals.some((g) => GOAL_MATCH[g].some((k) => hay.includes(k)));
}

export function ReferenceBooksPage({ initialGrade, initialBoard, initialSubject }: ReferenceBooksPageProps = {}) {
  const initialFilter = { ...(initialGrade ? { class: initialGrade } : {}), ...(initialBoard ? { board: initialBoard } : {}), ...(initialSubject ? { subject: initialSubject } : {}) };
  const { filter, setFilterField, resetFilters, setSearch, searchQuery, books, questionBanks, freeResources, subjectsForClass } = useReferenceBooks(initialFilter);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(loadSavedBooks().map((i) => i.id)));
  const [savedView, setSavedView] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);

  const subjects = subjectsForClass(filter.class);
  const refreshSaved = () => setSavedIds(new Set(loadSavedBooks().map((i) => i.id)));
  const toggleSaved = (id: string, type: 'book' | 'questionBank') => {
    if (savedIds.has(id)) removeBook(id, type); else saveBook(id, type);
    refreshSaved();
  };

  const filteredBooks = useMemo(() => books.filter((b) => matchesGoals(b, selectedGoals)), [books, selectedGoals]);
  const filteredBanks = useMemo(() => questionBanks.filter((b) => matchesGoals(b, selectedGoals)), [questionBanks, selectedGoals]);
  const showBooks = filter.category === 'all' || ['textbook', 'concept', 'practice'].includes(filter.category);
  const showQBanks = filter.category === 'all' || ['questionBank', 'examPrep'].includes(filter.category);
  const visibleBooks = showBooks ? filteredBooks : [];
  const visibleBanks = showQBanks ? filteredBanks : [];
  const total = visibleBooks.length + visibleBanks.length;
  const hasFilters = filter.subject !== 'all' || filter.category !== 'all' || filter.budget !== 'none' || searchQuery.length > 0 || selectedGoals.length > 0;

  const resetAll = () => { resetFilters(); setSelectedGoals([]); };
  const toggleGoal = (goal: Goal) => setSelectedGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);

  return (
    <section className="rb-page" aria-label="Reference Books and Question Banks">
      <header className="rb-hero">
        <div className="rb-hero-main">
          <div className="rb-hero-icon" aria-hidden="true"><BookOpen size={24} /></div>
          <div>
            <span className="rb-kicker">Student library</span>
            <h1>Reference Books &amp; Question Banks</h1>
            <p>Curated recommendations for your class, board, subject, and goal ? so you can pick the right book without buying unnecessary extras.</p>
          </div>
        </div>
        <div className="rb-context" aria-label="Student context">
          <div className="rb-context-title"><GraduationCap size={16} /> <span>Study context</span></div>
          <div className="rb-context-fields">
            <label className="rb-field rb-field--compact">
              <span className="rb-field-label">Class</span>
              <select className="rb-control" value={filter.class} onChange={(e) => setFilterField('class', e.target.value as ClassGrade | 'all')} aria-label="Select class">
                <option value="all">All classes</option>
                {ALL_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="rb-field rb-field--compact">
              <span className="rb-field-label">Board</span>
              <select className="rb-control" value={filter.board} onChange={(e) => setFilterField('board', e.target.value as Board | 'all')} aria-label="Select board">
                <option value="all">All boards</option>
                {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
          </div>
        </div>
      </header>

      <RecommendationFilters
        filter={filter}
        subjects={subjects}
        searchQuery={searchQuery}
        selectedGoals={selectedGoals}
        onSubjectChange={(v) => setFilterField('subject', v)}
        onCategoryChange={(v) => setFilterField('category', v)}
        onBudgetChange={(v) => setFilterField('budget', v)}
        onSearchChange={setSearch}
        onToggleGoal={toggleGoal}
        onReset={resetAll}
      />

      <div className="rb-results-bar">
        <div className="rb-results-summary">
          <strong>{total} resource{total === 1 ? '' : 's'}</strong>
          <span>{hasFilters ? 'Filtered recommendations' : 'Recommended for your context'}</span>
        </div>
        <div className="rb-results-actions">
          {hasFilters && <button type="button" className="rb-reset-btn" onClick={resetAll}><RotateCcw size={14} /> Reset filters</button>}
          <button type="button" className={`rb-saved-toggle ${savedView ? 'is-active' : ''}`} onClick={() => setSavedView((v) => !v)} aria-pressed={savedView}>
            <Bookmark size={15} /> Saved <span className="rb-badge">{savedIds.size}</span>
          </button>
        </div>
      </div>

      {savedView ? (
        <SavedBooks onClose={() => setSavedView(false)} onChange={refreshSaved} />
      ) : (
        <>
          {total === 0 ? <SearchEmptyState /> : (
            <div className="rb-grid" aria-label="Recommended resources">
              {visibleBooks.map((book: BookRecommendation) => <BookCard key={book.id} book={book} saved={savedIds.has(book.id)} onToggle={() => toggleSaved(book.id, 'book')} />)}
              {visibleBanks.map((bank: QuestionBank) => <QuestionBankCard key={bank.id} bank={bank} saved={savedIds.has(bank.id)} onToggle={() => toggleSaved(bank.id, 'questionBank')} />)}
            </div>
          )}

          <FreeResources resources={freeResources} classFilter={filter.class} boardFilter={filter.board} subjectFilter={filter.subject} />

          <aside className="rb-guidance" aria-label="Buying guidance">
            <h2>Do you actually need this book?</h2>
            <p>If NCERT and your school materials cover your goal, you may not need an extra book. Buy a reference only when it adds clear value ? deeper concepts, targeted practice, or board-exam familiarity. Avoid multiple overlapping question banks for the same subject.</p>
          </aside>
        </>
      )}
    </section>
  );
}
