# Shareables page (`/shareables/`)

Generates a QR code for `https://deafassistant.com/{streamName}` (stream name typed in, or `?streamName=mtw`) and two downloads:
1. **Circular badge** (transparent PNG/SVG): localized "Captions & Translations" (`caption-header` from `../languageData.json`) curved along the top, QR in the middle, "ConferenceCaptioning.com" curved along the bottom; language and colour (picker + hex) selectable.
2. **Postcard flyer** (6x4 in, landscape; PNG/SVG/print): input language plus up to 5 translations, each showing that language's `scan-qr` string.

## Implementation notes
- Single file `index.html`, styled like `../brand-toolkit/`. QR from the self-hosted `../js/qrcode.min.js` (qrcode-generator 1.4.4).
- Curved text is SVG `<textPath>` (whole-run shaping, so Arabic and other non-Latin scripts shape correctly); text is auto-fitted with canvas `measureText`; RTL for `ar fa he ur ps prs ckb`.
- Exports: SVG is rendered to PNG through Image + canvas (250 ms wait for font decode). Export SVGs embed Inter (latin, latin-ext, cyrillic, greek, vietnamese) as base64 `@font-face`, so downloads look the same everywhere; other scripts use the viewer's system fonts. The live preview uses the page's own Inter (Google Fonts); without internet exports fall back to system fonts.
- Opening from `file://`: `fetch('../languageData.json')` is blocked there, so the page keeps an inline copy in `<script id="languageDataFallback">`. **After editing `../languageData.json`, run `python3 shareables/sync-language-data.py`** to refresh it.
- Print: a print-only `#printArea` with `@page { size: 6in 4in; margin: 0 }`.

## Not verified
Real downloads and PDF/print output, scanning the QR with a phone, mobile layout and Safari. Tested only in headless Chrome.

## Related data
- `../languageData.json`: 73 languages, each with `scan-qr` ("Scan the QR code for translations in English", localized) plus the attendee-site keys. The attendee site's own copy is `languageData` in `ConfCapApi/Signal.Api/template/js/constants.js` (73 entries, includes `zh-hk` as a copy of `zh-tw`; lookups are exact lowercase keys). Which languages the app can translate to, and the codes it sends: `ConferenceLiveCaptioning/docs/translation_language_codes.md` / `.json`.
