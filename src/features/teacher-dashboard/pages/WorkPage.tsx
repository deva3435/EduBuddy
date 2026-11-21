import { useMemo, useState } from 'react';
import { ArrowDownUp, ClipboardList, Copy, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { Assignment, DPPS, TeacherDashboardData, WorkKind } from '../types';

type WorkItem = Assignment | DPPS;

const isDpps = (item: WorkItem): item is DPPS => 'questions' in item;
const workMarks = (item: WorkItem) => isDpps(item) ? item.questions.reduce((total, question) => total + question.marks, 0) : item.maxMarks;

function getWorkStatus(item: WorkItem, data: TeacherDashboardData) {
  if (item.status === 'draft') return { label: 'Draft', tone: 'neutral' };
  const submissions = data.submissions.filter(submission => submission.workId === item.id);
  if (submissions.length && submissions.every(submission => submission.status === 'reviewed')) return { label: 'Completed', tone: 'green' };
  const due = new Date(item.dueAt).getTime();
  const now = Date.now();
  if (due < now) return { label: 'Overdue', tone: 'red' };
  if (due - now < 48 * 60 * 60 * 1000) return { label: 'Due soon', tone: 'amber' };
  if (due - now < 7 * 24 * 60 * 60 * 1000) return { label: 'Active', tone: 'blue' };
  return { label: 'Upcoming', tone: 'blue' };
}

function classroomTitle(data: TeacherDashboardData, classroomId: string) {
  return data.classrooms.find(item => item.id === classroomId)?.name || 'Classroom removed';
}

function DppsPreview({ sheet, data, onClose }: { sheet: DPPS; data: TeacherDashboardData; onClose: () => void }) {
  return <div className="td-modal-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="td-modal td-preview-modal" role="dialog" aria-modal="true" aria-labelledby="td-preview-title"><header className="td-modal-head"><div><span className="td-kicker">EDUBUDDY · DAILY PRACTICE</span><h2 id="td-preview-title">{sheet.title}</h2><p>{sheet.grade} · {sheet.subject} · {sheet.topic}</p></div><button className="td-icon-button" onClick={onClose} aria-label="Close preview">×</button></header><div className="td-preview-body"><div className="td-preview-meta"><span><b>Class</b>{classroomTitle(data, sheet.classroomId)}</span><span><b>Deadline</b>{new Date(sheet.dueAt).toLocaleString()}</span><span><b>Total marks</b>{workMarks(sheet)}</span></div>{sheet.instructions && <div className="td-preview-instructions"><b>Instructions</b><p>{sheet.instructions}</p></div>}<ol className="td-preview-questions">{sheet.questions.map(question => <li key={question.id}><div><strong>{question.text || 'Untitled question'}</strong><span>{question.marks} mark{question.marks === 1 ? '' : 's'} · {question.type.replace('-', ' ')}</span></div>{question.options.length > 0 && <ul>{question.options.map((option, index) => <li key={index}>{option || `Option ${index + 1}`}</li>)}</ul>}</li>)}</ol><p className="td-demo-note">Preview only. This local workspace does not distribute sheets to student accounts.</p></div></section></div>;
}

export function WorkPage({
  kind,
  data,
  onCreate,
  onEdit,
  onDelete,
  onDuplicate,
  onPublish,
}: {
  kind: WorkKind;
  data: TeacherDashboardData;
  onCreate: () => void;
  onEdit: (item: WorkItem) => void;
  onDelete: (item: WorkItem) => void;
  onDuplicate: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'created'>('deadline');
  const [preview, setPreview] = useState<DPPS | null>(null);
  const workItems: WorkItem[] = kind === 'assignment' ? data.assignments : data.dpps;
  const subjects = [...new Set(workItems.map(item => item.subject))].sort();
  const visible = useMemo(() => workItems
    .filter(item => classFilter === 'all' || item.classroomId === classFilter)
    .filter(item => subjectFilter === 'all' || item.subject === subjectFilter)
    .filter(item => statusFilter === 'all'
      || (statusFilter === 'draft' ? item.status === 'draft'
        : statusFilter === 'published' ? item.status === 'published'
          : getWorkStatus(item, data).label.toLowerCase().replace(' ', '-') === statusFilter))
    .filter(item => `${item.title} ${item.subject} ${'topic' in item ? item.topic : ''}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'deadline' ? a.dueAt.localeCompare(b.dueAt) : b.createdAt.localeCompare(a.createdAt)),
  [workItems, classFilter, subjectFilter, statusFilter, search, sortBy, data]);
  const label = kind === 'dpps' ? 'DPPS sheets' : 'Assignments';

  return <div className="td-page-content">
    <div className="td-page-heading"><div><span className="td-kicker">{kind === 'dpps' ? 'DAILY PRACTICE PROBLEM SHEETS' : 'ASSIGNMENT MANAGEMENT'}</span><h1>{label}</h1><p>{kind === 'dpps' ? 'Build structured practice sheets with question-by-question marks and a student-ready preview.' : 'Create, publish and track classroom work and deadlines.'}</p></div><button className="td-button td-button-primary" onClick={onCreate}><Plus size={15}/>{kind === 'dpps' ? 'Create DPPS' : 'Create assignment'}</button></div>
    <div className="td-filter-bar"><label className="td-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${label.toLowerCase()}`}/></label><select value={classFilter} onChange={event => setClassFilter(event.target.value)}><option value="all">All classrooms</option>{data.classrooms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={subjectFilter} onChange={event => setSubjectFilter(event.target.value)}><option value="all">All subjects</option>{subjects.map(item => <option key={item}>{item}</option>)}</select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="due-soon">Due soon</option><option value="overdue">Overdue</option><option value="completed">Completed</option></select><button className="td-button td-button-light td-sort-button" onClick={() => setSortBy(current => current === 'deadline' ? 'created' : 'deadline')}><ArrowDownUp size={14}/>{sortBy === 'deadline' ? 'By deadline' : 'By created'}</button></div>
    {visible.length ? <div className="td-work-list">{visible.map(item => {
      const currentStatus = getWorkStatus(item, data);
      const progress = data.submissions.filter(submission => submission.workId === item.id);
      const turnedIn = progress.filter(submission => submission.status !== 'not-submitted').length;
      const total = workMarks(item);
      return <article className="td-panel td-work-card" key={item.id}><div className="td-work-main"><div className="td-work-type-icon">{isDpps(item) ? <ClipboardList size={18}/> : <span>{item.type}</span>}</div><div className="td-work-copy"><div className="td-work-topline">{item.status === 'published' && <span className="td-status-pill tone-green">Published</span>}<span className={`td-status-pill tone-${currentStatus.tone}`}>{currentStatus.label}</span>{item.status === 'draft' && <span className="td-status-pill tone-neutral">Not shared</span>}</div><h2>{item.title}</h2><p>{classroomTitle(data, item.classroomId)} · {item.grade} · {item.subject}{item.topic ? ` · ${item.topic}` : ''}</p><div className="td-work-meta"><span>Due {new Date(item.dueAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span><span>{total} marks</span><span>{turnedIn}/{progress.length} submitted</span></div></div></div><div className="td-work-actions">{isDpps(item) && <button className="td-icon-action" title="Preview worksheet" onClick={() => setPreview(item)}><Eye size={15}/></button>}<button className="td-icon-action" title="Duplicate" onClick={() => onDuplicate(item.id)}><Copy size={15}/></button><button className="td-icon-action" title="Edit" onClick={() => onEdit(item)}><Pencil size={15}/></button>{item.status === 'draft' && <button className="td-button td-button-primary" onClick={() => onPublish(item.id)}>Publish</button>}<button className="td-icon-action td-danger-icon" title="Delete" onClick={() => onDelete(item)}><Trash2 size={15}/></button></div></article>;
    })}</div> : <div className="td-empty-state"><ClipboardList size={30}/><h2>{workItems.length ? 'No matching work' : `No ${label.toLowerCase()} yet`}</h2><p>{workItems.length ? 'Change or clear your filters to see other items.' : `Create ${kind === 'dpps' ? 'a practice sheet' : 'an assignment'} to get started.`}</p>{!workItems.length && <button className="td-button td-button-primary" onClick={onCreate}><Plus size={15}/> Create {kind === 'dpps' ? 'DPPS' : 'assignment'}</button>}</div>}
    {preview && <DppsPreview sheet={preview} data={data} onClose={() => setPreview(null)}/>}
  </div>;
}
