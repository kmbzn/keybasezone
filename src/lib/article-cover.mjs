import { existsSync } from 'node:fs';
import path from 'node:path';

const categoryLabels = {
  a: 'STUDY NOTES', ai: 'ARTIFICIAL INTELLIGENCE', brands: 'BRANDS', cs: 'COMPUTER SCIENCE',
  db: 'DATABASES', design: 'DESIGN', ds: 'DATA SCIENCE', finance: 'FINANCE', humanities: 'HUMANITIES',
  mp: 'MICROPROCESSORS', os: 'TECH & SYSTEMS', pl: 'PROGRAMMING LANGUAGES', products: 'PRODUCTS',
  rc: 'RESEARCH', se: 'SOFTWARE ENGINEERING', wellness: 'WELLNESS',
};

function withoutCode(markdown) {
  const fence = String.fromCharCode(96).repeat(3);
  return markdown.replace(new RegExp(fence + '[\\s\\S]*?' + fence, 'g'), '');
}

function getCoverImage(cover) {
  if (typeof cover !== 'string' || !cover.trim()) return '';
  const image = cover.trim();
  if (/^(?:https?:|data:)/i.test(image)) return image;
  if (!image.startsWith('/')) return '';
  const localPath = image.split(/[?#]/)[0];
  return existsSync(path.join(process.cwd(), 'public', localPath.slice(1))) ? image : '';
}

function getDeck(markdown) {
  const source = withoutCode(markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ''))
    .replace(/<iframe\b[\s\S]*?<\/iframe\s*>/gi, '\n')
    .replace(/<(?:script|style|video|audio|object)\b[\s\S]*?<\/(?:script|style|video|audio|object)\s*>/gi, '\n');
  const lines = source.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const tick = String.fromCharCode(96);
  const candidate = lines.slice(titleIndex + 1).map((line) => line.trim()).find((line) => line && !/^(?:#{1,6}\s|!|<|>|\||:{3,}|[-*+]\s+|(?:src|width|height|style|allow|allowfullscreen|loading|referrerpolicy|frameborder)=)/i.test(line) && !line.startsWith(tick));
  return candidate?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_~]/g, '').slice(0, 170) ?? '';
}

export function getArticleCover(slug, markdown, frontmatter = {}) {
  const categoryKey = slug.split('/')[0];
  const coverHue = [...slug].reduce((hue, char) => (hue * 31 + char.charCodeAt(0)) % 360, 17);
  const coverPattern = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6;
  return {
    category: categoryLabels[categoryKey] ?? categoryKey.toUpperCase(),
    coverHue,
    coverPattern,
    coverImage: getCoverImage(frontmatter.cover),
    deck: frontmatter.description || getDeck(markdown),
  };
}
