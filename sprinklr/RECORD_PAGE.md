# Relay Case Sidekick — Sprinklr RECORD_PAGE

Case Sidekick is a Relay surface, not a separate product. It mounts on the
Sprinklr **case record page** so the agent sees order / SKU / CRM next to the thread.

## Custom App (create-sprinklr-app)

Register a Custom App on `dev.sprinklr.com` (or the tenant developer portal):

1. App name: **Relay Case Sidekick**
2. Entity: **CASE**
3. Placement: **RECORD_PAGE** (record-page override / right rail)
4. URL: `https://<your-host>/widget/case?caseId={{case.id}}`
5. Size: 380px wide, full height
6. Auth: inherit the logged-in Sprinklr user (API key inherits their roles)

Manifest checked in: `sprinklr/case-sidekick.manifest.json`.

## Demo without a live tenant

- `/widget/case` — iframe-ready chrome (no Relay admin shell)
- `/app/sidekick` — same widget inside the Relay app

`SPRINKLR_MODE=demo` or `mock` uses the mock CRM / OMS panel. Live connectors stay stubbed until `CRM_API_URL` / `OMS_API_URL` are set.
