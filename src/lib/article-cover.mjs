import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { articlePreviews } from '../data/article-previews.mjs';

const categoryLabels = {
  a: 'STUDY NOTES', ai: 'ARTIFICIAL INTELLIGENCE', brands: 'BRANDS', cs: 'COMPUTER SCIENCE',
  db: 'DATABASES', design: 'DESIGN', ds: 'DATA SCIENCE', finance: 'FINANCE', humanities: 'HUMANITIES',
  mp: 'MICROPROCESSORS', os: 'TECH & SYSTEMS', pl: 'PROGRAMMING LANGUAGES', products: 'PRODUCTS',
  rc: 'RESEARCH', se: 'SOFTWARE ENGINEERING', wellness: 'WELLNESS',
};

function withoutCode(markdown) {
  const fence = String.fromCharCode(96).repeat(3);
  return markdown.replace(new RegExp(fence + '[\\s\\S]*?' + fence, 'g'), '');
}

function getCoverImage(cover) {
  if (typeof cover !== 'string' || !cover.trim()) return '';
  const image = cover.trim();
  if (/^(?:https?:|data:)/i.test(image)) return image;
  if (!image.startsWith('/')) return '';
  const localPath = image.split(/[?#]/)[0];
  return existsSync(path.join(process.cwd(), 'public', localPath.slice(1))) ? image : '';
}

export async function getAverageCoverHue(coverImage, fallbackHue) {
  try {
    let imageSource;
    if (coverImage?.startsWith('/') && !coverImage.startsWith('//')) {
      const publicRoot = path.resolve(process.cwd(), 'public');
      const localPath = coverImage.split(/[?#]/)[0].slice(1);
      const imagePath = path.resolve(publicRoot, localPath);
      if (!imagePath.startsWith(publicRoot + path.sep)) return fallbackHue;
      imageSource = imagePath;
    } else if (/^https?:\/\//i.test(coverImage ?? '')) {
      const response = await fetch(coverImage, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) return fallbackHue;
      imageSource = Buffer.from(await response.arrayBuffer());
    } else {
      return fallbackHue;
    }

    const { data, info } = await sharp(imageSource)
      .resize(32, 32, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let red = 0;
    let green = 0;
    let blue = 0;
    let totalWeight = 0;
    for (let index = 0; index < data.length; index += info.channels) {
      const alpha = data[index + 3] / 255;
      red += data[index] * alpha;
      green += data[index + 1] * alpha;
      blue += data[index + 2] * alpha;
      totalWeight += alpha;
    }
    if (!totalWeight) return fallbackHue;

    red /= totalWeight;
    green /= totalWeight;
    blue /= totalWeight;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    if (delta < 8) return fallbackHue;

    let hue;
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
    if (hue < 0) hue += 360;
    return Math.round(hue);
  } catch {
    return fallbackHue;
  }
}

function truncateAtSentence(text, maxLength) {
  const endings = [...text.matchAll(/[.!?。！？](?:["'”’」』】）)]*)?(?=\s|$)/gu)];
  const withinLimit = endings.filter((ending) => ending.index + ending[0].length <= maxLength);
  const ending = withinLimit.at(-1) ?? endings[0];
  return ending ? text.slice(0, ending.index + ending[0].length).trim() : text;
}

function getDeck(markdown) {
  const source = withoutCode(markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ''))
    .replace(/<iframe\b[\s\S]*?<\/iframe\s*>/gi, '\n')
    .replace(/<(?:script|style|video|audio|object)\b[\s\S]*?<\/(?:script|style|video|audio|object)\s*>/gi, '\n');
  const lines = source.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const tick = String.fromCharCode(96);
  const candidate = lines.slice(titleIndex + 1).map((line) => line.trim()).find((line) => line && !/^(?:#{1,6}\s|!|<|>|\||:{3,}|[-*+]\s+|(?:src|width|height|style|allow|allowfullscreen|loading|referrerpolicy|frameborder)=)/i.test(line) && !line.startsWith(tick));
  const text = candidate?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_~]/g, '') ?? '';
  return truncateAtSentence(text, 170);
}

export function getArticleCover(slug, markdown, frontmatter = {}) {
  const categoryKey = slug.split('/')[0];
  const coverHue = [...slug].reduce((hue, char) => (hue * 31 + char.charCodeAt(0)) % 360, 17);
  const coverPattern = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6;
  return {
    category: categoryLabels[categoryKey] ?? categoryKey.toUpperCase(),
    coverHue,
    coverPattern,
    coverImage: getCoverImage(frontmatter.cover),
    deck: articlePreviews[slug] || frontmatter.description || getDeck(markdown),
  };
}
