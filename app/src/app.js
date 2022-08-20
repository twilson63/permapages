import * as pageModel from './models/pages.js'
import * as profileModel from './models/profiles.js'
import Async from 'crocks/Async/index.js'

import {
  compose, pluck, reverse, sortBy, groupBy, prop, map, path, head,
  isEmpty, identity, propEq, assoc, has,
  values, reduce, find, keys
} from 'ramda'

export function widgets({ gql }) {
  async function list() {
    return Async.of(buildWidgetList())
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatWidgets)
      .toPromise()
  }

  return { list }
}

export function profiles({ gql, post, load }) {
  const deployProfile = post ? Async.fromPromise(post) : () => Async.of(null)

  async function get(addr) {
    return Async.of(addr)
      .map(buildProfileQry)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .chain(nodes => isEmpty(nodes) ? Async.Rejected(null) : Async.Resolved(nodes))
      .map(formatProfiles)
      .map(head)
      .chain(({ id }) => Async.fromPromise(load)(id))
      .toPromise().catch(identity)

  }

  async function create(profile) {
    return Async.of(profile)
      .chain(profileModel.validate)
      // confirm user owns this profile name
      .map(profile => ({ profile, tags: profileModel.createTags(profile) }))
      .chain(({ profile, tags }) => deployProfile(profile, tags).map(({ id }) => ({ ...profile, id })))
      .toPromise()
  }

  async function stamps(addr) {
    return Async.fromPromise(fetch)('https://cache.permapages.app/aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA')
      .chain(res => Async.fromPromise(res.json.bind(res))())
      .map(prop('stamps'))
      .map(values)
      .map(reverse)
      .map(groupBy((s) => s.address))
      .map(stampers => reduce((a, x) => [
        ...a,
        {
          stamper: x,
          count: stampers[x].length,
          assets: stampers[x].map(prop('asset'))
          // assets: stampers[x].map((o) => ({ asset: o.asset, timestamp: o.timestamp })), Need this to add timestamp
        },
      ], [], keys(stampers)
      ))
      .map(find(propEq('stamper', addr)))
      .map(prop('assets'))
      .map(buildAssetQuery)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(map(tx => ({
        id: tx.id,
        title: find(propEq('name', 'Page-Title'), tx.tags).value
      })))
      .toPromise()
  }

  return {
    get,
    create,
    load,
    stamps
  }
}

export function pages({ register, post, gql, postWebpage, load, loadState }) {
  const deployPage = post ? Async.fromPromise(post) : () => Async.of(null)
  const registerPage = register ? Async.fromPromise(register) : () => Async.of(null)


  //const void = () => null

  async function create(page, notify) {
    // 1. generate web page
    // 2. generate source
    // 3. generate meta.json
    // 4. create path.manifest
    // 5. mint contract
    return Async.of(page)
      .map(page => has('code', page) ? page : assoc('code', crypto.randomUUID(), page))
      .chain(pageModel.validate)
      .map(x => (console.log(x), x))
      .chain(page =>
        Async.of(page).map(({ title, owner, code, description, widgets, html, theme, includeFooter, state }) => ({
          title,
          html: htmlTemplate(title, owner, code, description, widgets, html, theme, includeFooter),
          state,
          owner,
          code
        })).chain(Async.fromPromise(postWebpage))
          .map((id) => ({ ...page, webpage: id }))
      )
      .map(_ => (notify({ step: 1, message: 'generating page' }), _))
      .chain(page => deployPage(page).map(({ id }) => ({ ...page, id })))
      .map(_ => (notify({ step: 2, message: 'deploying page' }), _))
      .toPromise()
  }

  async function purchase({ name, owner, transactionId }) {
    return registerPage({ name, owner, transactionId }).toPromise()
  }

  async function list(account) {
    return Async.of(account)
      .map(buildPermaPageQuery)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatPages)
      .toPromise()
  }

  async function get(id) {
    return Async.of(id)
      .chain(Async.fromPromise(load))
      .chain(page => Async.fromPromise(loadState)(page.webpage)
        .map(state => assoc('state', state, page))
      )
      // validate page 
      .chain(pageModel.validate)
      .toPromise()
  }

  async function history() {
    return Async.of()
      .map(buildDeployHx)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .toPromise()
  }

  async function mostRecentPages() {
    return Async.of()
      .map(buildFeed)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatPages)
      .toPromise()
  }
  return {
    purchase,
    create,
    list,
    get,
    history
  }
}

function buildProfileQry(addr) {
  return `
query {
  transactions(
    first : 100,
    owners: ["${addr}"],
    tags: [
      { name: "Protocol", values: ["PermaProfile-v0.1"]}
    ]
  ) {
    edges {
      node {
        id
        owner {
          address
        },
        tags {
          name
          value
        }
      }
    }
  }
}  
  `
}

function buildAssetQuery(assets) {
  return `
query {
  transactions(
    first: 100,
    ids: [${assets.map(a => `"${a}"`).join(',')}]) {
    edges {
      node {
        id
        owner {
          address
        },
        tags {
          name
          value
        }
      }
    }
  }
}
  `
}

function buildDeployHx() {
  return `
query {
  transactions(tags: [
    {name:"DEPLOY", values:["permapages"]},
    {name:"Content-Type", values:["application/x.arweave-manifest+json"]}
  ]) {
    edges {
      node {
        id
      }
    }
  }
}
  `
}

function formatPages(nodes) {
  return compose(
    reverse,
    sortBy(prop("timestamp")),
    map(pageModel.txToPage)
  )(nodes)
}

function formatProfiles(nodes) {
  return compose(
    reverse,
    sortBy(prop("timestamp")),
    map(profileModel.txToProfile)
  )(nodes)
}


function pluckNodes(results) {
  return compose(
    pluck('node'),
    path(['data', 'data', 'transactions', 'edges'])
  )(results)
}

function htmlTemplate(title, owner, code, description, widgets, body, theme = "default", includeFooter) {

  return `<!doctype html>
<html${theme === 'default' ? '' : ` data-theme="${theme}"`}>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="author" content="${owner}">
    <meta name="code" content="${code}">
    <meta name="description" content="${description}">
    <meta name="about" content="Webpage generated by https://pages.arweave.dev">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@2.15.4/dist/full.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/github-dark.min.css">

    <script src="https://cdn.tailwindcss.com/3.1.3?plugins=typography"></script> 
    <script src="https://unpkg.com/arweave@1.11.4/bundles/web.bundle.min.js"></script>
    <script src="https://unpkg.com/warp-contracts@1.1.3/bundles/web.bundle.min.js"></script>
    <!-- custom build of highlight js -->
    <script src="https://arweave.net/_d-GsX52lw7Sdg8hgKKWf_lLohaQ8f4zIYmXxHWMgQc"></script>
    <script src="https://unpkg.com/highlightjs-svelte@1.0.6/dist/svelte.min.js"></script>
    <script type="module">hljs.highlightAll();</script>

    ${widgets.reduce((a, w) => a + `<script defer type="module" src="${w.source}"></script>`, '')}
  </head>
  <body>

  ${widgets.length > 0 ? `
  <div id="widget-connector"></div>
  <script defer type="module" src="https://arweave.net/tnnm13K86GcOhtkilZAk3DZeJeHSCZNj7cDTpnZ1lw8"></script>
  ` : ''} 
  
  
    <main class="bg-base-100">
      ${body}
    </main>
    ${includeFooter ? `
    <footer class="footer p-10 bg-base-300 text-base-content">
      <div>
        <span class="footer-title">About</span> 
        <p>Built using <a href="https://permapages.app" target="_blank">Permapages</p>
        <a class="link link-hover" href="https://permanotes.app/#/notes/WYfC1LPyHJlHrTaN11QS_9-rDMXW0EREqp3FlYKzIWE">Documentation</a>
      </div> 
      <div>
        <span class="footer-title">Connect</span> 
        <a target="_blank" href="https://twitter.com/permapages" class="link link-hover">Twitter</a> 
        <a target="_blank" href="https://github.com/twilson63/permapages"class="link link-hover">Github</a> 
      </div> 
      <div>
        <span class="footer-title text-2xl">🚀</span> 
        <div class="flex flex-col">
          <a href="https://permapages.app" class="btn rounded-2xl font-bold bg-black text-white">👉 Create your own Permapage here 🚀</a>
          <br />
          <p class="text-accent">Lets get started!</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <img class="h-[128px] w-[128px]" src="https://permapages.app/permapages_logo.svg" alt="logo" />
        <img class="" src="https://permapages.app/ar-dark.png" alt="logo" />
      </div>
    </footer>
    ` : ''}
    
    
  </body>
</html>  
`
}

function buildFeed() {
  return `
query {
  transactions(first: 100, tags:{name:"Protocol", values:["PermaPages-v0.3"]}) {
    edges {
      node {
        id
        owner{
          address
        }
        tags {
          name 
          value 
        }
        data {
          size
        }
        block {
          id
        }
      }
    }
  }
}  
  `
}


function buildPermaPageQuery(owner) {
  return `
  query {
    transactions(first: 100, owners: ["${owner}"], 
      tags:{name:"Protocol", values:["PermaPages-v0.3"]}) {
      edges {
        node {
          id
          owner{
            address
          }
          tags {
            name 
            value 
          }
          data {
            size
          }
          block {
            id
          }
        }
      }
    }
  }
  `
}

function buildWidgetList() {
  return `
query {
  transactions(first: 100, tags: [
    { name: "Content-Type", values: ["application/javascript"]},
    { name: "App-Name", values: ["Permapage-Widget"]},
    { name: "App-Version", values: ["0.0.1"]}
  ]) {
    edges {
      node {
        id
        tags {
          name 
          value 
        }
      }
    }
  }
}
  `
}

function getTag(tags) {
  return function (name) {
    return tags.find(propEq('name', name))?.value
  }

}

function formatWidgets(nodes) {
  return map(({ id, tags }) => ({
    source: `https://arweave.net/${id}`,
    elementId: getTag(tags)('Widget-Id'),
    name: getTag(tags)('Widget-Name'),
    description: getTag(tags)('Widget-Desc'),
    version: getTag(tags)('Widget-Version'),
    docs: getTag(tags)('Widget-Docs')
  }), nodes)
  //.filter(has('elementId'))
}