import { useState } from 'react';
import { BookmarkCheck, Play, ListMusic, Search, ChevronRight, Trash2 } from 'lucide-react';
import { fmtDate } from '../../videoRank';
import { type BookmarkItem } from './types';

/**
 * Returns link-like fields (url/thumb/channel) if the item is a video,
 * playlist, or search link; otherwise returns null.
 */
function getLinkFields(item: BookmarkItem):
  | { url: string; thumb?: string; channel?: string }
  | null {
  if (item.kind === 'video') {
    return { url: item.url, thumb: item.thumb, channel: item.channel };
  }
  if (item.kind === 'playlist') {
    return { url: item.url, thumb: item.thumb, channel: item.channel };
  }
  if (item.kind === 'search') {
    return { url: item.url };
  }
  return null;
}

/**
 * BookmarkCard — a single card in the saved-resources list.
 *
 * Design rules for consistent EduBuddy styling:
 *  - Rounded corners (17px — same as `.panel`)
 *  - Soft elevation (box-shadow from `--shadow`)
 *  - A "bookmark" dot indicator
 *  - Removal is a trash icon, accessible, and does not navigate
 *  - Hover raises the card (translateY(-2px)) + border glow
 *
 * Every interactive child is a real `<button>` or an anchor; nothing is a
 * div with an onClick, so keyboard / screen-reader traversal works out of the box.
 */
export function BookmarkCard({
  item,
  onOpen,
  onRemove,
}: {
  item: BookmarkItem;
  onOpen: (url: string, title: string, kind: BookmarkItem['kind']) => void;
  onRemove: (id: string) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const isVisual = item.kind === 'visual';
  const isSearch = item.kind === 'search';
  const isVideo = item.kind === 'video';
  const isPlaylist = item.kind === 'playlist';
  const isLink = isVideo || isPlaylist || isSearch;
  const canOpen = isLink && Boolean(item.url);

  const link = getLinkFields(item);

  return (
    <article
      className={`bookmark-card ${isSearch ? 'bookmark-card--search' : ''}`}
      onMouseEnter={() => setImgLoaded(true)}
      onMouseLeave={() => setImgLoaded(false)}
      style={{ opacity: imgLoaded || !isLink ? 1 : 0, transition: 'opacity .25s ease' }}
    >
      {/* Header: bookmark dot + category label */}
      <div className="bookmark-card-head">
        <button
          className="bookmark-dot"
          aria-label={`Mark ${item.title} as bookmarked`}
          title="Bookmark"
        >
          <BookmarkCheck size={14} />
        </button>
        <span className="bookmark-category">
          {isVisual ? 'Visual Studio' : isSearch ? 'Search link' : isVideo ? 'Video' : 'Playlist'}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="bookmark-thumb">
        {link ? (
          link.thumb ? (
            <img
              src={link.thumb}
              alt=""
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(false)}
            />
          ) : (
            <div className="bookmark-thumb-fallback">
              {isVideo ? <Play size={18} /> : isPlaylist ? <ListMusic size={18} /> : <Search size={18} />}
            </div>
          )
        ) : (
          <div className="bookmark-thumb-fallback">
            {isVideo ? <Play size={18} /> : isPlaylist ? <ListMusic size={18} /> : <Search size={18} />}
          </div>
        )}
        {/* Date badge for videos / search links */}
        {(isVideo || isSearch) && (
          <span className="bookmark-duration">{item.date ? `Saved ${fmtDate(item.date)}` : 'Saved'}</span>
        )}
      </div>

      {/* Body */}
      <div className="bookmark-body">
        <h3 className="bookmark-title" title={item.title}>
          {canOpen ? (
            <a
              href={link?.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpen(link?.url!, item.title, item.kind)}
              onAuxClick={(e) => e.button === 1 && onOpen(link?.url!, item.title, item.kind)}
            >
              {item.title}
            </a>
          ) : (
            <span className="bookmark-title-static">{item.title}</span>
          )}
        </h3>

        <p className="bookmark-meta">
          <span className="bookmark-channel">
            {link ? (link.channel || '—') : isVisual ? 'Visual Studio' : '—'}
          </span>
          <span className="bookmark-sep" aria-hidden="true">·</span>
          <span className="bookmark-grade">Grade {item.grade}</span>
        </p>

        <p className="bookmark-topic">{item.topic || 'No topic'}</p>
      </div>

      {/* Footer */}
      <div className="bookmark-actions">
        {canOpen ? (
          <button
            className="btn btn-soft btn-sm"
            onClick={() => onOpen(link!.url, item.title, item.kind)}
            aria-label={`Open ${item.title}`}
          >
            <ChevronRight size={13} /> Open
          </button>
        ) : (
          <span className="bookmark-actions-disabled">{isVisual ? 'Open in Visual Studio' : 'Notes & study materials'}</span>
        )}
        <button
          className="btn btn-quiet btn-sm"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.title} from saved resources`}
          title="Remove from saved"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </article>
  );
}

export default BookmarkCard;
