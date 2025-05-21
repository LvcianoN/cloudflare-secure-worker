# Cloudflare Secure Tunnel Worker

This project implements a secure Cloudflare Worker that authenticates users via Cloudflare Access and displays their email, timestamp, and country of origin. Clicking the country code loads that country's flag using R2 object storage.

## Features

- Protected route: `/secure`
- Enforces Google Identity Provider login via Cloudflare Access
- Displays authenticated user's email
- Shows timestamp of login
- Displays country code (from `cf-ipcountry`) and links to `/secure/{COUNTRY}`
- Serves country flags (SVG) via Cloudflare R2

## Example

Visiting `/secure` as an authenticated user shows:

narnomx@gmail.com authenticated at 2025-05-21T05:53:39.314Z from [MX]

Clicking `[MX]` takes you to `/secure/MX` and renders the Mexican flag served from R2.

## Tech Stack

- Cloudflare Workers
- Wrangler CLI
- Cloudflare Access (OIDC with Google)
- Cloudflare R2 (object storage)
- GitHub for source control

## Deployment

Ensure you have `wrangler` installed and authenticated:

```bash
npm install -g wrangler
To deploy:

npm run deploy
Project Structure
.
├── wrangler.jsonc          # Worker configuration (routes, bindings)
├── src/
│   └── index.js            # Main Worker logic
└── country-flags/          # Local flag assets (before uploading to R2)
Notes
All flags are stored as .svg files in an R2 bucket named country-flags

JWTs from Cloudflare Access are decoded via cf-access-authenticated-user-email header

Email fallback is unknown@example.com when unauthenticated

Cloudflare Access protects both /secure and /secure/*

License
MIT