function textContent(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textContent).join('');
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
        if (node.type === 'containerDirective') {
          const openLine = lines[(node.position?.start.line ?? 1) - 1] ?? '';
          const match = openLine.match(/^:{3,}\s*[\w-]+\s*(.*?)\s*$/);
          const title = match?.[1] ?? '';
          node.data ??= {};
          node.data.hName = node.name === 'code-tabs' ? 'div' : 'aside';
          node.data.hProperties = { className: ['custom-container', `custom-container-${node.name}`] };

          if (title && node.name !== 'code-tabs') {
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
