<h1 align="center">PERMAPAGES</h1>
<p>Web3 Personal Space</p>
<p>Create incredible personal pages for your Web3 experience on the Permaweb</p>

---

## Table of Contents

- [Benefits](#benefits)
- [Features](#features)
- [Stack](#stack)
- [Development](#development)

---

## Benefits

- Publish fantastic web3 pages with not code
- Zero cost to build and manage pages smaller than 100k
- Use rich widgets to create web3 pages that come to life

## Features

* Decentralized on Arweave
* Markdown - write your pages using markdown
* Widget library 
* 29 Themes
* Design and build your own widgets

## Stack

* Svelte 4 + Vite 5 (Node >= 18, npm)
* Arweave — pages publish as signed data items via the Wander wallet's `dispatch()` (bundled through Turbo, free under 100KB)
* AO / HyperBEAM — state reads via HyperBEAM patched HTTP paths, AO dryrun as fallback
* ArNS via `@ar.io/sdk` v3 (AO era — do not bump to v4, which targets Solana)

## Development

All commands run from the `app/` directory (the repo root has no package.json):

```
cd app
npm ci        # install from the committed package-lock.json
npm run dev   # vite dev server
npm run build # production build to dist/
npx vitest run
```

> If you previously installed with yarn or are switching to this branch from an
> older checkout, delete `app/node_modules` first — the dependency tree changed
> substantially (warp/smartweave/bundlr removed).

## Deployment

> create wallet.json in the repo root (never commit it)

```
cd app
npm run build
DEPLOY_KEY=$(base64 -i ../wallet.json) npm run deploy   # permaweb-deploy → updates the ArNS name
```

Live at https://permapages.arweave.net
