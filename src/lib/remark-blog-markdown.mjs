import path from 'node:path';

const containerLabels = {
  info: 'INFO', note: 'NOTE', tip: 'TIP', warning: 'WARNING', caution: 'CAUTION',
  danger: 'DANGER', error: 'ERROR', important: 'IMPORTANT',
};

function textContent(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textContent).join('');
}

export function publicImageUrl(url, file) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return url;
  const marker = `${path.sep}src${path.sep}content${path.sep}`;
  const sourcePath = file.path ?? file.history?.[0] ?? '';
  const markerIndex = sourcePath.lastIndexOf(marker);
  if (markerIndex < 0) return url;
  const documentPath = sourcePath.slice(markerIndex + marker.length);
  const documentDirectory = path.posix.dirname(documentPath.split(path.sep).join('/'));
  const splitAt = url.search(/[?#]/);
  const pathname = splitAt < 0 ? url : url.slice(0, splitAt);
  const suffix = splitAt < 0 ? '' : url.slice(splitAt);
  const publicPath = path.posix.normalize(path.posix.join('/', documentDirectory, pathname));
  return `${publicPath}${suffix}`;
}

function hProperties(node, className) {
  node.data ??= {};
  node.data.hName = 'div';
  node.data.hProperties = { className: [className] };
}

export default function remarkBlogMarkdown() {
  return (tree, file) => {
    let hasArticleTitle = false;

    function visit(parent) {
      for (const node of parent.children ?? []) {
        if (node.type === 'image') {
          node.url = publicImageUrl(node.url, file);
        } else if (node.type === 'heading' && node.depth === 1 && !hasArticleTitle) {
          hasArticleTitle = true;
          node.data ??= {};
          node.data.hName = 'div';
          node.data.hProperties = { className: ['article-title-source'], 'aria-hidden': 'true' };
        } else if (node.type === 'containerDirective') {
          const title = node.attributes?.title || '';
          node.data ??= {};
          node.data.hName = node.name === 'code-tabs' ? 'div' : node.name === 'details' ? 'details' : 'aside';
          node.data.hProperties = { className: ['custom-container', `custom-container-${node.name}`] };

          if (node.name === 'details') {
            node.children.unshift({
              type: 'paragraph',
              data: { hName: 'summary', hProperties: { className: ['custom-container-title'] } },
              children: [{ type: 'text', value: title || '자세히 보기' }],
            });
          } else if (node.name !== 'code-tabs') {
            node.children.unshift({
              type: 'paragraph',
              data: { hName: 'div', hProperties: { className: ['custom-container-title'] } },
              children: [{ type: 'text', value: title || containerLabels[node.name] || node.name.toUpperCase() }],
            });
          }
        } else if (node.type === 'paragraph' && textContent(node).trim().startsWith('@tab ')) {
          hProperties(node, 'code-tab-label');
        }

        if (node.children) visit(node);
      }
    }

    visit(tree);
  };
}
