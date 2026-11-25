# Source health

Generated 2026-11-25 from the last 45 days of `ideas/run-log.jsonl` (35 runs). Do not edit by hand: regenerate with `python3 scripts/source_health.py`.

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
| A16 Vendor feature-request boards | complaint | ok-curl | 26 | `curl: https://productideas.xero.com/search?query={q}` |
| A13 Discourse forums, any niche | complaint | ok | 20 | `webfetch: https://{host}/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| C5 Policy and regulation trackers | mandate | ok | 15 | `webfetch: https://www.federalregister.gov/api/v1/documents.json?per_page=10&order=newest&conditions[term]={q}` |
| B12 Paid app marketplaces | spend | ok | 14 | `curl: https://apps.shopify.com/{slug}/reviews?ratings%5B%5D=1&ratings%5B%5D=2&sort_by=newest` |
| C10 Change events: shutdowns, price rises, removed free tiers | mandate | ok | 9 | no verified path |
| B11 Freelance job boards | spend | ok | 7 | `webfetch: https://www.freelancer.com/api/projects/0.1/projects/active/?query={q}&limit=20&full_description=true` |
| C8 Trade news | mandate | ok-curl | 5 | `curl: https://www.edsurge.com/news` |
| A14 Plugin and add-on support forums | complaint | ok | 4 | `webfetch: https://wordpress.org/support/plugin/{slug}/` |
| A12 Ask HN and HN comments | complaint | ok | 3 | `webfetch: https://hn.algolia.com/api/v1/search_by_date?query={q}&tags=comment&hitsPerPage=20` |
| A3 Open-source teaching tools | complaint | ok | 3 | `curl: https://api.github.com/search/issues?q={q}+is%3Aissue+state%3Aopen+sort%3Areactions&per_page=10` |
| A11 Accessibility practitioners | complaint | ok-curl | 2 | `webfetch: https://webaim.org/discussion/archives` |
| A15 No-code automation communities | complaint | ok | 2 | `webfetch: https://community.make.com/search.json?q={q}+after%3A{YYYY-MM-DD}` |
| A5 Educator Stack Exchanges | complaint | ok-curl | 2 | `curl: https://api.stackexchange.com/2.3/questions?site={cseducators|academia|matheducators}&order=desc&sort=creation&pagesize=20&filter=withbody` |
| B1 Teachers Pay Teachers and Etsy | spend | ok | 2 | `webfetch: https://www.teacherspayteachers.com/Browse/Search:{q}` |
| B9 Freelance build requests | spend | ok-curl | 1 | `curl: https://www.freelancer.com/api/projects/0.1/projects/active/?query={q}&limit=20&full_description=true` |
| A2 Other LMS and classroom forums | complaint | ok | 0 | `webfetch: https://discuss.openedx.org/latest.json` |
| A6 Edtech app and extension reviews | complaint | ok-curl | 0 | `webfetch: https://chromewebstore.google.com/detail/{slug}/{id}/reviews` |
| B10 WordPress plugin market data | spend | ok | 0 | `webfetch: https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]={q}&request[per_page]=10` |
| B2 AppSumo | spend | ok | 0 | `webfetch: https://appsumo.com/software/{category}/` |
| B6 Verified revenue dashboards | spend | ok-curl | 0 | `curl: https://trustmrr.com/` |
| B8 Install counts for paid add-ons | spend | ok-curl | 0 | `curl: https://chromewebstore.google.com/detail/{id}` |
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
| www.freelancer.com | 757/808 | empty 51, ok 757 | 2026-11-25 |
| community.shopify.com | 481/529 | empty 30, http_404 1, http_429 17, ok 481 | 2026-11-23 |
| apps.shopify.com | 388/460 | empty 48, http_404 22, ok 388, redirect 2 | 2026-11-25 |
| hn.algolia.com | 296/349 | empty 53, ok 296 | 2026-11-25 |
| community.squareup.com | 270/336 | empty 59, http_404 4, http_5xx 3, ok 270 | 2026-11-23 |
| productideas.xero.com | 294/310 | empty 12, http_404 2, ok 294, redirect 2 | 2026-11-24 |
| wordpress.org | 206/209 | empty 1, http_404 2, ok 206 | 2026-11-25 |
| api.github.com | 96/137 | empty 15, http_403 20, http_404 5, http_5xx 1, ok 96 | 2026-11-25 |
| community.n8n.io | 112/113 | empty 1, ok 112 | 2026-11-24 |
| squareup.com | 62/98 | empty 2, http_429 30, ok 62, redirect 4 | 2026-11-24 |
| developer.squareup.com | 85/92 | empty 1, http_404 5, ok 85, redirect 1 | 2026-11-24 |
| www.federalregister.gov | 65/89 | empty 11, ok 65, redirect 13 | 2026-11-25 |
| forum.invoiceninja.com | 82/85 | empty 3, ok 82 | 2026-11-23 |
| community.calendly.com | 72/78 | empty 4, http_404 1, ok 72, timeout 1 | 2026-11-21 |
| api.stackexchange.com | 67/69 | allowlist 2, ok 67 | 2026-11-25 |
| github.com | 57/66 | http_403 9, ok 57 | 2026-11-25 |
| quickbooks.intuit.com | 48/58 | empty 4, http_404 1, http_5xx 1, ok 48, timeout 4 | 2026-11-24 |
| feedback.zeffy.com | 49/52 | http_404 3, ok 49 | 2026-11-24 |
| apps.xero.com | 37/49 | empty 11, http_404 1, ok 37 | 2026-11-23 |
| api.wordpress.org | 47/48 | empty 1, ok 47 | 2026-11-25 |
| community.make.com | 42/46 | empty 4, ok 42 | 2026-11-24 |
| forum.manager.io | 39/42 | empty 3, ok 39 | 2026-11-23 |
| shopify.dev | 42/42 | ok 42 | 2026-11-23 |
| community.fly.io | 40/40 | ok 40 | 2026-11-18 |
| appsumo.com | 38/38 | ok 38 | 2026-11-25 |
| help.shopify.com | 37/37 | ok 37 | 2026-11-23 |
| raw.githubusercontent.com | 34/37 | empty 1, http_404 2, ok 34 | 2026-11-23 |
| talk.folksy.com | 33/35 | empty 2, ok 33 | 2026-11-22 |
| forum.ghost.org | 33/34 | empty 1, ok 33 | 2026-11-24 |
| www.gov.uk | 33/34 | http_404 1, ok 33 | 2026-11-24 |
| community.blackbaud.com | 26/32 | empty 1, http_403 5, ok 26 | 2026-11-25 |
| developer.xero.com | 19/32 | empty 13, ok 19 | 2026-11-24 |
| forum.posit.co | 29/30 | empty 1, ok 29 | 2026-11-25 |
| developer.calendly.com | 29/29 | ok 29 | 2026-11-20 |
| www.gov.wales | 28/28 | ok 28 | 2026-11-23 |
| community.toggl.com | 27/27 | ok 27 | 2026-11-19 |
| discuss.openedx.org | 25/26 | empty 1, ok 25 | 2026-11-24 |
| forum.cursor.com | 26/26 | ok 26 | 2026-11-25 |
| forums.wildapricot.com | 26/26 | ok 26 | 2026-11-21 |
| zapier.com | 20/25 | http_404 4, http_5xx 1, ok 20 | 2026-11-24 |
| www.zeffy.com | 21/24 | empty 2, http_403 1, ok 21 | 2026-11-24 |
| sellersasksellers.com | 23/23 | ok 23 | 2026-11-22 |
| export.arxiv.org | 19/22 | empty 3, ok 19 | 2026-11-25 |
| localsearchforum.com | 22/22 | ok 22 | 2026-11-20 |
| support.zeffy.com | 19/22 | http_404 3, ok 19 | 2026-11-24 |
| www.peopleperhour.com | 6/22 | empty 16, ok 6 | 2026-11-20 |
| trustmrr.com | 19/21 | empty 1, http_404 1, ok 19 | 2026-11-25 |
| discuss.frappe.io | 20/20 | ok 20 | 2026-11-23 |
| docs.github.com | 16/17 | http_404 1, ok 16 | 2026-11-25 |
| marketplace.atlassian.com | 16/17 | empty 1, ok 16 | 2026-11-25 |
| www.xero.com | 17/17 | ok 17 | 2026-11-23 |
| calendly.com | 13/16 | empty 3, ok 13 | 2026-11-20 |
| community.etsy.com | 5/16 | allowlist 1, empty 6, http_404 4, ok 5 | 2026-11-22 |
| answers.netlify.com | 13/15 | empty 1, http_404 1, ok 13 | 2026-11-25 |
| givebutter.canny.io | 14/14 | ok 14 | 2026-11-24 |
| intercom.help | 13/14 | http_404 1, ok 13 | 2026-11-24 |
| www.capterra.com | 3/14 | http_403 10, http_404 1, ok 3 | 2026-11-16 |
| www.teacherspayteachers.com | 14/14 | ok 14 | 2026-11-24 |
| community.shopify.dev | 13/13 | ok 13 | 2026-11-22 |
| community.zoom.com | 8/13 | empty 5, ok 8 | 2026-11-24 |
| dev.to | 11/13 | http_404 2, ok 11 | 2026-11-25 |
| discourse.jupyter.org | 7/13 | empty 6, ok 7 | 2026-11-25 |
| docs.fly.io | 12/12 | ok 12 | 2026-11-18 |
| docs.stripe.com | 12/12 | ok 12 | 2026-11-23 |
| ico.org.uk | 11/12 | http_404 1, ok 11 | 2026-11-23 |
| www.accountingweb.co.uk | 0/12 | http_403 12 | never |
| gumroad.com | 7/11 | empty 4, ok 7 | 2026-11-22 |
| www.avalara.com | 10/11 | http_404 1, ok 10 | 2026-11-23 |
| www.govinfo.gov | 11/11 | ok 11 | 2026-11-25 |
| www.idealist.org | 1/11 | http_404 10, ok 1 | 2026-11-07 |
| www.quotientapp.com | 10/11 | empty 1, ok 10 | 2026-11-20 |
| api.nsf.gov | 10/10 | ok 10 | 2026-11-25 |
| communityhub.sage.com | 10/10 | ok 10 | 2026-11-19 |
| cursor.com | 9/10 | http_404 1, ok 9 | 2026-11-25 |
| docs.posit.co | 10/10 | ok 10 | 2026-11-25 |
| grants.nih.gov | 9/10 | ok 9, redirect 1 | 2026-11-25 |
| www.wix.com | 10/10 | ok 10 | 2026-11-23 |
| apps.apple.com | 7/9 | http_404 2, ok 7 | 2026-11-24 |
| cdtfa.ca.gov | 9/9 | ok 9 | 2026-11-23 |
| changelog.shopify.com | 9/9 | ok 9 | 2026-11-22 |
| developer.wordpress.org | 9/9 | ok 9 | 2026-11-25 |
| digital-strategy.ec.europa.eu | 9/9 | ok 9 | 2026-11-25 |
| forum.bubble.io | 8/9 | empty 1, ok 8 | 2026-11-18 |
| gethelp.wildapricot.com | 5/9 | empty 4, ok 5 | 2026-11-07 |
| help.kajabi.com | 3/9 | http_404 6, ok 3 | 2026-11-24 |
| news.ycombinator.com | 8/9 | http_429 1, ok 8 | 2026-11-25 |
| www.achrnews.com | 8/9 | empty 1, ok 8 | 2026-11-20 |
| www.ukbusinessforums.co.uk | 7/9 | empty 2, ok 7 | 2026-11-21 |
| blog.xero.com | 8/8 | ok 8 | 2026-11-24 |
| community.glowforge.com | 7/8 | empty 1, ok 7 | 2026-11-22 |
| community.retellai.com | 8/8 | ok 8 | 2026-11-23 |
| community.zeffy.com | 8/8 | ok 8 | 2026-11-24 |
| docs.n8n.io | 7/8 | empty 1, ok 7 | 2026-11-18 |
| www.producthunt.com | 8/8 | ok 8 | 2026-11-25 |
| www.reddit.com | 0/8 | allowlist 3, http_403 5 | never |
| www.valueaddedresource.net | 8/8 | ok 8 | 2026-11-15 |
| accountants.intuit.com | 6/7 | http_403 1, ok 6 | 2026-11-23 |
| apibreaks.com | 7/7 | ok 7 | 2026-11-18 |
| assets.publishing.service.gov.uk | 7/7 | ok 7 | 2026-11-24 |
| fly.io | 5/7 | ok 5, redirect 2 | 2026-11-18 |
| oag.ca.gov | 7/7 | ok 7 | 2026-11-07 |
| pypi.org | 2/7 | empty 4, http_404 1, ok 2 | 2026-11-18 |
| teachngo.frill.co | 7/7 | ok 7 | 2026-11-24 |
| trykintsugi.com | 7/7 | ok 7 | 2026-11-23 |
| workspace.google.com | 7/7 | ok 7 | 2026-11-24 |
| www.fairwork.gov.au | 0/7 | empty 2, http_5xx 3, timeout 2 | never |
| www.grants.nih.gov | 6/7 | http_404 1, ok 6 | 2026-11-25 |
| www.icaew.com | 6/7 | empty 1, ok 6 | 2026-11-23 |
| www.irs.gov | 7/7 | ok 7 | 2026-11-23 |
| www.wsib.ca | 6/7 | empty 1, ok 6 | 2026-11-24 |
| acuityscheduling.com | 6/6 | ok 6 | 2026-11-20 |
| api.openalex.org | 1/6 | http_429 5, ok 1 | 2026-11-25 |
| community.cloudflare.com | 0/6 | empty 1, http_403 5 | never |
| community.mainwp.com | 6/6 | ok 6 | 2026-11-25 |
| craftybase.com | 3/6 | ok 3, redirect 3 | 2026-11-22 |
| developer.intuit.com | 0/6 | empty 6 | never |
| developers.google.com | 6/6 | ok 6 | 2026-11-21 |
| gov.wales | 6/6 | ok 6 | 2026-11-23 |
| learn.microsoft.com | 4/6 | empty 2, ok 4 | 2026-11-25 |
| partial.ly | 6/6 | ok 6 | 2026-11-08 |
| seedfund.nsf.gov | 3/6 | http_404 3, ok 3 | 2026-11-06 |
| sellercommunity.com | 0/6 | empty 3, redirect 3 | never |
| support.google.com | 5/6 | http_404 1, ok 5 | 2026-11-25 |
| taxcloud.com | 6/6 | ok 6 | 2026-11-23 |
| techcommunity.microsoft.com | 6/6 | ok 6 | 2026-11-25 |
| www.acas.org.uk | 6/6 | ok 6 | 2026-11-21 |
| www.ce-go.com | 6/6 | ok 6 | 2026-11-24 |
| www.etsy.com | 0/6 | empty 1, http_403 5 | never |
| www.jotform.com | 6/6 | ok 6 | 2026-11-24 |
| www.legislation.gov.uk | 4/6 | empty 2, ok 4 | 2026-11-23 |
| www.nyc.gov | 6/6 | ok 6 | 2026-11-23 |
| www.tutorbird.com | 5/6 | empty 1, ok 5 | 2026-11-24 |
| accessibe.com | 5/5 | ok 5 | 2026-11-23 |
| arxiv.org | 4/5 | empty 1, ok 4 | 2026-11-25 |
| chromewebstore.google.com | 5/5 | ok 5 | 2026-11-22 |
| despatch.blog.gov.uk | 5/5 | ok 5 | 2026-11-17 |
| developer.etsy.com | 5/5 | ok 5 | 2026-11-22 |
| discuss.pixls.us | 5/5 | ok 5 | 2026-11-22 |
| docs.netlify.com | 5/5 | ok 5 | 2026-11-25 |
| downloads.wordpress.org | 5/5 | ok 5 | 2026-11-18 |
| engineering.toggl.com | 5/5 | ok 5 | 2026-11-19 |
| flippa.com | 2/5 | empty 3, ok 2 | 2026-11-07 |
| foscos.fssai.gov.in | 0/5 | empty 5 | never |
| github.blog | 5/5 | ok 5 | 2026-11-25 |
| help.klaviyo.com | 5/5 | ok 5 | 2026-11-20 |
| help.trackitforward.com | 5/5 | ok 5 | 2026-11-24 |
| invoiceninja.com | 5/5 | ok 5 | 2026-11-19 |
| n8n.io | 5/5 | ok 5 | 2026-11-20 |
| payhip.com | 5/5 | ok 5 | 2026-11-22 |
| supabase.com | 5/5 | ok 5 | 2026-11-25 |
| tax.colorado.gov | 5/5 | ok 5 | 2026-11-23 |
| toggl.com | 5/5 | ok 5 | 2026-11-19 |
| uptimerobot.com | 5/5 | ok 5 | 2026-11-25 |
| www.airbnb.com | 5/5 | ok 5 | 2026-11-23 |
| www.ato.gov.au | 0/5 | http_403 5 | never |
| www.breathehr.com | 4/5 | http_404 1, ok 4 | 2026-11-21 |
| www.cdtfa.ca.gov | 5/5 | ok 5 | 2026-11-23 |
| www.ftc.gov | 5/5 | ok 5 | 2026-11-24 |
| www.hhs.gov | 0/5 | http_403 5 | never |
| www.higheredjobs.com | 0/5 | empty 5 | never |
| www.inventora.com | 4/5 | http_404 1, ok 4 | 2026-11-22 |
| www.mymusicstaff.com | 5/5 | ok 5 | 2026-11-24 |
| www.rosterelf.com | 4/5 | http_404 1, ok 4 | 2026-11-17 |
| www.royalmail.com | 0/5 | http_403 5 | never |
| www.upwork.com | 0/5 | http_403 5 | never |
| www.wildapricot.com | 5/5 | ok 5 | 2026-11-21 |
| www.wordfence.com | 0/5 | empty 5 | never |
| www.wrkr.com.au | 5/5 | ok 5 | 2026-11-19 |
| accessible.org | 4/4 | ok 4 | 2026-11-23 |
| apify.com | 3/4 | empty 1, ok 3 | 2026-11-20 |
| astalty.com.au | 4/4 | ok 4 | 2026-11-21 |
| blog.insightfulaccountant.com | 4/4 | ok 4 | 2026-11-19 |
| clockify.me | 4/4 | ok 4 | 2026-11-19 |
| community.getjobber.com | 0/4 | http_403 4 | never |
| community.letsencrypt.org | 4/4 | ok 4 | 2026-11-25 |
| community.servicem8.com | 4/4 | ok 4 | 2026-11-19 |
| community.spiceworks.com | 2/4 | empty 2, ok 2 | 2026-11-11 |
| community.withairbnb.com | 0/4 | redirect 4 | never |
| devforum.zoom.us | 4/4 | ok 4 | 2026-11-10 |
| employmenthero.com | 4/4 | ok 4 | 2026-11-16 |
| expenseplus.co.uk | 4/4 | ok 4 | 2026-11-21 |
| forum.obsidian.md | 3/4 | empty 1, ok 3 | 2026-11-18 |
| forum.squarespace.com | 0/4 | empty 1, http_403 3 | never |
| forum.webflow.com | 0/4 | empty 3, redirect 1 | never |
| givebutter.com | 4/4 | ok 4 | 2026-11-24 |
| help.etsy.com | 3/4 | empty 1, ok 3 | 2026-11-15 |
| help.getharvest.com | 4/4 | ok 4 | 2026-11-18 |
| help.getjobber.com | 3/4 | http_403 1, ok 3 | 2026-11-19 |
| iclasspro.com | 4/4 | ok 4 | 2026-11-24 |
| idealab.foundant.com | 1/4 | http_404 3, ok 1 | 2026-11-24 |
| livid.com | 3/4 | http_404 1, ok 3 | 2026-11-24 |
| managewp.com | 4/4 | ok 4 | 2026-11-25 |
| marketplace.stripe.com | 2/4 | empty 2, ok 2 | 2026-11-22 |
| meet.ribblr.com | 4/4 | ok 4 | 2026-11-22 |
| militaryphs.org | 4/4 | ok 4 | 2026-11-24 |
| moneyminder.com | 4/4 | ok 4 | 2026-11-24 |
| pressprimer.com | 3/4 | empty 1, ok 3 | 2026-11-21 |
| stocksmith.io | 4/4 | ok 4 | 2026-11-22 |
| subdoc.io | 4/4 | ok 4 | 2026-11-23 |
| support.stripe.com | 3/4 | empty 1, ok 3 | 2026-11-23 |
| webaim.org | 1/4 | empty 3, ok 1 | 2026-11-01 |
| www.accaglobal.com | 4/4 | ok 4 | 2026-11-23 |
| www.fssai.gov.in | 3/4 | empty 1, ok 3 | 2026-11-23 |
| www.getapp.com | 0/4 | http_403 4 | never |
| www.getbcs.com | 4/4 | ok 4 | 2026-11-23 |
| www.inflatableoffice.com | 3/4 | ok 3, redirect 1 | 2026-11-18 |
| www.iubenda.com | 3/4 | empty 1, ok 3 | 2026-11-25 |
| www.make.com | 1/4 | http_403 3, ok 1 | 2026-11-07 |
| www.modernretail.co | 4/4 | ok 4 | 2026-11-13 |
| www.nysenate.gov | 4/4 | ok 4 | 2026-11-24 |
| www.paidnice.com | 4/4 | ok 4 | 2026-11-20 |
| www.paytraqer.com | 2/4 | http_404 2, ok 2 | 2026-11-19 |
| www.pinsentmasons.com | 4/4 | ok 4 | 2026-11-25 |
| www.signupgenius.com | 3/4 | empty 1, ok 3 | 2026-11-24 |
| www.taxcalc.com | 4/4 | ok 4 | 2026-11-21 |
| www.trustpilot.com | 3/4 | http_403 1, ok 3 | 2026-11-24 |
| zeffy.hc.ferndesk.com | 0/4 | redirect 4 | never |
| zonos.com | 3/4 | empty 1, ok 3 | 2026-11-16 |
| adanews.ada.org | 3/3 | ok 3 | 2026-11-23 |
| api.npmjs.org | 3/3 | ok 3 | 2026-11-18 |
| approvalmax.com | 3/3 | ok 3 | 2026-11-14 |
| archdesk.com | 3/3 | ok 3 | 2026-11-23 |
| beancount.io | 3/3 | ok 3 | 2026-11-18 |
| blackbaudk12.ideas.aha.io | 3/3 | ok 3 | 2026-11-24 |
| blenderartists.org | 3/3 | ok 3 | 2026-11-22 |
| booqable.com | 2/3 | http_404 1, ok 2 | 2026-11-18 |
| cal.com | 3/3 | ok 3 | 2026-11-20 |
| cartmango.com | 3/3 | ok 3 | 2026-11-22 |
| certifier.io | 3/3 | ok 3 | 2026-11-24 |
| certpilot.app | 2/3 | http_404 1, ok 2 | 2026-11-18 |
| code.claude.com | 3/3 | ok 3 | 2026-11-11 |
| community.vercel.com | 1/3 | empty 2, ok 1 | 2026-11-25 |
| developer.apple.com | 3/3 | ok 3 | 2026-11-21 |
| developer.getjobber.com | 0/3 | http_403 3 | never |
| developers.etsy.com | 3/3 | ok 3 | 2026-11-15 |
| discourse.webflow.com | 0/3 | empty 2, redirect 1 | never |
| docs.givebutter.com | 1/3 | http_404 2, ok 1 | 2026-11-24 |
| docs.lovable.dev | 3/3 | ok 3 | 2026-11-25 |
| docs.zeffy.com | 3/3 | ok 3 | 2026-11-24 |
| domainnotifications.com | 3/3 | ok 3 | 2026-11-18 |
| dor.wa.gov | 2/3 | http_404 1, ok 2 | 2026-11-07 |
| elearningindustry.com | 2/3 | ok 2, redirect 1 | 2026-11-24 |
| en.freetobook.com | 3/3 | ok 3 | 2026-11-23 |
| eur-lex.europa.eu | 0/3 | empty 3 | never |
| feedback.qbo.intuit.com | 0/3 | allowlist 2, empty 1 | never |
| fiverr.com | 0/3 | http_403 3 | never |
| forum.wixstudio.com | 2/3 | empty 1, ok 2 | 2026-11-20 |
| get.nicejob.com | 2/3 | http_404 1, ok 2 | 2026-11-20 |
| ghost.org | 3/3 | ok 3 | 2026-11-15 |
| hackceleration.com | 3/3 | ok 3 | 2026-11-24 |
| help.buildxact.com | 3/3 | ok 3 | 2026-11-23 |
| help.teacherspayteachers.com | 2/3 | http_403 1, ok 2 | 2026-11-10 |
| help.vimeo.com | 3/3 | ok 3 | 2026-11-24 |
| help.zoho.com | 1/3 | empty 2, ok 1 | 2026-11-20 |
| horstmann.com | 3/3 | ok 3 | 2026-11-25 |
| innovations.xero.com | 2/3 | empty 1, ok 2 | 2026-11-20 |
| invoiceninja.github.io | 1/3 | empty 2, ok 1 | 2026-11-20 |
| journals.plos.org | 3/3 | ok 3 | 2026-11-25 |
| legacy.cdocs.com | 3/3 | ok 3 | 2026-11-23 |
| mainwp.com | 3/3 | ok 3 | 2026-11-25 |
| marketing-website-3vj.pages.dev | 3/3 | ok 3 | 2026-11-18 |
| moodle.atlassian.net | 3/3 | ok 3 | 2026-11-24 |
| n8n-handoff-kit.vercel.app | 3/3 | ok 3 | 2026-11-04 |
| outpost.pub | 3/3 | ok 3 | 2026-11-15 |
| petapixel.com | 2/3 | http_403 1, ok 2 | 2026-11-24 |
| pointapp.org | 1/3 | empty 1, ok 1, timeout 1 | 2026-11-24 |
| posit.co | 3/3 | ok 3 | 2026-11-25 |
| producthunt.com | 3/3 | ok 3 | 2026-11-25 |
| punchpass.com | 3/3 | ok 3 | 2026-11-18 |
| ramp.com | 3/3 | ok 3 | 2026-11-23 |
| remitclear.com | 3/3 | ok 3 | 2026-11-05 |
| rewind.com | 3/3 | ok 3 | 2026-11-19 |
| saga-compliance.com | 3/3 | ok 3 | 2026-11-25 |
| sigcse.org | 3/3 | ok 3 | 2026-11-25 |
| skyvia.com | 1/3 | http_404 2, ok 1 | 2026-11-19 |
| smtply.pages.dev | 2/3 | http_404 1, ok 2 | 2026-11-11 |
| support.expenseplus.co.uk | 3/3 | ok 3 | 2026-11-21 |
| support.getharvest.com | 0/3 | http_403 3 | never |
| support.gusto.com | 0/3 | http_403 3 | never |
| support.servicem8.com | 3/3 | ok 3 | 2026-11-20 |
| support.taxjar.com | 3/3 | ok 3 | 2026-11-23 |
| support.toggl.com | 3/3 | ok 3 | 2026-11-19 |
| support.zapiet.com | 3/3 | ok 3 | 2026-11-21 |
| techradar.com | 2/3 | empty 1, ok 2 | 2026-11-18 |
| termly.io | 3/3 | ok 3 | 2026-11-24 |
| totaldrive.co.uk | 2/3 | http_404 1, ok 2 | 2026-11-17 |
| tutorcruncher.com | 1/3 | empty 2, ok 1 | 2026-11-24 |
| uk.trustpilot.com | 3/3 | ok 3 | 2026-11-24 |
| versionly.dev | 2/3 | http_404 1, ok 2 | 2026-11-18 |
| vibeappscanner.com | 3/3 | ok 3 | 2026-11-25 |
| visitorlevyapp.com | 3/3 | ok 3 | 2026-11-23 |
| woocommerce.com | 3/3 | ok 3 | 2026-11-22 |
| wp-umbrella.com | 3/3 | ok 3 | 2026-11-25 |
| wpamelia.com | 3/3 | ok 3 | 2026-11-18 |
| www.accessibilitychecker.org | 3/3 | ok 3 | 2026-11-23 |
| www.brighthr.com | 3/3 | ok 3 | 2026-11-21 |
| www.buildpass.ai | 3/3 | ok 3 | 2026-11-23 |
| www.cdph.ca.gov | 0/3 | http_5xx 2, timeout 1 | never |
| www.change.org | 3/3 | ok 3 | 2026-11-10 |
| www.charityjob.co.uk | 0/3 | http_403 3 | never |
| www.chartrequest.com | 3/3 | ok 3 | 2026-11-23 |
| www.checklyhq.com | 3/3 | ok 3 | 2026-11-18 |
| www.claytonutz.com | 3/3 | ok 3 | 2026-11-22 |
| www.ecfr.gov | 2/3 | ok 2, redirect 1 | 2026-11-24 |
| www.getharvest.com | 2/3 | http_404 1, ok 2 | 2026-11-19 |
| www.gla.ac.uk | 3/3 | ok 3 | 2026-11-25 |
| www.health.gov.au | 0/3 | http_5xx 3 | never |
| www.indiehackers.com | 0/3 | http_403 3 | never |
| www.kelleydrye.com | 3/3 | ok 3 | 2026-11-23 |
| www.legislation.gov.au | 3/3 | ok 3 | 2026-11-21 |
| www.leohr.co.uk | 3/3 | ok 3 | 2026-11-21 |
| www.nrn.com | 2/3 | empty 1, ok 2 | 2026-11-20 |
| www.nsf.gov | 1/3 | http_404 2, ok 1 | 2026-11-04 |
| www.payapps.com | 3/3 | ok 3 | 2026-11-23 |
| www.prairielearn.com | 3/3 | ok 3 | 2026-11-25 |
| www.safeexambrowser.org | 3/3 | ok 3 | 2026-11-25 |
| www.salontoday.com | 3/3 | ok 3 | 2026-11-20 |
| www.shopify.com | 3/3 | ok 3 | 2026-11-23 |
| www.taxwire.com | 3/3 | ok 3 | 2026-11-23 |
| www.thinkific.com | 3/3 | ok 3 | 2026-11-24 |
| www.toriihq.com | 3/3 | ok 3 | 2026-11-25 |
| www.trustlayer.io | 3/3 | ok 3 | 2026-11-23 |
| www.uptimia.com | 3/3 | ok 3 | 2026-11-25 |
| www.usecarly.com | 1/3 | http_429 2, ok 1 | 2026-11-19 |
| www.xbert.io | 2/3 | http_404 1, ok 2 | 2026-11-19 |
| academia.stackexchange.com | 0/2 | allowlist 2 | never |
| acie.wildapricot.org | 2/2 | ok 2 | 2026-11-21 |
| administrate.dev | 2/2 | ok 2 | 2026-11-18 |
| ai-act-service-desk.ec.europa.eu | 2/2 | ok 2 | 2026-11-25 |
| alteg.io | 2/2 | ok 2 | 2026-11-06 |
| alternativeto.net | 1/2 | http_403 1, ok 1 | 2026-11-25 |
| aphyr.com | 2/2 | ok 2 | 2026-11-18 |
| api.n8n.io | 2/2 | ok 2 | 2026-11-20 |
| api.squareup.com | 1/2 | ok 1, redirect 1 | 2026-11-20 |
| apis.io | 2/2 | ok 2 | 2026-11-24 |
| app.thetutor.link | 2/2 | ok 2 | 2026-11-03 |
| apply.workable.com | 0/2 | http_404 2 | never |
| atg.wa.gov | 2/2 | ok 2 | 2026-11-20 |
| batchmakes.com | 2/2 | ok 2 | 2026-11-22 |
| betterstack.com | 2/2 | ok 2 | 2026-11-25 |
| billable.to | 2/2 | ok 2 | 2026-11-18 |
| bloomerang.com | 1/2 | http_404 1, ok 1 | 2026-11-24 |
| buffer.com | 2/2 | ok 2 | 2026-11-18 |
| buildpass.ai | 2/2 | ok 2 | 2026-11-23 |
| bundesnetzagentur.de | 2/2 | ok 2 | 2026-11-25 |
| cabgrid.com | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| cancelflow.dev | 2/2 | ok 2 | 2026-11-25 |
| cardiff.gov.uk | 0/2 | http_403 2 | never |
| cdn.jsdelivr.net | 2/2 | ok 2 | 2026-11-25 |
| certifytheweb.com | 1/2 | http_404 1, ok 1 | 2026-11-25 |
| ch.trustpilot.com | 1/2 | http_403 1, ok 1 | 2026-11-18 |
| clientmeter.pages.dev | 2/2 | ok 2 | 2026-11-11 |
| cloud.google.com | 1/2 | empty 1, ok 1 | 2026-11-24 |
| cloud.r-project.org | 2/2 | ok 2 | 2026-11-25 |
| community.glideapps.com | 2/2 | ok 2 | 2026-11-24 |
| community.instructure.com | 0/2 | empty 2 | never |
| community.openfoodnetwork.org | 2/2 | ok 2 | 2026-11-20 |
| community.softr.io | 2/2 | ok 2 | 2026-11-24 |
| community.zapier.com | 0/2 | empty 1, http_404 1 | never |
| communitycenter.airbnb.com | 0/2 | empty 2 | never |
| complaintsdesk.pages.dev | 2/2 | ok 2 | 2026-11-23 |
| connect.posit.cloud | 1/2 | empty 1, ok 1 | 2026-11-25 |
| consentik.com | 2/2 | ok 2 | 2026-11-23 |
| content.govdelivery.com | 2/2 | ok 2 | 2026-11-21 |
| context7.com | 2/2 | ok 2 | 2026-11-25 |
| craevidence.com | 2/2 | ok 2 | 2026-11-11 |
| cran.r-universe.dev | 0/2 | http_403 2 | never |
| crtc.gc.ca | 0/2 | http_403 2 | never |
| cseducators.stackexchange.com | 0/2 | allowlist 2 | never |
| ctars.com.au | 2/2 | ok 2 | 2026-11-21 |
| ddiy.co | 2/2 | ok 2 | 2026-11-24 |
| developers.make.com | 2/2 | ok 2 | 2026-11-18 |
| docs.coderabbit.ai | 2/2 | ok 2 | 2026-11-25 |
| docs.dingdoong.io | 1/2 | empty 1, ok 1 | 2026-11-13 |
| docs.ghost.org | 2/2 | ok 2 | 2026-11-15 |
| docs.machines.dev | 0/2 | http_404 2 | never |
| docs.toggl.com | 2/2 | ok 2 | 2026-11-19 |
| documentation.outpost.pub | 2/2 | ok 2 | 2026-11-15 |
| dodona.be | 2/2 | ok 2 | 2026-11-25 |
| dsp.berkeley.edu | 2/2 | ok 2 | 2026-11-01 |
| dvoorhees.com | 2/2 | ok 2 | 2026-11-18 |
| ec.europa.eu | 2/2 | ok 2 | 2026-11-25 |
| elearn.soton.ac.uk | 0/2 | redirect 2 | never |
| elfsight.com | 2/2 | ok 2 | 2026-11-20 |
| equalizedigital.com | 1/2 | http_403 1, ok 1 | 2026-11-07 |
| euverify.com | 2/2 | ok 2 | 2026-11-23 |
| faq-en.exam.net | 0/2 | http_403 2 | never |
| fasta2p-portal.pages.dev | 2/2 | ok 2 | 2026-11-09 |
| feedback.kajabi.com | 0/2 | allowlist 1, empty 1 | never |
| feedback.render.com | 2/2 | ok 2 | 2026-11-25 |
| flyingfish.ie | 2/2 | ok 2 | 2026-11-03 |
| forum.arduino.cc | 1/2 | empty 1, ok 1 | 2026-11-11 |
| forum.image.sc | 1/2 | http_403 1, ok 1 | 2026-11-11 |
| forum.juce.com | 2/2 | ok 2 | 2026-11-25 |
| forum.mautic.org | 2/2 | ok 2 | 2026-11-03 |
| forums.unrealengine.com | 2/2 | ok 2 | 2026-11-22 |
| francedigitale.org | 2/2 | ok 2 | 2026-11-25 |
| freshlearn.com | 2/2 | ok 2 | 2026-11-24 |
| fssai.gov.in | 2/2 | ok 2 | 2026-11-23 |
| getvela.com | 2/2 | ok 2 | 2026-11-10 |
| ghostinspector.com | 2/2 | ok 2 | 2026-11-25 |
| github.github.com | 2/2 | ok 2 | 2026-11-25 |
| grantedai.com | 2/2 | ok 2 | 2026-11-11 |
| grantlink.app | 2/2 | ok 2 | 2026-11-24 |
| hashnode.com | 0/2 | empty 2 | never |
| healthchecks.io | 2/2 | ok 2 | 2026-11-25 |
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
| issuu.com | 0/2 | empty 2 | never |
| itbrief.co.uk | 2/2 | ok 2 | 2026-11-21 |
| joinit.com | 2/2 | ok 2 | 2026-11-21 |
| kajabi.com | 2/2 | ok 2 | 2026-11-24 |
| knowledge.workspace.google.com | 2/2 | ok 2 | 2026-11-25 |
| kostenlose-erechnung.de | 2/2 | ok 2 | 2026-11-11 |
| labyrinthinc.com | 2/2 | ok 2 | 2026-11-07 |
| learn.thryv.com | 0/2 | http_403 2 | never |
| legislation.gov.au | 2/2 | ok 2 | 2026-11-21 |
| letsencrypt.org | 2/2 | ok 2 | 2026-11-25 |
| magazine.artstation.com | 0/2 | http_403 2 | never |
| mage-people.com | 1/2 | http_404 1, ok 1 | 2026-11-06 |
| mastodon.gamedev.place | 2/2 | ok 2 | 2026-11-06 |
| meta.discourse.org | 2/2 | ok 2 | 2026-11-10 |
| moodle.org | 0/2 | http_403 2 | never |
| nation.cymru | 2/2 | ok 2 | 2026-11-23 |
| ndiscommission.gov.au | 0/2 | http_5xx 2 | never |
| nds.org.au | 0/2 | empty 2 | never |
| occasion.app | 2/2 | ok 2 | 2026-11-08 |
| ohdear.app | 2/2 | ok 2 | 2026-11-25 |
| onlineornot.com | 2/2 | ok 2 | 2026-11-18 |
| osiaffiliate.freshdesk.com | 0/2 | redirect 2 | never |
| pages.charlotte.edu | 0/2 | http_5xx 2 | never |
| pricingsaas.com | 2/2 | ok 2 | 2026-11-25 |
| proposia.ai | 2/2 | ok 2 | 2026-11-24 |
| public.api.bsky.app | 0/2 | http_403 2 | never |
| pullminder.com | 2/2 | ok 2 | 2026-11-25 |
| recensa.ai | 2/2 | ok 2 | 2026-11-24 |
| redsift.com | 2/2 | ok 2 | 2026-11-25 |
| registry.npmjs.org | 2/2 | ok 2 | 2026-11-18 |
| roundtriplabs.helpscoutdocs.com | 0/2 | redirect 2 | never |
| safetyculture.com | 0/2 | redirect 2 | never |
| samsearch.co | 0/2 | empty 2 | never |
| scholarsapp.com | 0/2 | empty 2 | never |
| servicehub.passgallery.com | 2/2 | ok 2 | 2026-11-08 |
| shiftcare.com | 2/2 | ok 2 | 2026-11-21 |
| sites.google.com | 2/2 | ok 2 | 2026-11-23 |
| slashdot.org | 2/2 | ok 2 | 2026-11-24 |
| softwaredevelopers.ato.gov.au | 0/2 | empty 1, http_5xx 1 | never |
| sourceforge.net | 1/2 | http_403 1, ok 1 | 2026-11-20 |
| splose.com | 2/2 | ok 2 | 2026-11-21 |
| square-appointment-wp.com | 2/2 | ok 2 | 2026-11-20 |
| square.com | 1/2 | ok 1, redirect 1 | 2026-11-19 |
| standardcompute.com | 2/2 | ok 2 | 2026-11-11 |
| strapi.io | 2/2 | ok 2 | 2026-11-25 |
| streamlinedsalestax.org | 1/2 | http_404 1, ok 1 | 2026-11-23 |
| subletmanager.com | 2/2 | ok 2 | 2026-11-23 |
| support.dnsimple.com | 2/2 | ok 2 | 2026-11-25 |
| support.easyroutes.app | 2/2 | ok 2 | 2026-11-18 |
| support.marianatek.com | 2/2 | ok 2 | 2026-11-23 |
| support.pirateship.com | 2/2 | ok 2 | 2026-11-15 |
| support.pointapp.org | 2/2 | ok 2 | 2026-11-24 |
| support.thinkific.com | 0/2 | http_403 2 | never |
| support.toasttab.com | 2/2 | ok 2 | 2026-11-12 |
| synder.com | 2/2 | ok 2 | 2026-11-19 |
| tailride.so | 2/2 | ok 2 | 2026-11-11 |
| tax.nv.gov | 2/2 | ok 2 | 2026-11-23 |
| taxguru.in | 2/2 | ok 2 | 2026-11-23 |
| tdx.umsystem.edu | 2/2 | ok 2 | 2026-11-25 |
| teachworks.featureupvote.com | 0/2 | http_403 2 | never |
| themarkup.org | 2/2 | ok 2 | 2026-11-02 |
| toolradar.com | 2/2 | ok 2 | 2026-11-21 |
| trackitforward.com | 0/2 | http_403 2 | never |
| tutorlms.com | 2/2 | ok 2 | 2026-11-24 |
| unscriptedphotographers.com | 2/2 | ok 2 | 2026-11-22 |
| welshrevenueauthority.blog.gov.wales | 2/2 | ok 2 | 2026-11-23 |
| wisdmlabs.com | 1/2 | http_403 1, ok 1 | 2026-11-10 |
| withmoxie.com | 2/2 | ok 2 | 2026-11-25 |
| workfloor.com.au | 2/2 | ok 2 | 2026-11-16 |
| wpengine.com | 1/2 | http_404 1, ok 1 | 2026-11-03 |
| wu30.org | 2/2 | ok 2 | 2026-11-24 |
| www.allergicliving.com | 0/2 | http_403 2 | never |
| www.alura.io | 2/2 | ok 2 | 2026-11-08 |
| www.americorpsoig.gov | 2/2 | ok 2 | 2026-11-24 |
| www.apideck.com | 2/2 | ok 2 | 2026-11-24 |
| www.artstation.com | 0/2 | http_403 2 | never |
| www.artworkarchive.com | 0/2 | http_403 2 | never |
| www.avail.co | 1/2 | allowlist 1, ok 1 | 2026-11-13 |
| www.avatarfleet.com | 1/2 | http_5xx 1, ok 1 | 2026-11-17 |
| www.awardspring.com | 2/2 | ok 2 | 2026-11-24 |
| www.azets.com | 2/2 | ok 2 | 2026-11-12 |
| www.bcnys.org | 1/2 | http_403 1, ok 1 | 2026-11-06 |
| www.biggerpockets.com | 2/2 | ok 2 | 2026-11-23 |
| www.brownejacobson.com | 2/2 | ok 2 | 2026-11-21 |
| www.calconic.com | 2/2 | ok 2 | 2026-11-23 |
| www.canva.com | 0/2 | http_403 2 | never |
| www.catholicjobs.com | 0/2 | http_404 2 | never |
| www.cdocs.com | 0/2 | redirect 2 | never |
| www.centroassist.com.au | 1/2 | empty 1, ok 1 | 2026-11-21 |
| www.chalkbeat.org | 2/2 | ok 2 | 2026-11-24 |
| www.churchofengland.org | 0/2 | http_404 2 | never |
| www.claconnect.com | 2/2 | ok 2 | 2026-11-23 |
| www.codegrade.com | 2/2 | ok 2 | 2026-11-25 |
| www.cognitoforms.com | 2/2 | ok 2 | 2026-11-24 |
| www.cpapracticeadvisor.com | 2/2 | ok 2 | 2026-11-07 |
| www.deputy.com | 2/2 | ok 2 | 2026-11-16 |
| www.digicert.com | 2/2 | ok 2 | 2026-11-25 |
| www.dolibarr.org | 2/2 | ok 2 | 2026-11-21 |
| www.e-recht24.de | 2/2 | ok 2 | 2026-11-22 |
| www.edjoin.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.edsurge.com | 1/2 | empty 1, ok 1 | 2026-11-24 |
| www.enisa.europa.eu | 2/2 | ok 2 | 2026-11-25 |
| www.expirationreminder.com | 2/2 | ok 2 | 2026-11-23 |
| www.faegredrinker.com | 2/2 | ok 2 | 2026-11-25 |
| www.fda.gov | 2/2 | ok 2 | 2026-11-22 |
| www.flsenate.gov | 1/2 | empty 1, ok 1 | 2026-11-10 |
| www.fqhc.org | 1/2 | http_404 1, ok 1 | 2026-11-07 |
| www.getjobber.com | 2/2 | ok 2 | 2026-11-20 |
| www.github.com | 2/2 | ok 2 | 2026-11-25 |
| www.goodshuffle.com | 0/2 | empty 2 | never |
| www.goodwinlaw.com | 2/2 | ok 2 | 2026-11-25 |
| www.gtlaw.com | 2/2 | ok 2 | 2026-11-25 |
| www.halfpricesoft.com | 2/2 | ok 2 | 2026-11-07 |
| www.icare.nsw.gov.au | 2/2 | ok 2 | 2026-11-23 |
| www.infoodle.com | 2/2 | ok 2 | 2026-11-14 |
| www.ird.govt.nz | 1/2 | empty 1, ok 1 | 2026-11-16 |
| www.ispringsolutions.com | 2/2 | ok 2 | 2026-11-24 |
| www.listadum.com | 2/2 | ok 2 | 2026-11-15 |
| www.mass.gov | 0/2 | http_403 2 | never |
| www.meetergo.com | 2/2 | ok 2 | 2026-11-20 |
| www.menaiholidays.co.uk | 1/2 | empty 1, ok 1 | 2026-11-23 |
| www.messagedesk.com | 2/2 | ok 2 | 2026-11-09 |
| www.mgma.com | 2/2 | ok 2 | 2026-11-07 |
| www.mintlify.com | 1/2 | http_404 1, ok 1 | 2026-11-25 |
| www.momoyoga.com | 2/2 | ok 2 | 2026-11-18 |
| www.nasbaregistry.org | 2/2 | ok 2 | 2026-11-10 |
| www.ndiscommission.gov.au | 0/2 | http_5xx 2 | never |
| www.netlify.com | 2/2 | ok 2 | 2026-11-25 |
| www.notion.com | 2/2 | ok 2 | 2026-11-25 |
| www.oag.ca.gov | 2/2 | ok 2 | 2026-11-07 |
| www.onlinejobs.ph | 2/2 | ok 2 | 2026-11-10 |
| www.overdriveonline.com | 0/2 | http_403 2 | never |
| www.patriotsoftware.com | 1/2 | http_404 1, ok 1 | 2026-11-12 |
| www.photographytalk.com | 0/2 | empty 2 | never |
| www.photrio.com | 0/2 | http_403 2 | never |
| www.profileward.com | 1/2 | http_404 1, ok 1 | 2026-11-18 |
| www.rba.gov.au | 2/2 | ok 2 | 2026-11-20 |
| www.resourcecentre.org.uk | 2/2 | ok 2 | 2026-11-21 |
| www.restaurantbusinessonline.com | 1/2 | empty 1, ok 1 | 2026-11-06 |
| www.retailgazette.co.uk | 1/2 | http_429 1, ok 1 | 2026-11-12 |
| www.rubydoc.info | 0/2 | http_5xx 2 | never |
| www.ruzuku.com | 2/2 | ok 2 | 2026-11-24 |
| www.saasant.com | 0/2 | http_404 2 | never |
| www.scholarsapp.com | 0/2 | http_404 2 | never |
| www.setmore.com | 2/2 | ok 2 | 2026-11-20 |
| www.shopping-cart-migration.com | 0/2 | http_403 2 | never |
| www.shopuploader.com | 2/2 | ok 2 | 2026-11-15 |
| www.smarterselect.com | 1/2 | http_404 1, ok 1 | 2026-11-24 |
| www.smtp2go.com | 2/2 | ok 2 | 2026-11-11 |
| www.soapmakingforum.com | 0/2 | http_403 2 | never |
| www.softwareadvice.com | 0/2 | http_403 2 | never |
| www.squareup.com | 1/2 | http_429 1, ok 1 | 2026-11-23 |
| www.statefarm.com | 0/2 | empty 1, http_403 1 | never |
| www.switchops.ai | 0/2 | empty 2 | never |
| www.tanda.co | 2/2 | ok 2 | 2026-11-16 |
| www.taxbandits.com | 2/2 | ok 2 | 2026-11-14 |
| www.teachfloor.com | 2/2 | ok 2 | 2026-11-24 |
| www.teachngo.com | 2/2 | ok 2 | 2026-11-24 |
| www.theprintspace.co.uk | 2/2 | ok 2 | 2026-11-22 |
| www.tradifyhq.com | 2/2 | ok 2 | 2026-11-20 |
| www.travelers.com | 2/2 | ok 2 | 2026-11-23 |
| www.uncannyowl.com | 2/2 | ok 2 | 2026-11-21 |
| www.vantage.sh | 2/2 | ok 2 | 2026-11-18 |
| www.volunteerbadge.com | 2/2 | ok 2 | 2026-11-24 |
| www.waveapps.com | 2/2 | ok 2 | 2026-11-07 |
| www.zillow.com | 0/2 | http_403 2 | never |
| zebu.work | 2/2 | ok 2 | 2026-11-18 |
| zeffy.com | 2/2 | ok 2 | 2026-11-24 |
| zoom.us | 2/2 | ok 2 | 2026-11-24 |
| 1password.com | 0/1 | empty 1 | never |
| 2027.sigcse-ts.acm.org | 1/1 | ok 1 | 2026-11-25 |
| 80.lv | 1/1 | ok 1 | 2026-11-22 |
| <store domain withheld: the sold-out product page cited in square community topic 845776> | 1/1 | ok 1 | 2026-11-20 |
| about.readthedocs.com | 1/1 | ok 1 | 2026-11-25 |
| about.usps.com | 0/1 | empty 1 | never |
| accessibility.arizona.edu | 1/1 | ok 1 | 2026-11-25 |
| acowebs.com | 1/1 | ok 1 | 2026-11-08 |
| acquire.com | 0/1 | http_404 1 | never |
| actonline.org | 1/1 | ok 1 | 2026-11-18 |
| adaptive.build | 1/1 | ok 1 | 2026-11-23 |
| additioapp.com | 1/1 | ok 1 | 2026-11-24 |
| administrator.de | 1/1 | ok 1 | 2026-11-11 |
| adnabu.com | 1/1 | ok 1 | 2026-11-03 |
| advertisinglaw.fkks.com | 0/1 | redirect 1 | never |
| agentdeals.dev | 1/1 | ok 1 | 2026-11-18 |
| ahaslides.com | 1/1 | ok 1 | 2026-11-17 |
| ai.varsitytutors.com | 1/1 | ok 1 | 2026-11-06 |
| airbtics.com | 1/1 | ok 1 | 2026-11-23 |
| airroi.com | 1/1 | ok 1 | 2026-11-23 |
| allenstraining.com.au | 1/1 | ok 1 | 2026-11-24 |
| allitservices.com.au | 1/1 | ok 1 | 2026-11-11 |
| answers.justia.com | 0/1 | http_403 1 | never |
| api-docs.invoicing.co | 1/1 | ok 1 | 2026-11-19 |
| api.regulations.gov | 0/1 | http_429 1 | never |
| api.www.sbir.gov | 0/1 | http_403 1 | never |
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
| billdrpro.featurebase.app | 1/1 | ok 1 | 2026-11-23 |
| birdeye.com | 1/1 | ok 1 | 2026-11-20 |
| bitwarden.com | 1/1 | ok 1 | 2026-11-18 |
| biz.booksy.com | 1/1 | ok 1 | 2026-11-12 |
| blog.coupler.io | 1/1 | ok 1 | 2026-11-18 |
| blog.groupmail.io | 1/1 | ok 1 | 2026-11-07 |
| blog.petpooja.com | 1/1 | ok 1 | 2026-11-23 |
| blog.protrainings.com | 1/1 | ok 1 | 2026-11-24 |
| blog.report-uri.com | 1/1 | ok 1 | 2026-11-04 |
| blog.symquest.com | 1/1 | ok 1 | 2026-11-11 |
| blog.taxbandits.com | 1/1 | ok 1 | 2026-11-07 |
| blog.techsoup.org | 1/1 | ok 1 | 2026-11-07 |
| blog.uplisting.io | 0/1 | redirect 1 | never |
| blog.usablenet.com | 1/1 | ok 1 | 2026-11-07 |
| blog.zenodo.org | 1/1 | ok 1 | 2026-11-25 |
| blogs.intuit.com | 0/1 | http_403 1 | never |
| bluehillslive.azurewebsites.net | 1/1 | ok 1 | 2026-11-24 |
| boards.straightdope.com | 1/1 | ok 1 | 2026-11-22 |
| bolt.new | 1/1 | ok 1 | 2026-11-25 |
| bookkeep.com | 1/1 | ok 1 | 2026-11-07 |
| booksbackup.com | 1/1 | ok 1 | 2026-11-19 |
| bookwhen.com | 1/1 | ok 1 | 2026-11-08 |
| bostonwebgroup.com | 1/1 | ok 1 | 2026-11-07 |
| breww.com | 1/1 | ok 1 | 2026-11-12 |
| brightsg.com | 1/1 | ok 1 | 2026-11-12 |
| btcsoftware.co.uk | 1/1 | ok 1 | 2026-11-21 |
| btcson66-rgb.github.io | 1/1 | ok 1 | 2026-11-25 |
| bunny.net | 1/1 | ok 1 | 2026-11-24 |
| business.gov.au | 0/1 | http_404 1 | never |
| businesscloud.co.uk | 1/1 | ok 1 | 2026-11-21 |
| buunto.helpscoutdocs.com | 1/1 | ok 1 | 2026-11-22 |
| ca-rcf.evokeplatform.com | 0/1 | empty 1 | never |
| cakerybakeries.com | 1/1 | ok 1 | 2026-11-06 |
| calendly.stoplight.io | 1/1 | ok 1 | 2026-11-20 |
| capterra.com | 0/1 | http_403 1 | never |
| careerbridge.wa.gov | 1/1 | ok 1 | 2026-11-21 |
| careers-mrocorp.icims.com | 0/1 | http_404 1 | never |
| careers.csudh.edu | 0/1 | empty 1 | never |
| catchingnumbers.com | 1/1 | ok 1 | 2026-11-18 |
| cause-comply.onrender.com | 0/1 | http_5xx 1 | never |
| cbs12.com | 1/1 | ok 1 | 2026-11-06 |
| cdlpowersuite.com | 1/1 | ok 1 | 2026-11-17 |
| cdn.cdata.com | 1/1 | ok 1 | 2026-11-14 |
| ce-go.com | 0/1 | empty 1 | never |
| central.xero.com | 0/1 | empty 1 | never |
| centroassist.com.au | 1/1 | ok 1 | 2026-11-21 |
| changestoukcompanylaw.campaign.gov.uk | 1/1 | ok 1 | 2026-11-19 |
| charitycompliancesolutions.com | 1/1 | ok 1 | 2026-11-07 |
| chatgate.ai | 1/1 | ok 1 | 2026-11-18 |
| choicepaid.com | 1/1 | ok 1 | 2026-11-10 |
| ci-governor-c3ke.onrender.com | 0/1 | http_5xx 1 | never |
| circle.so | 1/1 | ok 1 | 2026-11-24 |
| citl.indiana.edu | 1/1 | ok 1 | 2026-11-25 |
| clarity.eco | 1/1 | ok 1 | 2026-11-12 |
| classic.ptotoday.com | 0/1 | redirect 1 | never |
| classic.skagitcountywa.gov | 1/1 | ok 1 | 2026-11-13 |
| clearlycomply.org | 1/1 | ok 1 | 2026-11-23 |
| click2houston.com | 1/1 | ok 1 | 2026-11-10 |
| clockspot.com | 1/1 | ok 1 | 2026-11-07 |
| cloud.wikis.utexas.edu | 0/1 | empty 1 | never |
| cms.law | 1/1 | ok 1 | 2026-11-22 |
| cobaltextensions.wildapricot.org | 1/1 | ok 1 | 2026-11-07 |
| coddy.tech | 0/1 | http_403 1 | never |
| codeboard.io | 1/1 | ok 1 | 2026-11-01 |
| codecanyon.net | 1/1 | ok 1 | 2026-11-06 |
| codeteach.featurebase.app | 1/1 | ok 1 | 2026-11-25 |
| codio.com | 0/1 | empty 1 | never |
| coefficient.io | 1/1 | ok 1 | 2026-11-24 |
| coffeewp.dev | 0/1 | http_403 1 | never |
| coloradosun.com | 1/1 | ok 1 | 2026-11-06 |
| commission.europa.eu | 1/1 | ok 1 | 2026-11-08 |
| community.adobe.com | 1/1 | ok 1 | 2026-11-25 |
| community.airbnb.com | 0/1 | redirect 1 | never |
| community.articulate.com | 0/1 | http_403 1 | never |
| community.breww.com | 1/1 | ok 1 | 2026-11-12 |
| community.cal.com | 0/1 | timeout 1 | never |
| community.canva.com | 0/1 | timeout 1 | never |
| community.cliniko.com | 0/1 | redirect 1 | never |
| community.ebay.co.uk | 0/1 | empty 1 | never |
| community.ebay.com | 1/1 | ok 1 | 2026-11-22 |
| community.ecwid.com | 0/1 | http_404 1 | never |
| community.foundant.com | 1/1 | ok 1 | 2026-11-24 |
| community.givebutter.com | 1/1 | ok 1 | 2026-11-24 |
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
| community.squarespace.com | 0/1 | http_404 1 | never |
| community.teachable.com | 0/1 | http_404 1 | never |
| community.thinkific.com | 0/1 | timeout 1 | never |
| community.usa.canon.com | 0/1 | redirect 1 | never |
| complianz.io | 1/1 | ok 1 | 2026-11-02 |
| connecteam.com | 1/1 | ok 1 | 2026-11-06 |
| consentcheck.online | 0/1 | http_404 1 | never |
| contra.com | 0/1 | empty 1 | never |
| controlchelp.freshdesk.com | 0/1 | redirect 1 | never |
| conventuslaw.com | 1/1 | ok 1 | 2026-11-25 |
| convertcalculator.com | 1/1 | ok 1 | 2026-11-23 |
| costbench.com | 1/1 | ok 1 | 2026-11-18 |
| coursecheck.com | 1/1 | ok 1 | 2026-11-24 |
| cprenroll.com | 1/1 | ok 1 | 2026-11-24 |
| cpw.state.co.us:443 | 0/1 | http_404 1 | never |
| craready.pages.dev | 1/1 | ok 1 | 2026-11-11 |
| creativehub.io | 1/1 | ok 1 | 2026-11-22 |
| creativeresources.threadless.com | 1/1 | ok 1 | 2026-11-22 |
| croner.co.uk | 1/1 | ok 1 | 2026-11-21 |
| cronitor.io | 1/1 | ok 1 | 2026-11-04 |
| cside.com | 1/1 | ok 1 | 2026-11-04 |
| csteachers.org | 1/1 | ok 1 | 2026-11-24 |
| cushionapp.com | 1/1 | ok 1 | 2026-11-18 |
| cutler.portfolio.arts.ubc.ca | 1/1 | ok 1 | 2026-11-25 |
| cvdportal.com | 1/1 | ok 1 | 2026-11-11 |
| danger.systems | 1/1 | ok 1 | 2026-11-25 |
| data.iana.org | 1/1 | ok 1 | 2026-11-18 |
| datadryad.org | 1/1 | ok 1 | 2026-11-11 |
| demo.cvdportal.com | 0/1 | redirect 1 | never |
| developer.android.com | 1/1 | ok 1 | 2026-11-25 |
| developer.candid.org | 1/1 | ok 1 | 2026-11-07 |
| developer.nylas.com | 1/1 | ok 1 | 2026-11-18 |
| developer.service.hmrc.gov.uk | 1/1 | ok 1 | 2026-11-12 |
| developers.cloudflare.com | 1/1 | ok 1 | 2026-11-25 |
| developers.hubspot.com | 1/1 | ok 1 | 2026-11-18 |
| developers.kajabi.com | 0/1 | http_404 1 | never |
| developers.mindbodyonline.com | 1/1 | ok 1 | 2026-11-23 |
| developers.openai.com | 1/1 | ok 1 | 2026-11-18 |
| developers.redhat.com | 1/1 | ok 1 | 2026-11-25 |
| developers.zenodo.org | 1/1 | ok 1 | 2026-11-25 |
| devops-actions.github.io | 0/1 | http_404 1 | never |
| digital-client-solutions.hlc.com | 1/1 | ok 1 | 2026-11-25 |
| digital-client-solutions.hoganlovells.com | 0/1 | redirect 1 | never |
| disclo.eu | 1/1 | ok 1 | 2026-11-25 |
| discourse.datamethods.org | 0/1 | empty 1 | never |
| discuss.h5p.org | 0/1 | timeout 1 | never |
| dmarc.postmarkapp.com | 1/1 | ok 1 | 2026-11-25 |
| dmarcian.com | 1/1 | ok 1 | 2026-11-25 |
| docparser.com | 1/1 | ok 1 | 2026-11-19 |
| docs-shpf.bsscommerce.com | 1/1 | ok 1 | 2026-11-20 |
| docs.codegra.de | 0/1 | environment 1 | never |
| docs.codio.com | 1/1 | ok 1 | 2026-11-25 |
| docs.cronofy.com | 0/1 | http_404 1 | never |
| docs.gumlet.com | 1/1 | ok 1 | 2026-11-24 |
| docs.hirepos.com | 1/1 | ok 1 | 2026-11-08 |
| docs.k-id.com | 1/1 | ok 1 | 2026-11-24 |
| docs.lemonsqueezy.com | 1/1 | ok 1 | 2026-11-22 |
| docs.moodle.org | 1/1 | ok 1 | 2026-11-24 |
| docs.numbas.org.uk | 1/1 | ok 1 | 2026-11-25 |
| docs.patchstack.com | 1/1 | ok 1 | 2026-11-25 |
| docs.prairielearn.com | 1/1 | ok 1 | 2026-11-25 |
| docs.railway.com | 1/1 | ok 1 | 2026-11-18 |
| docs.replit.com | 1/1 | ok 1 | 2026-11-25 |
| docs.retellai.com | 1/1 | ok 1 | 2026-11-09 |
| docs.smrtphone.io | 0/1 | redirect 1 | never |
| docs.solidtime.io | 1/1 | ok 1 | 2026-11-18 |
| docs.studiobase.org | 1/1 | ok 1 | 2026-11-18 |
| docs.withampersand.com | 1/1 | ok 1 | 2026-11-19 |
| docsio.co | 1/1 | ok 1 | 2026-11-25 |
| domainmod.org | 1/1 | ok 1 | 2026-11-18 |
| donationdocket.com.au | 1/1 | ok 1 | 2026-11-07 |
| donationmanager.co.nz | 1/1 | ok 1 | 2026-11-07 |
| donorseek.com | 1/1 | ok 1 | 2026-11-07 |
| dotgolf.freshdesk.com | 0/1 | http_404 1 | never |
| doublehq.com | 1/1 | ok 1 | 2026-11-14 |
| downloads.nbcc.org | 0/1 | http_5xx 1 | never |
| doyleclayton.co.uk | 1/1 | ok 1 | 2026-11-21 |
| doyouok.com | 1/1 | ok 1 | 2026-11-04 |
| dwfgroup.com | 1/1 | ok 1 | 2026-11-22 |
| easydmarc.com | 1/1 | ok 1 | 2026-11-25 |
| easyship.com | 1/1 | ok 1 | 2026-11-08 |
| ecom-tools.de | 1/1 | ok 1 | 2026-11-22 |
| economie.gouv.fr | 0/1 | http_403 1 | never |
| ecosio.com | 0/1 | http_403 1 | never |
| ecosire.com | 1/1 | ok 1 | 2026-11-03 |
| ecosystem.hubspot.com | 1/1 | ok 1 | 2026-11-23 |
| edd.ca.gov | 1/1 | ok 1 | 2026-11-21 |
| edsurge.com | 1/1 | ok 1 | 2026-11-24 |
| edtechimpact.com | 1/1 | ok 1 | 2026-11-24 |
| edubracket.com | 1/1 | ok 1 | 2026-11-10 |
| educationfreedom.texas.gov | 1/1 | ok 1 | 2026-11-10 |
| educationhub.blog.gov.uk | 1/1 | ok 1 | 2026-11-24 |
| egazette.gov.in | 0/1 | http_5xx 1 | never |
| elabftw.net | 1/1 | ok 1 | 2026-11-25 |
| elementor.com | 0/1 | http_404 1 | never |
| elvanto.com | 1/1 | ok 1 | 2026-11-07 |
| emailmeter.com | 1/1 | ok 1 | 2026-11-06 |
| englandkorfball.co.uk | 1/1 | ok 1 | 2026-11-14 |
| entreprendre.service-public.gouv.fr | 1/1 | ok 1 | 2026-11-19 |
| epi.pgcps.org | 1/1 | ok 1 | 2026-11-24 |
| er.educause.edu | 0/1 | http_403 1 | never |
| erank.com | 1/1 | ok 1 | 2026-11-01 |
| ethyca.github.io | 1/1 | ok 1 | 2026-11-25 |
| evalato.com | 1/1 | ok 1 | 2026-11-24 |
| eventrentalsystems.com | 1/1 | ok 1 | 2026-11-18 |
| everlance.com | 1/1 | ok 1 | 2026-11-06 |
| everlystastro.pages.dev | 1/1 | ok 1 | 2026-11-08 |
| evolutionplatform.poolwerx.com.au | 0/1 | redirect 1 | never |
| exam.net | 1/1 | ok 1 | 2026-11-25 |
| exponentphilanthropy.org | 1/1 | ok 1 | 2026-11-24 |
| fazier.com | 1/1 | ok 1 | 2026-11-18 |
| features.wpamelia.com | 0/1 | http_403 1 | never |
| feedback.beacons.ai | 0/1 | http_403 1 | never |
| feedback.donorbox.org | 0/1 | timeout 1 | never |
| feedback.givebutter.com | 0/1 | timeout 1 | never |
| feedback.picflow.com | 0/1 | http_404 1 | never |
| feedback.pixellu.com | 0/1 | redirect 1 | never |
| feedback.withmoxie.com | 0/1 | http_404 1 | never |
| fightspam-combattrelepourriel.ised-isde.canada.ca | 1/1 | ok 1 | 2026-11-24 |
| finitestate.io | 0/1 | timeout 1 | never |
| flowlert.com | 1/1 | ok 1 | 2026-11-04 |
| flsenate.gov | 1/1 | ok 1 | 2026-11-24 |
| foodlabelmaker.com | 0/1 | empty 1 | never |
| foodtruckfiesta.com | 0/1 | allowlist 1 | never |
| formreceipt.com | 1/1 | ok 1 | 2026-11-25 |
| formspree.io | 1/1 | ok 1 | 2026-11-25 |
| formtester365.com | 1/1 | ok 1 | 2026-11-25 |
| formwatch.app | 1/1 | ok 1 | 2026-11-25 |
| forum.blocsapp.com | 1/1 | ok 1 | 2026-11-18 |
| forum.dolibarr.org | 0/1 | timeout 1 | never |
| forum.gnucash.org | 0/1 | empty 1 | never |
| forum.heatinghelp.com | 1/1 | ok 1 | 2026-11-13 |
| forum.howtoforge.com | 0/1 | http_403 1 | never |
| forum.moodle.org | 0/1 | timeout 1 | never |
| forum.odrive.com | 1/1 | ok 1 | 2026-11-18 |
| forum.openwrt.org | 0/1 | http_429 1 | never |
| forum.shopware.com | 1/1 | ok 1 | 2026-11-23 |
| forum.thirtybees.com | 1/1 | ok 1 | 2026-11-22 |
| forum.tutorcruncher.com | 0/1 | timeout 1 | never |
| forums.whirlpool.net.au | 0/1 | http_403 1 | never |
| freelancer.com | 1/1 | ok 1 | 2026-11-25 |
| freetier-sentinel.dev | 1/1 | ok 1 | 2026-11-18 |
| fresha.com | 1/1 | ok 1 | 2026-11-12 |
| frontdeskreview.com | 1/1 | ok 1 | 2026-11-18 |
| geekbot.com | 1/1 | ok 1 | 2026-11-25 |
| get.popmenu.com | 0/1 | http_403 1 | never |
| getbcs.com | 1/1 | ok 1 | 2026-11-12 |
| getesapaid.com | 1/1 | ok 1 | 2026-11-10 |
| getholdings.com | 0/1 | http_404 1 | never |
| getjobber.com | 1/1 | ok 1 | 2026-11-18 |
| getsquire.com | 1/1 | ok 1 | 2026-11-12 |
| gettingstarted.tutorbird.com | 0/1 | http_5xx 1 | never |
| getweeklyupdate.com | 0/1 | http_5xx 1 | never |
| gh.io | 0/1 | redirect 1 | never |
| ginkoflorist.pages.dev | 1/1 | ok 1 | 2026-11-13 |
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
| greptile.com | 1/1 | ok 1 | 2026-11-25 |
| guide.runestone.academy | 1/1 | ok 1 | 2026-11-25 |
| gymdesk.com | 1/1 | ok 1 | 2026-11-23 |
| h10y.github.io | 1/1 | ok 1 | 2026-11-25 |
| h30434.www3.hp.com | 0/1 | http_403 1 | never |
| hacker-news.firebaseio.com | 1/1 | ok 1 | 2026-11-24 |
| haflarental.com | 1/1 | ok 1 | 2026-11-18 |
| handbook.la-archdiocese.org | 0/1 | redirect 1 | never |
| hbkcpa.com | 0/1 | redirect 1 | never |
| hbkgroup.com | 1/1 | ok 1 | 2026-11-23 |
| health.hawaii.gov | 1/1 | ok 1 | 2026-11-20 |
| hello.showmojo.com | 1/1 | ok 1 | 2026-11-13 |
| hellobonsai.com | 1/1 | ok 1 | 2026-11-25 |
| help-donorfy.theaccessgroup.com | 1/1 | ok 1 | 2026-11-14 |
| help.apprenticeships.education.gov.uk | 0/1 | http_403 1 | never |
| help.archive.org | 1/1 | ok 1 | 2026-11-24 |
| help.artworkarchive.com | 1/1 | ok 1 | 2026-11-22 |
| help.buildern.com | 1/1 | ok 1 | 2026-11-23 |
| help.buildpass.ai | 1/1 | ok 1 | 2026-11-12 |
| help.ce-go.com | 1/1 | ok 1 | 2026-11-07 |
| help.cebroker.com | 0/1 | http_403 1 | never |
| help.deputy.com | 0/1 | http_403 1 | never |
| help.elearningindustry.com | 1/1 | ok 1 | 2026-11-24 |
| help.elvanto.com | 0/1 | http_403 1 | never |
| help.fergus.com | 1/1 | ok 1 | 2026-11-12 |
| help.formspree.io | 1/1 | ok 1 | 2026-11-25 |
| help.geekbot.com | 1/1 | ok 1 | 2026-11-25 |
| help.gohighlevel.com | 1/1 | ok 1 | 2026-11-09 |
| help.housecallpro.com | 1/1 | ok 1 | 2026-11-13 |
| help.instrumentl.com | 1/1 | ok 1 | 2026-11-24 |
| help.jackrabbitclass.com | 0/1 | empty 1 | never |
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
| help.zenamu.com | 1/1 | ok 1 | 2026-11-24 |
| helpcenter.websitex5.com | 0/1 | http_403 1 | never |
| helpdesk.scoutsqld.com.au | 1/1 | ok 1 | 2026-11-07 |
| helpsupport.redcross.ca | 0/1 | http_403 1 | never |
| hia.com.au | 1/1 | ok 1 | 2026-11-23 |
| hiverhq.com | 1/1 | ok 1 | 2026-11-06 |
| honestyjar.app | 0/1 | http_5xx 1 | never |
| hookdeck.com | 1/1 | ok 1 | 2026-11-03 |
| housecallpro.com | 1/1 | ok 1 | 2026-11-13 |
| hovn.app | 1/1 | ok 1 | 2026-11-24 |
| hubbardswim.helpjuice.com | 0/1 | redirect 1 | never |
| hunted.space | 1/1 | ok 1 | 2026-11-11 |
| icer2026.acm.org | 1/1 | ok 1 | 2026-11-25 |
| ideas.gohighlevel.com | 1/1 | ok 1 | 2026-11-21 |
| indiehackers.com | 0/1 | http_403 1 | never |
| inflowave.netlify.app | 0/1 | http_404 1 | never |
| info.adp.com | 0/1 | empty 1 | never |
| info.nookal.com | 1/1 | ok 1 | 2026-11-21 |
| infoq.com | 1/1 | ok 1 | 2026-11-25 |
| insightfulaccountant.com | 1/1 | ok 1 | 2026-11-19 |
| instarenewal.com | 1/1 | ok 1 | 2026-11-18 |
| integrately.com | 1/1 | ok 1 | 2026-11-20 |
| integratestack.pages.dev | 1/1 | ok 1 | 2026-11-08 |
| invoicequickly.com | 1/1 | ok 1 | 2026-11-18 |
| invoicesherpa.com | 1/1 | ok 1 | 2026-11-19 |
| iris.co.uk | 1/1 | ok 1 | 2026-11-21 |
| is.wordpress.org | 1/1 | ok 1 | 2026-11-21 |
| itali.uq.edu.au | 1/1 | ok 1 | 2026-11-25 |
| itbrief.co.nz | 1/1 | ok 1 | 2026-11-20 |
| itbrief.com.au | 1/1 | ok 1 | 2026-11-19 |
| its.umich.edu | 0/1 | http_403 1 | never |
| ja.wordpress.org | 1/1 | ok 1 | 2026-11-22 |
| javascript.plainenglish.io | 0/1 | http_5xx 1 | never |
| jcetf.org | 1/1 | ok 1 | 2026-11-24 |
| jentic.com | 1/1 | ok 1 | 2026-11-22 |
| jobs.mehi.masstech.org | 1/1 | ok 1 | 2026-11-07 |
| joinblvd.com | 1/1 | ok 1 | 2026-11-12 |
| jorijn.com | 0/1 | redirect 1 | never |
| jotform.com | 0/1 | empty 1 | never |
| jules.google | 1/1 | ok 1 | 2026-11-18 |
| k12.helperhelper.com | 1/1 | ok 1 | 2026-11-24 |
| karbonhq.com | 1/1 | ok 1 | 2026-11-07 |
| katanamrp.com | 1/1 | ok 1 | 2026-11-22 |
| katv.com | 1/1 | ok 1 | 2026-11-10 |
| kb.7shifts.com | 0/1 | http_403 1 | never |
| kb.drakesoftware.com | 0/1 | http_404 1 | never |
| keito.ai | 1/1 | ok 1 | 2026-11-18 |
| kidsafe.com | 1/1 | ok 1 | 2026-11-24 |
| knowledge.redcrossfirstaidtraining.co.uk | 1/1 | ok 1 | 2026-11-24 |
| kourses.com | 1/1 | ok 1 | 2026-11-03 |
| krita-artists.org | 1/1 | ok 1 | 2026-11-22 |
| kulqiz.pages.dev | 1/1 | ok 1 | 2026-11-18 |
| labarchives.com | 1/1 | ok 1 | 2026-11-25 |
| labquiz.readthedocs.io | 1/1 | ok 1 | 2026-11-25 |
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
| library.harvard.edu | 1/1 | ok 1 | 2026-11-25 |
| library.hkust.edu.hk | 1/1 | ok 1 | 2026-11-25 |
| linkfix.app | 1/1 | ok 1 | 2026-11-08 |
| lit-and-more.com | 1/1 | ok 1 | 2026-11-10 |
| litcommerce.com | 1/1 | ok 1 | 2026-11-10 |
| localline.co | 1/1 | ok 1 | 2026-11-18 |
| loopnet.ca | 0/1 | http_403 1 | never |
| lovable.dev | 1/1 | ok 1 | 2026-11-25 |
| lowcountryfoodbank.org | 1/1 | ok 1 | 2026-11-24 |
| lr.sudovanilla.org | 0/1 | http_404 1 | never |
| mailchimp.com | 1/1 | ok 1 | 2026-11-20 |
| mailparser.io | 1/1 | ok 1 | 2026-11-19 |
| mailroute.net | 1/1 | ok 1 | 2026-11-22 |
| make.wordpress.org | 1/1 | ok 1 | 2026-11-25 |
| marketplace.simprogroup.com | 0/1 | http_403 1 | never |
| mc.merill.net | 1/1 | ok 1 | 2026-11-11 |
| mclibrary.duke.edu | 1/1 | ok 1 | 2026-11-11 |
| mcpservers.org | 0/1 | http_403 1 | never |
| menssheds.org.uk | 1/1 | ok 1 | 2026-11-21 |
| mikellane.com | 1/1 | ok 1 | 2026-11-10 |
| mintlify.wiki | 0/1 | http_404 1 | never |
| mitti.com | 1/1 | ok 1 | 2026-11-21 |
| mjtsai.com | 1/1 | ok 1 | 2026-11-08 |
| mn.gov | 1/1 | ok 1 | 2026-11-24 |
| moclaw.ai | 0/1 | empty 1 | never |
| monk.com | 1/1 | ok 1 | 2026-11-12 |
| mosscpa.com | 1/1 | ok 1 | 2026-11-07 |
| motopress.com | 0/1 | http_403 1 | never |
| mtc.gov | 1/1 | ok 1 | 2026-11-23 |
| mynews13.com | 1/1 | ok 1 | 2026-11-06 |
| myob.lithium.com | 0/1 | http_403 1 | never |
| nango.dev | 1/1 | ok 1 | 2026-11-19 |
| nbcc.org | 1/1 | ok 1 | 2026-11-24 |
| ncbtmb.org | 0/1 | http_404 1 | never |
| ndisregistrationsupport.ahpa.com.au | 0/1 | http_5xx 1 | never |
| netlify.com | 1/1 | ok 1 | 2026-11-25 |
| newpathconsulting.com | 1/1 | ok 1 | 2026-11-07 |
| news.delaware.gov | 1/1 | ok 1 | 2026-11-23 |
| nextmeapp.com | 1/1 | ok 1 | 2026-11-12 |
| nodehero.io | 0/1 | timeout 1 | never |
| nonprofitlawblog.com | 1/1 | ok 1 | 2026-11-07 |
| notbyai.fyi | 1/1 | ok 1 | 2026-11-10 |
| nporesources.com | 1/1 | ok 1 | 2026-11-07 |
| numbas.mathcentre.ac.uk | 1/1 | ok 1 | 2026-11-25 |
| nursingworld.org | 1/1 | ok 1 | 2026-11-24 |
| nwelearn2026.sched.com | 0/1 | http_403 1 | never |
| nysenate.gov | 1/1 | ok 1 | 2026-11-23 |
| nz.trustpilot.com | 1/1 | ok 1 | 2026-11-24 |
| oia.pmc.gov.au | 0/1 | http_404 1 | never |
| oit.duke.edu | 1/1 | ok 1 | 2026-11-24 |
| omb.report | 1/1 | ok 1 | 2026-11-17 |
| omr.com | 1/1 | ok 1 | 2026-11-12 |
| onde.app | 1/1 | ok 1 | 2026-11-06 |
| onvolunteers.com | 1/1 | ok 1 | 2026-11-24 |
| ora.stanford.edu | 1/1 | ok 1 | 2026-11-11 |
| orchid.ganoksin.com | 1/1 | ok 1 | 2026-11-08 |
| originality.ai | 1/1 | ok 1 | 2026-11-10 |
| ourvolts.uservoice.com | 0/1 | http_404 1 | never |
| outbound-emails.netlify.com | 1/1 | ok 1 | 2026-11-25 |
| outschool.com | 1/1 | ok 1 | 2026-11-24 |
| oxpecker.dev | 1/1 | ok 1 | 2026-11-18 |
| pagecrawl.io | 1/1 | ok 1 | 2026-11-18 |
| pages.twilio.com | 1/1 | ok 1 | 2026-11-12 |
| par.nsf.gov | 1/1 | ok 1 | 2026-11-25 |
| parseur.com | 1/1 | ok 1 | 2026-11-19 |
| partners.nicejob.com | 1/1 | ok 1 | 2026-11-20 |
| pasqualepillitteri.it | 0/1 | empty 1 | never |
| passkit.com | 1/1 | ok 1 | 2026-11-21 |
| patch.com | 1/1 | ok 1 | 2026-11-23 |
| pathtoship.com | 1/1 | ok 1 | 2026-11-25 |
| patient-protect.com | 1/1 | ok 1 | 2026-11-20 |
| payoutcheck.online | 1/1 | ok 1 | 2026-11-06 |
| payoutpilot.pages.dev | 0/1 | empty 1 | never |
| payroller.com.au | 1/1 | ok 1 | 2026-11-16 |
| pbpatl.org | 1/1 | ok 1 | 2026-11-07 |
| peerlist.io | 0/1 | http_403 1 | never |
| peerpush.com | 1/1 | ok 1 | 2026-11-18 |
| peerpush.net | 1/1 | ok 1 | 2026-11-04 |
| pentest-tools.com | 1/1 | ok 1 | 2026-11-25 |
| peppol.org | 1/1 | ok 1 | 2026-11-21 |
| perfectbooking.co.uk | 1/1 | ok 1 | 2026-11-23 |
| pickalpaca.com | 1/1 | ok 1 | 2026-11-13 |
| pickyourapp.com | 1/1 | ok 1 | 2026-11-19 |
| pillar.science | 1/1 | ok 1 | 2026-11-25 |
| pl.trustpilot.com | 1/1 | ok 1 | 2026-11-24 |
| pmc.ncbi.nlm.nih.gov | 1/1 | ok 1 | 2026-11-25 |
| podia.com | 1/1 | ok 1 | 2026-11-24 |
| policycommons.net | 0/1 | http_403 1 | never |
| polycount.com | 0/1 | http_403 1 | never |
| poolwerx.freshdesk.com | 0/1 | redirect 1 | never |
| pope.tech | 1/1 | ok 1 | 2026-11-07 |
| postmarkapp.com | 1/1 | ok 1 | 2026-11-19 |
| prairielearn.com | 1/1 | ok 1 | 2026-11-25 |
| pricebook.digital | 1/1 | ok 1 | 2026-11-13 |
| printify.com | 1/1 | ok 1 | 2026-11-22 |
| privacylawmap.com | 1/1 | ok 1 | 2026-11-24 |
| privacytools.uk | 1/1 | ok 1 | 2026-11-23 |
| privycdp.org | 1/1 | ok 1 | 2026-11-25 |
| productupdates.getjobber.com | 0/1 | http_403 1 | never |
| projects.raspberrypi.org | 0/1 | empty 1 | never |
| publer.com | 1/1 | ok 1 | 2026-11-06 |
| publicea.be | 1/1 | ok 1 | 2026-11-25 |
| publichealthmdc.com | 1/1 | ok 1 | 2026-11-13 |
| puppetvendors.com | 1/1 | ok 1 | 2026-11-22 |
| pushnote-azure.vercel.app | 1/1 | ok 1 | 2026-11-18 |
| pyodide.org | 1/1 | ok 1 | 2026-11-25 |
| pyodide.readthedocs.io | 0/1 | redirect 1 | never |
| pypistats.org | 1/1 | ok 1 | 2026-11-18 |
| python-coach.pages.dev | 0/1 | redirect 1 | never |
| pythoncoach.org | 1/1 | ok 1 | 2026-11-25 |
| qminder.com | 1/1 | ok 1 | 2026-11-12 |
| qodo-merge-docs.qodo.ai | 0/1 | redirect 1 | never |
| rct.doj.ca.gov | 0/1 | http_404 1 | never |
| rdap.org | 1/1 | ok 1 | 2026-11-18 |
| reachrightstudios.com | 1/1 | ok 1 | 2026-11-07 |
| readme.com | 1/1 | ok 1 | 2026-11-25 |
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
| restrictedbooks.pages.dev | 0/1 | environment 1 | never |
| roastertools.com | 1/1 | ok 1 | 2026-11-20 |
| rootbrief.com | 1/1 | ok 1 | 2026-11-04 |
| rtl.berkeley.edu | 1/1 | ok 1 | 2026-11-01 |
| rules.cityofnewyork.us | 1/1 | ok 1 | 2026-11-23 |
| runestone.academy | 0/1 | http_403 1 | never |
| rusticisoftware.com | 1/1 | ok 1 | 2026-11-24 |
| sage.hr | 0/1 | http_403 1 | never |
| salepager.com | 1/1 | ok 1 | 2026-11-10 |
| salesmessage.com | 1/1 | ok 1 | 2026-11-20 |
| salisbury.anglican.org | 1/1 | ok 1 | 2026-11-14 |
| sandtime.io | 1/1 | ok 1 | 2026-11-18 |
| satvasolutions.com | 1/1 | ok 1 | 2026-11-14 |
| sbirland.com | 1/1 | ok 1 | 2026-11-11 |
| sc-ctsi.org | 0/1 | http_404 1 | never |
| scchgs.org | 1/1 | ok 1 | 2026-11-24 |
| schedulingkit.com | 1/1 | ok 1 | 2026-11-18 |
| schoolinks.com | 1/1 | ok 1 | 2026-11-24 |
| scispace.com | 0/1 | http_403 1 | never |
| scorm.com | 1/1 | ok 1 | 2026-11-24 |
| senders.yahooinc.com | 1/1 | ok 1 | 2026-11-25 |
| senderz-website.pages.dev | 1/1 | ok 1 | 2026-11-04 |
| sendstatus.co | 0/1 | http_5xx 1 | never |
| senedd.wales | 1/1 | ok 1 | 2026-11-23 |
| serchen.com | 0/1 | http_403 1 | never |
| services.maps.cdtfa.ca.gov | 1/1 | ok 1 | 2026-11-23 |
| sherpa-online.com | 0/1 | http_403 1 | never |
| shiptheory.com | 1/1 | ok 1 | 2026-11-22 |
| sickgaming.net | 1/1 | ok 1 | 2026-11-22 |
| sift-health.pages.dev | 1/1 | ok 1 | 2026-11-02 |
| silktide.com | 1/1 | ok 1 | 2026-11-07 |
| simplitrain.com | 1/1 | ok 1 | 2026-11-24 |
| simply-docs.co.uk | 1/1 | ok 1 | 2026-11-23 |
| simplyk.canny.io | 1/1 | ok 1 | 2026-11-21 |
| smartwaiver.com | 0/1 | http_403 1 | never |
| smythmyke.github.io | 1/1 | ok 1 | 2026-11-15 |
| sotonac.sharepoint.com | 0/1 | http_403 1 | never |
| speechpathologyaustralia.org.au | 1/1 | ok 1 | 2026-11-21 |
| spendwall.app | 1/1 | ok 1 | 2026-11-18 |
| spiromedia.featurebase.app | 1/1 | ok 1 | 2026-11-22 |
| sport.nspcc.org.uk | 1/1 | ok 1 | 2026-11-14 |
| springernature.com | 1/1 | ok 1 | 2026-11-25 |
| sproutinvoices.com | 1/1 | ok 1 | 2026-11-18 |
| ssaes.org | 1/1 | ok 1 | 2026-11-24 |
| sslmate.com | 1/1 | ok 1 | 2026-11-25 |
| stamps.org | 1/1 | ok 1 | 2026-11-24 |
| startupstash.com | 1/1 | ok 1 | 2026-11-25 |
| static.developer.intuit.com | 1/1 | ok 1 | 2026-11-19 |
| stayinscope.com | 1/1 | ok 1 | 2026-11-25 |
| streetfoodfinder.com | 0/1 | http_403 1 | never |
| studentprivacy.ed.gov | 1/1 | ok 1 | 2026-11-24 |
| studioformakers.pages.dev | 1/1 | ok 1 | 2026-11-22 |
| support.approvalmax.com | 1/1 | ok 1 | 2026-11-14 |
| support.aptem.co.uk | 0/1 | http_403 1 | never |
| support.banqup.com | 1/1 | ok 1 | 2026-11-20 |
| support.bud.co.uk | 0/1 | http_403 1 | never |
| support.centroassist.com.au | 0/1 | http_403 1 | never |
| support.cezoom.com | 1/1 | ok 1 | 2026-11-24 |
| support.churchsuite.com | 0/1 | http_403 1 | never |
| support.claude.com | 1/1 | ok 1 | 2026-11-25 |
| support.cmts.jhu.edu | 0/1 | http_403 1 | never |
| support.glofox.com | 0/1 | http_403 1 | never |
| support.gocardless.com | 1/1 | ok 1 | 2026-11-20 |
| support.iclasspro.com | 0/1 | http_403 1 | never |
| support.patreon.com | 0/1 | http_403 1 | never |
| support.punchpass.com | 1/1 | ok 1 | 2026-11-18 |
| support.respondus.com | 1/1 | ok 1 | 2026-11-25 |
| support.saasant.com | 1/1 | ok 1 | 2026-11-05 |
| support.smoobu.com | 0/1 | http_403 1 | never |
| support.splose.com | 0/1 | http_404 1 | never |
| support.squarespace.com | 1/1 | ok 1 | 2026-11-22 |
| support.taxcloud.com | 0/1 | http_404 1 | never |
| support.wildapricot.com | 0/1 | http_403 1 | never |
| support.wix.com | 1/1 | ok 1 | 2026-11-20 |
| support.wrkr.com.au | 0/1 | http_403 1 | never |
| support.zenodo.org | 0/1 | empty 1 | never |
| support.zoom.com | 1/1 | ok 1 | 2026-11-24 |
| swarmify.com | 1/1 | ok 1 | 2026-11-24 |
| swiftaid.co.uk | 1/1 | ok 1 | 2026-11-14 |
| sylvanassurance.pages.dev | 0/1 | http_404 1 | never |
| systemforce.co.uk | 1/1 | ok 1 | 2026-11-23 |
| tasks.mechanic.dev | 1/1 | ok 1 | 2026-11-18 |
| taxation-customs.ec.europa.eu | 1/1 | ok 1 | 2026-11-22 |
| teach.outschool.com | 0/1 | http_404 1 | never |
| teachshare.com | 0/1 | empty 1 | never |
| teachworks.com | 1/1 | ok 1 | 2026-11-19 |
| teamsuper.com | 1/1 | ok 1 | 2026-11-16 |
| techcrunch.com | 1/1 | ok 1 | 2026-11-04 |
| techintelpro.com | 1/1 | ok 1 | 2026-11-19 |
| termsfeed.com | 0/1 | http_403 1 | never |
| texas.support.withodyssey.com | 0/1 | http_403 1 | never |
| thecut.co | 1/1 | ok 1 | 2026-11-12 |
| thenewflatrate.com | 1/1 | ok 1 | 2026-11-13 |
| theprintspace.co.uk | 1/1 | ok 1 | 2026-11-22 |
| theproducenews.com | 0/1 | http_403 1 | never |
| theseoteacher.com.au | 1/1 | ok 1 | 2026-11-10 |
| thinkific.com | 1/1 | ok 1 | 2026-11-24 |
| thirtyoneeight.org | 1/1 | ok 1 | 2026-11-14 |
| tidyhq.com | 1/1 | ok 1 | 2026-11-14 |
| tilt.colostate.edu | 1/1 | ok 1 | 2026-11-01 |
| todaysveterinarybusiness.com | 1/1 | ok 1 | 2026-11-20 |
| tonsofskills.com | 1/1 | ok 1 | 2026-11-18 |
| topaihubs.com | 1/1 | ok 1 | 2026-11-18 |
| tothecent.app | 1/1 | ok 1 | 2026-11-05 |
| tracker.moodle.org | 0/1 | redirect 1 | never |
| trackjs.com | 1/1 | ok 1 | 2026-11-25 |
| trackssl.com | 1/1 | ok 1 | 2026-11-25 |
| trainingindustry.com | 1/1 | ok 1 | 2026-11-24 |
| transparentclassroom.uservoice.com | 1/1 | ok 1 | 2026-11-24 |
| trinket.io | 1/1 | ok 1 | 2026-11-01 |
| trippz.com | 1/1 | ok 1 | 2026-11-23 |
| truckspotting.com | 0/1 | http_5xx 1 | never |
| trucktrax.com | 0/1 | empty 1 | never |
| truto.one | 1/1 | ok 1 | 2026-11-19 |
| turnitin.gradescope.com | 1/1 | ok 1 | 2026-11-25 |
| tutordex.net | 1/1 | ok 1 | 2026-11-24 |
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
| veridiansoftware.com | 1/1 | ok 1 | 2026-11-24 |
| verimu.com | 1/1 | ok 1 | 2026-11-11 |
| verix.io | 0/1 | http_404 1 | never |
| vibe-eval.com | 0/1 | empty 1 | never |
| vibecodingcost.pages.dev | 0/1 | timeout 1 | never |
| vimeo.com | 1/1 | ok 1 | 2026-11-24 |
| virtualbadge.io | 1/1 | ok 1 | 2026-11-10 |
| vivere.dev | 1/1 | ok 1 | 2026-11-04 |
| vol.asura.asu.edu | 1/1 | ok 1 | 2026-11-07 |
| volunteerledger.com | 1/1 | ok 1 | 2026-11-24 |
| waamh.org.au | 1/1 | ok 1 | 2026-11-21 |
| waitlist.me | 1/1 | ok 1 | 2026-11-12 |
| waitlistping.com | 1/1 | ok 1 | 2026-11-20 |
| waitwhile.com | 1/1 | ok 1 | 2026-11-12 |
| waiversign.com | 1/1 | ok 1 | 2026-11-24 |
| wave.webaim.org | 1/1 | ok 1 | 2026-11-07 |
| waveapps.vanillacommunities.com | 0/1 | allowlist 1 | never |
| wbcomdesigns.com | 1/1 | ok 1 | 2026-11-25 |
| web3forms.com | 0/1 | http_403 1 | never |
| weblearning.psu.edu | 1/1 | ok 1 | 2026-11-25 |
| wiesbadencommunityspousesclub.wildapricot.org | 0/1 | redirect 1 | never |
| williamsrecord.com | 0/1 | http_403 1 | never |
| windes.com | 0/1 | http_403 1 | never |
| wooninjas.com | 1/1 | ok 1 | 2026-11-21 |
| workpingapp.vercel.app | 1/1 | ok 1 | 2026-11-18 |
| wpmudev.com | 1/1 | ok 1 | 2026-11-25 |
| wpscan.com | 1/1 | ok 1 | 2026-11-25 |
| wpsec.com | 0/1 | http_403 1 | never |
| wtb.wa.gov | 1/1 | ok 1 | 2026-11-21 |
| www.1-fix.com | 1/1 | ok 1 | 2026-11-11 |
| www.1099online.com | 1/1 | ok 1 | 2026-11-14 |
| www.3dissue.com | 1/1 | ok 1 | 2026-11-24 |
| www.accessplanit.com | 1/1 | ok 1 | 2026-11-24 |
| www.accountable.de | 1/1 | ok 1 | 2026-11-11 |
| www.ada.org | 0/1 | empty 1 | never |
| www.adaptive.build | 1/1 | ok 1 | 2026-11-23 |
| www.adlercolvin.com | 1/1 | ok 1 | 2026-11-07 |
| www.adobe.com | 1/1 | ok 1 | 2026-11-24 |
| www.afslaw.com | 1/1 | ok 1 | 2026-11-23 |
| www.agensi.io | 1/1 | ok 1 | 2026-11-22 |
| www.aiaworldwide.com | 1/1 | ok 1 | 2026-11-21 |
| www.alignable.com | 1/1 | ok 1 | 2026-11-18 |
| www.alternativeto.net | 0/1 | http_403 1 | never |
| www.ambrite.ca | 1/1 | ok 1 | 2026-11-18 |
| www.americansalon.com | 0/1 | http_403 1 | never |
| www.americorps.gov | 1/1 | ok 1 | 2026-11-24 |
| www.anthropic.com | 1/1 | ok 1 | 2026-11-25 |
| www.aplos.com | 0/1 | http_403 1 | never |
| www.applytosupply.digitalmarketplace.service.gov.uk | 0/1 | http_404 1 | never |
| www.approvalmax.com | 1/1 | ok 1 | 2026-11-14 |
| www.appsumo.com | 1/1 | ok 1 | 2026-11-25 |
| www.archiveinabox.com | 1/1 | ok 1 | 2026-11-24 |
| www.arcual.com | 1/1 | ok 1 | 2026-11-22 |
| www.arkansasonline.com | 1/1 | ok 1 | 2026-11-10 |
| www.arketa.com | 1/1 | ok 1 | 2026-11-18 |
| www.arlo.co | 1/1 | ok 1 | 2026-11-24 |
| www.articulate.com | 1/1 | ok 1 | 2026-11-24 |
| www.asset.accountant | 0/1 | empty 1 | never |
| www.aswb.org | 1/1 | ok 1 | 2026-11-24 |
| www.aucklandanglican.org.nz | 1/1 | ok 1 | 2026-11-07 |
| www.audioeye.com | 1/1 | ok 1 | 2026-11-07 |
| www.australiansuper.com | 0/1 | http_403 1 | never |
| www.avaza.com | 1/1 | ok 1 | 2026-11-18 |
| www.azed.gov | 0/1 | http_403 1 | never |
| www.banterspeech.com.au | 1/1 | ok 1 | 2026-11-21 |
| www.barnesdennig.com | 1/1 | ok 1 | 2026-11-07 |
| www.bayshorechristianschool.org | 1/1 | ok 1 | 2026-11-24 |
| www.beveragedaily.com | 1/1 | ok 1 | 2026-11-12 |
| www.bigcartel.com | 1/1 | ok 1 | 2026-11-22 |
| www.bigcommerce.com | 1/1 | ok 1 | 2026-11-22 |
| www.blackbaud.com | 1/1 | ok 1 | 2026-11-24 |
| www.bluehost.com | 0/1 | http_403 1 | never |
| www.booker-app.com | 1/1 | ok 1 | 2026-11-23 |
| www.bookitlive.net | 1/1 | ok 1 | 2026-11-24 |
| www.boomeranggmail.com | 1/1 | ok 1 | 2026-11-06 |
| www.buffalo.edu | 1/1 | ok 1 | 2026-11-25 |
| www.business.gov.uk | 1/1 | ok 1 | 2026-11-21 |
| www.businesswire.com | 0/1 | http_403 1 | never |
| www.calxa.com | 1/1 | ok 1 | 2026-11-14 |
| www.campai.com | 1/1 | ok 1 | 2026-11-24 |
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
| www.centralprivate.org | 1/1 | ok 1 | 2026-11-24 |
| www.cezoom.com | 0/1 | http_404 1 | never |
| www.chaponline.com | 1/1 | ok 1 | 2026-11-10 |
| www.charliehr.com | 1/1 | ok 1 | 2026-11-21 |
| www.chaserhq.com | 1/1 | ok 1 | 2026-11-19 |
| www.chcanys.org | 1/1 | ok 1 | 2026-11-07 |
| www.cheddarup.com | 1/1 | ok 1 | 2026-11-24 |
| www.chift.eu | 1/1 | ok 1 | 2026-11-23 |
| www.chorusaccess.org | 1/1 | ok 1 | 2026-11-25 |
| www.chronicle.com | 0/1 | http_403 1 | never |
| www.cipp.org.uk | 1/1 | ok 1 | 2026-11-12 |
| www.cisa.gov | 1/1 | ok 1 | 2026-11-11 |
| www.civicchamps.com | 1/1 | ok 1 | 2026-11-24 |
| www.clarkhill.com | 1/1 | ok 1 | 2026-11-06 |
| www.classcardapp.com | 1/1 | ok 1 | 2026-11-24 |
| www.classcentral.com | 0/1 | http_403 1 | never |
| www.cleanlink.com | 1/1 | ok 1 | 2026-11-20 |
| www.clearbooks.co.uk | 1/1 | ok 1 | 2026-11-12 |
| www.cliniko.com | 1/1 | ok 1 | 2026-11-21 |
| www.codio.com | 1/1 | ok 1 | 2026-11-25 |
| www.collectorsclub.org | 1/1 | ok 1 | 2026-11-24 |
| www.communityforce.com | 0/1 | http_404 1 | never |
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
| www.csulb.edu | 1/1 | ok 1 | 2026-11-25 |
| www.ctvnews.ca | 0/1 | empty 1 | never |
| www.dailycal.org | 0/1 | http_403 1 | never |
| www.dcjs.virginia.gov | 1/1 | ok 1 | 2026-11-24 |
| www.dentaleconomics.com | 1/1 | ok 1 | 2026-11-20 |
| www.dentaltown.com | 1/1 | ok 1 | 2026-11-23 |
| www.deque.com | 0/1 | http_404 1 | never |
| www.digismoothie.com | 1/1 | ok 1 | 2026-11-08 |
| www.digitalcommerce360.com | 0/1 | http_403 1 | never |
| www.digitaltransactions.net | 1/1 | ok 1 | 2026-11-20 |
| www.diyphotography.net | 0/1 | empty 1 | never |
| www.dlapiper.com | 1/1 | ok 1 | 2026-11-25 |
| www.dli.pa.gov | 0/1 | redirect 1 | never |
| www.donorfy.com | 1/1 | ok 1 | 2026-11-14 |
| www.dor.wa.gov | 1/1 | ok 1 | 2026-11-02 |
| www.drbicuspid.com | 0/1 | http_403 1 | never |
| www.duanemorris.com | 1/1 | ok 1 | 2026-11-07 |
| www.dwt.com | 0/1 | http_403 1 | never |
| www.ebnerstolz.de | 1/1 | ok 1 | 2026-11-22 |
| www.ecclesiastical.com | 1/1 | ok 1 | 2026-11-17 |
| www.engadget.com | 1/1 | ok 1 | 2026-11-08 |
| www.enrollware.com:443 | 0/1 | redirect 1 | never |
| www.enrollwaresolutions.com | 1/1 | ok 1 | 2026-11-24 |
| www.epa.gov | 1/1 | ok 1 | 2026-11-20 |
| www.era.nih.gov | 1/1 | ok 1 | 2026-11-24 |
| www.erp-recycling.org | 0/1 | empty 1 | never |
| www.ethyca.com | 0/1 | empty 1 | never |
| www.euronews.com | 1/1 | ok 1 | 2026-11-22 |
| www.evri.com | 1/1 | ok 1 | 2026-11-22 |
| www.example.com | 1/1 | ok 1 | 2026-11-24 |
| www.expenseplus.co.uk | 1/1 | ok 1 | 2026-11-14 |
| www.experian.com | 1/1 | ok 1 | 2026-11-07 |
| www.exponentphilanthropy.org | 1/1 | ok 1 | 2026-11-24 |
| www.facebook.com | 1/1 | ok 1 | 2026-11-06 |
| www.feinberg.northwestern.edu | 1/1 | ok 1 | 2026-11-11 |
| www.feldesman.com | 1/1 | ok 1 | 2026-11-07 |
| www.fightspam.gc.ca | 0/1 | redirect 1 | never |
| www.fiskil.com | 1/1 | ok 1 | 2026-11-25 |
| www.fluxx.io | 1/1 | ok 1 | 2026-11-24 |
| www.fnbnews.com | 0/1 | http_5xx 1 | never |
| www.followupthen.com | 0/1 | http_5xx 1 | never |
| www.fooddocs.com | 1/1 | ok 1 | 2026-11-13 |
| www.fourlane.com | 1/1 | ok 1 | 2026-11-07 |
| www.frassaticatholicacademy.org | 1/1 | ok 1 | 2026-11-24 |
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
| www.gitbook.com | 1/1 | ok 1 | 2026-11-25 |
| www.goldenvolunteer.com | 1/1 | ok 1 | 2026-11-24 |
| www.goodgrants.com | 1/1 | ok 1 | 2026-11-24 |
| www.govtech.com | 1/1 | ok 1 | 2026-11-24 |
| www.grammarly.com | 1/1 | ok 1 | 2026-11-10 |
| www.grantable.co | 1/1 | ok 1 | 2026-11-24 |
| www.gravityforms.com | 1/1 | ok 1 | 2026-11-24 |
| www.gwynedd.llyw.cymru | 1/1 | ok 1 | 2026-11-23 |
| www.haendlerbund.de | 1/1 | ok 1 | 2026-11-22 |
| www.hallmaster.co.uk | 0/1 | timeout 1 | never |
| www.harborcompliance.com | 1/1 | ok 1 | 2026-11-07 |
| www.hcamag.com | 1/1 | ok 1 | 2026-11-21 |
| www.healthclubmanagement.co.uk | 1/1 | ok 1 | 2026-11-20 |
| www.hostaway.com | 1/1 | ok 1 | 2026-11-23 |
| www.housecallpro.com | 1/1 | ok 1 | 2026-11-06 |
| www.hse.gov.uk | 1/1 | ok 1 | 2026-11-24 |
| www.hsfkramer.com | 0/1 | http_403 1 | never |
| www.hudu.com | 1/1 | ok 1 | 2026-11-18 |
| www.hvac-talk.com | 0/1 | redirect 1 | never |
| www.hvacrschool.com | 1/1 | ok 1 | 2026-11-20 |
| www.ifpti.org | 1/1 | ok 1 | 2026-11-13 |
| www.ihk.de | 0/1 | http_403 1 | never |
| www.indiafilings.com | 1/1 | ok 1 | 2026-11-23 |
| www.insightagent.app | 1/1 | ok 1 | 2026-11-15 |
| www.instarenewal.com | 1/1 | ok 1 | 2026-11-18 |
| www.instrumentl.com | 1/1 | ok 1 | 2026-11-24 |
| www.insurance.wa.gov | 1/1 | ok 1 | 2026-11-21 |
| www.it-recht-kanzlei.de | 1/1 | ok 1 | 2026-11-22 |
| www.itgovernance.co.uk | 0/1 | redirect 1 | never |
| www.itv.com | 0/1 | http_5xx 1 | never |
| www.jackrabbitclass.com | 1/1 | ok 1 | 2026-11-24 |
| www.jibble.io | 1/1 | ok 1 | 2026-11-06 |
| www.just-drinks.com | 1/1 | ok 1 | 2026-11-12 |
| www.khaitanco.com | 1/1 | ok 1 | 2026-11-23 |
| www.khanmigo.ai | 1/1 | ok 1 | 2026-11-24 |
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
| www.lifesavingsociety.com | 1/1 | ok 1 | 2026-11-24 |
| www.lime-technologies.com | 1/1 | ok 1 | 2026-11-25 |
| www.liquidweb.com | 1/1 | ok 1 | 2026-11-07 |
| www.litrg.org.uk | 0/1 | http_403 1 | never |
| www.littler.com | 1/1 | ok 1 | 2026-11-21 |
| www.liveimpact.org | 1/1 | ok 1 | 2026-11-24 |
| www.loffler.com | 1/1 | ok 1 | 2026-11-11 |
| www.lovingly.com | 0/1 | redirect 1 | never |
| www.ltcillinois.org | 1/1 | ok 1 | 2026-11-24 |
| www.makeinfluence.com | 1/1 | ok 1 | 2026-11-15 |
| www.mediabistro.com | 1/1 | ok 1 | 2026-11-07 |
| www.microns.io | 1/1 | ok 1 | 2026-11-07 |
| www.mindbodyonline.com | 0/1 | empty 1 | never |
| www.minterellison.com | 0/1 | http_403 1 | never |
| www.mitti.com | 1/1 | ok 1 | 2026-11-13 |
| www.modernsalon.com | 1/1 | ok 1 | 2026-11-20 |
| www.mondaq.com | 1/1 | ok 1 | 2026-11-02 |
| www.moovs.app | 0/1 | allowlist 1 | never |
| www.mumsnet.com | 1/1 | ok 1 | 2026-11-08 |
| www.myaifrontdesk.com | 1/1 | ok 1 | 2026-11-19 |
| www.myhr.works | 1/1 | ok 1 | 2026-11-21 |
| www.mykaleidoscope.com | 1/1 | ok 1 | 2026-11-24 |
| www.myschoolyear.com | 0/1 | http_403 1 | never |
| www.nachc.org | 1/1 | ok 1 | 2026-11-07 |
| www.namecheap.com | 1/1 | ok 1 | 2026-11-25 |
| www.nasaa.org | 1/1 | ok 1 | 2026-11-21 |
| www.nationalforests.org | 1/1 | ok 1 | 2026-11-24 |
| www.nationgraph.com | 0/1 | http_404 1 | never |
| www.nccommunitycolleges.edu | 1/1 | ok 1 | 2026-11-07 |
| www.ncrla.org | 1/1 | ok 1 | 2026-11-13 |
| www.ncura.edu | 1/1 | ok 1 | 2026-11-24 |
| www.ndis.gov.au | 0/1 | http_403 1 | never |
| www.nds.org.au | 0/1 | http_404 1 | never |
| www.ndsmcobserver.com | 0/1 | http_403 1 | never |
| www.niaid.nih.gov | 1/1 | ok 1 | 2026-11-11 |
| www.nigms.nih.gov | 1/1 | ok 1 | 2026-11-11 |
| www.nspra.org | 1/1 | ok 1 | 2026-11-24 |
| www.numbas.org.uk | 1/1 | ok 1 | 2026-11-25 |
| www.omeka.net | 1/1 | ok 1 | 2026-11-24 |
| www.onefile.co.uk | 1/1 | ok 1 | 2026-11-24 |
| www.onlinelabels.com | 1/1 | ok 1 | 2026-11-06 |
| www.onpay.com | 1/1 | ok 1 | 2026-11-07 |
| www.ontario.ca | 0/1 | http_403 1 | never |
| www.ordermentum.com | 1/1 | ok 1 | 2026-11-20 |
| www.osiaffiliate.com | 0/1 | http_404 1 | never |
| www.parentbooker.com | 1/1 | ok 1 | 2026-11-24 |
| www.parenttrack.io | 1/1 | ok 1 | 2026-11-24 |
| www.passcreator.com | 1/1 | ok 1 | 2026-11-21 |
| www.patreon.com | 0/1 | http_403 1 | never |
| www.paubox.com | 1/1 | ok 1 | 2026-11-21 |
| www.payhelm.com | 1/1 | ok 1 | 2026-11-15 |
| www.paylocity.com | 0/1 | empty 1 | never |
| www.peterborough-diocese.org.uk | 0/1 | http_404 1 | never |
| www.phaa.org | 1/1 | ok 1 | 2026-11-10 |
| www.pike13.com | 1/1 | ok 1 | 2026-11-24 |
| www.plinth.org.uk | 1/1 | ok 1 | 2026-11-14 |
| www.pmlawyers.com.au | 1/1 | ok 1 | 2026-11-21 |
| www.postgresql.org | 1/1 | ok 1 | 2026-11-25 |
| www.praxikon.com | 1/1 | ok 1 | 2026-11-17 |
| www.presspadapp.com | 1/1 | ok 1 | 2026-11-24 |
| www.proteacher.net | 0/1 | http_403 1 | never |
| www.protrainings.com | 0/1 | redirect 1 | never |
| www.pulse.bot | 0/1 | http_5xx 1 | never |
| www.punchpass.com | 1/1 | ok 1 | 2026-11-18 |
| www.pythonanywhere.com | 1/1 | ok 1 | 2026-11-25 |
| www.quo.com | 1/1 | ok 1 | 2026-11-06 |
| www.ramp.com | 1/1 | ok 1 | 2026-11-25 |
| www.redcross.ca | 0/1 | http_403 1 | never |
| www.reportpundit.com | 1/1 | ok 1 | 2026-11-15 |
| www.respira.press | 1/1 | ok 1 | 2026-11-11 |
| www.restaurantdive.com | 1/1 | ok 1 | 2026-11-20 |
| www.restaurantonline.co.uk | 1/1 | ok 1 | 2026-11-16 |
| www.reviewr.com | 1/1 | ok 1 | 2026-11-24 |
| www.ru.nl | 0/1 | http_5xx 1 | never |
| www.saashub.com | 0/1 | http_403 1 | never |
| www.saasrise.com | 1/1 | ok 1 | 2026-11-25 |
| www.saastr.com | 1/1 | ok 1 | 2026-11-23 |
| www.saasworthy.com | 0/1 | http_403 1 | never |
| www.sandiegocounty.gov | 0/1 | http_5xx 1 | never |
| www.scorm.learnkey.com | 1/1 | ok 1 | 2026-11-24 |
| www.securityscientist.net | 1/1 | ok 1 | 2026-11-24 |
| www.selfemployed.com | 1/1 | ok 1 | 2026-11-08 |
| www.sellersasksellers.com | 1/1 | ok 1 | 2026-11-22 |
| www.servicem8.com | 1/1 | ok 1 | 2026-11-20 |
| www.sharp.net.nz | 1/1 | ok 1 | 2026-11-11 |
| www.silicon.co.uk | 1/1 | ok 1 | 2026-11-18 |
| www.simprogroup.com | 0/1 | http_403 1 | never |
| www.singletouch.com.au | 1/1 | ok 1 | 2026-11-16 |
| www.siteground.com | 0/1 | http_404 1 | never |
| www.siteimprove.com | 1/1 | ok 1 | 2026-11-07 |
| www.skadden.com | 1/1 | ok 1 | 2026-11-23 |
| www.skwschwarz.de | 1/1 | ok 1 | 2026-11-25 |
| www.skynettechnologies.com | 1/1 | ok 1 | 2026-11-23 |
| www.slrlounge.com | 1/1 | ok 1 | 2026-11-08 |
| www.smartcompany.com.au | 1/1 | ok 1 | 2026-11-20 |
| www.smartsense.co | 1/1 | ok 1 | 2026-11-13 |
| www.smoobu.com | 0/1 | http_404 1 | never |
| www.softwareadvice.co.uk | 0/1 | http_403 1 | never |
| www.solidtime.io | 1/1 | ok 1 | 2026-11-18 |
| www.springlex.eu | 0/1 | empty 1 | never |
| www.srainternational.org | 1/1 | ok 1 | 2026-11-24 |
| www.startupdaily.net | 1/1 | ok 1 | 2026-11-07 |
| www.strato.de | 1/1 | ok 1 | 2026-11-22 |
| www.submittable.com | 0/1 | http_403 1 | never |
| www.subnotice.com | 1/1 | ok 1 | 2026-11-22 |
| www.supportability.com.au | 1/1 | ok 1 | 2026-11-21 |
| www.swarmia.com | 1/1 | ok 1 | 2026-11-25 |
| www.tablesready.com | 1/1 | ok 1 | 2026-11-12 |
| www.taskade.com | 1/1 | ok 1 | 2026-11-24 |
| www.tax1099.com | 0/1 | http_404 1 | never |
| www.teachable.com | 1/1 | ok 1 | 2026-11-24 |
| www.techzine.eu | 1/1 | ok 1 | 2026-11-25 |
| www.tenantturner.com | 1/1 | ok 1 | 2026-11-13 |
| www.termsfeed.com | 0/1 | http_403 1 | never |
| www.thankyoupayroll.co.nz | 1/1 | ok 1 | 2026-11-14 |
| www.the-standard.org | 1/1 | ok 1 | 2026-11-01 |
| www.themarysue.com | 1/1 | ok 1 | 2026-11-23 |
| www.theregister.com | 1/1 | ok 1 | 2026-11-25 |
| www.thetruckersreport.com | 1/1 | ok 1 | 2026-11-17 |
| www.theverge.com | 1/1 | ok 1 | 2026-11-25 |
| www.thomsonreuters.com | 1/1 | ok 1 | 2026-11-07 |
| www.threads.com | 1/1 | ok 1 | 2026-11-22 |
| www.tidyverse.org | 1/1 | ok 1 | 2026-11-25 |
| www.timecamp.com | 1/1 | ok 1 | 2026-11-18 |
| www.timeshighereducation.com | 1/1 | ok 1 | 2026-11-25 |
| www.tlt.com | 1/1 | ok 1 | 2026-11-22 |
| www.trackitforward.com | 0/1 | http_403 1 | never |
| www.transact-tech.com | 1/1 | ok 1 | 2026-11-06 |
| www.tropicapp.io | 1/1 | ok 1 | 2026-11-23 |
| www.truckinginfo.com | 1/1 | ok 1 | 2026-11-17 |
| www.turbotenant.com | 1/1 | ok 1 | 2026-11-13 |
| www.tutkit.com | 1/1 | ok 1 | 2026-11-22 |
| www.txtimpact.com | 1/1 | ok 1 | 2026-11-09 |
| www.ucanr.edu | 0/1 | http_403 1 | never |
| www.ukhospitality.org.uk | 1/1 | ok 1 | 2026-11-21 |
| www.umsystem.edu | 0/1 | http_404 1 | never |
| www.uplisting.io | 1/1 | ok 1 | 2026-11-23 |
| www.uptimerobot.com | 1/1 | ok 1 | 2026-11-18 |
| www.usehammock.com | 1/1 | ok 1 | 2026-11-12 |
| www.usitc.gov | 0/1 | http_403 1 | never |
| www.usps.com | 1/1 | ok 1 | 2026-11-22 |
| www.uvic.ca | 1/1 | ok 1 | 2026-11-21 |
| www.uvm.edu | 1/1 | ok 1 | 2026-11-25 |
| www.vanta.com | 1/1 | ok 1 | 2026-11-25 |
| www.vatcalc.com | 0/1 | http_403 1 | never |
| www.vinetur.com | 1/1 | ok 1 | 2026-11-23 |
| www.volunteerflorida.org | 1/1 | ok 1 | 2026-11-24 |
| www.wales247.co.uk | 1/1 | ok 1 | 2026-11-23 |
| www.webull.com | 1/1 | ok 1 | 2026-11-10 |
| www.westernu.edu | 1/1 | ok 1 | 2026-11-24 |
| www.whitecase.com | 0/1 | http_403 1 | never |
| www.wisdfoundation.org | 1/1 | ok 1 | 2026-11-24 |
| www.workstreet.com | 1/1 | ok 1 | 2026-11-25 |
| www.wxxinews.org | 1/1 | ok 1 | 2026-11-06 |
| www.xenia.team | 1/1 | ok 1 | 2026-11-13 |
| www.zapier.com | 1/1 | ok 1 | 2026-11-19 |
| www.zbrushcentral.com | 0/1 | empty 1 | never |
| www.zenstores.com | 1/1 | ok 1 | 2026-11-22 |
| www.zoho.com | 1/1 | ok 1 | 2026-11-06 |
| www.zoom.com | 1/1 | ok 1 | 2026-11-24 |
| www.zoomgrants.com | 1/1 | ok 1 | 2026-11-24 |
| www2.gov.bc.ca | 1/1 | ok 1 | 2026-11-19 |
| xdaforums.com | 0/1 | http_403 1 | never |
| xero.com | 1/1 | ok 1 | 2026-11-08 |
| xero.uservoice.com | 1/1 | ok 1 | 2026-11-24 |
| zapiet.com | 1/1 | ok 1 | 2026-11-13 |
| zeitride.com | 1/1 | ok 1 | 2026-11-06 |
| zenler.canny.io | 1/1 | ok 1 | 2026-11-22 |
| zenodo.org | 1/1 | ok 1 | 2026-11-25 |
| zenplanner.com | 1/1 | ok 1 | 2026-11-23 |
| ziphaccp.com | 0/1 | http_404 1 | never |
| zmartly.co.uk | 1/1 | ok 1 | 2026-11-12 |

## Where candidates die

| Gate condition | Candidates lost |
|---|---|
| totalBelowMin | 541 |
| rejectRule | 101 |
| reviewKill | 61 |
| painBelow4 | 3 |
| noRecentEvidence | 2 |
| evidenceCountBelow2 | 0 |
| noComplaintEvidence | 0 |
| unverifiedEvidence | 0 |
| wtpBelow3 | 0 |

The largest row is the one to argue about before changing anything else.

## Funnel over the window

candidates 721 -> passedRejectRules 620 -> passedGate 13 -> reviewKilled 61 -> validated 1 -> provisional 82 -> watchlist 73

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

