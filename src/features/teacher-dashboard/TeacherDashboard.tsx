import { useEffect, useRef, useState } from 'react';
import { BookOpenCheck, Boxes, ClipboardList, FileText, GraduationCap, LayoutDashboard, LogOut, Megaphone, RotateCcw, Users, X } from 'lucide-react';
import { useTeacherDashboard } from './hooks/useTeacherDashboard';
import { EditorModal, type EditorDraft } from './components/EditorModal';
import { ClassroomsPage } from './pages/ClassroomsPage';
import { OverviewPage } from './pages/OverviewPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { StudentsPage } from './pages/StudentsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { WorkPage } from './pages/WorkPage';
import type { Announcement, Assignment, Classroom, DPPS, Resource, TeacherDashboardData } from './types';
import './teacher-dashboard.css';

type PageId = 'overview' | 'classrooms' | 'assignments' | 'dpps' | 'submissions' | 'resources' | 'students';
type EditorKind = 'classroom' | 'student' | 'assignment' | 'dpps' | 'resource' | 'announcement';
type EditorRecord = Classroom | Assignment | DPPS | Resource | Announcement;
type EditorState = { kind: EditorKind; record?: EditorRecord; classroomId?: string };

const navigation: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'classrooms', label: 'Classrooms', icon: Users },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'dpps', label: 'DPPS', icon: BookOpenCheck },
  { id: 'submissions', label: 'Submissions', icon: FileText },
  { id: 'resources', label: 'Resources', icon: Boxes },
  { id: 'students', label: 'Students', icon: GraduationCap },
];

const pageTitle: Record<PageId, string> = {
  overview: 'Overview',
  classrooms: 'Classrooms',
  assignments: 'Assignments',
  dpps: 'DPPS',
  submissions: 'Submissions',
  resources: 'Resources & announcements',
  students: 'Students',
};

export interface TeacherDashboardProps {
  theme?: 'light' | 'dark' | 'system';
  className?: string;
  identity?: { fullName: string; email: string; schoolName: string };
  onLogout?: () => void;
}

export function TeacherDashboard({ theme = 'system', className = '', identity, onLogout }: TeacherDashboardProps) {
  const dashboard = useTeacherDashboard();
  const [page, setPage] = useState<PageId>('overview');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sessionFiles, setSessionFiles] = useState<Record<string, string>>({});
  const fileUrls = useRef<Record<string, string>>({});
  const data = dashboard.data;
  const teacherName = identity?.fullName || data.teacher.name;
  const teacherDetail = identity ? `${identity.schoolName} · ${identity.email}` : data.teacher.demo ? 'Demo teacher · no login' : data.teacher.email;
  const rootClass = `td-root ${className}`.trim();

  useEffect(() => () => {
    Object.values(fileUrls.current).forEach(url => URL.revokeObjectURL(url));
  }, []);

  const openEditor = (kind: EditorKind, record?: EditorRecord, classroomId?: string) => setEditor({ kind, record, classroomId });

  const saveEditor = (draft: EditorDraft) => {
    switch (draft.kind) {
      case 'classroom':
        if (editor?.record && 'joinCode' in editor.record) dashboard.updateClassroom(editor.record.id, draft.value);
        else dashboard.createClassroom(draft.value);
        break;
      case 'student':
        dashboard.addStudent(draft.classroomId, draft.value);
        break;
      case 'assignment':
        if (editor?.record && 'maxMarks' in editor.record) dashboard.updateAssignment(editor.record.id, draft.value);
        else dashboard.addAssignment(draft.value);
        break;
      case 'dpps':
        if (editor?.record && 'questions' in editor.record) dashboard.updateDpps(editor.record.id, draft.value);
        else dashboard.addDpps(draft.value);
        break;
      case 'resource':
        if (editor?.record && 'file' in editor.record && 'url' in editor.record) dashboard.updateResource(editor.record.id, draft.value);
        else dashboard.addResource(draft.value);
        break;
      case 'announcement':
        if (editor?.record && 'message' in editor.record) dashboard.updateAnnouncement(editor.record.id, draft.value);
        else dashboard.addAnnouncement(draft.value);
        break;
    }
    setEditor(null);
  };

  const addSessionFile = (file: File) => {
    const key = `${file.name}:${file.size}`;
    const old = fileUrls.current[key];
    if (old) URL.revokeObjectURL(old);
    const url = URL.createObjectURL(file);
    fileUrls.current[key] = url;
    setSessionFiles(current => ({ ...current, [key]: url }));
  };
  const getSessionFileUrl = (name: string, size: number) => sessionFiles[`${name}:${size}`];

  const deleteClassroom = (classroom: Classroom) => {
    if (window.confirm(`Delete "${classroom.name}" and its classroom-specific assignments, resources and submissions?`)) dashboard.deleteClassroom(classroom.id);
  };
  const deleteAssignment = (assignment: Assignment) => {
    if (window.confirm(`Delete "${assignment.title}" and its submission records?`)) dashboard.deleteAssignment(assignment.id);
  };
  const deleteDpps = (sheet: DPPS) => {
    if (window.confirm(`Delete "${sheet.title}" and its submission records?`)) dashboard.deleteDpps(sheet.id);
  };
  const deleteResource = (resource: Resource) => {
    if (window.confirm(`Delete resource "${resource.title}"?`)) dashboard.deleteResource(resource.id);
  };
  const deleteAnnouncement = (announcement: Announcement) => {
    if (window.confirm(`Delete announcement "${announcement.title}"?`)) dashboard.deleteAnnouncement(announcement.id);
  };
  const navigate = (nextPage: string) => {
    if (navigation.some(item => item.id === nextPage)) setPage(nextPage as PageId);
    setMobileNavOpen(false);
  };
  const resetDemo = () => {
    if (window.confirm('Replace all teacher dashboard data in this browser with the original demo dataset? This cannot be undone.')) dashboard.resetDemo();
  };

  return (
    <div className={rootClass} data-theme={theme}>
      <aside className={`td-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="td-brand"><span className="td-brand-mark"><GraduationCap size={19}/></span><span>EduBuddy <small>TEACHER</small></span><button className="td-icon-button td-mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={17}/></button></div>
        <div className="td-nav-caption">TEACHER WORKSPACE</div>
        <nav className="td-nav" aria-label="Teacher dashboard sections">{navigation.map(item => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={17}/><span>{item.label}</span>{item.id === 'submissions' && <b>{data.submissions.filter(submission => submission.status === 'submitted' || submission.status === 'under-review' || submission.status === 'late').length}</b>}</button>)}</nav>
        <div className="td-sidebar-bottom"><div className="td-local-note"><span className="td-local-dot"/><span>Local teacher workspace</span></div><div className="td-teacher-profile"><div className="td-profile-avatar">{teacherName.slice(0, 1)}</div><div><strong>{teacherName}</strong><small>{teacherDetail}</small></div></div>{onLogout && <button className="td-reset-button td-signout-button" onClick={onLogout}><LogOut size={14}/> Sign out</button>}<button className="td-reset-button" onClick={resetDemo}><RotateCcw size={14}/> Reset demo data</button></div>
      </aside>
      {mobileNavOpen && <button className="td-sidebar-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"/>}
      <main className="td-main">
        <header className="td-topbar"><button className="td-mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><span/><span/><span/></button><div className="td-breadcrumb">Teacher workspace <span>/</span> <strong>{pageTitle[page]}</strong></div><div className="td-topbar-status"><span className="td-demo-pill">{data.demoMode ? 'DEMO DATA' : 'LOCAL DATA'}</span><span className="td-topbar-teacher">{identity ? `${identity.schoolName} · ${teacherName}` : teacherName}</span></div></header>
        {dashboard.warning && <div className="td-global-alert" role="status"><span>{dashboard.warning}</span><button onClick={dashboard.dismissWarning}>Dismiss</button></div>}
        {dashboard.storageError && <div className="td-global-alert error" role="alert"><span>{dashboard.storageError}</span><button onClick={dashboard.dismissStorageError}>Dismiss</button></div>}
        {page === 'overview' && <OverviewPage data={data} teacherName={teacherName} onNavigate={navigate} onCreate={kind => openEditor(kind)}/>}
        {page === 'classrooms' && <ClassroomsPage
          data={data}
          onCreate={() => openEditor('classroom')}
          onEdit={classroom => openEditor('classroom', classroom)}
          onDelete={deleteClassroom}
          onAddStudent={classroomId => openEditor('student', undefined, classroomId)}
          onRemoveStudent={(classroomId, studentId) => {
            const student = data.students.find(item => item.id === studentId);
            if (student && window.confirm(`Remove ${student.name} from this classroom?`)) dashboard.removeStudent(classroomId, studentId);
          }}
          onRegenerateCode={classroomId => {
            if (window.confirm('Generate a new local demo join code? The old code will no longer be shown.')) dashboard.regenerateJoinCode(classroomId);
          }}
        />}
        {page === 'assignments' && <WorkPage kind="assignment" data={data} onCreate={() => openEditor('assignment')} onEdit={item => openEditor('assignment', item as Assignment)} onDelete={item => deleteAssignment(item as Assignment)} onDuplicate={dashboard.duplicateAssignment} onPublish={dashboard.publishAssignment}/>}
        {page === 'dpps' && <WorkPage kind="dpps" data={data} onCreate={() => openEditor('dpps')} onEdit={item => openEditor('dpps', item as DPPS)} onDelete={item => deleteDpps(item as DPPS)} onDuplicate={dashboard.duplicateDpps} onPublish={dashboard.publishDpps}/>}
        {page === 'submissions' && <SubmissionsPage data={data} onReview={dashboard.reviewSubmission}/>}
        {page === 'students' && <StudentsPage data={data} onAddStudent={classroomId => openEditor('student', undefined, classroomId)}/>}
        {page === 'resources' && <ResourcesPage
          data={data}
          onCreateResource={() => openEditor('resource')}
          onEditResource={resource => openEditor('resource', resource)}
          onDeleteResource={deleteResource}
          onCreateAnnouncement={() => openEditor('announcement')}
          onEditAnnouncement={announcement => openEditor('announcement', announcement)}
          onDeleteAnnouncement={deleteAnnouncement}
          getFileUrl={getSessionFileUrl}
        />}
        <footer className="td-footer">EduBuddy Teacher Dashboard <span>·</span> Local demo MVP — not connected to student accounts</footer>
      </main>
      {mobileNavOpen && <span className="td-screen-reader-only">Navigation menu open</span>}
      {editor && <EditorModal kind={editor.kind} record={editor.record} classroomId={editor.classroomId} data={data} onClose={() => setEditor(null)} onSave={saveEditor} onFileSelected={addSessionFile}/>}
    </div>
  );
}

export default TeacherDashboard;
