import { sidebar } from '../data/sidebar';

// The navigation is the source of truth for articles eligible for search.
export const searchablePaths = new Set([
  '/',
  '/contents',
  ...sidebar.flatMap((section) => section.entries.map((entry) => entry.path)),
]);

export function isSearchablePath(pathname: string) {
  return searchablePaths.has(pathname.replace(/\/+$/, '') || '/');
}
