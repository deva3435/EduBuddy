import { BookMarked, BookmarkX, ExternalLink, ListChecks, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BOOK_RECOMMENDATIONS } from '../data/recommendations';
import { QUESTION_BANKS } from '../data/questionBanks';
import { getSavedBooks, removeBook } from '../storage';

interface Props { onClose: () => void; onChange: () => void; }

export function SavedBooks({ onClose, onChange }: Props) {
  const [items, setItems] = useState(getSavedBooks());
  const rows = useMemo(() => items.map((item) => {
    const book = BOOK_RECOMMENDATIONS.find((b) => b.id === item.id);
    const bank = QUESTION_BANKS.find((b) => b.id === item.id);
    const resource = book || bank;
    return resource ? { item, resource, isBook: !!book } : null;
  }).filter(Boolean) as Array<{ item: any; resource: any; isBook: boolean }>, [items]);

  const remove = (id: string, type: 'book' | 'questionBank') => {
    removeBook(id, type);
    setItems(getSavedBooks());
    onChange();
  };

  return (
    <section className="rb-saved-panel" aria-labelledby="rb-saved-title">
      <div className="rb-saved-head">
        <div>
          <span className="rb-kicker">Your collection</span>
          <h2 id="rb-saved-title">Saved resources</h2>
          <p>{rows.length ? 'Books and question banks you bookmarked for later.' : 'Bookmark resources to compare them later.'}</p>
        </div>
        <button type="button" className="rb-reset-btn" onClick={onClose}><X size={14} /> Close</button>
      </div>
      {rows.length === 0 ? (
        <div className="rb-empty rb-empty--inline"><div className="rb-empty-icon"><BookmarkX size={28} /></div><h3>No saved resources yet</h3><p>Tap the bookmark on any card to keep it here.</p></div>
      ) : (
        <div className="rb-saved-grid">
          {rows.map(({ item, resource, isBook }) => (
            <article key={`${item.type}-${item.id}`} className="rb-saved-card">
              <div className="rb-saved-card-icon">{isBook ? <BookMarked size={18} /> : <ListChecks size={18} />}</div>
              <div className="rb-saved-card-body">
                <span className="rb-saved-kind">{isBook ? 'Book' : 'Question bank'}</span>
                <h3>{resource.title}</h3>
                <p>{isBook ? resource.author : resource.publisher} ? {resource.subject}</p>
                <div className="rb-saved-actions">
                  {resource.links?.[0] && <a href={resource.links[0].url} target="_blank" rel="noopener noreferrer" className="rb-action-link"><ExternalLink size={14} /><span>{/search|amazon|flipkart/i.test(resource.links[0].url) ? 'Find online' : resource.links[0].label}</span></a>}
                  <button type="button" className="rb-remove-btn" onClick={() => remove(item.id, item.type)}><BookmarkX size={14} /> Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
