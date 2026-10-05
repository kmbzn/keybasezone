export default function rehypeSourceAlias() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'element' && node.properties) {
        for (const key of ['src', 'href']) {
          const value = node.properties[key];
          if (typeof value === 'string' && value.startsWith('@source/')) {
            node.properties[key] = `/${value.slice('@source/'.length)}`;
          }
        }
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
