#!/usr/bin/env bash
set -euo pipefail

# Bootstrap a DigitalOcean Droplet for LLM Gateway.
# Run as root on a fresh Ubuntu 24.04 droplet:
#   curl -fsSL https://raw.githubusercontent.com/YOUR_GITHUB_USER/project-gallery-2/main/deploy/droplet-bootstrap.sh | bash
#
# Or copy this script to the droplet and run manually after cloning the repo.

REPO_URL="${REPO_URL:-https://github.com/YOUR_GITHUB_USER/project-gallery-2.git}"
APP_DIR="${APP_DIR:-/opt/llm-gateway}"

echo "==> Installing Docker..."
apt-get update -qq
apt-get install -y -qq ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> Cloning application..."
mkdir -p "$(dirname "$APP_DIR")"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

if [ ! -f .env ]; then
  echo "==> Creating .env from template — edit this before going live!"
  cp .env.example .env
  sed -i "s/llm-gateway.example.com/$(curl -s ifconfig.me 2>/dev/null || echo 'your-domain.com')/g" .env
fi

echo "==> Building and starting services..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "Deployment started. Next steps:"
echo "  1. Point your domain's A record to this droplet's IP"
echo "  2. Edit $APP_DIR/.env with your DOMAIN and ACME_EMAIL"
echo "  3. Restart: docker compose -f docker-compose.prod.yml up -d"
echo "  4. Check logs: docker compose -f docker-compose.prod.yml logs -f"