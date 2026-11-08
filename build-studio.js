// HintWise Studio pages, written by build.js into dist/:
//   index.html             home: hero, featured apps, audiences, how it works, about
//   apps/index.html        every built app, with audience filters and a search box
//   apps/<slug>/index.html one page per app
// plus the shared navigation and footer that build.js also puts into the
// Next up pages (web/next-up.html, browse.html, topics.html).
//
// Inputs: the built apps (implemented.json merged into the ideas by build.js)
// and studio.json (public names, blurbs, audiences, featured order, and apps
// built outside the daily-ideas routine). Images come from web/media/, made by
// scripts/studio_media.js. Public pages carry no scores, evidence, competitor
// names, build times, tech stack or test counts: the fields read here are the
// customer-facing ones (publicNotes and an idea's `public` block).

const fs = require('fs');
const path = require('path');

const SITE = 'https://studio.hintwise.org';
const CONTACT = 'builder@hintwise.org';
const ACADEMIC_URL = 'https://pisanorg.github.io/yusuf/';
const NAME = 'HintWise Studio';
const OG_IMAGE = `${SITE}/og-image.png`;

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const mailto = (subject) => `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`;

// Every app moved from <app>.pisan.me to <app>.hintwise.org on 2026-11-08, and
// this site from daily-project-ideas.pisan.me to studio.hintwise.org. Older
// records still name the old hosts; links are rewritten on the way out.
function hintwiseLinks(text) {
  return String(text)
    .replace(/https?:\/\/daily-project-ideas\.pisan\.me/g, SITE)
    .replace(/https?:\/\/([a-z0-9-]+)\.pisan\.me/g, 'https://$1.hintwise.org');
}

const slugOf = (url) => String(url).replace(/^https?:\/\//, '').split(/[./]/)[0];

// The site's audience filters, and how an idea's own audience maps onto them
// when studio.json has no entry for a new app.
const IDEA_AUDIENCE = {
  'small-business': 'small-business', education: 'educators', teams: 'developers', more: 'learners',
};

function firstSentences(text, n) {
  const parts = String(text || '').match(/[^.!?]+[.!?]+(\s|$)/g) || [String(text || '')];
  return parts.slice(0, n).join(' ').replace(/\s+/g, ' ').trim();
}

// publicNotes end with "Limitation: ..." (or "Limitations:"). The page shows
// that part separately, under "Good to know".
function splitNotes(notes) {
  const m = String(notes || '').match(/^(.*?)\s*\bLimitations?:\s*(.*)$/s);
  if (!m) return { what: String(notes || '').trim(), limits: '' };
  const limits = m[2].trim();
  return { what: m[1].trim(), limits: limits.charAt(0).toUpperCase() + limits.slice(1) };
}

function collectApps(ideas, studio, mediaDir) {
  const entries = studio.apps || {};
  const apps = [];
  const seen = new Set();
  for (const idea of ideas) {
    if (!idea.implemented || idea.placeholder || !idea.url) continue;
    const slug = slugOf(idea.url);
    if (seen.has(slug)) continue;
    seen.add(slug);
    const e = entries[slug] || {};
    const pub = idea.public || {};
    const notes = splitNotes(idea.publicNotes);
    apps.push({
      slug,
      title: e.title || idea.title,
      url: hintwiseLinks(e.url || idea.url),
      blurb: e.blurb || pub.summary || firstSentences(notes.what, 1) || idea.summary,
      featuredBlurb: e.featuredBlurb || '',
      audiences: e.audiences || [IDEA_AUDIENCE[idea.audience] || 'learners'],
      problem: pub.problem || '',
      forWhom: pub.forWhom || '',
      benefits: Array.isArray(pub.benefits) ? pub.benefits : [],
      what: e.description || notes.what || idea.description || '',
      limits: notes.limits,
      date: idea.implementedOn || '',
    });
  }
  for (const [slug, e] of Object.entries(entries)) {
    if (seen.has(slug) || !e.url) continue;
    seen.add(slug);
    const notes = splitNotes(e.description);
    apps.push({
      slug, title: e.title, url: hintwiseLinks(e.url), blurb: e.blurb, featuredBlurb: e.featuredBlurb || '',
      audiences: e.audiences || ['learners'], problem: e.problem || '', forWhom: e.forWhom || '',
      benefits: e.benefits || [], what: notes.what, limits: notes.limits, date: e.date || '',
    });
  }
  for (const a of apps) {
    a.image = fs.existsSync(path.join(mediaDir, `${a.slug}.jpg`)) ? `/media/${a.slug}.jpg` : '';
    a.video = fs.existsSync(path.join(mediaDir, `${a.slug}.mp4`)) ? `/media/${a.slug}.mp4` : '';
  }
  // Featured first, in the owner's order; then newest first; undated last.
  const featured = studio.featured || [];
  const rank = (a) => (featured.includes(a.slug) ? featured.indexOf(a.slug) : featured.length);
  apps.sort((a, b) => rank(a) - rank(b)
    || (b.date || '').localeCompare(a.date || '')
    || a.title.localeCompare(b.title));
  return apps;
}

// ---- Page shell -------------------------------------------------------------

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232443c9'/%3E%3Ctext x='32' y='45' font-family='Arial,Helvetica,sans-serif' font-size='38' font-weight='700' text-anchor='middle' fill='%23fff'%3EH%3C/text%3E%3C/svg%3E";

function head({ title, description, pathname, noindex }) {
  const url = SITE + pathname;
  return `<meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />${noindex ? '\n  <meta name="robots" content="noindex, nofollow" />' : ''}
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#fcfbf8" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#12141a" media="(prefers-color-scheme: dark)" />
  <meta property="og:site_name" content="${NAME}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="HintWise Studio: small, focused software for small businesses, startups and educators" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="icon" href="${FAVICON}" />
  <link rel="preload" href="/fonts/atkinson-next-latin-var.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/nunito-latin-var.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css" />`;
}

function nav(active) {
  const cur = (k) => (k === active ? ' aria-current="page"' : '');
  return `<a class="skip" href="#main">Skip to content</a>
  <header class="site-nav">
    <div class="wrap site-nav__inner">
      <a class="wordmark" href="/" aria-label="HintWise Studio, home">HintWise<span> Studio</span></a>
      <nav class="site-nav__links" aria-label="Main">
        <a href="/apps/"${cur('apps')}>Apps</a>
        <a href="/next-up.html"${cur('next-up')}>Next up</a>
        <a class="nav-about" href="/#about">About</a>
        <a class="site-nav__cta" href="${esc(mailto('Project idea (via HintWise Studio)'))}">Contact</a>
      </nav>
    </div>
  </header>`;
}

// The same words as the footer the claude-built-apps deploy adds to each app
// (claude-built-apps/scripts/site-footer.mjs), minus the "More apps" link,
// which would point at this site.
function footer() {
  return `<footer class="site-footer">
    <div class="wrap">
      <a class="wordmark" href="/">HintWise<span> Studio</span></a>
      <p>
        HintWise builds tools like these for small businesses, startups and educators.<br>
        Built with Claude, guided by experts.<br>
        Want something like this for your own work? <span class="nb">Email <a href="${esc(mailto('Project idea (via HintWise Studio)'))}">${CONTACT}</a>.</span><br>
        Paid projects welcome, <span class="nb">interesting ones may be done for free&nbsp;:-)</span><br>
        Academic page: <a href="${ACADEMIC_URL}">${ACADEMIC_URL}</a>
      </p>
      <p class="site-footer__name">Yusuf Pisan, Chief Education Officer, HintWise</p>
      <p class="site-footer__links"><a href="/apps/">All apps</a><a href="/next-up.html">Next up</a><a href="/#how">How it works</a></p>
    </div>
  </footer>`;
}

function page({ title, description, pathname, active, body, scripts = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head({ title, description, pathname })}
</head>
<body data-page="studio-${active || 'page'}">
  ${nav(active)}
  <main id="main">
${body}
  </main>
  ${footer()}
  <script src="/studio.js" defer></script>${scripts}
</body>
</html>
`;
}

// ---- Pieces -----------------------------------------------------------------

function audienceLabel(studio, key) {
  const a = (studio.audiences || []).find((x) => x.key === key);
  return a ? a.label : key;
}

// Decorative media: the title link next to it is the accessible link, so the
// picture is hidden from assistive technology and skipped by the keyboard.
function media(app, { video = false, eager = false } = {}) {
  if (!app.image) return '';
  const inner = video && app.video
    ? `<video autoplay muted loop playsinline preload="metadata" poster="${app.image}" width="960" height="600"><source src="${app.video}" type="video/mp4"></video>`
    : `<img src="${app.image}" alt="" width="960" height="600"${eager ? '' : ' loading="lazy"'} decoding="async">`;
  return `<a class="media" href="/apps/${app.slug}/" tabindex="-1" aria-hidden="true">${inner}</a>`;
}

function featureCard(app, studio) {
  return `      <article class="feature">
        ${media(app, { video: true })}
        <div class="feature__body">
          <p class="eyebrow">For ${esc(app.audiences.map((k) => audienceLabel(studio, k).toLowerCase()).join(' and '))}</p>
          <h3 class="feature__title"><a href="/apps/${app.slug}/">${esc(app.title)}</a></h3>
          <p class="feature__blurb">${esc(app.featuredBlurb || app.blurb)}</p>
          <p class="feature__actions">
            <a class="btn btn--small" href="${esc(app.url)}">Open ${esc(app.title)}</a>
            <a class="btn btn--quiet btn--small" href="/apps/${app.slug}/">About this app</a>
          </p>
        </div>
      </article>`;
}

function appCard(app, studio, level = 3) {
  const text = [app.title, app.blurb, app.forWhom, ...app.audiences.map((k) => audienceLabel(studio, k))]
    .join(' ').toLowerCase();
  return `      <article class="app-card" data-aud="${esc(app.audiences.join(' '))}" data-text="${esc(text)}">
        ${media(app)}
        <div class="app-card__body">
          <h${level} class="app-card__title"><a href="/apps/${app.slug}/">${esc(app.title)}</a></h${level}>
          <p class="app-card__blurb">${esc(app.blurb)}</p>
          <p class="app-card__meta">${app.audiences.map((k) => `<span class="aud">${esc(audienceLabel(studio, k))}</span>`).join('')}
            <a class="app-card__open" href="${esc(app.url)}" aria-label="Open ${esc(app.title)}">Open &#8599;</a></p>
        </div>
      </article>`;
}

// ---- Pages ------------------------------------------------------------------

function homePage(apps, studio) {
  const bySlug = new Map(apps.map((a) => [a.slug, a]));
  const featured = (studio.featured || []).map((s) => bySlug.get(s)).filter(Boolean);
  const tiles = (studio.audiences || []).map((a) => {
    const n = apps.filter((x) => x.audiences.includes(a.key)).length;
    return `      <a class="tile" href="/apps/?for=${a.key}">
        <span class="tile__label">${esc(a.label)}</span>
        <span class="tile__blurb">${esc(a.blurb)}</span>
        <span class="tile__count">${n} apps &rarr;</span>
      </a>`;
  }).join('\n');
  const tell = esc(mailto('Project idea (via HintWise Studio)'));
  const body = `    <section class="studio-hero wrap" aria-labelledby="hero-title">
      <h1 class="studio-hero__title" id="hero-title">Small, focused software that does one job well.</h1>
      <p class="studio-hero__lead">HintWise builds apps for small businesses, startups and educators. Tell us the problem; you get a working app in days.</p>
      <p class="studio-hero__cta">
        <a class="btn" href="${tell}">Tell us what you need</a>
        <a class="btn btn--quiet" href="/apps/">See the apps</a>
      </p>
      <p class="studio-hero__meta">${apps.length} apps built and live.</p>
    </section>

    <section class="band wrap" aria-labelledby="featured-title">
      <div class="band__head">
        <p class="eyebrow">Featured</p>
        <h2 class="band__title" id="featured-title">A few of the apps we have built</h2>
      </div>
      <div class="features">
${featured.map((a) => featureCard(a, studio)).join('\n')}
      </div>
      <p class="band__more"><a class="btn btn--quiet" href="/apps/">All ${apps.length} apps &rarr;</a></p>
    </section>

    <section class="band wrap" aria-labelledby="who-title">
      <div class="band__head">
        <p class="eyebrow">Who it's for</p>
        <h2 class="band__title" id="who-title">Find the apps made for you</h2>
      </div>
      <div class="tiles">
${tiles}
      </div>
    </section>

    <section class="band wrap" id="how" aria-labelledby="how-title">
      <div class="band__head">
        <p class="eyebrow">How it works</p>
        <h2 class="band__title" id="how-title">From a paragraph to a working app</h2>
      </div>
      <ol class="steps">
        <li><h3>Describe the problem</h3><p>Email a paragraph: who is stuck, what they do today and what it costs them. We will tell you honestly whether software is the right answer.</p></li>
        <li><h3>A working app in days</h3><p>A small first version that does the core job, ready for real people to try. Then improvements from what they say.</p></li>
        <li><h3>Use it or own it</h3><p>Use the app as it is, or take it and make it yours.</p></li>
      </ol>
      <div class="callout">
        <p>Paid projects welcome, interesting ones may be done for free :-)</p>
        <a class="btn" href="${tell}">Tell us what you need</a>
      </div>
    </section>

    <section class="band wrap" id="about" aria-labelledby="about-title">
      <div class="band__head">
        <p class="eyebrow">About</p>
        <h2 class="band__title" id="about-title">Built with Claude, guided by experts</h2>
      </div>
      <div class="about">
        <div>
          <p class="about__name">Yusuf Pisan</p>
          <p class="about__role">Chief Education Officer, HintWise</p>
        </div>
        <div class="about__text">
          <p>HintWise apps are built with Claude and guided by experts. Claude writes the code; people who know the field pick the problems, set the bar and review the results.</p>
          <p>Want to see what might come next? <a href="/next-up.html">Next up</a> lists problems we could solve, with new ones every morning.</p>
          <p class="about__links">
            <a class="btn btn--quiet btn--small" href="${ACADEMIC_URL}">Academic page</a>
            <a class="btn btn--quiet btn--small" href="/apps/">More apps</a>
          </p>
        </div>
      </div>
    </section>
`;
  // Links shared before the redesign (/?idea=<id>) open that idea on Next up.
  const redirect = `
  <script>(function(){var q=location.search;if(/[?&]idea=/.test(q))location.replace('/next-up.html'+q);})();</script>`;
  return page({
    title: 'HintWise Studio: small, focused software for small businesses, startups and educators',
    description: `HintWise builds small, focused apps for small businesses, startups and educators. See ${apps.length} apps already built, or tell us what you need.`,
    pathname: '/',
    active: 'home',
    body,
    scripts: redirect,
  });
}

function appsPage(apps, studio) {
  const buttons = [['', 'All']].concat((studio.audiences || []).map((a) => [a.key, a.label]))
    .map(([k, l]) => `<button type="button" data-for="${k}" aria-pressed="${k ? 'false' : 'true'}">${esc(l)}</button>`)
    .join('');
  const body = `    <header class="studio-head wrap">
      <h1 class="studio-head__title">Apps</h1>
      <p class="studio-head__sub">Every app HintWise has built, all live. Open one and try it, or ask for one like it.</p>
    </header>
    <div class="appbar" id="appbar" hidden>
      <div class="wrap">
        <div class="appbar__row">
          <div class="search">
            <input type="search" id="app-q" class="search__input" placeholder="Search apps" autocomplete="off" aria-label="Search apps" />
          </div>
          <div class="seg" role="group" aria-label="Who it's for">${buttons}</div>
        </div>
        <p class="appbar__count" id="app-count" aria-live="polite">${apps.length} apps</p>
      </div>
    </div>
    <div class="wrap">
      <div class="appgrid" id="appgrid">
${apps.map((a) => appCard(a, studio, 2)).join('\n')}
      </div>
      <p class="empty" id="app-none" hidden>No apps match. Try another word, or <a href="${esc(mailto('Project idea (via HintWise Studio)'))}">tell us what you need</a>.</p>
    </div>
`;
  return page({
    title: 'Apps · HintWise Studio',
    description: `All ${apps.length} apps HintWise has built, for small businesses, educators, developers and learners. Each one is live: open it and try it.`,
    pathname: '/apps/',
    active: 'apps',
    body,
  });
}

function appPage(app, apps, studio) {
  const p = (text) => String(text).split(/\n{2,}/).map((t) => `<p>${esc(t.trim())}</p>`).join('\n          ');
  const sections = [];
  if (app.problem) sections.push(`<section><h2>The problem</h2>\n          ${p(app.problem)}</section>`);
  if (app.what) sections.push(`<section><h2>What it does</h2>\n          ${p(app.what)}</section>`);
  if (app.benefits.length) {
    sections.push(`<section><h2>What you get</h2>\n          <ul>${app.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></section>`);
  }
  if (app.limits) sections.push(`<section><h2>Good to know</h2>\n          ${p(app.limits)}</section>`);
  const who = app.forWhom || `${app.audiences.map((k) => audienceLabel(studio, k)).join(' and ')}.`;
  const related = apps.filter((a) => a.slug !== app.slug && a.audiences.includes(app.audiences[0])).slice(0, 3);
  const like = esc(mailto(`Something like ${app.title} (via HintWise Studio)`));
  const body = `    <div class="wrap">
      <p class="crumbs"><a href="/apps/">Apps</a> / ${esc(app.title)}</p>
      <header class="app-hero">
        <h1 class="app-hero__title">${esc(app.title)}</h1>
        <p class="app-hero__lead">${esc(app.blurb)}</p>
        <p class="studio-hero__cta">
          <a class="btn" href="${esc(app.url)}">Open ${esc(app.title)} &#8599;</a>
          <a class="btn btn--quiet" href="${like}">Want one like this?</a>
        </p>
      </header>
      ${app.image ? `<figure class="app-shot">${media(app, { video: true, eager: true })}</figure>` : ''}
      <div class="app-cols">
        <div class="prose">
          ${sections.join('\n          ')}
        </div>
        <aside class="side">
          <div class="side__box">
            <h2>Who it's for</h2>
            <p>${esc(who)}</p>
            <ul class="taglist">${app.audiences.map((k) => `<li><a href="/apps/?for=${k}">${esc(audienceLabel(studio, k))}</a></li>`).join('')}</ul>
          </div>
          <div class="side__box side__box--cta">
            <h2>Want one like this?</h2>
            <p>Email <a href="${like}">${CONTACT}</a> with a paragraph about your problem.</p>
            <p>Paid projects welcome, interesting ones may be done for free :-)</p>
          </div>
        </aside>
      </div>
${related.length ? `      <section class="band" aria-labelledby="more-title">
        <div class="band__head"><h2 class="band__title" id="more-title">More for ${esc(audienceLabel(studio, app.audiences[0]).toLowerCase())}</h2></div>
        <div class="appgrid">
${related.map((a) => appCard(a, studio)).join('\n')}
        </div>
      </section>` : ''}
    </div>
`;
  return page({
    title: `${app.title} · HintWise Studio`,
    description: app.blurb,
    pathname: `/apps/${app.slug}/`,
    active: 'apps',
    body,
  });
}

// ---- Entry points -------------------------------------------------------------

function loadStudio(root) {
  const file = path.join(root, 'studio.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { apps: {}, featured: [], audiences: [] };
}

// Fill the <!-- @nav:<page> --> and <!-- @footer --> markers in the pages
// copied from web/.
function fillShell(html) {
  return html
    .replace(/<!-- @nav:([a-z-]+) -->/, (_, k) => nav(k))
    .replace('<!-- @footer -->', footer())
    .replace('<!-- @favicon -->', `<link rel="icon" href="${FAVICON}" />`);
}

function buildStudio({ root, dist, ideas }) {
  const studio = loadStudio(root);
  const apps = collectApps(ideas, studio, path.join(root, 'web', 'media'));
  fs.writeFileSync(path.join(dist, 'index.html'), homePage(apps, studio));
  fs.mkdirSync(path.join(dist, 'apps'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'apps', 'index.html'), appsPage(apps, studio));
  for (const app of apps) {
    const dir = path.join(dist, 'apps', app.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), appPage(app, apps, studio));
  }
  const missing = apps.filter((a) => !a.image).map((a) => a.slug);
  console.log(`  Studio: home, apps page and ${apps.length} app pages (${(studio.featured || []).length} featured)`);
  if (missing.length) console.log(`    no image for ${missing.join(', ')}; run node scripts/studio_media.js <claude-built-apps>`);
  return apps;
}

module.exports = { buildStudio, fillShell, hintwiseLinks, splitNotes, SITE };
