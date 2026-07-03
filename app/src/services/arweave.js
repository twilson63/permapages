import Arweave from 'arweave'
import { parse, htmlify } from './atomic'
import { buildPageTags } from './tags'

import path from 'ramda/src/path'
import pluck from 'ramda/src/pluck'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import getHost from './get-host'

import { Async } from 'crocks'

let _options = {}

_options = { host: getHost(), port: 443, protocol: 'https' }
export const arweave = Arweave.init(_options)

//--- Helper functions
const createDataEntry = data => Async.fromPromise(arweave.createTransaction.bind(arweave))({ data })
const addTags = tags => tx => {
  tags.map(({ name, value }) => tx.addTag(name, value))
  return tx
}

export const upload = async (file, addr) => {
  // check balance
  if ((file.buffer.byteLength + 10000 > 100000)) {
    try {
      const balance = await arweave.wallets.getBalance(addr)
      const { data } = await arweave.api.get(`price/${file.buffer.byteLength + 10000}`)
      if (data > balance) {
        return Promise.reject({ message: 'not enough $AR to upload' })
      }
    } catch (e) {
      return Promise.reject({ message: 'not enough $AR to upload' })
    }
  }
  const tx = await arweave.createTransaction({ data: file.buffer })
  tx.addTag('Content-Type', file.type)

  if (file.buffer.byteLength + 10000 < 100000) {
    const result = await arweaveWallet.dispatch(tx)
    tx.id = result.id
  } else {
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return `https://arweave.net/${tx.id}`

}

export const loadPage = async (id) => {
  const { data } = await arweave.api.get(id)
  if (typeof data === 'string') {
    return parse(data)
  }
  return data
}

export const loadProfile = async (id) => {
  const { data } = await arweave.api.get(id)
  return data
}

export const load = async (id) => {
  const { data } = await arweave.api.get(id)
  if (!data.public) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    data.content = await arweaveWallet.decrypt(
      new Uint8Array(Object.values(data.content)),
      {
        algorithm: "RSA-OAEP",
        hash: "SHA-256",
      }
    )
  }
  return data
}

export const postWebpage = async (page) => {
  const html = htmlify(page)
  const dispatch = Async.fromPromise(window.arweaveWallet.dispatch.bind(window.arweaveWallet))

  // pages are plain signed data items — the wallet's dispatch bundles
  // them via Turbo (free under 100KiB), no contract registration needed
  return createDataEntry(html)
    .map(addTags(buildPageTags(page)))
    .chain(dispatch)
    .map(prop('id'))
    .toPromise()
}

// make generic way to deploy to arweave....
export const postProfileTx = async (profile, tags) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify(profile)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaPages')
  map(t => tx.addTag(t.name, t.value), tags)
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {

    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const postPageTx = async (page) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify(page),
    // Free to create notes
    // target: holder,
    // quantity: arweave.ar.arToWinston(FEE)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaPages')
  tx.addTag('Protocol', page.protocol)
  tx.addTag('Page-Title', page.title)
  // tx.addTag('Description', page.description)
  // tx.addTag('Type', 'page')
  tx.addTag('Page-Code', page.code)
  tx.addTag('Status', page.status)
  tx.addTag('Webpage', page.webpage)
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {
    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const postTx = async (note) => {

  // encrypt content if private
  if (!note.public) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    note.content = await arweaveWallet.encrypt(note.content, {
      algorithm: 'RSA-OAEP',
      hash: 'SHA-256'
    })
  }

  const tx = await arweave.createTransaction({
    data: JSON.stringify(note),
    // Free to create notes
    // target: holder,
    // quantity: arweave.ar.arToWinston(FEE)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  tx.addTag('Note-Title', note.title)
  tx.addTag('Description', note.description)
  tx.addTag('Note-Topic', note.topic)
  tx.addTag('Note-Rev', note.rev)
  tx.addTag('Note-Public', note.public ? "true" : "false")
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {
    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const myNotes = async () => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const owner = await arweaveWallet.getActiveAddress()
  const result = await arweave.api.post('graphql', {
    query: `
query {
  transactions(owners: ["${owner}"], tags: { name: "Protocol", values: ["PermaNotes-v0.1"]}) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
  }
}
    `
  })
  return pluck('node', path(['data', 'data', 'transactions', 'edges'], result))
}

export const gql = (query) => arweave.api.post('graphql', { query })

export const waitfor = async (txId) => {
  let count = 0;
  let foundPost = null;

  while (!foundPost) {
    count += 1;
    console.log(`attempt ${count}`);
    await delay(2000 * count);
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transaction(id: "${txId}") {
    id
  }
}
    `});

    if (result?.data?.data?.transaction) {
      foundPost = result.data.data.transaction.id === txId;
    }

    if (count > 1) {
      break; // could not find post
    }
  }
  return { id: txId, foundPost }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
