import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const contentRoot = 'src/content/blog-v2';
const outputPath = path.join(process.cwd(), 'src/data/content-last-modified.json');
const isCiBuild = ['true', '1'].includes((process.env.CI || '').toLowerCase())
  || process.env.WORKERS_CI === '1';

let snapshot = {};
try {
  snapshot = JSON.parse(readFileSync(outputPath, 'utf8'));
} catch {
  // A missing snapshot is okay when building an older checkout.
}

function git(args) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

let history = '';
try {
  history = git(['log', '--format=COMMIT:%cI', '--name-only', '--', contentRoot]);
} catch {
  // Keep the checked-in snapshot when Git history is unavailable.
}

const historyTimestamps = new Map();
let commitTimestamp = '';
for (const line of history.split(/\r?\n/)) {
  if (line.startsWith('COMMIT:')) {
    commitTimestamp = line.slice('COMMIT:'.length);
  } else if (line.startsWith(`${contentRoot}/`) && line.endsWith('.md') && !historyTimestamps.has(line)) {
    historyTimestamps.set(line, commitTimestamp);
  }
}

const timestamps = new Map([...Object.entries(snapshot), ...historyTimestamps]);

// Workers Builds may check out only the latest commit. Its SHA and commit
// contents are still available, so stamp changed articles with GitHub's
// committer time instead of the build machine's filesystem time.
if (process.env.WORKERS_CI_COMMIT_SHA) {
  try {
    const sha = process.env.WORKERS_CI_COMMIT_SHA;
    const currentCommitTimestamp = git(['show', '-s', '--format=%cI', sha]).trim();
    const changedFiles = git(['diff-tree', '--no-commit-id', '--name-only', '-r', '-m', sha]);
    for (const filePath of changedFiles.split(/\r?\n/)) {
      if (filePath.startsWith(`${contentRoot}/`) && filePath.endsWith('.md')) {
        timestamps.set(filePath, currentCommitTimestamp);
      }
    }
  } catch {
    // Retain checked-in/history timestamps if the current commit cannot be read.
  }
}

// Before commit, preserve the actual edit time for changed and newly added notes.
if (!isCiBuild) {
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
}

const nextSnapshot = Object.fromEntries([...timestamps.entries()].sort(([a], [b]) => a.localeCompare(b)));
const content = `${JSON.stringify(nextSnapshot, null, 2)}\n`;
mkdirSync(path.dirname(outputPath), { recursive: true });
if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== content) {
  writeFileSync(outputPath, content);
}
