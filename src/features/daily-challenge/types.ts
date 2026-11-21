export interface DailyChallengeQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface DailyChallengeDefinition {
  title: string;
  subject: string;
  description: string;
  questions: readonly DailyChallengeQuestion[];
}

export interface DailyChallengeAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

/**
 * Sent once when a student finishes today's challenge.
 * Integrators can award XP from `correctCount` and should use `challengeId`
 * as their idempotency key. This component does not award XP.
 */
export interface DailyChallengeResult {
  challengeId: string;
  date: string;
  completedAt: string;
  score: number;
  total: number;
  correctCount: number;
  percentage: number;
  answers: DailyChallengeAnswer[];
}

export type DailyChallengeHistoryEntry = Pick<
  DailyChallengeResult,
  'challengeId' | 'date' | 'completedAt' | 'score' | 'total' | 'correctCount' | 'percentage'
>;

export interface DailyChallengeProps {
  /** Omit for the built-in demo challenge; pass null to show the empty state. */
  challenge?: DailyChallengeDefinition | null;
  /** Uses the student's local calendar date when omitted. */
  date?: Date;
  /** Optional host-provided history, merged with this component's local history. */
  history?: readonly DailyChallengeHistoryEntry[];
  /** Receives one completion event; use result.challengeId to deduplicate rewards. */
  onComplete?: (result: DailyChallengeResult) => void;
  /** External data states; loading takes precedence over error and challenge content. */
  loading?: boolean;
  error?: string | null;
  /** "system" follows prefers-color-scheme; pass the host theme to stay in sync. */
  theme?: 'light' | 'dark' | 'system';
  className?: string;
}
