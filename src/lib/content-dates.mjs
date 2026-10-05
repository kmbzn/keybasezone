import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const contentRoot = 'src/content/blog-v2';

// Read the checked-out Git history once so every article uses its own latest
// commit date, rather than the build time or the date of the whole site.
export function getContentLastModifiedDates() {
  let output = '';
  try {
    output = execFileSync('git', [
      'log', '--format=COMMIT:%cs', '--name-only', '--', contentRoot,
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

export function getContentLastModifiedDate(dates, slug) {
  const filePath = `${contentRoot}/${slug}.md`;
  const date = dates.get(filePath);
  if (date) return date;

  // Newly created or untracked articles still get a useful date in local builds.
  const absolutePath = path.join(process.cwd(), filePath);
  return existsSync(absolutePath) ? statSync(absolutePath).mtime.toISOString().slice(0, 10) : '';
}
