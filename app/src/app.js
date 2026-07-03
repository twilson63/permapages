import * as pageModel from './models/pages.js'
import * as profileModel from './models/profiles.js'
import Async from 'crocks/Async/index.js'
import createPosts from './domains/posts.js'
import getHost from './services/get-host.js'

import {
  compose, pluck, reverse, sortBy, prop, map, path, head,
  isEmpty, identity, propEq
} from 'ramda'


export function posts(env) {
  return createPosts(env)
}

// the $STAMP token lives in an AO process
const STAMP_PROCESS = 'LaC2VtxqGekpRPuJh-TkI_ByAqCS2_KB3YuhMJ5yBtc'

export function loadBalances(addr) {
  const format = (y) => (x) => (Number(x) / y).toFixed(4)

  // STAMP balance: HyperBEAM patched read first (one unsigned GET, no CU),
  // stampjs dryrun as the fallback for nodes/processes without patched state
  const stampBalance = () =>
    fetch(`https://forward.computer/${STAMP_PROCESS}~process@1.0/now/balances/${addr}/serialize~json@1.0`,
      { signal: AbortSignal.timeout(4000) })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .catch(() => import('@permaweb/stampjs')
        .then(({ default: Stamps }) => Stamps.init({ process: STAMP_PROCESS }).balance()))

  // ARIO balance via the AR.IO SDK (HyperBEAM-accelerated internally)
  const arioBalance = () =>
    import('./services/registry.js').then(({ getBalance }) => getBalance(addr))

  return Promise.allSettled([
    fetch(`https://${getHost()}/wallet/${addr}/balance`).then(res => res.text()).then(format(1e12)),
    stampBalance().then(format(1e12)),
    arioBalance().then(n => Number(n).toFixed(2))
  ]).then(([ar, stamp, ario]) => ({
    ar: ar.status === 'fulfilled' ? ar.value : 'NA',
    stamp: stamp.status === 'fulfilled' ? stamp.value : 'NA',
    ario: ario.status === 'fulfilled' ? ario.value : 'NA'
  }))
}

export function widgets({ gql }) {
  async function list() {
    return Async.of(buildWidgetList())
      .map(query => ({ query }))
      .chain(Async.fromPromise(gql))
      //.map(x => (console.log(x), x))
      //.map(pluckNodes)
      .map(pluck('node'))
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
      .map(query => ({ query }))
      .chain(Async.fromPromise(gql))
      .map(pluck('node'))
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

  return {
    get,
    create,
    load
  }
}

export function pages({ register, post, gql, postWebpage, load, postVanilla }) {
  const registerPage = register ? Async.fromPromise(register) : () => Async.of(null)


  async function createVanilla(page, notify) {
    return Async.of(page)
      .chain(pageModel.validate)
      .chain(Async.fromPromise(postVanilla))
      .toPromise()
  }

  //const void = () => null

  async function create(page) {
    return Async.of(page)
      .chain(pageModel.validate)
      .chain(Async.fromPromise(postWebpage))
      .toPromise()
  }

  async function purchase({ name, owner, transactionId }) {
    return registerPage({ name, owner, transactionId }).toPromise()
  }

  async function list(account) {
    return Async.of(account)
      .map(buildPermaPageQuery)
      .map(query => ({ query, variables: {} }))
      .chain(Async.fromPromise(gql))
      .map(pluck('node'))
      //.map(pluckNodes)
      .map(formatPages)
      .toPromise()
  }

  async function get(id) {
    // page meta is embedded in the page HTML itself (base64 <meta> tags),
    // so a single gateway GET is all a read needs — no contract evaluation
    return Async.of(id)
      .chain(Async.fromPromise(load))
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
    history,
    createVanilla
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
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
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
  query($cursor: String) {
    transactions(first: 100, 
      after: $cursor, 
      owners: ["${owner}"], 
      tags:[
        {name: "Content-Type", values: ["text/html"]},
        {name:"Protocol", values:["PermaPages-v0.3", "PermaPages-v0.4", "PermaPages-v0.5"]} 
      ]) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
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
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
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
    return tags.find(propEq(name, 'name'))?.value
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