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
    if (idea.category) tags.push(el('span', { class: 'tag', text: idea.category }));
    if (idea.scores && idea.scores.total) tags.push(el('span', { class: 'tag tag--score', text: 'Score ' + idea.scores.total + '/30' }));
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
  function section(tier, ideas) {
    var sorted = ideas.slice().sort(tier.key === 'implemented' ? byImplementedDesc : byDateDesc);
    var countWord = tier.key === 'research' ? (sorted.length === 1 ? ' idea' : ' ideas') : (sorted.length === 1 ? ' project' : ' projects');
    var head = el('div', { class: 'section__head' }, [
      el('span', { class: 'section__peppers', text: tier.peppers }),
      el('h2', { class: 'section__title', text: tier.label }),
      el('span', { class: 'section__count', text: sorted.length + countWord }),
      el('p', { class: 'section__blurb', text: tier.blurb }),
    ]);

    var grid = el('div', { class: 'grid' });
    var sec = el('section', { class: 'section', 'data-tier': tier.key }, [head, grid]);

    if (sorted.length === 0) {
      grid.appendChild(el('p', { class: 'empty', text: 'Nothing here yet. Check back soon.' }));
      return sec;
    }

    var latest = sorted.slice(0, INITIAL);
    var rest = sorted.slice(INITIAL);
    latest.forEach(function (i) { grid.appendChild(card(i)); });

    if (rest.length > 0) {
      var hiddenCards = rest.map(function (i) {
        var c = card(i);
        c.classList.add('hidden');
        return c;
      });
      hiddenCards.forEach(function (c) { grid.appendChild(c); });

      var btn = el('button', { class: 'fold-btn', type: 'button' });
      var expanded = false;
      function syncLabel() {
        btn.textContent = expanded
          ? '▲ Show fewer'
          : '▼ Show all ' + sorted.length + ' ' + tier.label.toLowerCase() + ' projects (' + rest.length + ' more)';
      }
      btn.addEventListener('click', function () {
        expanded = !expanded;
        hiddenCards.forEach(function (c) { c.classList.toggle('hidden', !expanded); });
        syncLabel();
      });
      syncLabel();
      sec.appendChild(btn);
    }
    return sec;
  }

  function renderSections() {
    var host = document.getElementById('sections');
    DATA.tiers.forEach(function (tier) {
      var ideas = DATA.ideas.filter(function (i) { return i.tierKey === tier.key; });
      // Hide a tier only if it's the special implemented or research tier and empty.
      if ((tier.key === 'implemented' || tier.key === 'research') && ideas.length === 0) return;
      host.appendChild(section(tier, ideas));
    });
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

  function renderCommercial(idea, frag) {
    var v = idea.validationTest || {};
    var blocks = [
      scorePanel(idea),
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

  function openModal(idea) {
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

    modalBody.appendChild(frag);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
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

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ---- Go ----
  renderHero();
  renderSections();
})();
