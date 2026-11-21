import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Copy, Quote } from 'lucide-react';
import { DAILY_QUOTES } from './quotes';
import type { DailyQuoteProps } from './types';
import './daily-quote.css';

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashDateKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDailyQuoteIndex(date: Date, total: number): number {
  if (total <= 0) return 0;
  return hashDateKey(toLocalDateKey(date)) % total;
}

export function getDailyQuote(date: Date) {
  return DAILY_QUOTES[getDailyQuoteIndex(date, DAILY_QUOTES.length)];
}

function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function DailyQuote({ date, theme = 'system', className = '' }: DailyQuoteProps) {
  const activeDate = useMemo(() => date ?? new Date(), [date]);
  const quote = useMemo(() => getDailyQuote(activeDate), [activeDate]);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    setCopyState('idle');
  }, [quote.text, quote.author, activeDate]);

  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = window.setTimeout(() => setCopyState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopy = useCallback(async () => {
    const text = `"${quote.text}" ? ${quote.author}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', 'true');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(area);
        if (!ok) throw new Error('Copy failed');
      }
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }, [quote.author, quote.text]);

  const copyLabel = copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy quote';
  const dateLabel = formatDisplayDate(activeDate);

  return (
    <section
      className={`dq-root ${className}`.trim()}
      data-theme={theme}
      aria-labelledby="dq-title"
    >
      <div className="dq-card">
        <header className="dq-header">
          <div className="dq-header-main">
            <p className="dq-eyebrow">
              <Quote size={14} aria-hidden="true" />
              <span>Quote of the Day</span>
            </p>
            <h2 id="dq-title" className="dq-title">Daily inspiration</h2>
          </div>
          <p className="dq-date">
            <span className="dq-date-label">Today</span>
            <time dateTime={toLocalDateKey(activeDate)}>{dateLabel}</time>
          </p>
        </header>

        <div className="dq-body">
          <span className="dq-mark" aria-hidden="true">?</span>
          <figure className="dq-figure">
            <blockquote className="dq-quote">
              <p>{quote.text}</p>
            </blockquote>
            <figcaption className="dq-attribution">
              <span className="dq-author">? {quote.author}</span>
              {quote.category ? <span className="dq-category">{quote.category}</span> : null}
            </figcaption>
          </figure>
        </div>

        <footer className="dq-footer">
          <p className="dq-footer-note">A little progress every day adds up.</p>
          <div className="dq-actions">
            <span className="dq-copy-status" role="status" aria-live="polite">
              {copyState === 'copied' ? 'Quote copied to clipboard.' : copyState === 'error' ? 'Could not copy quote.' : ''}
            </span>
            <button
              type="button"
              className="dq-copy-btn"
              onClick={handleCopy}
              aria-label={copyLabel}
              title={copyLabel}
            >
              {copyState === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              <span>{copyLabel}</span>
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
