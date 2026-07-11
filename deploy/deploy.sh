#!/usr/bin/env bash
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_HOST="${DEPLOY_HOST:-cryptoagentsadp.xyz}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/cryptoagentsadp}"
SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "========================================"
echo " CryptoAgentsADP Deployment"
echo " Domain: cryptoagentsadp.xyz"
echo "========================================"

echo "[1/5] Building frontend..."
cd "$APP_DIR/frontend"
npm ci --omit=dev --ignore-scripts 2>/dev/null || npm install --omit=dev
npm run build

echo "[2/5] Copying frontend build to backend/public..."
rm -rf "$APP_DIR/backend/public"
cp -r "$APP_DIR/frontend/dist" "$APP_DIR/backend/public"

echo "[3/5] Installing backend production dependencies..."
cd "$APP_DIR/backend"
npm ci --omit=dev --ignore-scripts 2>/dev/null || npm install --omit=dev

echo "[4/5] Deploying to ${DEPLOY_HOST}:${DEPLOY_PATH} ..."
rsync -avz --delete \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude '.git' \
  "$APP_DIR/backend/" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

echo "[5/5] Restarting application via PM2..."
ssh -i "$SSH_KEY" "${DEPLOY_USER}@${DEPLOY_HOST}" << 'REMOTESHELL'
cd /var/www/cryptoagentsadp
if pm2 list | grep -q cryptoagentsadp; then
  pm2 restart cryptoagentsadp
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save
REMOTESHELL

echo "========================================"
echo " Deployment complete!"
echo " https://cryptoagentsadp.xyz"
echo "========================================"