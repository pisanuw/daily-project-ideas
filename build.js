#!/usr/bin/env node
// Zero-dependency build step for the Daily Project Ideas site.
//
// Reads project ideas from ideas/YYYY-MM-DD.{json,md}, merges the curated
// implemented.json overlay, and emits dist/ (static files + data.js).
//
// Data precedence per date: ideas/<date>.json (if present) overrides
// ideas/<date>.md. The daily routine may emit either format; markdown is the
// historical default and JSON is preferred going forward (see ideas/SCHEMA.md).

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const IDEAS_DIR = path.join(ROOT, 'ideas');
const WEB_DIR = path.join(ROOT, 'web');
const DIST_DIR = path.join(ROOT, 'dist');
const IMPLEMENTED_FILE = path.join(ROOT, 'implemented.json');
const TOPICS_FILE = path.join(IDEAS_DIR, 'topics.json');

// One topic per idea, for topic browsing. The closed list lives in
// ideas/topics-taxonomy.json so that build.js, scripts/tag_topics.py and
// scripts/validate_ideas.py cannot drift apart.
const TAXONOMY_FILE = path.join(IDEAS_DIR, 'topics-taxonomy.json');
const TOPIC_NAMES = JSON.parse(fs.readFileSync(TAXONOMY_FILE, 'utf8')).topics;

function topicSlug(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// An idea's own `topic` field wins (the routine writes it); ideas/topics.json
// covers the archive, which predates the field.
function loadTopics() {
  if (!fs.existsSync(TOPICS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'));
  } catch (err) {
    console.warn(`  warning: ${TOPICS_FILE} is not valid JSON, ignoring it`);
    return {};
  }
}

function applyTopics(ideas) {
  const map = loadTopics();
  const known = new Set(TOPIC_NAMES);
  let off = 0;
  for (const idea of ideas) {
    const topic = known.has(idea.topic) ? idea.topic : map[idea.id];
    if (topic && known.has(topic)) {
      idea.topic = topic;
      idea.topicSlug = topicSlug(topic);
    } else {
      if (topic) off += 1;
      delete idea.topic;
    }
  }
  if (off) console.warn(`  warning: ${off} ideas name a topic outside the list`);
  return ideas;
}

// Complexity tiers shown on the landing page, in display order. The first
// three map to the chili-pepper difficulty scale; "implemented" is special.
const TIERS = [
  { key: 'weekend', label: 'Weekend', peppers: '🌶️', count: 1,
    blurb: 'Build it in a weekend. Small scope, fast payoff, one core idea.' },
  { key: '1-2-weeks', label: '1–2 Weeks', peppers: '🌶️🌶️', count: 2,
    blurb: 'A couple of weeks of evenings. Real features, a bit of polish.' },
  { key: 'multi-week', label: 'Multi-week', peppers: '🌶️🌶️🌶️', count: 3,
    blurb: 'A serious build. Multiple moving parts, good as a course project.' },
  { key: 'research', label: 'Research Ideas', peppers: '🔬', count: 0,
    blurb: 'Research directions grounded in recent CS education papers, each with a 3-6 month plan.' },
  { key: 'implemented', label: 'Implemented', peppers: '🚀', count: 0,
    blurb: 'Ideas that have actually been built. Try the live versions.' },
];

function complexityKey(complexity) {
  const s = String(complexity || '').toLowerCase();
  if (s.includes('implement')) return 'implemented';
  if (s.includes('research')) return 'research';
  if (s.includes('weekend')) return 'weekend';
  if (s.includes('multi')) return 'multi-week';
  if (s.includes('1-2') || s.includes('1–2') || s.includes('1 - 2') || s.includes('1 to 2')) return '1-2-weeks';
  return 'multi-week'; // safe default: treat unknowns as the largest backlog tier
}

// First 1-2 sentences of a longer description, for the card preview.
function summarize(text, maxSentences = 2, maxChars = 240) {
  if (!text) return '';
  const sentences = String(text).match(/[^.!?]+[.!?]+(\s|$)/g) || [String(text)];
  let out = sentences.slice(0, maxSentences).join(' ').replace(/\s+/g, ' ').trim();
  if (out.length > maxChars) out = out.slice(0, maxChars - 1).replace(/\s+\S*$/, '').trim() + '…';
  return out;
}

// ---- Markdown parsing -----------------------------------------------------

function parseIdeaBlock(lines) {
  const idea = {
    title: '', category: '', complexity: '', inspiredBy: '',
    description: '', keyFeatures: [], techStack: '', whyInteresting: '',
  };
  const buf = { description: [], tech: [], why: [] };
  let section = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (/^---+$/.test(line)) continue;
    let m;
    if ((m = line.match(/^\*\*Category:\*\*\s*(.+)$/i))) { idea.category = m[1].trim(); continue; }
    if ((m = line.match(/^\*\*Complexity:\*\*\s*(.+)$/i))) { idea.complexity = m[1].trim(); continue; }
    if ((m = line.match(/^\*\*Inspired by:\*\*\s*(.+)$/i))) { idea.inspiredBy = m[1].trim(); continue; }
    if ((m = line.match(/^###\s+(.+)$/))) {
      const h = m[1].toLowerCase();
      if (h.startsWith('description')) section = 'description';
      else if (h.startsWith('key feature')) section = 'features';
      else if (h.includes('tech stack') || h.startsWith('suggested tech')) section = 'tech';
      else if (h.startsWith('why')) section = 'why';
      else section = null;
      continue;
    }
    if (!line) continue;
    if (section === 'features') {
      const fm = line.match(/^[-*]\s+(.+)$/);
      if (fm) idea.keyFeatures.push(fm[1].trim());
    } else if (section === 'description') buf.description.push(line);
    else if (section === 'tech') buf.tech.push(line);
    else if (section === 'why') buf.why.push(line);
  }
  idea.description = buf.description.join(' ').replace(/\s+/g, ' ').trim();
  idea.techStack = buf.tech.join(' ').replace(/\s+/g, ' ').trim();
  idea.whyInteresting = buf.why.join(' ').replace(/\s+/g, ' ').trim();
  return idea;
}

function parseMarkdown(text) {
  const lines = text.split(/\r?\n/);
  const ideas = [];
  let current = null;
  let n = 0;
  for (const raw of lines) {
    const m = raw.match(/^##\s+(?:(\d+)\.\s+)?(.+)$/);
    if (m) {
      if (current) ideas.push(current);
      n = m[1] ? parseInt(m[1], 10) : ideas.length + 1;
      current = { n, title: m[2].trim(), lines: [] };
    } else if (current) {
      current.lines.push(raw);
    }
  }
  if (current) ideas.push(current);
  return ideas.map((blk) => {
    const parsed = parseIdeaBlock(blk.lines);
    parsed.n = blk.n;
    if (!parsed.title) parsed.title = blk.title;
    else parsed.title = blk.title; // title comes from the ## heading
    return parsed;
  });
}

// ---- Normalisation --------------------------------------------------------

// Fields of the commercial idea schema that the detail modal renders.
const COMMERCIAL_KEYS = [
  'problemStatement', 'targetCustomer', 'buyer', 'whyNow', 'founderFit',
  'problemEvidence', 'competitors', 'mvpScope', 'pricing', 'revenueSketch',
  'distribution', 'validationTest', 'moat', 'compliance', 'risks',
  'scores', 'scoreRationale', 'review', 'confidence', 'gateGap',
  'smallBusiness', 'public',
];

// ---- Audience -------------------------------------------------------------
// The public site groups ideas by who they are for, not by effort: an effort
// label tells a possible client the work is quick and cheap. Effort stays in
// the owner's notes view.
const AUDIENCES = [
  { key: 'implemented', label: 'Already built', icon: '\u2705',
    blurb: 'Ideas that are live now. Try one, or ask for one like it.' },
  { key: 'small-business', label: 'For small businesses', icon: '\ud83c\udfea',
    blurb: 'Tools for shops, trades, clinics, studios and solo professionals.' },
  { key: 'teams', label: 'For startups and software teams', icon: '\ud83e\uddf0',
    blurb: 'Products and internal tools for companies that build or sell software.' },
  { key: 'education', label: 'For educators and schools', icon: '\ud83c\udf93',
    blurb: 'Tools for teachers, departments, trainers and learners.' },
  { key: 'more', label: 'More ideas: teaching and side projects', icon: '\ud83d\udca1',
    blurb: 'Earlier ideas: classroom projects, side projects and research directions.' },
];

function audienceOf(idea) {
  if (idea.implemented && !idea.placeholder) return 'implemented';
  if (idea.public && AUDIENCES.some((a) => a.key === idea.public.audience)) return idea.public.audience;
  if (!(idea.scores || idea.problemStatement) || idea.category === 'Research') return 'more';
  const cat = idea.category || '';
  if (cat === 'Small Business Ops' || idea.smallBusiness === true) return 'small-business';
  if (cat.startsWith('EdTech') || cat === 'Research & Lab Tools') return 'education';
  return 'teams';
}

// What a visitor's browser receives. Everything else (scores, evidence,
// competitors, pricing, the review, effort) is the owner's working notes and
// ships only in dist/notes/, behind the password.
const PUBLIC_KEYS = [
  'id', 'date', 'n', 'title', 'category', 'audience', 'summary', 'description',
  'keyFeatures', 'implemented', 'implementedOn', 'placeholder', 'url', 'repo',
  'notes', 'topic', 'topicSlug', 'problemStatement', 'targetCustomer', 'public',
];

function publicIdea(idea) {
  const out = {};
  for (const k of PUBLIC_KEYS) if (idea[k] !== undefined && idea[k] !== '') out[k] = idea[k];
  if (idea.mvpScope && Array.isArray(idea.mvpScope.features)) out.mvpScope = { features: idea.mvpScope.features };
  if (idea.implemented) out.notes = idea.publicNotes || '';
  return out;
}

function normalizeIdea(raw, date, n) {
  const complexity = raw.complexity || '';
  const description = raw.description || '';
  const base = {
    id: `${date}-${n}`,
    date,
    n,
    title: raw.title || `Untitled ${n}`,
    category: raw.category || '',
    complexity,
    tierKey: complexityKey(complexity),
    summary: (raw.summary && String(raw.summary).trim()) || summarize(description),
    description,
    keyFeatures: Array.isArray(raw.keyFeatures) ? raw.keyFeatures : [],
    techStack: raw.techStack || '',
    whyInteresting: raw.whyInteresting || '',
    inspiredBy: raw.inspiredBy || '',
    implemented: false,
    url: raw.url || '',
    repo: raw.repo || '',
    notes: raw.notes || '',
  };
  // Preserve research-specific fields when present.
  if (raw.papers) base.papers = raw.papers;
  if (raw.additionalRefs) base.additionalRefs = raw.additionalRefs;
  if (raw.researchPlan) base.researchPlan = raw.researchPlan;
  // Preserve commercial-idea fields (schemaVersion 2 and 3, see ROUTINE.md).
  for (const key of COMMERCIAL_KEYS) {
    if (raw[key] !== undefined && raw[key] !== null && raw[key] !== '') base[key] = raw[key];
  }
  return base;
}

function loadIdeas() {
  if (!fs.existsSync(IDEAS_DIR)) return [];
  const files = fs.readdirSync(IDEAS_DIR);
  const dates = new Set();
  for (const f of files) {
    const m = f.match(/^(\d{4}-\d{2}-\d{2})\.(md|json)$/);
    if (m) dates.add(m[1]);
  }
  const ideas = [];
  for (const date of [...dates].sort()) {
    const jsonPath = path.join(IDEAS_DIR, `${date}.json`);
    const mdPath = path.join(IDEAS_DIR, `${date}.md`);
    let dayIdeas = [];
    if (fs.existsSync(jsonPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const list = Array.isArray(data) ? data : (data.ideas || []);
        dayIdeas = list.map((it, i) => normalizeIdea(it, date, it.n || i + 1));
      } catch (err) {
        console.error(`! Failed to parse ${jsonPath}: ${err.message}`);
      }
    } else if (fs.existsSync(mdPath)) {
      const parsed = parseMarkdown(fs.readFileSync(mdPath, 'utf8'));
      dayIdeas = parsed.map((it, i) => normalizeIdea(it, date, it.n || i + 1));
    }
    ideas.push(...dayIdeas);
  }
  return ideas;
}

// ---- Implemented overlay --------------------------------------------------

function applyImplemented(ideas) {
  if (!fs.existsSync(IMPLEMENTED_FILE)) return ideas;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(IMPLEMENTED_FILE, 'utf8'));
  } catch (err) {
    console.error(`! Failed to parse implemented.json: ${err.message}`);
    return ideas;
  }
  const projects = Array.isArray(data) ? data : (data.projects || []);
  const byId = new Map(ideas.map((i) => [i.id, i]));
  const result = [...ideas];
  for (const proj of projects) {
    let base = null;
    if (proj.ref && proj.ref.date && proj.ref.n) {
      base = byId.get(`${proj.ref.date}-${proj.ref.n}`);
    } else if (proj.id) {
      base = byId.get(proj.id);
    }
    if (base) {
      // Promote an existing idea: move it into the Implemented tier.
      base.implemented = true;
      base.tierKey = 'implemented';
      if (proj.title) base.title = proj.title;
      if (proj.summary) base.summary = proj.summary;
      if (proj.description) base.description = proj.description;
      base.url = proj.url || base.url;
      base.repo = proj.repo || base.repo;
      base.notes = proj.notes || base.notes;
      base.publicNotes = proj.publicNotes || '';
      base.implementedOn = proj.implementedOn || '';
      base.placeholder = !!proj.placeholder;
    } else {
      // Standalone implemented project (no matching idea).
      const date = proj.date || proj.implementedOn || '0000-00-00';
      const idea = normalizeIdea(proj, date, proj.n || 0);
      idea.id = proj.id || `impl-${result.length}`;
      idea.implemented = true;
      idea.tierKey = 'implemented';
      idea.implementedOn = proj.implementedOn || '';
      idea.placeholder = !!proj.placeholder;
      idea.publicNotes = proj.publicNotes || '';
      result.push(idea);
    }
  }
  return result;
}

// ---- Site metadata --------------------------------------------------------

const META = {
  title: 'Daily Project Ideas',
  tagline: 'Software I could build for you. New ideas every morning.',
  description:
    'Every morning a Claude Code routine looks for problems that small businesses, startups and educators complain about or already pay to solve, and writes up the best as software I could build. See one you need, or something close to it? Email me and we can talk about building it. Some are already built: try them in the first section.',
};

// ---- Emit -----------------------------------------------------------------

// The owner's notes: the same page with every field, at /notes/, which the
// edge function netlify/edge-functions/notes-auth.js puts behind a password.
function writeNotes(payload) {
  const dir = path.join(DIST_DIR, 'notes');
  fs.mkdirSync(dir, { recursive: true });
  let html = fs.readFileSync(path.join(WEB_DIR, 'index.html'), 'utf8');
  html = html
    .replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow" />')
    .replace('href="styles.css"', 'href="../styles.css"')
    .replace('<script src="data.js"></script>', '<script>window.NOTES_MODE = true;</script>\n  <script src="data.js"></script>')
    .replace('<script src="app.js"></script>', '<script src="../app.js"></script>')
    .replace(/href="(index|browse|topics)\.html/g, 'href="../$1.html');
  if (!html.includes('window.NOTES_MODE')) throw new Error('notes page: script tags not found in web/index.html');
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  fs.writeFileSync(path.join(dir, 'data.js'), 'window.IDEAS_DATA = ' + JSON.stringify(payload) + ';\n');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Customer-facing copy for older ideas, keyed by id; a day file's own
// `public` block wins (the routine writes one for every new idea).
const PUBLIC_FILE = path.join(IDEAS_DIR, 'public.json');
function applyPublicCopy(ideas) {
  if (!fs.existsSync(PUBLIC_FILE)) return ideas;
  const copy = JSON.parse(fs.readFileSync(PUBLIC_FILE, 'utf8'));
  for (const i of ideas) if (!i.public && copy[i.id]) i.public = copy[i.id];
  return ideas;
}

function build() {
  let ideas = loadIdeas();
  ideas = applyPublicCopy(ideas);
  ideas = applyImplemented(ideas);
  ideas = applyTopics(ideas);

  const live = ideas.filter((i) => !i.placeholder);
  const topics = TOPIC_NAMES.map((name) => ({
    name,
    slug: topicSlug(name),
    count: live.filter((i) => i.topic === name).length,
  })).filter((t) => t.count > 0);

  for (const i of ideas) i.audience = audienceOf(i);

  const payload = {
    generatedAt: new Date().toISOString(),
    meta: META,
    tiers: TIERS,
    audiences: AUDIENCES,
    topics,
    total: live.length,
    ideas,
  };
  const publicPayload = {
    generatedAt: payload.generatedAt,
    meta: META,
    audiences: AUDIENCES,
    topics,
    total: live.length,
    ideas: ideas.filter((i) => !i.placeholder).map(publicIdea),
  };

  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  copyDir(WEB_DIR, DIST_DIR);
  fs.writeFileSync(
    path.join(DIST_DIR, 'data.js'),
    'window.IDEAS_DATA = ' + JSON.stringify(publicPayload) + ';\n'
  );
  writeNotes(payload);

  const counts = {};
  for (const a of AUDIENCES) counts[a.key] = ideas.filter((i) => i.audience === a.key && !i.placeholder).length;
  console.log(`Built dist/ from ${ideas.length} ideas.`);
  console.log('  Per audience:', counts);
  const tagged = payload.ideas.filter((i) => i.topic && !i.placeholder).length;
  console.log(`  Topics: ${payload.topics.length} in use, ${tagged}/${payload.total} ideas tagged`);
  if (tagged < payload.total) {
    console.log(`    ${payload.total - tagged} untagged; run python3 scripts/tag_topics.py`);
  }
  console.log(`  data.js written, static files copied from web/.`);
}

build();
