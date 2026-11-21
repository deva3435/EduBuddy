import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Search } from 'lucide-react';
import type { Submission, TeacherDashboardData } from '../types';

function getWork(data: TeacherDashboardData, submission: Submission) {
  return submission.workKind === 'dpps'
    ? data.dpps.find(item => item.id === submission.workId)
    : data.assignments.find(item => item.id === submission.workId);
}
function workTitle(data: TeacherDashboardData, submission: Submission) {
  return getWork(data, submission)?.title || 'Work item removed';
}
function maxMarks(data: TeacherDashboardData, submission: Submission) {
  const work = getWork(data, submission);
  return work && 'questions' in work ? work.questions.reduce((total, question) => total + question.marks, 0) : work && 'maxMarks' in work ? work.maxMarks : 0;
}

function ReviewModal({ submission, data, onClose, onSave }: {
  submission: Submission;
  data: TeacherDashboardData;
  onClose: () => void;
  onSave: (id: string, marks: number, feedback: string) => void;
}) {
  const [marks, setMarks] = useState(String(submission.review?.marks ?? ''));
  const [feedback, setFeedback] = useState(submission.review?.feedback || '');
  const [error, setError] = useState('');
  const student = data.students.find(item => item.id === submission.studentId);
  const work = getWork(data, submission);
  const maximum = maxMarks(data, submission);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const score = Number(marks);
    if (!Number.isFinite(score) || score < 0 || score > maximum) {
      setError(`Enter a score from 0 to ${maximum}.`);
      return;
    }
    onSave(submission.id, score, feedback);
  };

  return <div className="td-modal-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="td-modal td-review-modal" role="dialog" aria-modal="true" aria-labelledby="td-review-title"><header className="td-modal-head"><div><span className="td-kicker">{submission.demo ? 'DEMO SUBMISSION' : 'LOCAL SUBMISSION'}</span><h2 id="td-review-title">Review work</h2><p>{student?.name || 'Unknown student'} · {work?.title || 'Work item'}</p></div><button className="td-icon-button" onClick={onClose} aria-label="Close review">×</button></header><form className="td-modal-form" onSubmit={submit}><div className="td-submission-context"><span>Class<strong>{data.classrooms.find(item => item.id === submission.classroomId)?.name || '—'}</strong></span><span>Status<strong>{submission.status.replace('-', ' ')}</strong></span><span>Submitted<strong>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Not submitted'}</strong></span></div>
    <div className="td-response-list"><h3>Student responses</h3>{submission.answers.length ? submission.answers.map(answer => {
      const question = work && 'questions' in work ? work.questions.find(item => item.id === answer.questionId) : null;
      return <article key={answer.questionId}><strong>{question?.text || (answer.questionId === 'response' ? 'Submitted work summary' : 'Response')}</strong><p>{answer.response || 'No response provided.'}</p>{question?.correctAnswer && <small>Answer key: {question.correctAnswer}{question.explanation ? ` · ${question.explanation}` : ''}</small>}</article>;
    }) : <p className="td-help">No response has been submitted for this work item.</p>}</div>
    {submission.status !== 'not-submitted' && <><div className="td-form-grid"><label className="td-field"><span>Marks (out of {maximum}) *</span><input type="number" min="0" max={maximum} step="0.5" required value={marks} onChange={event => setMarks(event.target.value)} /></label><label className="td-field td-wide"><span>Feedback</span><textarea rows={3} value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Share helpful feedback with the student"/></label></div>{error && <p className="td-form-error">{error}</p>}<footer className="td-modal-actions"><button type="button" className="td-button td-button-light" onClick={onClose}>Cancel</button><button type="submit" className="td-button td-button-primary"><CheckCircle2 size={15}/> Save review</button></footer></>}
  </form></section></div>;
}

const statusClass: Record<Submission['status'], string> = {
  'not-submitted': 'tone-neutral',
  submitted: 'tone-blue',
  late: 'tone-red',
  'under-review': 'tone-amber',
  reviewed: 'tone-green',
};

export function SubmissionsPage({ data, onReview }: { data: TeacherDashboardData; onReview: (id: string, marks: number, feedback: string) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [selected, setSelected] = useState<Submission | null>(null);
  const publishedIds = new Set([...data.assignments.filter(item => item.status === 'published').map(item => item.id), ...data.dpps.filter(item => item.status === 'published').map(item => item.id)]);
  const submissions = useMemo(() => data.submissions
    .filter(submission => publishedIds.has(submission.workId))
    .filter(submission => statusFilter === 'all' || submission.status === statusFilter)
    .filter(submission => classFilter === 'all' || submission.classroomId === classFilter)
    .filter(submission => {
      const student = data.students.find(item => item.id === submission.studentId);
      return `${student?.name || ''} ${student?.studentId || ''} ${workTitle(data, submission)}`.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || '')),
  [data, statusFilter, classFilter, search]);
  const submittedCount = submissions.filter(item => item.status !== 'not-submitted').length;
  const reviewedCount = submissions.filter(item => item.status === 'reviewed').length;
  const lateCount = submissions.filter(item => item.status === 'late').length;
  const scores = submissions.filter(item => item.review).map(item => item.review!.marks / Math.max(1, maxMarks(data, item)) * 100);
  const avg = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;

  return <div className="td-page-content">
    <div className="td-page-heading"><div><span className="td-kicker">STUDENT WORK</span><h1>Submissions</h1><p>Review work, record marks and leave feedback. Demo submissions are labeled.</p></div></div>
    <div className="td-stats-grid td-submission-stats"><article className="td-stat-card"><span className="td-stat-icon blue"><ClipboardCheck size={18}/></span><div><strong>{submissions.length}</strong><small>Assigned work</small></div></article><article className="td-stat-card"><span className="td-stat-icon teal"><CheckCircle2 size={18}/></span><div><strong>{submittedCount}</strong><small>Submitted</small></div></article><article className="td-stat-card"><span className="td-stat-icon coral"><ClipboardCheck size={18}/></span><div><strong>{Math.max(0, submissions.length - submittedCount)}</strong><small>Pending</small></div></article><article className="td-stat-card"><span className="td-stat-icon amber"><ClipboardCheck size={18}/></span><div><strong>{lateCount}</strong><small>Late</small></div></article><article className="td-stat-card"><span className="td-stat-icon violet"><CheckCircle2 size={18}/></span><div><strong>{reviewedCount}</strong><small>Reviewed · {avg === null ? '—' : `${avg}% avg.`}</small></div></article></div>
    <div className="td-panel td-table-panel"><div className="td-filter-bar"><label className="td-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search students or work"/></label><select value={classFilter} onChange={event => setClassFilter(event.target.value)}><option value="all">All classrooms</option>{data.classrooms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{(['not-submitted', 'submitted', 'late', 'under-review', 'reviewed'] as const).map(item => <option key={item} value={item}>{item.replace('-', ' ')}</option>)}</select></div>
      {submissions.length ? <div className="td-table-wrap"><table className="td-table"><thead><tr><th>Student</th><th>Work</th><th>Classroom</th><th>Status</th><th>Submitted</th><th>Score</th><th>Action</th></tr></thead><tbody>{submissions.map(submission => { const student = data.students.find(item => item.id === submission.studentId); const classroom = data.classrooms.find(item => item.id === submission.classroomId); return <tr key={submission.id}><td><strong>{student?.name || 'Unknown student'}</strong><small>{student?.studentId || (student?.demo ? 'Demo record' : '')}</small></td><td>{workTitle(data, submission)}<small>{submission.workKind.toUpperCase()}</small></td><td>{classroom?.name || '—'}</td><td><span className={`td-status-pill ${statusClass[submission.status]}`}>{submission.status.replace('-', ' ')}</span></td><td>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : '—'}</td><td>{submission.review ? `${submission.review.marks}/${maxMarks(data, submission)}` : '—'}</td><td><button className="td-button td-button-light td-small-button" disabled={submission.status === 'not-submitted'} onClick={() => setSelected(submission)}>{submission.status === 'reviewed' ? 'View review' : 'Review'}</button></td></tr>; })}</tbody></table></div> : <div className="td-empty-inline"><p>No submissions match the selected filters.</p></div>}
    </div>
    {selected && <ReviewModal submission={selected} data={data} onClose={() => setSelected(null)} onSave={(id, marks, feedback) => { onReview(id, marks, feedback); setSelected(null); }}/>}
  </div>;
}
