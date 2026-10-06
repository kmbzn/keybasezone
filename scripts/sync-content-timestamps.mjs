import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const contentRoot = 'src/content/blog-v2';
const outputPath = path.join(process.cwd(), 'src/data/content-last-modified.json');

function git(args) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

try {
  if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') process.exit(0);
} catch {
  // Preserve the checked-in snapshot when Git history is unavailable.
  process.exit(0);
}

let history = '';
try {
  history = git(['log', '--format=COMMIT:%cI', '--name-only', '--', contentRoot]);
} catch {
  process.exit(0);
}

const timestamps = new Map();
let commitTimestamp = '';
for (const line of history.split(/\r?\n/)) {
  if (line.startsWith('COMMIT:')) {
    commitTimestamp = line.slice('COMMIT:'.length);
  } else if (line.startsWith(`${contentRoot}/`) && line.endsWith('.md') && !timestamps.has(line)) {
    timestamps.set(line, commitTimestamp);
  }
}

// Before commit, preserve the actual edit time for changed and newly added notes.
try {
  const status = git(['status', '--porcelain', '-z', '--untracked-files=all', '--', contentRoot]);
  for (const entry of status.split('\0').filter(Boolean)) {
    const filePath = entry.slice(3);
    if (!filePath.startsWith(`${contentRoot}/`) || !filePath.endsWith('.md')) continue;
    const absolutePath = path.join(process.cwd(), filePath);
    if (existsSync(absolutePath)) timestamps.set(filePath, statSync(absolutePath).mtime.toISOString());
  }
} catch {
  // Keep the last known timestamp for any path that could not be inspected.
}

const snapshot = Object.fromEntries([...timestamps.entries()].sort(([a], [b]) => a.localeCompare(b)));
const content = `${JSON.stringify(snapshot, null, 2)}\n`;
mkdirSync(path.dirname(outputPath), { recursive: true });
if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== content) {
  writeFileSync(outputPath, content);
}
