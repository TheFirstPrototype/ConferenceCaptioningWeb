# ConferenceCaptioningWeb

Static site for conferencecaptioning.com (ConferenceCaptioning by BeAware): no build step for the main pages, plain HTML. See `README.md` for the demo video and the analytics notes (`js/analyticsLite.js`, `./bump-analytics-version.sh`).

## Layout
- `index.html` plus `index-XX.html` per language (es, fr, pt, ar, ru, de, uk, hi, ur, yo, id, it, ja, sw, pl, vi, ro, zh, zh-hant, hr, fa, nl, ko, sv, hu, sq). `sitemapGenerator.sh` has the language list.
- Solution pages: `av-production.html`, `event-organizers.html`, `church-live-translation-transcription.html`. Per-language accuracy pages: `arabic.html`, `japanese.html`, `italian.html`.
- `blog/`: prebuilt static pages, one folder per post (`blog/<slug>/index.html`). Translations live in `blog/{es,fr,it,ko,pt-br}/` with their own slugs. The CSS and JS in `blog/assets/` are hashed build output, so don't hand-edit them.
- `benchmark/` and `multilingual-translation-benchmark/`: the open benchmark data. The method and scoring script are public, and the OBS article links to `/benchmark/`.
- `offline-event-translation/` and `conference-captioning-vs-cloud-translation/`: standalone AI-search landing pages (see "Standalone pages").
- `transcript/`: public live-transcript page (see "Public transcript page").
- `deck/` holds the pitch and investor decks.

## Canonical host and indexing
- The canonical host is non-www: `https://conferencecaptioning.com`. Canonicals, hreflang and `sitemap.xml` all use it.
- Search Console shows "Alternate page with proper canonical tag" for `www.` URLs. That is expected. The real fix is a site-wide 301 from www to non-www at the host or CDN. It can't be done in the repo, and I haven't verified whether it is set up.
- Search Console shows a 404 for `/index-en.html`. It is a legacy URL that was in the sitemap until June 2024. There is no English `index-en.html` now, since English is `/`. Optionally 301 it to `/`. A 404 is harmless.
- Don't block URLs in `robots.txt` to remove them from the index. Google can't see a 404 or a redirect on a blocked URL.

## Adding a blog post
Copy the closest existing post (`how-to-add-live-captions-translations-to-obs` is a good template) and update all of these:
1. The new `blog/<slug>/index.html`: title, description, og tags, canonical, hreflang, and the JSON-LD (Article, FAQPage, optional VideoObject). Keep the FAQ in the JSON-LD identical to the visible FAQ.
2. A card at the top of `blog/index.html` and of `blog/category/technology/index.html`.
3. A `<url>` entry in `sitemap.xml`.
4. Translated posts are optional, and the OBS and Stream Deck posts have none.

`sitemapGenerator.sh` only appends the `index-XX.html` language pages and writes `sitemap.xml.bak`. Blog entries are added by hand, so don't run the script and expect it to cover the blog.

## Product facts to keep consistent
- Captions and translations run on-device (Mac, iPad, iPhone). The device serves them on the local network at `http://{device IP}:8080` with no internet needed. `url.html` builds overlay URLs for OBS Browser Sources, and `control.html` gives browser control.
- Delay claims: the latest corrected figure is a per-word delay of about 0.6 s, not a flat 0.05 s (see commit 7748f51). Check the benchmark page before writing any latency number. Known mismatch to reconcile: the `deck/one.html` tile says "0.5s avg word-to-caption delay" while the benchmark page says 0.60 s.
- Recommended setup: put captions on the room's screens (directly or through a video switcher downstream key) so nobody needs a phone or a router. Phones are optional: they need the local network (a router you bring, with no internet behind it) and the QR code. Don't promise "no network" for phone viewers. The offline page is written this way.
- Dedicated event internet line "$2,500 to $5,000" is the founder's figure. Pages say "commonly about", not a quote.
- Bitfocus Companion module: https://bitfocus.io/connections/beaware-conferencecaptioning (v1.0.4 at last check, source at github.com/bitfocus/companion-module-beaware-conferencecaptioning). Setup is: create a stream in the portal, activate the app, add the connection, enter the stream name and the device's `http://` address. The public docs don't list action names. The Stream Deck article describes the controls only generally (start/stop, show/hide, language).

## AI-search visibility notes (from a Gemini suggestion review, Oct 2026)
- The homepage already has SoftwareApplication, FAQPage, Organization, AggregateRating and Offer schema. Don't re-add them.
- Worth doing: a clear one-sentence definition near the top of the homepage, one canonical benchmarks hub with Dataset schema, `CITATION.cff` in the benchmark repo (a `CITATION.cff.suggested` file exists in the working tree), and offline and Wi-Fi-failure landing pages (`offline-event-translation/` and `conference-captioning-vs-cloud-translation/` were published in October 2026, commit 73d5398). Still open: submit them in Search Console, and link the offline page from the ProPresenter, slide deck and Chrome extension posts.
- Don't publish competitor numbers (Wordly, Interprefy and so on) unless we measured them.
- Third-party mentions help more than on-page markup.

## Standalone pages (benchmark-style)
- `benchmark/`, `offline-event-translation/` and `conference-captioning-vs-cloud-translation/` share one self-contained dark template: inline `<style>`, the same header and footer markup, `js/siteTracking.js`, the Tawk script and the heading-anchor script. Copy `benchmark/index.html` to start a new one. The offline and vs-cloud pages were generated by a throwaway script that is not in the repo, so edit their HTML directly.
- When adding one: a sitemap entry; links in the footers of `index.html`, both benchmark pages and the other standalone pages (they list each other); its own 1200x630 `og-image.png` (the offline page's was made from a small HTML page screenshotted with headless Chrome, background `deck/bali-summit-poster.jpg`) so it doesn't borrow the benchmark's; and unique `data-cta` names such as `offline-nav-start-free`, so clicks aren't counted under the benchmark.
- JSON-LD FAQ answers must be plain text (no `&rsquo;` entities) and match the visible FAQ.
- In this template `.wrap` is the page container (max width and 72px bottom padding). Don't reuse that class name for anything else. It made table rows very tall once. Use another class, such as `.tw`.
- The vs-cloud page compares architectures only and names no vendors. It says we benchmarked only our own engines. Keep it that way.
- The failover, Mac mini, static IP and OBS posts each carry a Related Articles card pointing to the offline page.
- The offline page's Bali example loads `../deck/bali-summit.mp4` and its poster, with four language tags over the screens (Mandarin, Bahasa, Thai, English). Keep those files in `deck/`.

## Public transcript page (`transcript/index.html`)
- Read-only page at `/transcript/?uid=…&streamName=…` (commit 41e4bc0). It fetches `https://api.deafassistant.com/history/GetStreamHistory`, the same API as the portal's `TranscriptHistory.tsx` (in the ConfCapPortal repo). Items have `id`, `transcript` and `startTimestamp` (it also handles `endTimestamp` and `inputLanguage` if present, not confirmed). Timestamps are cut to 23 characters and given a `Z` before parsing.
- The API only allows `https://conferencecaptioning.com` as a CORS origin, so the page works there and not from `file://` or localhost.
- Delete endpoints (`HistoryRecordDel`, `HistoryStreamDel`) exist in the portal only. This page can't delete.
- A request with only the two query parameters returned 200 with no authentication, so anyone with the link can read a stream's history. Treat links as private. The page is `noindex`. Whether the API should require auth is an open question.
- Features: search with highlighting, refresh, download as .txt.

## Decks (`deck/`)
`deck/AGENTS.md` covers how sales agents use the sales deck. This section is for editing the decks.
- `index.html` is the sales deck, `one.html` is the single-slide 2-minute investor slide, and `investor.html` is the multi-slide 10-minute investor pitch (Tailwind via CDN, one file). `investor2.html`, `postcard*.html` are other variants.
- **Michigan focus:** `one.html` leans on Michigan (733K deaf/HoH, 1.06M speak another language). `investor.html` is deliberately not Michigan-focused. Don't copy the Michigan stats over.
- **Local paths:** opening a deck from `file://` blocks images in a parent folder (Safari shows "Cannot open file"). Deck pages therefore load site images by absolute URL (`https://conferencecaptioning.com/images/...`) and keep their own media (mp4, gif, png) next to the HTML. Don't switch these to `../images/`. The decks need internet unless you bundle the assets.
- **`investor.html` internals:**
  - Slides are `<section class="slide" data-slide="N">`. Renumber `data-slide`, `totalSlides`, the `/ N` in the header, `speakerNotes` keys and `slideBg` together whenever you add, remove or reorder a slide.
  - Speaker notes (press S) live in the `speakerNotes` object. Each slide has a title, a target time and HTML. Target times should sum to about 10 minutes (the header timer is `/ 10:00`).
  - Slide backgrounds come from `slideBg` (site `section-bg-*.jpg` under a black overlay). The last slide's background is the `#finalBg` element, not `slideBg`.
  - Elements fade up in sequence through `setupReveal()`. It flattens plain wrappers and `grid` containers one level, but does not flatten `glass-*` panels. Add `data-deep` to a section to animate panels first and their children after.
  - `#N` in the URL opens slide N, useful for screenshots.
- **Screenshot check:** `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=1440,810 --virtual-time-budget=9000 --screenshot=out.png "file://$PWD/deck/investor.html#10"`. Also test 1280x720, since tall slides can clip.
- **Derived media:** make mp4s from gifs with ffmpeg (for example `-vf "setpts=0.5*PTS"` for 2x speed, `crop=` to remove the imgflip.com watermark). The source gifs are small (about 400x225), so full-screen use looks soft. Keep a dark tint over them.
- **Logo categories** (from the `alt` text in `index.html`; the `unnamed*.png` file names mean nothing): venues (Morial Convention Center, Omni), AV companies (Animatic, ConcertPlus, Fivestar, Elysium, Audio enhancement), non-profits and associations (YMCA, American Arab Chamber of Commerce, Canadian Chiropractic, Techtown, WeTech, Portland Backpack, National Oral Health Conference, Travelability), and education, culture and faith (Michigan State, Sundance, Chesapeake church).
- **Real testimonials** (in `index.html`): Tom Phillips, Faculty, Apple Developer Academy Detroit; Michael Goggins, AV Professional, Michigan State University. Don't invent quotes or customer stories.
- **Investor numbers to keep consistent:** $30K annual revenue today; 97.2% accuracy and under 1 s speech-to-screen (NASA press conference benchmark); 0.5 s backup-device takeover; 70+ languages; 6+ countries, 20+ cities, 1M+ words; 2 in 5 demos convert; pricing $150/hr events, $400/mo unlimited on an annual plan ($4,800/yr), non-profit discounts; ask $1.25M split 50% sales and marketing, 25% product, 25% operations and compliance, to reach $500K ARR within 18 months of closing. Check latency wording against the CLAUDE.md delay note above before changing any number.
- **Financial projections** (from the founder's other deck; these add up): sales 2026-2030 are $56,720, $245,786, $1,106,040, $2,406,743, $4,993,990; gross margin 22%, 40%, 42%, 44%, 45%; income before tax $(18,108), $(23,660), $7,180, $247,950, $903,435. The path: financing closes in 2027, hire sales and engineering, enterprise and AV-channel expansion, upsells and a reseller/referral program (licenses up to $10K), $1.1M revenue in 2028. 2026 is a full-year projection, so it won't match the $30K revenue-to-date figure. Gross margin is low because we pay certified captioners and a support crew, so don't claim "near-zero cost to serve" or 80% software margins.
- **Unverified, confirm with the founder before presenting:** 37M US adults with trouble hearing (NIDCD/CDC) and 68M US residents who speak a language other than English at home (Census ACS 2023; the Census doesn't track "first language"); "patent pending"; "certified live captioner" and "fastest translator" claims; the Mandarin/Bahasa/Thai/English order of the four Bali screens (taken from the alt text on `bali-summit.mp4`); the resort name in the NJEA caption (Harrah's Resort, Atlantic City, NJ, August 2026).
- **Wording:** say "the AI needs no internet", not "no internet". Attendees on the public QR link read over mobile data, so "audio never leaves the room" is true but "fully offline" is not for every viewer.
- **Open gaps for an investor-ready deck:** team slide, a sourced dollar market size, why-now slide, named competitors and an answer on Apple/Google building this in, a real named customer story, milestones with dates, and an appendix. A local bundle or PDF backup is still to do, so the pitch doesn't depend on venue Wi-Fi.

## Working notes
- `AGENTS.md` is currently empty. Put shared agent rules there or here, not in both.
- Check `git status` before committing: the working tree often holds unrelated edits from other sessions (for example a `mobile-nav.js` script tag added across many blog pages).
