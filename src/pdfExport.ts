import { marked } from 'marked';

type InlineToken = { type: string; text?: string; tokens?: InlineToken[]; href?: string; raw?: string };

const plainText = (tokens: InlineToken[] | undefined): string => (tokens || []).map(t => {
  if (t.type === 'image') return t.text || '';
  if (t.tokens) return plainText(t.tokens);
  return t.text ?? '';
}).join('');

const inline = (tokens: InlineToken[] | undefined): any[] => {
  const out: any[] = [];
  for (const t of tokens || []) {
    switch (t.type) {
      case 'text': case 'escape':
        if (t.tokens) out.push(...inline(t.tokens)); else if (t.text) out.push(t.text);
        break;
      case 'strong': out.push({ text: inline(t.tokens), bold: true }); break;
      case 'em': out.push({ text: inline(t.tokens), italics: true }); break;
      case 'del': out.push({ text: inline(t.tokens), decoration: 'lineThrough' }); break;
      case 'codespan': out.push({ text: t.text ?? '', fontSize: 9, color: '#106c58' }); break;
      case 'link': out.push({ text: plainText(t.tokens) || t.text || '', color: '#16866d', decoration: 'underline' }); break;
      case 'br': out.push('\n'); break;
      case 'image': out.push(t.text || ''); break;
      default: if (t.tokens) out.push(...inline(t.tokens)); else if (t.text) out.push(t.text);
    }
  }
  return out;
};

const listItemText = (item: any): any[] => {
  const parts: any[] = [];
  for (const t of item.tokens || []) {
    if (t.type === 'list') {
      for (const sub of t.items || []) parts.push('\n   • ' + plainText(sub.tokens));
    } else {
      parts.push(...inline([t]));
    }
  }
  return parts.length ? parts : [' '];
};

const renderList = (token: any): any => {
  const items = (token.items || []).map(listItemText);
  return [{ [token.ordered ? 'ol' : 'ul']: items, margin: [0, 2, 0, 9] }];
};

const renderTable = (token: any): any => {
  const cols = (token.header || []).length || 1;
  const cell = (c: any) => ({ text: inline(c.tokens), fontSize: 9 });
  const body = [
    (token.header || []).map((c: any) => ({ ...cell(c), bold: true, color: '#106c58' })),
    ...(token.rows || []).map((row: any[]) => row.map(cell)),
  ];
  return { table: { headerRows: 1, widths: Array(cols).fill('auto'), body }, layout: 'lightHorizontalLines', margin: [0, 4, 0, 10] };
};

const headingStyle = (depth: number) => `h${Math.min(Math.max(depth, 1), 4)}`;

const contentFromMarkdown = (markdown: string): any[] => {
  const tokens = marked.lexer(markdown.replace(/\r\n?/g, '\n'));
  const content: any[] = [];
  for (const token of tokens as any[]) {
    switch (token.type) {
      case 'heading':
        content.push({ text: plainText(token.tokens), style: headingStyle(token.depth) });
        break;
      case 'paragraph':
        content.push({ text: inline(token.tokens), style: 'body' });
        break;
      case 'list':
        content.push(renderList(token));
        break;
      case 'table':
        content.push(renderTable(token));
        break;
      case 'code':
        content.push({ text: (token.text || '').replace(/\t/g, '    '), style: 'code' });
        break;
      case 'blockquote':
        content.push({ text: inline(token.tokens), style: 'quote' });
        break;
      case 'hr':
        content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e8eeeb' }], margin: [0, 8, 0, 12] });
        break;
      case 'space': case 'def': case 'html':
        break;
      default:
        if (token.tokens) content.push({ text: inline(token.tokens), style: 'body' });
        else if (token.text) content.push({ text: token.text, style: 'body' });
    }
  }
  return content;
};

export interface NotesPdfMeta {
  title: string;
  topic: string;
  subject: string;
  grade: string;
  markdown: string;
}

export async function exportNotesPdf(meta: NotesPdfMeta): Promise<void> {
  const [{ default: pdfMake }, vfsModule] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ]);
  const vfs = (vfsModule as any).default ?? vfsModule;
  (pdfMake as any).addFontContainer?.({ vfs });

  const dateStr = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  const subParts = [meta.grade, meta.subject, meta.topic].filter(Boolean).join('  ·  ');
  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [54, 86, 54, 60],
    defaultStyle: { font: 'Roboto', fontSize: 10, color: '#24332f', lineHeight: 1.4 },
    header: (currentPage: number, pageCount: number) => ({
      margin: [54, 34, 54, 0],
      columns: [
        { text: 'EduBuddy', style: 'brand', width: '*' },
        { text: `${meta.topic || meta.title}  ·  p.${currentPage}/${pageCount}`, style: 'headerMeta', alignment: 'right' },
      ],
    }),
    footer: (currentPage: number, pageCount: number) => ({
      margin: [54, 0, 54, 30],
      columns: [
        { text: 'EduBuddy  ·  Study notes', style: 'footer' },
        { text: `Page ${currentPage} of ${pageCount}`, style: 'footer', alignment: 'right' },
      ],
    }),
    content: [
      { text: 'EduBuddy', style: 'brand', margin: [0, 0, 0, 2] },
      { text: subParts || meta.title, style: 'metaLine' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#16866d' }], margin: [0, 6, 0, 14] },
      { text: meta.title || meta.topic || 'Study notes', style: 'docTitle' },
      { text: `Generated ${dateStr}`, style: 'metaLine', margin: [0, 0, 0, 6] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e8eeeb' }], margin: [0, 4, 0, 16] },
      ...contentFromMarkdown(meta.markdown || ''),
    ],
    styles: {
      brand: { fontSize: 15, bold: true, color: '#16866d' },
      headerMeta: { fontSize: 8, color: '#98a7a1' },
      footer: { fontSize: 8, color: '#98a7a1' },
      metaLine: { fontSize: 9, color: '#82918c' },
      docTitle: { fontSize: 20, bold: true, color: '#24332f', margin: [0, 0, 0, 2] },
      h1: { fontSize: 15, bold: true, color: '#106c58', margin: [0, 10, 0, 5] },
      h2: { fontSize: 13, bold: true, color: '#16866d', margin: [0, 9, 0, 4] },
      h3: { fontSize: 11.5, bold: true, color: '#24332f', margin: [0, 8, 0, 3] },
      h4: { fontSize: 10.5, bold: true, italics: true, color: '#5c6b64', margin: [0, 7, 0, 3] },
      body: { fontSize: 10, lineHeight: 1.4, margin: [0, 1, 0, 6] },
      quote: { fontSize: 9.5, italics: true, color: '#5c6b64', margin: [14, 2, 0, 8] },
      code: { fontSize: 8.5, color: '#24332f', background: '#f4f8f6', margin: [0, 3, 0, 9], lineHeight: 1.25 },
    },
  };
  const safeName = (meta.topic || meta.title || 'notes').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'notes';
  await pdfMake.createPdf(docDefinition).download(`edubuddy-${safeName}.pdf`);
}
