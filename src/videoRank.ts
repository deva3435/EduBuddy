export type VideoItem = { id: string; title: string; channel: string; publishedAt?: string; durationSec?: number; views?: number | null; likes?: number | null; comments?: number | null; thumb?: string; url: string };
export type PlaylistItem = { id: string; title: string; channel: string; itemCount?: number | null; thumb?: string; url: string };
export type SavedResource = { id: string; kind: 'video' | 'playlist' | 'search'; title: string; url: string; thumb?: string; channel?: string; topic: string; subject: string; grade: string; date: string };
export type RankedVideo = VideoItem & { score: number; relevance: number; popularity: number; engagement: number; format: number };

const tokenize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);

const relevanceOf = (title: string, ctx: { topic: string; subject: string; grade: string; board: string }) => {
  const topicPhrase = ctx.topic.trim().toLowerCase();
  const t = title.toLowerCase();
  let rel = 0;
  if (topicPhrase) {
    if (t.includes(topicPhrase)) rel += 0.45;
    else if (tokenize(topicPhrase).some(w => t.includes(w))) rel += 0.18;
  }
  const tokens = [...new Set([...tokenize(ctx.topic), ...tokenize(ctx.subject), ...tokenize(ctx.grade), ...tokenize(ctx.board)])];
  if (tokens.length) rel += 0.55 * (tokens.filter(tok => t.includes(tok)).length / tokens.length);
  return Math.min(1, rel);
};

const engagementRatio = (v: VideoItem): number | null => {
  if (!v.views || v.views <= 0) return null;
  const parts: number[] = [];
  if (v.likes != null) parts.push(v.likes);
  if (v.comments != null) parts.push(v.comments);
  if (!parts.length) return null;
  return parts.reduce((a, b) => a + b, 0) / v.views;
};

export function rankVideos(videos: VideoItem[], ctx: { topic: string; subject: string; grade: string; board: string }): RankedVideo[] {
  const maxViews = Math.max(1, ...videos.map(v => v.views ?? 0));
  const ratios = videos.map(engagementRatio).filter((x): x is number => x !== null && x > 0);
  const maxRatio = Math.max(...ratios, 1e-9);
  return videos.map(v => {
    const relevance = relevanceOf(v.title, ctx);
    const popularity = v.views != null ? Math.log10(v.views + 1) / Math.log10(maxViews + 1) : 0;
    const ratio = engagementRatio(v);
    const engagement = ratio === null ? 0.5 : Math.min(1, Math.log10(ratio * 1000 + 1) / Math.log10(maxRatio * 1000 + 1));
    let format = 0.5;
    if (v.durationSec != null) {
      if (v.durationSec >= 180 && v.durationSec <= 5400) format = 0.85;
      else if (v.durationSec < 60) format = 0.15;
    }
    const t = v.title.toLowerCase();
    if (/\b(full|complete|chapter|lecture|class\s*\d+|course)\b/.test(t)) format = Math.min(1, format + 0.15);
    if (/shorts|#short\b/.test(t) || /shorts/.test(v.url)) format = Math.min(format, 0.3);
    const score = Math.round(100 * Math.min(1, 0.5 * relevance + 0.25 * popularity + 0.15 * engagement + 0.1 * format));
    return { ...v, score, relevance, popularity, engagement, format };
  });
}

export function rankPlaylists(playlists: PlaylistItem[], ctx: { topic: string; subject: string; grade: string; board: string }): (PlaylistItem & { score: number })[] {
  return playlists.map(p => {
    const rel = relevanceOf(p.title, ctx);
    const sizeBonus = p.itemCount != null ? Math.min(10, Math.log10(p.itemCount + 1) * 4) : 0;
    return { ...p, score: Math.round(100 * rel * 0.85 + sizeBonus) };
  }).sort((a, b) => b.score - a.score);
}

export const fmtViews = (n?: number | null) => n == null ? null : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : `${n}`;
export const fmtDuration = (s?: number | null) => s == null ? null : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;
