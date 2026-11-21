import { BookOpen, SearchX } from 'lucide-react';

export function EmptyState({ message = 'No recommendations found', subtext = 'Try adjusting your filters or search term.' }: { message?: string; subtext?: string }) {
  return (
    <div className="rb-empty" role="status">
      <div className="rb-empty-icon"><BookOpen size={30} /></div>
      <h3>{message}</h3>
      <p>{subtext}</p>
    </div>
  );
}

export function SearchEmptyState() {
  return (
    <div className="rb-empty" role="status">
      <div className="rb-empty-icon"><SearchX size={30} /></div>
      <h3>No results match your filters</h3>
      <p>Try a different subject, category, budget, or clear your search. You can also use free official resources below when available.</p>
    </div>
  );
}
