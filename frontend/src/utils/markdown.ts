import { marked } from 'marked';

// Configure marked for GFM to support tables, lists, etc.
marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdownToHtml(markdown?: string): string {
  if (!markdown) return '';
  return marked.parse(markdown) as string;
}


