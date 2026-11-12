#!/usr/bin/env node
/**
 * Make the HintWise Studio images in web/media/ (run by hand, not by build.js).
 *
 * Usage: node scripts/studio_media.js <path to claude-built-apps> [slug ...]
 *
 * For every app in studio.json and implemented.json (or only the slugs named):
 *   - an app with a demo GIF gets web/media/<slug>.jpg, one frame of the GIF,
 *     960 px wide; a featured app also gets web/media/<slug>.mp4, the whole
 *     GIF as a small silent video for its big card on the home page;
 *   - an app without one gets a 1200x750 screenshot of its live home page
 *     (needs Playwright with Chromium; skipped with a warning otherwise).
 * Existing files are kept unless the slug is named on the command line.
 * Needs ffmpeg. The build itself never runs this: it only reads web/media/.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MEDIA = path.join(ROOT, 'web', 'media');
const [cba, ...only] = process.argv.slice(2);
if (!cba) {
  console.error('usage: node scripts/studio_media.js <claude-built-apps dir> [slug ...]');
  process.exit(2);
}

const studio = JSON.parse(fs.readFileSync(path.join(ROOT, 'studio.json'), 'utf8'));
const implemented = JSON.parse(fs.readFileSync(path.join(ROOT, 'implemented.json'), 'utf8')).projects;
const slugOf = (u) => String(u).replace(/^https?:\/\//, '').split('.')[0];

const apps = new Map();
// A placeholder (an app still being built) has no url yet: skip it.
for (const p of implemented) if (p.url) apps.set(slugOf(p.url), p.url.replace('.pisan.me', '.hintwise.org'));
for (const [slug, a] of Object.entries(studio.apps)) if (a.url) apps.set(slug, a.url);

// Where a demo image lives when it is not <claude-built-apps>/<slug>/demo.gif.
const SOURCES = {
  stepwise: path.join(cba, 'docs', 'images', 'stepwise.gif'),
  mychessmaster: path.join(cba, 'docs', 'images', 'mychessmaster-report.png'),
  'chess-td': path.join(ROOT, 'scripts', 'media-src', 'chess-td.gif'),
};

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

function frames(gif) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', gif]).toString().trim();
  return parseInt(out, 10) || 1;
}

const todo = [];
fs.mkdirSync(MEDIA, { recursive: true });
for (const [slug, url] of apps) {
  if (only.length && !only.includes(slug)) continue;
  const jpg = path.join(MEDIA, `${slug}.jpg`);
  const src = SOURCES[slug] || path.join(cba, slug, 'demo.gif');
  const force = only.includes(slug);
  if (fs.existsSync(src)) {
    if (force || !fs.existsSync(jpg)) {
      const isGif = src.endsWith('.gif');
      // Two thirds of the way through a demo is usually past the setup and
      // showing the result.
      const pick = isGif ? Math.floor(frames(src) * 0.66) : 0;
      ffmpeg(['-i', src, '-vf', `select=eq(n\\,${pick}),scale='min(960,iw)':-2`, '-frames:v', '1', '-q:v', '4', jpg]);
      console.log('frame', slug);
    }
    const mp4 = path.join(MEDIA, `${slug}.mp4`);
    if (studio.featured.includes(slug) && src.endsWith('.gif') && (force || !fs.existsSync(mp4))) {
      ffmpeg(['-i', src, '-movflags', '+faststart', '-pix_fmt', 'yuv420p', '-an',
        '-vf', "scale='min(960,iw)':-2:flags=lanczos,pad=ceil(iw/2)*2:ceil(ih/2)*2",
        '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', mp4]);
      console.log('video', slug);
    }
  } else if (force || !fs.existsSync(jpg)) {
    todo.push([slug, url]);
  }
}

if (todo.length) {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch {
    console.warn(`! Playwright not found; no screenshot for: ${todo.map((t) => t[0]).join(', ')}`);
    process.exit(0);
  }
  (async () => {
    const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
    const browser = await chromium.launch({ proxy });
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-'));
    for (const [slug, url] of todo) {
      const page = await browser.newPage({ viewport: { width: 1200, height: 750 }, colorScheme: 'light' });
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(1500);
        const png = path.join(tmp, `${slug}.png`);
        await page.screenshot({ path: png });
        ffmpeg(['-i', png, '-vf', 'scale=960:-2', '-q:v', '4', path.join(MEDIA, `${slug}.jpg`)]);
        console.log('screenshot', slug);
      } catch (err) {
        console.warn(`! ${slug}: ${err.message.split('\n')[0]}`);
      }
      await page.close();
    }
    await browser.close();
  })();
}
