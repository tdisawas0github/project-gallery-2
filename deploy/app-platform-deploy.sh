#!/usr/bin/env bash
set -euo pipefail

# Deploy to DigitalOcean App Platform using doctl.
# Prerequisites:
#   brew install doctl   (or see https://docs.digitalocean.com/reference/doctl/)
#   doctl auth init
#
# Usage:
#   ./deploy/app-platform-deploy.sh create   # first deploy
#   ./deploy/app-platform-deploy.sh update   # update existing app

SPEC_FILE=".do/app.yaml"
APP_NAME="llm-gateway"

if ! command -v doctl &>/dev/null; then
  echo "Error: doctl is not installed. Install from https://docs.digitalocean.com/reference/doctl/"
  exit 1
fi

if grep -q "YOUR_GITHUB_USER" "$SPEC_FILE"; then
  echo "Error: Edit $SPEC_FILE and replace YOUR_GITHUB_USER with your GitHub username first."
  exit 1
fi

ACTION="${1:-create}"

case "$ACTION" in
  create)
    echo "Creating App Platform app..."
    doctl apps create --spec "$SPEC_FILE"
    echo "Done. Check status: doctl apps list"
    ;;
  update)
    APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | awk -v name="$APP_NAME" '$2 == name {print $1; exit}')
    if [ -z "$APP_ID" ]; then
      echo "Error: App '$APP_NAME' not found. Run with 'create' first."
      exit 1
    fi
    echo "Updating app $APP_ID..."
    doctl apps update "$APP_ID" --spec "$SPEC_FILE"
    echo "Done. Triggering deployment..."
    doctl apps create-deployment "$APP_ID"
    ;;
  status)
    APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | awk -v name="$APP_NAME" '$2 == name {print $1; exit}')
    doctl apps get "$APP_ID"
    ;;
  *)
    echo "Usage: $0 {create|update|status}"
    exit 1
    ;;
esac