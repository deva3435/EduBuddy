import { CalendarCheck, CalendarClock, CheckCircle2, Timer } from 'lucide-react';
import type { Exam } from '../types';

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getCountdown(exam: Exam, now = new Date()) {
  if (exam.completed) return { label: 'Exam completed', urgency: 'completed' as const, days: 0 };
  const today = parseLocalDate(localDateKey(now));
  const target = parseLocalDate(exam.date);
  const difference = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (difference < 0) return { label: 'Past due', urgency: 'urgent' as const, days: 0 };
  const days = difference;
  if (days === 0) return { label: 'Today', urgency: 'today' as const, days };
  if (days === 1) return { label: 'Tomorrow', urgency: 'urgent' as const, days };
  if (days <= 6) return { label: `${days} days left`, urgency: 'urgent' as const, days };
  if (days <= 14) return { label: `${days} days left`, urgency: 'high' as const, days };
  if (days <= 30) return { label: `${days} days left`, urgency: 'prepare' as const, days };
  return { label: `${days} days left`, urgency: 'upcoming' as const, days };
}

export function ExamStats({ exams }: { exams: Exam[] }) {
  const upcoming = exams.filter(exam => !exam.completed);
  const upcomingSorted = [...upcoming].sort((a, b) => a.date.localeCompare(b.date));
  const today = parseLocalDate(localDateKey());
  const nearest = upcomingSorted.find(exam => parseLocalDate(exam.date).getTime() >= today.getTime());
  const withinSeven = upcoming.filter(exam => {
    const target = parseLocalDate(exam.date);
    const days = Math.round((target.getTime() - today.getTime()) / 86400000);
    return days >= 0 && days <= 7;
  }).length;
  const completed = exams.filter(exam => exam.completed).length;

  const nearestLabel = nearest
    ? getCountdown(nearest).days === 0
      ? 'Today'
      : getCountdown(nearest).days === 1
        ? 'Tomorrow'
        : parseLocalDate(nearest.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
    : 'None yet';

  return (
    <div className="ec-stats" aria-label="Exam summary">
      <article className="ec-stat-card"><span className="ec-stat-icon mint"><CalendarClock size={18} /></span><div><strong>{upcoming.length}</strong><small>Upcoming exams</small></div></article>
      <article className="ec-stat-card"><span className="ec-stat-icon purple"><Timer size={18} /></span><div><strong>{nearestLabel}</strong><small>Nearest exam</small></div></article>
      <article className="ec-stat-card"><span className="ec-stat-icon yellow"><CalendarCheck size={18} /></span><div><strong>{withinSeven}</strong><small>Within 7 days</small></div></article>
      <article className="ec-stat-card"><span className="ec-stat-icon blue"><CheckCircle2 size={18} /></span><div><strong>{completed}</strong><small>Completed</small></div></article>
    </div>
  );
}
