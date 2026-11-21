import { useMemo } from 'react';
import { ArrowRight, BookOpenCheck, CalendarClock, ClipboardList, GraduationCap, Megaphone, Plus, TrendingUp, Users } from 'lucide-react';
import type { TeacherDashboardData } from '../types';

function className(data: TeacherDashboardData, id: string) {
  return data.classrooms.find(item => item.id === id)?.name || 'Classroom removed';
}

function maximumMarks(item: (TeacherDashboardData['assignments'][number] | TeacherDashboardData['dpps'][number])) {
  return 'questions' in item ? item.questions.reduce((total, question) => total + question.marks, 0) : item.maxMarks;
}

export function OverviewPage({
  data,
  teacherName,
  onNavigate,
  onCreate,
}: {
  data: TeacherDashboardData;
  teacherName?: string;
  onNavigate: (page: string) => void;
  onCreate: (kind: 'classroom' | 'assignment' | 'dpps' | 'announcement') => void;
}) {
  const publishedWorks = [...data.assignments.filter(item => item.status === 'published'), ...data.dpps.filter(item => item.status === 'published')];
  const allSubmissions = data.submissions.filter(submission => publishedWorks.some(work => work.id === submission.workId));
  const submitted = allSubmissions.filter(item => item.status !== 'not-submitted');
  const reviewed = allSubmissions.filter(item => item.status === 'reviewed');
  const scores = reviewed.map(item => {
    const work = publishedWorks.find(candidate => candidate.id === item.workId);
    const maximum = work ? maximumMarks(work) : 0;
    return maximum && item.review ? item.review.marks / maximum * 100 : null;
  }).filter((score): score is number => score !== null);
  const average = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : null;
  const completionRate = allSubmissions.length ? Math.round(submitted.length / allSubmissions.length * 100) : 0;
  const scoreTrend = reviewed.map(item => {
    const work = publishedWorks.find(candidate => candidate.id === item.workId);
    const maximum = work ? maximumMarks(work) : 0;
    return maximum && item.review ? { score: Math.round(item.review.marks / maximum * 100), date: item.review.reviewedAt } : null;
  }).filter((point): point is { score: number; date: string } => point !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-8);
  const trendPoints = scoreTrend.map((point, index) => {
    const x = scoreTrend.length === 1 ? 150 : 20 + index * (260 / (scoreTrend.length - 1));
    const y = 112 - point.score * .9;
    return `${x},${y}`;
  }).join(' ');
  const distribution = [
    { label: 'Pending', count: allSubmissions.filter(item => item.status === 'not-submitted').length, tone: 'amber' },
    { label: 'Submitted', count: allSubmissions.filter(item => item.status === 'submitted' || item.status === 'under-review').length, tone: 'blue' },
    { label: 'Late', count: allSubmissions.filter(item => item.status === 'late').length, tone: 'red' },
    { label: 'Reviewed', count: reviewed.length, tone: 'teal' },
  ];
  const deadlines = useMemo(() => publishedWorks
    .map(work => ({ ...work, classroomName: className(data, work.classroomId), workKind: 'questions' in work ? 'DPPS' : 'Assignment' }))
    .filter(work => new Date(work.dueAt).getTime() >= Date.now())
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, 4), [publishedWorks, data]);
  const announcements = [...data.announcements].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <div className="td-page-content">
      {data.demoMode && <div className="td-demo-banner"><span>DEMO WORKSPACE</span> Fictional teacher, classroom and submission records are stored only in this browser.</div>}
      <div className="td-page-heading"><div><span className="td-kicker">TEACHER OVERVIEW</span><h1>Good day, {(teacherName || data.teacher.name).split(' ')[0]}</h1><p>Your classrooms, student work and upcoming deadlines at a glance.</p></div><div className="td-heading-actions"><button className="td-button td-button-light" onClick={() => onCreate('classroom')}><Plus size={15} /> Classroom</button><button className="td-button td-button-primary" onClick={() => onCreate('assignment')}><Plus size={15} /> Assignment</button></div></div>
      <div className="td-stats-grid">
        <article className="td-stat-card"><span className="td-stat-icon teal"><Users size={18}/></span><div><strong>{data.classrooms.length}</strong><small>Classrooms</small></div></article>
        <article className="td-stat-card"><span className="td-stat-icon violet"><GraduationCap size={18}/></span><div><strong>{data.students.length}</strong><small>Students</small></div></article>
        <article className="td-stat-card"><span className="td-stat-icon amber"><ClipboardList size={18}/></span><div><strong>{publishedWorks.length}</strong><small>Published work</small></div></article>
        <article className="td-stat-card"><span className="td-stat-icon coral"><BookOpenCheck size={18}/></span><div><strong>{Math.max(0, allSubmissions.length - submitted.length)}</strong><small>Pending submissions</small></div></article>
        <article className="td-stat-card"><span className="td-stat-icon blue"><TrendingUp size={18}/></span><div><strong>{average === null ? '—' : `${average}%`}</strong><small>Average reviewed score</small></div></article>
      </div>
      <div className="td-overview-grid">
        <section className="td-panel td-overview-panel">
          <div className="td-section-head"><div><span className="td-kicker">CLASSROOMS</span><h2>Your classes</h2></div><button className="td-text-button" onClick={() => onNavigate('classrooms')}>View all <ArrowRight size={14}/></button></div>
          {data.classrooms.length ? <div className="td-classroom-list">{data.classrooms.slice(0, 4).map(classroom => <button className="td-classroom-row" key={classroom.id} onClick={() => onNavigate('classrooms')}><span className="td-classroom-avatar"><Users size={17}/></span><span className="td-classroom-copy"><strong>{classroom.name}</strong><small>{classroom.grade} · {classroom.subject} · {classroom.studentIds.length} students</small></span><ArrowRight size={15}/></button>)}</div> : <div className="td-empty-inline"><p>Create a classroom to organize students, assignments and shared resources.</p><button className="td-button td-button-primary" onClick={() => onCreate('classroom')}>Create classroom</button></div>}
          <div className="td-completion-summary"><div><span>Submission completion</span><strong>{completionRate}%</strong></div><div className="td-progress"><span style={{ width: `${completionRate}%` }}/></div><small>{submitted.length} submitted of {allSubmissions.length} assigned student tasks</small></div>
        </section>
        <section className="td-panel td-overview-panel">
          <div className="td-section-head"><div><span className="td-kicker">COMING UP</span><h2>Work deadlines</h2></div><CalendarClock size={17}/></div>
          {deadlines.length ? <div className="td-deadline-list">{deadlines.map(item => <article className="td-deadline-row" key={item.id}><span className={`td-deadline-dot ${item.workKind === 'DPPS' ? 'violet' : ''}`}/><div><strong>{item.title}</strong><small>{item.classroomName} · {item.workKind}</small></div><time>{new Date(item.dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time></article>)}</div> : <div className="td-empty-inline"><p>No published deadlines are coming up. Draft work stays private to this local dashboard.</p></div>}
          <button className="td-text-button" onClick={() => onNavigate('assignments')}>Manage assignments <ArrowRight size={14}/></button>
        </section>
        <section className="td-panel td-overview-panel">
          <div className="td-section-head"><div><span className="td-kicker">CLASS UPDATES</span><h2>Announcements</h2></div><button className="td-icon-button td-compact-icon" onClick={() => onCreate('announcement')} aria-label="Add announcement"><Plus size={16}/></button></div>
          {announcements.length ? <div className="td-announcement-list">{announcements.map(item => <article className="td-announcement-row" key={item.id}><span className="td-announcement-icon"><Megaphone size={15}/></span><div><strong>{item.title}</strong><small>{className(data, item.classroomId)} · {new Date(item.createdAt).toLocaleDateString()}</small><p>{item.message}</p></div></article>)}</div> : <div className="td-empty-inline"><p>Share a quick update with one of your classrooms.</p><button className="td-button td-button-light" onClick={() => onCreate('announcement')}>Create announcement</button></div>}
        </section>
        <section className="td-panel td-overview-panel td-performance-panel">
          <div className="td-section-head"><div><span className="td-kicker">CLASS PERFORMANCE</span><h2>{average === null ? 'Scores will appear here' : `Average score ${average}%`}</h2></div><TrendingUp size={17}/></div>
          {scores.length ? <><div className="td-score-bars">{data.classrooms.map(classroom => {
            const classSubs = reviewed.filter(submission => submission.classroomId === classroom.id);
            const classScores = classSubs.map(submission => {
              const work = publishedWorks.find(item => item.id === submission.workId);
              const maximum = work ? maximumMarks(work) : 0;
              return maximum && submission.review ? submission.review.marks / maximum * 100 : null;
            }).filter((score): score is number => score !== null);
            const classAverage = classScores.length ? Math.round(classScores.reduce((total, score) => total + score, 0) / classScores.length) : 0;
            return <div key={classroom.id} className="td-score-bar-row"><span>{classroom.name}</span><div className="td-progress"><span style={{ width: `${classAverage}%` }}/></div><b>{classScores.length ? `${classAverage}%` : '—'}</b></div>;
          })}</div><small className="td-help">Based on reviewed submissions recorded in this {data.demoMode ? 'demo dataset' : 'local workspace'}.</small></> : <div className="td-empty-inline"><p>No reviewed scores yet. Review a submission to start tracking class performance.</p></div>}
        </section>
        <section className="td-panel td-overview-panel">
          <div className="td-section-head"><div><span className="td-kicker">SCORE TREND</span><h2>Reviewed work over time</h2></div><TrendingUp size={17}/></div>
          {scoreTrend.length ? <><svg className="td-trend-chart" viewBox="0 0 300 132" role="img" aria-label={`Reviewed scores trend: ${scoreTrend.map(item => `${item.score}%`).join(', ')}`}><line x1="20" y1="22" x2="280" y2="22"/><line x1="20" y1="67" x2="280" y2="67"/><line x1="20" y1="112" x2="280" y2="112"/><polyline points={trendPoints}/>{scoreTrend.map((point, index) => { const x = scoreTrend.length === 1 ? 150 : 20 + index * (260 / (scoreTrend.length - 1)); const y = 112 - point.score * .9; return <circle key={`${point.date}-${index}`} cx={x} cy={y} r="4"><title>{point.score}% · {new Date(point.date).toLocaleDateString()}</title></circle>; })}</svg><div className="td-chart-axis"><span>Older reviews</span><span>Score (%) · {data.demoMode ? 'demo records' : 'local records'}</span><span>Recent</span></div></> : <div className="td-empty-inline"><p>Score trend will appear after at least one submission is reviewed.</p></div>}
        </section>
        <section className="td-panel td-overview-panel">
          <div className="td-section-head"><div><span className="td-kicker">SUBMISSION DISTRIBUTION</span><h2>Student work status</h2></div><ClipboardList size={17}/></div>
          {allSubmissions.length ? <div className="td-distribution-list">{distribution.map(item => <div className="td-distribution-row" key={item.label}><span>{item.label}</span><div className="td-progress"><span className={item.tone} style={{ width: `${Math.round(item.count / allSubmissions.length * 100)}%` }}/></div><strong>{item.count}</strong></div>)}</div> : <div className="td-empty-inline"><p>Publish an assignment or DPPS to track student submission status.</p></div>}
        </section>
      </div>
    </div>
  );
}
