import type { APIRoute } from 'astro';
import { searchablePaths } from '../lib/search-index';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site must be configured for the sitemap');
  const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  }[character]!));
  const urls = [...searchablePaths].map((path) =>
    `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
