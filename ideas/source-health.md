# Source health

Generated 2026-11-23 from the last 45 days of `ideas/run-log.jsonl` (32 runs). Do not edit by hand: regenerate with `python3 scripts/source_health.py`.

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
| B5 Acquisition marketplaces | Find acquire. |
| B7 Product Hunt | producthunt.com returns HTTP 403 without an API key. |
| C3 Procurement and RFP portals | RFP portals sit behind Cloudflare, and an RFP buyer fails the no-procurement rule anyway. |

## Reachable sources, best first

`selected` counts ideas chosen in the window that came from this source.

| Source | Yields | Status | selected | Access path |
|---|---|---|---|---|
| A16 Vendor feature-request boards | complaint | ok-curl | 23 | `curl: https://productideas.xero.com/search?query={q}` |
| A13 Discourse forums, any niche | complaint | ok | 19 | `webfetch: https://{host}/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| B12 Paid app marketplaces | spend | ok | 14 | `curl: https://apps.shopify.com/{slug}/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest` |
| C5 Policy and regulation trackers | mandate | ok | 14 | `webfetch: https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest&conditions[term]={q}` |
| C10 Change events: shutdowns, price rises, removed free tiers | mandate | ok | 9 | no verified path |
| B11 Freelance job boards | spend | ok | 7 | `webfetch: https://www.freelancer.com/api/projects/0.1/projects/active/?query={q}&limit=20&full_description=true` |
| C8 Trade news | mandate | ok-curl | 5 | `curl: https://www.edsurge.com/news` |
| A14 Plugin and add-on support forums | complaint | ok | 4 | `webfetch: https://wordpress.org/support/plugin/{slug}/` |
| A12 Ask HN and HN comments | complaint | ok | 3 | `webfetch: https://hn.algolia.com/api/v1/search_by_date?query={q}&tags=comment&hitsPerPage=20` |
| A11 Accessibility practitioners | complaint | ok-curl | 2 | `webfetch: https://webaim.org/discussion/archives` |
| A15 No-code automation communities | complaint | ok | 2 | `webfetch: https://community.make.com/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| A3 Open-source teaching tools | complaint | ok | 2 | `curl: https://api.github.com/search/issues?q={q}+is%3Aissue+state%3Aopen+sort%3Areactions&per_page=10` |
| A5 Educator Stack Exchanges | complaint | ok-curl | 2 | `curl: https://api.stackexchange.com/2.3/questions?site={cseducators|academia|matheducators}&order=desc&sort=creation&pagesize=20&filter=withbody` |
| B1 Teachers Pay Teachers and Etsy | spend | ok | 2 | `webfetch: https://www.teacherspayteachers.com/Browse/Search:{q}` |
| A2 Other LMS and classroom forums | complaint | ok | 0 | `webfetch: https://discuss.openedx.org/latest.json` |
| A6 Edtech app and extension reviews | complaint | ok-curl | 0 | `webfetch: https://chromewebstore.google.com/detail/{slug}/{id}/reviews` |
| B10 WordPress plugin market data | spend | ok | 0 | `webfetch: https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]={q}&request[per_page]=10` |
| B2 AppSumo | spend | ok | 0 | `webfetch: https://appsumo.com/software/{category}/` |
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
| A4 GitHub Education and Classroom discussions | unknown | `https://api.github.com/search/issues?q=repo%3Acommunity%2Fcommunity+classroom&per_page=5` | http_422 (177B (twice, first was http_422)) | 0 |
| A16 Vendor feature-request boards | ok-curl | `https://forums.wildapricot.com/ (wishlist and suggestion pages)` | timeout (no status (curl exit 3) (twice, first was timeout)) | 1 |
| C2 Education and computing research | ok | `https://api.openalex.org/works?search=computing%20education&per-page=5&sort=publication_date:desc` | http_429 (827B (twice, first was http_429)) | 1 |

## Hosts, as actually observed

| Host | usable/tried | Outcomes | Last usable |
|---|---|---|---|
| www.freelancer.com | 643/692 | empty 49, ok 643 | 2026-11-23 |
| community.shopify.com | 481/529 | empty 30, http_404 1, http_429 17, ok 481 | 2026-11-23 |
| apps.shopify.com | 380/452 | empty 48, http_404 22, ok 380, redirect 2 | 2026-11-23 |
| community.squareup.com | 270/334 | empty 57, http_404 4, http_5xx 3, ok 270 | 2026-11-23 |
| productideas.xero.com | 292/306 | empty 10, http_404 2, ok 292, redirect 2 | 2026-11-23 |
| hn.algolia.com | 235/284 | empty 49, ok 235 | 2026-11-23 |
| wordpress.org | 184/187 | empty 1, http_404 2, ok 184 | 2026-11-23 |
| community.n8n.io | 111/112 | empty 1, ok 111 | 2026-11-22 |
| squareup.com | 61/97 | empty 2, http_429 30, ok 61, redirect 4 | 2026-11-23 |
| api.github.com | 58/95 | empty 15, http_403 20, http_404 1, http_5xx 1, ok 58 | 2026-11-18 |
| developer.squareup.com | 84/91 | empty 1, http_404 5, ok 84, redirect 1 | 2026-11-23 |
| www.federalregister.gov | 63/87 | empty 11, ok 63, redirect 13 | 2026-11-23 |
| forum.invoiceninja.com | 82/85 | empty 3, ok 82 | 2026-11-23 |
| community.calendly.com | 72/78 | empty 4, http_404 1, ok 72, timeout 1 | 2026-11-21 |
| apps.xero.com | 37/49 | empty 11, http_404 1, ok 37 | 2026-11-23 |
| quickbooks.intuit.com | 39/49 | empty 4, http_404 1, http_5xx 1, ok 39, timeout 4 | 2026-11-19 |
| community.make.com | 41/45 | empty 4, ok 41 | 2026-11-22 |
| api.wordpress.org | 42/43 | empty 1, ok 42 | 2026-11-23 |
| forum.manager.io | 39/42 | empty 3, ok 39 | 2026-11-23 |
| shopify.dev | 42/42 | ok 42 | 2026-11-23 |
| community.fly.io | 40/40 | ok 40 | 2026-11-18 |
| help.shopify.com | 37/37 | ok 37 | 2026-11-23 |
| raw.githubusercontent.com | 34/37 | empty 1, http_404 2, ok 34 | 2026-11-23 |
| talk.folksy.com | 33/35 | empty 2, ok 33 | 2026-11-22 |
| forum.ghost.org | 32/33 | empty 1, ok 32 | 2026-11-23 |
| www.gov.uk | 31/32 | http_404 1, ok 31 | 2026-11-22 |
| developer.xero.com | 18/31 | empty 13, ok 18 | 2026-11-23 |
| developer.calendly.com | 29/29 | ok 29 | 2026-11-20 |
| www.gov.wales | 28/28 | ok 28 | 2026-11-23 |
| community.toggl.com | 27/27 | ok 27 | 2026-11-19 |
| forums.wildapricot.com | 26/26 | ok 26 | 2026-11-21 |
| github.com | 17/26 | http_403 9, ok 17 | 2026-11-22 |
| discuss.openedx.org | 24/25 | empty 1, ok 24 | 2026-11-21 |
| appsumo.com | 24/24 | ok 24 | 2026-11-18 |
| sellersasksellers.com | 23/23 | ok 23 | 2026-11-22 |
| localsearchforum.com | 22/22 | ok 22 | 2026-11-20 |
| api.stackexchange.com | 20/21 | allowlist 1, ok 20 | 2026-11-21 |
| discuss.frappe.io | 20/20 | ok 20 | 2026-11-23 |
| www.peopleperhour.com | 6/20 | empty 14, ok 6 | 2026-11-20 |
| export.arxiv.org | 15/18 | empty 3, ok 15 | 2026-11-18 |
| zapier.com | 15/18 | http_404 3, ok 15 | 2026-11-21 |
| www.xero.com | 17/17 | ok 17 | 2026-11-23 |
| calendly.com | 13/16 | empty 3, ok 13 | 2026-11-20 |
| community.etsy.com | 5/16 | allowlist 1, empty 6, http_404 4, ok 5 | 2026-11-22 |
| community.shopify.dev | 13/13 | ok 13 | 2026-11-22 |
| marketplace.atlassian.com | 12/13 | empty 1, ok 12 | 2026-11-18 |
| www.capterra.com | 3/13 | http_403 9, http_404 1, ok 3 | 2026-11-16 |
| docs.fly.io | 12/12 | ok 12 | 2026-11-18 |
| docs.stripe.com | 12/12 | ok 12 | 2026-11-23 |
| ico.org.uk | 11/12 | http_404 1, ok 11 | 2026-11-23 |
| www.accountingweb.co.uk | 0/12 | http_403 12 | never |
| www.teacherspayteachers.com | 12/12 | ok 12 | 2026-11-17 |
| gumroad.com | 7/11 | empty 4, ok 7 | 2026-11-22 |
| support.zeffy.com | 8/11 | http_404 3, ok 8 | 2026-11-21 |
| www.avalara.com | 10/11 | http_404 1, ok 10 | 2026-11-23 |
| www.idealist.org | 1/11 | http_404 10, ok 1 | 2026-11-07 |
| www.quotientapp.com | 10/11 | empty 1, ok 10 | 2026-11-20 |
| communityhub.sage.com | 10/10 | ok 10 | 2026-11-19 |
| www.wix.com | 10/10 | ok 10 | 2026-11-23 |
| cdtfa.ca.gov | 9/9 | ok 9 | 2026-11-23 |
| changelog.shopify.com | 9/9 | ok 9 | 2026-11-22 |
| forum.bubble.io | 8/9 | empty 1, ok 8 | 2026-11-18 |
| gethelp.wildapricot.com | 5/9 | empty 4, ok 5 | 2026-11-07 |
| www.achrnews.com | 8/9 | empty 1, ok 8 | 2026-11-20 |
| www.ukbusinessforums.co.uk | 7/9 | empty 2, ok 7 | 2026-11-21 |
| apps.apple.com | 6/8 | http_404 2, ok 6 | 2026-11-23 |
| community.glowforge.com | 7/8 | empty 1, ok 7 | 2026-11-22 |
| community.retellai.com | 8/8 | ok 8 | 2026-11-23 |
| dev.to | 7/8 | http_404 1, ok 7 | 2026-11-23 |
| docs.n8n.io | 7/8 | empty 1, ok 7 | 2026-11-18 |
| forum.cursor.com | 8/8 | ok 8 | 2026-11-18 |
| www.govinfo.gov | 8/8 | ok 8 | 2026-11-23 |
| www.valueaddedresource.net | 8/8 | ok 8 | 2026-11-15 |
| www.zeffy.com | 8/8 | ok 8 | 2026-11-21 |
| accountants.intuit.com | 6/7 | http_403 1, ok 6 | 2026-11-23 |
| apibreaks.com | 7/7 | ok 7 | 2026-11-18 |
| blog.xero.com | 7/7 | ok 7 | 2026-11-23 |
| community.zoom.com | 5/7 | empty 2, ok 5 | 2026-11-10 |
| discourse.jupyter.org | 5/7 | empty 2, ok 5 | 2026-11-18 |
| fly.io | 5/7 | ok 5, redirect 2 | 2026-11-18 |
| oag.ca.gov | 7/7 | ok 7 | 2026-11-07 |
| pypi.org | 2/7 | empty 4, http_404 1, ok 2 | 2026-11-18 |
| trykintsugi.com | 7/7 | ok 7 | 2026-11-23 |
| www.fairwork.gov.au | 0/7 | empty 2, http_5xx 3, timeout 2 | never |
| www.icaew.com | 6/7 | empty 1, ok 6 | 2026-11-23 |
| www.irs.gov | 7/7 | ok 7 | 2026-11-23 |
| acuityscheduling.com | 6/6 | ok 6 | 2026-11-20 |
| assets.publishing.service.gov.uk | 6/6 | ok 6 | 2026-11-22 |
| community.cloudflare.com | 0/6 | empty 1, http_403 5 | never |
| craftybase.com | 3/6 | ok 3, redirect 3 | 2026-11-22 |
| developers.google.com | 6/6 | ok 6 | 2026-11-21 |
| feedback.zeffy.com | 6/6 | ok 6 | 2026-11-21 |
| gov.wales | 6/6 | ok 6 | 2026-11-23 |
| partial.ly | 6/6 | ok 6 | 2026-11-08 |
| seedfund.nsf.gov | 3/6 | http_404 3, ok 3 | 2026-11-06 |
| sellercommunity.com | 0/6 | empty 3, redirect 3 | never |
| taxcloud.com | 6/6 | ok 6 | 2026-11-23 |
| trustmrr.com | 5/6 | http_404 1, ok 5 | 2026-11-06 |
| www.acas.org.uk | 6/6 | ok 6 | 2026-11-21 |
| www.legislation.gov.uk | 4/6 | empty 2, ok 4 | 2026-11-23 |
| www.nyc.gov | 6/6 | ok 6 | 2026-11-23 |
| accessibe.com | 5/5 | ok 5 | 2026-11-23 |
| api.nsf.gov | 5/5 | ok 5 | 2026-11-05 |
| api.openalex.org | 0/5 | http_429 5 | never |
| chromewebstore.google.com | 5/5 | ok 5 | 2026-11-22 |
| despatch.blog.gov.uk | 5/5 | ok 5 | 2026-11-17 |
| developer.etsy.com | 5/5 | ok 5 | 2026-11-22 |
| developer.intuit.com | 0/5 | empty 5 | never |
| discuss.pixls.us | 5/5 | ok 5 | 2026-11-22 |
| downloads.wordpress.org | 5/5 | ok 5 | 2026-11-18 |
| engineering.toggl.com | 5/5 | ok 5 | 2026-11-19 |
| flippa.com | 2/5 | empty 3, ok 2 | 2026-11-07 |
| foscos.fssai.gov.in | 0/5 | empty 5 | never |
| help.klaviyo.com | 5/5 | ok 5 | 2026-11-20 |
| invoiceninja.com | 5/5 | ok 5 | 2026-11-19 |
| learn.microsoft.com | 3/5 | empty 2, ok 3 | 2026-11-21 |
| n8n.io | 5/5 | ok 5 | 2026-11-20 |
| payhip.com | 5/5 | ok 5 | 2026-11-22 |
| tax.colorado.gov | 5/5 | ok 5 | 2026-11-23 |
| techcommunity.microsoft.com | 5/5 | ok 5 | 2026-11-11 |
| toggl.com | 5/5 | ok 5 | 2026-11-19 |
| www.airbnb.com | 5/5 | ok 5 | 2026-11-23 |
| www.ato.gov.au | 0/5 | http_403 5 | never |
| www.breathehr.com | 4/5 | http_404 1, ok 4 | 2026-11-21 |
| www.cdtfa.ca.gov | 5/5 | ok 5 | 2026-11-23 |
| www.etsy.com | 0/5 | empty 1, http_403 4 | never |
| www.hhs.gov | 0/5 | http_403 5 | never |
| www.higheredjobs.com | 0/5 | empty 5 | never |
| www.inventora.com | 4/5 | http_404 1, ok 4 | 2026-11-22 |
| www.rosterelf.com | 4/5 | http_404 1, ok 4 | 2026-11-17 |
| www.royalmail.com | 0/5 | http_403 5 | never |
| www.wildapricot.com | 5/5 | ok 5 | 2026-11-21 |
| www.wrkr.com.au | 5/5 | ok 5 | 2026-11-19 |
| accessible.org | 4/4 | ok 4 | 2026-11-23 |
| apify.com | 3/4 | empty 1, ok 3 | 2026-11-20 |
| astalty.com.au | 4/4 | ok 4 | 2026-11-21 |
| blog.insightfulaccountant.com | 4/4 | ok 4 | 2026-11-19 |
| clockify.me | 4/4 | ok 4 | 2026-11-19 |
| community.getjobber.com | 0/4 | http_403 4 | never |
| community.servicem8.com | 4/4 | ok 4 | 2026-11-19 |
| community.spiceworks.com | 2/4 | empty 2, ok 2 | 2026-11-11 |
| community.withairbnb.com | 0/4 | redirect 4 | never |
| developer.wordpress.org | 4/4 | ok 4 | 2026-11-23 |
| devforum.zoom.us | 4/4 | ok 4 | 2026-11-10 |
| employmenthero.com | 4/4 | ok 4 | 2026-11-16 |
| expenseplus.co.uk | 4/4 | ok 4 | 2026-11-21 |
| forum.obsidian.md | 3/4 | empty 1, ok 3 | 2026-11-18 |
| forum.squarespace.com | 0/4 | empty 1, http_403 3 | never |
| forum.webflow.com | 0/4 | empty 3, redirect 1 | never |
| grants.nih.gov | 3/4 | ok 3, redirect 1 | 2026-11-11 |
| help.etsy.com | 3/4 | empty 1, ok 3 | 2026-11-15 |
| help.getharvest.com | 4/4 | ok 4 | 2026-11-18 |
| help.getjobber.com | 3/4 | http_403 1, ok 3 | 2026-11-19 |
| intercom.help | 3/4 | http_404 1, ok 3 | 2026-11-22 |
| marketplace.stripe.com | 2/4 | empty 2, ok 2 | 2026-11-22 |
| meet.ribblr.com | 4/4 | ok 4 | 2026-11-22 |
| pressprimer.com | 3/4 | empty 1, ok 3 | 2026-11-21 |
| stocksmith.io | 4/4 | ok 4 | 2026-11-22 |
| subdoc.io | 4/4 | ok 4 | 2026-11-23 |
| support.stripe.com | 3/4 | empty 1, ok 3 | 2026-11-23 |
| webaim.org | 1/4 | empty 3, ok 1 | 2026-11-01 |
| workspace.google.com | 4/4 | ok 4 | 2026-11-22 |
| www.accaglobal.com | 4/4 | ok 4 | 2026-11-23 |
| www.fssai.gov.in | 3/4 | empty 1, ok 3 | 2026-11-23 |
| www.getapp.com | 0/4 | http_403 4 | never |
| www.getbcs.com | 4/4 | ok 4 | 2026-11-23 |
| www.inflatableoffice.com | 3/4 | ok 3, redirect 1 | 2026-11-18 |
| www.make.com | 1/4 | http_403 3, ok 1 | 2026-11-07 |
| www.modernretail.co | 4/4 | ok 4 | 2026-11-13 |
| www.paidnice.com | 4/4 | ok 4 | 2026-11-20 |
| www.paytraqer.com | 2/4 | http_404 2, ok 2 | 2026-11-19 |
| www.taxcalc.com | 4/4 | ok 4 | 2026-11-21 |
| zonos.com | 3/4 | empty 1, ok 3 | 2026-11-16 |
| adanews.ada.org | 3/3 | ok 3 | 2026-11-23 |
| api.npmjs.org | 3/3 | ok 3 | 2026-11-18 |
| approvalmax.com | 3/3 | ok 3 | 2026-11-14 |
| archdesk.com | 3/3 | ok 3 | 2026-11-23 |
| beancount.io | 3/3 | ok 3 | 2026-11-18 |
| blenderartists.org | 3/3 | ok 3 | 2026-11-22 |
| booqable.com | 2/3 | http_404 1, ok 2 | 2026-11-18 |
| cal.com | 3/3 | ok 3 | 2026-11-20 |
| cartmango.com | 3/3 | ok 3 | 2026-11-22 |
| certpilot.app | 2/3 | http_404 1, ok 2 | 2026-11-18 |
| code.claude.com | 3/3 | ok 3 | 2026-11-11 |
| developer.apple.com | 3/3 | ok 3 | 2026-11-21 |
| developer.getjobber.com | 0/3 | http_403 3 | never |
| developers.etsy.com | 3/3 | ok 3 | 2026-11-15 |
| discourse.webflow.com | 0/3 | empty 2, redirect 1 | never |
| domainnotifications.com | 3/3 | ok 3 | 2026-11-18 |
| dor.wa.gov | 2/3 | http_404 1, ok 2 | 2026-11-07 |
| en.freetobook.com | 3/3 | ok 3 | 2026-11-23 |
| feedback.qbo.intuit.com | 0/3 | allowlist 2, empty 1 | never |
| forum.posit.co | 3/3 | ok 3 | 2026-11-18 |
| forum.wixstudio.com | 2/3 | empty 1, ok 2 | 2026-11-20 |
| get.nicejob.com | 2/3 | http_404 1, ok 2 | 2026-11-20 |
| ghost.org | 3/3 | ok 3 | 2026-11-15 |
| help.buildxact.com | 3/3 | ok 3 | 2026-11-23 |
| help.teacherspayteachers.com | 2/3 | http_403 1, ok 2 | 2026-11-10 |
| help.zoho.com | 1/3 | empty 2, ok 1 | 2026-11-20 |
| innovations.xero.com | 2/3 | empty 1, ok 2 | 2026-11-20 |
| invoiceninja.github.io | 1/3 | empty 2, ok 1 | 2026-11-20 |
| legacy.cdocs.com | 3/3 | ok 3 | 2026-11-23 |
| managewp.com | 3/3 | ok 3 | 2026-11-18 |
| marketing-website-3vj.pages.dev | 3/3 | ok 3 | 2026-11-18 |
| n8n-handoff-kit.vercel.app | 3/3 | ok 3 | 2026-11-04 |
| news.ycombinator.com | 2/3 | http_429 1, ok 2 | 2026-11-18 |
| outpost.pub | 3/3 | ok 3 | 2026-11-15 |
| punchpass.com | 3/3 | ok 3 | 2026-11-18 |
| ramp.com | 3/3 | ok 3 | 2026-11-23 |
| remitclear.com | 3/3 | ok 3 | 2026-11-05 |
| rewind.com | 3/3 | ok 3 | 2026-11-19 |
| skyvia.com | 1/3 | http_404 2, ok 1 | 2026-11-19 |
| smtply.pages.dev | 2/3 | http_404 1, ok 2 | 2026-11-11 |
| support.expenseplus.co.uk | 3/3 | ok 3 | 2026-11-21 |
| support.getharvest.com | 0/3 | http_403 3 | never |
| support.google.com | 2/3 | http_404 1, ok 2 | 2026-11-20 |
| support.gusto.com | 0/3 | http_403 3 | never |
| support.servicem8.com | 3/3 | ok 3 | 2026-11-20 |
| support.taxjar.com | 3/3 | ok 3 | 2026-11-23 |
| support.toggl.com | 3/3 | ok 3 | 2026-11-19 |
| support.zapiet.com | 3/3 | ok 3 | 2026-11-21 |
| techradar.com | 2/3 | empty 1, ok 2 | 2026-11-18 |
| totaldrive.co.uk | 2/3 | http_404 1, ok 2 | 2026-11-17 |
| uptimerobot.com | 3/3 | ok 3 | 2026-11-18 |
| versionly.dev | 2/3 | http_404 1, ok 2 | 2026-11-18 |
| visitorlevyapp.com | 3/3 | ok 3 | 2026-11-23 |
| woocommerce.com | 3/3 | ok 3 | 2026-11-22 |
| wpamelia.com | 3/3 | ok 3 | 2026-11-18 |
| www.accessibilitychecker.org | 3/3 | ok 3 | 2026-11-23 |
| www.brighthr.com | 3/3 | ok 3 | 2026-11-21 |
| www.buildpass.ai | 3/3 | ok 3 | 2026-11-23 |
| www.change.org | 3/3 | ok 3 | 2026-11-10 |
| www.charityjob.co.uk | 0/3 | http_403 3 | never |
| www.chartrequest.com | 3/3 | ok 3 | 2026-11-23 |
| www.checklyhq.com | 3/3 | ok 3 | 2026-11-18 |
| www.claytonutz.com | 3/3 | ok 3 | 2026-11-22 |
| www.ftc.gov | 3/3 | ok 3 | 2026-11-20 |
| www.getharvest.com | 2/3 | http_404 1, ok 2 | 2026-11-19 |
| www.health.gov.au | 0/3 | http_5xx 3 | never |
| www.kelleydrye.com | 3/3 | ok 3 | 2026-11-23 |
| www.legislation.gov.au | 3/3 | ok 3 | 2026-11-21 |
| www.leohr.co.uk | 3/3 | ok 3 | 2026-11-21 |
| www.nrn.com | 2/3 | empty 1, ok 2 | 2026-11-20 |
| www.nsf.gov | 1/3 | http_404 2, ok 1 | 2026-11-04 |
| www.payapps.com | 3/3 | ok 3 | 2026-11-23 |
| www.reddit.com | 0/3 | allowlist 2, http_403 1 | never |
| www.salontoday.com | 3/3 | ok 3 | 2026-11-20 |
| www.shopify.com | 3/3 | ok 3 | 2026-11-23 |
| www.taxwire.com | 3/3 | ok 3 | 2026-11-23 |
| www.trustlayer.io | 3/3 | ok 3 | 2026-11-23 |
| www.tutorbird.com | 2/3 | empty 1, ok 2 | 2026-11-19 |
| www.usecarly.com | 1/3 | http_429 2, ok 1 | 2026-11-19 |
| www.xbert.io | 2/3 | http_404 1, ok 2 | 2026-11-19 |
| zeffy.hc.ferndesk.com | 0/3 | redirect 3 | never |
| acie.wildapricot.org | 2/2 | ok 2 | 2026-11-21 |
| administrate.dev | 2/2 | ok 2 | 2026-11-18 |
| alteg.io | 2/2 | ok 2 | 2026-11-06 |
| aphyr.com | 2/2 | ok 2 | 2026-11-18 |
| api.n8n.io | 2/2 | ok 2 | 2026-11-20 |
| api.squareup.com | 1/2 | ok 1, redirect 1 | 2026-11-20 |
| app.thetutor.link | 2/2 | ok 2 | 2026-11-03 |
| apply.workable.com | 0/2 | http_404 2 | never |
| atg.wa.gov | 2/2 | ok 2 | 2026-11-20 |
| batchmakes.com | 2/2 | ok 2 | 2026-11-22 |
| billable.to | 2/2 | ok 2 | 2026-11-18 |
| buffer.com | 2/2 | ok 2 | 2026-11-18 |
| buildpass.ai | 2/2 | ok 2 | 2026-11-23 |
| cabgrid.com | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| cardiff.gov.uk | 0/2 | http_403 2 | never |
| ch.trustpilot.com | 1/2 | http_403 1, ok 1 | 2026-11-18 |
| clientmeter.pages.dev | 2/2 | ok 2 | 2026-11-11 |
| community.instructure.com | 0/2 | empty 2 | never |
| community.openfoodnetwork.org | 2/2 | ok 2 | 2026-11-20 |
| community.zapier.com | 0/2 | empty 1, http_404 1 | never |
| community.zeffy.com | 2/2 | ok 2 | 2026-11-21 |
| communitycenter.airbnb.com | 0/2 | empty 2 | never |
| complaintsdesk.pages.dev | 2/2 | ok 2 | 2026-11-23 |
| consentik.com | 2/2 | ok 2 | 2026-11-23 |
| content.govdelivery.com | 2/2 | ok 2 | 2026-11-21 |
| craevidence.com | 2/2 | ok 2 | 2026-11-11 |
| ctars.com.au | 2/2 | ok 2 | 2026-11-21 |
| developers.make.com | 2/2 | ok 2 | 2026-11-18 |
| docs.dingdoong.io | 1/2 | empty 1, ok 1 | 2026-11-13 |
| docs.ghost.org | 2/2 | ok 2 | 2026-11-15 |
| docs.machines.dev | 0/2 | http_404 2 | never |
| docs.toggl.com | 2/2 | ok 2 | 2026-11-19 |
| docs.zeffy.com | 2/2 | ok 2 | 2026-11-21 |
| documentation.outpost.pub | 2/2 | ok 2 | 2026-11-15 |
| dsp.berkeley.edu | 2/2 | ok 2 | 2026-11-01 |
| dvoorhees.com | 2/2 | ok 2 | 2026-11-18 |
| elfsight.com | 2/2 | ok 2 | 2026-11-20 |
| equalizedigital.com | 1/2 | http_403 1, ok 1 | 2026-11-07 |
| euverify.com | 2/2 | ok 2 | 2026-11-23 |
| fasta2p-portal.pages.dev | 2/2 | ok 2 | 2026-11-09 |
| feedback.kajabi.com | 0/2 | allowlist 1, empty 1 | never |
| fiverr.com | 0/2 | http_403 2 | never |
| flyingfish.ie | 2/2 | ok 2 | 2026-11-03 |
| forum.arduino.cc | 1/2 | empty 1, ok 1 | 2026-11-11 |
| forum.mautic.org | 2/2 | ok 2 | 2026-11-03 |
| forums.unrealengine.com | 2/2 | ok 2 | 2026-11-22 |
| fssai.gov.in | 2/2 | ok 2 | 2026-11-23 |
| getvela.com | 2/2 | ok 2 | 2026-11-10 |
| grantedai.com | 2/2 | ok 2 | 2026-11-11 |
| hackceleration.com | 2/2 | ok 2 | 2026-11-18 |
| help.acuityscheduling.com | 0/2 | http_403 2 | never |
| help.arketa.com | 2/2 | ok 2 | 2026-11-23 |
| help.artstation.com | 2/2 | ok 2 | 2026-11-22 |
| help.employmenthero.com | 0/2 | http_403 2 | never |
| help.inventora.com | 2/2 | ok 2 | 2026-11-22 |
| help.momence.com | 2/2 | ok 2 | 2026-11-23 |
| help.onpay.com | 0/2 | http_403 2 | never |
| help.parcel.royalmail.com | 0/2 | http_403 2 | never |
| help.servicetitan.com | 2/2 | ok 2 | 2026-11-13 |
| highlevel.canny.io | 2/2 | ok 2 | 2026-11-09 |
| hopscotchsupport.zendesk.com | 0/2 | http_403 2 | never |
| hse.gov.uk | 2/2 | ok 2 | 2026-11-23 |
| hts.usitc.gov | 2/2 | ok 2 | 2026-11-08 |
| ideas.smartalbums.com | 0/2 | empty 2 | never |
| itbrief.co.uk | 2/2 | ok 2 | 2026-11-21 |
| joinit.com | 2/2 | ok 2 | 2026-11-21 |
| kostenlose-erechnung.de | 2/2 | ok 2 | 2026-11-11 |
| labyrinthinc.com | 2/2 | ok 2 | 2026-11-07 |
| learn.thryv.com | 0/2 | http_403 2 | never |
| legislation.gov.au | 2/2 | ok 2 | 2026-11-21 |
| magazine.artstation.com | 0/2 | http_403 2 | never |
| mage-people.com | 1/2 | http_404 1, ok 1 | 2026-11-06 |
| mainwp.com | 2/2 | ok 2 | 2026-11-18 |
| mastodon.gamedev.place | 2/2 | ok 2 | 2026-11-06 |
| meta.discourse.org | 2/2 | ok 2 | 2026-11-10 |
| nation.cymru | 2/2 | ok 2 | 2026-11-23 |
| ndiscommission.gov.au | 0/2 | http_5xx 2 | never |
| nds.org.au | 0/2 | empty 2 | never |
| occasion.app | 2/2 | ok 2 | 2026-11-08 |
| onlineornot.com | 2/2 | ok 2 | 2026-11-18 |
| osiaffiliate.freshdesk.com | 0/2 | redirect 2 | never |
| public.api.bsky.app | 0/2 | http_403 2 | never |
| registry.npmjs.org | 2/2 | ok 2 | 2026-11-18 |
| roundtriplabs.helpscoutdocs.com | 0/2 | redirect 2 | never |
| safetyculture.com | 0/2 | redirect 2 | never |
| samsearch.co | 0/2 | empty 2 | never |
| servicehub.passgallery.com | 2/2 | ok 2 | 2026-11-08 |
| shiftcare.com | 2/2 | ok 2 | 2026-11-21 |
| sites.google.com | 2/2 | ok 2 | 2026-11-23 |
| softwaredevelopers.ato.gov.au | 0/2 | empty 1, http_5xx 1 | never |
| sourceforge.net | 1/2 | http_403 1, ok 1 | 2026-11-20 |
| splose.com | 2/2 | ok 2 | 2026-11-21 |
| square-appointment-wp.com | 2/2 | ok 2 | 2026-11-20 |
| square.com | 1/2 | ok 1, redirect 1 | 2026-11-19 |
| standardcompute.com | 2/2 | ok 2 | 2026-11-11 |
| streamlinedsalestax.org | 1/2 | http_404 1, ok 1 | 2026-11-23 |
| subletmanager.com | 2/2 | ok 2 | 2026-11-23 |
| supabase.com | 2/2 | ok 2 | 2026-11-23 |
| support.easyroutes.app | 2/2 | ok 2 | 2026-11-18 |
| support.marianatek.com | 2/2 | ok 2 | 2026-11-23 |
| support.pirateship.com | 2/2 | ok 2 | 2026-11-15 |
| support.toasttab.com | 2/2 | ok 2 | 2026-11-12 |
| synder.com | 2/2 | ok 2 | 2026-11-19 |
| tailride.so | 2/2 | ok 2 | 2026-11-11 |
| tax.nv.gov | 2/2 | ok 2 | 2026-11-23 |
| taxguru.in | 2/2 | ok 2 | 2026-11-23 |
| termly.io | 2/2 | ok 2 | 2026-11-23 |
| themarkup.org | 2/2 | ok 2 | 2026-11-02 |
| toolradar.com | 2/2 | ok 2 | 2026-11-21 |
| unscriptedphotographers.com | 2/2 | ok 2 | 2026-11-22 |
| vibeappscanner.com | 2/2 | ok 2 | 2026-11-04 |
| welshrevenueauthority.blog.gov.wales | 2/2 | ok 2 | 2026-11-23 |
| workfloor.com.au | 2/2 | ok 2 | 2026-11-16 |
| wpengine.com | 1/2 | http_404 1, ok 1 | 2026-11-03 |
| www.allergicliving.com | 0/2 | http_403 2 | never |
| www.alura.io | 2/2 | ok 2 | 2026-11-08 |
| www.artstation.com | 0/2 | http_403 2 | never |
| www.artworkarchive.com | 0/2 | http_403 2 | never |
| www.avail.co | 1/2 | allowlist 1, ok 1 | 2026-11-13 |
| www.avatarfleet.com | 1/2 | http_5xx 1, ok 1 | 2026-11-17 |
| www.azets.com | 2/2 | ok 2 | 2026-11-12 |
| www.bcnys.org | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| www.biggerpockets.com | 2/2 | ok 2 | 2026-11-23 |
| www.brownejacobson.com | 2/2 | ok 2 | 2026-11-21 |
| www.calconic.com | 2/2 | ok 2 | 2026-11-23 |
| www.canva.com | 0/2 | http_403 2 | never |
| www.catholicjobs.com | 0/2 | http_404 2 | never |
| www.cdocs.com | 0/2 | redirect 2 | never |
| www.centroassist.com.au | 1/2 | empty 1, ok 1 | 2026-11-21 |
| www.churchofengland.org | 0/2 | http_404 2 | never |
| www.claconnect.com | 2/2 | ok 2 | 2026-11-23 |
| www.cpapracticeadvisor.com | 2/2 | ok 2 | 2026-11-07 |
| www.deputy.com | 2/2 | ok 2 | 2026-11-16 |
| www.dolibarr.org | 2/2 | ok 2 | 2026-11-21 |
| www.e-recht24.de | 2/2 | ok 2 | 2026-11-22 |
| www.edjoin.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.expirationreminder.com | 2/2 | ok 2 | 2026-11-23 |
| www.fda.gov | 2/2 | ok 2 | 2026-11-22 |
| www.fqhc.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.getjobber.com | 2/2 | ok 2 | 2026-11-20 |
| www.goodshuffle.com | 0/2 | empty 2 | never |
| www.grants.nih.gov | 2/2 | ok 2 | 2026-11-11 |
| www.halfpricesoft.com | 2/2 | ok 2 | 2026-11-07 |
| www.icare.nsw.gov.au | 2/2 | ok 2 | 2026-11-23 |
| www.infoodle.com | 2/2 | ok 2 | 2026-11-14 |
| www.ird.govt.nz | 1/2 | empty 1, ok 1 | 2026-11-16 |
| www.iubenda.com | 2/2 | ok 2 | 2026-11-23 |
| www.listadum.com | 2/2 | ok 2 | 2026-11-15 |
| www.mass.gov | 0/2 | http_403 2 | never |
| www.meetergo.com | 2/2 | ok 2 | 2026-11-20 |
| www.menaiholidays.co.uk | 1/2 | empty 1, ok 1 | 2026-11-23 |
| www.messagedesk.com | 2/2 | ok 2 | 2026-11-09 |
| www.mgma.com | 2/2 | ok 2 | 2026-11-07 |
| www.momoyoga.com | 2/2 | ok 2 | 2026-11-18 |
| www.mymusicstaff.com | 2/2 | ok 2 | 2026-11-19 |
| www.nasbaregistry.org | 2/2 | ok 2 | 2026-11-10 |
| www.ndiscommission.gov.au | 0/2 | http_5xx 2 | never |
| www.oag.ca.gov | 2/2 | ok 2 | 2026-11-07 |
| www.onlinejobs.ph | 2/2 | ok 2 | 2026-11-10 |
| www.overdriveonline.com | 0/2 | http_403 2 | never |
| www.patriotsoftware.com | 1/2 | http_404 1, ok 1 | 2026-11-12 |
| www.photographytalk.com | 0/2 | empty 2 | never |
| www.photrio.com | 0/2 | http_403 2 | never |
| www.producthunt.com | 2/2 | ok 2 | 2026-11-20 |
| www.profileward.com | 1/2 | http_404 1, ok 1 | 2026-11-18 |
| www.rba.gov.au | 2/2 | ok 2 | 2026-11-20 |
| www.resourcecentre.org.uk | 2/2 | ok 2 | 2026-11-21 |
| www.restaurantbusinessonline.com | 1/2 | empty 1, ok 1 | 2026-11-06 |
| www.retailgazette.co.uk | 1/2 | http_429 1, ok 1 | 2026-11-12 |
| www.rubydoc.info | 0/2 | http_5xx 2 | never |
| www.saasant.com | 0/2 | http_404 2 | never |
| www.setmore.com | 2/2 | ok 2 | 2026-11-20 |
| www.shopuploader.com | 2/2 | ok 2 | 2026-11-15 |
| www.smtp2go.com | 2/2 | ok 2 | 2026-11-11 |
| www.soapmakingforum.com | 0/2 | http_403 2 | never |
| www.softwareadvice.com | 0/2 | http_403 2 | never |
| www.squareup.com | 1/2 | http_429 1, ok 1 | 2026-11-23 |
| www.statefarm.com | 0/2 | empty 1, http_403 1 | never |
| www.tanda.co | 2/2 | ok 2 | 2026-11-16 |
| www.taxbandits.com | 2/2 | ok 2 | 2026-11-14 |
| www.theprintspace.co.uk | 2/2 | ok 2 | 2026-11-22 |
| www.toriihq.com | 2/2 | ok 2 | 2026-11-18 |
| www.tradifyhq.com | 2/2 | ok 2 | 2026-11-20 |
| www.travelers.com | 2/2 | ok 2 | 2026-11-23 |
| www.trustpilot.com | 1/2 | http_403 1, ok 1 | 2026-11-05 |
| www.uncannyowl.com | 2/2 | ok 2 | 2026-11-21 |
| www.upwork.com | 0/2 | http_403 2 | never |
| www.vantage.sh | 2/2 | ok 2 | 2026-11-18 |
| www.waveapps.com | 2/2 | ok 2 | 2026-11-07 |
| www.zillow.com | 0/2 | http_403 2 | never |
| zebu.work | 2/2 | ok 2 | 2026-11-18 |
| 1password.com | 0/1 | empty 1 | never |
| 80.lv | 1/1 | ok 1 | 2026-11-22 |
| <store domain withheld: the sold-out product page cited in square community topic 845776> | 1/1 | ok 1 | 2026-11-20 |
| about.usps.com | 0/1 | empty 1 | never |
| acowebs.com | 1/1 | ok 1 | 2026-11-08 |
| acquire.com | 0/1 | http_404 1 | never |
| actonline.org | 1/1 | ok 1 | 2026-11-18 |
| adaptive.build | 1/1 | ok 1 | 2026-11-23 |
| administrator.de | 1/1 | ok 1 | 2026-11-11 |
| adnabu.com | 1/1 | ok 1 | 2026-11-03 |
| advertisinglaw.fkks.com | 0/1 | redirect 1 | never |
| agentdeals.dev | 1/1 | ok 1 | 2026-11-18 |
| ahaslides.com | 1/1 | ok 1 | 2026-11-17 |
| ai-act-service-desk.ec.europa.eu | 1/1 | ok 1 | 2026-11-17 |
| ai.varsitytutors.com | 1/1 | ok 1 | 2026-11-06 |
| airbtics.com | 1/1 | ok 1 | 2026-11-23 |
| airroi.com | 1/1 | ok 1 | 2026-11-23 |
| allitservices.com.au | 1/1 | ok 1 | 2026-11-11 |
| alternativeto.net | 0/1 | http_403 1 | never |
| answers.justia.com | 0/1 | http_403 1 | never |
| api-docs.invoicing.co | 1/1 | ok 1 | 2026-11-19 |
| api.regulations.gov | 0/1 | http_429 1 | never |
| api.www.sbir.gov | 0/1 | http_403 1 | never |
| apis.io | 1/1 | ok 1 | 2026-11-21 |
| app.acquire.com | 1/1 | ok 1 | 2026-11-07 |
| app.gumroad.com | 0/1 | redirect 1 | never |
| app.squareup.com | 1/1 | ok 1 | 2026-11-08 |
| apps.odoo.com | 1/1 | ok 1 | 2026-11-12 |
| appsource.microsoft.com | 0/1 | empty 1 | never |
| apuo.ca | 0/1 | empty 1 | never |
| arketa.com | 1/1 | ok 1 | 2026-11-23 |
| arrivy.com | 1/1 | ok 1 | 2026-11-13 |
| artfairinsiders.com | 1/1 | ok 1 | 2026-11-22 |
| asbfeo.gov.au | 1/1 | ok 1 | 2026-11-20 |
| ask.gibbonedu.org | 1/1 | ok 1 | 2026-11-21 |
| athletechnews.com | 1/1 | ok 1 | 2026-11-23 |
| baptist.org.uk | 0/1 | http_404 1 | never |
| batchbound.com | 1/1 | ok 1 | 2026-11-06 |
| becker.wustl.edu | 0/1 | timeout 1 | never |
| bestfoodtrucks.com | 0/1 | http_429 1 | never |
| betterstack.com | 1/1 | ok 1 | 2026-11-18 |
| billdrpro.featurebase.app | 1/1 | ok 1 | 2026-11-23 |
| birdeye.com | 1/1 | ok 1 | 2026-11-20 |
| bitwarden.com | 1/1 | ok 1 | 2026-11-18 |
| biz.booksy.com | 1/1 | ok 1 | 2026-11-12 |
| blog.coupler.io | 1/1 | ok 1 | 2026-11-18 |
| blog.groupmail.io | 1/1 | ok 1 | 2026-11-07 |
| blog.petpooja.com | 1/1 | ok 1 | 2026-11-23 |
| blog.report-uri.com | 1/1 | ok 1 | 2026-11-04 |
| blog.symquest.com | 1/1 | ok 1 | 2026-11-11 |
| blog.taxbandits.com | 1/1 | ok 1 | 2026-11-07 |
| blog.techsoup.org | 1/1 | ok 1 | 2026-11-07 |
| blog.uplisting.io | 0/1 | redirect 1 | never |
| blog.usablenet.com | 1/1 | ok 1 | 2026-11-07 |
| blogs.intuit.com | 0/1 | http_403 1 | never |
| boards.straightdope.com | 1/1 | ok 1 | 2026-11-22 |
| bookkeep.com | 1/1 | ok 1 | 2026-11-07 |
| booksbackup.com | 1/1 | ok 1 | 2026-11-19 |
| bookwhen.com | 1/1 | ok 1 | 2026-11-08 |
| bostonwebgroup.com | 1/1 | ok 1 | 2026-11-07 |
| breww.com | 1/1 | ok 1 | 2026-11-12 |
| brightsg.com | 1/1 | ok 1 | 2026-11-12 |
| btcsoftware.co.uk | 1/1 | ok 1 | 2026-11-21 |
| business.gov.au | 0/1 | http_404 1 | never |
| businesscloud.co.uk | 1/1 | ok 1 | 2026-11-21 |
| buunto.helpscoutdocs.com | 1/1 | ok 1 | 2026-11-22 |
| ca-rcf.evokeplatform.com | 0/1 | empty 1 | never |
| cakerybakeries.com | 1/1 | ok 1 | 2026-11-06 |
| calendly.stoplight.io | 1/1 | ok 1 | 2026-11-20 |
| careerbridge.wa.gov | 1/1 | ok 1 | 2026-11-21 |
| careers-mrocorp.icims.com | 0/1 | http_404 1 | never |
| careers.csudh.edu | 0/1 | empty 1 | never |
| catchingnumbers.com | 1/1 | ok 1 | 2026-11-18 |
| cause-comply.onrender.com | 0/1 | http_5xx 1 | never |
| cbs12.com | 1/1 | ok 1 | 2026-11-06 |
| cdlpowersuite.com | 1/1 | ok 1 | 2026-11-17 |
| cdn.cdata.com | 1/1 | ok 1 | 2026-11-14 |
| cdn.jsdelivr.net | 1/1 | ok 1 | 2026-11-11 |
| central.xero.com | 0/1 | empty 1 | never |
| centroassist.com.au | 1/1 | ok 1 | 2026-11-21 |
| certifier.io | 1/1 | ok 1 | 2026-11-10 |
| changestoukcompanylaw.campaign.gov.uk | 1/1 | ok 1 | 2026-11-19 |
| charitycompliancesolutions.com | 1/1 | ok 1 | 2026-11-07 |
| chatgate.ai | 1/1 | ok 1 | 2026-11-18 |
| choicepaid.com | 1/1 | ok 1 | 2026-11-10 |
| ci-governor-c3ke.onrender.com | 0/1 | http_5xx 1 | never |
| clarity.eco | 1/1 | ok 1 | 2026-11-12 |
| classic.skagitcountywa.gov | 1/1 | ok 1 | 2026-11-13 |
| clearlycomply.org | 1/1 | ok 1 | 2026-11-23 |
| click2houston.com | 1/1 | ok 1 | 2026-11-10 |
| clockspot.com | 1/1 | ok 1 | 2026-11-07 |
| cms.law | 1/1 | ok 1 | 2026-11-22 |
| cobaltextensions.wildapricot.org | 1/1 | ok 1 | 2026-11-07 |
| coddy.tech | 0/1 | http_403 1 | never |
| codeboard.io | 1/1 | ok 1 | 2026-11-01 |
| codecanyon.net | 1/1 | ok 1 | 2026-11-06 |
| coffeewp.dev | 0/1 | http_403 1 | never |
| coloradosun.com | 1/1 | ok 1 | 2026-11-06 |
| commission.europa.eu | 1/1 | ok 1 | 2026-11-08 |
| community.airbnb.com | 0/1 | redirect 1 | never |
| community.breww.com | 1/1 | ok 1 | 2026-11-12 |
| community.cal.com | 0/1 | timeout 1 | never |
| community.canva.com | 0/1 | timeout 1 | never |
| community.cliniko.com | 0/1 | redirect 1 | never |
| community.ebay.co.uk | 0/1 | empty 1 | never |
| community.ebay.com | 1/1 | ok 1 | 2026-11-22 |
| community.ecwid.com | 0/1 | http_404 1 | never |
| community.home-assistant.io | 0/1 | http_403 1 | never |
| community.honeybook.com | 1/1 | ok 1 | 2026-11-22 |
| community.hubspot.com | 1/1 | ok 1 | 2026-11-18 |
| community.kajabi.com | 0/1 | http_404 1 | never |
| community.klaviyo.com | 0/1 | http_404 1 | never |
| community.lightspeedhq.com | 0/1 | redirect 1 | never |
| community.lodgify.com | 0/1 | http_403 1 | never |
| community.loyverse.com | 0/1 | timeout 1 | never |
| community.openemr.org | 0/1 | empty 1 | never |
| community.openhab.org | 0/1 | empty 1 | never |
| community.podia.com | 0/1 | http_404 1 | never |
| community.render.com | 0/1 | redirect 1 | never |
| community.softr.io | 1/1 | ok 1 | 2026-11-20 |
| community.squarespace.com | 0/1 | http_404 1 | never |
| community.teachable.com | 0/1 | http_404 1 | never |
| community.thinkific.com | 0/1 | timeout 1 | never |
| community.usa.canon.com | 0/1 | redirect 1 | never |
| complianz.io | 1/1 | ok 1 | 2026-11-02 |
| connecteam.com | 1/1 | ok 1 | 2026-11-06 |
| consentcheck.online | 0/1 | http_404 1 | never |
| contra.com | 0/1 | empty 1 | never |
| controlchelp.freshdesk.com | 0/1 | redirect 1 | never |
| convertcalculator.com | 1/1 | ok 1 | 2026-11-23 |
| costbench.com | 1/1 | ok 1 | 2026-11-18 |
| craready.pages.dev | 1/1 | ok 1 | 2026-11-11 |
| creativehub.io | 1/1 | ok 1 | 2026-11-22 |
| creativeresources.threadless.com | 1/1 | ok 1 | 2026-11-22 |
| croner.co.uk | 1/1 | ok 1 | 2026-11-21 |
| cronitor.io | 1/1 | ok 1 | 2026-11-04 |
| crtc.gc.ca | 0/1 | http_403 1 | never |
| cseducators.stackexchange.com | 0/1 | allowlist 1 | never |
| cside.com | 1/1 | ok 1 | 2026-11-04 |
| cushionapp.com | 1/1 | ok 1 | 2026-11-18 |
| cvdportal.com | 1/1 | ok 1 | 2026-11-11 |
| data.iana.org | 1/1 | ok 1 | 2026-11-18 |
| datadryad.org | 1/1 | ok 1 | 2026-11-11 |
| ddiy.co | 1/1 | ok 1 | 2026-11-21 |
| demo.cvdportal.com | 0/1 | redirect 1 | never |
| developer.candid.org | 1/1 | ok 1 | 2026-11-07 |
| developer.nylas.com | 1/1 | ok 1 | 2026-11-18 |
| developer.service.hmrc.gov.uk | 1/1 | ok 1 | 2026-11-12 |
| developers.hubspot.com | 1/1 | ok 1 | 2026-11-18 |
| developers.mindbodyonline.com | 1/1 | ok 1 | 2026-11-23 |
| developers.openai.com | 1/1 | ok 1 | 2026-11-18 |
| discourse.datamethods.org | 0/1 | empty 1 | never |
| discuss.h5p.org | 0/1 | timeout 1 | never |
| docparser.com | 1/1 | ok 1 | 2026-11-19 |
| docs-shpf.bsscommerce.com | 1/1 | ok 1 | 2026-11-20 |
| docs.cronofy.com | 0/1 | http_404 1 | never |
| docs.hirepos.com | 1/1 | ok 1 | 2026-11-08 |
| docs.lemonsqueezy.com | 1/1 | ok 1 | 2026-11-22 |
| docs.lovable.dev | 1/1 | ok 1 | 2026-11-04 |
| docs.railway.com | 1/1 | ok 1 | 2026-11-18 |
| docs.retellai.com | 1/1 | ok 1 | 2026-11-09 |
| docs.smrtphone.io | 0/1 | redirect 1 | never |
| docs.solidtime.io | 1/1 | ok 1 | 2026-11-18 |
| docs.studiobase.org | 1/1 | ok 1 | 2026-11-18 |
| docs.withampersand.com | 1/1 | ok 1 | 2026-11-19 |
| domainmod.org | 1/1 | ok 1 | 2026-11-18 |
| donationdocket.com.au | 1/1 | ok 1 | 2026-11-07 |
| donationmanager.co.nz | 1/1 | ok 1 | 2026-11-07 |
| donorseek.com | 1/1 | ok 1 | 2026-11-07 |
| dotgolf.freshdesk.com | 0/1 | http_404 1 | never |
| doublehq.com | 1/1 | ok 1 | 2026-11-14 |
| doyleclayton.co.uk | 1/1 | ok 1 | 2026-11-21 |
| doyouok.com | 1/1 | ok 1 | 2026-11-04 |
| dwfgroup.com | 1/1 | ok 1 | 2026-11-22 |
| easyship.com | 1/1 | ok 1 | 2026-11-08 |
| ec.europa.eu | 1/1 | ok 1 | 2026-11-19 |
| ecom-tools.de | 1/1 | ok 1 | 2026-11-22 |
| economie.gouv.fr | 0/1 | http_403 1 | never |
| ecosio.com | 0/1 | http_403 1 | never |
| ecosire.com | 1/1 | ok 1 | 2026-11-03 |
| ecosystem.hubspot.com | 1/1 | ok 1 | 2026-11-23 |
| edd.ca.gov | 1/1 | ok 1 | 2026-11-21 |
| edubracket.com | 1/1 | ok 1 | 2026-11-10 |
| educationfreedom.texas.gov | 1/1 | ok 1 | 2026-11-10 |
| egazette.gov.in | 0/1 | http_5xx 1 | never |
| elementor.com | 0/1 | http_404 1 | never |
| elvanto.com | 1/1 | ok 1 | 2026-11-07 |
| emailmeter.com | 1/1 | ok 1 | 2026-11-06 |
| englandkorfball.co.uk | 1/1 | ok 1 | 2026-11-14 |
| entreprendre.service-public.gouv.fr | 1/1 | ok 1 | 2026-11-19 |
| erank.com | 1/1 | ok 1 | 2026-11-01 |
| eur-lex.europa.eu | 0/1 | empty 1 | never |
| eventrentalsystems.com | 1/1 | ok 1 | 2026-11-18 |
| everlance.com | 1/1 | ok 1 | 2026-11-06 |
| everlystastro.pages.dev | 1/1 | ok 1 | 2026-11-08 |
| evolutionplatform.poolwerx.com.au | 0/1 | redirect 1 | never |
| fazier.com | 1/1 | ok 1 | 2026-11-18 |
| feedback.beacons.ai | 0/1 | http_403 1 | never |
| feedback.picflow.com | 0/1 | http_404 1 | never |
| feedback.pixellu.com | 0/1 | redirect 1 | never |
| feedback.render.com | 1/1 | ok 1 | 2026-11-18 |
| feedback.withmoxie.com | 0/1 | http_404 1 | never |
| finitestate.io | 0/1 | timeout 1 | never |
| flowlert.com | 1/1 | ok 1 | 2026-11-04 |
| foodlabelmaker.com | 0/1 | empty 1 | never |
| foodtruckfiesta.com | 0/1 | allowlist 1 | never |
| forum.blocsapp.com | 1/1 | ok 1 | 2026-11-18 |
| forum.dolibarr.org | 0/1 | timeout 1 | never |
| forum.gnucash.org | 0/1 | empty 1 | never |
| forum.heatinghelp.com | 1/1 | ok 1 | 2026-11-13 |
| forum.image.sc | 1/1 | ok 1 | 2026-11-11 |
| forum.juce.com | 1/1 | ok 1 | 2026-11-11 |
| forum.moodle.org | 0/1 | timeout 1 | never |
| forum.odrive.com | 1/1 | ok 1 | 2026-11-18 |
| forum.openwrt.org | 0/1 | http_429 1 | never |
| forum.shopware.com | 1/1 | ok 1 | 2026-11-23 |
| forum.thirtybees.com | 1/1 | ok 1 | 2026-11-22 |
| forum.tutorcruncher.com | 0/1 | timeout 1 | never |
| forums.whirlpool.net.au | 0/1 | http_403 1 | never |
| freetier-sentinel.dev | 1/1 | ok 1 | 2026-11-18 |
| fresha.com | 1/1 | ok 1 | 2026-11-12 |
| freshlearn.com | 1/1 | ok 1 | 2026-11-08 |
| frontdeskreview.com | 1/1 | ok 1 | 2026-11-18 |
| get.popmenu.com | 0/1 | http_403 1 | never |
| getbcs.com | 1/1 | ok 1 | 2026-11-12 |
| getesapaid.com | 1/1 | ok 1 | 2026-11-10 |
| getholdings.com | 0/1 | http_404 1 | never |
| getjobber.com | 1/1 | ok 1 | 2026-11-18 |
| getsquire.com | 1/1 | ok 1 | 2026-11-12 |
| ghostinspector.com | 1/1 | ok 1 | 2026-11-03 |
| ginkoflorist.pages.dev | 1/1 | ok 1 | 2026-11-13 |
| givebutter.com | 1/1 | ok 1 | 2026-11-07 |
| givewp.com | 0/1 | redirect 1 | never |
| glossgenius.com | 1/1 | ok 1 | 2026-11-12 |
| go.appsumo.com | 1/1 | ok 1 | 2026-11-18 |
| go.ressiosoftware.com | 0/1 | http_404 1 | never |
| gofile.co.uk | 0/1 | http_403 1 | never |
| gotranscript.com | 1/1 | ok 1 | 2026-11-10 |
| governancedocs.com | 1/1 | ok 1 | 2026-11-23 |
| grad.tamu.edu | 0/1 | http_404 1 | never |
| graphene-edu.com | 1/1 | ok 1 | 2026-11-10 |
| grcsolutions.io | 1/1 | ok 1 | 2026-11-23 |
| greenleaflabs.onrender.com | 1/1 | ok 1 | 2026-11-07 |
| gymdesk.com | 1/1 | ok 1 | 2026-11-23 |
| h30434.www3.hp.com | 0/1 | http_403 1 | never |
| haflarental.com | 1/1 | ok 1 | 2026-11-18 |
| hbkcpa.com | 0/1 | redirect 1 | never |
| hbkgroup.com | 1/1 | ok 1 | 2026-11-23 |
| health.hawaii.gov | 1/1 | ok 1 | 2026-11-20 |
| healthchecks.io | 1/1 | ok 1 | 2026-11-04 |
| hello.showmojo.com | 1/1 | ok 1 | 2026-11-13 |
| help-donorfy.theaccessgroup.com | 1/1 | ok 1 | 2026-11-14 |
| help.artworkarchive.com | 1/1 | ok 1 | 2026-11-22 |
| help.buildern.com | 1/1 | ok 1 | 2026-11-23 |
| help.buildpass.ai | 1/1 | ok 1 | 2026-11-12 |
| help.ce-go.com | 1/1 | ok 1 | 2026-11-07 |
| help.cebroker.com | 0/1 | http_403 1 | never |
| help.deputy.com | 0/1 | http_403 1 | never |
| help.elvanto.com | 0/1 | http_403 1 | never |
| help.fergus.com | 1/1 | ok 1 | 2026-11-12 |
| help.gohighlevel.com | 1/1 | ok 1 | 2026-11-09 |
| help.housecallpro.com | 1/1 | ok 1 | 2026-11-13 |
| help.joinzipper.com | 1/1 | ok 1 | 2026-11-18 |
| help.landlordstudio.com | 1/1 | ok 1 | 2026-11-12 |
| help.latchel.com | 1/1 | ok 1 | 2026-11-19 |
| help.marconet.com | 1/1 | ok 1 | 2026-11-11 |
| help.outofthesandbox.com | 0/1 | http_403 1 | never |
| help.patriotsoftware.com | 1/1 | ok 1 | 2026-11-07 |
| help.pickcode.io | 1/1 | ok 1 | 2026-11-01 |
| help.productive.io | 1/1 | ok 1 | 2026-11-18 |
| help.projectworks.com | 1/1 | ok 1 | 2026-11-18 |
| help.propertymeld.com | 0/1 | http_403 1 | never |
| help.safetyculture.com | 0/1 | redirect 1 | never |
| help.shootproof.com | 0/1 | http_403 1 | never |
| help.smrtphone.io | 1/1 | ok 1 | 2026-11-09 |
| help.studioninja.co | 1/1 | ok 1 | 2026-11-08 |
| helpcenter.websitex5.com | 0/1 | http_403 1 | never |
| helpdesk.scoutsqld.com.au | 1/1 | ok 1 | 2026-11-07 |
| hia.com.au | 1/1 | ok 1 | 2026-11-23 |
| hiverhq.com | 1/1 | ok 1 | 2026-11-06 |
| honestyjar.app | 0/1 | http_5xx 1 | never |
| hookdeck.com | 1/1 | ok 1 | 2026-11-03 |
| housecallpro.com | 1/1 | ok 1 | 2026-11-13 |
| hunted.space | 1/1 | ok 1 | 2026-11-11 |
| ideas.gohighlevel.com | 1/1 | ok 1 | 2026-11-21 |
| inflowave.netlify.app | 0/1 | http_404 1 | never |
| info.adp.com | 0/1 | empty 1 | never |
| info.nookal.com | 1/1 | ok 1 | 2026-11-21 |
| insightfulaccountant.com | 1/1 | ok 1 | 2026-11-19 |
| instarenewal.com | 1/1 | ok 1 | 2026-11-18 |
| integrately.com | 1/1 | ok 1 | 2026-11-20 |
| integratestack.pages.dev | 1/1 | ok 1 | 2026-11-08 |
| invoicequickly.com | 1/1 | ok 1 | 2026-11-18 |
| invoicesherpa.com | 1/1 | ok 1 | 2026-11-19 |
| iris.co.uk | 1/1 | ok 1 | 2026-11-21 |
| is.wordpress.org | 1/1 | ok 1 | 2026-11-21 |
| itbrief.co.nz | 1/1 | ok 1 | 2026-11-20 |
| itbrief.com.au | 1/1 | ok 1 | 2026-11-19 |
| its.umich.edu | 0/1 | http_403 1 | never |
| ja.wordpress.org | 1/1 | ok 1 | 2026-11-22 |
| jentic.com | 1/1 | ok 1 | 2026-11-22 |
| jobs.mehi.masstech.org | 1/1 | ok 1 | 2026-11-07 |
| joinblvd.com | 1/1 | ok 1 | 2026-11-12 |
| jorijn.com | 0/1 | redirect 1 | never |
| jules.google | 1/1 | ok 1 | 2026-11-18 |
| karbonhq.com | 1/1 | ok 1 | 2026-11-07 |
| katanamrp.com | 1/1 | ok 1 | 2026-11-22 |
| katv.com | 1/1 | ok 1 | 2026-11-10 |
| kb.7shifts.com | 0/1 | http_403 1 | never |
| kb.drakesoftware.com | 0/1 | http_404 1 | never |
| keito.ai | 1/1 | ok 1 | 2026-11-18 |
| knowledge.workspace.google.com | 1/1 | ok 1 | 2026-11-20 |
| kourses.com | 1/1 | ok 1 | 2026-11-03 |
| krita-artists.org | 1/1 | ok 1 | 2026-11-22 |
| kulqiz.pages.dev | 1/1 | ok 1 | 2026-11-18 |
| lamaquina.studio | 1/1 | ok 1 | 2026-11-20 |
| landing-bwz.pages.dev | 1/1 | ok 1 | 2026-11-18 |
| lapaasvoice.com | 1/1 | ok 1 | 2026-11-19 |
| latexformat.netlify.app | 0/1 | http_404 1 | never |
| law.gov.wales | 0/1 | redirect 1 | never |
| leadsie.com | 1/1 | ok 1 | 2026-11-18 |
| learning.central.xero.com | 1/1 | ok 1 | 2026-11-11 |
| lectronz.com | 1/1 | ok 1 | 2026-11-11 |
| legaldocs.co.in | 0/1 | environment 1 | never |
| lemonbooking.com | 1/1 | ok 1 | 2026-11-17 |
| lenscratch.com | 1/1 | ok 1 | 2026-11-22 |
| letsmetrix.com | 1/1 | ok 1 | 2026-11-22 |
| linkfix.app | 1/1 | ok 1 | 2026-11-08 |
| lit-and-more.com | 1/1 | ok 1 | 2026-11-10 |
| litcommerce.com | 1/1 | ok 1 | 2026-11-10 |
| localline.co | 1/1 | ok 1 | 2026-11-18 |
| loopnet.ca | 0/1 | http_403 1 | never |
| lr.sudovanilla.org | 0/1 | http_404 1 | never |
| mailchimp.com | 1/1 | ok 1 | 2026-11-20 |
| mailparser.io | 1/1 | ok 1 | 2026-11-19 |
| mailroute.net | 1/1 | ok 1 | 2026-11-22 |
| marketplace.simprogroup.com | 0/1 | http_403 1 | never |
| mc.merill.net | 1/1 | ok 1 | 2026-11-11 |
| mclibrary.duke.edu | 1/1 | ok 1 | 2026-11-11 |
| mcpservers.org | 0/1 | http_403 1 | never |
| menssheds.org.uk | 1/1 | ok 1 | 2026-11-21 |
| mikellane.com | 1/1 | ok 1 | 2026-11-10 |
| mintlify.wiki | 0/1 | http_404 1 | never |
| mitti.com | 1/1 | ok 1 | 2026-11-21 |
| mjtsai.com | 1/1 | ok 1 | 2026-11-08 |
| moclaw.ai | 0/1 | empty 1 | never |
| monk.com | 1/1 | ok 1 | 2026-11-12 |
| mosscpa.com | 1/1 | ok 1 | 2026-11-07 |
| motopress.com | 0/1 | http_403 1 | never |
| mtc.gov | 1/1 | ok 1 | 2026-11-23 |
| mynews13.com | 1/1 | ok 1 | 2026-11-06 |
| myob.lithium.com | 0/1 | http_403 1 | never |
| nango.dev | 1/1 | ok 1 | 2026-11-19 |
| ndisregistrationsupport.ahpa.com.au | 0/1 | http_5xx 1 | never |
| newpathconsulting.com | 1/1 | ok 1 | 2026-11-07 |
| news.delaware.gov | 1/1 | ok 1 | 2026-11-23 |
| nextmeapp.com | 1/1 | ok 1 | 2026-11-12 |
| nodehero.io | 0/1 | timeout 1 | never |
| nonprofitlawblog.com | 1/1 | ok 1 | 2026-11-07 |
| notbyai.fyi | 1/1 | ok 1 | 2026-11-10 |
| nporesources.com | 1/1 | ok 1 | 2026-11-07 |
| nwelearn2026.sched.com | 0/1 | http_403 1 | never |
| nysenate.gov | 1/1 | ok 1 | 2026-11-23 |
| oia.pmc.gov.au | 0/1 | http_404 1 | never |
| omb.report | 1/1 | ok 1 | 2026-11-17 |
| omr.com | 1/1 | ok 1 | 2026-11-12 |
| onde.app | 1/1 | ok 1 | 2026-11-06 |
| ora.stanford.edu | 1/1 | ok 1 | 2026-11-11 |
| orchid.ganoksin.com | 1/1 | ok 1 | 2026-11-08 |
| originality.ai | 1/1 | ok 1 | 2026-11-10 |
| oxpecker.dev | 1/1 | ok 1 | 2026-11-18 |
| pagecrawl.io | 1/1 | ok 1 | 2026-11-18 |
| pages.twilio.com | 1/1 | ok 1 | 2026-11-12 |
| parseur.com | 1/1 | ok 1 | 2026-11-19 |
| partners.nicejob.com | 1/1 | ok 1 | 2026-11-20 |
| pasqualepillitteri.it | 0/1 | empty 1 | never |
| passkit.com | 1/1 | ok 1 | 2026-11-21 |
| patch.com | 1/1 | ok 1 | 2026-11-23 |
| patient-protect.com | 1/1 | ok 1 | 2026-11-20 |
| payoutcheck.online | 1/1 | ok 1 | 2026-11-06 |
| payoutpilot.pages.dev | 0/1 | empty 1 | never |
| payroller.com.au | 1/1 | ok 1 | 2026-11-16 |
| pbpatl.org | 1/1 | ok 1 | 2026-11-07 |
| peerlist.io | 0/1 | http_403 1 | never |
| peerpush.com | 1/1 | ok 1 | 2026-11-18 |
| peerpush.net | 1/1 | ok 1 | 2026-11-04 |
| peppol.org | 1/1 | ok 1 | 2026-11-21 |
| perfectbooking.co.uk | 1/1 | ok 1 | 2026-11-23 |
| petapixel.com | 0/1 | http_403 1 | never |
| pickalpaca.com | 1/1 | ok 1 | 2026-11-13 |
| pickyourapp.com | 1/1 | ok 1 | 2026-11-19 |
| policycommons.net | 0/1 | http_403 1 | never |
| polycount.com | 0/1 | http_403 1 | never |
| poolwerx.freshdesk.com | 0/1 | redirect 1 | never |
| pope.tech | 1/1 | ok 1 | 2026-11-07 |
| postmarkapp.com | 1/1 | ok 1 | 2026-11-19 |
| pricebook.digital | 1/1 | ok 1 | 2026-11-13 |
| pricingsaas.com | 1/1 | ok 1 | 2026-11-03 |
| printify.com | 1/1 | ok 1 | 2026-11-22 |
| privacytools.uk | 1/1 | ok 1 | 2026-11-23 |
| productupdates.getjobber.com | 0/1 | http_403 1 | never |
| projects.raspberrypi.org | 0/1 | empty 1 | never |
| publer.com | 1/1 | ok 1 | 2026-11-06 |
| publichealthmdc.com | 1/1 | ok 1 | 2026-11-13 |
| puppetvendors.com | 1/1 | ok 1 | 2026-11-22 |
| pushnote-azure.vercel.app | 1/1 | ok 1 | 2026-11-18 |
| pypistats.org | 1/1 | ok 1 | 2026-11-18 |
| qminder.com | 1/1 | ok 1 | 2026-11-12 |
| rct.doj.ca.gov | 0/1 | http_404 1 | never |
| rdap.org | 1/1 | ok 1 | 2026-11-18 |
| reachrightstudios.com | 1/1 | ok 1 | 2026-11-07 |
| recipal.com | 1/1 | ok 1 | 2026-11-06 |
| region.com.au | 1/1 | ok 1 | 2026-11-20 |
| remittancego.com | 1/1 | ok 1 | 2026-11-05 |
| render.discourse.group | 0/1 | http_5xx 1 | never |
| renewful.co.uk | 1/1 | ok 1 | 2026-11-22 |
| rental.software | 0/1 | empty 1 | never |
| rentmy.co | 1/1 | ok 1 | 2026-11-18 |
| research.luriechildrens.org | 1/1 | ok 1 | 2026-11-11 |
| research.ufl.edu | 0/1 | timeout 1 | never |
| reservety.com | 1/1 | ok 1 | 2026-11-18 |
| resources.github.com | 0/1 | redirect 1 | never |
| roastertools.com | 1/1 | ok 1 | 2026-11-20 |
| rootbrief.com | 1/1 | ok 1 | 2026-11-04 |
| rtl.berkeley.edu | 1/1 | ok 1 | 2026-11-01 |
| rules.cityofnewyork.us | 1/1 | ok 1 | 2026-11-23 |
| sage.hr | 0/1 | http_403 1 | never |
| salepager.com | 1/1 | ok 1 | 2026-11-10 |
| salesmessage.com | 1/1 | ok 1 | 2026-11-20 |
| salisbury.anglican.org | 1/1 | ok 1 | 2026-11-14 |
| sandtime.io | 1/1 | ok 1 | 2026-11-18 |
| satvasolutions.com | 1/1 | ok 1 | 2026-11-14 |
| sbirland.com | 1/1 | ok 1 | 2026-11-11 |
| sc-ctsi.org | 0/1 | http_404 1 | never |
| schedulingkit.com | 1/1 | ok 1 | 2026-11-18 |
| scispace.com | 0/1 | http_403 1 | never |
| senderz-website.pages.dev | 1/1 | ok 1 | 2026-11-04 |
| sendstatus.co | 0/1 | http_5xx 1 | never |
| senedd.wales | 1/1 | ok 1 | 2026-11-23 |
| serchen.com | 0/1 | http_403 1 | never |
| services.maps.cdtfa.ca.gov | 1/1 | ok 1 | 2026-11-23 |
| shiptheory.com | 1/1 | ok 1 | 2026-11-22 |
| sickgaming.net | 1/1 | ok 1 | 2026-11-22 |
| sift-health.pages.dev | 1/1 | ok 1 | 2026-11-02 |
| silktide.com | 1/1 | ok 1 | 2026-11-07 |
| simply-docs.co.uk | 1/1 | ok 1 | 2026-11-23 |
| simplyk.canny.io | 1/1 | ok 1 | 2026-11-21 |
| smythmyke.github.io | 1/1 | ok 1 | 2026-11-15 |
| speechpathologyaustralia.org.au | 1/1 | ok 1 | 2026-11-21 |
| spendwall.app | 1/1 | ok 1 | 2026-11-18 |
| spiromedia.featurebase.app | 1/1 | ok 1 | 2026-11-22 |
| sport.nspcc.org.uk | 1/1 | ok 1 | 2026-11-14 |
| sproutinvoices.com | 1/1 | ok 1 | 2026-11-18 |
| static.developer.intuit.com | 1/1 | ok 1 | 2026-11-19 |
| strapi.io | 1/1 | ok 1 | 2026-11-18 |
| streetfoodfinder.com | 0/1 | http_403 1 | never |
| studioformakers.pages.dev | 1/1 | ok 1 | 2026-11-22 |
| support.approvalmax.com | 1/1 | ok 1 | 2026-11-14 |
| support.banqup.com | 1/1 | ok 1 | 2026-11-20 |
| support.centroassist.com.au | 0/1 | http_403 1 | never |
| support.churchsuite.com | 0/1 | http_403 1 | never |
| support.glofox.com | 0/1 | http_403 1 | never |
| support.gocardless.com | 1/1 | ok 1 | 2026-11-20 |
| support.patreon.com | 0/1 | http_403 1 | never |
| support.punchpass.com | 1/1 | ok 1 | 2026-11-18 |
| support.saasant.com | 1/1 | ok 1 | 2026-11-05 |
| support.smoobu.com | 0/1 | http_403 1 | never |
| support.splose.com | 0/1 | http_404 1 | never |
| support.squarespace.com | 1/1 | ok 1 | 2026-11-22 |
| support.taxcloud.com | 0/1 | http_404 1 | never |
| support.wildapricot.com | 0/1 | http_403 1 | never |
| support.wix.com | 1/1 | ok 1 | 2026-11-20 |
| support.wrkr.com.au | 0/1 | http_403 1 | never |
| swiftaid.co.uk | 1/1 | ok 1 | 2026-11-14 |
| sylvanassurance.pages.dev | 0/1 | http_404 1 | never |
| systemforce.co.uk | 1/1 | ok 1 | 2026-11-23 |
| tasks.mechanic.dev | 1/1 | ok 1 | 2026-11-18 |
| taxation-customs.ec.europa.eu | 1/1 | ok 1 | 2026-11-22 |
| teachshare.com | 0/1 | empty 1 | never |
| teachworks.com | 1/1 | ok 1 | 2026-11-19 |
| teachworks.featureupvote.com | 0/1 | http_403 1 | never |
| teamsuper.com | 1/1 | ok 1 | 2026-11-16 |
| techcrunch.com | 1/1 | ok 1 | 2026-11-04 |
| techintelpro.com | 1/1 | ok 1 | 2026-11-19 |
| texas.support.withodyssey.com | 0/1 | http_403 1 | never |
| thecut.co | 1/1 | ok 1 | 2026-11-12 |
| thenewflatrate.com | 1/1 | ok 1 | 2026-11-13 |
| theprintspace.co.uk | 1/1 | ok 1 | 2026-11-22 |
| theproducenews.com | 0/1 | http_403 1 | never |
| theseoteacher.com.au | 1/1 | ok 1 | 2026-11-10 |
| thirtyoneeight.org | 1/1 | ok 1 | 2026-11-14 |
| tidyhq.com | 1/1 | ok 1 | 2026-11-14 |
| tilt.colostate.edu | 1/1 | ok 1 | 2026-11-01 |
| todaysveterinarybusiness.com | 1/1 | ok 1 | 2026-11-20 |
| tonsofskills.com | 1/1 | ok 1 | 2026-11-18 |
| topaihubs.com | 1/1 | ok 1 | 2026-11-18 |
| tothecent.app | 1/1 | ok 1 | 2026-11-05 |
| trinket.io | 1/1 | ok 1 | 2026-11-01 |
| trippz.com | 1/1 | ok 1 | 2026-11-23 |
| truckspotting.com | 0/1 | http_5xx 1 | never |
| trucktrax.com | 0/1 | empty 1 | never |
| truto.one | 1/1 | ok 1 | 2026-11-19 |
| tutorlms.com | 1/1 | ok 1 | 2026-11-03 |
| uc3.cdlib.org | 1/1 | ok 1 | 2026-11-11 |
| ucsb-ds.github.io | 1/1 | ok 1 | 2026-11-01 |
| uk.grcsolutions.io | 0/1 | redirect 1 | never |
| unpwned.io | 1/1 | ok 1 | 2026-11-04 |
| updates.pushpress.com | 1/1 | ok 1 | 2026-11-23 |
| upflow.io | 1/1 | ok 1 | 2026-11-19 |
| useauteur.com | 1/1 | ok 1 | 2026-11-23 |
| usehammock.com | 1/1 | ok 1 | 2026-11-19 |
| useitlonger.com | 1/1 | ok 1 | 2026-11-11 |
| usemechanic.com | 0/1 | redirect 1 | never |
| userway.org | 1/1 | ok 1 | 2026-11-07 |
| vagaro.com | 1/1 | ok 1 | 2026-11-12 |
| vakilsearch.com | 0/1 | http_403 1 | never |
| valueaddedresource.net | 1/1 | ok 1 | 2026-11-08 |
| vatcalc.com | 0/1 | http_403 1 | never |
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
| waamh.org.au | 1/1 | ok 1 | 2026-11-21 |
| waitlist.me | 1/1 | ok 1 | 2026-11-12 |
| waitlistping.com | 1/1 | ok 1 | 2026-11-20 |
| waitwhile.com | 1/1 | ok 1 | 2026-11-12 |
| wave.webaim.org | 1/1 | ok 1 | 2026-11-07 |
| waveapps.vanillacommunities.com | 0/1 | allowlist 1 | never |
| williamsrecord.com | 0/1 | http_403 1 | never |
| windes.com | 0/1 | http_403 1 | never |
| wisdmlabs.com | 1/1 | ok 1 | 2026-11-10 |
| wooninjas.com | 1/1 | ok 1 | 2026-11-21 |
| workpingapp.vercel.app | 1/1 | ok 1 | 2026-11-18 |
| wp-umbrella.com | 1/1 | ok 1 | 2026-11-18 |
| wtb.wa.gov | 1/1 | ok 1 | 2026-11-21 |
| www.1-fix.com | 1/1 | ok 1 | 2026-11-11 |
| www.1099online.com | 1/1 | ok 1 | 2026-11-14 |
| www.accountable.de | 1/1 | ok 1 | 2026-11-11 |
| www.ada.org | 0/1 | empty 1 | never |
| www.adaptive.build | 1/1 | ok 1 | 2026-11-23 |
| www.adlercolvin.com | 1/1 | ok 1 | 2026-11-07 |
| www.afslaw.com | 1/1 | ok 1 | 2026-11-23 |
| www.agensi.io | 1/1 | ok 1 | 2026-11-22 |
| www.aiaworldwide.com | 1/1 | ok 1 | 2026-11-21 |
| www.alignable.com | 1/1 | ok 1 | 2026-11-18 |
| www.alternativeto.net | 0/1 | http_403 1 | never |
| www.ambrite.ca | 1/1 | ok 1 | 2026-11-18 |
| www.americansalon.com | 0/1 | http_403 1 | never |
| www.apideck.com | 1/1 | ok 1 | 2026-11-23 |
| www.applytosupply.digitalmarketplace.service.gov.uk | 0/1 | http_404 1 | never |
| www.approvalmax.com | 1/1 | ok 1 | 2026-11-14 |
| www.arcual.com | 1/1 | ok 1 | 2026-11-22 |
| www.arkansasonline.com | 1/1 | ok 1 | 2026-11-10 |
| www.arketa.com | 1/1 | ok 1 | 2026-11-18 |
| www.asset.accountant | 0/1 | empty 1 | never |
| www.aucklandanglican.org.nz | 1/1 | ok 1 | 2026-11-07 |
| www.audioeye.com | 1/1 | ok 1 | 2026-11-07 |
| www.australiansuper.com | 0/1 | http_403 1 | never |
| www.avaza.com | 1/1 | ok 1 | 2026-11-18 |
| www.azed.gov | 0/1 | http_403 1 | never |
| www.banterspeech.com.au | 1/1 | ok 1 | 2026-11-21 |
| www.barnesdennig.com | 1/1 | ok 1 | 2026-11-07 |
| www.beveragedaily.com | 1/1 | ok 1 | 2026-11-12 |
| www.bigcartel.com | 1/1 | ok 1 | 2026-11-22 |
| www.bigcommerce.com | 1/1 | ok 1 | 2026-11-22 |
| www.bluehost.com | 0/1 | http_403 1 | never |
| www.booker-app.com | 1/1 | ok 1 | 2026-11-23 |
| www.boomeranggmail.com | 1/1 | ok 1 | 2026-11-06 |
| www.business.gov.uk | 1/1 | ok 1 | 2026-11-21 |
| www.businesswire.com | 0/1 | http_403 1 | never |
| www.calxa.com | 1/1 | ok 1 | 2026-11-14 |
| www.canberratimes.com.au | 0/1 | http_403 1 | never |
| www.canyou.com.au | 1/1 | ok 1 | 2026-11-17 |
| www.capium.com | 1/1 | ok 1 | 2026-11-21 |
| www.captaindns.com | 1/1 | ok 1 | 2026-11-11 |
| www.capterra.com.au | 0/1 | http_403 1 | never |
| www.careerbuilder.com | 0/1 | http_403 1 | never |
| www.castanet.net | 0/1 | http_403 1 | never |
| www.ccjdigital.com | 0/1 | http_403 1 | never |
| www.cda.org | 1/1 | ok 1 | 2026-11-07 |
| www.cdlpowersuite.com | 1/1 | ok 1 | 2026-11-17 |
| www.ce-go.com | 1/1 | ok 1 | 2026-11-10 |
| www.chalkbeat.org | 1/1 | ok 1 | 2026-11-10 |
| www.chaponline.com | 1/1 | ok 1 | 2026-11-10 |
| www.charliehr.com | 1/1 | ok 1 | 2026-11-21 |
| www.chaserhq.com | 1/1 | ok 1 | 2026-11-19 |
| www.chcanys.org | 1/1 | ok 1 | 2026-11-07 |
| www.chift.eu | 1/1 | ok 1 | 2026-11-23 |
| www.chronicle.com | 0/1 | http_403 1 | never |
| www.cipp.org.uk | 1/1 | ok 1 | 2026-11-12 |
| www.cisa.gov | 1/1 | ok 1 | 2026-11-11 |
| www.clarkhill.com | 1/1 | ok 1 | 2026-11-06 |
| www.classcentral.com | 0/1 | http_403 1 | never |
| www.cleanlink.com | 1/1 | ok 1 | 2026-11-20 |
| www.clearbooks.co.uk | 1/1 | ok 1 | 2026-11-12 |
| www.cliniko.com | 1/1 | ok 1 | 2026-11-21 |
| www.compatshield.com | 1/1 | ok 1 | 2026-11-04 |
| www.contractormag.com | 1/1 | ok 1 | 2026-11-20 |
| www.contractortalk.com | 0/1 | redirect 1 | never |
| www.controlc.com | 0/1 | http_5xx 1 | never |
| www.convertcalculator.com | 1/1 | ok 1 | 2026-11-20 |
| www.cookiebot.com | 1/1 | ok 1 | 2026-11-02 |
| www.cookiehub.com | 1/1 | ok 1 | 2026-11-23 |
| www.cookieyes.com | 1/1 | ok 1 | 2026-11-02 |
| www.copytechnet.com | 1/1 | ok 1 | 2026-11-11 |
| www.coupler.io | 1/1 | ok 1 | 2026-11-18 |
| www.craftybase.com | 0/1 | redirect 1 | never |
| www.credas.com | 0/1 | http_403 1 | never |
| www.cripps.co.uk | 1/1 | ok 1 | 2026-11-21 |
| www.cs.umd.edu | 0/1 | http_5xx 1 | never |
| www.csc.gov.au | 0/1 | http_403 1 | never |
| www.ctvnews.ca | 0/1 | empty 1 | never |
| www.dailycal.org | 0/1 | http_403 1 | never |
| www.dentaleconomics.com | 1/1 | ok 1 | 2026-11-20 |
| www.dentaltown.com | 1/1 | ok 1 | 2026-11-23 |
| www.deque.com | 0/1 | http_404 1 | never |
| www.digismoothie.com | 1/1 | ok 1 | 2026-11-08 |
| www.digitalcommerce360.com | 0/1 | http_403 1 | never |
| www.digitaltransactions.net | 1/1 | ok 1 | 2026-11-20 |
| www.diyphotography.net | 0/1 | empty 1 | never |
| www.dli.pa.gov | 0/1 | redirect 1 | never |
| www.donorfy.com | 1/1 | ok 1 | 2026-11-14 |
| www.dor.wa.gov | 1/1 | ok 1 | 2026-11-02 |
| www.drbicuspid.com | 0/1 | http_403 1 | never |
| www.duanemorris.com | 1/1 | ok 1 | 2026-11-07 |
| www.dwt.com | 0/1 | http_403 1 | never |
| www.ebnerstolz.de | 1/1 | ok 1 | 2026-11-22 |
| www.ecclesiastical.com | 1/1 | ok 1 | 2026-11-17 |
| www.ecfr.gov | 0/1 | redirect 1 | never |
| www.engadget.com | 1/1 | ok 1 | 2026-11-08 |
| www.enisa.europa.eu | 1/1 | ok 1 | 2026-11-11 |
| www.epa.gov | 1/1 | ok 1 | 2026-11-20 |
| www.erp-recycling.org | 0/1 | empty 1 | never |
| www.euronews.com | 1/1 | ok 1 | 2026-11-22 |
| www.evri.com | 1/1 | ok 1 | 2026-11-22 |
| www.expenseplus.co.uk | 1/1 | ok 1 | 2026-11-14 |
| www.experian.com | 1/1 | ok 1 | 2026-11-07 |
| www.facebook.com | 1/1 | ok 1 | 2026-11-06 |
| www.faegredrinker.com | 1/1 | ok 1 | 2026-11-20 |
| www.feinberg.northwestern.edu | 1/1 | ok 1 | 2026-11-11 |
| www.feldesman.com | 1/1 | ok 1 | 2026-11-07 |
| www.flsenate.gov | 1/1 | ok 1 | 2026-11-10 |
| www.fnbnews.com | 0/1 | http_5xx 1 | never |
| www.followupthen.com | 0/1 | http_5xx 1 | never |
| www.fooddocs.com | 1/1 | ok 1 | 2026-11-13 |
| www.fourlane.com | 1/1 | ok 1 | 2026-11-07 |
| www.freeagent.com | 1/1 | ok 1 | 2026-11-12 |
| www.freelancer.de | 1/1 | ok 1 | 2026-11-10 |
| www.freeonlinebooking.com | 1/1 | ok 1 | 2026-11-23 |
| www.freightwaves.com | 1/1 | ok 1 | 2026-11-17 |
| www.fresha.com | 1/1 | ok 1 | 2026-11-20 |
| www.freshbooks.com | 1/1 | ok 1 | 2026-11-22 |
| www.freshfields.com | 1/1 | ok 1 | 2026-11-22 |
| www.g2.com | 0/1 | http_403 1 | never |
| www.getapp.co.uk | 0/1 | http_403 1 | never |
| www.getapp.com.au | 0/1 | http_403 1 | never |
| www.getclockwise.com | 1/1 | ok 1 | 2026-11-19 |
| www.getly.store | 1/1 | ok 1 | 2026-11-10 |
| www.github.com | 1/1 | ok 1 | 2026-11-07 |
| www.grammarly.com | 1/1 | ok 1 | 2026-11-10 |
| www.gwynedd.llyw.cymru | 1/1 | ok 1 | 2026-11-23 |
| www.haendlerbund.de | 1/1 | ok 1 | 2026-11-22 |
| www.hallmaster.co.uk | 0/1 | timeout 1 | never |
| www.harborcompliance.com | 1/1 | ok 1 | 2026-11-07 |
| www.hcamag.com | 1/1 | ok 1 | 2026-11-21 |
| www.healthclubmanagement.co.uk | 1/1 | ok 1 | 2026-11-20 |
| www.hostaway.com | 1/1 | ok 1 | 2026-11-23 |
| www.housecallpro.com | 1/1 | ok 1 | 2026-11-06 |
| www.hsfkramer.com | 0/1 | http_403 1 | never |
| www.hudu.com | 1/1 | ok 1 | 2026-11-18 |
| www.hvac-talk.com | 0/1 | redirect 1 | never |
| www.hvacrschool.com | 1/1 | ok 1 | 2026-11-20 |
| www.ifpti.org | 1/1 | ok 1 | 2026-11-13 |
| www.ihk.de | 0/1 | http_403 1 | never |
| www.indiafilings.com | 1/1 | ok 1 | 2026-11-23 |
| www.indiehackers.com | 0/1 | http_403 1 | never |
| www.insightagent.app | 1/1 | ok 1 | 2026-11-15 |
| www.instarenewal.com | 1/1 | ok 1 | 2026-11-18 |
| www.insurance.wa.gov | 1/1 | ok 1 | 2026-11-21 |
| www.it-recht-kanzlei.de | 1/1 | ok 1 | 2026-11-22 |
| www.itgovernance.co.uk | 0/1 | redirect 1 | never |
| www.itv.com | 0/1 | http_5xx 1 | never |
| www.jibble.io | 1/1 | ok 1 | 2026-11-06 |
| www.just-drinks.com | 1/1 | ok 1 | 2026-11-12 |
| www.khaitanco.com | 1/1 | ok 1 | 2026-11-23 |
| www.kimai.org | 1/1 | ok 1 | 2026-11-18 |
| www.klaviyo.com | 1/1 | ok 1 | 2026-11-20 |
| www.klgates.com | 1/1 | ok 1 | 2026-11-22 |
| www.krowdbase.com | 0/1 | http_403 1 | never |
| www.landlordstudio.com | 1/1 | ok 1 | 2026-11-19 |
| www.lbc.co.uk | 1/1 | ok 1 | 2026-11-17 |
| www.ldi.la.gov | 0/1 | http_403 1 | never |
| www.legal500.com | 1/1 | ok 1 | 2026-11-07 |
| www.legalwiz.in | 1/1 | ok 1 | 2026-11-23 |
| www.legis.iowa.gov | 1/1 | ok 1 | 2026-11-23 |
| www.lethub.co | 1/1 | ok 1 | 2026-11-13 |
| www.levelaccess.com | 0/1 | http_404 1 | never |
| www.lewissilkin.com | 1/1 | ok 1 | 2026-11-22 |
| www.liquidweb.com | 1/1 | ok 1 | 2026-11-07 |
| www.litrg.org.uk | 0/1 | http_403 1 | never |
| www.littler.com | 1/1 | ok 1 | 2026-11-21 |
| www.loffler.com | 1/1 | ok 1 | 2026-11-11 |
| www.lovingly.com | 0/1 | redirect 1 | never |
| www.makeinfluence.com | 1/1 | ok 1 | 2026-11-15 |
| www.mediabistro.com | 1/1 | ok 1 | 2026-11-07 |
| www.microns.io | 1/1 | ok 1 | 2026-11-07 |
| www.mindbodyonline.com | 0/1 | empty 1 | never |
| www.minterellison.com | 0/1 | http_403 1 | never |
| www.mintlify.com | 0/1 | http_404 1 | never |
| www.mitti.com | 1/1 | ok 1 | 2026-11-13 |
| www.modernsalon.com | 1/1 | ok 1 | 2026-11-20 |
| www.mondaq.com | 1/1 | ok 1 | 2026-11-02 |
| www.moovs.app | 0/1 | allowlist 1 | never |
| www.mumsnet.com | 1/1 | ok 1 | 2026-11-08 |
| www.myaifrontdesk.com | 1/1 | ok 1 | 2026-11-19 |
| www.myhr.works | 1/1 | ok 1 | 2026-11-21 |
| www.myschoolyear.com | 0/1 | http_403 1 | never |
| www.nachc.org | 1/1 | ok 1 | 2026-11-07 |
| www.nasaa.org | 1/1 | ok 1 | 2026-11-21 |
| www.nationgraph.com | 0/1 | http_404 1 | never |
| www.nccommunitycolleges.edu | 1/1 | ok 1 | 2026-11-07 |
| www.ncrla.org | 1/1 | ok 1 | 2026-11-13 |
| www.ndis.gov.au | 0/1 | http_403 1 | never |
| www.nds.org.au | 0/1 | http_404 1 | never |
| www.ndsmcobserver.com | 0/1 | http_403 1 | never |
| www.niaid.nih.gov | 1/1 | ok 1 | 2026-11-11 |
| www.nigms.nih.gov | 1/1 | ok 1 | 2026-11-11 |
| www.nysenate.gov | 1/1 | ok 1 | 2026-11-06 |
| www.onlinelabels.com | 1/1 | ok 1 | 2026-11-06 |
| www.onpay.com | 1/1 | ok 1 | 2026-11-07 |
| www.ontario.ca | 0/1 | http_403 1 | never |
| www.ordermentum.com | 1/1 | ok 1 | 2026-11-20 |
| www.osiaffiliate.com | 0/1 | http_404 1 | never |
| www.passcreator.com | 1/1 | ok 1 | 2026-11-21 |
| www.patreon.com | 0/1 | http_403 1 | never |
| www.paubox.com | 1/1 | ok 1 | 2026-11-21 |
| www.payhelm.com | 1/1 | ok 1 | 2026-11-15 |
| www.paylocity.com | 0/1 | empty 1 | never |
| www.peterborough-diocese.org.uk | 0/1 | http_404 1 | never |
| www.phaa.org | 1/1 | ok 1 | 2026-11-10 |
| www.plinth.org.uk | 1/1 | ok 1 | 2026-11-14 |
| www.pmlawyers.com.au | 1/1 | ok 1 | 2026-11-21 |
| www.praxikon.com | 1/1 | ok 1 | 2026-11-17 |
| www.pulse.bot | 0/1 | http_5xx 1 | never |
| www.punchpass.com | 1/1 | ok 1 | 2026-11-18 |
| www.quo.com | 1/1 | ok 1 | 2026-11-06 |
| www.reportpundit.com | 1/1 | ok 1 | 2026-11-15 |
| www.respira.press | 1/1 | ok 1 | 2026-11-11 |
| www.restaurantdive.com | 1/1 | ok 1 | 2026-11-20 |
| www.restaurantonline.co.uk | 1/1 | ok 1 | 2026-11-16 |
| www.ru.nl | 0/1 | http_5xx 1 | never |
| www.saashub.com | 0/1 | http_403 1 | never |
| www.saastr.com | 1/1 | ok 1 | 2026-11-23 |
| www.saasworthy.com | 0/1 | http_403 1 | never |
| www.sandiegocounty.gov | 0/1 | http_5xx 1 | never |
| www.selfemployed.com | 1/1 | ok 1 | 2026-11-08 |
| www.sellersasksellers.com | 1/1 | ok 1 | 2026-11-22 |
| www.servicem8.com | 1/1 | ok 1 | 2026-11-20 |
| www.sharp.net.nz | 1/1 | ok 1 | 2026-11-11 |
| www.shopping-cart-migration.com | 0/1 | http_403 1 | never |
| www.silicon.co.uk | 1/1 | ok 1 | 2026-11-18 |
| www.simprogroup.com | 0/1 | http_403 1 | never |
| www.singletouch.com.au | 1/1 | ok 1 | 2026-11-16 |
| www.siteground.com | 0/1 | http_404 1 | never |
| www.siteimprove.com | 1/1 | ok 1 | 2026-11-07 |
| www.skadden.com | 1/1 | ok 1 | 2026-11-23 |
| www.skynettechnologies.com | 1/1 | ok 1 | 2026-11-23 |
| www.slrlounge.com | 1/1 | ok 1 | 2026-11-08 |
| www.smartcompany.com.au | 1/1 | ok 1 | 2026-11-20 |
| www.smartsense.co | 1/1 | ok 1 | 2026-11-13 |
| www.smoobu.com | 0/1 | http_404 1 | never |
| www.softwareadvice.co.uk | 0/1 | http_403 1 | never |
| www.solidtime.io | 1/1 | ok 1 | 2026-11-18 |
| www.springlex.eu | 0/1 | empty 1 | never |
| www.startupdaily.net | 1/1 | ok 1 | 2026-11-07 |
| www.strato.de | 1/1 | ok 1 | 2026-11-22 |
| www.subnotice.com | 1/1 | ok 1 | 2026-11-22 |
| www.supportability.com.au | 1/1 | ok 1 | 2026-11-21 |
| www.tablesready.com | 1/1 | ok 1 | 2026-11-12 |
| www.tax1099.com | 0/1 | http_404 1 | never |
| www.tenantturner.com | 1/1 | ok 1 | 2026-11-13 |
| www.thankyoupayroll.co.nz | 1/1 | ok 1 | 2026-11-14 |
| www.the-standard.org | 1/1 | ok 1 | 2026-11-01 |
| www.themarysue.com | 1/1 | ok 1 | 2026-11-23 |
| www.thetruckersreport.com | 1/1 | ok 1 | 2026-11-17 |
| www.thomsonreuters.com | 1/1 | ok 1 | 2026-11-07 |
| www.threads.com | 1/1 | ok 1 | 2026-11-22 |
| www.timecamp.com | 1/1 | ok 1 | 2026-11-18 |
| www.tlt.com | 1/1 | ok 1 | 2026-11-22 |
| www.transact-tech.com | 1/1 | ok 1 | 2026-11-06 |
| www.tropicapp.io | 1/1 | ok 1 | 2026-11-23 |
| www.truckinginfo.com | 1/1 | ok 1 | 2026-11-17 |
| www.turbotenant.com | 1/1 | ok 1 | 2026-11-13 |
| www.tutkit.com | 1/1 | ok 1 | 2026-11-22 |
| www.txtimpact.com | 1/1 | ok 1 | 2026-11-09 |
| www.ukhospitality.org.uk | 1/1 | ok 1 | 2026-11-21 |
| www.uplisting.io | 1/1 | ok 1 | 2026-11-23 |
| www.uptimerobot.com | 1/1 | ok 1 | 2026-11-18 |
| www.uptimia.com | 1/1 | ok 1 | 2026-11-03 |
| www.usehammock.com | 1/1 | ok 1 | 2026-11-12 |
| www.usitc.gov | 0/1 | http_403 1 | never |
| www.usps.com | 1/1 | ok 1 | 2026-11-22 |
| www.uvic.ca | 1/1 | ok 1 | 2026-11-21 |
| www.vatcalc.com | 0/1 | http_403 1 | never |
| www.vinetur.com | 1/1 | ok 1 | 2026-11-23 |
| www.wales247.co.uk | 1/1 | ok 1 | 2026-11-23 |
| www.webull.com | 1/1 | ok 1 | 2026-11-10 |
| www.whitecase.com | 0/1 | http_403 1 | never |
| www.wxxinews.org | 1/1 | ok 1 | 2026-11-06 |
| www.xenia.team | 1/1 | ok 1 | 2026-11-13 |
| www.zapier.com | 1/1 | ok 1 | 2026-11-19 |
| www.zbrushcentral.com | 0/1 | empty 1 | never |
| www.zenstores.com | 1/1 | ok 1 | 2026-11-22 |
| www.zoho.com | 1/1 | ok 1 | 2026-11-06 |
| www2.gov.bc.ca | 1/1 | ok 1 | 2026-11-19 |
| xdaforums.com | 0/1 | http_403 1 | never |
| xero.com | 1/1 | ok 1 | 2026-11-08 |
| zapiet.com | 1/1 | ok 1 | 2026-11-13 |
| zeffy.com | 1/1 | ok 1 | 2026-11-21 |
| zeitride.com | 1/1 | ok 1 | 2026-11-06 |
| zenler.canny.io | 1/1 | ok 1 | 2026-11-22 |
| zenplanner.com | 1/1 | ok 1 | 2026-11-23 |
| ziphaccp.com | 0/1 | http_404 1 | never |
| zmartly.co.uk | 1/1 | ok 1 | 2026-11-12 |
| zoom.us | 1/1 | ok 1 | 2026-11-10 |

## Where candidates die

| Gate condition | Candidates lost |
|---|---|
| totalBelowMin | 489 |
| rejectRule | 90 |
| reviewKill | 61 |
| painBelow4 | 3 |
| noRecentEvidence | 2 |
| evidenceCountBelow2 | 0 |
| noComplaintEvidence | 0 |
| unverifiedEvidence | 0 |
| wtpBelow3 | 0 |

The largest row is the one to argue about before changing anything else.

## Funnel over the window

candidates 658 -> passedRejectRules 568 -> passedGate 13 -> reviewKilled 61 -> validated 1 -> provisional 75 -> watchlist 73

## Runs that produced nothing

- `2026-10-30#1`: Thesis Deposit Preflight was the one candidate to clear the gate at 23. The adversarial reviewer rescored it to 17 and the no-backfill rule forbade researching the next candidate down, so the day ended at zero. The rule, not the evidence, produced the empty file.
- `2026-10-31#1`: Best candidate was Orphaned Embed Rescue at 21, one point under the gate of 22, held back by free replacements and a one-time migration need. With no provisional tier the run had no way to ship its best candidate. Saturday's focus sources (RFP portals, job postings) mostly surfaced enterprise solicitations that the no-procurement rejection rule kills by construction.
- `2026-10-31#2`: A8 yielded nothing because Reddit is unreachable, so a quarter of the run's source budget was spent on a dead source the morning run had already found dead. The strongest signal, the end of Canvas Free-for-Teacher, is already served by free Canvas Lite and ProfDesk.
- `2026-10-31#3`: Fresh Canvas pain was either already served (Atomic Search sells account-wide Find and Replace) or bound up with minors' data. EdSurge, EdWeek Market Brief and pulse.bot returned no usable October 2026 content through WebFetch.
- `2026-11-04#3`: Two separate limits stopped this run. (1) The day already held 4 provisional ideas, the cap in ROUTINE.md and validate_ideas.py (MAX_PROVISIONAL), so a third run on the same day can only ship validated ideas. (2) No candidate came near the gate of 22: the best two were rescored by reviewers from 18 and 16 to 14. Without the cap, neither would have shipped as validated either. The cap makes any third same-day run unable to add provisional ideas, so the routine should either stop extra runs once the cap is reached or count the cap per run.

A run producing nothing is a routine bug, not a quiet day. Each line above is one to fix.

## Catalog disagrees with the log

- **A1 LMS idea boards**: catalog says `blocked`, the log says `reachable` (2 usable fetches in the window). Update `ideas/sources.json` by hand.
- **B5 Acquisition marketplaces**: catalog says `blocked`, the log says `reachable` (4 usable fetches in the window). Update `ideas/sources.json` by hand.
- **C3 Procurement and RFP portals**: catalog says `ok-curl`, the log says `blocked` (5 attempts in the window, none usable). Update `ideas/sources.json` by hand.

