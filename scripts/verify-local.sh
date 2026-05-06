#!/usr/bin/env bash
set -euo pipefail

app_url="${APP_URL:-http://localhost:5002}"
api_url="${app_url}/api/recipes"
log_file="${TMPDIR:-/tmp}/simple-recipe-site-verify.log"

if curl -fsS --max-time 2 "${app_url}/" >/dev/null 2>&1 || curl -fsS --max-time 2 "${api_url}" >/dev/null 2>&1; then
  echo "Refusing to run verification because ${app_url} is already responding."
  echo "Stop the existing dev server, then run npm run verify again."
  exit 1
fi

dotnet tool restore
docker compose up -d
dotnet ef database update
npm run build
dotnet build

dotnet run --no-build --launch-profile http >"${log_file}" 2>&1 &
app_pid=$!

cleanup() {
  kill "${app_pid}" 2>/dev/null || true
  wait "${app_pid}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl -fsS --max-time 2 "${api_url}" >/dev/null 2>&1; then
    curl -fsS --max-time 2 "${app_url}/" >/dev/null
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
