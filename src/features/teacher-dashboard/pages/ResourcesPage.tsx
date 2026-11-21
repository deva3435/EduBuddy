import { useMemo, useState } from 'react';
import { FileText, Link2, Megaphone, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { Announcement, Resource, TeacherDashboardData } from '../types';

export function ResourcesPage({
  data,
  onCreateResource,
  onEditResource,
  onDeleteResource,
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  getFileUrl,
}: {
  data: TeacherDashboardData;
  onCreateResource: () => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
  onCreateAnnouncement: () => void;
  onEditAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (announcement: Announcement) => void;
  getFileUrl: (name: string, size: number) => string | undefined;
}) {
  const [tab, setTab] = useState<'resources' | 'announcements'>('resources');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const resources = useMemo(() => data.resources
    .filter(item => classFilter === 'all' || item.classroomId === classFilter)
    .filter(item => `${item.title} ${item.subject} ${item.topic} ${item.description}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  [data.resources, classFilter, search]);
  const announcements = useMemo(() => data.announcements
    .filter(item => classFilter === 'all' || item.classroomId === classFilter)
    .filter(item => `${item.title} ${item.message}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  [data.announcements, classFilter, search]);

  return <div className="td-page-content">
    <div className="td-page-heading"><div><span className="td-kicker">CLASSROOM MATERIALS</span><h1>Resources & announcements</h1><p>Share links and local file metadata, or post class updates. Changes stay on this device.</p></div><button className="td-button td-button-primary" onClick={() => tab === 'resources' ? onCreateResource() : onCreateAnnouncement()}><Plus size={15}/>{tab === 'resources' ? 'Add resource' : 'New announcement'}</button></div>
    <div className="td-resource-tabs"><button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}><FileText size={15}/> Resources <span>{data.resources.length}</span></button><button className={tab === 'announcements' ? 'active' : ''} onClick={() => setTab('announcements')}><Megaphone size={15}/> Announcements <span>{data.announcements.length}</span></button></div>
    <div className="td-filter-bar"><label className="td-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${tab}`}/></label><select value={classFilter} onChange={event => setClassFilter(event.target.value)}><option value="all">All classrooms</option>{data.classrooms.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
    {tab === 'resources' ? resources.length ? <div className="td-resource-grid">{resources.map(resource => {
      const classroom = data.classrooms.find(item => item.id === resource.classroomId);
      const fileUrl = resource.file ? getFileUrl(resource.file.name, resource.file.size) : undefined;
      const externalUrl = resource.url ? resource.url : undefined;
      return <article className="td-panel td-resource-card" key={resource.id}><div className="td-resource-top"><span className="td-resource-icon"><FileText size={17}/></span><span className="td-resource-type">{resource.type}</span><div className="td-row-actions"><button className="td-icon-action" title="Edit resource" onClick={() => onEditResource(resource)}><Pencil size={14}/></button><button className="td-icon-action td-danger-icon" title="Delete resource" onClick={() => onDeleteResource(resource)}><Trash2 size={14}/></button></div></div><h2>{resource.title}</h2><p>{resource.description || resource.topic || 'Shared learning resource.'}</p><div className="td-resource-meta"><span>{classroom?.name || 'Classroom removed'}</span><span>{resource.subject}{resource.topic ? ` · ${resource.topic}` : ''}</span></div>{resource.file && <div className="td-file-note">{resource.file.name} · {(resource.file.size / 1024).toFixed(0)} KB {fileUrl ? '· available this session' : '· file contents are session-only'}</div>}<div className="td-resource-actions">{externalUrl && <a className="td-button td-button-light" href={externalUrl} target="_blank" rel="noreferrer"><Link2 size={14}/> Open link</a>}{fileUrl && resource.file && <><a className="td-button td-button-light" href={fileUrl} target="_blank" rel="noreferrer"><FileText size={14}/> Preview file</a><a className="td-button td-button-light" href={fileUrl} download={resource.file.name}><FileText size={14}/> Download file</a></>}{!externalUrl && !fileUrl && <span className="td-help">No current-session file or URL available.</span>}</div><small className="td-help">Added {new Date(resource.createdAt).toLocaleDateString()} · local only</small></article>;
    })}</div> : <div className="td-empty-state"><FileText size={30}/><h2>No resources match</h2><p>{data.resources.length ? 'Adjust your search or classroom filter.' : 'Add a link or file reference to share with a classroom.'}</p>{!data.resources.length && <button className="td-button td-button-primary" onClick={onCreateResource}><Plus size={15}/> Add resource</button>}</div> : announcements.length ? <div className="td-announcement-grid">{announcements.map(announcement => <article className="td-panel td-announcement-card" key={announcement.id}><div className="td-resource-top"><span className="td-resource-icon"><Megaphone size={17}/></span><span className="td-resource-type">{data.classrooms.find(item => item.id === announcement.classroomId)?.name || 'Classroom removed'}</span><div className="td-row-actions"><button className="td-icon-action" title="Edit announcement" onClick={() => onEditAnnouncement(announcement)}><Pencil size={14}/></button><button className="td-icon-action td-danger-icon" title="Delete announcement" onClick={() => onDeleteAnnouncement(announcement)}><Trash2 size={14}/></button></div></div><h2>{announcement.title}</h2><p>{announcement.message}</p><small>{new Date(announcement.createdAt).toLocaleString()} · local demo announcement</small></article>)}</div> : <div className="td-empty-state"><Megaphone size={30}/><h2>No announcements found</h2><p>{data.announcements.length ? 'Adjust your search or classroom filter.' : 'Post an update for one of your classrooms.'}</p>{!data.announcements.length && <button className="td-button td-button-primary" onClick={onCreateAnnouncement}><Plus size={15}/> New announcement</button>}</div>}
  </div>;
}
