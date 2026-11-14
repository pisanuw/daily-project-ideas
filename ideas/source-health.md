# Source health

Generated 2026-11-14 from the last 45 days of `ideas/run-log.jsonl` (23 runs). Do not edit by hand: regenerate with `python3 scripts/source_health.py`.

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
| A13 Discourse forums, any niche | complaint | ok | 12 | `webfetch: https://{host}/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| B12 Paid app marketplaces | spend | ok | 11 | `curl: https://apps.shopify.com/{slug}/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest` |
| C5 Policy and regulation trackers | mandate | ok | 10 | `webfetch: https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest&conditions[term]={q}` |
| A16 Vendor feature-request boards | complaint | ok-curl | 8 | `curl: https://productideas.xero.com/search?query={q}` |
| C10 Change events: shutdowns, price rises, removed free tiers | mandate | ok | 6 | no verified path |
| A14 Plugin and add-on support forums | complaint | ok | 4 | `webfetch: https://wordpress.org/support/plugin/{slug}/` |
| C8 Trade news | mandate | ok-curl | 4 | `curl: https://www.edsurge.com/news` |
| A12 Ask HN and HN comments | complaint | ok | 3 | `webfetch: https://hn.algolia.com/api/v1/search_by_date?query={q}&tags=comment&hitsPerPage=20` |
| B11 Freelance job boards | spend | ok | 3 | `webfetch: https://www.freelancer.com/api/projects/0.1/projects/active/?query={q}&limit=20&full_description=true` |
| A11 Accessibility practitioners | complaint | ok-curl | 2 | `webfetch: https://webaim.org/discussion/archives` |
| A15 No-code automation communities | complaint | ok | 2 | `webfetch: https://community.make.com/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| A3 Open-source teaching tools | complaint | ok | 2 | `curl: https://api.github.com/search/issues?q={q}+is%3Aissue+state%3Aopen+sort%3Areactions&per_page=10` |
| A5 Educator Stack Exchanges | complaint | ok-curl | 2 | `curl: https://api.stackexchange.com/2.3/questions?site={cseducators|academia|matheducators}&order=desc&sort=creation&pagesize=20&filter=withbody` |
| B1 Teachers Pay Teachers and Etsy | spend | ok | 2 | `webfetch: https://www.teacherspayteachers.com/Browse/Search:{q}` |
| A1 LMS idea boards | complaint | ok | 0 | `both: https://community.instructure.com/t5/forums/searchpage/tab/message?q={q}` |
| A2 Other LMS and classroom forums | complaint | ok | 0 | `webfetch: https://discuss.openedx.org/latest.json` |
| A6 Edtech app and extension reviews | complaint | ok-curl | 0 | `webfetch: https://chromewebstore.google.com/detail/{slug}/{id}/reviews` |
| B10 WordPress plugin market data | spend | ok | 0 | `webfetch: https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]={q}&request[per_page]=10` |
| B2 AppSumo | spend | ok | 0 | `webfetch: https://appsumo.com/software/{category}/` |
| B5 Acquisition marketplaces | spend | ok-curl | 0 | `webfetch: https://acquire.com/search/?industry=education` |
| B6 Verified revenue dashboards | spend | ok-curl | 0 | `curl: https://trustmrr.com/` |
| B8 Install counts for paid add-ons | spend | ok-curl | 0 | `curl: https://chromewebstore.google.com/detail/{id}` |
| B9 Freelance build requests | spend | ok-curl | 0 | `curl: https://www.freelancer.com/api/projects/0.1/projects/active/?query={q}&limit=20&full_description=true` |
| C11 Federal award and grant data | mandate | ok | 0 | `webfetch: https://api.nsf.gov/services/v1/awards.json?keyword={q}&printFields=title,date,awardeeName,fundsObligatedAmt&rpp=10` |
| C2 Education and computing research | mandate | ok | 0 | `webfetch: https://api.openalex.org/works?search={q}&per-page=10&sort=publication_date%3Adesc` |
| C4 Job postings that describe manual work | mandate | ok-curl | 0 | `webfetch: https://www.higheredjobs.com/search/advanced_action.cfm?JobCat={id}` |
| C6 Accreditation and standards changes | mandate | ok-curl | 0 | no verified path |
| C9 Y Combinator requests and directory | mandate | ok | 0 | no verified path |

## Reachable sources with a failing path

These sources are not on the avoid list, because at least one of their paths works. The paths below are the ones that did not. If the failing path is the vein you came for, use the fallback or pick another source.

| Source | Status | Failing path | Outcome | Working paths left |
|---|---|---|---|---|
| A1 LMS idea boards | ok | `https://community.instructure.com/t5/forums/searchpage/tab/message?q=gradebook` | http_403 (236353B) | 0 |
| A1 LMS idea boards | ok | `https://moodle.atlassian.net/rest/api/2/search?jql=project%3DMDL&maxResults=3` | http_410 (218B) | 0 |
| A4 GitHub Education and Classroom discussions | unknown | `https://api.github.com/search/issues?q=repo%3Acommunity%2Fcommunity+classroom&per_page=5` | http_422 (177B) | 0 |
| B5 Acquisition marketplaces | ok-curl | `https://acquire.com/search/?industry=education` | http_404 (453602B) | 1 |
| C9 Y Combinator requests and directory | ok | `https://www.ycombinator.com/companies?query=education` | empty (HTTP 200, 41603B, but 'company' is absent) | 0 |

## Hosts, as actually observed

| Host | usable/tried | Outcomes | Last usable |
|---|---|---|---|
| www.freelancer.com | 292/317 | empty 25, ok 292 | 2026-11-13 |
| community.shopify.com | 274/290 | empty 14, http_404 1, http_429 1, ok 274 | 2026-11-13 |
| apps.shopify.com | 193/233 | empty 26, http_404 12, ok 193, redirect 2 | 2026-11-13 |
| productideas.xero.com | 128/131 | empty 3, ok 128 | 2026-11-14 |
| hn.algolia.com | 102/127 | empty 25, ok 102 | 2026-11-14 |
| wordpress.org | 83/85 | empty 1, http_404 1, ok 83 | 2026-11-13 |
| community.n8n.io | 55/56 | empty 1, ok 55 | 2026-11-14 |
| www.federalregister.gov | 28/35 | ok 28, redirect 7 | 2026-11-14 |
| quickbooks.intuit.com | 26/29 | ok 26, timeout 3 | 2026-11-12 |
| api.wordpress.org | 26/27 | empty 1, ok 26 | 2026-11-09 |
| apps.xero.com | 17/27 | empty 9, http_404 1, ok 17 | 2026-11-14 |
| community.make.com | 21/24 | empty 3, ok 21 | 2026-11-12 |
| community.squareup.com | 11/24 | empty 13, ok 11 | 2026-11-13 |
| api.github.com | 16/23 | empty 2, http_403 4, http_5xx 1, ok 16 | 2026-11-11 |
| discuss.openedx.org | 21/22 | empty 1, ok 21 | 2026-11-14 |
| forum.invoiceninja.com | 18/21 | empty 3, ok 18 | 2026-11-12 |
| api.stackexchange.com | 19/20 | allowlist 1, ok 19 | 2026-11-14 |
| talk.folksy.com | 16/18 | empty 2, ok 16 | 2026-11-09 |
| forum.ghost.org | 14/15 | empty 1, ok 14 | 2026-11-10 |
| shopify.dev | 15/15 | ok 15 | 2026-11-08 |
| squareup.com | 10/15 | http_429 4, ok 10, redirect 1 | 2026-11-12 |
| developer.xero.com | 6/12 | empty 6, ok 6 | 2026-11-14 |
| discuss.frappe.io | 12/12 | ok 12 | 2026-11-12 |
| forums.wildapricot.com | 12/12 | ok 12 | 2026-11-12 |
| github.com | 7/12 | http_403 5, ok 7 | 2026-11-10 |
| help.shopify.com | 12/12 | ok 12 | 2026-11-13 |
| community.etsy.com | 2/11 | allowlist 1, empty 6, http_404 2, ok 2 | 2026-11-08 |
| developer.squareup.com | 10/11 | ok 10, redirect 1 | 2026-11-08 |
| raw.githubusercontent.com | 10/11 | empty 1, ok 10 | 2026-11-14 |
| www.idealist.org | 1/11 | http_404 10, ok 1 | 2026-11-07 |
| www.peopleperhour.com | 3/11 | empty 8, ok 3 | 2026-11-09 |
| www.teacherspayteachers.com | 10/10 | ok 10 | 2026-11-10 |
| www.gov.uk | 8/9 | http_404 1, ok 8 | 2026-11-14 |
| community.retellai.com | 7/7 | ok 7 | 2026-11-09 |
| community.zoom.com | 5/7 | empty 2, ok 5 | 2026-11-10 |
| export.arxiv.org | 7/7 | ok 7 | 2026-11-11 |
| gethelp.wildapricot.com | 5/7 | empty 2, ok 5 | 2026-11-07 |
| oag.ca.gov | 7/7 | ok 7 | 2026-11-07 |
| www.capterra.com | 2/7 | http_403 4, http_404 1, ok 2 | 2026-11-13 |
| www.quotientapp.com | 7/7 | ok 7 | 2026-11-12 |
| www.valueaddedresource.net | 7/7 | ok 7 | 2026-11-10 |
| partial.ly | 6/6 | ok 6 | 2026-11-08 |
| seedfund.nsf.gov | 3/6 | http_404 3, ok 3 | 2026-11-06 |
| trustmrr.com | 5/6 | http_404 1, ok 5 | 2026-11-06 |
| www.xero.com | 6/6 | ok 6 | 2026-11-14 |
| accountants.intuit.com | 4/5 | http_403 1, ok 4 | 2026-11-07 |
| api.nsf.gov | 5/5 | ok 5 | 2026-11-05 |
| api.openalex.org | 0/5 | http_429 5 | never |
| flippa.com | 2/5 | empty 3, ok 2 | 2026-11-07 |
| forum.bubble.io | 4/5 | empty 1, ok 4 | 2026-11-07 |
| sellersasksellers.com | 5/5 | ok 5 | 2026-11-08 |
| techcommunity.microsoft.com | 5/5 | ok 5 | 2026-11-11 |
| www.achrnews.com | 5/5 | ok 5 | 2026-11-13 |
| chromewebstore.google.com | 4/4 | ok 4 | 2026-11-04 |
| community.spiceworks.com | 2/4 | empty 2, ok 2 | 2026-11-11 |
| devforum.zoom.us | 4/4 | ok 4 | 2026-11-10 |
| forum.cursor.com | 4/4 | ok 4 | 2026-11-11 |
| grants.nih.gov | 3/4 | ok 3, redirect 1 | 2026-11-11 |
| learn.microsoft.com | 2/4 | empty 2, ok 2 | 2026-11-11 |
| webaim.org | 1/4 | empty 3, ok 1 | 2026-11-01 |
| www.etsy.com | 0/4 | empty 1, http_403 3 | never |
| www.modernretail.co | 4/4 | ok 4 | 2026-11-13 |
| www.wildapricot.com | 4/4 | ok 4 | 2026-11-07 |
| accessibe.com | 3/3 | ok 3 | 2026-11-07 |
| accessible.org | 3/3 | ok 3 | 2026-11-07 |
| approvalmax.com | 3/3 | ok 3 | 2026-11-14 |
| appsumo.com | 3/3 | ok 3 | 2026-11-11 |
| blog.xero.com | 3/3 | ok 3 | 2026-11-12 |
| changelog.shopify.com | 3/3 | ok 3 | 2026-11-07 |
| code.claude.com | 3/3 | ok 3 | 2026-11-11 |
| community.glowforge.com | 2/3 | empty 1, ok 2 | 2026-11-09 |
| dev.to | 2/3 | http_404 1, ok 2 | 2026-11-11 |
| discourse.jupyter.org | 3/3 | ok 3 | 2026-11-06 |
| discuss.pixls.us | 3/3 | ok 3 | 2026-11-08 |
| dor.wa.gov | 2/3 | http_404 1, ok 2 | 2026-11-07 |
| forum.obsidian.md | 2/3 | empty 1, ok 2 | 2026-11-08 |
| help.teacherspayteachers.com | 2/3 | http_403 1, ok 2 | 2026-11-10 |
| meet.ribblr.com | 3/3 | ok 3 | 2026-11-01 |
| n8n-handoff-kit.vercel.app | 3/3 | ok 3 | 2026-11-04 |
| remitclear.com | 3/3 | ok 3 | 2026-11-05 |
| smtply.pages.dev | 2/3 | http_404 1, ok 2 | 2026-11-11 |
| support.gusto.com | 0/3 | http_403 3 | never |
| www.accountingweb.co.uk | 0/3 | http_403 3 | never |
| www.ato.gov.au | 0/3 | http_403 3 | never |
| www.change.org | 3/3 | ok 3 | 2026-11-10 |
| www.charityjob.co.uk | 0/3 | http_403 3 | never |
| www.govinfo.gov | 3/3 | ok 3 | 2026-11-07 |
| www.higheredjobs.com | 0/3 | empty 3 | never |
| www.make.com | 1/3 | http_403 2, ok 1 | 2026-11-07 |
| www.nsf.gov | 1/3 | http_404 2, ok 1 | 2026-11-04 |
| www.wrkr.com.au | 3/3 | ok 3 | 2026-11-12 |
| zonos.com | 2/3 | empty 1, ok 2 | 2026-11-08 |
| adanews.ada.org | 2/2 | ok 2 | 2026-11-07 |
| alteg.io | 2/2 | ok 2 | 2026-11-06 |
| apibreaks.com | 2/2 | ok 2 | 2026-11-04 |
| app.thetutor.link | 2/2 | ok 2 | 2026-11-03 |
| beancount.io | 2/2 | ok 2 | 2026-11-07 |
| cabgrid.com | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| cartmango.com | 2/2 | ok 2 | 2026-11-10 |
| clientmeter.pages.dev | 2/2 | ok 2 | 2026-11-11 |
| community.cloudflare.com | 0/2 | empty 1, http_403 1 | never |
| community.instructure.com | 0/2 | empty 2 | never |
| communityhub.sage.com | 2/2 | ok 2 | 2026-11-07 |
| craevidence.com | 2/2 | ok 2 | 2026-11-11 |
| developer.etsy.com | 2/2 | ok 2 | 2026-11-08 |
| developers.etsy.com | 2/2 | ok 2 | 2026-11-08 |
| docs.dingdoong.io | 1/2 | empty 1, ok 1 | 2026-11-13 |
| dsp.berkeley.edu | 2/2 | ok 2 | 2026-11-01 |
| equalizedigital.com | 1/2 | http_403 1, ok 1 | 2026-11-07 |
| fasta2p-portal.pages.dev | 2/2 | ok 2 | 2026-11-09 |
| feedback.qbo.intuit.com | 0/2 | allowlist 2 | never |
| fiverr.com | 0/2 | http_403 2 | never |
| flyingfish.ie | 2/2 | ok 2 | 2026-11-03 |
| forum.arduino.cc | 1/2 | empty 1, ok 1 | 2026-11-11 |
| forum.mautic.org | 2/2 | ok 2 | 2026-11-03 |
| forum.squarespace.com | 0/2 | empty 1, http_403 1 | never |
| forum.webflow.com | 0/2 | empty 2 | never |
| getvela.com | 2/2 | ok 2 | 2026-11-10 |
| ghost.org | 2/2 | ok 2 | 2026-11-09 |
| grantedai.com | 2/2 | ok 2 | 2026-11-11 |
| help.etsy.com | 2/2 | ok 2 | 2026-11-08 |
| help.onpay.com | 0/2 | http_403 2 | never |
| help.servicetitan.com | 2/2 | ok 2 | 2026-11-13 |
| highlevel.canny.io | 2/2 | ok 2 | 2026-11-09 |
| hts.usitc.gov | 2/2 | ok 2 | 2026-11-08 |
| kostenlose-erechnung.de | 2/2 | ok 2 | 2026-11-11 |
| labyrinthinc.com | 2/2 | ok 2 | 2026-11-07 |
| legacy.cdocs.com | 2/2 | ok 2 | 2026-11-07 |
| mage-people.com | 1/2 | http_404 1, ok 1 | 2026-11-06 |
| mastodon.gamedev.place | 2/2 | ok 2 | 2026-11-06 |
| meta.discourse.org | 2/2 | ok 2 | 2026-11-10 |
| news.ycombinator.com | 1/2 | http_429 1, ok 1 | 2026-11-06 |
| occasion.app | 2/2 | ok 2 | 2026-11-08 |
| pypi.org | 1/2 | empty 1, ok 1 | 2026-11-11 |
| samsearch.co | 0/2 | empty 2 | never |
| servicehub.passgallery.com | 2/2 | ok 2 | 2026-11-08 |
| standardcompute.com | 2/2 | ok 2 | 2026-11-11 |
| support.google.com | 1/2 | http_404 1, ok 1 | 2026-11-03 |
| support.toasttab.com | 2/2 | ok 2 | 2026-11-12 |
| tailride.so | 2/2 | ok 2 | 2026-11-11 |
| techradar.com | 1/2 | empty 1, ok 1 | 2026-11-08 |
| themarkup.org | 2/2 | ok 2 | 2026-11-02 |
| trykintsugi.com | 2/2 | ok 2 | 2026-11-09 |
| vibeappscanner.com | 2/2 | ok 2 | 2026-11-04 |
| wpengine.com | 1/2 | http_404 1, ok 1 | 2026-11-03 |
| www.allergicliving.com | 0/2 | http_403 2 | never |
| www.alura.io | 2/2 | ok 2 | 2026-11-08 |
| www.avail.co | 1/2 | allowlist 1, ok 1 | 2026-11-13 |
| www.azets.com | 2/2 | ok 2 | 2026-11-12 |
| www.bcnys.org | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| www.catholicjobs.com | 0/2 | http_404 2 | never |
| www.claytonutz.com | 2/2 | ok 2 | 2026-11-12 |
| www.cpapracticeadvisor.com | 2/2 | ok 2 | 2026-11-07 |
| www.edjoin.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.fairwork.gov.au | 0/2 | http_5xx 1, timeout 1 | never |
| www.fqhc.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.grants.nih.gov | 2/2 | ok 2 | 2026-11-11 |
| www.halfpricesoft.com | 2/2 | ok 2 | 2026-11-07 |
| www.infoodle.com | 2/2 | ok 2 | 2026-11-14 |
| www.irs.gov | 2/2 | ok 2 | 2026-11-14 |
| www.messagedesk.com | 2/2 | ok 2 | 2026-11-09 |
| www.mgma.com | 2/2 | ok 2 | 2026-11-07 |
| www.nasbaregistry.org | 2/2 | ok 2 | 2026-11-10 |
| www.nrn.com | 1/2 | empty 1, ok 1 | 2026-11-13 |
| www.oag.ca.gov | 2/2 | ok 2 | 2026-11-07 |
| www.onlinejobs.ph | 2/2 | ok 2 | 2026-11-10 |
| www.patriotsoftware.com | 1/2 | http_404 1, ok 1 | 2026-11-12 |
| www.photographytalk.com | 0/2 | empty 2 | never |
| www.reddit.com | 0/2 | allowlist 2 | never |
| www.restaurantbusinessonline.com | 1/2 | empty 1, ok 1 | 2026-11-06 |
| www.retailgazette.co.uk | 1/2 | http_429 1, ok 1 | 2026-11-12 |
| www.rubydoc.info | 0/2 | http_5xx 2 | never |
| www.smtp2go.com | 2/2 | ok 2 | 2026-11-11 |
| www.taxbandits.com | 2/2 | ok 2 | 2026-11-14 |
| www.taxcalc.com | 2/2 | ok 2 | 2026-11-12 |
| www.trustpilot.com | 1/2 | http_403 1, ok 1 | 2026-11-05 |
| www.tutorbird.com | 1/2 | empty 1, ok 1 | 2026-11-06 |
| www.waveapps.com | 2/2 | ok 2 | 2026-11-07 |
| www.zillow.com | 0/2 | http_403 2 | never |
| acowebs.com | 1/1 | ok 1 | 2026-11-08 |
| acquire.com | 0/1 | http_404 1 | never |
| acuityscheduling.com | 1/1 | ok 1 | 2026-11-08 |
| administrator.de | 1/1 | ok 1 | 2026-11-11 |
| adnabu.com | 1/1 | ok 1 | 2026-11-03 |
| ai.varsitytutors.com | 1/1 | ok 1 | 2026-11-06 |
| allitservices.com.au | 1/1 | ok 1 | 2026-11-11 |
| alternativeto.net | 0/1 | http_403 1 | never |
| api.regulations.gov | 0/1 | http_429 1 | never |
| api.www.sbir.gov | 0/1 | http_403 1 | never |
| apify.com | 1/1 | ok 1 | 2026-11-04 |
| app.acquire.com | 1/1 | ok 1 | 2026-11-07 |
| app.squareup.com | 1/1 | ok 1 | 2026-11-08 |
| apps.apple.com | 1/1 | ok 1 | 2026-11-06 |
| apps.odoo.com | 1/1 | ok 1 | 2026-11-12 |
| appsource.microsoft.com | 0/1 | empty 1 | never |
| apuo.ca | 0/1 | empty 1 | never |
| archdesk.com | 1/1 | ok 1 | 2026-11-12 |
| arrivy.com | 1/1 | ok 1 | 2026-11-13 |
| assets.publishing.service.gov.uk | 1/1 | ok 1 | 2026-11-12 |
| baptist.org.uk | 0/1 | http_404 1 | never |
| batchbound.com | 1/1 | ok 1 | 2026-11-06 |
| becker.wustl.edu | 0/1 | timeout 1 | never |
| bestfoodtrucks.com | 0/1 | http_429 1 | never |
| biz.booksy.com | 1/1 | ok 1 | 2026-11-12 |
| blog.groupmail.io | 1/1 | ok 1 | 2026-11-07 |
| blog.insightfulaccountant.com | 1/1 | ok 1 | 2026-11-14 |
| blog.report-uri.com | 1/1 | ok 1 | 2026-11-04 |
| blog.symquest.com | 1/1 | ok 1 | 2026-11-11 |
| blog.taxbandits.com | 1/1 | ok 1 | 2026-11-07 |
| blog.techsoup.org | 1/1 | ok 1 | 2026-11-07 |
| blog.usablenet.com | 1/1 | ok 1 | 2026-11-07 |
| bookkeep.com | 1/1 | ok 1 | 2026-11-07 |
| bookwhen.com | 1/1 | ok 1 | 2026-11-08 |
| bostonwebgroup.com | 1/1 | ok 1 | 2026-11-07 |
| breww.com | 1/1 | ok 1 | 2026-11-12 |
| brightsg.com | 1/1 | ok 1 | 2026-11-12 |
| buffer.com | 1/1 | ok 1 | 2026-11-06 |
| buildpass.ai | 1/1 | ok 1 | 2026-11-12 |
| ca-rcf.evokeplatform.com | 0/1 | empty 1 | never |
| cakerybakeries.com | 1/1 | ok 1 | 2026-11-06 |
| careers.csudh.edu | 0/1 | empty 1 | never |
| cause-comply.onrender.com | 0/1 | http_5xx 1 | never |
| cbs12.com | 1/1 | ok 1 | 2026-11-06 |
| cdn.cdata.com | 1/1 | ok 1 | 2026-11-14 |
| cdn.jsdelivr.net | 1/1 | ok 1 | 2026-11-11 |
| certifier.io | 1/1 | ok 1 | 2026-11-10 |
| charitycompliancesolutions.com | 1/1 | ok 1 | 2026-11-07 |
| choicepaid.com | 1/1 | ok 1 | 2026-11-10 |
| clarity.eco | 1/1 | ok 1 | 2026-11-12 |
| classic.skagitcountywa.gov | 1/1 | ok 1 | 2026-11-13 |
| click2houston.com | 1/1 | ok 1 | 2026-11-10 |
| clockspot.com | 1/1 | ok 1 | 2026-11-07 |
| cobaltextensions.wildapricot.org | 1/1 | ok 1 | 2026-11-07 |
| coddy.tech | 0/1 | http_403 1 | never |
| codeboard.io | 1/1 | ok 1 | 2026-11-01 |
| codecanyon.net | 1/1 | ok 1 | 2026-11-06 |
| coffeewp.dev | 0/1 | http_403 1 | never |
| coloradosun.com | 1/1 | ok 1 | 2026-11-06 |
| commission.europa.eu | 1/1 | ok 1 | 2026-11-08 |
| community.breww.com | 1/1 | ok 1 | 2026-11-12 |
| community.cal.com | 0/1 | timeout 1 | never |
| community.canva.com | 0/1 | timeout 1 | never |
| community.ebay.co.uk | 0/1 | empty 1 | never |
| community.getjobber.com | 0/1 | http_403 1 | never |
| community.home-assistant.io | 0/1 | http_403 1 | never |
| community.kajabi.com | 0/1 | http_404 1 | never |
| community.klaviyo.com | 0/1 | http_404 1 | never |
| community.openemr.org | 0/1 | empty 1 | never |
| community.openhab.org | 0/1 | empty 1 | never |
| community.podia.com | 0/1 | http_404 1 | never |
| community.squarespace.com | 0/1 | http_404 1 | never |
| community.teachable.com | 0/1 | http_404 1 | never |
| community.thinkific.com | 0/1 | timeout 1 | never |
| community.usa.canon.com | 0/1 | redirect 1 | never |
| community.zapier.com | 0/1 | empty 1 | never |
| complianz.io | 1/1 | ok 1 | 2026-11-02 |
| connecteam.com | 1/1 | ok 1 | 2026-11-06 |
| consentcheck.online | 0/1 | http_404 1 | never |
| contra.com | 0/1 | empty 1 | never |
| craready.pages.dev | 1/1 | ok 1 | 2026-11-11 |
| cronitor.io | 1/1 | ok 1 | 2026-11-04 |
| cseducators.stackexchange.com | 0/1 | allowlist 1 | never |
| cside.com | 1/1 | ok 1 | 2026-11-04 |
| cvdportal.com | 1/1 | ok 1 | 2026-11-11 |
| datadryad.org | 1/1 | ok 1 | 2026-11-11 |
| demo.cvdportal.com | 0/1 | redirect 1 | never |
| developer.candid.org | 1/1 | ok 1 | 2026-11-07 |
| developer.getjobber.com | 0/1 | http_403 1 | never |
| developer.service.hmrc.gov.uk | 1/1 | ok 1 | 2026-11-12 |
| developers.google.com | 1/1 | ok 1 | 2026-11-06 |
| developers.make.com | 1/1 | ok 1 | 2026-11-04 |
| discourse.datamethods.org | 0/1 | empty 1 | never |
| discourse.webflow.com | 0/1 | empty 1 | never |
| discuss.h5p.org | 0/1 | timeout 1 | never |
| docs.hirepos.com | 1/1 | ok 1 | 2026-11-08 |
| docs.lovable.dev | 1/1 | ok 1 | 2026-11-04 |
| docs.n8n.io | 1/1 | ok 1 | 2026-11-04 |
| docs.retellai.com | 1/1 | ok 1 | 2026-11-09 |
| docs.smrtphone.io | 0/1 | redirect 1 | never |
| donationdocket.com.au | 1/1 | ok 1 | 2026-11-07 |
| donationmanager.co.nz | 1/1 | ok 1 | 2026-11-07 |
| donorseek.com | 1/1 | ok 1 | 2026-11-07 |
| dotgolf.freshdesk.com | 0/1 | http_404 1 | never |
| doublehq.com | 1/1 | ok 1 | 2026-11-14 |
| doyouok.com | 1/1 | ok 1 | 2026-11-04 |
| easyship.com | 1/1 | ok 1 | 2026-11-08 |
| ecosire.com | 1/1 | ok 1 | 2026-11-03 |
| edubracket.com | 1/1 | ok 1 | 2026-11-10 |
| educationfreedom.texas.gov | 1/1 | ok 1 | 2026-11-10 |
| elementor.com | 0/1 | http_404 1 | never |
| elvanto.com | 1/1 | ok 1 | 2026-11-07 |
| emailmeter.com | 1/1 | ok 1 | 2026-11-06 |
| employmenthero.com | 1/1 | ok 1 | 2026-11-14 |
| englandkorfball.co.uk | 1/1 | ok 1 | 2026-11-14 |
| erank.com | 1/1 | ok 1 | 2026-11-01 |
| everlance.com | 1/1 | ok 1 | 2026-11-06 |
| everlystastro.pages.dev | 1/1 | ok 1 | 2026-11-08 |
| evolutionplatform.poolwerx.com.au | 0/1 | redirect 1 | never |
| feedback.kajabi.com | 0/1 | allowlist 1 | never |
| feedback.picflow.com | 0/1 | http_404 1 | never |
| finitestate.io | 0/1 | timeout 1 | never |
| flowlert.com | 1/1 | ok 1 | 2026-11-04 |
| foodlabelmaker.com | 0/1 | empty 1 | never |
| foodtruckfiesta.com | 0/1 | allowlist 1 | never |
| forum.heatinghelp.com | 1/1 | ok 1 | 2026-11-13 |
| forum.image.sc | 1/1 | ok 1 | 2026-11-11 |
| forum.juce.com | 1/1 | ok 1 | 2026-11-11 |
| forum.moodle.org | 0/1 | timeout 1 | never |
| forum.openwrt.org | 0/1 | http_429 1 | never |
| forum.tutorcruncher.com | 0/1 | timeout 1 | never |
| fresha.com | 1/1 | ok 1 | 2026-11-12 |
| freshlearn.com | 1/1 | ok 1 | 2026-11-08 |
| get.popmenu.com | 0/1 | http_403 1 | never |
| getbcs.com | 1/1 | ok 1 | 2026-11-12 |
| getesapaid.com | 1/1 | ok 1 | 2026-11-10 |
| getholdings.com | 0/1 | http_404 1 | never |
| getsquire.com | 1/1 | ok 1 | 2026-11-12 |
| ghostinspector.com | 1/1 | ok 1 | 2026-11-03 |
| ginkoflorist.pages.dev | 1/1 | ok 1 | 2026-11-13 |
| givebutter.com | 1/1 | ok 1 | 2026-11-07 |
| givewp.com | 0/1 | redirect 1 | never |
| glossgenius.com | 1/1 | ok 1 | 2026-11-12 |
| gofile.co.uk | 0/1 | http_403 1 | never |
| gotranscript.com | 1/1 | ok 1 | 2026-11-10 |
| grad.tamu.edu | 0/1 | http_404 1 | never |
| graphene-edu.com | 1/1 | ok 1 | 2026-11-10 |
| greenleaflabs.onrender.com | 1/1 | ok 1 | 2026-11-07 |
| h30434.www3.hp.com | 0/1 | http_403 1 | never |
| healthchecks.io | 1/1 | ok 1 | 2026-11-04 |
| hello.showmojo.com | 1/1 | ok 1 | 2026-11-13 |
| help-donorfy.theaccessgroup.com | 1/1 | ok 1 | 2026-11-14 |
| help.buildpass.ai | 1/1 | ok 1 | 2026-11-12 |
| help.ce-go.com | 1/1 | ok 1 | 2026-11-07 |
| help.elvanto.com | 0/1 | http_403 1 | never |
| help.fergus.com | 1/1 | ok 1 | 2026-11-12 |
| help.gohighlevel.com | 1/1 | ok 1 | 2026-11-09 |
| help.housecallpro.com | 1/1 | ok 1 | 2026-11-13 |
| help.landlordstudio.com | 1/1 | ok 1 | 2026-11-12 |
| help.marconet.com | 1/1 | ok 1 | 2026-11-11 |
| help.outofthesandbox.com | 0/1 | http_403 1 | never |
| help.parcel.royalmail.com | 0/1 | http_403 1 | never |
| help.patriotsoftware.com | 1/1 | ok 1 | 2026-11-07 |
| help.pickcode.io | 1/1 | ok 1 | 2026-11-01 |
| help.smrtphone.io | 1/1 | ok 1 | 2026-11-09 |
| help.studioninja.co | 1/1 | ok 1 | 2026-11-08 |
| helpdesk.scoutsqld.com.au | 1/1 | ok 1 | 2026-11-07 |
| hiverhq.com | 1/1 | ok 1 | 2026-11-06 |
| honestyjar.app | 0/1 | http_5xx 1 | never |
| hookdeck.com | 1/1 | ok 1 | 2026-11-03 |
| housecallpro.com | 1/1 | ok 1 | 2026-11-13 |
| hunted.space | 1/1 | ok 1 | 2026-11-11 |
| inflowave.netlify.app | 0/1 | http_404 1 | never |
| info.adp.com | 0/1 | empty 1 | never |
| integratestack.pages.dev | 1/1 | ok 1 | 2026-11-08 |
| intercom.help | 0/1 | http_404 1 | never |
| its.umich.edu | 0/1 | http_403 1 | never |
| jobs.mehi.masstech.org | 1/1 | ok 1 | 2026-11-07 |
| joinblvd.com | 1/1 | ok 1 | 2026-11-12 |
| jorijn.com | 0/1 | redirect 1 | never |
| karbonhq.com | 1/1 | ok 1 | 2026-11-07 |
| katv.com | 1/1 | ok 1 | 2026-11-10 |
| kb.drakesoftware.com | 0/1 | http_404 1 | never |
| kourses.com | 1/1 | ok 1 | 2026-11-03 |
| latexformat.netlify.app | 0/1 | http_404 1 | never |
| learning.central.xero.com | 1/1 | ok 1 | 2026-11-11 |
| lectronz.com | 1/1 | ok 1 | 2026-11-11 |
| linkfix.app | 1/1 | ok 1 | 2026-11-08 |
| lit-and-more.com | 1/1 | ok 1 | 2026-11-10 |
| litcommerce.com | 1/1 | ok 1 | 2026-11-10 |
| loopnet.ca | 0/1 | http_403 1 | never |
| managewp.com | 1/1 | ok 1 | 2026-11-03 |
| mc.merill.net | 1/1 | ok 1 | 2026-11-11 |
| mclibrary.duke.edu | 1/1 | ok 1 | 2026-11-11 |
| mikellane.com | 1/1 | ok 1 | 2026-11-10 |
| mjtsai.com | 1/1 | ok 1 | 2026-11-08 |
| moclaw.ai | 0/1 | empty 1 | never |
| monk.com | 1/1 | ok 1 | 2026-11-12 |
| mosscpa.com | 1/1 | ok 1 | 2026-11-07 |
| mynews13.com | 1/1 | ok 1 | 2026-11-06 |
| n8n.io | 1/1 | ok 1 | 2026-11-06 |
| newpathconsulting.com | 1/1 | ok 1 | 2026-11-07 |
| nextmeapp.com | 1/1 | ok 1 | 2026-11-12 |
| nodehero.io | 0/1 | timeout 1 | never |
| nonprofitlawblog.com | 1/1 | ok 1 | 2026-11-07 |
| notbyai.fyi | 1/1 | ok 1 | 2026-11-10 |
| nporesources.com | 1/1 | ok 1 | 2026-11-07 |
| nwelearn2026.sched.com | 0/1 | http_403 1 | never |
| omr.com | 1/1 | ok 1 | 2026-11-12 |
| onde.app | 1/1 | ok 1 | 2026-11-06 |
| ora.stanford.edu | 1/1 | ok 1 | 2026-11-11 |
| orchid.ganoksin.com | 1/1 | ok 1 | 2026-11-08 |
| originality.ai | 1/1 | ok 1 | 2026-11-10 |
| pages.twilio.com | 1/1 | ok 1 | 2026-11-12 |
| pasqualepillitteri.it | 0/1 | empty 1 | never |
| payhip.com | 1/1 | ok 1 | 2026-11-10 |
| payoutcheck.online | 1/1 | ok 1 | 2026-11-06 |
| pbpatl.org | 1/1 | ok 1 | 2026-11-07 |
| peerlist.io | 0/1 | http_403 1 | never |
| peerpush.net | 1/1 | ok 1 | 2026-11-04 |
| petapixel.com | 0/1 | http_403 1 | never |
| pickalpaca.com | 1/1 | ok 1 | 2026-11-13 |
| policycommons.net | 0/1 | http_403 1 | never |
| pope.tech | 1/1 | ok 1 | 2026-11-07 |
| pricebook.digital | 1/1 | ok 1 | 2026-11-13 |
| pricingsaas.com | 1/1 | ok 1 | 2026-11-03 |
| projects.raspberrypi.org | 0/1 | empty 1 | never |
| publer.com | 1/1 | ok 1 | 2026-11-06 |
| public.api.bsky.app | 0/1 | http_403 1 | never |
| publichealthmdc.com | 1/1 | ok 1 | 2026-11-13 |
| punchpass.com | 1/1 | ok 1 | 2026-11-08 |
| qminder.com | 1/1 | ok 1 | 2026-11-12 |
| rct.doj.ca.gov | 0/1 | http_404 1 | never |
| reachrightstudios.com | 1/1 | ok 1 | 2026-11-07 |
| recipal.com | 1/1 | ok 1 | 2026-11-06 |
| remittancego.com | 1/1 | ok 1 | 2026-11-05 |
| research.luriechildrens.org | 1/1 | ok 1 | 2026-11-11 |
| research.ufl.edu | 0/1 | timeout 1 | never |
| rootbrief.com | 1/1 | ok 1 | 2026-11-04 |
| rtl.berkeley.edu | 1/1 | ok 1 | 2026-11-01 |
| salepager.com | 1/1 | ok 1 | 2026-11-10 |
| salisbury.anglican.org | 1/1 | ok 1 | 2026-11-14 |
| satvasolutions.com | 1/1 | ok 1 | 2026-11-14 |
| sbirland.com | 1/1 | ok 1 | 2026-11-11 |
| sc-ctsi.org | 0/1 | http_404 1 | never |
| scispace.com | 0/1 | http_403 1 | never |
| senderz-website.pages.dev | 1/1 | ok 1 | 2026-11-04 |
| sendstatus.co | 0/1 | http_5xx 1 | never |
| sift-health.pages.dev | 1/1 | ok 1 | 2026-11-02 |
| silktide.com | 1/1 | ok 1 | 2026-11-07 |
| sourceforge.net | 0/1 | http_403 1 | never |
| sport.nspcc.org.uk | 1/1 | ok 1 | 2026-11-14 |
| streetfoodfinder.com | 0/1 | http_403 1 | never |
| supabase.com | 1/1 | ok 1 | 2026-11-04 |
| support.approvalmax.com | 1/1 | ok 1 | 2026-11-14 |
| support.churchsuite.com | 0/1 | http_403 1 | never |
| support.patreon.com | 0/1 | http_403 1 | never |
| support.saasant.com | 1/1 | ok 1 | 2026-11-05 |
| support.servicem8.com | 1/1 | ok 1 | 2026-11-08 |
| support.wildapricot.com | 0/1 | http_403 1 | never |
| support.zapiet.com | 1/1 | ok 1 | 2026-11-13 |
| swiftaid.co.uk | 1/1 | ok 1 | 2026-11-14 |
| sylvanassurance.pages.dev | 0/1 | http_404 1 | never |
| taxcloud.com | 1/1 | ok 1 | 2026-11-09 |
| teachshare.com | 0/1 | empty 1 | never |
| techcrunch.com | 1/1 | ok 1 | 2026-11-04 |
| texas.support.withodyssey.com | 0/1 | http_403 1 | never |
| thecut.co | 1/1 | ok 1 | 2026-11-12 |
| thenewflatrate.com | 1/1 | ok 1 | 2026-11-13 |
| theproducenews.com | 0/1 | http_403 1 | never |
| theseoteacher.com.au | 1/1 | ok 1 | 2026-11-10 |
| thirtyoneeight.org | 1/1 | ok 1 | 2026-11-14 |
| tidyhq.com | 1/1 | ok 1 | 2026-11-14 |
| tilt.colostate.edu | 1/1 | ok 1 | 2026-11-01 |
| tothecent.app | 1/1 | ok 1 | 2026-11-05 |
| trinket.io | 1/1 | ok 1 | 2026-11-01 |
| truckspotting.com | 0/1 | http_5xx 1 | never |
| trucktrax.com | 0/1 | empty 1 | never |
| tutorlms.com | 1/1 | ok 1 | 2026-11-03 |
| uc3.cdlib.org | 1/1 | ok 1 | 2026-11-11 |
| ucsb-ds.github.io | 1/1 | ok 1 | 2026-11-01 |
| unpwned.io | 1/1 | ok 1 | 2026-11-04 |
| useitlonger.com | 1/1 | ok 1 | 2026-11-11 |
| userway.org | 1/1 | ok 1 | 2026-11-07 |
| vagaro.com | 1/1 | ok 1 | 2026-11-12 |
| valueaddedresource.net | 1/1 | ok 1 | 2026-11-08 |
| vatit.com | 1/1 | ok 1 | 2026-11-09 |
| vendordirectory.shrm.org | 0/1 | http_403 1 | never |
| vercel-prod.konicaminolta.eu | 0/1 | http_404 1 | never |
| verimu.com | 1/1 | ok 1 | 2026-11-11 |
| verix.io | 0/1 | http_404 1 | never |
| vibe-eval.com | 0/1 | empty 1 | never |
| vibecodingcost.pages.dev | 0/1 | timeout 1 | never |
| virtualbadge.io | 1/1 | ok 1 | 2026-11-10 |
| vivere.dev | 1/1 | ok 1 | 2026-11-04 |
| vol.asura.asu.edu | 1/1 | ok 1 | 2026-11-07 |
| waitlist.me | 1/1 | ok 1 | 2026-11-12 |
| waitwhile.com | 1/1 | ok 1 | 2026-11-12 |
| wave.webaim.org | 1/1 | ok 1 | 2026-11-07 |
| waveapps.vanillacommunities.com | 0/1 | allowlist 1 | never |
| williamsrecord.com | 0/1 | http_403 1 | never |
| windes.com | 0/1 | http_403 1 | never |
| wisdmlabs.com | 1/1 | ok 1 | 2026-11-10 |
| wpamelia.com | 1/1 | ok 1 | 2026-11-03 |
| www.1-fix.com | 1/1 | ok 1 | 2026-11-11 |
| www.1099online.com | 1/1 | ok 1 | 2026-11-14 |
| www.accountable.de | 1/1 | ok 1 | 2026-11-11 |
| www.ada.org | 0/1 | empty 1 | never |
| www.adlercolvin.com | 1/1 | ok 1 | 2026-11-07 |
| www.alternativeto.net | 0/1 | http_403 1 | never |
| www.approvalmax.com | 1/1 | ok 1 | 2026-11-14 |
| www.arkansasonline.com | 1/1 | ok 1 | 2026-11-10 |
| www.aucklandanglican.org.nz | 1/1 | ok 1 | 2026-11-07 |
| www.audioeye.com | 1/1 | ok 1 | 2026-11-07 |
| www.avalara.com | 1/1 | ok 1 | 2026-11-14 |
| www.azed.gov | 0/1 | http_403 1 | never |
| www.barnesdennig.com | 1/1 | ok 1 | 2026-11-07 |
| www.beveragedaily.com | 1/1 | ok 1 | 2026-11-12 |
| www.biggerpockets.com | 1/1 | ok 1 | 2026-11-13 |
| www.bluehost.com | 0/1 | http_403 1 | never |
| www.boomeranggmail.com | 1/1 | ok 1 | 2026-11-06 |
| www.brownejacobson.com | 1/1 | ok 1 | 2026-11-14 |
| www.calxa.com | 1/1 | ok 1 | 2026-11-14 |
| www.canva.com | 0/1 | http_403 1 | never |
| www.captaindns.com | 1/1 | ok 1 | 2026-11-11 |
| www.careerbuilder.com | 0/1 | http_403 1 | never |
| www.cda.org | 1/1 | ok 1 | 2026-11-07 |
| www.cdocs.com | 0/1 | redirect 1 | never |
| www.cdtfa.ca.gov | 1/1 | ok 1 | 2026-11-05 |
| www.ce-go.com | 1/1 | ok 1 | 2026-11-10 |
| www.chalkbeat.org | 1/1 | ok 1 | 2026-11-10 |
| www.chaponline.com | 1/1 | ok 1 | 2026-11-10 |
| www.chcanys.org | 1/1 | ok 1 | 2026-11-07 |
| www.checklyhq.com | 1/1 | ok 1 | 2026-11-03 |
| www.chronicle.com | 0/1 | http_403 1 | never |
| www.cipp.org.uk | 1/1 | ok 1 | 2026-11-12 |
| www.cisa.gov | 1/1 | ok 1 | 2026-11-11 |
| www.clarkhill.com | 1/1 | ok 1 | 2026-11-06 |
| www.classcentral.com | 0/1 | http_403 1 | never |
| www.clearbooks.co.uk | 1/1 | ok 1 | 2026-11-12 |
| www.compatshield.com | 1/1 | ok 1 | 2026-11-04 |
| www.contractortalk.com | 0/1 | redirect 1 | never |
| www.cookiebot.com | 1/1 | ok 1 | 2026-11-02 |
| www.cookieyes.com | 1/1 | ok 1 | 2026-11-02 |
| www.copytechnet.com | 1/1 | ok 1 | 2026-11-11 |
| www.craftybase.com | 0/1 | redirect 1 | never |
| www.cs.umd.edu | 0/1 | http_5xx 1 | never |
| www.dailycal.org | 0/1 | http_403 1 | never |
| www.deque.com | 0/1 | http_404 1 | never |
| www.digismoothie.com | 1/1 | ok 1 | 2026-11-08 |
| www.digitalcommerce360.com | 0/1 | http_403 1 | never |
| www.diyphotography.net | 0/1 | empty 1 | never |
| www.donorfy.com | 1/1 | ok 1 | 2026-11-14 |
| www.dor.wa.gov | 1/1 | ok 1 | 2026-11-02 |
| www.drbicuspid.com | 0/1 | http_403 1 | never |
| www.duanemorris.com | 1/1 | ok 1 | 2026-11-07 |
| www.dwt.com | 0/1 | http_403 1 | never |
| www.engadget.com | 1/1 | ok 1 | 2026-11-08 |
| www.enisa.europa.eu | 1/1 | ok 1 | 2026-11-11 |
| www.erp-recycling.org | 0/1 | empty 1 | never |
| www.expenseplus.co.uk | 1/1 | ok 1 | 2026-11-14 |
| www.experian.com | 1/1 | ok 1 | 2026-11-07 |
| www.facebook.com | 1/1 | ok 1 | 2026-11-06 |
| www.feinberg.northwestern.edu | 1/1 | ok 1 | 2026-11-11 |
| www.feldesman.com | 1/1 | ok 1 | 2026-11-07 |
| www.flsenate.gov | 1/1 | ok 1 | 2026-11-10 |
| www.followupthen.com | 0/1 | http_5xx 1 | never |
| www.fooddocs.com | 1/1 | ok 1 | 2026-11-13 |
| www.fourlane.com | 1/1 | ok 1 | 2026-11-07 |
| www.freeagent.com | 1/1 | ok 1 | 2026-11-12 |
| www.freelancer.de | 1/1 | ok 1 | 2026-11-10 |
| www.ftc.gov | 1/1 | ok 1 | 2026-11-14 |
| www.getjobber.com | 1/1 | ok 1 | 2026-11-06 |
| www.getly.store | 1/1 | ok 1 | 2026-11-10 |
| www.github.com | 1/1 | ok 1 | 2026-11-07 |
| www.grammarly.com | 1/1 | ok 1 | 2026-11-10 |
| www.harborcompliance.com | 1/1 | ok 1 | 2026-11-07 |
| www.housecallpro.com | 1/1 | ok 1 | 2026-11-06 |
| www.hvac-talk.com | 0/1 | redirect 1 | never |
| www.ifpti.org | 1/1 | ok 1 | 2026-11-13 |
| www.jibble.io | 1/1 | ok 1 | 2026-11-06 |
| www.just-drinks.com | 1/1 | ok 1 | 2026-11-12 |
| www.krowdbase.com | 0/1 | http_403 1 | never |
| www.legal500.com | 1/1 | ok 1 | 2026-11-07 |
| www.lethub.co | 1/1 | ok 1 | 2026-11-13 |
| www.levelaccess.com | 0/1 | http_404 1 | never |
| www.liquidweb.com | 1/1 | ok 1 | 2026-11-07 |
| www.litrg.org.uk | 0/1 | http_403 1 | never |
| www.loffler.com | 1/1 | ok 1 | 2026-11-11 |
| www.lovingly.com | 0/1 | redirect 1 | never |
| www.mass.gov | 0/1 | http_403 1 | never |
| www.mediabistro.com | 1/1 | ok 1 | 2026-11-07 |
| www.microns.io | 1/1 | ok 1 | 2026-11-07 |
| www.mitti.com | 1/1 | ok 1 | 2026-11-13 |
| www.mondaq.com | 1/1 | ok 1 | 2026-11-02 |
| www.moovs.app | 0/1 | allowlist 1 | never |
| www.mumsnet.com | 1/1 | ok 1 | 2026-11-08 |
| www.myschoolyear.com | 0/1 | http_403 1 | never |
| www.nachc.org | 1/1 | ok 1 | 2026-11-07 |
| www.nationgraph.com | 0/1 | http_404 1 | never |
| www.nccommunitycolleges.edu | 1/1 | ok 1 | 2026-11-07 |
| www.ncrla.org | 1/1 | ok 1 | 2026-11-13 |
| www.ndsmcobserver.com | 0/1 | http_403 1 | never |
| www.niaid.nih.gov | 1/1 | ok 1 | 2026-11-11 |
| www.nigms.nih.gov | 1/1 | ok 1 | 2026-11-11 |
| www.nysenate.gov | 1/1 | ok 1 | 2026-11-06 |
| www.onlinelabels.com | 1/1 | ok 1 | 2026-11-06 |
| www.onpay.com | 1/1 | ok 1 | 2026-11-07 |
| www.patreon.com | 0/1 | http_403 1 | never |
| www.paylocity.com | 0/1 | empty 1 | never |
| www.peterborough-diocese.org.uk | 0/1 | http_404 1 | never |
| www.phaa.org | 1/1 | ok 1 | 2026-11-10 |
| www.plinth.org.uk | 1/1 | ok 1 | 2026-11-14 |
| www.pulse.bot | 0/1 | http_5xx 1 | never |
| www.quo.com | 1/1 | ok 1 | 2026-11-06 |
| www.respira.press | 1/1 | ok 1 | 2026-11-11 |
| www.rosterelf.com | 1/1 | ok 1 | 2026-11-12 |
| www.royalmail.com | 0/1 | http_403 1 | never |
| www.ru.nl | 0/1 | http_5xx 1 | never |
| www.sandiegocounty.gov | 0/1 | http_5xx 1 | never |
| www.selfemployed.com | 1/1 | ok 1 | 2026-11-08 |
| www.sharp.net.nz | 1/1 | ok 1 | 2026-11-11 |
| www.shopify.com | 1/1 | ok 1 | 2026-11-03 |
| www.siteground.com | 0/1 | http_404 1 | never |
| www.siteimprove.com | 1/1 | ok 1 | 2026-11-07 |
| www.slrlounge.com | 1/1 | ok 1 | 2026-11-08 |
| www.smartsense.co | 1/1 | ok 1 | 2026-11-13 |
| www.softwareadvice.com | 0/1 | http_403 1 | never |
| www.springlex.eu | 0/1 | empty 1 | never |
| www.startupdaily.net | 1/1 | ok 1 | 2026-11-07 |
| www.tablesready.com | 1/1 | ok 1 | 2026-11-12 |
| www.tax1099.com | 0/1 | http_404 1 | never |
| www.tenantturner.com | 1/1 | ok 1 | 2026-11-13 |
| www.thankyoupayroll.co.nz | 1/1 | ok 1 | 2026-11-14 |
| www.the-standard.org | 1/1 | ok 1 | 2026-11-01 |
| www.thomsonreuters.com | 1/1 | ok 1 | 2026-11-07 |
| www.toriihq.com | 1/1 | ok 1 | 2026-11-11 |
| www.transact-tech.com | 1/1 | ok 1 | 2026-11-06 |
| www.trustlayer.io | 1/1 | ok 1 | 2026-11-12 |
| www.turbotenant.com | 1/1 | ok 1 | 2026-11-13 |
| www.txtimpact.com | 1/1 | ok 1 | 2026-11-09 |
| www.uptimia.com | 1/1 | ok 1 | 2026-11-03 |
| www.upwork.com | 0/1 | http_403 1 | never |
| www.usehammock.com | 1/1 | ok 1 | 2026-11-12 |
| www.usitc.gov | 0/1 | http_403 1 | never |
| www.webull.com | 1/1 | ok 1 | 2026-11-10 |
| www.wix.com | 1/1 | ok 1 | 2026-11-08 |
| www.wxxinews.org | 1/1 | ok 1 | 2026-11-06 |
| www.xenia.team | 1/1 | ok 1 | 2026-11-13 |
| www.zeffy.com | 1/1 | ok 1 | 2026-11-07 |
| www.zoho.com | 1/1 | ok 1 | 2026-11-06 |
| xdaforums.com | 0/1 | http_403 1 | never |
| xero.com | 1/1 | ok 1 | 2026-11-08 |
| zapier.com | 1/1 | ok 1 | 2026-11-07 |
| zapiet.com | 1/1 | ok 1 | 2026-11-13 |
| zeitride.com | 1/1 | ok 1 | 2026-11-06 |
| ziphaccp.com | 0/1 | http_404 1 | never |
| zmartly.co.uk | 1/1 | ok 1 | 2026-11-12 |
| zoom.us | 1/1 | ok 1 | 2026-11-10 |

## Where candidates die

| Gate condition | Candidates lost |
|---|---|
| totalBelowMin | 300 |
| rejectRule | 79 |
| reviewKill | 44 |
| painBelow4 | 3 |
| noRecentEvidence | 2 |
| evidenceCountBelow2 | 0 |
| noComplaintEvidence | 0 |
| unverifiedEvidence | 0 |
| wtpBelow3 | 0 |

The largest row is the one to argue about before changing anything else.

## Funnel over the window

candidates 440 -> passedRejectRules 361 -> passedGate 9 -> reviewKilled 44 -> validated 0 -> provisional 44 -> watchlist 38

## Runs that produced nothing

- `2026-10-30#1`: Thesis Deposit Preflight was the one candidate to clear the gate at 23. The adversarial reviewer rescored it to 17 and the no-backfill rule forbade researching the next candidate down, so the day ended at zero. The rule, not the evidence, produced the empty file.
- `2026-10-31#1`: Best candidate was Orphaned Embed Rescue at 21, one point under the gate of 22, held back by free replacements and a one-time migration need. With no provisional tier the run had no way to ship its best candidate. Saturday's focus sources (RFP portals, job postings) mostly surfaced enterprise solicitations that the no-procurement rejection rule kills by construction.
- `2026-10-31#2`: A8 yielded nothing because Reddit is unreachable, so a quarter of the run's source budget was spent on a dead source the morning run had already found dead. The strongest signal, the end of Canvas Free-for-Teacher, is already served by free Canvas Lite and ProfDesk.
- `2026-10-31#3`: Fresh Canvas pain was either already served (Atomic Search sells account-wide Find and Replace) or bound up with minors' data. EdSurge, EdWeek Market Brief and pulse.bot returned no usable October 2026 content through WebFetch.
- `2026-11-04#3`: Two separate limits stopped this run. (1) The day already held 4 provisional ideas, the cap in ROUTINE.md and validate_ideas.py (MAX_PROVISIONAL), so a third run on the same day can only ship validated ideas. (2) No candidate came near the gate of 22: the best two were rescored by reviewers from 18 and 16 to 14. Without the cap, neither would have shipped as validated either. The cap makes any third same-day run unable to add provisional ideas, so the routine should either stop extra runs once the cap is reached or count the cap per run.

A run producing nothing is a routine bug, not a quiet day. Each line above is one to fix.

