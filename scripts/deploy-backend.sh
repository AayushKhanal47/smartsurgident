#!/bin/bash
# One-command backend deploy: pulls the latest pushed commit on the server,
# rebuilds it, and restarts the Node app — replaces the manual SSH session
# of git pull + npm install + npm run build + kill -9 <pid>.
#
# Usage: ./scripts/deploy-backend.sh
#
# Requires: your latest backend changes already pushed to GitHub (main),
# and the "smartsurgident" SSH key already authorized on cPanel.
set -euo pipefail

REMOTE_USER="smartsurgident"
REMOTE_HOST="smartsurgident.com"
REPO_DIR="/home/smartsurgident/repositories/smartsurgident"
BACKEND_DIR="$REPO_DIR/backend"
NODE_BIN_DIR="/home/smartsurgident/nodevenv/repositories/smartsurgident/backend/20/bin"

echo "==> Pulling latest code, installing, and building on the server..."
ssh "$REMOTE_USER@$REMOTE_HOST" bash -s <<EOF
set -e
cd "$REPO_DIR"
git pull origin main
source "$NODE_BIN_DIR/activate"
cd "$BACKEND_DIR"
npm install
npm run build
EOF

echo "==> Restarting the app (killing current process so it respawns fresh)..."
# NOTE: pgrep -f matches against the full command line of every process,
# including this very ssh command's own argv (which contains the search
# pattern as literal text) — an unanchored pattern self-matches the shell
# running this command, and `kill -9` sends SIGKILL to itself before ever
# reaching the real target, silently no-op'ing the intended restart. The
# actual app process's argv0 is rewritten to start with "lsnode:", so a
# leading ^ anchor excludes our own non-matching (e.g. "bash -c ...") argv.
ssh "$REMOTE_USER@$REMOTE_HOST" \
  "pid=\$(pgrep -f '^lsnode:$BACKEND_DIR/'); if [ -n \"\$pid\" ]; then kill -9 \$pid; echo killed \$pid; else echo 'no running process found (will spawn on next request)'; fi"

echo "==> Done. Verify: curl https://api.smartsurgident.com/api/health"
