import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import contentLastModifiedSnapshot from '../data/content-last-modified.json';

const contentRoot = 'src/content';

// Read the checked-out Git history once so every article uses its own latest
// commit timestamp, rather than the build time or the date of the whole site.
export function getContentLastModifiedTimestamps() {
  let output = '';
  try {
    output = execFileSync('git', [
      'log', '--format=COMMIT:%cI', '--name-only', '--', contentRoot,
    ], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    // Keep local previews usable when the source is downloaded without .git.
  }

  const historyTimestamps = new Map();
  let commitTimestamp = '';
  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith('COMMIT:')) {
      commitTimestamp = line.slice('COMMIT:'.length);
    } else if (line.startsWith(`${contentRoot}/`) && line.endsWith('.md') && !historyTimestamps.has(line)) {
      historyTimestamps.set(line, commitTimestamp);
    }
  }

  // Git history is the authoritative source for files visible in the checkout;
  // the snapshot fills gaps when deployment clones contain limited history.
  return new Map([...Object.entries(contentLastModifiedSnapshot), ...historyTimestamps]);
}

export function getContentLastModifiedTimestamp(timestamps, slug) {
  const filePath = `${contentRoot}/${slug}.md`;
  const timestamp = timestamps.get(filePath);
  return timestamp || '';
}

export function getContentLastModifiedDate(timestamps, slug) {
  return getContentLastModifiedTimestamp(timestamps, slug).slice(0, 10);
}

// The oldest checked-in date is the best available publication date for older
// imported notes. Articles with an explicit `published` frontmatter date take
// precedence at the page level.
export function getContentPublicationDates() {
  let output = '';
  try {
    output = execFileSync('git', [
      'log', '--reverse', '--format=COMMIT:%cs', '--name-only', '--', contentRoot,
    ], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    // Keep local previews usable when the source is downloaded without .git.
  }

  const dates = new Map();
  let commitDate = '';
  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith('COMMIT:')) {
      commitDate = line.slice('COMMIT:'.length);
    } else if (line.startsWith(`${contentRoot}/`) && line.endsWith('.md') && !dates.has(line)) {
      dates.set(line, commitDate);
    }
  }

  return dates;
}

export function getContentPublicationDate(dates, slug) {
  const filePath = `${contentRoot}/${slug}.md`;
  const date = dates.get(filePath);
  if (date) return date;

  const absolutePath = path.join(process.cwd(), filePath);
  return existsSync(absolutePath) ? statSync(absolutePath).mtime.toISOString().slice(0, 10) : '';
}
