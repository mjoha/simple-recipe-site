#!/usr/bin/env bash
set -euo pipefail

app_url="${APP_URL:-http://localhost:5002}"
log_file="${TMPDIR:-/tmp}/simple-recipe-site-verify.log"

if curl -fsS --max-time 2 "${app_url}/" >/dev/null 2>&1; then
  echo "Refusing to run verification because ${app_url} is already responding."
  echo "Stop the existing dev server, then run npm run verify again."
  exit 1
fi

npm run build
node ./scripts/serve-wwwroot.mjs >"${log_file}" 2>&1 &
app_pid=$!

cleanup() {
  kill "${app_pid}" 2>/dev/null || true
  wait "${app_pid}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl -fsS --max-time 2 "${app_url}/" >/dev/null 2>&1; then
    curl -fsS --max-time 2 "${app_url}/" >/dev/null
    if ! [ -f "wwwroot/index.html" ]; then
      echo "Generated index.html is missing."
      exit 1
    fi
    if ! node -e 'const fs=require("node:fs");const html=fs.readFileSync("wwwroot/index.html","utf8");if(!html.includes("<details")||!html.includes("letter-")){process.exit(1);}'; then
      echo "Generated index.html does not contain expected catalog markup."
      exit 1
    fi
    if ! [ -f "wwwroot/styles/site.css" ]; then
      echo "Site stylesheet is missing."
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
