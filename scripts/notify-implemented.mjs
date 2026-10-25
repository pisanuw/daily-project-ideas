#!/usr/bin/env node
/**
 * Emails one digest of newly implemented projects, at most once a day.
 *
 * A project counts as implemented when its implemented.json entry has an
 * `implementedOn` date and is not a `placeholder` (the daily routine adds a
 * placeholder entry when it claims an idea, then fills it in when the work
 * lands). Everything already emailed is recorded in notify-state.json, so a
 * missed or failed day is picked up by the next run rather than lost.
 *
 * The writeup mirrors https://pisanorg.github.io/yusuf/aiprojects : the title
 * links to the live site, the prose comes from the entry's `notes`, and a
 * closing line points at the README and the deployment.
 *
 * Usage:
 *   node scripts/notify-implemented.mjs            # send if anything is new
 *   node scripts/notify-implemented.mjs --dry-run  # print, send nothing
 *   node scripts/notify-implemented.mjs --force    # ignore the once-a-day guard
 *
 * Env (CI: GitHub secrets; local: .env, which is git-ignored):
 *   RESEND_API_KEY, FROM_EMAIL, ADMIN_EMAIL
 *
 * Zero dependencies, like build.js. Needs Node 18+ for global fetch.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IDEAS_DIR = path.join(ROOT, 'ideas');
const IMPLEMENTED_FILE = path.join(ROOT, 'implemented.json');
const STATE_FILE = path.join(ROOT, 'notify-state.json');

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

// ---- env ------------------------------------------------------------------

// Local convenience only: in CI the values arrive as real env vars and this
// file does not exist. Existing env always wins, so CI secrets cannot be
// shadowed by a stale checkout.
function loadDotEnv() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (!m) continue;
    const key = m[1];
    if (process.env[key]) continue;
    process.env[key] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
}

// ---- idea lookup ----------------------------------------------------------

// implemented.json refers to ideas by {date, n}; the title lives in the idea
// file. JSON beats Markdown for the same date, as in build.js.
function lookupIdea(date, n) {
  const jsonFile = path.join(IDEAS_DIR, `${date}.json`);
  if (fs.existsSync(jsonFile)) {
    try {
      const doc = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      const hit = (doc.ideas || []).find((i) => Number(i.n) === Number(n));
      if (hit) {
        return {
          title: hit.title || '',
          summary: hit.summary || '',
          description: hit.description || '',
        };
      }
    } catch (err) {
      console.error(`! ${date}.json did not parse: ${err.message}`);
    }
  }
  const mdFile = path.join(IDEAS_DIR, `${date}.md`);
  if (fs.existsSync(mdFile)) {
    const lines = fs.readFileSync(mdFile, 'utf8').split(/\r?\n/);
    let count = 0;
    for (let i = 0; i < lines.length; i += 1) {
      const m = lines[i].match(/^##\s+(?:(\d+)\.\s+)?(.+)$/);
      if (!m) continue;
      count += 1;
      const num = m[1] ? Number(m[1]) : count;
      if (num !== Number(n)) continue;
      // First prose line under ### Description, for the fallback blurb.
      let description = '';
      for (let j = i + 1; j < lines.length && !/^##\s/.test(lines[j]); j += 1) {
        if (/^###\s+description/i.test(lines[j])) {
          const buf = [];
          for (let k = j + 1; k < lines.length && !/^###?\s/.test(lines[k]); k += 1) {
            if (lines[k].trim()) buf.push(lines[k].trim());
          }
          description = buf.join(' ');
          break;
        }
      }
      return { title: m[2].trim(), summary: '', description };
    }
  }
  return { title: '', summary: '', description: '' };
}

// ---- project model --------------------------------------------------------

function keyFor(proj) {
  if (proj.ref && proj.ref.date && proj.ref.n) return `${proj.ref.date}#${proj.ref.n}`;
  return proj.url || proj.title || JSON.stringify(proj);
}

function isImplemented(proj) {
  return !proj.placeholder && !!proj.implementedOn;
}

// repo points at the directory; the README sits inside it.
function readmeUrl(repo) {
  if (!repo) return '';
  const m = repo.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/tree\/([^/]+)\/(.+?)\/?$/);
  if (m) return `${m[1]}/blob/${m[2]}/${m[3]}/README.md`;
  return repo;
}

// The aiprojects page breaks each writeup where the honest caveats begin.
// implemented.json keeps the notes as one block, so split on that sentence.
function paragraphs(notes) {
  const text = String(notes || '').trim();
  if (!text) return [];
  const m = text.match(/(?:^|\s)(The honest limitation|The honest caveat|The limitation|Limitations?:)/);
  if (m && m.index > 0) {
    const at = text.indexOf(m[1], m.index);
    return [text.slice(0, at).trim(), text.slice(at).trim()].filter(Boolean);
  }
  return [text];
}

function longDate(iso) {
  const [y, mo, d] = String(iso || '').split('-').map(Number);
  if (!y || !mo || !d) return String(iso || '');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[mo - 1]} ${y}`;
}

function collect() {
  const doc = JSON.parse(fs.readFileSync(IMPLEMENTED_FILE, 'utf8'));
  return (doc.projects || []).filter(isImplemented).map((proj) => {
    const idea = proj.ref ? lookupIdea(proj.ref.date, proj.ref.n) : {};
    return {
      key: keyFor(proj),
      title: proj.title || idea.title || 'Untitled project',
      url: proj.url || '',
      repo: proj.repo || '',
      readme: readmeUrl(proj.repo),
      implementedOn: proj.implementedOn || '',
      // Prefer the hand-written notes; fall back to the idea's own blurb so a
      // project with no notes yet still gets a usable paragraph.
      body: paragraphs(proj.notes || idea.summary || idea.description),
    };
  });
}

// ---- rendering ------------------------------------------------------------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function subjectFor(projects) {
  const titles = projects.map((p) => p.title);
  if (projects.length === 1) return `New project implemented: ${titles[0]}`;
  return `${projects.length} new projects implemented: ${titles.join(', ')}`;
}

function renderText(projects) {
  const out = [];
  for (const p of projects) {
    out.push(p.title);
    out.push('='.repeat(p.title.length));
    out.push('');
    for (const para of p.body) {
      out.push(para);
      out.push('');
    }
    const links = [];
    if (p.readme) links.push(`README: ${p.readme}`);
    if (p.url) links.push(`Live: ${p.url}`);
    if (links.length) {
      out.push(links.join('\n'));
      out.push('');
    }
    out.push(`(Implemented ${longDate(p.implementedOn)})`);
    out.push('');
    out.push('---');
    out.push('');
  }
  out.push('From daily-project-ideas: https://daily-project-ideas.netlify.app/');
  return out.join('\n');
}

function renderHtml(projects) {
  const blocks = projects.map((p) => {
    const heading = p.url
      ? `<a href="${escapeHtml(p.url)}" style="color:#1a4f8a;text-decoration:none">${escapeHtml(p.title)}</a>`
      : escapeHtml(p.title);
    const paras = p.body
      .map((para) => `<p style="margin:0 0 1em">${escapeHtml(para)}</p>`)
      .join('\n');
    const bits = [];
    if (p.readme) bits.push(`See <a href="${escapeHtml(p.readme)}" style="color:#1a4f8a">README</a> for more details on the code`);
    if (p.url) bits.push(`or try it at <a href="${escapeHtml(p.url)}" style="color:#1a4f8a">${escapeHtml(p.url.replace(/^https?:\/\//, ''))}</a>`);
    const links = bits.length ? `<p style="margin:0 0 0.5em">${bits.join(' ')}</p>` : '';
    return `<h2 style="font-size:1.25em;margin:0 0 0.6em">${heading}</h2>
${paras}
${links}
<p style="margin:0;color:#666;font-size:0.9em">(Implemented ${escapeHtml(longDate(p.implementedOn))})</p>`;
  }).join('\n<hr style="border:none;border-top:1px solid #e2e2e2;margin:2em 0">\n');

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#fff;color:#1a1a1a;font:16px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:40em;margin:0 auto">
${blocks}
<p style="margin:2.5em 0 0;color:#666;font-size:0.85em">
From <a href="https://daily-project-ideas.netlify.app/" style="color:#666">daily-project-ideas</a>.
</p>
</div>
</body></html>`;
}

// ---- state ----------------------------------------------------------------

function readState() {
  if (!fs.existsSync(STATE_FILE)) return { lastSentOn: null, notified: [] };
  const doc = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  return { lastSentOn: doc.lastSentOn || null, notified: doc.notified || [] };
}

function writeState(state, allKeys) {
  const doc = {
    _comment: 'Written by scripts/notify-implemented.mjs. lastSentOn caps the digest at one email a day; notified lists every implemented.json key already emailed.',
    lastSentOn: state.lastSentOn,
    notified: allKeys.slice().sort(),
  };
  fs.writeFileSync(STATE_FILE, `${JSON.stringify(doc, null, 2)}\n`);
}

// ---- send -----------------------------------------------------------------

async function send(subject, text, html) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  const to = process.env.ADMIN_EMAIL;
  const missing = [
    !key && 'RESEND_API_KEY', !from && 'FROM_EMAIL', !to && 'ADMIN_EMAIL',
  ].filter(Boolean);
  if (missing.length) throw new Error(`missing env: ${missing.join(', ')}`);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`);
  let id = '';
  try { id = JSON.parse(body).id || ''; } catch { /* non-JSON success body */ }
  return id;
}

// ---- main -----------------------------------------------------------------

async function main() {
  loadDotEnv();
  const today = new Date().toISOString().slice(0, 10);
  const projects = collect();
  const allKeys = projects.map((p) => p.key);
  const state = readState();
  const seen = new Set(state.notified);
  const fresh = projects.filter((p) => !seen.has(p.key));

  if (!fresh.length) {
    console.log(`Nothing new (${allKeys.length} implemented, all already emailed).`);
    return;
  }

  fresh.sort((a, b) => String(a.implementedOn).localeCompare(String(b.implementedOn)));
  const subject = subjectFor(fresh);
  const text = renderText(fresh);
  const html = renderHtml(fresh);

  if (DRY_RUN) {
    console.log(`--- would send to ${process.env.ADMIN_EMAIL || '(ADMIN_EMAIL unset)'}`);
    console.log(`Subject: ${subject}`);
    console.log('');
    console.log(text);
    console.log('--- end (dry run: nothing sent, state unchanged)');
    return;
  }

  if (state.lastSentOn === today && !FORCE) {
    console.log(`Already sent today (${today}); holding ${fresh.length} project(s) for tomorrow. Use --force to override.`);
    return;
  }

  const id = await send(subject, text, html);
  console.log(`Sent ${fresh.length} project(s)${id ? ` (Resend id ${id})` : ''}: ${fresh.map((p) => p.title).join(', ')}`);
  writeState({ lastSentOn: today }, allKeys);
}

main().catch((err) => {
  console.error(`! ${err.message}`);
  process.exit(1);
});
