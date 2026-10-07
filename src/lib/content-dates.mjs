import contentLastModifiedSnapshot from '../data/content-last-modified.json';
import contentFirstPublishedSnapshot from '../data/content-first-published.json';

const contentRoot = 'src/content';

export function getContentLastModifiedTimestamps() {
  return new Map(Object.entries(contentLastModifiedSnapshot));
}

export function getContentLastModifiedTimestamp(timestamps, slug) {
  const filePath = `${contentRoot}/${slug}.md`;
  const timestamp = timestamps.get(filePath);
  return timestamp || '';
}

export function getContentLastModifiedDate(timestamps, slug) {
  return getContentLastModifiedTimestamp(timestamps, slug).slice(0, 10);
}

export function getContentPublicationTimestamps() {
  return new Map(Object.entries(contentFirstPublishedSnapshot));
}

export function getContentPublicationDates() {
  return new Map([...getContentPublicationTimestamps()].map(([filePath, timestamp]) => [filePath, timestamp.slice(0, 10)]));
}

export function getContentPublicationDate(dates, slug) {
  const filePath = `${contentRoot}/${slug}.md`;
  return dates.get(filePath)?.slice(0, 10) || '';
}

export function getContentPublicationTimestamp(timestamps, slug) {
  const filePath = `${contentRoot}/${slug}.md`;
  return timestamps.get(filePath) || '';
}
