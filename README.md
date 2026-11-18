# BeAware-LandingPage
Landing page for the [deafassitant.com](https://conferencecaptioning.com) website of BeAware

This repository contains the code of the Landing Page website for the [BeAware - Deaf & Hard of Hearing Assistant app for iPhone](https://conferencecaptioning.com)

The app itself is open-source and is written in SwiftUI. Here's the [code for the app](https://github.com/philparkus/BeAware)

To briefly understand what the app does, you can watch [this video](https://vimeo.com/950840441)

**Automating Translations**
--------
- Try to set all the languages to be in english in all the files so that we can do a search and replace
- Use HTML Translator sheet from here to create translations: https://docs.google.com/spreadsheets/d/1ocn1WHA4--EabfJ2eEZwZjz4orCIKo18rawDiJCZVYs/edit?gid=1537366283#gid=1537366283
- Then get the JSON value from here https://codepen.io/saamerm/pen/NWVZyEm and store it in a new file like languages-demoVideos.json
- Create a copy of demoVideo.sh and make the changes needed (especially the json file name). There's two parts to the shell script.
- Only commit needed files
Analytics
--------
**`js/analyticsLite.js`** is included by ~100 pages (relative, absolute and `../../` paths). After the page fully loads and the browser is idle it:
- posts a `PageView` event, then looks up the visitor's city via `ipinfo.io` and posts it with the page URL and referrer to `https://api.deafassistant.com/analytics/NameEmailMessage`. The same endpoint also receives the contact form, so its Name/Email/Message fields are reused as location/URL/referrer for analytics rows (see the API repo's `AGENTS.md`).
- adds a browser GUID (`localStorage` key `cc_visitor_id`) to tell new from returning visitors, plus device type / OS / browser (and the bot's name for crawlers) parsed from the user agent. All of it is optional on the API side, so old pages keep working.
- does nothing when `isTesting = true` at the top of the file (use it when developing locally so you don't pollute production data).

**Changing `analyticsLite.js` - bump the version.** The CDN (`hcdn`) serves JS with `cache-control: max-age=604800` (7 days), so edits are not seen until the cache expires. Every page references it as `analyticsLite.js?v=...`; after changing the file run `./bump-analytics-version.sh [version]` (defaults to today as `YYYYMMDD`; use a different value such as `20261019b` if you already used today's date), review `git diff`, then commit and push. Deploy the API first if the change adds new fields. Check with `curl -s "https://conferencecaptioning.com/js/analyticsLite.js?v=x" | head`.

**Dashboard (`analytics/index.html`)**
- Query string (all optional): `range` (`1h|24h|7d|30d|all|custom`), `from`/`to`, `q` or `search` (fills the search box), `domain`, `city`, `referral`, `device`, `visitor`, `group`, `cmp`, `api` (point it at a local API, e.g. `?api=https://localhost:5001`). The page rewrites the URL as you change filters, so you can bookmark a view.
- Raw table: every column has an Excel-style value filter (filter icon in the header) and a draggable right edge to resize (double-click the edge to reset). Column filters only cover the records already loaded and are not part of the URL or the CSV export; column widths are remembered in `localStorage` (`analytics.colWidths`).
- Visitor/device charts and cards only appear when the data in view has that information (hits from before the update show as "Unknown"). Device type `bot` can be excluded with the Device filter. The user-agent check is a guess: bots that pretend to be browsers look like real visitors.
- Privacy: the visitor id is a persistent browser identifier, so mention it in the privacy policy and consider consent requirements for your visitors' regions.
