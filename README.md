# Relay

A novice Sprinklr console. Connect a workspace, then click through guided
modules — tags, care context, boards, reports, and alerts — in plain English.

Tool only. No billing or SKU.

Demo mode needs no Sprinklr tenant.

## Run locally

Postgres 16 and Node 22.

```bash
cp .env.example .env
# default DATABASE_URL: postgresql://tagtruth:tagtruth@localhost:5432/tagtruth
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147) → **Open the demo workspace**.

Demo login: `admin@relay.demo` / `demo`.

Docker: `docker compose up --build`.

## What you should see

1. Home status cards: **Working**, **Needs attention**, **Done**.
2. Taxonomy Autofill’s big button sends a sample message and fills tags.
3. Sure tags show **Done**. Unsure tags ask **Keep / Change**.
4. Every other module has a one-sentence job and a Sample button.

## Modules

| Module | What it does |
| --- | --- |
| Connect | OAuth / API-key wizard, environment, permission checklist |
| Taxonomy Autofill | Category / Brand / Campaign rules, confidence, review, audit CSV |
| Case Sidekick | Order / SKU / CRM on the care case (RECORD_PAGE widget) |
| Board Factory | Stamp a golden board per brand / market |
| Client Pack Exporter | Reporting snapshot CSV |
| Experience-ID Finder | Search boards and experiences by name |
| Publish QA Gate | Draft checklist (banned claims, disclosure) |
| Asset Rights Desk | SAM expiry / off-brand alerts |
| SLA Snitch | Aged case / failed publish alerts |
| Smart Assign | Route by language / VIP / product |
| Profile Enricher | CRM push/pull + suppression sync |
| Access Auditor | Roles, account perms, stale keys |
| Webhook Flight Recorder | Log inbound Sprinklr events |
| Listening Spike Watch | Gated until Sprinklr Support enables Listening |

## Plug one live Sprinklr tenant

Set `SPRINKLR_MODE=live` and fill the Sprinklr vars in `.env`.

| Variable | Why |
| --- | --- |
| `SPRINKLR_CLIENT_ID` / `SPRINKLR_CLIENT_SECRET` | OAuth app on `dev.sprinklr.com` |
| `SPRINKLR_REDIRECT_URI` | Must match the app registration (`/api/oauth/sprinklr/callback`) |
| `SPRINKLR_OAUTH_AUTHORIZE_URL` / `SPRINKLR_OAUTH_TOKEN_URL` | Environment login host |
| `SPRINKLR_BASE_URL` | API host (often `https://api2.sprinklr.com`) |
| `SPRINKLR_API_KEY` | After OAuth; inherits the connecting user’s roles |
| `LISTENING_API_ENABLED` | Leave `false` until Support enables Listening |

**Blockers before a live proof**

- Partner or client admin must complete OAuth.
- Category, Brand, and Campaign custom fields must exist — or run Setup.
- Webhook URL allowlist: `POST /api/webhooks/sprinklr` for Message Received, Message Updated, optional Case Created.
- Listening firehose stays gated until Sprinklr Support turns it on.

## Scripts

- `npm run dev` — app on port 43147
- `npm run build` — production build
- `npx prisma db push && npx tsx prisma/seed.ts` — demo workspace
