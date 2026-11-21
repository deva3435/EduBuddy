import { useMemo, useState } from 'react';
import { GraduationCap, Plus, Search, Users } from 'lucide-react';
import { StudentProfileModal } from '../components/StudentProfileModal';
import type { Student, TeacherDashboardData } from '../types';

export function StudentsPage({ data, onAddStudent }: { data: TeacherDashboardData; onAddStudent: (classroomId: string) => void }) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selected, setSelected] = useState<Student | null>(null);
  const students = useMemo(() => data.students.filter(student =>
    (classFilter === 'all' || student.classroomIds.includes(classFilter))
    && `${student.name} ${student.studentId} ${student.email}`.toLowerCase().includes(search.toLowerCase())),
  [data.students, classFilter, search]);

  const statsForStudent = (student: Student) => {
    const workIds = [
      ...data.assignments.filter(item => item.status === 'published' && student.classroomIds.includes(item.classroomId)).map(item => item.id),
      ...data.dpps.filter(item => item.status === 'published' && student.classroomIds.includes(item.classroomId)).map(item => item.id),
    ];
    const records = data.submissions.filter(item => item.studentId === student.id && workIds.includes(item.workId));
    const done = records.filter(item => item.status !== 'not-submitted').length;
    const reviews = records.filter(item => item.review);
    const percentages = reviews.map(submission => {
      const assignment = data.assignments.find(item => item.id === submission.workId);
      const dpps = data.dpps.find(item => item.id === submission.workId);
      const maximum = assignment?.maxMarks ?? dpps?.questions.reduce((total, question) => total + question.marks, 0) ?? 0;
      return maximum && submission.review ? submission.review.marks / maximum * 100 : null;
    }).filter((score): score is number => score !== null);
    return { done, pending: Math.max(0, workIds.length - done), average: percentages.length ? Math.round(percentages.reduce((sum, score) => sum + score, 0) / percentages.length) : null };
  };

  return <div className="td-page-content">
    <div className="td-page-heading"><div><span className="td-kicker">LEARNER MONITORING</span><h1>Students</h1><p>Review classroom enrollment and student assignment progress.</p></div><button className="td-button td-button-primary" onClick={() => data.classrooms[0] && onAddStudent(data.classrooms[0].id)} disabled={!data.classrooms.length}><Plus size={15}/> Add student</button></div>
    <div className="td-filter-bar"><label className="td-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search students"/></label><select value={classFilter} onChange={event => setClassFilter(event.target.value)}><option value="all">All classrooms</option>{data.classrooms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
    {students.length ? <div className="td-panel td-table-panel"><div className="td-table-wrap"><table className="td-table"><thead><tr><th>Student</th><th>Classrooms</th><th>Submitted</th><th>Pending</th><th>Average score</th><th>Last activity</th><th/></tr></thead><tbody>{students.map(student => { const stats = statsForStudent(student); return <tr key={student.id}><td><strong>{student.name}</strong><small>{student.studentId || student.email || (student.demo ? 'Demo student' : 'Local record')}</small></td><td>{student.classroomIds.map(idValue => data.classrooms.find(item => item.id === idValue)?.name).filter(Boolean).join(', ') || '—'}</td><td>{stats.done}</td><td>{stats.pending}</td><td>{stats.average === null ? '—' : `${stats.average}%`}</td><td>{student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : '—'}</td><td><button className="td-button td-button-light td-small-button" onClick={() => setSelected(student)}>View profile</button></td></tr>; })}</tbody></table></div></div> : <div className="td-empty-state"><Users size={30}/><h2>{data.students.length ? 'No students found' : 'No students enrolled yet'}</h2><p>Add a student to a classroom or clear your filters.</p>{!data.students.length && data.classrooms[0] && <button className="td-button td-button-primary" onClick={() => onAddStudent(data.classrooms[0].id)}><Plus size={15}/> Add student</button>}</div>}
    {selected && <StudentProfileModal student={selected} data={data} onClose={() => setSelected(null)}/>}
  </div>;
}
