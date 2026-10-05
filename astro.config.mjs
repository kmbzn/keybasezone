import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBlogMarkdown from './src/lib/remark-blog-markdown.mjs';
import rehypeSourceAlias from './src/lib/rehype-source-alias.mjs';

export default defineConfig({
  site: 'https://kmbzn.com',
  base: '/',
  trailingSlash: 'never',
  markdown: {
    remarkPlugins: [remarkDirective, remarkMath, remarkBlogMarkdown],
    rehypePlugins: [rehypeKatex, rehypeSourceAlias],
  },
  integrations: [tailwind()]
});
