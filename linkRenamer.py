import glob
import re
import os

# Pattern to find links
pattern = re.compile(r'(a\s+href="https://app\.conferencecaptioning\.com)(.*?)"')

# Loop through files like index-es.html, index-fr.html, ...
for filepath in glob.glob("index-*.html"):
    filename = os.path.basename(filepath)
    # Extract lang code from filename -> index-es.html -> es
    lang_code = filename.split("-")[1].split(".")[0]

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace every matching link with the lang code
    new_content = pattern.sub(rf'\1?lang={lang_code}"', content)

    # Write back only if changes happened
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {filename}")
    else:
        print(f"No changes needed: {filename}")
