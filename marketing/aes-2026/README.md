# AES USA 2026 sponsor assets (Accessible Events Show, Alexandria VA, Dec 4)

Unlisted working pages: `noindex`, not linked, not in the sitemap. Each folder has an `index.html` that is the layout at its exact pixel size, so screenshot it at that size.

| Folder | Spec | Screenshot |
|---|---|---|
| `banner-1645x110/` | Web banner, 1645 x 110 px (1x and 2x PNGs included) | headless Chrome, `--window-size=1645,110`, `--force-device-scale-factor=1` or `2` |
| `banner-1600x400/` | Web banner, 1600 x 400 px, max 2 MB (PNG and JPG included) | `--window-size=1600,400` |
| `half-page-ad/` | Booklet half page, 122 x 84 mm at 300 dpi = 1441 x 992 px, no bleed, CMYK | `--window-size=1441,992`, then convert to the printer's CMYK profile (the one we tried was macOS Generic CMYK, a placeholder) |
| `video-60s/` | 60 s ad, 1920 x 1080, 24 fps | see below |

Common content: headline "What if your captions never needed Wi-Fi?", booking call to action, Bali stage image with language tags (the screens' order was checked from the frame: Chinese, Indonesian, Thai, English).

## Video build (video-60s)
1. Narration: `script.json` has the lines and start times. Voice was `say -v "Allison (Enhanced)" -r 165`, trimmed with `silenceremove`, then each clip placed with `adelay` at its start time, a quiet synthesized pad ducked with `sidechaincompress`, `loudnorm` to -16 LUFS.
2. Frames: `node frames.js` (needs `playwright-core` and Chrome) writes 1440 JPEGs by calling `render(t)` in `index.html`.
3. Encode: `ffmpeg -framerate 24 -i frames/f%05d.jpg -i mix.wav -af apad=whole_dur=60 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -t 60 out.mp4`.
`captions.vtt` matches the narration timings. The mp4 and the frames are not in the repo.

## Claims to keep honest
Say "the AI needs no internet", not "fully offline" (phone viewers use the local network). "About a second" for translated headset audio, not "instant" or "<1 s". "50+ languages" is the partner-material figure (the investor deck says 65+). No competitor names or numbers. Customer names only once each is confirmed.

## Still open
Booth number (the video says "Visit our booth"), a real booking link for the QR codes (they point to the homepage with `utm_source=aes2026-banner` style tags), the printer's CMYK profile, and real screen recordings to replace the drawn mockups in the video.
