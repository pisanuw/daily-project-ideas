# Source health

Generated 2026-11-03 from the last 45 days of `ideas/run-log.jsonl` (8 runs). Do not edit by hand: regenerate with `python3 scripts/source_health.py`.

## Do not spend searches here

| Source | Why |
|---|---|
| A7 Higher ed Reddit | Reddit returns 403, a 'Welcome to Reddit' interstitial, or 'Blocked' on every path tried. |
| A8 K-12 and learner Reddit | Reddit, same as A7. |
| A9 Direct-pay buyers | Reddit half blocked with A7; the Well-Trained Mind forum 403s. |
| A10 Incumbent review sites | G2 and Capterra 403 both clients at the edge; that is the site's choice. |
| B3 Indie Hackers and Starter Story | indiehackers.com returns HTTP 403. |
| B4 Founder subreddits | Reddit, same as A7. |
| B7 Product Hunt | producthunt.com returns HTTP 403 without an API key. |
| C3 Procurement and RFP portals | RFP portals sit behind Cloudflare, and an RFP buyer fails the no-procurement rule anyway. |

## Reachable sources, best first

`selected` counts ideas chosen in the window that came from this source.

| Source | Yields | Status | selected | Access path |
|---|---|---|---|---|
| A14 Plugin and add-on support forums | complaint | ok | 2 | `webfetch: https://wordpress.org/support/plugin/{slug}/` |
| A13 Discourse forums, any niche | complaint | ok | 1 | `webfetch: https://{host}/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| C10 Change events: shutdowns, price rises, removed free tiers | mandate | ok | 1 | no verified path |
| A1 LMS idea boards | complaint | ok | 0 | `both: https://community.instructure.com/t5/forums/searchpage/tab/message?q={q}` |
| A11 Accessibility practitioners | complaint | ok-curl | 0 | `webfetch: https://webaim.org/discussion/archives` |
| A12 Ask HN and HN comments | complaint | ok | 0 | `webfetch: https://hn.algolia.com/api/v1/search_by_date?query={q}&tags=comment&hitsPerPage=20` |
| A2 Other LMS and classroom forums | complaint | ok | 0 | `webfetch: https://discuss.openedx.org/latest.json` |
| A3 Open-source teaching tools | complaint | ok | 0 | `webfetch: https://api.github.com/search/issues?q={q}+state%3Aopen+sort%3Areactions&per_page=10` |
| A5 Educator Stack Exchanges | complaint | ok-curl | 0 | `curl: https://api.stackexchange.com/2.3/questions?site={cseducators|academia|matheducators}&order=desc&sort=creation&pagesize=20&filter=withbody` |
| A6 Edtech app and extension reviews | complaint | ok-curl | 0 | `webfetch: https://chromewebstore.google.com/detail/{slug}/{id}/reviews` |
| B1 Teachers Pay Teachers and Etsy | spend | ok | 0 | `webfetch: https://www.teacherspayteachers.com/Browse/Search:{q}` |
| B10 WordPress plugin market data | spend | ok | 0 | `webfetch: https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]={q}&request[per_page]=10` |
| B2 AppSumo | spend | ok | 0 | `webfetch: https://appsumo.com/software/{category}/` |
| B5 Acquisition marketplaces | spend | ok-curl | 0 | `webfetch: https://acquire.com/search/?industry=education` |
| B6 Verified revenue dashboards | spend | ok-curl | 0 | `curl: https://trustmrr.com/` |
| B8 Install counts for paid add-ons | spend | ok-curl | 0 | `curl: https://chromewebstore.google.com/detail/{id}` |
| C11 Federal award and grant data | mandate | ok | 0 | `webfetch: https://api.nsf.gov/services/v1/awards.json?keyword={q}&printFields=title,date,awardeeName,fundsObligatedAmt&rpp=10` |
| C2 Education and computing research | mandate | ok | 0 | `webfetch: https://api.openalex.org/works?search={q}&per-page=10&sort=publication_date%3Adesc` |
| C4 Job postings that describe manual work | mandate | ok-curl | 0 | `webfetch: https://www.higheredjobs.com/search/advanced_action.cfm?JobCat={id}` |
| C5 Policy and regulation trackers | mandate | ok | 0 | `webfetch: https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest&conditions[term]={q}` |
| C6 Accreditation and standards changes | mandate | ok-curl | 0 | no verified path |
| C8 Trade news | mandate | ok-curl | 0 | `curl: https://www.edsurge.com/news` |
| C9 Y Combinator requests and directory | mandate | ok | 0 | no verified path |

## Reachable sources with a failing path

These sources are not on the avoid list, because at least one of their paths works. The paths below are the ones that did not. If the failing path is the vein you came for, use the fallback or pick another source.

| Source | Status | Failing path | Outcome | Working paths left |
|---|---|---|---|---|
| A1 LMS idea boards | ok | `https://community.instructure.com/t5/forums/searchpage/tab/message?q=gradebook` | http_403 (236353B) | 0 |
| A1 LMS idea boards | ok | `https://moodle.atlassian.net/rest/api/2/search?jql=project%3DMDL&maxResults=3` | http_410 (218B) | 0 |
| A3 Open-source teaching tools | ok | `https://api.github.com/search/issues?q=autograder+in%3Atitle+state%3Aopen&per_page=5` | http_422 (177B) | 1 |
| A4 GitHub Education and Classroom discussions | unknown | `https://api.github.com/search/issues?q=repo%3Acommunity%2Fcommunity+classroom&per_page=5` | http_422 (177B) | 0 |
| B5 Acquisition marketplaces | ok-curl | `https://acquire.com/search/?industry=education` | http_404 (453602B) | 1 |
| C9 Y Combinator requests and directory | ok | `https://www.ycombinator.com/companies?query=education` | empty (HTTP 200, 41603B, but 'company' is absent) | 0 |

## Hosts, as actually observed

| Host | usable/tried | Outcomes | Last usable |
|---|---|---|---|
| wordpress.org | 41/41 | ok 41 | 2026-11-03 |
| hn.algolia.com | 23/27 | empty 4, ok 23 | 2026-11-03 |
| community.shopify.com | 25/26 | empty 1, ok 25 | 2026-11-03 |
| api.wordpress.org | 14/14 | ok 14 | 2026-11-03 |
| community.n8n.io | 7/7 | ok 7 | 2026-11-03 |
| apps.shopify.com | 5/5 | ok 5 | 2026-11-03 |
| api.stackexchange.com | 3/4 | allowlist 1, ok 3 | 2026-11-03 |
| www.federalregister.gov | 4/4 | ok 4 | 2026-11-02 |
| www.freelancer.com | 4/4 | ok 4 | 2026-11-03 |
| api.openalex.org | 0/3 | http_429 3 | never |
| community.etsy.com | 1/3 | empty 2, ok 1 | 2026-11-01 |
| forum.ghost.org | 3/3 | ok 3 | 2026-11-03 |
| forum.invoiceninja.com | 3/3 | ok 3 | 2026-11-03 |
| github.com | 3/3 | ok 3 | 2026-11-01 |
| meet.ribblr.com | 3/3 | ok 3 | 2026-11-01 |
| webaim.org | 1/3 | empty 2, ok 1 | 2026-11-01 |
| app.thetutor.link | 2/2 | ok 2 | 2026-11-03 |
| community.instructure.com | 0/2 | empty 2 | never |
| dor.wa.gov | 1/2 | http_404 1, ok 1 | 2026-11-02 |
| dsp.berkeley.edu | 2/2 | ok 2 | 2026-11-01 |
| export.arxiv.org | 2/2 | ok 2 | 2026-11-03 |
| flyingfish.ie | 2/2 | ok 2 | 2026-11-03 |
| forum.bubble.io | 2/2 | ok 2 | 2026-11-02 |
| forum.mautic.org | 2/2 | ok 2 | 2026-11-03 |
| forum.webflow.com | 0/2 | empty 2 | never |
| samsearch.co | 0/2 | empty 2 | never |
| themarkup.org | 2/2 | ok 2 | 2026-11-02 |
| www.capterra.com | 0/2 | http_403 1, http_404 1 | never |
| www.reddit.com | 0/2 | allowlist 2 | never |
| adnabu.com | 1/1 | ok 1 | 2026-11-03 |
| api.github.com | 0/1 | http_403 1 | never |
| apuo.ca | 0/1 | empty 1 | never |
| careers.csudh.edu | 0/1 | empty 1 | never |
| cartmango.com | 1/1 | ok 1 | 2026-11-03 |
| coddy.tech | 0/1 | http_403 1 | never |
| codeboard.io | 1/1 | ok 1 | 2026-11-01 |
| community.cal.com | 0/1 | timeout 1 | never |
| community.cloudflare.com | 0/1 | http_403 1 | never |
| community.home-assistant.io | 0/1 | http_403 1 | never |
| community.openhab.org | 0/1 | empty 1 | never |
| community.squareup.com | 1/1 | ok 1 | 2026-11-03 |
| complianz.io | 1/1 | ok 1 | 2026-11-02 |
| consentcheck.online | 0/1 | http_404 1 | never |
| contra.com | 0/1 | empty 1 | never |
| cseducators.stackexchange.com | 0/1 | allowlist 1 | never |
| dev.to | 0/1 | http_404 1 | never |
| discuss.pixls.us | 1/1 | ok 1 | 2026-11-01 |
| ecosire.com | 1/1 | ok 1 | 2026-11-03 |
| elementor.com | 0/1 | http_404 1 | never |
| equalizedigital.com | 0/1 | http_403 1 | never |
| erank.com | 1/1 | ok 1 | 2026-11-01 |
| flippa.com | 0/1 | empty 1 | never |
| forum.obsidian.md | 1/1 | ok 1 | 2026-11-01 |
| forum.squarespace.com | 0/1 | http_403 1 | never |
| getvela.com | 1/1 | ok 1 | 2026-11-01 |
| ghostinspector.com | 1/1 | ok 1 | 2026-11-03 |
| grad.tamu.edu | 0/1 | http_404 1 | never |
| help.pickcode.io | 1/1 | ok 1 | 2026-11-01 |
| hookdeck.com | 1/1 | ok 1 | 2026-11-03 |
| its.umich.edu | 0/1 | http_403 1 | never |
| kourses.com | 1/1 | ok 1 | 2026-11-03 |
| latexformat.netlify.app | 0/1 | http_404 1 | never |
| managewp.com | 1/1 | ok 1 | 2026-11-03 |
| news.ycombinator.com | 0/1 | http_429 1 | never |
| nwelearn2026.sched.com | 0/1 | http_403 1 | never |
| pricingsaas.com | 1/1 | ok 1 | 2026-11-03 |
| rtl.berkeley.edu | 1/1 | ok 1 | 2026-11-01 |
| scispace.com | 0/1 | http_403 1 | never |
| sift-health.pages.dev | 1/1 | ok 1 | 2026-11-02 |
| support.google.com | 1/1 | ok 1 | 2026-11-03 |
| tilt.colostate.edu | 1/1 | ok 1 | 2026-11-01 |
| trinket.io | 1/1 | ok 1 | 2026-11-01 |
| trustmrr.com | 1/1 | ok 1 | 2026-10-31 |
| tutorlms.com | 1/1 | ok 1 | 2026-11-03 |
| ucsb-ds.github.io | 1/1 | ok 1 | 2026-11-01 |
| vendordirectory.shrm.org | 0/1 | http_403 1 | never |
| williamsrecord.com | 0/1 | http_403 1 | never |
| wpamelia.com | 1/1 | ok 1 | 2026-11-03 |
| wpengine.com | 1/1 | ok 1 | 2026-11-03 |
| www.careerbuilder.com | 0/1 | http_403 1 | never |
| www.checklyhq.com | 1/1 | ok 1 | 2026-11-03 |
| www.chronicle.com | 0/1 | http_403 1 | never |
| www.classcentral.com | 0/1 | http_403 1 | never |
| www.cookiebot.com | 1/1 | ok 1 | 2026-11-02 |
| www.cookieyes.com | 1/1 | ok 1 | 2026-11-02 |
| www.cs.umd.edu | 0/1 | http_5xx 1 | never |
| www.dailycal.org | 0/1 | http_403 1 | never |
| www.digitalcommerce360.com | 0/1 | http_403 1 | never |
| www.dor.wa.gov | 1/1 | ok 1 | 2026-11-02 |
| www.etsy.com | 0/1 | empty 1 | never |
| www.govinfo.gov | 1/1 | ok 1 | 2026-11-01 |
| www.higheredjobs.com | 0/1 | empty 1 | never |
| www.mondaq.com | 1/1 | ok 1 | 2026-11-02 |
| www.nationgraph.com | 0/1 | http_404 1 | never |
| www.ndsmcobserver.com | 0/1 | http_403 1 | never |
| www.onlinejobs.ph | 1/1 | ok 1 | 2026-11-03 |
| www.pulse.bot | 0/1 | http_5xx 1 | never |
| www.ru.nl | 0/1 | http_5xx 1 | never |
| www.teacherspayteachers.com | 1/1 | ok 1 | 2026-11-03 |
| www.the-standard.org | 1/1 | ok 1 | 2026-11-01 |
| www.tutorbird.com | 0/1 | empty 1 | never |
| www.uptimia.com | 1/1 | ok 1 | 2026-11-03 |
| www.upwork.com | 0/1 | http_403 1 | never |
| www.valueaddedresource.net | 1/1 | ok 1 | 2026-11-01 |
| xdaforums.com | 0/1 | http_403 1 | never |

## Where candidates die

| Gate condition | Candidates lost |
|---|---|
| totalBelowMin | 87 |
| rejectRule | 20 |
| reviewKill | 9 |
| painBelow4 | 3 |

The largest row is the one to argue about before changing anything else.

## Funnel over the window

candidates 123 -> passedRejectRules 103 -> passedGate 2 -> reviewKilled 9 -> validated 0 -> provisional 4 -> watchlist 32

## Runs that produced nothing

- `2026-10-30#1`: Thesis Deposit Preflight was the one candidate to clear the gate at 23. The adversarial reviewer rescored it to 17 and the no-backfill rule forbade researching the next candidate down, so the day ended at zero. The rule, not the evidence, produced the empty file.
- `2026-10-31#1`: Best candidate was Orphaned Embed Rescue at 21, one point under the gate of 22, held back by free replacements and a one-time migration need. With no provisional tier the run had no way to ship its best candidate. Saturday's focus sources (RFP portals, job postings) mostly surfaced enterprise solicitations that the no-procurement rejection rule kills by construction.
- `2026-10-31#2`: A8 yielded nothing because Reddit is unreachable, so a quarter of the run's source budget was spent on a dead source the morning run had already found dead. The strongest signal, the end of Canvas Free-for-Teacher, is already served by free Canvas Lite and ProfDesk.
- `2026-10-31#3`: Fresh Canvas pain was either already served (Atomic Search sells account-wide Find and Replace) or bound up with minors' data. EdSurge, EdWeek Market Brief and pulse.bot returned no usable October 2026 content through WebFetch.

A run producing nothing is a routine bug, not a quiet day. Each line above is one to fix.

