import { existsSync } from 'node:fs';
import path from 'node:path';

const categoryLabels = {
  a: 'STUDY NOTES', ai: 'ARTIFICIAL INTELLIGENCE', brands: 'BRANDS', cs: 'COMPUTER SCIENCE',
  db: 'DATABASES', design: 'DESIGN', ds: 'DATA SCIENCE', finance: 'FINANCE', humanities: 'HUMANITIES',
  mp: 'MICROPROCESSORS', os: 'TECH & SYSTEMS', pl: 'PROGRAMMING LANGUAGES', products: 'PRODUCTS',
  rc: 'RESEARCH', se: 'SOFTWARE ENGINEERING', wellness: 'WELLNESS',
};

const curatedCoverImages = {
  'mindscape': null,
  'musics': '/images/article-covers/musics.jpg',
  'os/dunggeunmo': '/images/article-covers/os-dunggeunmo.png',
  'os/ubuntu_thumbnails': '/images/article-covers/os-ubuntu-thumbnails.jpg',
  'os/no_animation': '/images/article-covers/os-no-animation.png',
  'wellness/concerta': '/images/article-covers/wellness-concerta.jpg',
  'wellness/inderal': '/images/article-covers/wellness-inderal.png',
  'wellness/sertraline': '/images/article-covers/wellness-sertraline.jpg',
  'wellness/melatonin': '/images/article-covers/wellness-melatonin.jpg',
  'wellness/cervical-abrasion': '/images/article-covers/wellness-cervical-abrasion.jpg',
  'wellness/barbell-squat': '/images/article-covers/wellness-barbell-squat.jpg',
  'humanities/baroque-music': '/images/article-covers/humanities-baroque-music.jpg',
  'brands/frederique-constant': '/images/article-covers/brands-frederique-constant.jpg',
  'brands/kz': '/images/article-covers/brands-kz.jpg',
  'brands/aestrua': '/images/article-covers/brands-aestrua.png',
  'brands/jinhao': '/images/article-covers/brands-jinhao.jpg',
  'brands/desker': '/images/article-covers/brands-desker.jpg',
  'brands/musinsa-standard': '/images/article-covers/brands-musinsa-standard.jpg',
  'brands/nomos-glashutte': '/images/article-covers/brands-nomos-glashuette.jpg',
  'finance/hyundai-card-zero': '/images/article-covers/finance-hyundai-card-zero.jpg',
  'finance/shinhan-card-cheum': '/images/article-covers/finance-shinhan-card-cheum.jpg',
  'finance/sp500-etf': '/images/article-covers/finance-sp500-etf.jpg',
  'finance/parking-account-cma': '/images/article-covers/finance-parking-account-cma.jpg',
  'finance/berkshire-hathaway': '/images/article-covers/finance-berkshire-hathaway.jpg',
  'finance/bitcoin': '/images/article-covers/finance-bitcoin.jpg',
  'products/audio-interface': '/images/article-covers/products-audio-interface.jpg',
  'products/kurutoga': '/images/article-covers/products-kurutoga.jpg',
  'products/cx31993-dac': '/images/article-covers/products-cx31993-dac.jpg',
  'products/cleansing-milk': '/images/article-covers/products-cleansing-milk.jpg',
  'products/fidget-toy': '/images/article-covers/products-fidget-toy.jpg',
};

export function getCuratedArticleImage(slug) {
  return Object.hasOwn(curatedCoverImages, slug) ? curatedCoverImages[slug] ?? '' : '';
}

function withoutCode(markdown) {
  const fence = String.fromCharCode(96).repeat(3);
  return markdown.replace(new RegExp(fence + '[\\s\\S]*?' + fence, 'g'), '');
}

function getCoverImage(markdown, slug) {
  if (Object.hasOwn(curatedCoverImages, slug)) return curatedCoverImages[slug] ?? '';
  const source = withoutCode(markdown);
  const markdownImage = source.match(/!\[[^\]]*\]\((<[^>]+>|[^)\s]+)[^)]*\)/);
  const htmlImage = source.match(/<img\b[^>]*?src=["']([^"']+)["']/i);
  let image = (markdownImage?.[1] ?? htmlImage?.[1] ?? '').replace(/^<|>$/g, '');
  if (!image) return '';
  if (/^(?:https?:|data:|\/)/i.test(image)) return image;
  if (image.startsWith('@source/')) image = image.slice('@source/'.length);
  else image = path.posix.join(path.posix.dirname(slug), image);
  const publicPath = path.posix.normalize(image.split(/[?#]/)[0]);
  return existsSync(path.join(process.cwd(), 'public', publicPath)) ? '/' + image : '';
}

function getDeck(markdown) {
  const source = withoutCode(markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ''));
  const lines = source.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const tick = String.fromCharCode(96);
  const candidate = lines.slice(titleIndex + 1).map((line) => line.trim()).find((line) => line && !/^(?:#|!|<|>|:{3,}|[-*+]\s?)/.test(line) && !line.startsWith(tick));
  return candidate?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_~]/g, '').slice(0, 170) ?? '';
}

export function getArticleCover(slug, markdown, frontmatter = {}) {
  const categoryKey = slug.split('/')[0];
  const coverHue = [...slug].reduce((hue, char) => (hue * 31 + char.charCodeAt(0)) % 360, 17);
  const coverPattern = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6;
  return {
    category: categoryLabels[categoryKey] ?? categoryKey.toUpperCase(),
    coverHue,
    coverPattern,
    coverImage: getCoverImage(markdown, slug),
    deck: frontmatter.description || getDeck(markdown),
  };
}
