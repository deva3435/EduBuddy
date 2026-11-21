import { ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import type { Board, ClassGrade, FreeResource } from '../types';

interface Props { resources: FreeResource[]; classFilter: ClassGrade | 'all'; boardFilter: Board | 'all'; subjectFilter: string | 'all'; }

export function FreeResources({ resources, classFilter, boardFilter, subjectFilter }: Props) {
  const filtered = resources.filter((r) => {
    if (classFilter !== 'all' && !r.classes.includes(classFilter)) return false;
    if (boardFilter !== 'all' && !r.boards.includes(boardFilter)) return false;
    if (subjectFilter !== 'all' && r.subject !== null && r.subject !== subjectFilter) return false;
    return true;
  });
  if (filtered.length === 0) return null;

  return (
    <section className="rb-free-section" aria-labelledby="rb-free-title">
      <div className="rb-section-head">
        <div className="rb-section-head-icon"><Globe size={20} /></div>
        <div>
          <span className="rb-kicker">No-cost learning</span>
          <h2 id="rb-free-title">Free official resources</h2>
          <p>Legitimate sources from NCERT/CBSE. Use these before buying extra books when they cover your goal.</p>
        </div>
      </div>
      <div className="rb-free-grid">
        {filtered.map((r) => (
          <article key={r.id} className="rb-free-card">
            <div className="rb-free-card-top">
              <span className="rb-free-source"><ShieldCheck size={14} /> {r.source} official</span>
              <span className="rb-free-type">{r.type}</span>
            </div>
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <div className="rb-free-meta">
              <span>{r.classes.length > 4 ? `${r.classes[0]}-${r.classes[r.classes.length - 1]}` : r.classes.join(', ')}</span>
              {r.subject && <span>{r.subject}</span>}
            </div>
            <a href={r.link} target="_blank" rel="noopener noreferrer" className="rb-action-link rb-action-link--primary rb-action-link--full">
              <ExternalLink size={15} /> <span>{r.linkLabel}</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
