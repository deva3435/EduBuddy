import { useMemo } from 'react';
import { CheckCircle2, GraduationCap, X } from 'lucide-react';
import type { Student, TeacherDashboardData } from '../types';

export function StudentProfileModal({ student, data, onClose }: { student: Student; data: TeacherDashboardData; onClose: () => void }) {
  const classes = data.classrooms.filter(classroom => student.classroomIds.includes(classroom.id));
  const work = [
    ...data.assignments.filter(item => item.status === 'published' && student.classroomIds.includes(item.classroomId)).map(item => ({ ...item, kind: 'Assignment' })),
    ...data.dpps.filter(item => item.status === 'published' && student.classroomIds.includes(item.classroomId)).map(item => ({ ...item, kind: 'DPPS', maxMarks: item.questions.reduce((total, question) => total + question.marks, 0) })),
  ];
  const submissions = data.submissions.filter(submission => submission.studentId === student.id);
  const records = useMemo(() => work.map(item => {
    const submission = submissions.find(candidate => candidate.workId === item.id);
    return { item, submission };
  }), [work, submissions]);
  const assignmentRecords = records.filter(record => record.item.kind === 'Assignment');
  const dppsRecords = records.filter(record => record.item.kind === 'DPPS');
  const assignmentDone = assignmentRecords.filter(record => record.submission && record.submission.status !== 'not-submitted').length;
  const reviews = submissions.filter(submission => submission.review);
  const scores = reviews.map(submission => {
    const item = work.find(candidate => candidate.id === submission.workId);
    return item && submission.review ? submission.review.marks / Math.max(1, item.maxMarks) * 100 : null;
  }).filter((score): score is number => score !== null);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;

  return <div className="td-modal-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="td-modal td-student-modal" role="dialog" aria-modal="true" aria-labelledby="td-student-title"><header className="td-modal-head"><div><span className="td-kicker">{student.demo ? 'DEMO STUDENT PROFILE' : 'LOCAL STUDENT PROFILE'}</span><h2 id="td-student-title">{student.name}</h2><p>{student.studentId || 'No student ID'}{student.email ? ` · ${student.email}` : ''}</p></div><button className="td-icon-button" onClick={onClose} aria-label="Close student details"><X size={18}/></button></header><div className="td-student-body"><div className="td-student-summary"><span><GraduationCap size={15}/>Classrooms<strong>{classes.map(item => item.name).join(', ') || 'Not enrolled'}</strong></span><span><CheckCircle2 size={15}/>Assignment completion<strong>{assignmentDone}/{assignmentRecords.length}</strong></span><span>DPPS completed<strong>{dppsRecords.filter(record => record.submission && record.submission.status !== 'not-submitted').length}/{dppsRecords.length}</strong></span><span>Average reviewed score<strong>{average === null ? 'No scores yet' : `${average}%`}</strong></span><span>Last activity<strong>{student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Not recorded'}</strong></span></div><div className="td-section-head"><div><span className="td-kicker">LEARNING RECORD</span><h3>Submission history</h3></div></div>{records.length ? <div className="td-student-history">{records.map(({ item, submission }) => <article key={item.id}><div><strong>{item.title}</strong><small>{item.kind} · Due {new Date(item.dueAt).toLocaleDateString()}</small></div><span className={`td-status-pill ${submission?.status === 'reviewed' ? 'tone-green' : submission?.status === 'late' ? 'tone-red' : 'tone-neutral'}`}>{submission?.status.replace('-', ' ') || 'No record'}</span>{submission?.review && <p><b>{submission.review.marks}/{item.maxMarks}</b> · {submission.review.feedback || 'No written feedback.'}</p>}</article>)}</div> : <div className="td-empty-inline"><p>No published assignments are available for this student's classrooms yet.</p></div>}{!reviews.length && <p className="td-help">Grades and teacher feedback will appear after submissions are reviewed.</p>}</div></section></div>;
}
