import { useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import type { Exam, ExamCountdownProps } from './types';
import { useExamCountdown } from './hooks/useExamCountdown';
import { ExamCard } from './components/ExamCard';
import { ExamModal } from './components/ExamModal';
import { ExamStats } from './components/ExamStats';
import './exam-countdown.css';

export function ExamCountdown({ theme = 'system', className = '' }: ExamCountdownProps) {
  const {
    exams,
    loaded,
    storageError,
    clearStorageError,
    addExam,
    updateExam,
    deleteExam,
    setExamCompleted,
    toggleTopic,
    addTopic,
    removeTopic,
  } = useExamCountdown();
  const [view, setView] = useState<'upcoming' | 'completed'>('upcoming');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const subjects = useMemo(() =>
    [...new Set(exams.map(exam => exam.subject).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
  [exams]);

  const visibleExams = useMemo(() => exams
    .filter(exam => exam.completed === (view === 'completed'))
    .filter(exam => subjectFilter === 'all' || exam.subject === subjectFilter)
    .sort((a, b) => view === 'completed'
      ? b.createdAt.localeCompare(a.createdAt)
      : a.date.localeCompare(b.date)),
  [exams, view, subjectFilter]);

  const openAdd = () => {
    setEditingExam(null);
    setModalOpen(true);
  };

  const openEdit = (exam: Exam) => {
    setEditingExam(exam);
    setModalOpen(true);
  };

  const containerClass = `ec-root ${className}`.trim();

  if (!loaded) {
    return <section className={containerClass} data-theme={theme}><div className="ec-loading">Loading your exams...</div></section>;
  }

  return (
    <section className={containerClass} data-theme={theme}>
      <div className="ec-header">
        <div>
          <span className="ec-eyebrow">EXAM PLANNER</span>
          <h1>Exam Countdown</h1>
          <p>Plan ahead, track your syllabus and see what needs attention next.</p>
        </div>
        <button type="button" className="ec-btn ec-btn-primary" onClick={openAdd}>
          <Plus size={17} /> Add exam
        </button>
      </div>

      {storageError && (
        <div className="ec-storage-alert" role="alert">
          <span>{storageError}</span>
          <button type="button" onClick={clearStorageError} aria-label="Dismiss storage warning">Dismiss</button>
        </div>
      )}

      <ExamStats exams={exams} />

      <div className="ec-toolbar">
        <div className="ec-tabs" role="tablist" aria-label="Exam status">
          <button type="button" role="tab" aria-selected={view === 'upcoming'} className={view === 'upcoming' ? 'active' : ''} onClick={() => setView('upcoming')}>
            Upcoming <span>{exams.filter(exam => !exam.completed).length}</span>
          </button>
          <button type="button" role="tab" aria-selected={view === 'completed'} className={view === 'completed' ? 'active' : ''} onClick={() => setView('completed')}>
            Completed <span>{exams.filter(exam => exam.completed).length}</span>
          </button>
        </div>
        {subjects.length > 0 && (
          <select className="ec-select ec-subject-filter" value={subjectFilter} onChange={event => setSubjectFilter(event.target.value)} aria-label="Filter by subject">
            <option value="all">All subjects</option>
            {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        )}
      </div>

      {visibleExams.length === 0 ? (
        <div className="ec-empty">
          <div className="ec-empty-icon"><CalendarDays size={32} /></div>
          {view === 'upcoming' ? (
            <>
              <h2>{exams.length ? 'No upcoming exams match this view' : 'Your next exam starts here'}</h2>
              <p>{exams.length ? 'Try another subject or add a new examination.' : 'Add your exams and syllabus topics to start tracking preparation and important dates.'}</p>
              <button type="button" className="ec-btn ec-btn-primary" onClick={openAdd}><Plus size={16} /> Add exam</button>
            </>
          ) : (
            <>
              <h2>No completed exams yet</h2>
              <p>Exams you mark as completed will stay here and can be restored at any time.</p>
            </>
          )}
        </div>
      ) : (
        <div className="ec-grid">
          {visibleExams.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEdit={openEdit}
              onDelete={deleteExam}
              onComplete={setExamCompleted}
              onToggleTopic={toggleTopic}
              onAddTopic={addTopic}
              onRemoveTopic={removeTopic}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ExamModal
          exam={editingExam}
          onClose={() => setModalOpen(false)}
          onSave={(draft) => {
            if (editingExam) updateExam(editingExam.id, draft);
            else addExam(draft);
            setModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

export default ExamCountdown;
