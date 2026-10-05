import { publicImageUrl } from './remark-blog-markdown.mjs';

export default function rehypeSourceAlias() {
  return (tree, file) => {
    function visit(node) {
      if (node.type === 'element' && node.properties) {
        for (const key of ['src', 'href']) {
          const value = node.properties[key];
          if (typeof value === 'string' && value.startsWith('@source/')) {
            node.properties[key] = `/${value.slice('@source/'.length)}`;
          } else if (key === 'src' && node.tagName === 'img' && typeof value === 'string') {
            node.properties[key] = publicImageUrl(value, file);
          }
        }
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
