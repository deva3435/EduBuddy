/**
 * Types for the EduBuddy Formula Sheets Feature (Feature 09)
 */

export type SubjectId = 'mathematics' | 'physics' | 'chemistry' | string;

export type GradeLevel = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12' | string;

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeColor: string;
  description: string;
}

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit?: string;
  description?: string;
}

export interface FormulaExample {
  problem: string;
  given?: Record<string, string>;
  steps: string[];
  result: string;
  note?: string;
}

export interface FormulaExpression {
  /** Formatted LaTeX string for copying or scientific display */
  latex: string;
  /** Plain text string suitable for clipboard or ASCII terminals */
  text: string;
  /** Structured visual math tokens or formatted unicode string */
  formatted?: string;
}

export interface Formula {
  id: string;
  title: string;
  subject: SubjectId;
  grades: GradeLevel[];
  chapter: string;
  category: string;
  expression: FormulaExpression;
  variables: FormulaVariable[];
  explanation: string;
  conditions?: string;
  example?: FormulaExample;
  keywords: string[];
  relatedFormulaIds?: string[];
  derivation?: string;
  isFundamental?: boolean;
}

export interface FormulaFilterState {
  searchQuery: string;
  selectedSubject: SubjectId | 'all';
  selectedGrade: GradeLevel | 'all';
  selectedCategory: string | 'all';
  onlyFavorites: boolean;
}

export interface FormulaStats {
  totalFormulas: number;
  subjectCounts: Record<string, number>;
  gradeCounts: Record<string, number>;
}

export interface FormulaSheetsProps {
  /** Optional initial grade to preselect (e.g. from user profile 'Class 10') */
  initialGrade?: GradeLevel;
  /** Optional initial subject to preselect (e.g. 'Mathematics') */
  initialSubject?: string;
  /** Optional callback to navigate to Learn mode for this topic */
  onNavigateTopic?: (topic: string, subject?: string) => void;
  /** Optional callback to navigate to Practice quiz for this topic */
  onNavigateQuiz?: (topic: string) => void;
  /** Optional custom title */
  title?: string;
  /** Optional custom subtitle */
  subtitle?: string;
}
