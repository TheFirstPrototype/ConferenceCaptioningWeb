#!/usr/bin/env python3
"""Copies ../languageData.json into the offline fallback block of shareables/index.html.

The page normally fetches ../languageData.json. When it is opened straight from disk (file://) browsers
block that fetch, so the page falls back to this inline copy. Run this after editing languageData.json.
"""
import json, pathlib, re

here = pathlib.Path(__file__).resolve().parent
data = json.loads((here.parent / "languageData.json").read_text(encoding="utf-8"))
page = here / "index.html"
html = page.read_text(encoding="utf-8")
blob = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
html, n = re.subn(r'(<script type="application/json" id="languageDataFallback">).*?(</script>)',
                  lambda m: m.group(1) + blob + m.group(2), html, flags=re.S)
assert n == 1, "fallback block not found"
page.write_text(html, encoding="utf-8")
print(f"Updated fallback with {len(data)} languages")
