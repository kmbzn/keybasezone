export function getArticleTitle(slug, markdown, frontmatterTitle) {
  return frontmatterTitle
    || markdown.match(/^#\s+(.+?)\s*#*\s*$/m)?.[1]
    || slug.split('/').at(-1)?.replaceAll('-', ' ')
    || 'KeyBaseZone';
}
