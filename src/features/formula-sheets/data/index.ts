import { Formula, SubjectMeta, SubjectId, GradeLevel, FormulaStats } from '../types';
import { MATHEMATICS_FORMULAS } from './mathematics';
import { PHYSICS_FORMULAS } from './physics';
import { CHEMISTRY_FORMULAS } from './chemistry';

export const SUBJECTS_META: SubjectMeta[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '∑',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeColor: '#2563eb',
    description: 'Algebra, Geometry, Trigonometry, Calculus & Probability formulas'
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚛',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeColor: '#059669',
    description: 'Mechanics, Electromagnetism, Optics, Modern Physics & Waves'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.12)',
    badgeColor: '#7c3aed',
    description: 'Physical Chemistry, Stoichiometry, Thermodynamics & Kinetics'
  }
];

export const ALL_FORMULAS: Formula[] = [
  ...MATHEMATICS_FORMULAS,
  ...PHYSICS_FORMULAS,
  ...CHEMISTRY_FORMULAS
];

export const GRADE_LEVELS: GradeLevel[] = [
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

/**
 * Returns distinct categories for a given subject (or all subjects if omitted).
 */
export function getCategoriesForSubject(subjectId?: SubjectId | 'all'): string[] {
  const pool = !subjectId || subjectId === 'all'
    ? ALL_FORMULAS
    : ALL_FORMULAS.filter(f => f.subject === subjectId);
  const categories = new Set<string>();
  pool.forEach(f => categories.add(f.category));
  return Array.from(categories).sort();
}

/**
 * Returns distinct chapters for a given subject and optional grade.
 */
export function getChaptersForSubject(subjectId?: SubjectId | 'all', grade?: GradeLevel | 'all'): string[] {
  let pool = ALL_FORMULAS;
  if (subjectId && subjectId !== 'all') {
    pool = pool.filter(f => f.subject === subjectId);
  }
  if (grade && grade !== 'all') {
    pool = pool.filter(f => f.grades.includes(grade));
  }
  const chapters = new Set<string>();
  pool.forEach(f => chapters.add(f.chapter));
  return Array.from(chapters).sort();
}

/**
 * Calculates current formula counts by subject and grade.
 */
export function getFormulaStats(): FormulaStats {
  const subjectCounts: Record<string, number> = {};
  const gradeCounts: Record<string, number> = {};

  ALL_FORMULAS.forEach(f => {
    subjectCounts[f.subject] = (subjectCounts[f.subject] || 0) + 1;
    f.grades.forEach(g => {
      gradeCounts[g] = (gradeCounts[g] || 0) + 1;
    });
  });

  return {
    totalFormulas: ALL_FORMULAS.length,
    subjectCounts,
    gradeCounts
  };
}

/**
 * Finds a formula by its unique ID.
 */
export function getFormulaById(id: string): Formula | undefined {
  return ALL_FORMULAS.find(f => f.id === id);
}
