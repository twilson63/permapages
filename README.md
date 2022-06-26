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

* Svelte + Vite
* NodeJS build tool
* Arweave

## Development

```
cd app
yarn
yarn dev
```

## Deployment

> create wallet.json

```
yarn build
npm i -g arkb
arkb deploy dist --use-bundler https://node2.bundlr.network --wallet ../mywallet.json --tag-name DEPLOY --tag-value permapages
```

> NOTE: make sure you have a balance in bundler if not.

```
arkb fund-bundler 0.1 --use-bundler https://node2.bundlr.network --wallet ../mywallet.json
```

Deploy with bundlr

```
npm i -g @bundlr-network/client
bundlr upload-dir ./dist -c arweave -h https://node2.bundlr.network --index-file index.html --no-confirmation -w ../wallet.json 
```


Update ArNS - https://permapages.arweave.dev
