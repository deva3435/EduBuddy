import { BookMarked, Bookmark, ExternalLink, GraduationCap, ListChecks, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookLink, BookRecommendation, QuestionBank } from '../types';

const CATEGORY_META: Record<string, { label: string; tone: string }> = {
  textbook: { label: 'Textbook', tone: 'textbook' },
  concept: { label: 'Concept', tone: 'concept' },
  practice: { label: 'Practice', tone: 'practice' },
  questionBank: { label: 'Question bank', tone: 'questionBank' },
  examPrep: { label: 'Exam prep', tone: 'examPrep' },
};

const coverCache = new Map<string, string | null>();

function getOpenLibraryCover(isbn?: string) {
  const clean = isbn?.replace(/[^0-9Xx]/g, '');
  return clean ? `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg?default=false` : null;
}

async function lookupCover(title: string, author: string, isbn?: string): Promise<string | null> {
  const isbnCover = getOpenLibraryCover(isbn);
  if (isbnCover) return isbnCover;
  const key = `${title}|${author}`.toLowerCase();
  if (coverCache.has(key)) return coverCache.get(key) ?? null;
  try {
    const q = new URLSearchParams({ title, author, limit: '1', fields: 'cover_i,isbn' });
    const res = await fetch(`https://openlibrary.org/search.json?${q.toString()}`);
    if (!res.ok) throw new Error('lookup failed');
    const data = await res.json();
    const doc = data?.docs?.[0];
    const coverId = doc?.cover_i;
    const url = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg?default=false` : null;
    coverCache.set(key, url);
    return url;
  } catch {
    coverCache.set(key, null);
    return null;
  }
}

function Cover({ title, author, isbn, coverUrl, kind }: { title: string; author: string; isbn?: string; coverUrl?: string; kind: 'book' | 'qbank' }) {
  const [url, setUrl] = useState<string | null>(coverUrl || getOpenLibraryCover(isbn));
  const [loading, setLoading] = useState(!coverUrl && !getOpenLibraryCover(isbn));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (coverUrl || getOpenLibraryCover(isbn)) { setUrl(coverUrl || getOpenLibraryCover(isbn)); setLoading(false); setFailed(false); return; }
    let active = true;
    setLoading(true); setFailed(false);
    lookupCover(title, author, isbn).then((found) => { if (!active) return; setUrl(found); setLoading(false); });
    return () => { active = false; };
  }, [title, author, isbn, coverUrl]);

  const initials = useMemo(() => title.split(/s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join(''), [title]);
  const showImage = !!url && !failed;

  return (
    <div className={`rb-cover ${kind === 'qbank' ? 'rb-cover--qbank' : ''}`} aria-label={`Cover for ${title}`}>
      {loading && <div className="rb-cover-skeleton" aria-hidden="true" />}
      {showImage ? (
        <img src={url!} alt={`Cover of ${title}`} loading="lazy" onError={() => setFailed(true)} onLoad={() => setLoading(false)} />
      ) : !loading ? (
        <div className="rb-cover-fallback" aria-hidden="true">
          <div className="rb-cover-fallback-icon">{kind === 'qbank' ? <ListChecks size={22} /> : <BookMarked size={22} />}</div>
          <strong>{initials || 'RB'}</strong>
          <span>{kind === 'qbank' ? 'Question Bank' : 'Reference Book'}</span>
        </div>
      ) : null}
    </div>
  );
}

function ActionLink({ link, title, primary }: { link?: BookLink; title: string; primary?: boolean }) {
  if (!link) return null;
  const isSearch = /search|amazon|flipkart|google/i.test(link.url) || /search/i.test(link.label);
  const label = isSearch ? (primary ? 'Find online' : link.label) : link.label;
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={`rb-action-link ${primary ? 'rb-action-link--primary' : ''}`} aria-label={`${label} for ${title}`}>
      {primary ? <ShoppingBag size={15} /> : <ExternalLink size={14} />}
      <span>{label}</span>
    </a>
  );
}

function BookmarkBtn({ saved, onToggle, label }: { saved: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" className={`rb-bookmark ${saved ? 'is-saved' : ''}`} aria-label={saved ? `Remove ${label} from saved` : `Save ${label}`} aria-pressed={saved} onClick={onToggle} title={saved ? 'Saved' : 'Save'}>
      <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

function MetaRow({ subject, classes, publisher }: { subject: string; classes: string[]; publisher: string }) {
  return (
    <div className="rb-meta-row">
      <span className="rb-meta-chip"><GraduationCap size={13} /> {classes.length > 2 ? `${classes[0]} - ${classes[classes.length - 1]}` : classes.join(', ')}</span>
      <span className="rb-meta-chip"><Tag size={13} /> {subject}</span>
      <span className="rb-meta-chip rb-meta-chip--muted">{publisher}</span>
    </div>
  );
}

export function BookCard({ book, saved, onToggle }: { book: BookRecommendation; saved: boolean; onToggle: () => void }) {
  const cat = CATEGORY_META[book.category] || CATEGORY_META.textbook;
  const primary = book.links[0];
  return (
    <article className="rb-card">
      <div className="rb-card-media">
        <Cover title={book.title} author={book.author} isbn={book.isbn} coverUrl={book.coverUrl} kind="book" />
        <div className="rb-card-media-top">
          <span className={`rb-category rb-category--${cat.tone}`}>{cat.label}</span>
          <BookmarkBtn saved={saved} onToggle={onToggle} label={book.title} />
        </div>
      </div>
      <div className="rb-card-body">
        <MetaRow subject={book.subject} classes={book.classes} publisher={book.publisher} />
        <h3 className="rb-card-title">{book.title}</h3>
        <p className="rb-card-author">by {book.author}</p>
        <p className="rb-card-desc">{book.description}</p>
        <div className="rb-reason"><Sparkles size={14} aria-hidden="true" /><p><strong>Why recommended:</strong> {book.whyRecommended}</p></div>
        <div className="rb-card-footer">
          <div className="rb-price">
            <span className="rb-price-label">Estimated price</span>
            <strong className="rb-price-value">{book.priceRange}</strong>
            {book.priceConfidence === 'unverified' && <span className="rb-price-note">Approximate / unverified</span>}
          </div>
          <ActionLink link={primary} title={book.title} primary />
        </div>
      </div>
    </article>
  );
}

export function QuestionBankCard({ bank, saved, onToggle }: { bank: QuestionBank; saved: boolean; onToggle: () => void }) {
  const primary = bank.links[0];
  return (
    <article className="rb-card rb-card--qbank">
      <div className="rb-card-media rb-card-media--qbank">
        <Cover title={bank.title} author={bank.publisher} isbn={bank.isbn} coverUrl={bank.coverUrl} kind="qbank" />
        <div className="rb-card-media-top">
          <span className="rb-category rb-category--questionBank">Question bank</span>
          <BookmarkBtn saved={saved} onToggle={onToggle} label={bank.title} />
        </div>
      </div>
      <div className="rb-card-body">
        <MetaRow subject={bank.subject} classes={bank.classes} publisher={bank.publisher} />
        <h3 className="rb-card-title">{bank.title}</h3>
        <p className="rb-card-author">{bank.publisher} ? {bank.type}</p>
        <p className="rb-card-desc">{bank.description}</p>
        <div className="rb-reason"><Sparkles size={14} aria-hidden="true" /><p><strong>Why recommended:</strong> {bank.whyRecommended}</p></div>
        <div className="rb-card-footer">
          <div className="rb-price">
            <span className="rb-price-label">Estimated price</span>
            <strong className="rb-price-value">{bank.priceRange}</strong>
            {bank.priceConfidence === 'unverified' && <span className="rb-price-note">Approximate / unverified</span>}
          </div>
          <ActionLink link={primary} title={bank.title} primary />
        </div>
      </div>
    </article>
  );
}
