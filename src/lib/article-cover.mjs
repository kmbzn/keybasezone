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

export async function getDominantCoverHue(coverImage, fallbackHue) {
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
      .resize(64, 64, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const hueBinCount = 36;
    const hueBinSize = 360 / hueBinCount;
    const hueWeights = new Array(hueBinCount).fill(0);
    const coloredPixels = [];
    for (let index = 0; index < data.length; index += info.channels) {
      const alpha = data[index + 3] / 255;
      if (alpha < 0.1) continue;

      const red = data[index] / 255;
      const green = data[index + 1] / 255;
      const blue = data[index + 2] / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const delta = max - min;
      if (delta < 0.08) continue;

      let hue;
      if (max === red) hue = 60 * (((green - blue) / delta) % 6);
      else if (max === green) hue = 60 * ((blue - red) / delta + 2);
      else hue = 60 * ((red - green) / delta + 4);
      if (hue < 0) hue += 360;

      const weight = alpha;
      hueWeights[Math.floor(hue / hueBinSize) % hueBinCount] += weight;
      coloredPixels.push({ hue, weight });
    }
    if (!coloredPixels.length) return fallbackHue;

    let dominantBin = 0;
    let dominantWeight = -1;
    for (let bin = 0; bin < hueBinCount; bin += 1) {
      let neighborhoodWeight = 0;
      for (let offset = -2; offset <= 2; offset += 1) {
        neighborhoodWeight += hueWeights[(bin + offset + hueBinCount) % hueBinCount];
      }
      if (neighborhoodWeight > dominantWeight) {
        dominantBin = bin;
        dominantWeight = neighborhoodWeight;
      }
    }

    const dominantHue = (dominantBin + 0.5) * hueBinSize;
    let sin = 0;
    let cos = 0;
    for (const { hue, weight } of coloredPixels) {
      const distance = Math.abs(((hue - dominantHue + 540) % 360) - 180);
      if (distance > 25) continue;
      const radians = hue * Math.PI / 180;
      sin += Math.sin(radians) * weight;
      cos += Math.cos(radians) * weight;
    }
    if (sin === 0 && cos === 0) return Math.round(dominantHue) % 360;
    return Math.round((Math.atan2(sin, cos) * 180 / Math.PI + 360) % 360);
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
