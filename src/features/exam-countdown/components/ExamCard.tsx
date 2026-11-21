import { CalendarDays, CheckCircle2, Clock3, MapPin, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import type { Exam } from '../types';
import { getCountdown, parseLocalDate } from './ExamStats';
import { SyllabusChecklist } from './SyllabusChecklist';

const urgencyLabel = {
  upcoming: 'Upcoming',
  prepare: 'Prepare',
  high: 'High priority',
  urgent: 'Urgent',
  today: 'Today',
  completed: 'Completed',
};

export function ExamCard({
  exam,
  onEdit,
  onDelete,
  onComplete,
  onToggleTopic,
  onAddTopic,
  onRemoveTopic,
}: {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (examId: string) => void;
  onComplete: (examId: string, completed: boolean) => void;
  onToggleTopic: (examId: string, topicId: string) => void;
  onAddTopic: (examId: string, title: string) => void;
  onRemoveTopic: (examId: string, topicId: string) => void;
}) {
  const countdown = getCountdown(exam);
  const dateLabel = parseLocalDate(exam.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const progress = exam.topics.length ? Math.round(exam.topics.filter(topic => topic.completed).length / exam.topics.length * 100) : null;

  return (
    <article className={`ec-card urgency-${countdown.urgency}`}>
      <div className="ec-card-top">
        <div className="ec-card-title">
          <span className="ec-subject">{exam.subject}</span>
          <h2>{exam.name}</h2>
        </div>
        <span className={`ec-urgency ec-urgency-${countdown.urgency}`}>{urgencyLabel[countdown.urgency]}</span>
      </div>

      <div className="ec-countdown">
        <strong>{countdown.label}</strong>
        {exam.completed ? <span>Archived examination</span> : <span>{dateLabel}</span>}
      </div>

      <div className="ec-details">
        <span><CalendarDays size={14} /> {dateLabel}</span>
        {exam.time && <span><Clock3 size={14} /> {exam.time}</span>}
        {exam.venue && <span><MapPin size={14} /> {exam.venue}</span>}
      </div>

      {exam.description && <p className="ec-description">{exam.description}</p>}

      {exam.topics.length > 0 && progress !== null && (
        <div className="ec-card-progress-meta">
          <span>Topic progress</span>
          <strong>{progress}%</strong>
        </div>
      )}

      <SyllabusChecklist
        exam={exam}
        onToggleTopic={onToggleTopic}
        onAddTopic={onAddTopic}
        onRemoveTopic={onRemoveTopic}
      />

      <div className="ec-card-actions">
        <button type="button" className="ec-btn ec-btn-quiet" onClick={() => onEdit(exam)}><Pencil size={14} /> Edit</button>
        <button type="button" className="ec-btn ec-btn-danger" onClick={() => {
          if (window.confirm(`Delete "${exam.name}"?`)) onDelete(exam.id);
        }}><Trash2 size={14} /> Delete</button>
        <button type="button" className={`ec-btn ${exam.completed ? 'ec-btn-soft' : 'ec-btn-primary'}`} onClick={() => onComplete(exam.id, !exam.completed)}>
          {exam.completed ? <><RotateCcw size={14} /> Restore</> : <><CheckCircle2 size={14} /> Complete</>}
        </button>
      </div>
    </article>
  );
}
