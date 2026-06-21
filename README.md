# LLM Gateway

A centralized platform for managing, monitoring, and routing requests to Large Language Models. Built with React + TypeScript frontend and Go backend, following the architecture in `.kilo/plans/PLAN.md`.

## Features

- **Dashboard** — KPI metrics, 24h request volume chart, environment info
- **Models** — Browse available LLM models with capabilities and pricing
- **API Keys** — Create, view, and manage keys with permissions and expiration
- **Routes** — Visual routing configuration with weighted load balancing, fallbacks, and retry policies
- **Logs** — Searchable request logs with request/response detail drawer
- **Analytics** — Charts for latency, errors, success rate, and cost breakdown
- **Providers** — Manage OpenAI, Anthropic, xAI connections and health status
- **Settings** — Gateway configuration and rate limiting

## Quick Start

### Frontend only (mock data)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Full stack with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/health

## Project Structure

```
├── frontend/          # React + Vite + Tailwind CSS admin UI
├── backend/           # Go Admin API (chi router)
├── docker-compose.yml # Frontend, backend, PostgreSQL, Redis
└── .kilo/plans/       # Original plan document
```

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, TypeScript, Vite, Tailwind   |
| Charts   | Recharts                            |
| Backend  | Go, chi router                      |
| Database | PostgreSQL (Docker)                 |
| Cache    | Redis (Docker)                      |

## Deploy to DigitalOcean

Two options are included. **App Platform** is recommended — managed hosting, auto HTTPS, and zero server maintenance.

### Option 1: App Platform (recommended)

Managed deployment with auto-scaling, HTTPS, and managed PostgreSQL + Redis.

1. **Push the repo to GitHub**

```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin git@github.com:YOUR_USER/project-gallery-2.git
git push -u origin main
```

2. **Edit the app spec** — open `.do/app.yaml` and replace `YOUR_GITHUB_USER/project-gallery-2` with your repo.

3. **Deploy via the control panel**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click **Create App** → **GitHub** → select your repo
   - Choose **Use existing app spec** and point to `.do/app.yaml`
   - Review components (frontend static site, backend service, Postgres, Redis) and click **Create Resources**

   Or deploy with the CLI:

```bash
brew install doctl
doctl auth init
./deploy/app-platform-deploy.sh create
```

4. **Add a custom domain** (optional) in the App Platform dashboard under your app → **Settings** → **Domains**.

The ingress routes `/` to the React frontend and `/api` to the Go backend. Managed databases are provisioned automatically.

**Estimated cost:** ~$17–27/mo (basic-xxs backend + static site + dev databases).

---

### Option 2: Droplet (VPS)

Full control on a single VPS with Docker Compose and automatic HTTPS via Caddy.

1. **Create a Droplet** — Ubuntu 24.04, at least 2 GB RAM, in your preferred region.

2. **Point your domain** — Add an A record pointing to the droplet IP.

3. **SSH in and deploy**

```bash
git clone git@github.com:YOUR_USER/project-gallery-2.git /opt/llm-gateway
cd /opt/llm-gateway
cp .env.example .env
# Edit .env: set DOMAIN, ACME_EMAIL, and POSTGRES_PASSWORD
docker compose -f docker-compose.prod.yml up -d --build
```

   Or use the bootstrap script on a fresh droplet:

```bash
REPO_URL=https://github.com/YOUR_USER/project-gallery-2.git bash deploy/droplet-bootstrap.sh
```

4. **Verify** — visit `https://your-domain.com` and check `https://your-domain.com/api/health`.

**Estimated cost:** ~$12–24/mo (basic droplet).