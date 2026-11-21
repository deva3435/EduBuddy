export interface DailyQuoteItem {
  text: string;
  author: string;
  category?: 'Learning' | 'Education' | 'Consistency' | 'Discipline' | 'Curiosity' | 'Creativity' | 'Resilience' | 'Growth' | 'Confidence' | 'Patience' | 'Challenge' | 'Progress' | 'Exams' | 'Development';
}

export interface DailyQuoteProps {
  /** Uses the student's local calendar date when omitted. */
  date?: Date;
  /** "system" follows prefers-color-scheme; pass a host theme to stay in sync. */
  theme?: 'light' | 'dark' | 'system';
  className?: string;
}
