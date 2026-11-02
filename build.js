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
];

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
    'Every morning a Claude Code routine goes looking for problems people already complain about or pay to solve, and writes up the best few as buildable software. Each idea carries its evidence and a score out of 30. Ideas that clear the quality bar are marked validated; the rest ship as provisional and say what they are missing. Ideas are sized by effort, from a single weekend to a multi-week build. See one you need, or something close to it? Email me and we can talk about building it. Some are already built: they are in the Implemented section, and the rest of my Claude-built apps are linked below.',
};

// ---- Emit -----------------------------------------------------------------

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function build() {
  let ideas = loadIdeas();
  ideas = applyImplemented(ideas);
  ideas = applyTopics(ideas);

  const live = ideas.filter((i) => !i.placeholder);
  const topics = TOPIC_NAMES.map((name) => ({
    name,
    slug: topicSlug(name),
    count: live.filter((i) => i.topic === name).length,
  })).filter((t) => t.count > 0);

  const payload = {
    generatedAt: new Date().toISOString(),
    meta: META,
    tiers: TIERS,
    topics,
    total: live.length,
    ideas,
  };

  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  copyDir(WEB_DIR, DIST_DIR);
  fs.writeFileSync(
    path.join(DIST_DIR, 'data.js'),
    'window.IDEAS_DATA = ' + JSON.stringify(payload, null, 2) + ';\n'
  );

  const counts = {};
  for (const t of TIERS) counts[t.key] = ideas.filter((i) => i.tierKey === t.key && !i.placeholder).length;
  console.log(`Built dist/ from ${ideas.length} ideas.`);
  console.log('  Per tier:', counts);
  const tagged = payload.ideas.filter((i) => i.topic && !i.placeholder).length;
  console.log(`  Topics: ${payload.topics.length} in use, ${tagged}/${payload.total} ideas tagged`);
  if (tagged < payload.total) {
    console.log(`    ${payload.total - tagged} untagged; run python3 scripts/tag_topics.py`);
  }
  console.log(`  data.js written, static files copied from web/.`);
}

build();
