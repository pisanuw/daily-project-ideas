# Source health

Generated 2026-11-01 from the last 45 days of `ideas/run-log.jsonl` (4 runs). Do not edit by hand: regenerate with `python3 scripts/source_health.py`.

## Do not spend searches here

| Source | Why |
|---|---|
| A1 LMS idea boards | Canvas Community 403s and renders title-only; the Moodle Jira path is HTTP 410. |
| A7 Higher ed Reddit | Reddit returns 403, a 'Welcome to Reddit' interstitial, or 'Blocked' on every path tried. |
| A8 K-12 and learner Reddit | Reddit, same as A7. |
| A9 Direct-pay buyers | Reddit half blocked with A7; the Well-Trained Mind forum 403s. |
| A10 Incumbent review sites | G2 and Capterra 403 both clients at the edge; that is the site's choice. |
| B3 Indie Hackers and Starter Story | indiehackers.com returns HTTP 403. |
| B4 Founder subreddits | Reddit, same as A7. |
| B7 Product Hunt | producthunt.com returns HTTP 403 without an API key. |
| C3 Procurement and RFP portals | RFP portals sit behind Cloudflare, and an RFP buyer fails the no-procurement rule anyway. |
| C9 Y Combinator requests and directory | Used on 2026-10-31 to find competitors (Edexia W2025, Frizzle S2025). |

## Reachable sources, best first

`selected` counts ideas chosen in the window that came from this source.

| Source | Yields | Status | selected | Access path |
|---|---|---|---|---|
| A11 Accessibility practitioners | complaint | ok-curl | 0 | `webfetch: https://webaim.org/discussion/archives` |
| A12 Ask HN and HN comments | complaint | ok | 0 | `webfetch: https://hn.algolia.com/api/v1/search_by_date?query={q}&tags=comment&hitsPerPage=20` |
| A13 Discourse forums, any niche | complaint | ok | 0 | `webfetch: https://{host}/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| A14 Plugin and add-on support forums | complaint | ok | 0 | `webfetch: https://wordpress.org/support/plugin/{slug}/` |
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
| C10 Change events: shutdowns, price rises, removed free tiers | mandate | ok | 0 | no verified path |
| C11 Federal award and grant data | mandate | ok | 0 | `webfetch: https://api.nsf.gov/services/v1/awards.json?keyword={q}&printFields=title,date,awardeeName,fundsObligatedAmt&rpp=10` |
| C2 Education and computing research | mandate | ok | 0 | `webfetch: https://api.openalex.org/works?search={q}&per-page=10&sort=publication_date%3Adesc` |
| C4 Job postings that describe manual work | mandate | ok-curl | 0 | `webfetch: https://www.higheredjobs.com/search/advanced_action.cfm?JobCat={id}` |
| C5 Policy and regulation trackers | mandate | ok | 0 | `webfetch: https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest&conditions[term]={q}` |
| C6 Accreditation and standards changes | mandate | ok-curl | 0 | no verified path |
| C8 Trade news | mandate | ok-curl | 0 | `curl: https://www.edsurge.com/news` |

## Reachable sources with a failing path

These sources are not on the avoid list, because at least one of their paths works. The paths below are the ones that did not. If the failing path is the vein you came for, use the fallback or pick another source.

| Source | Status | Failing path | Outcome | Working paths left |
|---|---|---|---|---|
| A3 Open-source teaching tools | ok | `https://api.github.com/search/issues?q=autograder+in%3Atitle+state%3Aopen&per_page=5` | http_422 (177B) | 1 |
| A4 GitHub Education and Classroom discussions | unknown | `https://api.github.com/search/issues?q=repo%3Acommunity%2Fcommunity+classroom&per_page=5` | http_422 (177B) | 0 |
| B5 Acquisition marketplaces | ok-curl | `https://acquire.com/search/?industry=education` | http_404 (453602B) | 1 |

## Hosts, as actually observed

| Host | usable/tried | Outcomes | Last usable |
|---|---|---|---|
| community.instructure.com | 0/2 | empty 2 | never |
| samsearch.co | 0/2 | empty 2 | never |
| www.reddit.com | 0/2 | allowlist 2 | never |
| api.stackexchange.com | 0/1 | allowlist 1 | never |
| apuo.ca | 0/1 | empty 1 | never |
| careers.csudh.edu | 0/1 | empty 1 | never |
| cseducators.stackexchange.com | 0/1 | allowlist 1 | never |
| flippa.com | 0/1 | empty 1 | never |
| grad.tamu.edu | 0/1 | http_404 1 | never |
| its.umich.edu | 0/1 | http_403 1 | never |
| latexformat.netlify.app | 0/1 | http_404 1 | never |
| news.ycombinator.com | 0/1 | http_429 1 | never |
| nwelearn2026.sched.com | 0/1 | http_403 1 | never |
| scispace.com | 0/1 | http_403 1 | never |
| trustmrr.com | 1/1 | ok 1 | 2026-10-31 |
| www.capterra.com | 0/1 | http_403 1 | never |
| www.careerbuilder.com | 0/1 | http_403 1 | never |
| www.chronicle.com | 0/1 | http_403 1 | never |
| www.classcentral.com | 0/1 | http_403 1 | never |
| www.cs.umd.edu | 0/1 | http_5xx 1 | never |
| www.dailycal.org | 0/1 | http_403 1 | never |
| www.nationgraph.com | 0/1 | http_404 1 | never |
| www.ndsmcobserver.com | 0/1 | http_403 1 | never |
| www.pulse.bot | 0/1 | http_5xx 1 | never |
| www.ru.nl | 0/1 | http_5xx 1 | never |
| xdaforums.com | 0/1 | http_403 1 | never |

## Where candidates die

| Gate condition | Candidates lost |
|---|---|
| totalBelowMin | 40 |
| rejectRule | 13 |
| painBelow4 | 3 |
| reviewKill | 1 |

The largest row is the one to argue about before changing anything else.

## Funnel over the window

candidates 57 -> passedRejectRules 44 -> passedGate 1 -> reviewKilled 1 -> validated 0 -> provisional 0 -> watchlist 11

## Runs that produced nothing

- `2026-10-30#1`: Thesis Deposit Preflight was the one candidate to clear the gate at 23. The adversarial reviewer rescored it to 17 and the no-backfill rule forbade researching the next candidate down, so the day ended at zero. The rule, not the evidence, produced the empty file.
- `2026-10-31#1`: Best candidate was Orphaned Embed Rescue at 21, one point under the gate of 22, held back by free replacements and a one-time migration need. With no provisional tier the run had no way to ship its best candidate. Saturday's focus sources (RFP portals, job postings) mostly surfaced enterprise solicitations that the no-procurement rejection rule kills by construction.
- `2026-10-31#2`: A8 yielded nothing because Reddit is unreachable, so a quarter of the run's source budget was spent on a dead source the morning run had already found dead. The strongest signal, the end of Canvas Free-for-Teacher, is already served by free Canvas Lite and ProfDesk.
- `2026-10-31#3`: Fresh Canvas pain was either already served (Atomic Search sells account-wide Find and Replace) or bound up with minors' data. EdSurge, EdWeek Market Brief and pulse.bot returned no usable October 2026 content through WebFetch.

A run producing nothing is a routine bug, not a quiet day. Each line above is one to fix.

## Catalog disagrees with the log

- **A1 LMS idea boards**: catalog says `blocked`, the log says `reachable` (2 usable fetches in the window). Update `ideas/sources.json` by hand.
- **C3 Procurement and RFP portals**: catalog says `ok-curl`, the log says `blocked` (5 attempts in the window, none usable). Update `ideas/sources.json` by hand.
- **C9 Y Combinator requests and directory**: catalog says `blocked`, the log says `reachable` (1 usable fetches in the window). Update `ideas/sources.json` by hand.

