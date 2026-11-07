# Source health

Generated 2026-11-07 from the last 45 days of `ideas/run-log.jsonl` (16 runs). Do not edit by hand: regenerate with `python3 scripts/source_health.py`.

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
| A13 Discourse forums, any niche | complaint | ok | 4 | `webfetch: https://{host}/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| B12 Paid app marketplaces | spend | ok | 4 | `curl: https://apps.shopify.com/{slug}/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest` |
| C5 Policy and regulation trackers | mandate | ok | 4 | `webfetch: https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest&conditions[term]={q}` |
| A11 Accessibility practitioners | complaint | ok-curl | 2 | `webfetch: https://webaim.org/discussion/archives` |
| A14 Plugin and add-on support forums | complaint | ok | 2 | `webfetch: https://wordpress.org/support/plugin/{slug}/` |
| A15 No-code automation communities | complaint | ok | 2 | `webfetch: https://community.make.com/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| A16 Vendor feature-request boards | complaint | ok-curl | 2 | `curl: https://productideas.xero.com/search?query={q}` |
| A5 Educator Stack Exchanges | complaint | ok-curl | 2 | `curl: https://api.stackexchange.com/2.3/questions?site={cseducators|academia|matheducators}&order=desc&sort=creation&pagesize=20&filter=withbody` |
| C8 Trade news | mandate | ok-curl | 2 | `curl: https://www.edsurge.com/news` |
| A3 Open-source teaching tools | complaint | ok | 1 | `curl: https://api.github.com/search/issues?q={q}+is%3Aissue+state%3Aopen+sort%3Areactions&per_page=10` |
| B11 Freelance job boards | spend | ok | 1 | `webfetch: https://www.freelancer.com/api/projects/0.1/projects/active/?query={q}&limit=20&full_description=true` |
| C10 Change events: shutdowns, price rises, removed free tiers | mandate | ok | 1 | no verified path |
| A1 LMS idea boards | complaint | ok | 0 | `both: https://community.instructure.com/t5/forums/searchpage/tab/message?q={q}` |
| A12 Ask HN and HN comments | complaint | ok | 0 | `webfetch: https://hn.algolia.com/api/v1/search_by_date?query={q}&tags=comment&hitsPerPage=20` |
| A2 Other LMS and classroom forums | complaint | ok | 0 | `webfetch: https://discuss.openedx.org/latest.json` |
| A6 Edtech app and extension reviews | complaint | ok-curl | 0 | `webfetch: https://chromewebstore.google.com/detail/{slug}/{id}/reviews` |
| B1 Teachers Pay Teachers and Etsy | spend | ok | 0 | `webfetch: https://www.teacherspayteachers.com/Browse/Search:{q}` |
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
| community.shopify.com | 145/149 | empty 3, http_404 1, ok 145 | 2026-11-07 |
| www.freelancer.com | 128/128 | ok 128 | 2026-11-07 |
| apps.shopify.com | 69/84 | empty 13, http_404 2, ok 69 | 2026-11-07 |
| wordpress.org | 57/59 | empty 1, http_404 1, ok 57 | 2026-11-07 |
| hn.algolia.com | 48/58 | empty 10, ok 48 | 2026-11-07 |
| community.n8n.io | 50/51 | empty 1, ok 50 | 2026-11-07 |
| quickbooks.intuit.com | 20/22 | ok 20, timeout 2 | 2026-11-07 |
| community.make.com | 19/20 | empty 1, ok 19 | 2026-11-07 |
| productideas.xero.com | 20/20 | ok 20 | 2026-11-07 |
| api.stackexchange.com | 18/19 | allowlist 1, ok 18 | 2026-11-07 |
| api.wordpress.org | 18/19 | empty 1, ok 18 | 2026-11-07 |
| discuss.openedx.org | 18/19 | empty 1, ok 18 | 2026-11-07 |
| www.federalregister.gov | 15/19 | ok 15, redirect 4 | 2026-11-07 |
| api.github.com | 6/12 | empty 1, http_403 4, http_5xx 1, ok 6 | 2026-11-06 |
| forums.wildapricot.com | 11/11 | ok 11 | 2026-11-07 |
| www.idealist.org | 1/11 | http_404 10, ok 1 | 2026-11-07 |
| discuss.frappe.io | 10/10 | ok 10 | 2026-11-07 |
| forum.invoiceninja.com | 8/9 | empty 1, ok 8 | 2026-11-07 |
| gethelp.wildapricot.com | 5/7 | empty 2, ok 5 | 2026-11-07 |
| oag.ca.gov | 7/7 | ok 7 | 2026-11-07 |
| community.squareup.com | 2/6 | empty 4, ok 2 | 2026-11-06 |
| github.com | 5/6 | http_403 1, ok 5 | 2026-11-06 |
| seedfund.nsf.gov | 3/6 | http_404 3, ok 3 | 2026-11-06 |
| trustmrr.com | 5/6 | http_404 1, ok 5 | 2026-11-06 |
| accountants.intuit.com | 4/5 | http_403 1, ok 4 | 2026-11-07 |
| api.nsf.gov | 5/5 | ok 5 | 2026-11-05 |
| export.arxiv.org | 5/5 | ok 5 | 2026-11-04 |
| forum.bubble.io | 4/5 | empty 1, ok 4 | 2026-11-07 |
| www.peopleperhour.com | 2/5 | empty 3, ok 2 | 2026-11-05 |
| api.openalex.org | 0/4 | http_429 4 | never |
| chromewebstore.google.com | 4/4 | ok 4 | 2026-11-04 |
| community.etsy.com | 1/4 | empty 2, http_404 1, ok 1 | 2026-11-01 |
| flippa.com | 2/4 | empty 2, ok 2 | 2026-11-07 |
| forum.ghost.org | 4/4 | ok 4 | 2026-11-07 |
| shopify.dev | 4/4 | ok 4 | 2026-11-07 |
| webaim.org | 1/4 | empty 3, ok 1 | 2026-11-01 |
| www.wildapricot.com | 4/4 | ok 4 | 2026-11-07 |
| accessibe.com | 3/3 | ok 3 | 2026-11-07 |
| accessible.org | 3/3 | ok 3 | 2026-11-07 |
| apps.xero.com | 2/3 | empty 1, ok 2 | 2026-11-07 |
| changelog.shopify.com | 3/3 | ok 3 | 2026-11-07 |
| discourse.jupyter.org | 3/3 | ok 3 | 2026-11-06 |
| dor.wa.gov | 2/3 | http_404 1, ok 2 | 2026-11-07 |
| meet.ribblr.com | 3/3 | ok 3 | 2026-11-01 |
| n8n-handoff-kit.vercel.app | 3/3 | ok 3 | 2026-11-04 |
| remitclear.com | 3/3 | ok 3 | 2026-11-05 |
| www.govinfo.gov | 3/3 | ok 3 | 2026-11-07 |
| www.make.com | 1/3 | http_403 2, ok 1 | 2026-11-07 |
| www.nsf.gov | 1/3 | http_404 2, ok 1 | 2026-11-04 |
| www.teacherspayteachers.com | 3/3 | ok 3 | 2026-11-04 |
| adanews.ada.org | 2/2 | ok 2 | 2026-11-07 |
| alteg.io | 2/2 | ok 2 | 2026-11-06 |
| apibreaks.com | 2/2 | ok 2 | 2026-11-04 |
| app.thetutor.link | 2/2 | ok 2 | 2026-11-03 |
| beancount.io | 2/2 | ok 2 | 2026-11-07 |
| cabgrid.com | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| community.cloudflare.com | 0/2 | empty 1, http_403 1 | never |
| community.instructure.com | 0/2 | empty 2 | never |
| community.zoom.com | 1/2 | empty 1, ok 1 | 2026-11-04 |
| communityhub.sage.com | 2/2 | ok 2 | 2026-11-07 |
| developer.xero.com | 2/2 | ok 2 | 2026-11-07 |
| dsp.berkeley.edu | 2/2 | ok 2 | 2026-11-01 |
| equalizedigital.com | 1/2 | http_403 1, ok 1 | 2026-11-07 |
| flyingfish.ie | 2/2 | ok 2 | 2026-11-03 |
| forum.mautic.org | 2/2 | ok 2 | 2026-11-03 |
| forum.squarespace.com | 0/2 | empty 1, http_403 1 | never |
| forum.webflow.com | 0/2 | empty 2 | never |
| help.shopify.com | 2/2 | ok 2 | 2026-11-04 |
| labyrinthinc.com | 2/2 | ok 2 | 2026-11-07 |
| legacy.cdocs.com | 2/2 | ok 2 | 2026-11-07 |
| mage-people.com | 1/2 | http_404 1, ok 1 | 2026-11-06 |
| mastodon.gamedev.place | 2/2 | ok 2 | 2026-11-06 |
| news.ycombinator.com | 1/2 | http_429 1, ok 1 | 2026-11-06 |
| samsearch.co | 0/2 | empty 2 | never |
| support.google.com | 1/2 | http_404 1, ok 1 | 2026-11-03 |
| themarkup.org | 2/2 | ok 2 | 2026-11-02 |
| vibeappscanner.com | 2/2 | ok 2 | 2026-11-04 |
| wpengine.com | 1/2 | http_404 1, ok 1 | 2026-11-03 |
| www.allergicliving.com | 0/2 | http_403 2 | never |
| www.bcnys.org | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| www.capterra.com | 0/2 | http_403 1, http_404 1 | never |
| www.catholicjobs.com | 0/2 | http_404 2 | never |
| www.cpapracticeadvisor.com | 2/2 | ok 2 | 2026-11-07 |
| www.edjoin.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.fqhc.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.halfpricesoft.com | 2/2 | ok 2 | 2026-11-07 |
| www.mgma.com | 2/2 | ok 2 | 2026-11-07 |
| www.oag.ca.gov | 2/2 | ok 2 | 2026-11-07 |
| www.reddit.com | 0/2 | allowlist 2 | never |
| www.trustpilot.com | 1/2 | http_403 1, ok 1 | 2026-11-05 |
| www.tutorbird.com | 1/2 | empty 1, ok 1 | 2026-11-06 |
| www.waveapps.com | 2/2 | ok 2 | 2026-11-07 |
| adnabu.com | 1/1 | ok 1 | 2026-11-03 |
| ai.varsitytutors.com | 1/1 | ok 1 | 2026-11-06 |
| api.regulations.gov | 0/1 | http_429 1 | never |
| api.www.sbir.gov | 0/1 | http_403 1 | never |
| apify.com | 1/1 | ok 1 | 2026-11-04 |
| app.acquire.com | 1/1 | ok 1 | 2026-11-07 |
| apps.apple.com | 1/1 | ok 1 | 2026-11-06 |
| appsumo.com | 1/1 | ok 1 | 2026-11-04 |
| apuo.ca | 0/1 | empty 1 | never |
| batchbound.com | 1/1 | ok 1 | 2026-11-06 |
| bestfoodtrucks.com | 0/1 | http_429 1 | never |
| blog.groupmail.io | 1/1 | ok 1 | 2026-11-07 |
| blog.report-uri.com | 1/1 | ok 1 | 2026-11-04 |
| blog.taxbandits.com | 1/1 | ok 1 | 2026-11-07 |
| blog.techsoup.org | 1/1 | ok 1 | 2026-11-07 |
| blog.usablenet.com | 1/1 | ok 1 | 2026-11-07 |
| bookkeep.com | 1/1 | ok 1 | 2026-11-07 |
| bostonwebgroup.com | 1/1 | ok 1 | 2026-11-07 |
| buffer.com | 1/1 | ok 1 | 2026-11-06 |
| ca-rcf.evokeplatform.com | 0/1 | empty 1 | never |
| cakerybakeries.com | 1/1 | ok 1 | 2026-11-06 |
| careers.csudh.edu | 0/1 | empty 1 | never |
| cartmango.com | 1/1 | ok 1 | 2026-11-03 |
| cause-comply.onrender.com | 0/1 | http_5xx 1 | never |
| cbs12.com | 1/1 | ok 1 | 2026-11-06 |
| charitycompliancesolutions.com | 1/1 | ok 1 | 2026-11-07 |
| clockspot.com | 1/1 | ok 1 | 2026-11-07 |
| cobaltextensions.wildapricot.org | 1/1 | ok 1 | 2026-11-07 |
| coddy.tech | 0/1 | http_403 1 | never |
| codeboard.io | 1/1 | ok 1 | 2026-11-01 |
| codecanyon.net | 1/1 | ok 1 | 2026-11-06 |
| coffeewp.dev | 0/1 | http_403 1 | never |
| coloradosun.com | 1/1 | ok 1 | 2026-11-06 |
| community.cal.com | 0/1 | timeout 1 | never |
| community.home-assistant.io | 0/1 | http_403 1 | never |
| community.klaviyo.com | 0/1 | http_404 1 | never |
| community.openemr.org | 0/1 | empty 1 | never |
| community.openhab.org | 0/1 | empty 1 | never |
| community.zapier.com | 0/1 | empty 1 | never |
| complianz.io | 1/1 | ok 1 | 2026-11-02 |
| connecteam.com | 1/1 | ok 1 | 2026-11-06 |
| consentcheck.online | 0/1 | http_404 1 | never |
| contra.com | 0/1 | empty 1 | never |
| cronitor.io | 1/1 | ok 1 | 2026-11-04 |
| cseducators.stackexchange.com | 0/1 | allowlist 1 | never |
| cside.com | 1/1 | ok 1 | 2026-11-04 |
| dev.to | 0/1 | http_404 1 | never |
| developer.candid.org | 1/1 | ok 1 | 2026-11-07 |
| developers.google.com | 1/1 | ok 1 | 2026-11-06 |
| developers.make.com | 1/1 | ok 1 | 2026-11-04 |
| discourse.webflow.com | 0/1 | empty 1 | never |
| discuss.pixls.us | 1/1 | ok 1 | 2026-11-01 |
| docs.lovable.dev | 1/1 | ok 1 | 2026-11-04 |
| docs.n8n.io | 1/1 | ok 1 | 2026-11-04 |
| docs.smrtphone.io | 0/1 | redirect 1 | never |
| donationdocket.com.au | 1/1 | ok 1 | 2026-11-07 |
| donationmanager.co.nz | 1/1 | ok 1 | 2026-11-07 |
| donorseek.com | 1/1 | ok 1 | 2026-11-07 |
| doyouok.com | 1/1 | ok 1 | 2026-11-04 |
| ecosire.com | 1/1 | ok 1 | 2026-11-03 |
| elementor.com | 0/1 | http_404 1 | never |
| elvanto.com | 1/1 | ok 1 | 2026-11-07 |
| emailmeter.com | 1/1 | ok 1 | 2026-11-06 |
| erank.com | 1/1 | ok 1 | 2026-11-01 |
| everlance.com | 1/1 | ok 1 | 2026-11-06 |
| fasta2p-portal.pages.dev | 1/1 | ok 1 | 2026-11-04 |
| fiverr.com | 0/1 | http_403 1 | never |
| flowlert.com | 1/1 | ok 1 | 2026-11-04 |
| foodlabelmaker.com | 0/1 | empty 1 | never |
| foodtruckfiesta.com | 0/1 | allowlist 1 | never |
| forum.obsidian.md | 1/1 | ok 1 | 2026-11-01 |
| get.popmenu.com | 0/1 | http_403 1 | never |
| getholdings.com | 0/1 | http_404 1 | never |
| getvela.com | 1/1 | ok 1 | 2026-11-01 |
| ghostinspector.com | 1/1 | ok 1 | 2026-11-03 |
| givebutter.com | 1/1 | ok 1 | 2026-11-07 |
| givewp.com | 0/1 | redirect 1 | never |
| grad.tamu.edu | 0/1 | http_404 1 | never |
| greenleaflabs.onrender.com | 1/1 | ok 1 | 2026-11-07 |
| healthchecks.io | 1/1 | ok 1 | 2026-11-04 |
| help.ce-go.com | 1/1 | ok 1 | 2026-11-07 |
| help.elvanto.com | 0/1 | http_403 1 | never |
| help.onpay.com | 0/1 | http_403 1 | never |
| help.outofthesandbox.com | 0/1 | http_403 1 | never |
| help.patriotsoftware.com | 1/1 | ok 1 | 2026-11-07 |
| help.pickcode.io | 1/1 | ok 1 | 2026-11-01 |
| helpdesk.scoutsqld.com.au | 1/1 | ok 1 | 2026-11-07 |
| hiverhq.com | 1/1 | ok 1 | 2026-11-06 |
| honestyjar.app | 0/1 | http_5xx 1 | never |
| hookdeck.com | 1/1 | ok 1 | 2026-11-03 |
| inflowave.netlify.app | 0/1 | http_404 1 | never |
| info.adp.com | 0/1 | empty 1 | never |
| its.umich.edu | 0/1 | http_403 1 | never |
| jobs.mehi.masstech.org | 1/1 | ok 1 | 2026-11-07 |
| jorijn.com | 0/1 | redirect 1 | never |
| karbonhq.com | 1/1 | ok 1 | 2026-11-07 |
| kb.drakesoftware.com | 0/1 | http_404 1 | never |
| kourses.com | 1/1 | ok 1 | 2026-11-03 |
| latexformat.netlify.app | 0/1 | http_404 1 | never |
| loopnet.ca | 0/1 | http_403 1 | never |
| managewp.com | 1/1 | ok 1 | 2026-11-03 |
| meta.discourse.org | 1/1 | ok 1 | 2026-11-07 |
| mosscpa.com | 1/1 | ok 1 | 2026-11-07 |
| mynews13.com | 1/1 | ok 1 | 2026-11-06 |
| n8n.io | 1/1 | ok 1 | 2026-11-06 |
| newpathconsulting.com | 1/1 | ok 1 | 2026-11-07 |
| nodehero.io | 0/1 | timeout 1 | never |
| nonprofitlawblog.com | 1/1 | ok 1 | 2026-11-07 |
| nporesources.com | 1/1 | ok 1 | 2026-11-07 |
| nwelearn2026.sched.com | 0/1 | http_403 1 | never |
| onde.app | 1/1 | ok 1 | 2026-11-06 |
| payoutcheck.online | 1/1 | ok 1 | 2026-11-06 |
| pbpatl.org | 1/1 | ok 1 | 2026-11-07 |
| peerpush.net | 1/1 | ok 1 | 2026-11-04 |
| pope.tech | 1/1 | ok 1 | 2026-11-07 |
| pricingsaas.com | 1/1 | ok 1 | 2026-11-03 |
| projects.raspberrypi.org | 0/1 | empty 1 | never |
| publer.com | 1/1 | ok 1 | 2026-11-06 |
| rct.doj.ca.gov | 0/1 | http_404 1 | never |
| reachrightstudios.com | 1/1 | ok 1 | 2026-11-07 |
| recipal.com | 1/1 | ok 1 | 2026-11-06 |
| remittancego.com | 1/1 | ok 1 | 2026-11-05 |
| rootbrief.com | 1/1 | ok 1 | 2026-11-04 |
| rtl.berkeley.edu | 1/1 | ok 1 | 2026-11-01 |
| scispace.com | 0/1 | http_403 1 | never |
| senderz-website.pages.dev | 1/1 | ok 1 | 2026-11-04 |
| sendstatus.co | 0/1 | http_5xx 1 | never |
| sift-health.pages.dev | 1/1 | ok 1 | 2026-11-02 |
| silktide.com | 1/1 | ok 1 | 2026-11-07 |
| squareup.com | 1/1 | ok 1 | 2026-11-07 |
| streetfoodfinder.com | 0/1 | http_403 1 | never |
| supabase.com | 1/1 | ok 1 | 2026-11-04 |
| support.gusto.com | 0/1 | http_403 1 | never |
| support.saasant.com | 1/1 | ok 1 | 2026-11-05 |
| support.toasttab.com | 1/1 | ok 1 | 2026-11-07 |
| support.wildapricot.com | 0/1 | http_403 1 | never |
| techcrunch.com | 1/1 | ok 1 | 2026-11-04 |
| tilt.colostate.edu | 1/1 | ok 1 | 2026-11-01 |
| tothecent.app | 1/1 | ok 1 | 2026-11-05 |
| trinket.io | 1/1 | ok 1 | 2026-11-01 |
| truckspotting.com | 0/1 | http_5xx 1 | never |
| trucktrax.com | 0/1 | empty 1 | never |
| trykintsugi.com | 1/1 | ok 1 | 2026-11-07 |
| tutorlms.com | 1/1 | ok 1 | 2026-11-03 |
| ucsb-ds.github.io | 1/1 | ok 1 | 2026-11-01 |
| unpwned.io | 1/1 | ok 1 | 2026-11-04 |
| userway.org | 1/1 | ok 1 | 2026-11-07 |
| vendordirectory.shrm.org | 0/1 | http_403 1 | never |
| vibe-eval.com | 0/1 | empty 1 | never |
| vivere.dev | 1/1 | ok 1 | 2026-11-04 |
| vol.asura.asu.edu | 1/1 | ok 1 | 2026-11-07 |
| wave.webaim.org | 1/1 | ok 1 | 2026-11-07 |
| williamsrecord.com | 0/1 | http_403 1 | never |
| windes.com | 0/1 | http_403 1 | never |
| wpamelia.com | 1/1 | ok 1 | 2026-11-03 |
| www.ada.org | 0/1 | empty 1 | never |
| www.adlercolvin.com | 1/1 | ok 1 | 2026-11-07 |
| www.alternativeto.net | 0/1 | http_403 1 | never |
| www.ato.gov.au | 0/1 | http_403 1 | never |
| www.aucklandanglican.org.nz | 1/1 | ok 1 | 2026-11-07 |
| www.audioeye.com | 1/1 | ok 1 | 2026-11-07 |
| www.barnesdennig.com | 1/1 | ok 1 | 2026-11-07 |
| www.bluehost.com | 0/1 | http_403 1 | never |
| www.boomeranggmail.com | 1/1 | ok 1 | 2026-11-06 |
| www.careerbuilder.com | 0/1 | http_403 1 | never |
| www.cda.org | 1/1 | ok 1 | 2026-11-07 |
| www.cdocs.com | 0/1 | redirect 1 | never |
| www.cdtfa.ca.gov | 1/1 | ok 1 | 2026-11-05 |
| www.chcanys.org | 1/1 | ok 1 | 2026-11-07 |
| www.checklyhq.com | 1/1 | ok 1 | 2026-11-03 |
| www.chronicle.com | 0/1 | http_403 1 | never |
| www.clarkhill.com | 1/1 | ok 1 | 2026-11-06 |
| www.classcentral.com | 0/1 | http_403 1 | never |
| www.compatshield.com | 1/1 | ok 1 | 2026-11-04 |
| www.cookiebot.com | 1/1 | ok 1 | 2026-11-02 |
| www.cookieyes.com | 1/1 | ok 1 | 2026-11-02 |
| www.cs.umd.edu | 0/1 | http_5xx 1 | never |
| www.dailycal.org | 0/1 | http_403 1 | never |
| www.deque.com | 0/1 | http_404 1 | never |
| www.digitalcommerce360.com | 0/1 | http_403 1 | never |
| www.dor.wa.gov | 1/1 | ok 1 | 2026-11-02 |
| www.drbicuspid.com | 0/1 | http_403 1 | never |
| www.duanemorris.com | 1/1 | ok 1 | 2026-11-07 |
| www.etsy.com | 0/1 | empty 1 | never |
| www.experian.com | 1/1 | ok 1 | 2026-11-07 |
| www.facebook.com | 1/1 | ok 1 | 2026-11-06 |
| www.feldesman.com | 1/1 | ok 1 | 2026-11-07 |
| www.followupthen.com | 0/1 | http_5xx 1 | never |
| www.fourlane.com | 1/1 | ok 1 | 2026-11-07 |
| www.getjobber.com | 1/1 | ok 1 | 2026-11-06 |
| www.github.com | 1/1 | ok 1 | 2026-11-07 |
| www.harborcompliance.com | 1/1 | ok 1 | 2026-11-07 |
| www.higheredjobs.com | 0/1 | empty 1 | never |
| www.housecallpro.com | 1/1 | ok 1 | 2026-11-06 |
| www.infoodle.com | 1/1 | ok 1 | 2026-11-07 |
| www.irs.gov | 1/1 | ok 1 | 2026-11-07 |
| www.jibble.io | 1/1 | ok 1 | 2026-11-06 |
| www.krowdbase.com | 0/1 | http_403 1 | never |
| www.legal500.com | 1/1 | ok 1 | 2026-11-07 |
| www.levelaccess.com | 0/1 | http_404 1 | never |
| www.liquidweb.com | 1/1 | ok 1 | 2026-11-07 |
| www.mass.gov | 0/1 | http_403 1 | never |
| www.mediabistro.com | 1/1 | ok 1 | 2026-11-07 |
| www.messagedesk.com | 1/1 | ok 1 | 2026-11-04 |
| www.microns.io | 1/1 | ok 1 | 2026-11-07 |
| www.mondaq.com | 1/1 | ok 1 | 2026-11-02 |
| www.moovs.app | 0/1 | allowlist 1 | never |
| www.nachc.org | 1/1 | ok 1 | 2026-11-07 |
| www.nationgraph.com | 0/1 | http_404 1 | never |
| www.nccommunitycolleges.edu | 1/1 | ok 1 | 2026-11-07 |
| www.ndsmcobserver.com | 0/1 | http_403 1 | never |
| www.nysenate.gov | 1/1 | ok 1 | 2026-11-06 |
| www.onlinejobs.ph | 1/1 | ok 1 | 2026-11-03 |
| www.onlinelabels.com | 1/1 | ok 1 | 2026-11-06 |
| www.onpay.com | 1/1 | ok 1 | 2026-11-07 |
| www.patriotsoftware.com | 0/1 | http_404 1 | never |
| www.paylocity.com | 0/1 | empty 1 | never |
| www.pulse.bot | 0/1 | http_5xx 1 | never |
| www.quo.com | 1/1 | ok 1 | 2026-11-06 |
| www.restaurantbusinessonline.com | 1/1 | ok 1 | 2026-11-06 |
| www.ru.nl | 0/1 | http_5xx 1 | never |
| www.shopify.com | 1/1 | ok 1 | 2026-11-03 |
| www.siteground.com | 0/1 | http_404 1 | never |
| www.siteimprove.com | 1/1 | ok 1 | 2026-11-07 |
| www.softwareadvice.com | 0/1 | http_403 1 | never |
| www.startupdaily.net | 1/1 | ok 1 | 2026-11-07 |
| www.taxbandits.com | 1/1 | ok 1 | 2026-11-07 |
| www.the-standard.org | 1/1 | ok 1 | 2026-11-01 |
| www.thomsonreuters.com | 1/1 | ok 1 | 2026-11-07 |
| www.transact-tech.com | 1/1 | ok 1 | 2026-11-06 |
| www.uptimia.com | 1/1 | ok 1 | 2026-11-03 |
| www.upwork.com | 0/1 | http_403 1 | never |
| www.valueaddedresource.net | 1/1 | ok 1 | 2026-11-01 |
| www.wxxinews.org | 1/1 | ok 1 | 2026-11-06 |
| www.zeffy.com | 1/1 | ok 1 | 2026-11-07 |
| www.zoho.com | 1/1 | ok 1 | 2026-11-06 |
| xdaforums.com | 0/1 | http_403 1 | never |
| zapier.com | 1/1 | ok 1 | 2026-11-07 |
| zeitride.com | 1/1 | ok 1 | 2026-11-06 |

## Where candidates die

| Gate condition | Candidates lost |
|---|---|
| totalBelowMin | 172 |
| rejectRule | 55 |
| reviewKill | 31 |
| painBelow4 | 3 |
| noRecentEvidence | 2 |

The largest row is the one to argue about before changing anything else.

## Funnel over the window

candidates 269 -> passedRejectRules 214 -> passedGate 6 -> reviewKilled 31 -> validated 0 -> provisional 21 -> watchlist 36

## Runs that produced nothing

- `2026-10-30#1`: Thesis Deposit Preflight was the one candidate to clear the gate at 23. The adversarial reviewer rescored it to 17 and the no-backfill rule forbade researching the next candidate down, so the day ended at zero. The rule, not the evidence, produced the empty file.
- `2026-10-31#1`: Best candidate was Orphaned Embed Rescue at 21, one point under the gate of 22, held back by free replacements and a one-time migration need. With no provisional tier the run had no way to ship its best candidate. Saturday's focus sources (RFP portals, job postings) mostly surfaced enterprise solicitations that the no-procurement rejection rule kills by construction.
- `2026-10-31#2`: A8 yielded nothing because Reddit is unreachable, so a quarter of the run's source budget was spent on a dead source the morning run had already found dead. The strongest signal, the end of Canvas Free-for-Teacher, is already served by free Canvas Lite and ProfDesk.
- `2026-10-31#3`: Fresh Canvas pain was either already served (Atomic Search sells account-wide Find and Replace) or bound up with minors' data. EdSurge, EdWeek Market Brief and pulse.bot returned no usable October 2026 content through WebFetch.
- `2026-11-04#3`: Two separate limits stopped this run. (1) The day already held 4 provisional ideas, the cap in ROUTINE.md and validate_ideas.py (MAX_PROVISIONAL), so a third run on the same day can only ship validated ideas. (2) No candidate came near the gate of 22: the best two were rescored by reviewers from 18 and 16 to 14. Without the cap, neither would have shipped as validated either. The cap makes any third same-day run unable to add provisional ideas, so the routine should either stop extra runs once the cap is reached or count the cap per run.

A run producing nothing is a routine bug, not a quiet day. Each line above is one to fix.

