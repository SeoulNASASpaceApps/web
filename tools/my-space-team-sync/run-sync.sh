#!/usr/bin/env bash
set -euo pipefail
# Preparation only: this file does not register a cron job.
repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
: "${SYNC_WORK_DIR:?Set a private absolute working directory}"
[[ "$SYNC_WORK_DIR" = /* ]] || exit 1
umask 077
mkdir -p "$SYNC_WORK_DIR"
exec 9>"$SYNC_WORK_DIR/run.lock"
flock -n 9 || exit 0
snapshot_path="$SYNC_WORK_DIR/seoul-$(date -u +%Y%m%dT%H%M%SZ).json"
python3 "$repo_root/tools/my-space-team-sync/collect_seoul_teams.py" --output "$snapshot_path"
node "$repo_root/tools/my-space-team-sync/normalize-snapshot.mjs" "$snapshot_path" "$snapshot_path.normalized.json"
# Writes only when explicitly enabled against a selected persistent DB.
if [[ "${SYNC_APPLY:-0}" = 1 ]]; then
  : "${HUB_DB_PATH:?Select an existing persistent database after reviewing its schema}"
  node "$repo_root/apps/my-space/auth-backend/data-tools.mjs" teams "$snapshot_path.normalized.json" --apply
fi
