<h1 align="center">PERMANOTES</h1>
<p>Permanotes is an application that allows you to store personal notes and share public notes.</p>
<p>Pay once to create a private note and access it forever.</p>
<p>Publish your thoughts and opinions to the world with one simple payment.</p>

---

## Table of Contents

- [Benefits](#benefits)
- [Features](#features)
- [Stack](#stack)
- [Development](#development)

---

## Benefits

- Always be able to access your notes forever
- Earn by creating great content

## Features

* Decentralized on Arweave
* Markdown - write your notes using markdown
* Likes - You can like a note or a user can like your public note
* Fork note - you can fork a public or private note you created to modify or improve or go from draft to public.

### Coming Soon

* Search Notes - ability to search notes
* Favorites - by liking a note, you can add it to your favorites list
* Topics - you can organize notes by topics
* Follow Users - you can follow users access public notes feed
* Subscribe to specific topics - by subscribing to a topic you can view all the public notes created for that topic
* Upload Assets for your notes - Want to add a image or document to your note, upload it as an asset then link to it via markdown links
* Add Grammarly to note editing

* _JSON RSS Feeds for public notes (using deno deploy) - Not 100% decentralized, but could be fun._
* _Delete Note From App_


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
arkb deploy dist --use-bundler https://node2.bundlr.network --wallet ../mywallet.json --tag-name DEPLOY --tag-value permanotes
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


next update deploy

https://dash.deno.com/projects/permanotes

Add the new TxId
