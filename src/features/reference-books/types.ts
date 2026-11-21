export type Board = 'CBSE' | 'ICSE' | 'State Board' | 'Other';
export type ClassGrade = `Class ${number}`;
export type Subject = string;
export type BookCategory = 'textbook' | 'concept' | 'practice' | 'questionBank' | 'examPrep';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type PriceConfidence = 'approximate' | 'unverified';
export type PriceLabel = 'inexpensive' | 'moderate' | 'expensive';
export type Budget = 'free' | 'low' | 'moderate' | 'none';
export type Goal = 'concept' | 'practice' | 'exam' | 'questionBank' | 'olympiad' | 'competitive' | 'comprehensive';
export type QBankType = 'chapterwise' | 'mcq' | 'previousYear' | 'board' | 'caseBased' | 'competency' | 'samplePaper' | 'assertionReason' | 'olympiad' | 'questionBank';
export type ResourceType = 'textbook' | 'samplePaper' | 'questionBank' | 'syllabus' | 'exemplar';

export interface BookLink { label: string; url: string; }

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  publisher: string;
  classes: ClassGrade[];
  boards: Board[];
  subject: Subject;
  category: BookCategory;
  description: string;
  whyRecommended: string;
  bestFor: string;
  idealFor: string;
  notNecessaryFor: string;
  strengths: string[];
  difficulty: Difficulty;
  priceRange: string;
  priceConfidence: PriceConfidence;
  priceLabel: PriceLabel;
  worthIt: string;
  links: BookLink[];
  freeAlternativeId: string | null;
  priority: number;
  examRelevance: 'high' | 'medium' | 'low';
  edition?: string;
  isbn?: string;
  coverUrl?: string;
}

export interface QuestionBank {
  id: string;
  title: string;
  publisher: string;
  classes: ClassGrade[];
  boards: Board[];
  subject: Subject;
  type: QBankType;
  description: string;
  whyRecommended: string;
  priceRange: string;
  priceConfidence: PriceConfidence;
  links: BookLink[];
  priority: number;
  isbn?: string;
  coverUrl?: string;
}

export interface FreeResource {
  id: string;
  title: string;
  source: string;
  classes: ClassGrade[];
  boards: Board[];
  subject: Subject | null;
  type: ResourceType;
  description: string;
  link: string;
  linkLabel: string;
}

export interface SavedBook { id: string; type: 'book' | 'questionBank'; savedAt: string; }

export interface FilterState {
  class: ClassGrade | 'all';
  board: Board | 'all';
  subject: Subject | 'all';
  category: BookCategory | 'all';
  budget: Budget;
  search: string;
}

export const ALL_CLASSES: ClassGrade[] = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`) as ClassGrade[];

export const BOARDS: Board[] = ['CBSE', 'ICSE', 'State Board', 'Other'];

export const SUBJECTS: Subject[] = [
  'Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science',
  'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Business Studies', 'Economics',
  'Information Technology', 'History', 'Geography', 'Political Science', 'Physical Education', 'EVS',
];

export const SUBJECTS_BY_CLASS: Record<ClassGrade, Subject[]> = {
  'Class 1': ['Mathematics', 'English', 'EVS', 'Hindi'],
  'Class 2': ['Mathematics', 'English', 'EVS', 'Hindi'],
  'Class 3': ['Mathematics', 'English', 'EVS', 'Hindi'],
  'Class 4': ['Mathematics', 'English', 'EVS', 'Hindi'],
  'Class 5': ['Mathematics', 'English', 'EVS', 'Hindi'],
  'Class 6': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science'],
  'Class 7': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science'],
  'Class 8': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science'],
  'Class 9': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science', 'Information Technology'],
  'Class 10': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science', 'Information Technology'],
  'Class 11': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi', 'Accountancy', 'Business Studies', 'Economics', 'Computer Science', 'History', 'Geography', 'Political Science', 'Physical Education'],
  'Class 12': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi', 'Accountancy', 'Business Studies', 'Economics', 'Computer Science', 'History', 'Geography', 'Political Science', 'Physical Education'],
};

export const GOALS: { value: Goal; label: string }[] = [
  { value: 'concept', label: 'Concept building' },
  { value: 'practice', label: 'Daily practice' },
  { value: 'exam', label: 'Exam preparation' },
  { value: 'questionBank', label: 'Question bank practice' },
  { value: 'olympiad', label: 'Olympiad preparation' },
  { value: 'competitive', label: 'Competitive exam preparation' },
  { value: 'comprehensive', label: 'Comprehensive preparation' },
];

export const BUDGETS: { value: Budget; label: string }[] = [
  { value: 'free', label: 'Free resources only' },
  { value: 'low', label: 'Low budget' },
  { value: 'moderate', label: 'Moderate budget' },
  { value: 'none', label: 'No budget preference' },
];

export const CATEGORIES: { value: BookCategory; label: string }[] = [
  { value: 'textbook', label: 'Textbooks' },
  { value: 'concept', label: 'Concept building' },
  { value: 'practice', label: 'Practice books' },
  { value: 'questionBank', label: 'Question banks' },
  { value: 'examPrep', label: 'Exam preparation' },
];

export const QBankLabels: Record<QBankType, string> = {
  chapterwise: 'Chapter-wise',
  mcq: 'MCQs',
  previousYear: 'Previous years',
  board: 'Board exams',
  caseBased: 'Case-based',
  competency: 'Competency-based',
  samplePaper: 'Sample papers',
  assertionReason: 'Assertion-reason',
  olympiad: 'Olympiad',
  questionBank: 'Question bank',
};

export const defaultFilterState: FilterState = {
  class: 'all',
  board: 'all',
  subject: 'all',
  category: 'all',
  budget: 'none',
  search: '',
};
