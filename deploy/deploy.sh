#!/bin/bash
set -e
cd /opt/modu-nongbu
git fetch origin main
git reset --hard origin/main
aws ssm get-parameters-by-path --path /modu-nongbu/prod --with-decryption --region ap-northeast-2 \
  --query "Parameters[].{Name:Name,Value:Value}" --output json | \
  node deploy/render-env.js > .env.production
chmod 600 .env.production
npm ci
npm run build
sudo systemctl restart modu-nongbu
