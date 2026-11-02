/* global window, document */
(function () {
  'use strict';

  var DATA = window.IDEAS_DATA || { meta: {}, tiers: [], ideas: [] };
  var INITIAL = 3; // latest N shown per tier before the fold

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function byDateDesc(a, b) {
    if (a.date === b.date) return (b.n || 0) - (a.n || 0);
    return a.date < b.date ? 1 : -1;
  }

  // Implemented projects sort by when they shipped, not when they were proposed.
  function byImplementedDesc(a, b) {
    var da = a.implementedOn || a.date;
    var db = b.implementedOn || b.date;
    if (da === db) return byDateDesc(a, b);
    return da < db ? 1 : -1;
  }

  function peppersFor(tierKey) {
    var t = DATA.tiers.filter(function (x) { return x.key === tierKey; })[0];
    return t ? t.peppers : '';
  }

  // ---- Hero ----
  function renderHero() {
    var m = DATA.meta || {};
    document.getElementById('tagline').textContent = m.tagline || '';
    document.getElementById('description').textContent = m.description || '';
    var live = DATA.ideas.filter(function (i) { return !i.placeholder; }).length;
    var when = DATA.generatedAt ? new Date(DATA.generatedAt).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : '';
    document.getElementById('hero-meta').textContent =
      live + ' ideas and counting · last updated ' + when;
  }

  // Implemented projects carry two dates: when the idea was proposed and when
  // it was built. Everything else has just the proposal date.
  function dateTags(idea) {
    if (idea.implementedOn) {
      return [
        el('span', { class: 'tag tag--date', text: 'proposed ' + idea.date }),
        el('span', { class: 'tag tag--date', text: 'implemented ' + idea.implementedOn }),
      ];
    }
    return [el('span', { class: 'tag tag--date', text: idea.date })];
  }

  // ---- Card ----
  function card(idea) {
    var tags = dateTags(idea);
    if (idea.topic) tags.push(el('span', { class: 'tag tag--topic', text: idea.topic }));
    if (idea.category) tags.push(el('span', { class: 'tag', text: idea.category }));
    if (idea.scores && idea.scores.total) tags.push(el('span', { class: 'tag tag--score', text: 'Score ' + idea.scores.total + '/30' }));
    if (idea.confidence === 'provisional') tags.push(el('span', { class: 'tag tag--provisional', text: 'Provisional' }));
    if (idea.implemented && idea.url) tags.push(el('span', { class: 'tag tag--live', text: 'Live ↗' }));

    var node = el('button', { class: 'card', type: 'button' }, [
      el('div', { class: 'card__top' }, [
        el('h3', { class: 'card__title', text: idea.title }),
        el('span', { class: 'card__peppers', text: peppersFor(idea.tierKey) }),
      ]),
      el('p', { class: 'card__summary', text: idea.summary || '' }),
      el('div', { class: 'card__foot' }, tags),
    ]);
    node.addEventListener('click', function () { openModal(idea); });
    return node;
  }

  // ---- Section ----
  // Two problems with the old fold: the only collapse control sat below every
  // expanded card (167 of them in the Multi-week tier), and the jump was from 3
  // straight to all of them. Now the control lives in the section head, where it
  // is always reachable, and the list grows a page at a time.
  var PAGE_STEP = 24;

  function section(tier, ideas) {
    var sorted = ideas.slice().sort(tier.key === 'implemented' ? byImplementedDesc : byDateDesc);
    var countWord = tier.key === 'research' ? (sorted.length === 1 ? ' idea' : ' ideas') : (sorted.length === 1 ? ' project' : ' projects');

    var toggle = el('button', { class: 'section__toggle', type: 'button' });
    var head = el('div', { class: 'section__head' }, [
      el('span', { class: 'section__peppers', text: tier.peppers }),
      el('h2', { class: 'section__title', text: tier.label, id: 'tier-' + tier.key }),
      el('span', { class: 'section__count', text: sorted.length + countWord }),
      el('p', { class: 'section__blurb', text: tier.blurb }),
    ]);

    var grid = el('div', { class: 'grid' });
    var sec = el('section', { class: 'section', 'data-tier': tier.key }, [head, grid]);

    if (sorted.length === 0) {
      grid.appendChild(el('p', { class: 'empty', text: 'Nothing here yet. Check back soon.' }));
      return sec;
    }

    var shown = Math.min(INITIAL, sorted.length);
    var more = el('button', { class: 'fold-btn', type: 'button' });
    var browseLink = el('a', {
      class: 'fold-link',
      href: 'browse.html?tier=' + encodeURIComponent(tier.key),
      text: 'Search and filter all ' + sorted.length + ' \u2192',
    });
    var foot = el('div', { class: 'section__foot' }, [more, browseLink]);

    function paint() {
      grid.innerHTML = '';
      sorted.slice(0, shown).forEach(function (i) { grid.appendChild(card(i)); });
      var left = sorted.length - shown;
      more.hidden = left <= 0;
      more.textContent = left > 0
        ? '\u25bc Show ' + Math.min(PAGE_STEP, left) + ' more (' + left + ' left)'
        : '';
      toggle.hidden = shown <= INITIAL;
      toggle.textContent = '\u25b2 Collapse';
    }

    more.addEventListener('click', function () {
      shown = Math.min(shown + PAGE_STEP, sorted.length);
      paint();
    });
    toggle.addEventListener('click', function () {
      shown = Math.min(INITIAL, sorted.length);
      paint();
      // Put the reader back at the section head rather than halfway down the page.
      head.scrollIntoView({ block: 'start' });
    });

    head.insertBefore(toggle, head.querySelector('.section__blurb'));
    sec.appendChild(foot);
    paint();
    return sec;
  }

  // A bar of tier links, so a long page still lets you jump between sections.
  function renderJumpbar(present) {
    var bar = document.getElementById('jumpbar');
    var host = document.getElementById('jumpbar-links');
    if (!bar || !host) return;
    present.forEach(function (tier) {
      host.appendChild(el('a', {
        class: 'jumpbar__link',
        href: '#tier-' + tier.key,
        text: tier.peppers + ' ' + tier.label,
      }));
    });
    host.appendChild(el('a', { class: 'jumpbar__link jumpbar__link--top', href: '#', text: '\u2191 Top' }));
    bar.hidden = false;
  }

  function renderSections() {
    var host = document.getElementById('sections');
    var present = [];
    DATA.tiers.forEach(function (tier) {
      var ideas = DATA.ideas.filter(function (i) { return i.tierKey === tier.key; });
      // Hide a tier only if it's the special implemented or research tier and empty.
      if ((tier.key === 'implemented' || tier.key === 'research') && ideas.length === 0) return;
      host.appendChild(section(tier, ideas));
      present.push(tier);
    });
    renderJumpbar(present);
  }

  // ---- Modal ----
  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modal-body');

  function detailSection(title, bodyNode) {
    if (!bodyNode) return null;
    return el('div', { class: 'detail-block' }, [el('h3', { text: title }), bodyNode]);
  }

  // ---- Commercial idea detail (schemaVersion 2 and 3) ----

  var SCORE_LABELS = [
    ['pain', 'Pain'],
    ['willingnessToPay', 'Willingness to pay'],
    ['reachability', 'Reachability'],
    ['competitiveGap', 'Competitive gap'],
    ['feasibility', 'Feasibility'],
    ['complianceBurden', 'Compliance ease'],
  ];

  function isCommercial(idea) {
    return !!(idea.scores || idea.problemStatement);
  }

  // Only http(s) links leave the page; anything else renders as plain text.
  function safeUrl(u) {
    var s = String(u || '').trim();
    return /^https?:\/\/\S+$/i.test(s) ? s : '';
  }

  function hostOf(u) {
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; }
  }

  function extLink(u, text) {
    var href = safeUrl(u);
    if (!href) return text ? document.createTextNode(text) : null;
    return el('a', { href: href, target: '_blank', rel: 'noopener noreferrer', text: (text || hostOf(href)) + ' ↗' });
  }

  // Text with any bare URLs turned into short links (used for rationales and sources).
  function linkified(text, cls) {
    if (!text) return null;
    var p = el('p', cls ? { class: cls } : {});
    String(text).split(/(https?:\/\/[^\s,;)]+)/g).forEach(function (part) {
      if (!part) return;
      p.appendChild(safeUrl(part) ? extLink(part.replace(/[.]+$/, '')) : document.createTextNode(part));
    });
    return p;
  }

  function para(text, cls) {
    return text ? el('p', cls ? { class: cls, text: text } : { text: text }) : null;
  }

  function defList(pairs) {
    var rows = [];
    pairs.forEach(function (pair) {
      if (!pair[1]) return;
      rows.push(el('dt', { text: pair[0] }));
      rows.push(el('dd', { text: pair[1] }));
    });
    return rows.length ? el('dl', { class: 'deflist' }, rows) : null;
  }

  function list(items, cls) {
    if (!items || !items.length) return null;
    return el('ul', cls ? { class: cls } : {}, items.map(function (t) { return el('li', { text: t }); }));
  }

  function scorePanel(idea) {
    var s = idea.scores;
    if (!s) return null;
    var why = idea.scoreRationale || {};
    var rows = SCORE_LABELS.map(function (pair) {
      var v = Math.max(0, Math.min(5, Number(s[pair[0]]) || 0));
      var item = el('div', { class: 'score-item' }, [
        el('div', { class: 'score-row' }, [
          el('span', { class: 'score-row__label', text: pair[1] }),
          el('span', { class: 'score-row__bar', 'aria-hidden': 'true' }, [
            el('span', { class: 'score-row__fill', style: 'width:' + (v * 20) + '%' }),
          ]),
          el('span', { class: 'score-row__val', text: v + '/5' }),
        ]),
      ]);
      var reason = linkified(why[pair[0]], 'score-item__why');
      if (reason) item.appendChild(reason);
      return item;
    });

    var head = [el('div', { class: 'score-total' }, [
      el('span', { class: 'score-total__num', text: String(s.total) }),
      el('span', { class: 'score-total__of', text: 'of 30' }),
    ])];
    if (idea.review && idea.review.verdict) {
      head.push(el('span', {
        class: 'tag tag--review',
        text: idea.review.verdict === 'pass' ? 'Passed review' : 'Rescored in review',
      }));
    }
    return el('div', { class: 'score-panel' }, [
      el('div', { class: 'score-panel__head' }, head),
      el('div', { class: 'score-panel__rows' }, rows),
    ]);
  }

  function evidenceList(items) {
    if (!items || !items.length) return null;
    return el('div', { class: 'stack' }, items.map(function (e) {
      var meta = [extLink(e.url, e.source || null)];
      if (e.date && e.date !== 'unknown') meta.push(el('span', { text: e.date }));
      if (e.author && e.author !== 'unknown') meta.push(el('span', { text: e.author }));
      if (e.kind) meta.push(el('span', { class: 'tag tag--kind', text: e.kind }));
      return el('div', { class: 'item' }, [
        el('div', { class: 'item__meta' }, meta),
        para(e.summary, 'item__body'),
      ]);
    }));
  }

  function competitorList(items) {
    if (!items || !items.length) return null;
    return el('div', { class: 'stack' }, items.map(function (c) {
      return el('div', { class: 'item' }, [
        el('div', { class: 'item__head' }, [
          el('span', { class: 'item__title' }, [extLink(c.url, c.name)]),
          c.price ? el('span', { class: 'tag', text: c.price }) : null,
        ]),
        para(c.gap ? 'Gap: ' + c.gap : '', 'item__body'),
      ]);
    }));
  }

  function mvpBlock(m) {
    if (!m) return null;
    var box = el('div', { class: 'stack' });
    if (m.buildEstimate) box.appendChild(el('p', {}, [el('strong', { text: 'Build estimate: ' }), m.buildEstimate]));
    if (m.features && m.features.length) {
      box.appendChild(el('p', { class: 'sublabel', text: 'In the MVP' }));
      box.appendChild(list(m.features));
    }
    if (m.outOfScope && m.outOfScope.length) {
      box.appendChild(el('p', { class: 'sublabel', text: 'Deferred' }));
      box.appendChild(list(m.outOfScope, 'dim'));
    }
    return box.childNodes.length ? box : null;
  }

  function businessBlock(idea) {
    var p = idea.pricing || {};
    var box = el('div', { class: 'stack' }, [
      defList([
        ['Pricing model', p.model],
        ['Price point', p.pricePoint],
        ['Why this price', p.rationale],
        ['Revenue sketch', idea.revenueSketch],
        ['First 10 customers', idea.distribution],
        ['Moat', idea.moat],
      ]),
    ]);
    return box.childNodes.length ? box : null;
  }

  function riskList(items) {
    if (!items || !items.length) return null;
    return el('ul', {}, items.map(function (r) {
      return el('li', {}, [r.risk || '', r.mitigation ? el('span', { class: 'dim', text: ' Mitigation: ' + r.mitigation }) : null]);
    }));
  }

  // A provisional idea is a lead that did not clear the quality gate. Say so
  // plainly, and say what would change that.
  function gapBlock(idea) {
    if (idea.confidence !== 'provisional') return null;
    var g = idea.gateGap || {};
    var box = el('div', { class: 'gap-panel' }, [
      el('p', { class: 'gap-panel__head', text: 'This one did not clear the quality gate.' }),
    ]);
    if (g.missing && g.missing.length) {
      box.appendChild(el('p', { class: 'sublabel', text: 'What is missing' }));
      box.appendChild(list(g.missing));
    }
    if (g.closedBy) {
      box.appendChild(el('p', { class: 'sublabel', text: 'What would promote it' }));
      box.appendChild(para(g.closedBy));
    }
    return box;
  }

  function renderCommercial(idea, frag) {
    var v = idea.validationTest || {};
    var blocks = [
      scorePanel(idea),
      gapBlock(idea),
      detailSection('Problem', para(idea.problemStatement, 'problem')),
      detailSection('What it is', para(idea.description)),
      detailSection('Who it is for', defList([
        ['Target customer', idea.targetCustomer],
        ['Buyer', idea.buyer],
        ['Why now', idea.whyNow],
        ['Founder fit', idea.founderFit],
      ])),
      detailSection('Demand evidence', evidenceList(idea.problemEvidence)),
      detailSection('Competitors', competitorList(idea.competitors)),
      detailSection('Key features', list(idea.keyFeatures)),
      detailSection('MVP scope', mvpBlock(idea.mvpScope)),
      detailSection('Business model', businessBlock(idea)),
      detailSection('Validation test', defList([
        ['Method', v.method],
        ['Go if', v.successCriteria],
        ['Cost', v.cost],
      ])),
      detailSection('Compliance', list(idea.compliance)),
      detailSection('Risks', riskList(idea.risks)),
      detailSection('Adversarial review', para(idea.review && idea.review.findings)),
      detailSection('Notes', para(idea.notes)),
      detailSection('Tech stack', para(idea.techStack)),
      detailSection('Inspired by', linkified(idea.inspiredBy, 'inspired')),
    ];
    blocks.forEach(function (b) { if (b) frag.appendChild(b); });
  }

  // The site had no URL state at all, so the back button could not close a
  // modal or undo anything, and no idea was linkable. Opening a card now pushes
  // ?idea=<id>; Back pops it and closes the modal.
  function openModal(idea, fromHistory) {
    if (!fromHistory) {
      var url = new URL(window.location.href);
      url.searchParams.set('idea', idea.id);
      window.history.pushState({ idea: idea.id }, '', url);
    }
    modalBody.innerHTML = '';
    var tags = [];
    if (idea.complexity) tags.push(el('span', { class: 'tag', text: idea.complexity }));
    if (idea.category) tags.push(el('span', { class: 'tag', text: idea.category }));
    dateTags(idea).forEach(function (t) { tags.push(t); });

    var extraClass = idea.tierKey === 'research' ? 'detail detail--research' : 'detail';
    var frag = el('div', { class: extraClass }, [
      el('div', { class: 'detail__peppers', text: peppersFor(idea.tierKey) }),
      el('h2', { class: 'detail__title', id: 'modal-title', text: idea.title }),
      el('div', { class: 'detail__tags' }, tags),
    ]);

    if (isCommercial(idea)) {
      renderCommercial(idea, frag);
    } else {
      renderLegacy(idea, frag);
    }

    var links = [];
    if (idea.url) links.push(el('a', { class: 'btn-link', href: idea.url, target: '_blank', rel: 'noopener', text: 'View live project ↗' }));
    if (idea.repo) links.push(el('a', { class: 'btn-link btn-link--ghost', href: idea.repo, target: '_blank', rel: 'noopener', text: 'Source code ↗' }));
    if (links.length) frag.appendChild(el('div', { class: 'detail__links' }, links));
    frag.appendChild(buildThisCta(idea));

    modalBody.appendChild(frag);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  // Every idea ends with a way to ask for it. Implemented ones ask for
  // "one like this"; the rest ask for the idea itself. The subject names the
  // idea so the email says which card it came from.
  var CONTACT_EMAIL = 'builder@pisan.me';
  function buildThisCta(idea) {
    var built = !!idea.url;
    var subject = (built ? 'Something like ' : 'Build this: ') + idea.title + ' (' + idea.id + ')';
    var href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject);
    return el('div', { class: 'detail__cta' }, [
      el('p', { text: built
        ? 'Want something like this for your own work?'
        : 'Want this built, or something close to it?' }),
      el('a', { class: 'btn-link', href: href, text: 'Email ' + CONTACT_EMAIL }),
    ]);
  }

  // Side projects, classroom assignments, and research ideas (pre-2026-10-21).
  function renderLegacy(idea, frag) {
    if (idea.description) frag.appendChild(detailSection('Description', el('p', { text: idea.description })));
    if (idea.notes) frag.appendChild(detailSection('Notes', el('p', { text: idea.notes })));

    if (idea.keyFeatures && idea.keyFeatures.length) {
      var ul = el('ul', {}, idea.keyFeatures.map(function (f) { return el('li', { text: f }); }));
      frag.appendChild(detailSection('Key Features', ul));
    }
    if (idea.techStack) frag.appendChild(detailSection('Suggested Tech Stack', el('p', { text: idea.techStack })));
    if (idea.whyInteresting) frag.appendChild(detailSection("Why It's Interesting", el('p', { text: idea.whyInteresting })));
    if (idea.inspiredBy) frag.appendChild(detailSection('Inspired By', el('p', { class: 'inspired', text: idea.inspiredBy })));

    // Research-specific sections
    if (idea.papers && idea.papers.length) {
      var papersDiv = el('div', { class: 'research-papers' });
      idea.papers.forEach(function (p) {
        var paperEl = el('div', { class: 'research-paper' }, [
          el('div', { class: 'research-paper__title', text: p.title }),
          el('div', { class: 'research-paper__meta', text: p.authors + ', ' + p.venue + ' ' + p.year }),
        ]);
        if (p.abstract) paperEl.appendChild(el('p', { class: 'research-paper__abstract', text: p.abstract }));
        if (p.relevance) paperEl.appendChild(el('p', { class: 'research-paper__relevance', text: 'Relevance: ' + p.relevance }));
        if (p.url) {
          var doiLink = el('a', { class: 'research-paper__doi', href: p.url, target: '_blank', rel: 'noopener', text: 'ACM DL ↗' });
          paperEl.appendChild(doiLink);
        }
        papersDiv.appendChild(paperEl);
      });
      frag.appendChild(detailSection('Source Paper(s)', papersDiv));
    }

    if (idea.additionalRefs && idea.additionalRefs.length) {
      var refsDiv = el('div', { class: 'research-refs' });
      idea.additionalRefs.forEach(function (r) {
        var refEl = el('div', { class: 'research-ref' });
        var meta = r.authors ? r.authors + ', ' + r.venue : r.venue;
        refEl.appendChild(el('div', { class: 'research-ref__title', text: r.title }));
        refEl.appendChild(el('div', { class: 'research-ref__meta', text: meta }));
        if (r.relevance) refEl.appendChild(el('p', { class: 'research-ref__relevance', text: r.relevance }));
        if (r.url) refEl.appendChild(el('a', { class: 'research-paper__doi', href: r.url, target: '_blank', rel: 'noopener', text: 'View ↗' }));
        refsDiv.appendChild(refEl);
      });
      frag.appendChild(detailSection('Additional References', refsDiv));
    }

    if (idea.researchPlan) {
      var plan = idea.researchPlan;
      var planDiv = el('div', { class: 'research-plan' });
      if (plan.overview) planDiv.appendChild(el('p', { class: 'research-plan__overview', text: plan.overview }));

      if (plan.milestones && plan.milestones.length) {
        var milestoneList = el('ol', { class: 'research-plan__milestones' });
        plan.milestones.forEach(function (m) {
          var liText = 'Month ' + m.month + ': ' + m.goal;
          var li = el('li', {}, [
            el('strong', { text: liText }),
          ]);
          if (m.deliverable) li.appendChild(document.createTextNode(': ' + m.deliverable));
          milestoneList.appendChild(li);
        });
        planDiv.appendChild(milestoneList);
      }

      if (plan.targetVenues && plan.targetVenues.length) {
        planDiv.appendChild(el('p', { class: 'research-plan__venues', text: 'Target venues: ' + plan.targetVenues.join(', ') }));
      }
      if (plan.resources) planDiv.appendChild(el('p', { class: 'research-plan__resources', text: 'Resources needed: ' + plan.resources }));

      if (plan.risks && plan.risks.length) {
        var riskList = el('ul', { class: 'research-plan__risks' });
        plan.risks.forEach(function (r) {
          riskList.appendChild(el('li', { text: r.risk + ' Mitigation: ' + r.mitigation }));
        });
        planDiv.appendChild(el('div', {}, [el('strong', { text: 'Risks:' }), riskList]));
      }

      if (typeof plan.humanSubjects === 'boolean') {
        var hsText = plan.humanSubjects ? 'Requires IRB approval (human subjects involved).' : 'No human subjects, so no IRB required.';
        planDiv.appendChild(el('p', { class: 'research-plan__irb', text: hsText }));
      }

      frag.appendChild(detailSection('3-6 Month Research Plan', planDiv));
    }
  }

  function closeModal(fromHistory) {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (!fromHistory && new URL(window.location.href).searchParams.has('idea')) {
      window.history.back();
    }
  }

  function ideaById(id) {
    return DATA.ideas.filter(function (i) { return i.id === id; })[0];
  }

  // One listener for both pages: the modal follows the ?idea= parameter.
  window.addEventListener('popstate', function () {
    var id = new URL(window.location.href).searchParams.get('idea');
    var idea = id && ideaById(id);
    if (idea) {
      openModal(idea, true);
    } else if (!modal.hidden) {
      closeModal(true);
    }
    if (document.body.getAttribute('data-page') === 'browse') syncFromUrl();
  });

  // A shared link that names an idea opens straight into it.
  function openFromUrl() {
    var id = new URL(window.location.href).searchParams.get('idea');
    var idea = id && ideaById(id);
    if (idea) openModal(idea, true);
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ---- Browse page ----
  // Filter state lives in the query string, so every change is a history entry,
  // the back button works, and any view can be shared as a link.
  var FILTERS = [
    { key: 'tier', label: 'Effort', options: function () {
        return DATA.tiers.map(function (t) { return { value: t.key, label: t.peppers + ' ' + t.label }; });
      } },
    { key: 'topic', label: 'Topic', options: function () {
        return (DATA.topics || []).map(function (t) { return { value: t.slug, label: t.name + ' (' + t.count + ')' }; });
      } },
    { key: 'status', label: 'Status', options: function () {
        return [
          { value: 'implemented', label: '\ud83d\ude80 Built' },
          { value: 'validated', label: 'Validated' },
          { value: 'provisional', label: 'Provisional' },
        ];
      } },
  ];
  var PER_PAGE = 24;

  function params() { return new URL(window.location.href).searchParams; }

  function setParams(changes, replace) {
    var url = new URL(window.location.href);
    Object.keys(changes).forEach(function (k) {
      if (changes[k]) url.searchParams.set(k, changes[k]);
      else url.searchParams.delete(k);
    });
    url.searchParams.delete('idea');
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }

  function matches(idea, q, p) {
    if (idea.placeholder) return false;
    var tier = p.get('tier');
    if (tier && idea.tierKey !== tier) return false;
    var topic = p.get('topic');
    if (topic && idea.topicSlug !== topic) return false;
    var status = p.get('status');
    if (status === 'implemented' && !idea.implemented) return false;
    if (status === 'validated' && idea.confidence !== 'validated') return false;
    if (status === 'provisional' && idea.confidence !== 'provisional') return false;
    if (q) {
      var hay = (idea.title + ' ' + (idea.summary || '') + ' ' + (idea.description || '') + ' ' +
                 (idea.topic || '') + ' ' + (idea.category || '')).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function renderFilters() {
    var host = document.getElementById('filters');
    if (!host || host.childNodes.length) return;
    FILTERS.forEach(function (f) {
      var opts = f.options();
      if (!opts.length) return;
      var row = el('div', { class: 'filterrow' }, [el('span', { class: 'filterrow__label', text: f.label })]);
      opts.forEach(function (o) {
        var chip = el('button', { class: 'chip', type: 'button', 'data-key': f.key, 'data-value': o.value, text: o.label });
        chip.addEventListener('click', function () {
          var change = {};
          change[f.key] = params().get(f.key) === o.value ? '' : o.value;
          change.page = '';
          setParams(change);
          syncFromUrl();
        });
        row.appendChild(chip);
      });
      host.appendChild(row);
    });
  }

  function renderPager(total, page) {
    var host = document.getElementById('pager');
    host.innerHTML = '';
    var pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) return;
    function pageBtn(n, label, disabled) {
      var b = el('button', { class: 'pager__btn' + (n === page ? ' is-current' : ''), type: 'button', text: label || String(n) });
      if (disabled) b.disabled = true;
      else b.addEventListener('click', function () {
        setParams({ page: n === 1 ? '' : String(n) });
        syncFromUrl();
        window.scrollTo(0, 0);
      });
      return b;
    }
    host.appendChild(pageBtn(page - 1, '\u2190 Prev', page === 1));
    var from = Math.max(1, page - 2), to = Math.min(pages, page + 2);
    if (from > 1) host.appendChild(pageBtn(1, '1'));
    if (from > 2) host.appendChild(el('span', { class: 'pager__gap', text: '\u2026' }));
    for (var n = from; n <= to; n++) host.appendChild(pageBtn(n));
    if (to < pages - 1) host.appendChild(el('span', { class: 'pager__gap', text: '\u2026' }));
    if (to < pages) host.appendChild(pageBtn(pages, String(pages)));
    host.appendChild(pageBtn(page + 1, 'Next \u2192', page === pages));
  }

  function syncFromUrl() {
    var p = params();
    var q = (p.get('q') || '').trim().toLowerCase();
    var page = Math.max(1, parseInt(p.get('page'), 10) || 1);

    var box = document.getElementById('q');
    if (box && box.value !== (p.get('q') || '')) box.value = p.get('q') || '';
    var clear = document.getElementById('q-clear');
    if (clear) clear.hidden = !q;

    document.querySelectorAll('.chip').forEach(function (chip) {
      var on = p.get(chip.getAttribute('data-key')) === chip.getAttribute('data-value');
      chip.classList.toggle('is-on', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    var hits = DATA.ideas.filter(function (i) { return matches(i, q, p); }).sort(byDateDesc);
    var pages = Math.max(1, Math.ceil(hits.length / PER_PAGE));
    if (page > pages) page = pages;

    var grid = document.getElementById('results');
    grid.innerHTML = '';
    hits.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (i) { grid.appendChild(card(i)); });
    document.getElementById('no-results').hidden = hits.length > 0;

    var active = ['tier', 'topic', 'status'].filter(function (k) { return p.get(k); });
    document.getElementById('result-count').textContent =
      hits.length + (hits.length === 1 ? ' idea' : ' ideas') +
      (hits.length > PER_PAGE ? ' \u00b7 page ' + page + ' of ' + pages : '');
    document.getElementById('reset').hidden = !active.length && !q;

    var topic = p.get('topic');
    var named = (DATA.topics || []).filter(function (t) { return t.slug === topic; })[0];
    document.getElementById('browse-title').textContent = named ? named.name : 'Browse all ideas';
    document.getElementById('browse-sub').textContent = named
      ? 'Every idea filed under ' + named.name + '. Each idea has exactly one topic.'
      : 'Search every idea, or narrow by effort, topic and status.';

    renderPager(hits.length, page);
  }

  function initBrowse() {
    renderFilters();
    var box = document.getElementById('q');
    var timer = null;
    box.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        setParams({ q: box.value.trim(), page: '' }, true);
        syncFromUrl();
      }, 180);
    });
    document.getElementById('q-clear').addEventListener('click', function () {
      box.value = '';
      setParams({ q: '', page: '' });
      syncFromUrl();
      box.focus();
    });
    document.getElementById('reset').addEventListener('click', function () {
      setParams({ q: '', tier: '', topic: '', status: '', page: '' });
      syncFromUrl();
    });
    syncFromUrl();
    openFromUrl();
  }

  // ---- Topics page ----
  function initTopics() {
    var host = document.getElementById('topicgrid');
    var topics = DATA.topics || [];
    var total = topics.reduce(function (a, t) { return a + t.count; }, 0);
    document.getElementById('topics-sub').textContent = topics.length
      ? total + ' ideas across ' + topics.length + ' topics. Each idea has exactly one topic, so the counts add up.'
      : 'Topics have not been assigned yet.';
    topics.forEach(function (t) {
      host.appendChild(el('a', { class: 'topiccard', href: 'browse.html?topic=' + encodeURIComponent(t.slug) }, [
        el('span', { class: 'topiccard__count', text: String(t.count) }),
        el('span', { class: 'topiccard__name', text: t.name }),
      ]));
    });
  }

  function markNav() {
    var page = document.body.getAttribute('data-page');
    var link = document.querySelector('[data-nav="' + page + '"]');
    if (link) link.classList.add('is-current');
  }

  // ---- Go ----
  markNav();
  var PAGE = document.body.getAttribute('data-page');
  if (PAGE === 'browse') {
    initBrowse();
  } else if (PAGE === 'topics') {
    initTopics();
  } else {
    renderHero();
    renderSections();
    openFromUrl();
  }
})();
