import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const contentRoot = 'src/content/blog-v2';
const outputPath = path.join(process.cwd(), 'src/data/content-last-modified.json');

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

let hasCompleteHistory = false;
try {
  hasCompleteHistory = git(['rev-parse', '--is-shallow-repository']).trim() === 'false';
} catch {
  // Keep the checked-in snapshot when Git history is unavailable.
}

const historyTimestamps = new Map();
if (hasCompleteHistory) {
  try {
    const history = git(['log', '--format=COMMIT:%cI', '--name-only', '--', contentRoot]);
    let commitTimestamp = '';
    for (const line of history.split(/\r?\n/)) {
      if (line.startsWith('COMMIT:')) {
        commitTimestamp = line.slice('COMMIT:'.length);
      } else if (line.startsWith(`${contentRoot}/`) && line.endsWith('.md') && !historyTimestamps.has(line)) {
        historyTimestamps.set(line, commitTimestamp);
      }
    }
  } catch {
    // Preserve the checked-in snapshot if Git history cannot be read.
  }
}

const timestamps = new Map([...Object.entries(snapshot), ...historyTimestamps]);

// Workers Builds checks out limited Git history. Ask GitHub for the current
// commit's changed paths and committer time so only files changed in that
// commit get refreshed; the checked-in snapshot covers all other files.
if (process.env.WORKERS_CI_COMMIT_SHA) {
  try {
    const sha = process.env.WORKERS_CI_COMMIT_SHA;
    const response = await fetch(`https://api.github.com/repos/kmbzn/keybasezone/commits/${sha}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'keybasezone-timestamp-sync',
      },
    });
    if (response.ok) {
      const commit = await response.json();
      const commitTimestamp = commit.commit?.committer?.date;
      if (commitTimestamp) {
        for (const file of commit.files || []) {
          if (file.filename.startsWith(`${contentRoot}/`) && file.filename.endsWith('.md')) {
            timestamps.set(file.filename, commitTimestamp);
          }
        }
      }
    }
  } catch {
    // Retain the committed per-document dates if GitHub's API is unavailable.
  }
}

const nextSnapshot = Object.fromEntries([...timestamps.entries()].sort(([a], [b]) => a.localeCompare(b)));
const content = `${JSON.stringify(nextSnapshot, null, 2)}\n`;
mkdirSync(path.dirname(outputPath), { recursive: true });
if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== content) {
  writeFileSync(outputPath, content);
}
