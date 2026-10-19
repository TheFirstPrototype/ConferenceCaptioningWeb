#!/bin/bash
# Re-versions every <script src="...analyticsLite.js?v=20261019"> so CDN and browser caches fetch the changed file.
# Usage: ./bump-analytics-version.sh [version]   (default: today as YYYYMMDD)
set -euo pipefail
cd "$(dirname "$0")"

version="${1:-$(date +%Y%m%d)}"
if [[ ! "$version" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "Invalid version: $version" >&2
  exit 1
fi

files=$(grep -rIl --exclude-dir=.git --exclude-dir=node_modules -E "src=[\"'][^\"']*analyticsLite\.js" . || true)
if [ -z "$files" ]; then
  echo "No pages include analyticsLite.js"
  exit 0
fi

echo "$files" | VERSION="$version" xargs perl -pi -e \
  's/(src=["\x27][^"\x27]*analyticsLite\.js)(\?v=[^"\x27]*)?(["\x27])/$1?v=$ENV{VERSION}$3/g'

echo "analyticsLite.js is now ?v=$version in $(echo "$files" | wc -l | tr -d ' ') files. Review with git diff, then commit and push."
