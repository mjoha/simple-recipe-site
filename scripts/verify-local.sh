#!/usr/bin/env bash
set -euo pipefail

app_url="${APP_URL:-http://localhost:5002}"
log_file="${TMPDIR:-/tmp}/static-markdown-catalog-verify.log"

if curl -fsS --max-time 2 "${app_url}/" >/dev/null 2>&1; then
  echo "Refusing to run verification because ${app_url} is already responding."
  echo "Stop the existing dev server, then run npm run verify again."
  exit 1
fi

npm run build

node ./scripts/serve-dist.mjs >"${log_file}" 2>&1 &
app_pid=$!

cleanup() {
  kill "${app_pid}" 2>/dev/null || true
  wait "${app_pid}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl -fsS --max-time 2 "${app_url}/" >/dev/null 2>&1; then
    curl -fsS --max-time 2 "${app_url}/" >/dev/null
    if ! [ -f "dist/index.html" ]; then
      echo "Generated index.html is missing."
      exit 1
    fi
    if ! node -e 'const fs=require("node:fs");const html=fs.readFileSync("dist/index.html","utf8");if(!html.includes("<details")||!html.includes("id=\"search-input\"")||html.includes("id=\"status\"")){process.exit(1);}'; then
      echo "Generated index.html does not contain expected catalog markup."
      exit 1
    fi
    if ! node -e '
const fs=require("node:fs");
const html=fs.readFileSync("dist/index.html","utf8");
if(!html.includes("<ul class=\"catalog-list\">")||!html.includes("<li ")){process.exit(1);}
const cfg=fs.readFileSync("content/index.md","utf8");
const m=cfg.match(/^groupBy:\s*(\S+)/m);
const hasGroup=m&&m[1]&&m[1].trim().length>0;
if(hasGroup){
  if(!html.includes("class=\"group-section\"")||!html.includes("class=\"group-button\"")||!html.includes("id=\"group-index\"")){process.exit(1);}
}else{
  if(html.includes("class=\"group-section\"")||html.includes("id=\"group-index\"")){process.exit(1);}
}
'; then
      echo "Generated index.html grouping markup does not match content/index.md groupBy configuration."
      exit 1
    fi
    if ! [ -f "dist/styles/site.css" ]; then
      echo "Site stylesheet is missing."
      exit 1
    fi
    if ! [ -f "dist/scripts/search.js" ]; then
      echo "Search enhancement script is missing."
      exit 1
    fi
    if ! [ -f "dist/scripts/router.js" ]; then
      echo "Fragment router script is missing."
      exit 1
    fi
    if ! node -e 'const fs=require("node:fs");const html=fs.readFileSync("dist/index.html","utf8");if(!html.includes("./scripts/router.js")){process.exit(1);}'; then
      echo "Generated index.html does not reference router.js."
      exit 1
    fi
    if ! node -e 'const fs=require("node:fs");const html=fs.readFileSync("dist/index.html","utf8");if(!html.includes("name=\"color-scheme\"")){process.exit(1);}'; then
      echo "Generated index.html is missing color-scheme meta."
      exit 1
    fi
    if ! node -e 'const fs=require("node:fs");const html=fs.readFileSync("dist/index.html","utf8");if(!html.includes("media=\"(prefers-color-scheme: light)\"")||!html.includes("media=\"(prefers-color-scheme: dark)\"")){process.exit(1);}'; then
      echo "Generated index.html is missing theme-color meta for light and dark."
      exit 1
    fi
    if ! node -e 'const fs=require("node:fs");const css=fs.readFileSync("dist/styles/site.css","utf8");if(!css.includes("prefers-color-scheme: dark")){process.exit(1);}'; then
      echo "Site stylesheet is missing dark mode media query."
      exit 1
    fi
    echo "Local verification passed."
    exit 0
  fi

  if ! kill -0 "${app_pid}" 2>/dev/null; then
    echo "The app exited before it became ready. Recent log output:"
    sed -n '1,160p' "${log_file}" || true
    exit 1
  fi

  sleep 1
done

echo "The app did not become ready at ${app_url}. Recent log output:"
sed -n '1,160p' "${log_file}" || true
exit 1
