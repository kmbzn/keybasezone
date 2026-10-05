import path from 'node:path';

function textContent(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textContent).join('');
}

export function publicImageUrl(url, file) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return url;
  const marker = `${path.sep}src${path.sep}content${path.sep}blog-v2${path.sep}`;
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
    const lines = String(file.value ?? '').split(/\r?\n/);

    function visit(parent) {
      for (const node of parent.children ?? []) {
        if (node.type === 'image') {
          node.url = publicImageUrl(node.url, file);
        } else if (node.type === 'containerDirective') {
          const openLine = lines[(node.position?.start.line ?? 1) - 1] ?? '';
          const match = openLine.match(/^:{3,}\s*[\w-]+\s*(.*?)\s*$/);
          const title = match?.[1] ?? '';
          node.data ??= {};
          node.data.hName = node.name === 'code-tabs' ? 'div' : node.name === 'details' ? 'details' : 'aside';
          node.data.hProperties = { className: ['custom-container', `custom-container-${node.name}`] };

          if (node.name === 'details') {
            node.children.unshift({
              type: 'paragraph',
              data: { hName: 'summary', hProperties: { className: ['custom-container-title'] } },
              children: [{ type: 'text', value: title || '자세히 보기' }],
            });
          } else if (title && node.name !== 'code-tabs') {
            node.children.unshift({
              type: 'paragraph',
              data: { hName: 'div', hProperties: { className: ['custom-container-title'] } },
              children: [{ type: 'text', value: title }],
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
