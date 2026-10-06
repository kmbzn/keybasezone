import { getArticleTitle } from '../lib/article-title.mjs';

export type SidebarEntry = { path: string };
export type SidebarSection = { label?: string; collapsible?: boolean; entries: SidebarEntry[] };

const articleModules = import.meta.glob<{ frontmatter?: { title?: string } }>('../content/**/*.md', { eager: true });
const articleMarkdown = import.meta.glob<string>('../content/**/*.md', { eager: true, query: '?raw', import: 'default' });

const sections: SidebarSection[] = [
  {
    entries: [
      { path: "/mindscape" },
      { path: "/musics" },
    ],
  },
  {
    label: "Ubuntu",
    collapsible: false,
    entries: [
      { path: "/os/winemoji" },
      { path: "/os/dunggeunmo" },
      { path: "/os/ubuntu_thumbnails" },
      { path: "/os/clipboard_image_kakaotalk_ubuntu" },
      { path: "/os/wine_without_explorer" },
      { path: "/os/no_animation" },
    ],
  },
  {
    label: "AI",
    entries: [
      { path: "/ai/si-executive-order" },
      { path: "/ai/gpt-6-1-sol" },
      { path: "/ai/claude-code" },
      { path: "/ai/claude-opus-5-5" },
      { path: "/ai/gpt-6-sol-luna" },
    ],
  },
  {
    label: "Wellness",
    entries: [
      { path: "/wellness/psyllium-husk" },
      { path: "/wellness/extra-virgin-olive-oil" },
      { path: "/wellness/nasal-irrigation" },
      { path: "/wellness/ht08" },
      { path: "/wellness/melatonin" },
      { path: "/wellness/adb-mono-screen" },
      { path: "/wellness/cervical-abrasion" },
      { path: "/wellness/barbell-squat" },
    ],
  },
  {
    label: "Humanities",
    entries: [
      { path: "/humanities/nobel-prize-2026" },
      { path: "/humanities/nordvik" },
      { path: "/humanities/north-sentinel-island" },
      { path: "/humanities/rongorongo" },
      { path: "/humanities/baroque-music" },
    ],
  },
  {
    label: "Design",
    entries: [
      { path: "/design/google-icon-redesign-2026" },
      { path: "/design/gerald-genta" },
      { path: "/design/bauhaus" },
    ],
  },
  {
    label: "Brands",
    entries: [
      { path: "/brands/nomos-glashutte" },
      { path: "/brands/frederique-constant" },
      { path: "/brands/kz" },
      { path: "/brands/aestrua" },
      { path: "/brands/jinhao" },
      { path: "/brands/herman-miller" },
      { path: "/brands/desker" },
    ],
  },
  {
    label: "Finance",
    entries: [
      { path: "/finance/hyundai-card-zero" },
      { path: "/finance/shinhan-card-cheum" },
      { path: "/finance/sp500-etf" },
      { path: "/finance/parking-account-cma" },
      { path: "/finance/berkshire-hathaway" },
      { path: "/finance/bitcoin" },
    ],
  },
  {
    label: "Products",
    entries: [
      { path: "/products/audio-interface" },
      { path: "/products/pinta" },
      { path: "/products/kurutoga" },
      { path: "/products/cx31993-dac" },
      { path: "/products/cleansing-milk" },
      { path: "/products/fidget-toy" },
      { path: "/products/thinkpad" },
    ],
  },
  {
    entries: [
      { path: "/tmp" },
    ],
  },
];

export const sidebar = sections;

export function getSidebarEntryTitle(entry: SidebarEntry) {
  const slug = entry.path.replace(/^\//, '');
  const documentPath = `../content/${slug}.md`;
  return getArticleTitle(slug, articleMarkdown[documentPath] || '', articleModules[documentPath]?.frontmatter?.title);
}
