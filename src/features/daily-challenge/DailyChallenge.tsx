import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, RotateCcw, Sparkles, Target, Trophy, XCircle } from 'lucide-react';
import { demoDailyChallenge } from './demoChallenge';
import type {
  DailyChallengeDefinition,
  DailyChallengeHistoryEntry,
  DailyChallengeProps,
  DailyChallengeQuestion,
  DailyChallengeResult,
} from './types';
import './daily-challenge.css';

const DEFAULT_STORAGE_KEY = 'edubuddy:daily-challenge:v1';

interface StoredHistory {
  entries: DailyChallengeResult[];
  error: string | null;
}

interface ChallengeSessionState {
  challengeId: string;
  questionIndex: number;
  answers: Record<number, number>;
  checked: Record<number, boolean>;
  completionError: string | null;
}

function emptySession(challengeId: string): ChallengeSessionState {
  return { challengeId, questionIndex: 0, answers: {}, checked: {}, completionError: null };
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidQuestion(question: DailyChallengeQuestion): boolean {
  return Boolean(
    question &&
    typeof question.question === 'string' &&
    question.question.trim() &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    question.options.every((option) => typeof option === 'string' && option.trim()) &&
    Number.isInteger(question.answer) &&
    question.answer >= 0 &&
    question.answer < question.options.length &&
    typeof question.explanation === 'string' &&
    question.explanation.trim(),
  );
}

function isValidDefinition(challenge: DailyChallengeDefinition): boolean {
  return Boolean(
    challenge &&
    typeof challenge.title === 'string' &&
    challenge.title.trim() &&
    typeof challenge.subject === 'string' &&
    challenge.subject.trim() &&
    typeof challenge.description === 'string' &&
    challenge.description.trim() &&
    Array.isArray(challenge.questions) &&
    challenge.questions.length > 0 &&
    challenge.questions.every(isValidQuestion),
  );
}

function isDailyChallengeResult(value: unknown): value is DailyChallengeResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Partial<DailyChallengeResult>;
  const validAnswers = Array.isArray(result.answers) && result.answers.every((answer) =>
    Boolean(
      answer &&
      Number.isInteger(answer.questionIndex) &&
      answer.questionIndex >= 0 &&
      Number.isInteger(answer.selectedAnswer) &&
      answer.selectedAnswer >= 0 &&
      Number.isInteger(answer.correctAnswer) &&
      answer.correctAnswer >= 0 &&
      typeof answer.isCorrect === 'boolean',
    ),
  );
  return typeof result.challengeId === 'string' &&
    typeof result.date === 'string' &&
    typeof result.completedAt === 'string' &&
    Number.isInteger(result.score) &&
    (result.score ?? -1) >= 0 &&
    Number.isInteger(result.total) &&
    (result.total ?? 0) > 0 &&
    Number.isInteger(result.correctCount) &&
    (result.correctCount ?? -1) >= 0 &&
    (result.correctCount ?? Infinity) <= (result.total ?? 0) &&
    Number.isFinite(result.percentage) &&
    Array.isArray(result.answers) &&
    validAnswers &&
    result.answers.length === result.total;
}

function readStoredHistory(storageKey: string): StoredHistory {
  if (typeof window === 'undefined') return { entries: [], error: null };
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return { entries: [], error: null };
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray((parsed as { entries?: unknown }).entries)
    ) {
      return { entries: [], error: 'Saved challenge history could not be read. New progress can still be saved.' };
    }
    return {
      entries: (parsed as { entries: unknown[] }).entries.filter(isDailyChallengeResult),
      error: null,
    };
  } catch {
    return { entries: [], error: 'Saved challenge history is unavailable in this browser. Progress will be kept for this visit.' };
  }
}

function mergeHistory(
  externalHistory: readonly DailyChallengeHistoryEntry[],
  localHistory: readonly DailyChallengeResult[],
): DailyChallengeHistoryEntry[] {
  const entries = new Map<string, DailyChallengeHistoryEntry>();
  for (const result of externalHistory) entries.set(result.challengeId, result);
  for (const result of localHistory) entries.set(result.challengeId, result);
  return [...entries.values()].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

function isDetailedResult(entry: DailyChallengeHistoryEntry): entry is DailyChallengeResult {
  return 'answers' in entry && Array.isArray(entry.answers);
}

export function DailyChallenge({
  challenge,
  date,
  history = [],
  onComplete,
  loading = false,
  error = null,
  theme = 'system',
  className = '',
}: DailyChallengeProps) {
  const definition = challenge === undefined ? demoDailyChallenge : challenge;
  const dateKey = localDateKey(date ?? new Date());
  const challengeId = `daily-challenge-${dateKey}`;
  const [storedHistory, setStoredHistory] = useState<StoredHistory>(() => readStoredHistory(DEFAULT_STORAGE_KEY));
  const [sessionState, setSessionState] = useState<ChallengeSessionState>(() => emptySession(challengeId));
  const completionIds = useRef(new Set<string>());

  const session = sessionState.challengeId === challengeId ? sessionState : emptySession(challengeId);
  function updateSession(update: (current: ChallengeSessionState) => ChallengeSessionState) {
    setSessionState((current) => update(current.challengeId === challengeId ? current : emptySession(challengeId)));
  }

  const effectiveHistory = useMemo(
    () => mergeHistory(history, storedHistory.entries),
    [history, storedHistory.entries],
  );
  const completedEntry = effectiveHistory.find((entry) => entry.challengeId === challengeId);
  const validDefinition = definition !== null && isValidDefinition(definition);
  const questions = validDefinition ? definition.questions : [];
  const question = questions[session.questionIndex];
  const answeredCount = Object.keys(session.checked).length;

  function chooseAnswer(optionIndex: number) {
    if (!session.checked[session.questionIndex]) {
      updateSession((current) => ({
        ...current,
        answers: { ...current.answers, [current.questionIndex]: optionIndex },
      }));
    }
  }

  function checkAnswer() {
    if (session.answers[session.questionIndex] === undefined || session.checked[session.questionIndex]) return;
    updateSession((current) => ({
      ...current,
      checked: { ...current.checked, [current.questionIndex]: true },
    }));
  }

  function finishChallenge() {
    if (
      !validDefinition ||
      answeredCount !== questions.length ||
      completedEntry ||
      completionIds.current.has(challengeId)
    ) return;

    const resultAnswers = questions.map((item, index) => ({
      questionIndex: index,
      selectedAnswer: session.answers[index],
      correctAnswer: item.answer,
      isCorrect: session.answers[index] === item.answer,
    }));
    const correctCount = resultAnswers.filter((answer) => answer.isCorrect).length;
    const result: DailyChallengeResult = {
      challengeId,
      date: dateKey,
      completedAt: new Date().toISOString(),
      score: correctCount,
      total: questions.length,
      correctCount,
      percentage: Math.round((correctCount / questions.length) * 100),
      answers: resultAnswers,
    };

    completionIds.current.add(challengeId);
    const nextEntries = [result, ...storedHistory.entries.filter((entry) => entry.challengeId !== challengeId)];
    updateSession((current) => ({ ...current, completionError: null }));
    let saveError: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify({ entries: nextEntries }));
      } catch {
        saveError = 'Challenge completed, but this browser could not save your history.';
      }
    }
    setStoredHistory({ entries: nextEntries, error: saveError });

    try {
      onComplete?.(result);
    } catch {
      updateSession((current) => ({
        ...current,
        completionError: 'Challenge saved, but the completion callback failed. The result is available below.',
      }));
    }
  }

  const containerClass = `dc-root ${className}`.trim();

  if (loading) {
    return (
      <section className={containerClass} data-theme={theme} aria-live="polite">
        <div className="dc-state-card">
          <span className="dc-spinner" aria-hidden="true" />
          <h2>Getting your challenge ready</h2>
          <p>Just a moment while we prepare today’s questions.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={containerClass} data-theme={theme} role="alert">
        <div className="dc-state-card dc-error-card">
          <XCircle size={30} aria-hidden="true" />
          <h2>We couldn’t load this challenge</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (definition === null) {
    return (
      <section className={containerClass} data-theme={theme}>
        <div className="dc-state-card">
          <div className="dc-state-icon"><Target size={26} /></div>
          <h2>No challenge available</h2>
          <p>There isn’t a daily challenge ready right now. Please check back soon.</p>
        </div>
      </section>
    );
  }

  if (!validDefinition) {
    return (
      <section className={containerClass} data-theme={theme} role="alert">
        <div className="dc-state-card dc-error-card">
          <XCircle size={30} aria-hidden="true" />
          <h2>This challenge needs attention</h2>
          <p>Challenge questions are incomplete or invalid. Please provide at least one question with valid answer options and an explanation.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={containerClass} data-theme={theme} aria-label="Daily challenge">
      <div className="dc-layout">
        <main className="dc-main">
          {completedEntry ? (
            <div className="dc-complete-card">
              <div className="dc-complete-icon"><Trophy size={30} aria-hidden="true" /></div>
              <span className="dc-eyebrow">DAILY CHALLENGE COMPLETE</span>
              <h1>Look at you go!</h1>
              <p className="dc-subtitle">You showed up for today’s learning. Come back tomorrow for a fresh challenge.</p>
              <div className="dc-score-panel">
                <span className="dc-score-value">{completedEntry.correctCount}<small>/{completedEntry.total}</small></span>
                <span className="dc-score-label">correct answers</span>
                <span className="dc-score-percent">{completedEntry.percentage}%</span>
              </div>
              {session.completionError && <p className="dc-inline-error" role="alert">{session.completionError}</p>}
              {isDetailedResult(completedEntry) && (
                <div className="dc-review">
                  <h2>Review your answers</h2>
                  {completedEntry.answers.map((answer) => {
                    const item = questions[answer.questionIndex];
                    if (!item) return null;
                    return (
                      <article className={`dc-review-item ${answer.isCorrect ? 'is-correct' : 'is-incorrect'}`} key={answer.questionIndex}>
                        <div className="dc-review-heading">
                          {answer.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          <strong>{item.question}</strong>
                        </div>
                        {!answer.isCorrect && <p>Your answer: {item.options[answer.selectedAnswer]}</p>}
                        <p>Correct answer: {item.options[answer.correctAnswer]}</p>
                        <p className="dc-explanation">{item.explanation}</p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="dc-intro-card">
                <div className="dc-intro-top">
                  <span className="dc-eyebrow"><Sparkles size={14} /> YOUR DAILY LEARNING BOOST</span>
                  <span className="dc-date">{new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="dc-intro-content">
                  <div className="dc-hero-icon"><Target size={26} aria-hidden="true" /></div>
                  <div>
                    <span className="dc-subject">{definition.subject}</span>
                    <h1>{definition.title}</h1>
                    <p>{definition.description}</p>
                  </div>
                </div>
                <div className="dc-challenge-meta">
                  <span><CheckCircle2 size={16} /> {questions.length} quick questions</span>
                  <span><Clock3 size={16} /> About 3 minutes</span>
                  <span><Trophy size={16} /> Learn as you go</span>
                </div>
              </div>

              <div className="dc-quiz-card">
                <div className="dc-quiz-progress">
                  <div className="dc-progress-copy">
                    <span>QUESTION {session.questionIndex + 1} OF {questions.length}</span>
                    <span>{answeredCount} answered</span>
                  </div>
                  <div className="dc-progress-track" role="progressbar" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={questions.length}>
                    <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
                  </div>
                </div>

                <h2 className="dc-question">{question.question}</h2>
                <div className="dc-options">
                  {question.options.map((option, index) => {
                    const selected = session.answers[session.questionIndex] === index;
                    const isCorrectAnswer = question.answer === index;
                    const showCorrect = session.checked[session.questionIndex] && isCorrectAnswer;
                    const showIncorrect = session.checked[session.questionIndex] && selected && !isCorrectAnswer;
                    return (
                      <button
                        type="button"
                        className={`dc-option ${selected ? 'is-selected' : ''} ${showCorrect ? 'is-correct' : ''} ${showIncorrect ? 'is-incorrect' : ''}`}
                        key={`${session.questionIndex}-${index}`}
                        onClick={() => chooseAnswer(index)}
                        disabled={session.checked[session.questionIndex]}
                        aria-pressed={selected}
                      >
                        <span className="dc-option-letter">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                        {showCorrect && <Check size={17} aria-label="Correct answer" />}
                        {showIncorrect && <XCircle size={17} aria-label="Your selected answer" />}
                      </button>
                    );
                  })}
                </div>

                {session.checked[session.questionIndex] && (
                  <div className={`dc-feedback ${session.answers[session.questionIndex] === question.answer ? 'is-correct' : 'is-incorrect'}`} role="status">
                    {session.answers[session.questionIndex] === question.answer ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
                    <div>
                      <strong>{session.answers[session.questionIndex] === question.answer ? 'That’s right!' : 'Not quite — keep learning!'}</strong>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                )}

                <div className="dc-navigation">
                  <button type="button" className="dc-button dc-button-quiet" onClick={() => updateSession((current) => ({ ...current, questionIndex: current.questionIndex - 1 }))} disabled={session.questionIndex === 0}>
                    <ArrowLeft size={16} /> Previous
                  </button>
                  {session.questionIndex < questions.length - 1 ? (
                    session.checked[session.questionIndex] ? (
                      <button type="button" className="dc-button dc-button-primary" onClick={() => updateSession((current) => ({ ...current, questionIndex: current.questionIndex + 1 }))}>
                        Next question <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button type="button" className="dc-button dc-button-primary" onClick={checkAnswer} disabled={session.answers[session.questionIndex] === undefined}>
                        Check answer <Check size={16} />
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      className="dc-button dc-button-primary"
                      onClick={session.checked[session.questionIndex] ? finishChallenge : checkAnswer}
                      disabled={session.checked[session.questionIndex] ? answeredCount !== questions.length : session.answers[session.questionIndex] === undefined}
                    >
                      {session.checked[session.questionIndex] ? 'Finish challenge' : 'Check answer'}
                      {session.checked[session.questionIndex] ? <Trophy size={16} /> : <Check size={16} />}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        <aside className="dc-sidebar">
          <div className="dc-side-card dc-tip-card">
            <div className="dc-side-icon"><Sparkles size={18} /></div>
            <h2>One small step</h2>
            <p>Take your time. Each explanation is a mini lesson, whether you get it right on the first try or not.</p>
            <div className="dc-date-id">Challenge ID <span>{dateKey}</span></div>
          </div>
          <div className="dc-side-card dc-history-card">
            <div className="dc-history-heading"><h2>Your recent challenges</h2><RotateCcw size={16} aria-hidden="true" /></div>
            {effectiveHistory.length === 0 ? (
              <p className="dc-history-empty">Finish a challenge and your progress will appear here.</p>
            ) : (
              <ul className="dc-history-list">
                {effectiveHistory.slice(0, 5).map((entry) => (
                  <li key={entry.challengeId}>
                    <span className="dc-history-mark"><Check size={14} /></span>
                    <span className="dc-history-date">{new Date(`${entry.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <span className="dc-history-score">{entry.correctCount}/{entry.total}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {storedHistory.error && <p className="dc-storage-note" role="status">{storedHistory.error}</p>}
        </aside>
      </div>
    </section>
  );
}
