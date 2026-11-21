import { useMemo, useState } from 'react';
import { ArrowLeft, Copy, KeyRound, Plus, RefreshCw, Search, Trash2, UserMinus, Users } from 'lucide-react';
import type { Classroom, Student, TeacherDashboardData } from '../types';

export function ClassroomsPage({
  data,
  onCreate,
  onEdit,
  onDelete,
  onAddStudent,
  onRemoveStudent,
  onRegenerateCode,
}: {
  data: TeacherDashboardData;
  onCreate: () => void;
  onEdit: (classroom: Classroom) => void;
  onDelete: (classroom: Classroom) => void;
  onAddStudent: (classroomId: string) => void;
  onRemoveStudent: (classroomId: string, studentId: string) => void;
  onRegenerateCode: (classroomId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const classroom = data.classrooms.find(item => item.id === selectedId);
  const students = classroom ? data.students.filter(student => classroom.studentIds.includes(student.id)) : [];
  const visibleClassrooms = useMemo(() => data.classrooms.filter(item =>
    `${item.name} ${item.subject} ${item.grade} ${item.section}`.toLowerCase().includes(search.toLowerCase())),
  [data.classrooms, search]);
  const visibleStudents = students.filter(student =>
    `${student.name} ${student.studentId} ${student.email}`.toLowerCase().includes(rosterSearch.toLowerCase()));

  const copyCode = async () => {
    if (!classroom) return;
    try {
      await navigator.clipboard.writeText(classroom.joinCode);
      setCopyMessage('Join code copied');
    } catch {
      setCopyMessage(`Copy not available. Code: ${classroom.joinCode}`);
    }
    window.setTimeout(() => setCopyMessage(''), 2600);
  };

  if (classroom) {
    return <div className="td-page-content">
      <div className="td-page-heading"><div><button className="td-back-link" onClick={() => setSelectedId(null)}><ArrowLeft size={14}/> All classrooms</button><span className="td-kicker">{classroom.grade} · {classroom.board}</span><h1>{classroom.name}</h1><p>{classroom.subject} · Section {classroom.section} · Academic year {classroom.academicYear}</p></div><div className="td-heading-actions"><button className="td-button td-button-light" onClick={() => onEdit(classroom)}>Edit class</button><button className="td-button td-button-danger" onClick={() => onDelete(classroom)}><Trash2 size={15}/> Delete</button></div></div>
      <div className="td-detail-grid">
        <section className="td-panel td-join-panel"><div className="td-join-icon"><KeyRound size={20}/></div><div><span className="td-kicker">LOCAL DEMO ENROLLMENT</span><h2>Classroom join code</h2><p>Share in person for this demo only. It will not connect students across devices.</p><code>{classroom.joinCode}</code><div className="td-inline-actions"><button className="td-button td-button-light" onClick={copyCode}><Copy size={14}/> Copy code</button><button className="td-button td-button-light" onClick={() => onRegenerateCode(classroom.id)}><RefreshCw size={14}/> Regenerate</button>{copyMessage && <small role="status">{copyMessage}</small>}</div></div></section>
        <section className="td-panel td-roster-panel"><div className="td-section-head"><div><span className="td-kicker">CLASS ROSTER</span><h2>{students.length} students</h2></div><button className="td-button td-button-primary" onClick={() => onAddStudent(classroom.id)}><Plus size={15}/> Add student</button></div><label className="td-search"><Search size={16}/><input value={rosterSearch} onChange={event => setRosterSearch(event.target.value)} placeholder="Search roster"/></label>
          {visibleStudents.length ? <div className="td-table-wrap"><table className="td-table"><thead><tr><th>Student</th><th>Student ID</th><th>Email</th><th>Record</th><th/></tr></thead><tbody>{visibleStudents.map(student => <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.studentId || '—'}</td><td>{student.email || '—'}</td><td><span className={`td-demo-pill ${student.demo ? '' : 'local'}`}>{student.demo ? 'Demo' : 'Local'}</span></td><td><button className="td-icon-button td-danger-icon" aria-label={`Remove ${student.name}`} onClick={() => onRemoveStudent(classroom.id, student.id)}><UserMinus size={15}/></button></td></tr>)}</tbody></table></div> : <div className="td-empty-inline"><Users size={22}/><p>{students.length ? 'No students match this search.' : 'Add students manually to build a local demo roster.'}</p>{!students.length && <button className="td-button td-button-light" onClick={() => onAddStudent(classroom.id)}>Add student</button>}</div>}
        </section>
        <section className="td-panel td-roster-panel"><div className="td-section-head"><div><span className="td-kicker">CLASS DETAILS</span><h2>About this classroom</h2></div></div><p>{classroom.description || 'No classroom description has been added.'}</p><div className="td-info-grid"><span>Board<strong>{classroom.board}</strong></span><span>Grade<strong>{classroom.grade}</strong></span><span>Subject<strong>{classroom.subject}</strong></span><span>Section<strong>{classroom.section}</strong></span></div><div className="td-class-announcements"><div className="td-section-head"><div><span className="td-kicker">CLASS UPDATES</span><h3>Announcements</h3></div></div>{data.announcements.filter(item => item.classroomId === classroom.id).length ? data.announcements.filter(item => item.classroomId === classroom.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(item => <article key={item.id}><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString()}</small><p>{item.message}</p></article>) : <p>No local announcements for this classroom.</p>}</div></section>
      </div>
    </div>;
  }

  return <div className="td-page-content">
    <div className="td-page-heading"><div><span className="td-kicker">CLASS MANAGEMENT</span><h1>Classrooms</h1><p>Organize your classes, roster and local demo enrollment codes.</p></div><button className="td-button td-button-primary" onClick={onCreate}><Plus size={15}/> Create classroom</button></div>
    <label className="td-search td-list-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search classrooms by name, grade or subject"/></label>
    {visibleClassrooms.length ? <div className="td-classroom-grid">{visibleClassrooms.map(item => <article className="td-panel td-classroom-card" key={item.id}><div className="td-classroom-card-top"><span className="td-classroom-avatar"><Users size={18}/></span><span className="td-demo-pill">Local</span></div><h2>{item.name}</h2><p>{item.grade} · {item.board} · Section {item.section}</p><div className="td-classroom-card-subject">{item.subject}</div><div className="td-classroom-card-foot"><span><Users size={14}/>{item.studentIds.length} students</span><span>{item.academicYear}</span></div><button className="td-button td-button-light td-full-button" onClick={() => setSelectedId(item.id)}>Open classroom <ArrowLeft size={14}/></button></article>)}</div> : <div className="td-empty-state"><Users size={30}/><h2>{data.classrooms.length ? 'No classrooms found' : 'Start with your first classroom'}</h2><p>{data.classrooms.length ? 'Try another search.' : 'Create a classroom to organize students, assignments and learning resources.'}</p>{!data.classrooms.length && <button className="td-button td-button-primary" onClick={onCreate}><Plus size={15}/> Create classroom</button>}</div>}
  </div>;
}
