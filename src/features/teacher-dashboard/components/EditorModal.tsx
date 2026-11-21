import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react';
import type {
  Announcement,
  AnnouncementDraft,
  Assignment,
  AssignmentDraft,
  AssignmentType,
  Classroom,
  ClassroomDraft,
  DPPS,
  DPPSDraft,
  DppsQuestion,
  LocalFileMetadata,
  Resource,
  ResourceDraft,
  ResourceType,
  Student,
  StudentDraft,
  TeacherDashboardData,
} from '../types';

type EditorKind = 'classroom' | 'student' | 'assignment' | 'dpps' | 'resource' | 'announcement';
type EditorRecord = Classroom | Student | Assignment | DPPS | Resource | Announcement;
export type EditorDraft =
  | { kind: 'classroom'; value: ClassroomDraft }
  | { kind: 'student'; classroomId: string; value: StudentDraft }
  | { kind: 'assignment'; value: AssignmentDraft }
  | { kind: 'dpps'; value: DPPSDraft }
  | { kind: 'resource'; value: ResourceDraft }
  | { kind: 'announcement'; value: AnnouncementDraft };

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const nextWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const dateTimeInput = (iso?: string) => {
  if (!iso) return `${nextWeek()}T15:00`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return `${nextWeek()}T15:00`;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
const toIso = (value: string) => new Date(value).toISOString();
const newQuestion = (): DppsQuestion => ({ id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type: 'short-answer', text: '', marks: 1, options: ['', '', '', ''], correctAnswer: '', explanation: '' });
const getTitle = (kind: EditorKind, edit: boolean) => `${edit ? 'Edit' : 'Create'} ${kind === 'dpps' ? 'DPPS' : kind}`;

export function EditorModal({
  kind,
  record,
  classroomId,
  data,
  onClose,
  onSave,
  onFileSelected,
}: {
  kind: EditorKind;
  record?: EditorRecord;
  classroomId?: string;
  data: TeacherDashboardData;
  onClose: () => void;
  onSave: (draft: EditorDraft) => void;
  onFileSelected?: (file: File) => void;
}) {
  const classroom = record && kind === 'classroom' ? record as Classroom : undefined;
  const student = record && kind === 'student' ? record as Student : undefined;
  const assignment = record && kind === 'assignment' ? record as Assignment : undefined;
  const dpps = record && kind === 'dpps' ? record as DPPS : undefined;
  const resource = record && kind === 'resource' ? record as Resource : undefined;
  const announcement = record && kind === 'announcement' ? record as Announcement : undefined;
  const associatedClassId = classroomId || assignment?.classroomId || dpps?.classroomId || resource?.classroomId || announcement?.classroomId;
  const initialClassId = associatedClassId || data.classrooms[0]?.id || '';
  const currentClassroom = data.classrooms.find(item => item.id === initialClassId);

  const [name, setName] = useState(classroom?.name || '');
  const [grade, setGrade] = useState(classroom?.grade || currentClassroom?.grade || 'Class 10');
  const [board, setBoard] = useState<Classroom['board']>(classroom?.board || 'CBSE');
  const [subject, setSubject] = useState(classroom?.subject || assignment?.subject || dpps?.subject || resource?.subject || currentClassroom?.subject || '');
  const [section, setSection] = useState(classroom?.section || 'A');
  const [description, setDescription] = useState(classroom?.description || assignment?.description || dpps?.instructions || resource?.description || '');
  const [academicYear, setAcademicYear] = useState(classroom?.academicYear || '2026–27');
  const [studentName, setStudentName] = useState(student?.name || '');
  const [studentCode, setStudentCode] = useState(student?.studentId || '');
  const [email, setEmail] = useState(student?.email || '');
  const [classId, setClassId] = useState(initialClassId);
  const [title, setTitle] = useState(assignment?.title || dpps?.title || resource?.title || announcement?.title || '');
  const [topic, setTopic] = useState(assignment?.topic || dpps?.topic || resource?.topic || '');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(assignment?.type || 'Homework');
  const [maxMarks, setMaxMarks] = useState(String(assignment?.maxMarks || 20));
  const [dueAt, setDueAt] = useState(dateTimeInput(assignment?.dueAt || dpps?.dueAt));
  const [status, setStatus] = useState<'draft' | 'published'>(assignment?.status || dpps?.status || 'draft');
  const [teacherNotes, setTeacherNotes] = useState(assignment?.teacherNotes || '');
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>(assignment?.resourceIds || []);
  const [attachments, setAttachments] = useState<LocalFileMetadata[]>(assignment?.attachments || []);
  const [questions, setQuestions] = useState<DppsQuestion[]>(dpps?.questions || [newQuestion()]);
  const [publicationDate, setPublicationDate] = useState(dpps?.publicationDate || today());
  const [resourceType, setResourceType] = useState<ResourceType>(resource?.type || 'PDF/document');
  const [url, setUrl] = useState(resource?.url || '');
  const [file, setFile] = useState<LocalFileMetadata | undefined>(resource?.file);
  const [message, setMessage] = useState(announcement?.message || '');
  const [error, setError] = useState('');
  const [fileNotice, setFileNotice] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const availableResources = useMemo(() => data.resources.filter(item => !classId || item.classroomId === classId), [data.resources, classId]);
  const dppsTotal = questions.reduce((total, question) => total + Math.max(0, Number(question.marks) || 0), 0);

  const handleFile = (selected: File | undefined, target: 'assignment' | 'resource') => {
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      setFileNotice('Files over 10 MB are not accepted.');
      return;
    }
    const metadata: LocalFileMetadata = { name: selected.name, type: selected.type || 'application/octet-stream', size: selected.size, sessionOnly: true };
    onFileSelected?.(selected);
    if (target === 'assignment') setAttachments(current => [...current, metadata]);
    else setFile(metadata);
    setFileNotice(`${selected.name} is available in this browser session only. File contents are not uploaded or saved.`);
  };

  const updateQuestion = (questionId: string, patch: Partial<DppsQuestion>) => {
    setQuestions(current => current.map(question => question.id === questionId ? { ...question, ...patch } : question));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (kind === 'classroom') {
      if (!name.trim() || !subject.trim() || !grade || !section.trim() || !academicYear.trim()) return setError('Complete the required classroom fields.');
      onSave({ kind, value: { name: name.trim(), grade, board, subject: subject.trim(), section: section.trim(), description: description.trim(), academicYear: academicYear.trim() } });
      return;
    }
    if (kind === 'student') {
      if (!studentName.trim() || !classId) return setError('Enter the student name and choose a classroom.');
      onSave({ kind, classroomId: classId, value: { name: studentName.trim(), studentId: studentCode.trim(), email: email.trim(), classroomIds: [classId], lastActivity: undefined } });
      return;
    }
    if (!title.trim() || !classId) return setError('Enter a title and select a classroom.');
    if (kind === 'assignment') {
      if (!dueAt || !Number.isFinite(Number(maxMarks)) || Number(maxMarks) <= 0) return setError('Add a valid deadline and maximum marks greater than zero.');
      const selectedClass = data.classrooms.find(item => item.id === classId);
      onSave({ kind, value: { title: title.trim(), description: description.trim(), classroomId: classId, subject: subject || selectedClass?.subject || '', grade: selectedClass?.grade || grade, topic: topic.trim(), type: assignmentType, maxMarks: Number(maxMarks), dueAt: toIso(dueAt), status, attachments, resourceIds: selectedResourceIds, teacherNotes: teacherNotes.trim() } });
      return;
    }
    if (kind === 'dpps') {
      if (!questions.length || questions.some(question => !question.text.trim())) return setError('Complete or remove each blank question before saving the DPPS.');
      if (questions.some(question => !Number.isFinite(Number(question.marks)) || Number(question.marks) <= 0)) return setError('Each question needs positive marks.');
      const selectedClass = data.classrooms.find(item => item.id === classId);
      const finalizedQuestions = questions.map(question => ({
        ...question,
        text: question.text.trim(),
        marks: Number(question.marks),
        options: question.type === 'multiple-choice' ? question.options.map(option => option.trim()).filter(Boolean) : [],
      }));
      if (finalizedQuestions.some(question => question.type === 'multiple-choice' && question.options.length < 2)) return setError('Each multiple-choice question needs at least two options.');
      onSave({ kind, value: { title: title.trim(), classroomId: classId, grade: selectedClass?.grade || grade, subject: subject || selectedClass?.subject || '', topic: topic.trim(), instructions: description.trim(), publicationDate, dueAt: toIso(dueAt), questions: finalizedQuestions, status } });
      return;
    }
    if (kind === 'resource') {
      if (!subject.trim() || !url.trim() && !file) return setError('Select a subject and provide a URL or choose a file.');
      if (url.trim()) {
        try { new URL(url); } catch { return setError('Enter a valid URL including https://.'); }
      }
      onSave({ kind, value: { title: title.trim(), description: description.trim(), classroomId: classId, subject: subject.trim(), topic: topic.trim(), type: resourceType, url: url.trim(), file } });
      return;
    }
    if (!message.trim()) return setError('Write the announcement message.');
    onSave({ kind, value: { classroomId: classId, title: title.trim(), message: message.trim() } });
  };

  return (
    <div className="td-modal-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="td-modal" role="dialog" aria-modal="true" aria-labelledby="td-editor-title">
        <header className="td-modal-head">
          <div><span className="td-kicker">{record ? 'UPDATE RECORD' : 'NEW RECORD'}</span><h2 id="td-editor-title">{getTitle(kind, Boolean(record))}</h2></div>
          <button type="button" className="td-icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </header>
        <form className="td-modal-form" onSubmit={submit}>
          <div className="td-form-grid">
            {kind === 'classroom' && <>
              <label className="td-field td-wide"><span>Classroom name *</span><input required value={name} onChange={event => setName(event.target.value)} placeholder="Class 10 Mathematics" /></label>
              <label className="td-field"><span>Grade *</span><select value={grade} onChange={event => setGrade(event.target.value)}>{Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`).map(value => <option key={value}>{value}</option>)}</select></label>
              <label className="td-field"><span>Board *</span><select value={board} onChange={event => setBoard(event.target.value as Classroom['board'])}>{['CBSE', 'ICSE', 'State Board', 'Other'].map(value => <option key={value}>{value}</option>)}</select></label>
              <label className="td-field"><span>Subject *</span><input required value={subject} onChange={event => setSubject(event.target.value)} placeholder="Mathematics" /></label>
              <label className="td-field"><span>Section *</span><input required value={section} onChange={event => setSection(event.target.value)} placeholder="A" /></label>
              <label className="td-field"><span>Academic year *</span><input required value={academicYear} onChange={event => setAcademicYear(event.target.value)} /></label>
              <label className="td-field td-wide"><span>Description</span><textarea rows={3} value={description} onChange={event => setDescription(event.target.value)} /></label>
            </>}
            {kind === 'student' && <>
              <label className="td-field td-wide"><span>Student name *</span><input required value={studentName} onChange={event => setStudentName(event.target.value)} placeholder="Student's name" /></label>
              <label className="td-field"><span>Student ID (optional)</span><input value={studentCode} onChange={event => setStudentCode(event.target.value)} placeholder="e.g. 10A-022" /></label>
              <label className="td-field"><span>Email (optional)</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="student@example.edu" /></label>
              {!classroomId && <label className="td-field td-wide"><span>Classroom *</span><select value={classId} onChange={event => setClassId(event.target.value)}>{data.classrooms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
              <p className="td-demo-note td-wide">This adds a student record to this browser only. It does not enroll a real account.</p>
            </>}
            {['assignment', 'dpps', 'resource', 'announcement'].includes(kind) && <>
              <label className="td-field td-wide"><span>{kind === 'announcement' ? 'Announcement title' : kind === 'resource' ? 'Resource title' : kind === 'dpps' ? 'DPPS title' : 'Assignment title'} *</span><input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Enter a clear title" /></label>
              <label className="td-field td-wide"><span>Classroom *</span><select required value={classId} onChange={event => {
                const nextClass = data.classrooms.find(item => item.id === event.target.value);
                setClassId(event.target.value);
                if (nextClass) { setSubject(nextClass.subject); setGrade(nextClass.grade); }
              }}>{data.classrooms.map(item => <option key={item.id} value={item.id}>{item.name} · {item.subject}</option>)}</select></label>
              {kind !== 'announcement' && <>
                <label className="td-field"><span>Subject *</span><input required value={subject} onChange={event => setSubject(event.target.value)} placeholder="Subject" /></label>
                {(kind === 'assignment' || kind === 'dpps') && <label className="td-field"><span>Topic / chapter</span><input value={topic} onChange={event => setTopic(event.target.value)} placeholder="Chapter or topic" /></label>}
              </>}
              {kind === 'assignment' && <>
                <label className="td-field"><span>Type</span><select value={assignmentType} onChange={event => setAssignmentType(event.target.value as AssignmentType)}>{['Homework', 'Classwork', 'Project', 'Worksheet', 'Test', 'Other'].map(value => <option key={value}>{value}</option>)}</select></label>
                <label className="td-field"><span>Maximum marks *</span><input type="number" min="1" step="1" required value={maxMarks} onChange={event => setMaxMarks(event.target.value)} /></label>
                <label className="td-field"><span>Due date and time *</span><input type="datetime-local" required value={dueAt} onChange={event => setDueAt(event.target.value)} /></label>
                <label className="td-field"><span>Status</span><select value={status} onChange={event => setStatus(event.target.value as 'draft' | 'published')}><option value="draft">Save as draft</option><option value="published">Publish now</option></select></label>
                <label className="td-field td-wide"><span>Instructions</span><textarea rows={3} value={description} onChange={event => setDescription(event.target.value)} /></label>
                <label className="td-field td-wide"><span>Teacher notes (private)</span><textarea rows={2} value={teacherNotes} onChange={event => setTeacherNotes(event.target.value)} /></label>
                <div className="td-field td-wide"><span>Share existing resources</span><div className="td-choice-list">{availableResources.length ? availableResources.map(item => <label key={item.id}><input type="checkbox" checked={selectedResourceIds.includes(item.id)} onChange={event => setSelectedResourceIds(list => event.target.checked ? [...list, item.id] : list.filter(idValue => idValue !== item.id))} />{item.title}</label>) : <small>No resources for this classroom yet.</small>}</div></div>
                <div className="td-field td-wide"><span>Optional attachment · 10 MB limit</span><input type="file" onChange={event => handleFile(event.target.files?.[0], 'assignment')} /><small className="td-help">File contents are session-only in this local demo; metadata persists.</small>{attachments.map((item, index) => <span className="td-file-note" key={`${item.name}-${index}`}>{item.name} · {(item.size / 1024).toFixed(0)} KB · session-only <button type="button" onClick={() => setAttachments(list => list.filter((_, fileIndex) => fileIndex !== index))}>Remove</button></span>)}</div>
              </>}
              {kind === 'dpps' && <>
                <label className="td-field"><span>Publication date *</span><input type="date" required value={publicationDate} onChange={event => setPublicationDate(event.target.value)} /></label>
                <label className="td-field"><span>Submission deadline *</span><input type="datetime-local" required value={dueAt} onChange={event => setDueAt(event.target.value)} /></label>
                <label className="td-field"><span>Status</span><select value={status} onChange={event => setStatus(event.target.value as 'draft' | 'published')}><option value="draft">Save as draft</option><option value="published">Publish now</option></select></label>
                <label className="td-field"><span>Total marks</span><input readOnly value={dppsTotal} /></label>
                <label className="td-field td-wide"><span>Instructions</span><textarea rows={2} value={description} onChange={event => setDescription(event.target.value)} /></label>
                <div className="td-field td-wide"><div className="td-question-head"><span>Questions</span><strong>{dppsTotal} total marks</strong></div>
                  {questions.map((question, index) => <article className="td-question-editor" key={question.id}>
                    <div className="td-question-top"><strong>Question {index + 1}</strong><div><button type="button" disabled={index === 0} onClick={() => setQuestions(list => { const next = [...list]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })} aria-label="Move question up"><ArrowUp size={14} /></button><button type="button" disabled={index === questions.length - 1} onClick={() => setQuestions(list => { const next = [...list]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return next; })} aria-label="Move question down"><ArrowDown size={14} /></button><button type="button" onClick={() => setQuestions(list => list.filter(item => item.id !== question.id))} aria-label="Delete question"><Trash2 size={14} /></button></div></div>
                    <label className="td-field"><span>Question text</span><textarea rows={2} value={question.text} onChange={event => updateQuestion(question.id, { text: event.target.value })} /></label>
                    <div className="td-inline-fields"><label className="td-field"><span>Type</span><select value={question.type} onChange={event => updateQuestion(question.id, { type: event.target.value as DppsQuestion['type'] })}><option value="multiple-choice">Multiple choice</option><option value="short-answer">Short answer</option><option value="long-answer">Long answer</option></select></label><label className="td-field"><span>Marks</span><input type="number" min="1" value={question.marks} onChange={event => updateQuestion(question.id, { marks: Number(event.target.value) })} /></label></div>
                    {question.type === 'multiple-choice' && <div className="td-mcq-grid">{question.options.map((option, optionIndex) => <label className="td-field" key={optionIndex}><span>Option {optionIndex + 1}</span><input value={option} onChange={event => updateQuestion(question.id, { options: question.options.map((current, currentIndex) => currentIndex === optionIndex ? event.target.value : current) })} /></label>)}</div>}
                    <label className="td-field"><span>Correct answer (optional)</span><input value={question.correctAnswer} onChange={event => updateQuestion(question.id, { correctAnswer: event.target.value })} /></label>
                    <label className="td-field"><span>Explanation (optional)</span><textarea rows={2} value={question.explanation} onChange={event => updateQuestion(question.id, { explanation: event.target.value })} /></label>
                  </article>)}
                  <button type="button" className="td-button td-button-light" onClick={() => setQuestions(list => [...list, newQuestion()])}><Plus size={15} /> Add question</button>
                </div>
              </>}
              {kind === 'resource' && <>
                <label className="td-field"><span>Topic</span><input value={topic} onChange={event => setTopic(event.target.value)} /></label>
                <label className="td-field"><span>Resource type</span><select value={resourceType} onChange={event => setResourceType(event.target.value as ResourceType)}>{['PDF/document', 'Video', 'Website', 'Image', 'Other'].map(value => <option key={value}>{value}</option>)}</select></label>
                <label className="td-field td-wide"><span>URL (optional if attaching a file)</span><input type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://" /></label>
                <label className="td-field td-wide"><span>File · 10 MB limit</span><input type="file" onChange={event => handleFile(event.target.files?.[0], 'resource')} /><small className="td-help">This local demo does not upload files. File metadata persists; contents are session-only.</small>{file && <span className="td-file-note">{file.name} · {(file.size / 1024).toFixed(0)} KB · session-only</span>}</label>
                <label className="td-field td-wide"><span>Description</span><textarea rows={3} value={description} onChange={event => setDescription(event.target.value)} /></label>
              </>}
              {kind === 'announcement' && <label className="td-field td-wide"><span>Announcement message *</span><textarea required rows={5} value={message} onChange={event => setMessage(event.target.value)} /></label>}
            </>}
          </div>
          {fileNotice && <p className="td-inline-notice" role="status">{fileNotice}</p>}
          {error && <p className="td-form-error" role="alert">{error}</p>}
          <footer className="td-modal-actions"><button type="button" className="td-button td-button-light" onClick={onClose}>Cancel</button><button type="submit" className="td-button td-button-primary">{record ? 'Save changes' : kind === 'student' ? 'Add student' : status === 'published' && (kind === 'assignment' || kind === 'dpps') ? 'Publish' : 'Save'}</button></footer>
        </form>
      </section>
    </div>
  );
}
