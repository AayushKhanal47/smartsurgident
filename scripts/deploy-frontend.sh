#!/bin/bash
# One-command frontend deploy: builds the Vite app and syncs it straight to
# cPanel over SSH, skipping the manual zip/File-Manager/extract steps.
#
# Usage:
#   ./scripts/deploy-frontend.sh staging       # -> staging.smartsurgident.com
#   ./scripts/deploy-frontend.sh production    # -> smartsurgident.com (live site)
#
# Requires: the "smartsurgident" SSH key already authorized on cPanel
# (Manage SSH Keys), and frontend/.env.production with the correct
# VITE_API_URL already in place.
set -euo pipefail

TARGET="${1:-}"
REMOTE_USER="smartsurgident"
REMOTE_HOST="smartsurgident.com"

case "$TARGET" in
  staging)
    REMOTE_DIR="/home/smartsurgident/staging.smartsurgident.com/"
    LIVE_URL="https://staging.smartsurgident.com"
    ;;
  production)
    REMOTE_DIR="/home/smartsurgident/public_html/"
    LIVE_URL="https://smartsurgident.com"
    ;;
  *)
    echo "Usage: $0 [staging|production]"
    exit 1
    ;;
esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../frontend"

echo "==> Building frontend ($TARGET)..."
cd "$FRONTEND_DIR"
npm run build

echo "==> Deploying to $TARGET ($REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR)..."
rsync -avz --delete \
  --exclude ".htaccess" \
  --exclude "cgi-bin/" \
  --exclude ".well-known/" \
  dist/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

echo "==> Done. Live at: $LIVE_URL"
